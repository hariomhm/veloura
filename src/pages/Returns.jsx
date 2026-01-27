import React, { useState, useEffect } from "react";

const Returns = () => {
  const [formData, setFormData] = useState({
    orderId: "",
    reason: "",
    description: "",
  });

  const [submitStatus, setSubmitStatus] = useState(null); // null | loading | success

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitStatus === "loading") return;

    setSubmitStatus("loading");

    try {
      // 🔥 Replace this block with Appwrite / backend API later
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus("success");
      setFormData({ orderId: "", reason: "", description: "" });
    } catch (error) {
      console.error("Return request failed:", error);
      setSubmitStatus(null);
      alert("Failed to submit return request. Please try again.");
    }
  };

  // auto-hide success message
  useEffect(() => {
    if (submitStatus === "success") {
      const timer = setTimeout(() => setSubmitStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Returns & Exchange
      </h1>

      <div className="max-w-4xl mx-auto space-y-10">
        {/* ================= POLICY ================= */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Return Policy</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              We want you to be completely satisfied with your purchase. If
              you're not happy with your order, you can return it within
              <strong> 30 days</strong> of delivery for a refund or exchange.
            </p>

            <h3>Eligibility</h3>
            <ul>
              <li>Items must be unused and in original packaging</li>
              <li>Return request within 30 days of delivery</li>
              <li>No physical damage or alterations</li>
              <li>Valid order ID required</li>
            </ul>

            <h3>How to Return</h3>
            <ol>
              <li>Submit the return request below</li>
              <li>Our team will verify your request</li>
              <li>You’ll receive pickup or shipping instructions</li>
              <li>Refund processed after inspection</li>
            </ol>

            <h3>Refunds</h3>
            <p>
              Refunds are processed within <strong>5–7 business days</strong>{" "}
              after the returned item is received and approved.
            </p>
          </div>
        </section>

        {/* ================= FORM ================= */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Request a Return</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Order ID</label>
              <input
                type="text"
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
                required
                placeholder="e.g. ORD123456"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Reason for Return
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select a reason</option>
                <option value="wrong-item">Wrong item received</option>
                <option value="defective">Defective product</option>
                <option value="not-satisfied">
                  Not satisfied with product
                </option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe the issue in detail..."
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={submitStatus === "loading"}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 transition disabled:opacity-50"
            >
              {submitStatus === "loading"
                ? "Submitting..."
                : "Submit Return Request"}
            </button>
          </form>

          {submitStatus === "success" && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded">
              ✅ Your return request has been submitted. Our team will contact
              you within 24 hours.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Returns;
