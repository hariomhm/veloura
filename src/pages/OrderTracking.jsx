import React, { useState } from 'react';

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock order status
      const mockStatus = {
        id: orderId,
        status: 'Shipped',
        estimatedDelivery: '2024-12-15',
        trackingNumber: 'TRK123456789'
      };
      setOrderStatus(mockStatus);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Order Tracking</h1>
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Order ID</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter your order ID"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </form>
        {orderStatus && (
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Order Status</h2>
            <div className="space-y-2">
              <p><strong>Order ID:</strong> {orderStatus.id}</p>
              <p><strong>Status:</strong> {orderStatus.status}</p>
              <p><strong>Estimated Delivery:</strong> {orderStatus.estimatedDelivery}</p>
              <p><strong>Tracking Number:</strong> {orderStatus.trackingNumber}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
