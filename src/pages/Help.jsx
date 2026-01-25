import React from 'react';

const Help = () => {
  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Browse our products, add items to your cart, and proceed to checkout. Fill in your shipping and payment details to complete the order.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit cards and PayPal for secure online payments.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Use the Order Tracking page and enter your order ID to check the status.'
    },
    {
      question: 'What is your return policy?',
      answer: 'You can return items within 30 days of purchase. Please see our Returns page for details.'
    },
    {
      question: 'How do I contact customer support?',
      answer: 'Visit our Contact page or email us at support@veloura.com.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Help & Support</h1>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Can't find what you're looking for? <a href="/contact" className="text-blue-500 hover:underline">Contact us</a> for more help.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Help;
