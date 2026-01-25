import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { account } from '../lib/appwrite';
import config from '../config';
import { FaChevronRight } from 'react-icons/fa';

const UserProfile = () => {
  const { userData: user } = useSelector(state => state.auth);
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/" className="text-blue-500 hover:underline">Back</Link>
      </div>
      <h1 className="text-3xl font-bold mb-8">HELLO, {user.name}!</h1>
      <ul className="space-y-4">
        <li className="flex justify-between items-center border-b pb-2">
          <span>PROFILE</span>
          <FaChevronRight />
        </li>
        <li className="flex justify-between items-center border-b pb-2">
          <span>PURCHASES</span>
          <FaChevronRight />
        </li>
        <li className="flex justify-between items-center border-b pb-2">
          <span>HELP</span>
          <FaChevronRight />
        </li>
      </ul>
      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="text-blue-500 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default React.memo(UserProfile);
