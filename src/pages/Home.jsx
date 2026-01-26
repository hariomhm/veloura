import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaTruck, FaAward, FaShoppingCart } from "react-icons/fa";

import { fetchProducts } from "../store/productSlice";
import { fetchBanners } from "../store/bannerSlice";
import { addToCart } from "../store/cartSlice";
import config from "../config";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const { banners } = useSelector((state) => state.banners);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchBanners());
  }, [dispatch]);

  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product }));
  };

  const getImageUrl = (product) => {
    if (!product.images || product.images.length === 0) {
      return "/placeholder.png";
    }

    return `${config.appwriteUrl}/storage/buckets/${config.bucketId}/files/${product.images[0]}/view?project=${config.projectId}`;
  };

  return (
    <>
        <>
          <section className="flex items-center justify-center">
            <Link to="/products">
              <img src="bannerImage.png" alt="bannerImage" className="object-cover" />
            </Link>
          </section>
          <section className="flex items-center justify-center">
            <Link to="/mens">
              <img src="mensbannerimage.png" alt="mensbannerimage" className="object-cover"/>
            </Link>
          </section>
          <section className="flex items-center justify-center">
            <Link to="/womens">
              <img src="womensbannerimage.png" alt="womensbannerimage" className="object-cover"/>
            </Link>
          </section>
          <section className="flex items-center justify-center">
            <Link to="/kids">
              <img src="kidsbannerimage.png" alt="kidsbannerimage" className="object-cover"/>
            </Link>
          </section>
        </> 

      {/* ================= MAIN CONTENT ================= */}
      <div className="mx-auto max-w-7xl px-4">
        <section className="py-12 bg-gray-50 dark:bg-gray-900 rounded-lg mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Choose Veloura?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FaShieldAlt className="mx-auto text-4xl text- mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Industry-standard payment security.
              </p>
            </div>

            <div className="text-center">
              <FaTruck className="mx-auto text-4xl text- mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Quick & reliable delivery.
              </p>
            </div>

            <div className="text-center">
              <FaAward className="mx-auto text-4xl text- mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Satisfaction guaranteed.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
