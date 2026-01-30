import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    loading,
    isAdmin: user?.userDoc?.role === 'admin' || user?.prefs?.role === 'admin',
    isUser: user?.userDoc?.role === 'user' || user?.prefs?.role === 'user',
  };
};

export default useAuth;
