import React, { useEffect, useState, useCallback, memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import orderService from '../lib/orderService';
import OrderTimeline from '../components/OrderTimeline';
import jsPDF from 'jspdf';

const OrderDetail = memo(() => {
  const { orderId } = useParams();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = user?.$id;

  const fetchOrder = useCallback(async () => {
    try {
      if (!userId) return;
      const order = await orderService.getOrder(orderId);
      if (
        order &&
        (order.userId === userId ||
          user?.role === "admin")
      ) {
        setOrder(order);
      } else {
        setError('Order not found or access denied');
      }
    } catch (_) {
      setError('Failed to load order');
    } finally {
      setLoading(false);
    }
  }, [userId, orderId, user?.role]);

  useEffect(() => {
    if (isAuthenticated && orderId && userId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, orderId, userId, fetchOrder]);

  const downloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Invoice', 20, 20);
    doc.setFontSize(12);
    doc.text(`Order Number: ${order.orderNumber}`, 20, 40);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 50);
    doc.text(`Status: ${order.status}`, 20, 60);
    doc.text(`Total: ₹${order.totalAmount}`, 20, 70);

    const items = Array.isArray(order.items) ? order.items : [];
    let y = 90;
    doc.text('Items:', 20, y);
    y += 10;
    items.forEach((item, index) => {
      doc.text(`${item.name} - Qty: ${item.quantity} - Price: ₹${item.price}`, 20, y);
      y += 10;
    });

    doc.save(`invoice-${order.orderNumber}.pdf`);
  };

  if (!isAuthenticated) {
    return <div className="p-6">Please login to view order details.</div>;
  }

  if (loading) {
    return <div className="p-6">Loading order...</div>;
  }

  if (error || !order) {
    return <div className="p-6 text-red-600">{error || 'Order not found'}</div>;
  }

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="border p-4 rounded mb-4">
        <p><strong>Order Number:</strong> {order.orderNumber}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <button
          onClick={downloadInvoice}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Download Invoice
        </button>
      </div>
      <OrderTimeline status={order.status} />
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Tracking Information</h3>
        <div className="border p-4 rounded">
          {order.trackingNumber ? (
            <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
          ) : (
            <p>Tracking information will be available once the order is shipped.</p>
          )}
          {order.carrier && <p><strong>Carrier:</strong> {order.carrier}</p>}
          {order.estimatedDelivery && (
            <p><strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
          )}
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2">Items</h2>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="border p-2 rounded">
            <p><strong>Product:</strong> {item.name}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Price:</strong> ₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

OrderDetail.displayName = "OrderDetail";

export default OrderDetail;
