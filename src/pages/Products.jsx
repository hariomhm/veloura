import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product }));
  };

  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.$id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{product.description}</p>
              <p className="text-2xl font-bold text-green-600 mb-4">${product.price}</p>
              <div className="flex gap-2">
                <Link
                  to={`/product/${product.$id}`}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors text-center"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
