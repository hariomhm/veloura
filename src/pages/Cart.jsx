import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../store/cartSlice";
import { Link } from "react-router-dom";
import config from "../config";

const Cart = () => {
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const getSellingPrice = (product) =>
    product.priceafterdiscount ||
    product.discountPrice ||
    Math.round(product.price * 0.9);

  const handleRemove = (productId, size) => {
    dispatch(removeFromCart({ productId, size }));
  };

  const handleQuantityChange = (productId, size, value) => {
    const qty = Math.max(1, Number(value) || 1);
    dispatch(updateQuantity({ productId, size, quantity: qty }));
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link
          to="/products"
          className="inline-block bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition"
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
          {items.map((item) => {
            const price = getSellingPrice(item.product);
            const lineTotal = price * item.quantity;

            return (
              <div
                key={`${item.product.$id}-${item.size}`}
                className="flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
              >
                <img
                  src={
                    item.product.imageUrls?.[0] || item.product.image
                  }
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {item.product.name}{" "}
                    <span className="text-sm text-gray-500">
                      ({item.size})
                    </span>
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {config.currencySymbol}
                    {price}
                  </p>
                  <p className="text-sm font-medium">
                    Total: {config.currencySymbol}
                    {lineTotal}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.product.$id,
                        item.size,
                        e.target.value
                      )
                    }
                    className="w-16 px-2 py-1 border rounded text-center dark:bg-gray-700 dark:border-gray-600"
                  />

                  <button
                    onClick={() =>
                      handleRemove(item.product.$id, item.size)
                    }
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => dispatch(clearCart())}
            className="text-sm bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
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
              {total.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-xl font-bold mb-6">
            <span>Total</span>
            <span>
              {config.currencySymbol}
              {total.toFixed(2)}
            </span>
          </div>

          <Link
            to="/checkout"
            className="block text-center w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
