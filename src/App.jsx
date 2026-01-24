import React, { useEffect } from "react";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AddProduct from "./pages/admin/AddProduct";
import ManageOrders from "./pages/admin/ManageOrders";

const App = () => {
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/manage-orders" element={<ManageOrders />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
