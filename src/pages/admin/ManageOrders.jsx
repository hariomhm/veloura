import React, { useEffect, useState } from 'react';
import { databases } from '../../lib/appwrite';
import { useSelector } from 'react-redux';
import config from '../../config';

const ManageOrders = () => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID
      );
      setOrders(response.documents);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID,
        orderId,
        { status: newStatus }
      );
      setOrders(orders.map(order =>
        order.$id === orderId ? { ...order, status: newStatus } : order
      ));
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status.');
    }
  };

  if (loading) return <div className="text-center py-10">Loading orders...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.$id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order ID: {order.$id}</h3>
                <p className="text-gray-600 dark:text-gray-300">User ID: {order.userId}</p>
                <p className="text-gray-600 dark:text-gray-300">Total: {config.currencySymbol}{order.totalAmount || order.total}</p>
                <p className="text-gray-600 dark:text-gray-300">Created: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.$id, e.target.value)}
                  className="px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Products:</h4>
              <ul className="space-y-1">
                {order.products.map((product, index) => (
                  <li key={index} className="text-sm">
                    {product.name} ({product.size}) x{product.quantity} - {config.currencySymbol}{product.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageOrders;
