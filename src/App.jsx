import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import ToastContainer from "./components/ToastContainer";
import { checkAuth } from "./store/authSlice";
import authService from "./lib/auth";

/* -------- PAGES -------- */

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const Mens = lazy(() => import("./pages/Mens"));
const Womens = lazy(() => import("./pages/Womens"));
const Kids = lazy(() => import("./pages/Kids"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const AddressForm = lazy(() => import("./components/AddressForm"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Contact = lazy(() => import("./pages/Contact"));
const Help = lazy(() => import("./pages/Help"));
const Terms = lazy(() => import("./pages/Terms"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const Returns = lazy(() => import("./pages/Returns"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));

/* -------- ADMIN PAGES -------- */

const AddProduct = lazy(() => import("./pages/admin/AddProduct"));
const ManageOrders = lazy(() => import("./pages/admin/ManageOrders"));
const ManageProducts = lazy(() => import("./pages/admin/ManageProducts"));
const EditProduct = lazy(() => import("./pages/admin/EditProduct"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

/* -------- ROUTE GUARDS -------- */

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, banned, loading } = useSelector(
    (state) => state.auth
  );

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (banned) return <Navigate to="/" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  /* -------- THEME -------- */
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  /* -------- RESTORE SESSION -------- */
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  /* -------- START SESSION REFRESH -------- */
  useEffect(() => {
    if (isAuthenticated && !loading) {
      authService.startSessionRefresh();
    }
  }, [isAuthenticated, loading]);

  /* -------- GLOBAL AUTH LOADING GATE -------- */
  if (loading) return <Loading />;

  return (
    <>
      <Header />

      <Suspense fallback={<Loading />}>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/mens" element={<Mens />} />
          <Route path="/womens" element={<Womens />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/order-tracking" element={<OrderTracking />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* USER */}
          <Route
            path="/address"
            element={
              <ProtectedRoute>
                <AddressForm />
              </ProtectedRoute>
            }
          />
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
          <Route
            path="/order-history"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
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
            path="/admin/manage-users"
            element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            }
          />
        </Routes>
      </Suspense>

      <Footer />

      <ToastContainer />
    </>
  );
};

export default App;
