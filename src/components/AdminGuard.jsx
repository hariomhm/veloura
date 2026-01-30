import useAdmin from "../hooks/useAdmin";

const AdminGuard = ({ children, fallback = null }) => {
  const { hasAdminAccess } = useAdmin();

  if (!hasAdminAccess) {
    if (fallback) return fallback;

    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

export default AdminGuard;
