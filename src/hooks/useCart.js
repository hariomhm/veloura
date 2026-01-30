import { useSelector, useDispatch } from "react-redux";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
} from "../store/cartSlice";
import useAuth from "./useAuth";
import useToast from "./useToast";

const useCart = () => {
  const dispatch = useDispatch();
  const { items, totalPrice, totalQuantity, loading, error } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useAuth();
  const { error: showError } = useToast();

  const addToCart = (product, quantity = 1, size = null) => {
    if (product.stock !== undefined && product.stock <= 0) {
      showError("This product is out of stock");
      return false;
    }
    dispatch(addToCartAction({ product, quantity, size }));
    return true;
  };

  const removeFromCart = (productId, size) => {
    dispatch(removeFromCartAction({ productId, size }));
  };

  const updateQuantity = (productId, size, quantity) => {
    dispatch(updateQuantityAction({ productId, size, quantity }));
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  return {
    items,
    totalPrice,
    totalQuantity,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};

export default useCart;
