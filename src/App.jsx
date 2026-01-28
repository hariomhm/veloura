import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Loading from "./components/Loading";

import { login, setLoading } from "./store/authSlice";
import authService from "./lib/auth";

/* -------- PAGES -------- */

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

/* -------- ADMIN PAGES -------- */

import AddProduct from "./pages/admin/AddProduct";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageBanners from "./pages/admin/ManageBanners";
import ManageProducts from "./pages/admin/ManageProducts";
import EditProduct from "./pages/admin/EditProduct";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminDashboard from "./pages/admin/AdminDashboard";

/* -------- ROUTE GUARDS -------- */

const ProtectedRoute = ({ children }) => {
  const { status } = useSelector((state) => state.auth);
  return status ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { status, isAdmin, banned, loading } = useSelector((state) => state.auth);

  if (loading) return null; // or a loading spinner
  if (!status) return <Navigate to="/login" replace />;
  if (banned) return <Navigate to="/" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

const App = () => {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  /* -------- THEME -------- */
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  /* -------- RESTORE SESSION -------- */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch(login({ userData: user }));
        } else {
          dispatch(setLoading(false));
        }
      } catch {
        // no active session
        dispatch(setLoading(false));
      }
    };
    loadUser();
  }, [dispatch]);

  return (
    <>
      <Header />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/mens" element={<Mens />} />
        <Route path="/womens" element={<Womens />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/order-tracking" element={<OrderTracking />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* USER (PROTECTED) */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* ADMIN (PROTECTED) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage-products"
          element={
            <AdminRoute>
              <ManageProducts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit-product/:productId"
          element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage-orders"
          element={
            <AdminRoute>
              <ManageOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage-banners"
          element={
            <AdminRoute>
              <ManageBanners />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
