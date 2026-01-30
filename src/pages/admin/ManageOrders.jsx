import React, { useEffect, useState } from "react";
import { databases, Query } from "../../lib/appwrite";
const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(100)] // Limit to 100 orders
      );
      setOrders(response.documents);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID,
        orderId,
        { status: newStatus }
      );
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateStatus(orderId, newStatus);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

      {loading ? (
        <div className="text-center">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.$id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">Order #{order.$id}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">₹{order.total}</p>
                  <select
                    value={order.status || "pending"} // Default to "pending" if status is undefined
                    onChange={(e) => handleStatusChange(order.$id, e.target.value)}
                    className="mt-2 px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* ADDRESS */}
              {(order.customerName || order.addressLine) && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                  <div className="text-sm space-y-1">
                    {order.customerName && <p><strong>Name:</strong> {order.customerName}</p>}
                    {order.customerPhone && <p><strong>Phone:</strong> {order.customerPhone}</p>}
                    {order.addressLine && <p><strong>Address:</strong> {order.addressLine}</p>}
                    {order.city && <p><strong>City:</strong> {order.city}</p>}
                    {order.state && <p><strong>State:</strong> {order.state}</p>}
                    {order.pincode && <p><strong>Pincode:</strong> {order.pincode}</p>}
                  </div>
                </div>
              )}

              {/* PRODUCTS */}
              {order.items && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Products</h3>
                  <ul className="space-y-1 text-sm">
                    {order.items.map((item, index) => {
                      const parsedItem = JSON.parse(item);
                      return (
                        <li key={index} className="flex justify-between">
                          <span>
                            {parsedItem.name} ({parsedItem.size}) × {parsedItem.quantity} - ₹{parsedItem.price * parsedItem.quantity} each
                          </span>
                          <span>₹{parsedItem.price * parsedItem.quantity}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
