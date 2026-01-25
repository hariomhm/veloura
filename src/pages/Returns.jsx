import React, { useState } from 'react';

const Returns = () => {
  const [formData, setFormData] = useState({
    orderId: '',
    reason: '',
    description: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');
    // Simulate submission
    setTimeout(() => {
      setSubmitStatus('success');
      setFormData({ orderId: '', reason: '', description: '' });
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Returns & Exchange</h1>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Return Policy</h2>
          <div className="prose dark:prose-invert">
            <p>We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 30 days of delivery for a full refund or exchange.</p>
            <h3>Eligibility</h3>
            <ul>
              <li>Items must be in original condition and packaging</li>
              <li>Return request must be made within 30 days of delivery</li>
              <li>Items must not have been used or damaged</li>
              <li>Original receipt or proof of purchase required</li>
            </ul>
            <h3>How to Return</h3>
            <ol>
              <li>Contact our customer service to initiate a return</li>
              <li>Pack the item securely in its original packaging</li>
              <li>Include the return authorization number</li>
              <li>Ship to the address provided</li>
            </ol>
            <h3>Refunds</h3>
            <p>Refunds will be processed within 5-7 business days after we receive the returned item. Shipping costs are non-refundable unless the return is due to our error.</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Request a Return</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Order ID</label>
              <input
                type="text"
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1">Reason for Return</label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select a reason</option>
                <option value="wrong-item">Wrong item received</option>
                <option value="defective">Item is defective</option>
                <option value="not-satisfied">Not satisfied with product</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="Please describe the issue..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitStatus === 'loading'}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {submitStatus === 'loading' ? 'Submitting...' : 'Submit Return Request'}
            </button>
          </form>
          {submitStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded">
              Your return request has been submitted. We'll contact you within 24 hours with next steps.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Returns;
