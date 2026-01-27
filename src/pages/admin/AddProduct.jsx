import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../store/productSlice";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.products);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [imageFiles, setImageFiles] = useState([]);
  const hasSubmitted = useRef(false);

  /* ---------- ADMIN GUARD ---------- */
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  /* ---------- HANDLERS ---------- */
  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const onSubmit = (data) => {
    if (!imageFiles.length) {
      alert("Please upload at least one product image.");
      return;
    }

    hasSubmitted.current = true;

    dispatch(
      addProduct({
        ...data,
        images: imageFiles,
      }),
    );
  };

  /* ---------- SIDE EFFECTS ---------- */
  useEffect(() => {
    if (!hasSubmitted.current) return;

    if (!loading && !error) {
      alert("Product added successfully!");
      reset();
      setImageFiles([]);
      hasSubmitted.current = false;
    }

    if (error) {
      alert(`Failed to add product: ${error}`);
      hasSubmitted.current = false;
    }
  }, [loading, error, reset]);

  /* ---------- UI ---------- */
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
        {/* PRODUCT NAME */}
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input
            type="text"
            {...register("name", { required: "Product name is required" })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* MRP */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">MRP</label>
            <input
              type="number"
              min="0"
              step="0.01"
              {...register("mrp", {
                required: "MRP is required",
                min: 0,
              })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.mrp && (
              <p className="text-red-500 text-sm">{errors.mrp.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Discount Percent (optional)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              {...register("discountPercent")}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            type="text"
            {...register("category", { required: "Category is required" })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        {/* GENDER */}
        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select
            {...register("gender", { required: "Gender is required" })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
            <option value="Kids">Kids</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender.message}</p>
          )}
        </div>

        {/* SIZES */}
        <div>
          <label className="block mb-1 font-medium">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            placeholder="S, M, L, XL"
            {...register("sizes", { required: "Sizes are required" })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.sizes && (
            <p className="text-red-500 text-sm">{errors.sizes.message}</p>
          )}
        </div>

        {/* IMAGES */}
        <div>
          <label className="block mb-1 font-medium">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            rows="4"
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* STOCK */}
        <div>
          <label className="block mb-1 font-medium">Stock</label>
          <input
            type="number"
            min="0"
            {...register("stock", {
              required: "Stock is required",
              min: 0,
            })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm">{errors.stock.message}</p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
