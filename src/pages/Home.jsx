import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';
import { FaShieldAlt, FaTruck, FaAward, FaShoppingCart } from 'react-icons/fa';
import config from '../config';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featuredProducts = products.slice(0, 4); // Show first 4 products as featured

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Veloura</h1>
          <p className="text-xl mb-6">Your one-stop shop for quality hardware and tools. Discover amazing products at great prices!</p>
          <Link to="/products" className="bg-white text-blue-500 py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/mens" className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Men's</h3>
              <p className="text-gray-600 dark:text-gray-300">Discover men's collection</p>
            </Link>
            <Link to="/womens" className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Women's</h3>
              <p className="text-gray-600 dark:text-gray-300">Explore women's fashion</p>
            </Link>
            <Link to="/kids" className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Kids</h3>
              <p className="text-gray-600 dark:text-gray-300">Fun for the little ones</p>
            </Link>
            <Link to="/products" className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Shop All</h3>
              <p className="text-gray-600 dark:text-gray-300">Browse entire collection</p>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
        {loading ? (
          <div className="text-center py-10">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => {
              const productName = product.productName || product.name;
              const discountedPrice = product.discountPrice || Math.round(product.price * 0.9);
              return (
                <Link key={product.$id} to={`/product/${product.$id}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={product.image} alt={productName} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{productName}</h3>
                    <p className="text-lg text-gray-500 line-through mb-1">{config.currencySymbol}{product.price}</p>
                    <p className="text-xl font-bold text-green-600 mb-4">{config.currencySymbol}{discountedPrice}</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors flex items-center justify-center"
                    >
                      <FaShoppingCart className="mr-2" />
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Veloura?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FaShieldAlt className="mx-auto text-4xl text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600 dark:text-gray-300">Your transactions are protected with industry-standard security.</p>
            </div>
            <div className="text-center">
              <FaTruck className="mx-auto text-4xl text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600 dark:text-gray-300">Quick and reliable delivery to get your orders to you fast.</p>
            </div>
            <div className="text-center">
              <FaAward className="mx-auto text-4xl text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-gray-600 dark:text-gray-300">We stand behind our products with a satisfaction guarantee.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
