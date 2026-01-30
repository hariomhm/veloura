import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, banUser, unbanUser, updateUserRole } from "../../store/userSlice";
import useToast from "../../hooks/useToast";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const { error: showError } = useToast();

  const [actionUserId, setActionUserId] = useState(null);

  /* ---------- FETCH USERS ---------- */
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  /* ---------- ACTION HANDLERS ---------- */
  const handleBan = useCallback(async (userId) => {
    try {
      const banReason = prompt("Enter ban reason (optional):");
      setActionUserId(userId);
      await dispatch(banUser({ userId, banReason })).unwrap();
    } catch (err) {
      showError(`Failed to ban user: ${err}`);
    } finally {
      setActionUserId(null);
    }
  }, [dispatch, showError]);

  const handleUnban = useCallback(async (userId) => {
    try {
      setActionUserId(userId);
      await dispatch(unbanUser(userId)).unwrap();
    } catch (err) {
      showError(`Failed to unban user: ${err}`);
    } finally {
      setActionUserId(null);
    }
  }, [dispatch, showError]);

  const handleToggleRole = useCallback(async (userId, currentRole) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      setActionUserId(userId);
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      // Refetch users to update the table
      dispatch(fetchUsers());
    } catch (err) {
      showError(`Failed to update user role: ${err}`);
    } finally {
      setActionUserId(null);
    }
  }, [dispatch, showError]);



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
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue, row }) => {
          const role = getValue() || "user";
          const isLoading = actionUserId === row.original.$id;
          return (
            <button
              onClick={() => handleToggleRole(row.original.$id, role)}
              disabled={isLoading}
              className={`px-3 py-1 rounded text-sm text-white disabled:opacity-50 ${
                role === "admin"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              {isLoading ? "Updating…" : role === "admin" ? "Admin" : "User"}
            </button>
          );
        },
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
          const isBanned = row.original.isBanned;
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
    [actionUserId, handleBan, handleUnban, handleToggleRole]
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
