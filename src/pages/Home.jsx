import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaTruck,
  FaAward,
  FaShoppingCart,
} from "react-icons/fa";

import { fetchProducts } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";
import config from "../config";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featuredProducts = useMemo(
    () => products.slice(0, 4),
    [products]
  );

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product }));
  };

  const getImageUrl = (product) => {
    return product.image || "/placeholder.png";
  };

  return (
    <>
      {/* ================= HERO BANNERS ================= */}
      <section className="w-full">
        <Link to="/products">
          <img
            src="/bannerImage.png"
            alt="Shop All"
            className="w-full h-[90vh] object-cover"
          />
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3">
        <Link to="/mens">
          <img
            src="/mensbannerimage.png"
            alt="Mens"
            className="w-full h-[70vh] object-cover"
          />
        </Link>
        <Link to="/womens">
          <img
            src="/womensbannerimage.png"
            alt="Womens"
            className="w-full h-[70vh] object-cover"
          />
        </Link>
        <Link to="/kids">
          <img
            src="/kidsbannerimage.png"
            alt="Kids"
            className="w-full h-[70vh] object-cover"
          />
        </Link>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <div className="mx-auto max-w-7xl px-4">
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Veloura?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FaShieldAlt className="mx-auto text-4xl text-black dark:text-white mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                100% secure checkout powered by Razorpay.
              </p>
            </div>

            <div className="text-center">
              <FaTruck className="mx-auto text-4xl text-black dark:text-white mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Reliable & quick shipping across India.
              </p>
            </div>

            <div className="text-center">
              <FaAward className="mx-auto text-4xl text-black dark:text-white mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Carefully curated fashion you can trust.
              </p>
            </div>
          </div>
        </section>

        {/* ================= FEATURED PRODUCTS ================= */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-10">
            Featured Products
          </h2>

          {loading ? (
            <p className="text-center">Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.$id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition"
                >
                  <Link to={`/product/${product.$id}`}>
                    <img
                      src={getImageUrl(product)}
                      alt={product.productName}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                  </Link>

                  <div className="p-4">
                    <h3 className="font-semibold mb-2">
                      {product.productName}
                    </h3>
                    <p className="text-lg font-bold mb-4">
                      {config.currencySymbol}
                      {product.sellingPrice || product.price}
                    </p>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                    >
                      <FaShoppingCart />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Home;
