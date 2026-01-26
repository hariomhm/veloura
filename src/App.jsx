import React, { useEffect } from "react";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { login } from "./store/authSlice";
import authService from "./lib/auth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Mens from "./pages/Mens";
import Womens from "./pages/Womens";
import Kids from "./pages/Kids";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import UserProfile from "./pages/UserProfile";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import OrderTracking from "./pages/OrderTracking";
import Returns from "./pages/Returns";
import AddProduct from "./pages/admin/AddProduct";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageBanners from "./pages/admin/ManageBanners";
import ManageProducts from "./pages/admin/ManageProducts";
import EditProduct from "./pages/admin/EditProduct";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminDashboard from "./pages/admin/AdminDashboard";

const App = () => {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch(login({ userData: user }));
        }
      } catch (error) {
        // No active session
      }
    };
    loadUser();
  }, [dispatch]);
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/mens" element={<Mens />} />
        <Route path="/womens" element={<Womens />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/manage-products" element={<ManageProducts />} />
        <Route path="/admin/edit-product/:productId" element={<EditProduct />} />
        <Route path="/admin/manage-orders" element={<ManageOrders />} />
        <Route path="/admin/manage-banners" element={<ManageBanners />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
