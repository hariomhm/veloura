import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, banUser, unbanUser } from "../../store/userSlice";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const ManageUsers = () => {
  const dispatch = useDispatch();

  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const { users, loading, error } = useSelector((state) => state.users);

  const [actionUserId, setActionUserId] = useState(null);

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

  /* ---------- FETCH USERS ---------- */
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  /* ---------- ACTION HANDLERS ---------- */
  const handleBan = async (userId) => {
    try {
      setActionUserId(userId);
      await dispatch(banUser(userId)).unwrap();
    } catch (err) {
      alert(`Failed to ban user: ${err}`);
    } finally {
      setActionUserId(null);
    }
  };

  const handleUnban = async (userId) => {
    try {
      setActionUserId(userId);
      await dispatch(unbanUser(userId)).unwrap();
    } catch (err) {
      alert(`Failed to unban user: ${err}`);
    } finally {
      setActionUserId(null);
    }
  };

  /* ---------- TABLE COLUMNS ---------- */
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ getValue }) => (
          <span className="font-medium">
            {getValue() || "No name"}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => (
          <span className="font-mono text-sm">{getValue()}</span>
        ),
      },
      {
        accessorKey: "banned",
        header: "Status",
        cell: ({ getValue }) => (
          <span
            className={`text-sm font-semibold ${
              getValue() ? "text-red-500" : "text-green-500"
            }`}
          >
            {getValue() ? "Banned" : "Active"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const isBanned = row.original.banned;
          const isLoading = actionUserId === row.original.$id;

          return (
            <button
              onClick={() =>
                isBanned
                  ? handleUnban(row.original.$id)
                  : handleBan(row.original.$id)
              }
              disabled={isLoading}
              className={`px-3 py-1 rounded text-sm text-white disabled:opacity-50 ${
                isBanned
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isLoading
                ? "Processing…"
                : isBanned
                ? "Unban"
                : "Ban"}
            </button>
          );
        },
      },
    ],
    [actionUserId]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  /* ---------- STATES ---------- */
  if (loading) {
    return <div className="text-center py-12">Loading users…</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Error: {error}
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={
                      header.column.getToggleSortingHandler?.()
                    }
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
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
                  <td
                    key={cell.id}
                    className="px-4 py-4 whitespace-nowrap"
                  >
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

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
