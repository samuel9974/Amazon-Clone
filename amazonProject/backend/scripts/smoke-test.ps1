# End-to-end smoke test for the Amazon-clone backend.
# Walks the happy path against a running server + seeded MySQL.
# Prints PASS or FAIL per step. Exits non-zero on first failure.
#
# Usage:
#   .\smoke-test.ps1
#   .\smoke-test.ps1 -BaseUrl http://localhost:5001/api

param(
  [string] $BaseUrl    = 'http://localhost:5001/api',
  [string] $AdminEmail = 'admin@amazon.local',
  [string] $AdminPass  = 'admin123'
)

$ErrorActionPreference = 'Stop'
$script:Step = 0
$script:Pass = 0
$script:Fail = 0

function Invoke-Step {
  param([string] $Name, [scriptblock] $Body)
  $script:Step++
  $label = '[' + $script:Step.ToString().PadLeft(2) + '] ' + $Name
  Write-Host $label -NoNewline
  try {
    $result = & $Body
    Write-Host '  PASS' -ForegroundColor Green
    $script:Pass++
    return $result
  } catch {
    Write-Host '  FAIL' -ForegroundColor Red
    Write-Host ('     ' + $_.Exception.Message) -ForegroundColor DarkRed
    if ($_.ErrorDetails) {
      Write-Host ('     ' + $_.ErrorDetails.Message) -ForegroundColor DarkRed
    }
    $script:Fail++
    throw
  }
}

function Call-Api {
  param(
    [string] $Method,
    [string] $Path,
    [object] $Body,
    [string] $Token
  )
  $headers = @{ Accept = 'application/json' }
  if ($Token) { $headers['Authorization'] = 'Bearer ' + $Token }
  $params = @{
    Method  = $Method
    Uri     = $BaseUrl + $Path
    Headers = $headers
  }
  if ($null -ne $Body) {
    $params['Body']        = ($Body | ConvertTo-Json -Depth 8 -Compress)
    $params['ContentType'] = 'application/json'
  }
  Invoke-RestMethod @params
}

function Expect-Status {
  param([int] $Expected, $ErrorRecord)
  $actual = $ErrorRecord.Exception.Response.StatusCode.value__
  if ($actual -ne $Expected) {
    throw ('expected HTTP ' + $Expected + ', got ' + $actual)
  }
}

Write-Host ''
Write-Host 'Amazon clone -- backend smoke test' -ForegroundColor Cyan
Write-Host ('Base URL: ' + $BaseUrl)
Write-Host ''

Invoke-Step 'Health probe' {
  $h = Call-Api -Method Get -Path '/health'
  if ($h.status -ne 'ok') { throw 'unexpected health payload' }
}

$adminToken = Invoke-Step 'Login as seeded admin' {
  $r = Call-Api -Method Post -Path '/auth/login' -Body @{ email = $AdminEmail; password = $AdminPass }
  if (-not $r.token) { throw 'no token returned' }
  if ($r.user.role -ne 'ADMIN') { throw ('expected role ADMIN, got ' + $r.user.role) }
  $r.token
}

$stamp    = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$newEmail = 'smoke' + $stamp + '@test.local'
$newPass  = 'smoke123'

$userToken = Invoke-Step ('Register new user (' + $newEmail + ')') {
  $r = Call-Api -Method Post -Path '/auth/register' -Body @{
    email    = $newEmail
    password = $newPass
    fullName = 'Smoke Test User'
  }
  if (-not $r.token) { throw 'no token returned' }
  if ($r.user.role -ne 'USER') { throw 'expected role USER' }
  $r.token
}

Invoke-Step 'GET /auth/me as new user' {
  $me = Call-Api -Method Get -Path '/auth/me' -Token $userToken
  if ($me.email -ne $newEmail) { throw ('expected ' + $newEmail + ', got ' + $me.email) }
}

Invoke-Step 'Reject bad password' {
  try {
    Call-Api -Method Post -Path '/auth/login' -Body @{ email = $newEmail; password = 'wrong' } | Out-Null
    throw 'should have failed'
  } catch {
    Expect-Status 401 $_
  }
}

$catalog = Invoke-Step 'List products (public)' {
  $r = Call-Api -Method Get -Path '/products?size=5'
  if ($r.items.Count -lt 1) { throw 'no products returned (did you load seed.sql?)' }
  $r
}

$firstProduct = $catalog.items[0]

Invoke-Step ('Get product detail (id=' + $firstProduct.id + ')') {
  $p = Call-Api -Method Get -Path ('/products/' + $firstProduct.id)
  if ($p.id -ne $firstProduct.id) { throw 'wrong product returned' }
}

Invoke-Step 'List categories (public)' {
  $cats = Call-Api -Method Get -Path '/categories'
  if ($cats.Count -lt 1) { throw 'no categories returned' }
}

Invoke-Step 'Reject unauthenticated cart access' {
  try {
    Call-Api -Method Get -Path '/cart' | Out-Null
    throw 'should have failed'
  } catch {
    Expect-Status 401 $_
  }
}

