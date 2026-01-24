import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';

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
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Veloura</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">Discover amazing products at great prices</p>
        <Link to="/products" className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">
          Shop Now
        </Link>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
        {loading ? (
          <div className="text-center py-10">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <div key={product.$id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-xl font-bold text-green-600 mb-4">${product.price}</p>
                  <div className="flex gap-2">
                    <Link
                      to={`/product/${product.$id}`}
                      className="flex-1 bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600 transition-colors text-center text-sm"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-green-500 text-white py-2 px-3 rounded hover:bg-green-600 transition-colors text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
