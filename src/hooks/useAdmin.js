import { useSelector } from "react-redux";

export default function useAdmin() {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return {
    isAdmin,
    isAuthenticated,
    hasAdminAccess: isAdmin && isAuthenticated,
  };
}
