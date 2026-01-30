export const getSellingPrice = (product) => {
  const { mrp, discountPercent } = product;
  if (!mrp) return 0;
  if (!discountPercent || discountPercent <= 0) return mrp;
  // Calculate selling price with floating point precision handling
  return Math.round((mrp - (mrp * discountPercent / 100)) * 100) / 100;
};

export const getDiscountPercent = (product) => {
  const { mrp, discountPercent } = product;
  if (!mrp || !discountPercent || discountPercent <= 0) return 0;
  return Math.round(((mrp - getSellingPrice(product)) / mrp) * 100);
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Indian format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

// Retry utility for network operations
export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.code && error.code >= 400 && error.code < 500) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      console.warn(`Operation failed (attempt ${attempt}/${maxRetries}), retrying in ${waitTime}ms:`, error.message);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
};