Invoke-Step 'Add product to cart' {
  Call-Api -Method Post -Path '/cart' -Token $userToken -Body @{
    productId = $firstProduct.id
    quantity  = 2
  } | Out-Null
}

Invoke-Step 'Cart shows expected line and total' {
  $c = Call-Api -Method Get -Path '/cart' -Token $userToken
  if ($c.items.Count -ne 1)       { throw ('expected 1 line, got ' + $c.items.Count) }
  if ($c.items[0].quantity -ne 2) { throw ('expected qty 2, got ' + $c.items[0].quantity) }
  $expected = [math]::Round($firstProduct.price * 2, 2)
  $got      = [math]::Round($c.total, 2)
  if ($got -ne $expected) { throw ('total mismatch: expected ' + $expected + ', got ' + $got) }
}

Invoke-Step 'PATCH cart quantity to 3' {
  Call-Api -Method Patch -Path ('/cart/' + $firstProduct.id) -Token $userToken `
    -Body @{ quantity = 3 } | Out-Null
  $c = Call-Api -Method Get -Path '/cart' -Token $userToken
  if ($c.items[0].quantity -ne 3) { throw ('expected qty 3, got ' + $c.items[0].quantity) }
}

$orderId = Invoke-Step 'Place order (snapshot pricing + stock decrement)' {
  $stockBefore = (Call-Api -Method Get -Path ('/products/' + $firstProduct.id)).stock
  $r = Call-Api -Method Post -Path '/orders' -Token $userToken `
    -Body @{ shippingAddress = '123 React Lane, Ethiopia' }
  if (-not $r.orderId) { throw 'no orderId returned' }
  $stockAfter = (Call-Api -Method Get -Path ('/products/' + $firstProduct.id)).stock
  if ($stockBefore - $stockAfter -ne 3) {
    throw ('stock should drop by 3 (before=' + $stockBefore + ', after=' + $stockAfter + ')')
  }
  $r.orderId
}

Invoke-Step 'Cart is empty after checkout' {
  $c = Call-Api -Method Get -Path '/cart' -Token $userToken
  if ($c.items.Count -ne 0) { throw ('cart should be empty, has ' + $c.items.Count + ' items') }
}

Invoke-Step ('GET /orders/' + $orderId + ' returns snapshotted line') {
  $o = Call-Api -Method Get -Path ('/orders/' + $orderId) -Token $userToken
  if ($o.id -ne $orderId)   { throw 'wrong order' }
  if ($o.items.Count -ne 1) { throw ('expected 1 line, got ' + $o.items.Count) }
  if ($o.items[0].unitPrice -ne $firstProduct.price) {
    throw ('snapshot price mismatch: ' + $o.items[0].unitPrice + ' vs ' + $firstProduct.price)
  }
  if ($o.items[0].quantity -ne 3) { throw ('expected qty 3, got ' + $o.items[0].quantity) }
}

Invoke-Step 'Other users cannot see this order' {
  try {
    Call-Api -Method Get -Path ('/orders/' + $orderId) -Token $adminToken | Out-Null
    throw 'admin should get 404 via /api/orders/:id for someone else order'
  } catch {
    Expect-Status 404 $_
  }
}

Invoke-Step 'Reject non-admin hitting /admin' {
  try {
    Call-Api -Method Get -Path '/admin/orders' -Token $userToken | Out-Null
    throw 'should have failed'
  } catch {
    Expect-Status 403 $_
  }
}

$newProductId = Invoke-Step 'Admin creates a product' {
  $p = Call-Api -Method Post -Path '/admin/products' -Token $adminToken -Body @{
    title    = 'Smoke product ' + $stamp
    price    = 9.99
    stock    = 100
    rating   = 4
    imageUrl = 'https://example.com/img.png'
  }
  if (-not $p.id) { throw 'no id returned' }
  $p.id
}

Invoke-Step 'Admin updates the new product' {
  $p = Call-Api -Method Put -Path ('/admin/products/' + $newProductId) -Token $adminToken `
    -Body @{ price = 12.50; stock = 50 }
  if ($p.price -ne 12.50) { throw ('expected price 12.50, got ' + $p.price) }
}

Invoke-Step 'Admin updates order status PENDING to PAID' {
  Call-Api -Method Patch -Path ('/admin/orders/' + $orderId) -Token $adminToken `
    -Body @{ status = 'PAID' } | Out-Null
  $o = Call-Api -Method Get -Path ('/orders/' + $orderId) -Token $userToken
  if ($o.status -ne 'PAID') { throw ('expected PAID, got ' + $o.status) }
}

Invoke-Step 'Admin deletes the new product' {
  Call-Api -Method Delete -Path ('/admin/products/' + $newProductId) -Token $adminToken | Out-Null
  try {
    Call-Api -Method Get -Path ('/products/' + $newProductId) | Out-Null
    throw 'product should be gone'
  } catch {
    Expect-Status 404 $_
  }
}

Write-Host ''
if ($Fail -eq 0) { $color = 'Green' } else { $color = 'Red' }
$summary = 'Result: ' + $Pass + ' passed, ' + $Fail + ' failed (of ' + $Step + ')'
Write-Host $summary -ForegroundColor $color
if ($Fail -gt 0) { exit 1 }
