import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../store/cartSlice';
import { clearAddress } from '../store/checkoutSlice';
import service from '../lib/appwrite';
import useToast from '../hooks/useToast';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error: showError } = useToast();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { name, phone, addressLine, city, state: addressState, pincode, isValid } = useSelector((state) => state.checkout);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Check if cart is empty
    if (items.length === 0) {
      showError("Your cart is empty");
      navigate('/cart');
      return;
    }

    // Check if address is valid
    if (!isValid) {
      navigate('/address');
      return;
    }

    // Check stock for each item
    const outOfStockItems = items.filter(item => {
      // Assuming we have stock in product data, but since cart doesn't have it, skip for now
      // In real app, fetch product stock here
      return false;
    });

    if (outOfStockItems.length > 0) {
      showError("Some items in your cart are out of stock");
      navigate('/cart');
      return;
    }

    if (processing) return; // Prevent multiple payments

    setProcessing(true);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: totalPrice * 100, // amount in paisa
      currency: 'INR',
      name: 'Veloura',
      description: 'Purchase',
      handler: async (response) => {
        try {
          await service.createOrder({
            userId: user.$id,
            items: items.map((i) => ({
              productId: i.productId,
              name: i.name,
              image: i.image,
              size: i.size,
              price: i.sellingPrice,
              quantity: i.quantity,
            })),
            totalPrice,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            status: "paid",
            customerName: name,
            customerPhone: phone,
            addressLine,
            city,
            state: addressState,
            pincode,
            createdAt: new Date().toISOString(),
          });

          // Update user profile with latest address
          try {
            if (user.userDoc) {
              await service.updateUser(user.userDoc.$id, {
                name,
                phone,
                address: `${addressLine}, ${city}, ${addressState} - ${pincode}`,
              });
            }
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
  }, [dispatch, navigate, items, totalPrice, user, name, phone, addressLine, city, addressState, pincode, isValid, processing, showError]);

  if (!isValid || items.length === 0) {
    return null; // Will redirect
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
