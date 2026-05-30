/**
 * App.jsx — Browser router + shared layout (LoyOut → Header, Outlet, Footer)
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoyOut from "./compenents/LoyOut/LoyOut.jsx";
import ProtectedRoute from "./compenents/ProtectedRoute.jsx";
import GuestRoute from "./compenents/GuestRoute.jsx";
import Landing from "./Pages/Landing.jsx";
import Cart from "./Pages/Cart.jsx";
import Checkout from "./Pages/Checkout.jsx";
import Orders from "./Pages/Orders.jsx";
import Payment from "./Pages/Payment.jsx";
import ProductDetail from "./Pages/ProductDetail.jsx";
import Results from "./Pages/Results.jsx";
import Login from "./Pages/Auth/Login.jsx";
import Signup from "./Pages/Auth/Signup.jsx";
import NotFound from "./Pages/NotFound.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoyOut />}>
          <Route path="/" element={<Landing />} />
          <Route path="/results" element={<Results />} />
          <Route path="/category/:categoryName" element={<Results />} />
          <Route path="/products/:productId" element={<ProductDetail />} />

          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/payment" element={<Payment />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
