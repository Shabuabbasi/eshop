import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./Components/Navbar";
import { ToastContainer } from "react-toastify";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPassword from "./Components/ForgetPassword";
import ResetPassword from "./Components/ResetPassword";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import Profile from "./pages/Profile"; // Dashboard layout using <Outlet />

// Seller dashboard pages
import SellerAllProducts from "./Components/profileComponents/Seller/SellerAllProducts";
import SellerOverview from "./Components/profileComponents/Seller/SellerOverview";
import SellerAddProduct from "./Components/profileComponents/Seller/SellerAddProduct";

// User dashboard pages
import CustomerOverview from "./Components/profileComponents/Customer/CustomerOverview";
import CustomerOrders from "./Components/profileComponents/Customer/CustomerOrders";
import CustomerWishlist from "./Components/profileComponents/Customer/CustomerWishlist";
// Courier dashboard pages
import CourierDeliveries from "./Components/profileComponents/Courier/CourierDeliveries";
import CourierOverview from "./Components/profileComponents/Courier/CourierOverview";


const backendUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/users/profile`, {
          withCredentials: true,
        });
        setUser(data.user);
      } catch (err) {
        setUser(null);
        console.log("Not logged in");
      }
    };

    fetchUser();
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Navbar user={user} setUser={setUser} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage setUser={setUser} user={user} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} user={user} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/product" element={<CategoryPage />} />
        <Route path="/product/:title" element={<ProductDetail />} />

        {/* Shared dashboard layout (sidebar + content) */}
        <Route path="/dashboard" element={<Profile user={user} />}>
          {/* Seller Dashboard Routes */}
          {user?.role === "Seller" && (
            <>
              <Route path="overview" element={<SellerOverview user={user} />} />
              <Route path="add-product" element={<SellerAddProduct />} />
              <Route path="all-products" element={<SellerAllProducts />} />
            </>
          )}

          {/* User Dashboard Routes */}
          {user?.role === "Customer" && (
            <>
              <Route path="overview" element={<CustomerOverview user={user} />} />
              <Route path="orders" element={<CustomerOrders />} />
              <Route path="wishlist" element={<CustomerWishlist />} />
            </>
          )}

          {/* Courier Dashboard Routes */}
          {user?.role === "Courier" && (
            <>
              <Route path="overview" element={<CourierOverview user={user} />} />
              <Route path="deliveries" element={<CourierDeliveries />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
