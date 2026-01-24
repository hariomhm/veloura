import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../store/cartSlice';
import { databases, ID } from '../lib/appwrite';

const Checkout = () => {
  const { items, total } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Create order in Appwrite
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          products: items.map(item => ({
            productId: item.product.$id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            size: item.size,
          })),
          total,
          shippingAddress: formData,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }
      );

      dispatch(clearCart());
      navigate('/order-success');
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block mb-1">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 px-4 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            {items.map(item => (
              <div key={`${item.product.$id}-${item.size}`} className="flex justify-between mb-2">
                <span>{item.product.name} ({item.size}) x{item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
