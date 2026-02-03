import React, { useState } from "react";
import orderService from "../lib/orderService";

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await orderService.getOrder(orderId.trim());
      setOrder(response);
    } catch {
      setError("Order not found. Please check your Order ID.");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Order Tracking
      </h1>

      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Order ID</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
              placeholder="Enter your Order ID"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </form>

        {/* ERROR */}
        {error && (
          <div className="mt-6 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded">
            {error}
          </div>
        )}

        {/* ORDER DETAILS */}
        {order && (
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>

            <div className="space-y-2 text-sm">
              <p><strong>Order ID:</strong> {order.$id}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    order.status === "delivered"
                      ? "text-green-600"
                      : order.status === "shipped"
                      ? "text-blue-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p><strong>Total:</strong> ₹{order.totalPrice}</p>
              <p>
                <strong>Ordered On:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* PRODUCTS */}
            {order.items && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-2">
                  Products
                </h3>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.name} ({item.size}) × {item.quantity}
                      </span>
                      <span>₹{item.price}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
