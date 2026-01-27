const Help = () => {
  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Browse our collections, select your size, add items to your cart, and proceed to checkout. Enter your shipping details and complete payment securely to place your order.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major payment methods via Razorpay, including Debit/Credit Cards, UPI (Google Pay, PhonePe, Paytm), and Net Banking.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is placed, you can track it from the Order Tracking page using your Order ID or from your profile if you are logged in.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer easy returns within 7 days of delivery, provided the product is unused, unwashed, and in original condition. Please visit the Returns & Exchange page for full details.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach us anytime via the Contact page or email us at support@veloura.com. Our team usually responds within 24 hours.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Help & Support
      </h1>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
            >
              <h3 className="text-lg font-semibold mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Still need help?{" "}
            <a
              href="/contact"
              className="text-black dark:text-white font-medium underline hover:opacity-80"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Help;
