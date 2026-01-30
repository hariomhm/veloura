import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProducts,
  deleteProduct,
} from "../../store/productSlice";
import config from "../../config";
import useToast from "../../hooks/useToast";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const ManageProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const { products, loading, error } = useSelector(
    (state) => state.products
  );
  const { error: showError } = useToast();

  const [deletingId, setDeletingId] = useState(null);

  /* ---------- FETCH PRODUCTS ---------- */
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  /* ---------- ACTIONS ---------- */
  const handleEdit = useCallback(
    (productId) => {
      navigate(`/admin/edit-product/${productId}`);
    },
    [navigate]
  );

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setDeletingId(productId);
      await dispatch(deleteProduct(productId)).unwrap();
    } catch (err) {
      showError(`Failed to delete product: ${err}`);
    } finally {
      setDeletingId(null);
    }
  };

  /* ---------- TABLE COLUMNS ---------- */
  const columns = useMemo(
    () => [
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ getValue }) =>
          getValue() ? (
            <img
              src={getValue()}
              alt="Product"
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-xs">
              No Image
            </div>
          ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue()}</span>
        ),
      },
      {
        accessorKey: "mrp",
        header: "MRP",
        cell: ({ getValue }) =>
          `${config.currencySymbol}${getValue()}`,
      },
      {
        accessorKey: "stock",
        header: "Stock",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(row.original.$id)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(row.original.$id)}
              disabled={deletingId === row.original.$id}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
            >
              {deletingId === row.original.$id
                ? "Deleting…"
                : "Delete"}
            </button>
          </div>
        ),
      },
    ],
    [handleEdit, deletingId]
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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

  /* ---------- STATES ---------- */
  if (loading) {
    return <div className="text-center py-12">Loading products…</div>;
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
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>

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

        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
