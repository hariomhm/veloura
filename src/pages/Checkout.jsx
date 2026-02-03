import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../store/cartSlice';
import { clearAddress } from '../store/checkoutSlice';
import orderService from '../lib/orderService';
import userService from '../lib/userService';
import useToast from '../hooks/useToast';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error: showError } = useToast();
  const { items } = useSelector((state) => state.cart);
  const { name, phone, addressLine, city, state: addressState, pincode, isValid, couponCode } = useSelector((state) => state.checkout);
  const [processing, setProcessing] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const initiatePayment = async () => {
      if (startedRef.current) return;
      startedRef.current = true;

      if (items.length === 0) {
        showError("Your cart is empty");
        navigate('/cart');
        return;
      }

      if (!isValid) {
        navigate('/address');
        return;
      }

      if (processing) return;
      setProcessing(true);

      try {
        const checkoutPayload = items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          size: i.size || null,
        }));

        const checkout = await orderService.createCheckoutSession(checkoutPayload, couponCode || undefined);
        const paymentOrder = await orderService.createPaymentOrder(checkout.checkoutId);

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: paymentOrder.order.amount,
          currency: paymentOrder.currency || 'INR',
          name: 'Veloura',
          description: 'Purchase',
          order_id: paymentOrder.order.id,
          handler: async (response) => {
            try {
              await orderService.confirmOrder({
                checkoutId: paymentOrder.checkoutId,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                provider: 'razorpay',
                status: 'paid',
                shipping: {
                  name,
                  phone,
                  addressLine,
                  city,
                  state: addressState,
                  pincode,
                },
              });

              try {
                await userService.updateProfile({
                  name,
                  phone,
                  address: `${addressLine}, ${city}, ${addressState} - ${pincode}`,
                });
              } catch (error) {
                console.error('Failed to update user profile:', error);
              }

              dispatch(clearCart());
              dispatch(clearAddress());
              navigate("/order-success");
            } catch (error) {
              console.error('Order creation failed:', error);
              showError("Order creation failed. Please try again.");
              setProcessing(false);
            }
          },
          modal: {
            ondismiss: () => {
              setProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error('Payment order creation failed:', error);
        showError("Failed to initiate payment. Please try again.");
        setProcessing(false);
      }
    };

    initiatePayment();
  }, [dispatch, navigate, items, name, phone, addressLine, city, addressState, pincode, isValid, processing, showError, couponCode]);

  if (!isValid || items.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Payment...</h1>
        <p>Please complete the payment in the popup window.</p>
        <p className="mt-2 text-sm text-gray-600">Do not close this window.</p>
      </div>
    </div>
  );
};

export default Checkout;
