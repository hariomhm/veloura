import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBanners, updateBanner } from '../../store/bannerSlice';
import config from '../../config';

const ManageBanners = () => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const { banners, loading, error } = useSelector((state) => state.banners);
  const dispatch = useDispatch();
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({ link: '', image: null });

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchBanners());
    }
  }, [dispatch, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner.$id);
    setFormData({ link: banner.link || '', image: null });
  };

  const handleSave = () => {
    dispatch(updateBanner({ bannerId: editingBanner, bannerData: formData }))
      .unwrap()
      .then(() => {
        setEditingBanner(null);
        setFormData({ link: '', image: null });
        dispatch(fetchBanners()); // Refetch to update list
      })
      .catch((error) => {
        alert('Failed to update banner: ' + error);
      });
  };

  const handleCancel = () => {
    setEditingBanner(null);
    setFormData({ link: '', image: null });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (loading) return <div className="text-center py-10">Loading banners...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Banners</h1>
      <div className="space-y-4">
        {banners.map(banner => (
          <div key={banner.$id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            {editingBanner === banner.$id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Link</label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter banner link"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Banner ID: {banner.$id}</p>
                  <p>Link: {banner.link || 'No link'}</p>
                  {banner.imageUrl && (
                    <img src={banner.imageUrl} alt="Banner" className="w-32 h-20 object-cover mt-2" />
                  )}
                </div>
                <button
                  onClick={() => handleEdit(banner)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBanners;
