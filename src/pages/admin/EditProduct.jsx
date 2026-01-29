import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById, updateProduct } from "../../store/productSlice";

const EditProduct = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [imageFiles, setImageFiles] = useState([]);
  const hasSubmitted = useRef(false);

  /* ---------- FETCH PRODUCT ---------- */
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  /* ---------- PREFILL FORM ---------- */
  useEffect(() => {
    if (!selectedProduct) return;

    setValue("name", selectedProduct.productName || selectedProduct.name);
    setValue("mrp", selectedProduct.mrp);
    setValue("discountPercent", selectedProduct.discountPercent || "");
    setValue("category", selectedProduct.category);
    setValue("gender", selectedProduct.gender);
    setValue("productType", selectedProduct.productType);
    setValue(
      "sizes",
      selectedProduct.sizes?.join(", ") || ""
    );
    setValue("description", selectedProduct.description);
    setValue("stock", selectedProduct.stock);
    setValue("color", selectedProduct.color || "");
    setValue("material", selectedProduct.material || "");
    setValue("pattern", selectedProduct.pattern || "");
    setValue("neckType", selectedProduct.neckType || "");
    setValue("sleeveLength", selectedProduct.sleeveLength || "");
    setValue("washCare", selectedProduct.washCare || "");
    setValue("countryOfOrigin", selectedProduct.countryOfOrigin || "");
    setValue("isFeatured", selectedProduct.isFeatured || false);
  }, [selectedProduct, setValue]);

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

  /* ---------- HANDLERS ---------- */
  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const onSubmit = (data) => {
    hasSubmitted.current = true;

    const productData = {
      ...data,
      images:
        imageFiles.length > 0
          ? imageFiles
          : selectedProduct.images || [],
    };

    dispatch(updateProduct({ productId, productData }));
  };

  /* ---------- SIDE EFFECTS ---------- */
  useEffect(() => {
    if (!hasSubmitted.current) return;

    if (!loading && !error) {
      alert("Product updated successfully!");
      navigate("/admin/manage-products");
      hasSubmitted.current = false;
    }

    if (error) {
      alert(`Failed to update product: ${error}`);
      hasSubmitted.current = false;
    }
  }, [loading, error, navigate]);

  /* ---------- STATES ---------- */
  if (loading && !selectedProduct) {
    return <div className="text-center py-12">Loading product…</div>;
  }

  if (error && !selectedProduct) {
    return (
      <div className="text-center py-12 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!selectedProduct) {
    return <div className="text-center py-12">Product not found.</div>;
  }

  /* ---------- UI ---------- */
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
        {/* NAME */}
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input
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
              {...register("mrp", { required: true, min: 0 })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Discount Percent
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
            {...register("category", { required: true })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {/* GENDER */}
        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select
            {...register("gender", { required: true })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        {/* SIZES */}
        <div>
          <label className="block mb-1 font-medium">
            Sizes (comma-separated)
          </label>
          <input
            {...register("sizes", { required: true })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {/* IMAGES */}
        <div>
          <label className="block mb-1 font-medium">
            Images (leave empty to keep current)
          </label>
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
            {...register("description", { required: true })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {/* PRODUCT TYPE */}
        <div>
          <label className="block mb-1 font-medium">Product Type</label>
          <input
            type="text"
            {...register("productType", { required: "Product type is required" })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.productType && (
            <p className="text-red-500 text-sm">{errors.productType.message}</p>
          )}
        </div>

        {/* OPTIONAL FIELDS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Color (optional)</label>
            <input
              type="text"
              {...register("color")}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Material (optional)</label>
            <input
              type="text"
              {...register("material")}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Pattern (optional)</label>
            <input
              type="text"
              {...register("pattern")}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Neck Type (optional)</label>
            <input
              type="text"
              {...register("neckType")}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Sleeve Length (optional)</label>
            <input
              type="text"
              {...register("sleeveLength")}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Wash Care (optional)</label>
            <input
              type="text"
              {...register("washCare")}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Country of Origin (optional)</label>
            <input
              type="text"
              {...register("countryOfOrigin")}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Is Featured</label>
            <input
              type="checkbox"
              {...register("isFeatured")}
              className="w-4 h-4"
            />
          </div>
        </div>

        {/* STOCK */}
        <div>
          <label className="block mb-1 font-medium">Stock</label>
          <input
            type="number"
            min="0"
            {...register("stock", { required: true, min: 0 })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Updating Product..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
