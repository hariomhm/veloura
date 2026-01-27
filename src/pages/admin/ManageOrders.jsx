import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { databases } from "../../lib/appwrite";
import config from "../../config";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const ManageOrders = () => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  /* ---------- ADMIN GUARD ---------- */
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">
          Access Denied
        </h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  /* ---------- FETCH ORDERS ---------- */
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID
      );

      setOrders(response.documents);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ---------- UPDATE STATUS ---------- */
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID,
        orderId,
        { status: newStatus }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.$id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ---------- FILTERING ---------- */
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        !searchTerm ||
        order.$id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        !statusFilter || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  /* ---------- TABLE COLUMNS ---------- */
  const columns = useMemo(
    () => [
      {
        accessorKey: "$id",
        header: "Order ID",
        cell: ({ getValue }) => (
          <span className="font-mono text-sm">{getValue()}</span>
        ),
      },
      {
        accessorKey: "userId",
        header: "User ID",
        cell: ({ getValue }) => (
          <span className="font-mono text-sm">
            {getValue() || "—"}
          </span>
        ),
      },
      {
        accessorFn: (row) => row.totalAmount || row.total || 0,
        header: "Total",
        cell: ({ getValue }) =>
          `${config.currencySymbol}${getValue()}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue, row }) => (
          <select
            value={getValue()}
            disabled={updatingId === row.original.$id}
            onChange={(e) =>
              updateOrderStatus(
                row.original.$id,
                e.target.value
              )
            }
            className="px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ getValue }) =>
          getValue()
            ? new Date(getValue()).toLocaleDateString()
            : "—",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => {
              const order = row.original;
              console.log("Order details:", order);
              alert(
                order.products
                  ?.map(
                    (p) =>
                      `${p.name} (${p.size}) x${p.quantity} - ${config.currencySymbol}${p.price}`
                  )
                  .join("\n") || "No products"
              );
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            View Products
          </button>
        ),
      },
    ],
    [updateOrderStatus, updatingId]
  );

  const table = useReactTable({
    data: filteredOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  /* ---------- STATES ---------- */
  if (loading) {
    return <div className="text-center py-12">Loading orders…</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        {error}
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

      {/* SEARCH + FILTER */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by Order ID or User ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler?.()}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
