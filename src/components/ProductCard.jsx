import { memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import config from "../config";
import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";
import useToast from "../hooks/useToast";
import { getSellingPrice, getDiscountPercent } from "../lib/utils";

const ProductCard = memo(({ product }) => {
  const { items: cartItems, addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error } = useToast();

  const productData = useMemo(() => ({
    productName: product.name || "Product",
    imageSrc: product.image || product.imageUrl?.[0] || "/placeholder-product.png",
    mrp: product.mrp,
    sellingPrice: getSellingPrice(product),
    discountPercent: getDiscountPercent(product),
  }), [product]);

  const isInCart = useMemo(() =>
    cartItems.some(item => item.product.$id === product.$id),
    [cartItems, product.$id]
  );

  const isWishlisted = useMemo(() =>
    isInWishlist(product.$id),
    [isInWishlist, product.$id]
  );

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) {
      error("Product already in cart!");
      return;
    }
    if (addToCart(product)) {
      success("Added to cart!");
    }
  }, [isInCart, addToCart, product, error, success]);

  const handleToggleWishlist = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.$id);
  }, [toggleWishlist, product.$id]);

  return (
    <Link to={`/product/${product.slug}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all duration-300 group">
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={productData.imageSrc}
          alt={productData.productName}
          className="w-full aspect-3/4 object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />

        {/* HOVER ICONS */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all ${isWishlisted ? 'text-red-500' : 'text-gray-600'}`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FaHeart className={isWishlisted ? 'fill-current' : ''} />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all text-gray-600"
            aria-label="Add to cart"
          >
            <FaShoppingCart />
          </button>
        </div>

        {/* DISCOUNT BADGE */}
        {productData.discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {productData.discountPercent}% OFF
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="px-2 py-3">
        {/* PRODUCT NAME */}
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 line-clamp-2">
          {productData.productName}
        </h3>

        {/* PRICE ROW */}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {config.currencySymbol}{productData.sellingPrice}
          </span>

          {productData.mrp && productData.mrp > productData.sellingPrice && (
            <span className="text-sm text-gray-500 line-through">
              {config.currencySymbol}{productData.mrp}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;
