import { memo } from "react";
import { Link } from "react-router-dom";
import config from "../config";

/* ---------- HELPERS ---------- */
const getSellingPrice = (product) => product.sellingPrice ?? product.price;

const ProductCard = memo(({ product }) => {
  const productName = product.productName || "Product";

  const imageSrc =
    product.image ||
    product.imageUrls?.[0] ||
    "/placeholder-product.png";

  const mrp = product.mrp;
  const sellingPrice = getSellingPrice(product);
  const discountPercent =
    mrp && mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : product.discountPercent || 0;

  return (
    <Link
      to={`/product/${product.$id}`}
      className="block bg-white dark:bg-gray-800"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={productName}
          className="w-full aspect-[3/4] object-cover"
          loading="lazy"
        />
      </div>

      {/* DETAILS */}
      <div className="px-2 py-3">
        {/* PRODUCT NAME */}
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 line-clamp-2">
          {productName}
        </h3>

        {/* PRICE ROW */}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            {config.currencySymbol}
            {sellingPrice}
          </span>

          {mrp && mrp > sellingPrice && (
            <>
              <span className="text-sm text-gray-500 line-through">
                {config.currencySymbol}
                {mrp}
              </span>

              <span className="text-sm font-medium text-red-600">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;
