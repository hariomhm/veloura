import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    loading,
    isAdmin: user?.prefs?.role === 'admin',
    isUser: user?.prefs?.role === 'user',
  };
};

export default useAuth;
