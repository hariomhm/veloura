import React, { useState } from 'react';
import newsletterService from '../lib/newsletterService';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await newsletterService.subscribe(email);
      setMessage('Thank you for subscribing! Please check your email to verify your subscription.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Subscribe to Newsletter</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Get the latest updates and exclusive offers.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-3 py-2 border rounded dark:bg-gray-700"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {message && <p className="text-green-600 mt-2">{message}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default Newsletter;
