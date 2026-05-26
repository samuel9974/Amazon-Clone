/**
 * App.jsx — Browser router + shared layout (LoyOut → Header, Outlet, Footer)
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoyOut from "./compenents/LoyOut/LoyOut.jsx";
import ProtectedRoute from "./compenents/ProtectedRoute.jsx";
import GuestRoute from "./compenents/GuestRoute.jsx";
import Landing from "./Pages/Landing/Landing.jsx";
import Cart from "./Pages/Cart/Cart.jsx";
import Orders from "./Pages/Orders/Orders.jsx";
import Payment from "./Pages/Payment/Payment.jsx";
import ProductDetail from "./Pages/ProductDetail/ProductDetail.jsx";
import Results from "./Pages/Results/Results.jsx";
import Login from "./Pages/Auth/Login.jsx";
import Signup from "./Pages/Auth/Signup.jsx";
import NotFound from "./Pages/NotFound/NotFound.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoyOut />}>
          <Route path="/" element={<Landing />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/results" element={<Results />} />
          <Route path="/category/:categoryName" element={<Results />} />
          <Route path="/products/:productId" element={<ProductDetail />} />

          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route element={<ProtectedRoute />}>
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
