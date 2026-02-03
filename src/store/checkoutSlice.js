import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem('checkoutAddress');
    const parsed = stored ? JSON.parse(stored) : {};
    return {
      name: parsed.name || '',
      phone: parsed.phone || '',
      addressLine: parsed.addressLine || '',
      city: parsed.city || '',
      state: parsed.state || '',
      pincode: parsed.pincode || '',
      couponCode: parsed.couponCode || '',
      couponError: parsed.couponError || '',
      errors: parsed.errors || {},
      isValid: parsed.isValid || false,
    };
  } catch {
    return {
      name: '',
      phone: '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      couponCode: '',
      couponError: '',
      errors: {},
      isValid: false,
    };
  }
};

// Save to localStorage
const saveToStorage = (state) => {
  try {
    localStorage.setItem('checkoutAddress', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save checkout address to localStorage:', error);
  }
};

const initialState = loadFromStorage();

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
      state.errors[field] = '';
      state.isValid = validateForm(state);
      saveToStorage(state);
    },
    setCoupon: (state, action) => {
      state.couponCode = action.payload || '';
      state.couponError = '';
      saveToStorage(state);
    },
    setCouponError: (state, action) => {
      state.couponError = action.payload || '';
      saveToStorage(state);
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
      state.isValid = validateForm(state);
      saveToStorage(state);
    },
    autoFill: (state, action) => {
      const { name, phone, address } = action.payload;
      if (name && !state.name) state.name = String(name);
      if (phone && !state.phone) state.phone = String(phone);
      if (address && !state.addressLine) state.addressLine = String(address);
      state.isValid = validateForm(state);
      saveToStorage(state);
    },
    clearAddress: (state) => {
      Object.assign(state, {
        name: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        couponCode: '',
        couponError: '',
        errors: {},
        isValid: false,
      });
      saveToStorage(state);
    },
  },
});

// Validation function
const validateForm = (state) => {
  const errors = {};

  if (!state.name.trim()) errors.name = 'Full name is required';
  if (!state.phone.trim()) errors.phone = 'Phone number is required';
  else if (!/^\d{10}$/.test(state.phone.replace(/\D/g, ''))) errors.phone = 'Phone must be 10 digits';
  if (!state.addressLine.trim()) errors.addressLine = 'Address is required';
  if (!state.city.trim()) errors.city = 'City is required';
  if (!state.state.trim()) errors.state = 'State is required';
  if (!state.pincode.trim()) errors.pincode = 'Pincode is required';
  else if (!/^\d{6}$/.test(state.pincode)) errors.pincode = 'Pincode must be 6 digits';

  return Object.keys(errors).length === 0;
};

export const { updateField, setCoupon, setCouponError, setErrors, autoFill, clearAddress } = checkoutSlice.actions;
export default checkoutSlice.reducer;
