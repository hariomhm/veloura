import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWishlist, toggleWishlist as toggleWishlistAction, clearWishlist } from '../store/wishlistSlice';

const useWishlist = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlist, loading, loaded } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (isAuthenticated && user?.userDoc && !loaded) {
      dispatch(fetchWishlist());
    } else if (!isAuthenticated) {
      dispatch(clearWishlist());
    }
  }, [isAuthenticated, user, loaded, dispatch]);

  const handleToggleWishlist = (productId) => {
    if (!isAuthenticated || !user?.userDoc) return;
    dispatch(toggleWishlistAction(productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  return {
    wishlist,
    toggleWishlist: handleToggleWishlist,
    isInWishlist,
    loading,
  };
};

export default useWishlist;
