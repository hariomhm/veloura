import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCartAsync, clearCart } from "../store/cartSlice";
import { functions, databases, ID } from "../lib/appwrite";
import config from "../config";

const Checkout = () => {
  const { items, totalPrice } = useSelector((state) => state.cart);
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

  const [errors, setErrors] = useState({});

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

  const validateShipping = () => {
    const newErrors = {};
    if (!shipping.name.trim()) newErrors.name = "Name is required";
    if (!shipping.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(shipping.email)) newErrors.email = "Email is invalid";
    if (!shipping.address.trim()) newErrors.address = "Address is required";
    if (!shipping.city.trim()) newErrors.city = "City is required";
    if (!shipping.zipCode.trim()) newErrors.zipCode = "Zip code is required";
    else if (!/^\d{5,6}$/.test(shipping.zipCode)) newErrors.zipCode = "Zip code must be 5-6 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrder = async () => {
    const res = await functions.createExecution(
      config.razorpayFunctionId,
      JSON.stringify({
        amount: totalPrice, // INR
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
        key: config.razorpayKeyId,
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
            config.appwriteDatabaseId,
            config.appwriteOrdersCollectionId,
            ID.unique(),
            {
              userId: user.$id,
              items: items.map((i) => JSON.stringify({
                productId: i.product.$id,
                name: i.product.productName,
                image: i.product.image,
                size: i.size,
                price: i.product.sellingPrice || i.product.price,
                quantity: i.quantity,
              })),
              totalPrice,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              status: "paid",
              shippingAddress: shipping,
              createdAt: new Date().toISOString(),
            }
          );

          dispatch(clearCartAsync(user.$id));
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
            if (validateShipping()) {
              setStep("payment");
            }
          }}
          className="max-w-xl space-y-4"
        >
          {["name", "email", "address", "city", "zipCode"].map((f) => (
            <div key={f}>
              <input
                required
                placeholder={f.toUpperCase()}
                value={shipping[f]}
                onChange={(e) =>
                  setShipping({ ...shipping, [f]: e.target.value })
                }
                className={`w-full p-3 border rounded ${errors[f] ? "border-red-500" : ""}`}
              />
              {errors[f] && <p className="text-red-500 text-sm mt-1">{errors[f]}</p>}
            </div>
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
            {loading ? "Processing..." : `Pay ₹${totalPrice}`}
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
