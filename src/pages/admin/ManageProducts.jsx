import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../../store/productSlice';
import config from '../../config';

const ManageProducts = () => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const { products, loading, error } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchProducts());
    }
  }, [dispatch, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  const handleEdit = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(productId))
        .unwrap()
        .then(() => {
          alert('Product deleted successfully!');
        })
        .catch((error) => {
          alert('Failed to delete product: ' + error);
        });
    }
  };

  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>
      <div className="space-y-4">
        {products.map(product => (
          <div key={product.$id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {product.image && (
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
              )}
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{config.currencySymbol}{product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(product.$id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.$id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;
