import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { account } from '../lib/appwrite';
import { FaChevronRight } from 'react-icons/fa';

const UserProfile = () => {
  const { userData: user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      {/* Back */}
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to Home
      </Link>

      {/* Greeting */}
      <h1 className="text-3xl font-bold mb-8">
        Hello, <span className="capitalize">{user.name}</span> 👋
      </h1>

      {/* Menu */}
      <ul className="space-y-4">
        <li
          onClick={() => navigate('/profile')}
          className="flex justify-between items-center border-b pb-3 cursor-pointer hover:text-blue-500 transition"
        >
          <span className="font-medium">Profile</span>
          <FaChevronRight />
        </li>

        <li
          onClick={() => navigate('/my-orders')}
          className="flex justify-between items-center border-b pb-3 cursor-pointer hover:text-blue-500 transition"
        >
          <span className="font-medium">My Orders</span>
          <FaChevronRight />
        </li>

        <li
          onClick={() => navigate('/help')}
          className="flex justify-between items-center border-b pb-3 cursor-pointer hover:text-blue-500 transition"
        >
          <span className="font-medium">Help & Support</span>
          <FaChevronRight />
        </li>
      </ul>

      {/* Logout */}
      <div className="mt-10">
        <button
          onClick={handleLogout}
          className="text-red-500 hover:underline font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default React.memo(UserProfile);
