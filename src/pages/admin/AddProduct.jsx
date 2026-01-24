import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { databases, storage, ID } from '../../lib/appwrite';

const AddProduct = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Upload images to Appwrite Storage
      const imageIds = [];
      for (const file of imageFiles) {
        const response = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          ID.unique(),
          file
        );
        imageIds.push(response.$id);
      }

      // Create product document
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID,
        ID.unique(),
        {
          name: data.name,
          price: parseFloat(data.price),
          discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
          category: data.category,
          sizes: data.sizes.split(',').map(s => s.trim()),
          images: imageIds,
          description: data.description,
          stock: parseInt(data.stock),
        }
      );

      alert('Product added successfully!');
      reset();
      setImageFiles([]);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
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
          <label className="block mb-1">Images</label>
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
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
