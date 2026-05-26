# Frontend API layer (Step 1)

All HTTP calls go through **`apiClient.js`** → Express `http://localhost:5001/api`.

## Files

| File | Backend routes |
|------|----------------|
| `apiClient.js` | Shared axios + JWT header + error normalization |
| `catalogApi.js` | `/products`, `/categories` |
| `authApi.js` | `/auth/*` + `AuthContext` (Step 3 ✓) |
| `cartApi.js` | `/cart` (UI in Step 4) |
| `ordersApi.js` | `/orders` (UI in Step 5–7) |
| `paymentsApi.js` | `/payments/*` (UI in Step 6) |
| `adminApi.js` | `/admin/*` (UI in Step 8) |
| `index.js` | Barrel exports |

## Token

- Stored in `localStorage` under key `amazon_token`
- Set automatically after `login()` / `register()`
- Cleared on `logout()` or API `401`

## Env

```env
VITE_API_URL=http://localhost:5001/api
```

## Usage

```js
import { fetchAllProducts, login, getCart } from "../Api/index.js";
// or
import { catalogApi } from "../Api/index.js";
```

## Health check

```js
import { checkApiHealth } from "../Api/apiClient.js";
await checkApiHealth(); // { status: 'ok', database, environment }
```
