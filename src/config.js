const config = {
  // API
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_GATEWAY_URL ||
    "http://localhost:5000",

  // Backwards-compatible name (legacy code uses apiGatewayUrl)
  apiGatewayUrl:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_GATEWAY_URL ||
    "http://localhost:5000",

  // App constants
  currencySymbol: "₹",
  siteUrl:
    import.meta.env.VITE_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : ""),
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",

  // Payment
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || "",
};

export default config;
