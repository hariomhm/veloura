import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../store/cartSlice";
import { databases, functions } from "../lib/appwrite";
import { ID } from "appwrite";

const Checkout = () => {
  const { items, total } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.userData);
  const isLoggedIn = useSelector((state) => state.auth.status);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("shipping");
  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  if (!items.length) {
    navigate("/cart");
    return null;
  }

  const getPrice = (p) => p.sellingPrice || p.mrp;

  const createOrder = async () => {
    const res = await functions.createExecution(
      import.meta.env.VITE_RAZORPAY_FUNCTION_ID,
      JSON.stringify({
        amount: Math.round(total), // 👈 PAISA
      })
    );

    return JSON.parse(res.responseBody);
  };

  const payNow = async () => {
    if (!isLoggedIn || !user) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const order = await createOrder();

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: order.id,
        amount: order.amount,
        currency: "INR",
        name: "Veloura",
        description: "Order Payment",

        prefill: {
          name: shipping.name,
          email: shipping.email,
        },

        handler: async (response) => {
          await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID,
            ID.unique(),
            {
              userId: user.$id,
              products: items.map((i) => ({
                productId: i.product.$id,
                name: i.product.name,
                size: i.size,
                quantity: i.quantity,
                price: getPrice(i.product),
              })),
              total,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              status: "paid",
              shippingAddress: shipping,
              createdAt: new Date().toISOString(),
            }
          );

          dispatch(clearCart());
          navigate("/order-success");
        },

        theme: { color: "#000000" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {step === "shipping" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep("payment");
          }}
          className="max-w-xl space-y-4"
        >
          {["name", "email", "address", "city", "zipCode"].map((f) => (
            <input
              key={f}
              required
              placeholder={f.toUpperCase()}
              value={shipping[f]}
              onChange={(e) =>
                setShipping({ ...shipping, [f]: e.target.value })
              }
              className="w-full p-3 border rounded"
            />
          ))}

          <button className="w-full bg-black text-white py-3 rounded">
            Continue to Payment
          </button>
        </form>
      )}

      {step === "payment" && (
        <div className="max-w-xl">
          <button
            onClick={payNow}
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded text-lg"
          >
            {loading ? "Processing..." : `Pay ₹${total}`}
          </button>

          <button
            onClick={() => setStep("shipping")}
            className="w-full mt-4 underline text-sm"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
