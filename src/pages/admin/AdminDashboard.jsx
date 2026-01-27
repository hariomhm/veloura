import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaListAlt,
  FaShoppingBag,
  FaImages,
  FaUsers,
} from "react-icons/fa";

const dashboardCards = [
  {
    title: "Add New Product",
    description: "Add new products to the store inventory.",
    path: "/admin/add-product",
    icon: FaBoxOpen,
  },
  {
    title: "Manage Products",
    description: "View, edit, and delete products.",
    path: "/admin/manage-products",
    icon: FaListAlt,
  },
  {
    title: "Manage Orders",
    description: "View and update order statuses.",
    path: "/admin/manage-orders",
    icon: FaShoppingBag,
  },
  {
    title: "Manage Banners",
    description: "Update homepage banners.",
    path: "/admin/manage-banners",
    icon: FaImages,
  },
  {
    title: "Manage Users",
    description: "View and manage user accounts.",
    path: "/admin/manage-users",
    icon: FaUsers,
  },
];

const AdminDashboard = () => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const navigate = useNavigate();

  /* ---------- ADMIN GUARD ---------- */
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-10">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map(({ title, description, path, icon: Icon }) => (
          <button
            key={title}
            onClick={() => navigate(path)}
            className="
              bg-white dark:bg-gray-800
              p-6 rounded-lg shadow
              text-left
              hover:shadow-lg hover:scale-[1.02]
              transition-all
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          >
            <Icon className="text-blue-600 text-2xl mb-3" />
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
