import React, { useEffect, useState, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import service from '../lib/appwrite';
import { Link } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';

const OrderHistory = memo(() => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      const res = await service.getUserOrders(user.userDoc.$id);
      setOrders(res.documents);
    } catch (_) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user.userDoc.$id]);

  useEffect(() => {
    if (isAuthenticated && user?.userDoc) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, fetchOrders]);

  if (!isAuthenticated) {
    return <div className="p-6">Please login to view your orders.</div>;
  }

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <FaShoppingBag className="mx-auto text-6xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-4">You haven't placed any orders yet. Start shopping to see your order history here.</p>
          <Link to="/products" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.$id} className="border p-4 rounded">
              <div className="flex justify-between">
                <div>
                  <p><strong>Order Number:</strong> {order.orderNumber}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <Link to={`/order/${order.$id}`} className="text-blue-600">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

OrderHistory.displayName = "OrderHistory";

export default OrderHistory;
