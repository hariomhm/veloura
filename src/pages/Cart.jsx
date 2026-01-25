import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import { Link } from 'react-router-dom';
import config from '../config';

const Cart = () => {
  const { items, total } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const handleRemove = (productId, size) => {
    dispatch(removeFromCart({ productId, size }));
  };

  const handleQuantityChange = (productId, size, quantity) => {
    dispatch(updateQuantity({ productId, size, quantity: parseInt(quantity) }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/products" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map(item => (
            <div key={`${item.product.$id}-${item.size}`} className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
              <img src={item.product.imageUrls ? item.product.imageUrls[0] : item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{item.product.name} ({item.size})</h2>
                <p className="text-gray-600 dark:text-gray-300">{config.currencySymbol}{item.product.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.product.$id, item.size, e.target.value)}
                  className="w-16 px-2 py-1 border rounded text-center dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  onClick={() => handleRemove(item.product.$id, item.size)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={handleClearCart}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
          >
            Clear Cart
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>{config.currencySymbol}{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between text-xl font-bold mb-6">
            <span>Total:</span>
            <span>{config.currencySymbol}{total.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="w-full bg-green-500 text-white py-3 px-4 rounded hover:bg-green-600 transition-colors text-center block"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
