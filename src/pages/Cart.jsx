import { useCallback, memo, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import config from "../config";
import useCart from "../hooks/useCart";
import couponService from "../lib/couponService";
import { setCoupon, setCouponError } from "../store/checkoutSlice";
import useToast from "../hooks/useToast";

const Cart = memo(() => {
  const dispatch = useDispatch();
  const { success, error: showError } = useToast();
  const {
    items,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const { couponCode, couponError } = useSelector((state) => state.checkout);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [couponInput, setCouponInput] = useState(couponCode || "");
  const [discountTotal, setDiscountTotal] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    if (!couponCode) {
      setDiscountTotal(0);
      return;
    }
    setDiscountTotal(0);
    dispatch(setCouponError(""));
  }, [items, dispatch, couponCode]);

  useEffect(() => {
    setCouponInput(couponCode || "");
  }, [couponCode]);

  const handleRemove = useCallback((productId, size) => {
    removeFromCart(productId, size);
  }, [removeFromCart]);

  const handleQuantityChange = useCallback((productId, size, value) => {
    const qty = Math.max(1, Number(value) || 1);
    updateQuantity(productId, size, qty);
  }, [updateQuantity]);

  const cartItems = useMemo(() => items.map((item) => {
    const lineTotal = item.sellingPrice * item.quantity;
    return { ...item, lineTotal };
  }), [items]);

  const applyCoupon = async () => {
    if (!isAuthenticated) {
      showError("Please log in to apply a coupon");
      return;
    }
    if (!couponInput.trim()) {
      dispatch(setCoupon(""));
      dispatch(setCouponError(""));
      setDiscountTotal(0);
      return;
    }

    setCouponLoading(true);
    try {
      const summary = await couponService.validateCoupon(
        items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          size: i.size || null,
        })),
        couponInput.trim()
      );

      setDiscountTotal(summary.discountTotal || 0);
      dispatch(setCoupon(summary.coupon?.code || couponInput.trim()));
      dispatch(setCouponError(""));
      success("Coupon applied");
    } catch (err) {
      setDiscountTotal(0);
      dispatch(setCoupon(""));
      dispatch(setCouponError(err.message));
      showError(err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const totalAfterDiscount = Math.max(0, totalPrice - discountTotal);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link
          to="/products"
          className="inline-block bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition"
          aria-label="Continue shopping"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
                loading="lazy"
              />

              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  {item.name}{" "}
                  <span className="text-sm text-gray-500">
                    ({item.size})
                  </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {config.currencySymbol}
                  {item.sellingPrice}
                </p>
                <p className="text-sm font-medium">
                  Total: {config.currencySymbol}
                  {item.lineTotal.toFixed(2)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.productId,
                      item.size,
                      e.target.value
                    )
                  }
                  className="w-16 px-2 py-1 border rounded text-center dark:bg-gray-700 dark:border-gray-600"
                  aria-label={`Quantity for ${item.name}`}
                />

                <button
                  onClick={() =>
                    handleRemove(item.productId, item.size)
                  }
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            aria-label="Clear all items from cart"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-fit">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>
              {config.currencySymbol}
              {totalPrice.toFixed(2)}
            </span>
          </div>

          {discountTotal > 0 && (
            <div className="flex justify-between mb-2 text-green-600">
              <span>Discount</span>
              <span>-{config.currencySymbol}{discountTotal.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Coupon Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter coupon"
              />
              <button
                type="button"
                onClick={applyCoupon}
                disabled={couponLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {couponLoading ? "Applying..." : "Apply"}
              </button>
            </div>
            {couponError && (
              <p className="text-xs text-red-500 mt-1">{couponError}</p>
            )}
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-xl font-bold mb-6">
            <span>Total</span>
            <span>
              {config.currencySymbol}
              {totalAfterDiscount.toFixed(2)}
            </span>
          </div>

          <Link
            to="/address"
            className="block text-center w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition"
            aria-label="Proceed to address"
          >
            Proceed to Address
          </Link>
        </div>
      </div>
    </div>
  );
});

Cart.displayName = "Cart";

export default Cart;
