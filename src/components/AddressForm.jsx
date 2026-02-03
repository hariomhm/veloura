import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateField, setErrors, autoFill } from '../store/checkoutSlice';
import Input from './Input';
import Button from './Button';

const AddressForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { name, phone, addressLine, city, state, pincode, isValid } = useSelector((state) => state.checkout);

  const [localErrors, setLocalErrors] = useState({});

  useEffect(() => {
    // Auto-fill from user profile
    if (user) {
      dispatch(autoFill({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      }));
    }
  }, [user, dispatch]);

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'name':
        if (!value.trim()) error = 'Full name is required';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) error = 'Phone must be 10 digits';
        break;
      case 'addressLine':
        if (!value.trim()) error = 'Address is required';
        break;
      case 'city':
        if (!value.trim()) error = 'City is required';
        break;
      case 'state':
        if (!value.trim()) error = 'State is required';
        break;
      case 'pincode':
        if (!value.trim()) error = 'Pincode is required';
        else if (!/^\d{6}$/.test(value)) error = 'Pincode must be 6 digits';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    dispatch(updateField({ field, value }));

    // Real-time validation
    const error = validateField(field, value);
    setLocalErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const allErrors = {};
    const fields = ['name', 'phone', 'addressLine', 'city', 'state', 'pincode'];
    fields.forEach(field => {
      const value = { name, phone, addressLine, city, state, pincode }[field];
      const error = validateField(field, value);
      if (error) allErrors[field] = error;
    });

    if (Object.keys(allErrors).length > 0) {
      dispatch(setErrors(allErrors));
      setLocalErrors(allErrors);
      return;
    }

    // Proceed to checkout
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Shipping Address</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={name}
            onChange={handleChange('name')}
            error={localErrors.name}
            placeholder="Enter your full name"
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={handleChange('phone')}
            error={localErrors.phone}
            placeholder="10-digit phone number"
            required
          />
        </div>

        <Input
          label="Address Line"
          value={addressLine}
          onChange={handleChange('addressLine')}
          error={localErrors.addressLine}
          placeholder="Street address, apartment, etc."
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="City"
            value={city}
            onChange={handleChange('city')}
            error={localErrors.city}
            placeholder="City"
            required
          />

          <Input
            label="State"
            value={state}
            onChange={handleChange('state')}
            error={localErrors.state}
            placeholder="State"
            required
          />

          <Input
            label="Pincode"
            value={pincode}
            onChange={handleChange('pincode')}
            error={localErrors.pincode}
            placeholder="6-digit pincode"
            required
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => navigate('/cart')}
            className="flex-1 bg-gray-500 hover:bg-gray-600"
          >
            Back to Cart
          </Button>

          <Button
            type="submit"
            disabled={!isValid}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Payment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
