import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanners, updateBanner } from "../../store/bannerSlice";

const ManageBanners = () => {
  const dispatch = useDispatch();
  const { banners, loading, error } = useSelector((state) => state.banners);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const [editingBannerId, setEditingBannerId] = useState(null);
  const [formData, setFormData] = useState({ link: "", image: null });
  const hasSubmitted = useRef(false);

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

  /* ---------- FETCH BANNERS ---------- */
  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  /* ---------- HANDLERS ---------- */
  const handleEdit = (banner) => {
    setEditingBannerId(banner.$id);
    setFormData({
      link: banner.link || "",
      image: null,
    });
  };

  const handleCancel = () => {
    setEditingBannerId(null);
    setFormData({ link: "", image: null });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    if (!editingBannerId) return;

    hasSubmitted.current = true;

    dispatch(
      updateBanner({
        bannerId: editingBannerId,
        bannerData: formData,
      })
    );
  };

  /* ---------- SIDE EFFECTS ---------- */
  useEffect(() => {
    if (!hasSubmitted.current) return;

    if (!loading && !error) {
      setEditingBannerId(null);
      setFormData({ link: "", image: null });
      hasSubmitted.current = false;
      dispatch(fetchBanners());
    }

    if (error) {
      alert(`Failed to update banner: ${error}`);
      hasSubmitted.current = false;
    }
  }, [loading, error, dispatch]);

  /* ---------- STATES ---------- */
  if (loading && !banners.length) {
    return <div className="text-center py-12">Loading banners…</div>;
  }

  if (error && !banners.length) {
    return (
      <div className="text-center py-12 text-red-500">
        Error: {error}
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Manage Banners</h1>

      <div className="space-y-4">
        {banners.map((banner) => (
          <div
            key={banner.$id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
          >
            {editingBannerId === banner.$id ? (
              <div className="space-y-4">
                {/* LINK */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Banner Link
                  </label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                {/* IMAGE */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Banner Image (optional)
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save"}
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
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    Banner ID: {banner.$id}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Link: {banner.link || "No link"}
                  </p>

                  {banner.imageUrl && (
                    <img
                      src={banner.imageUrl}
                      alt="Banner"
                      className="w-40 h-24 object-cover rounded mt-3"
                    />
                  )}
                </div>

                <button
                  onClick={() => handleEdit(banner)}
                  className="self-start px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
