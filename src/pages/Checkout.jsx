import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../store/cartSlice';
import { databases } from '../lib/appwrite';
import { ID } from 'appwrite';
import config from '../config';


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
  const [currentStep, setCurrentStep] = useState('shipping');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createRazorpayOrder = async () => {
    try {
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total * 100, // Razorpay expects amount in paisa
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });
      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  };

  const handleRazorpayPayment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const order = await createRazorpayOrder();

      const options = {
        key: config.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Veloura Ecommerce',
        description: 'Purchase from Veloura',
        order_id: order.id,
        handler: async function (response) {
          // Payment successful
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
                status: 'paid',
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                createdAt: new Date().toISOString(),
              }
            );

            dispatch(clearCart());
            navigate('/order-success');
          } catch (error) {
            console.error('Order creation failed:', error);
            alert('Payment successful but order creation failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
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
      <div className="flex justify-center mb-8">
        <div className={`px-4 py-2 rounded ${currentStep === 'shipping' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
          1. Shipping
        </div>
        <div className={`px-4 py-2 rounded ml-4 ${currentStep === 'payment' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
          2. Payment
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {currentStep === 'shipping' && (
            <>
              <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
              <form onSubmit={(e) => { e.preventDefault(); setCurrentStep('payment'); }} className="space-y-4">
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
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  Next: Payment
                </button>
              </form>
            </>
          )}
          {currentStep === 'payment' && (
            <>
              <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Payment Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit"
                        checked={paymentMethod === 'credit'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      <span>Credit Card</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      <span>PayPal</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paytm"
                        checked={paymentMethod === 'paytm'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      <span>Paytm</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="phonepe"
                        checked={paymentMethod === 'phonepe'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      <span>PhonePe</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="googlepay"
                        checked={paymentMethod === 'googlepay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      <span>Google Pay</span>
                    </label>
                  </div>
                </div>
                {paymentMethod === 'credit' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1">Expiry Date</label>
                        <input
                          type="text"
                          name="expiry"
                          value={paymentData.expiry}
                          onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                          required
                          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                          required
                          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {paymentMethod === 'paypal' && (
                  <div>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-yellow-500 text-white py-3 px-4 rounded hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Pay with PayPal'}
                    </button>
                  </div>
                )}
                {paymentMethod === 'paytm' && (
                  <div>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Pay with Paytm'}
                    </button>
                  </div>
                )}
                {paymentMethod === 'phonepe' && (
                  <div>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-purple-500 text-white py-3 px-4 rounded hover:bg-purple-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Pay with PhonePe'}
                    </button>
                  </div>
                )}
                {paymentMethod === 'googlepay' && (
                  <div>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-green-500 text-white py-3 px-4 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Pay with Google Pay'}
                    </button>
                  </div>
                )}
                {paymentMethod === 'razorpay' && (
                  <div>
                    <button
                      onClick={handleRazorpayPayment}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : `Pay with Razorpay - ${config.currencySymbol}${total.toFixed(2)}`}
                    </button>
                  </div>
                )}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentStep('shipping')}
                    className="w-1/2 bg-gray-500 text-white py-3 px-4 rounded hover:bg-gray-600"
                  >
                    Back
                  </button>
                  {paymentMethod === 'credit' && (
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-1/2 bg-green-500 text-white py-3 px-4 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      {loading ? 'Placing Order...' : `Place Order - ${config.currencySymbol}${total.toFixed(2)}`}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            {items.map(item => (
              <div key={`${item.product.$id}-${item.size}`} className="flex justify-between mb-2">
                <span>{item.product.name} ({item.size}) x{item.quantity}</span>
                <span>{config.currencySymbol}{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{config.currencySymbol}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
