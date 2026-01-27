import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div
      className="container mx-auto px-4 py-12 text-center"
      aria-live="polite"
    >
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-5xl">
            ✓
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Thank you for your purchase. Your order has been confirmed and is
          being processed.
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          You will receive an email confirmation shortly with your order
          details.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/products"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </Link>

          <Link
            to="/"
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
