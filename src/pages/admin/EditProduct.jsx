import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, updateProduct } from '../../store/productSlice';

const EditProduct = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, loading, error } = useSelector((state) => state.products);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (selectedProduct) {
      setValue('name', selectedProduct.productName || selectedProduct.name);
      setValue('price', selectedProduct.price);
      setValue('discountPrice', selectedProduct.discountPrice || '');
      setValue('category', selectedProduct.category);
      setValue('gender', selectedProduct.gender);
      setValue('sizes', selectedProduct.sizes ? selectedProduct.sizes.join(', ') : '');
      setValue('description', selectedProduct.description);
      setValue('stock', selectedProduct.stock);
    }
  }, [selectedProduct, setValue]);

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const onSubmit = (data) => {
    const productData = { ...data, images: imageFiles.length > 0 ? imageFiles : selectedProduct.images };
    dispatch(updateProduct({ productId, productData }))
      .unwrap()
      .then(() => {
        alert('Product updated successfully!');
        navigate('/admin/manage-products');
      })
      .catch((error) => {
        alert(`Failed to update product: ${error}`);
      });
  };

  if (loading) return <div className="text-center py-10">Loading product...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!selectedProduct) return <div className="text-center py-10">Product not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div>
          <label className="block mb-1">Product Name</label>
          <input
            type="text"
            {...register('name', { required: 'Product name is required' })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              {...register('price', { required: 'Price is required', min: 0 })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block mb-1">Discount Price (optional)</label>
            <input
              type="number"
              step="0.01"
              {...register('discountPrice', { min: 0 })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <input
            type="text"
            {...register('category', { required: 'Category is required' })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Gender</label>
          <select
            {...register('gender', { required: 'Gender is required' })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
            <option value="Kids">Kids</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Sizes (comma-separated)</label>
          <input
            type="text"
            {...register('sizes', { required: 'Sizes are required' })}
            placeholder="S, M, L, XL"
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.sizes && <p className="text-red-500 text-sm">{errors.sizes.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Images (leave empty to keep current)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows="4"
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Stock</label>
          <input
            type="number"
            {...register('stock', { required: 'Stock is required', min: 0 })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Updating Product...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
