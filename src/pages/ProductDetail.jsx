import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchProductBySlug,
  clearSelectedProduct,
} from "../store/productSlice";
import useCart from "../hooks/useCart";
import config from "../config";
import { getSellingPrice, getDiscountPercent } from "../lib/utils";
import Skeleton from "../components/Skeleton";

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (slug) dispatch(fetchProductBySlug(slug));
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, slug]);

  useEffect(() => {
    if (selectedProduct?.sizes?.length && !selectedSize) {
      setSelectedSize(selectedProduct.sizes[0]);
    }
  }, [selectedProduct, selectedSize]);

const handleAddToCart = () => {
  if (!selectedSize) return;

  addToCart(selectedProduct, 1, selectedSize);
};


  const handleBuyNow = () => {
    if (!selectedSize) return;
    if (addToCart(selectedProduct, 1, selectedSize)) {
      navigate('/checkout');
    }
  };

  if (loading)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image Skeleton */}
          <div>
            <Skeleton className="w-full h-105 rounded-lg mb-4" />
            <div className="flex gap-2">
              <Skeleton className="w-20 h-20 rounded" />
              <Skeleton className="w-20 h-20 rounded" />
              <Skeleton className="w-20 h-20 rounded" />
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-6 w-1/4" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-16 rounded" />
              <Skeleton className="h-10 w-16 rounded" />
              <Skeleton className="h-10 w-16 rounded" />
            </div>
            <Skeleton className="h-10 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error}
      </div>
    );

  if (!selectedProduct)
    return <div className="text-center py-10">Product not found</div>;

  const images =
    selectedProduct.imageUrl?.length > 0
      ? selectedProduct.imageUrl
      : ["/placeholder.png"];

  const discountedPrice = getSellingPrice(selectedProduct);

  const discountPercent = getDiscountPercent(selectedProduct);

  const outOfStock = selectedProduct.stock <= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* IMAGES */}
        <div>
          <img
            src={images[currentImageIndex]}
            alt={selectedProduct.name}
            className="w-full h-105 object-cover rounded-lg mb-4"
          />

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`thumb-${index}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    index === currentImageIndex
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold mb-3">
            {selectedProduct.name}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {selectedProduct.description}
          </p>

          {/* PRICE */}
          <div className="mb-4">
            {discountedPrice < selectedProduct.mrp && (
              <p className="text-gray-400 line-through text-lg">
                {config.currencySymbol}
                {selectedProduct.mrp}
              </p>
            )}
            <p className="text-3xl font-bold text-green-600">
              {config.currencySymbol}
              {discountedPrice}
            </p>
            {discountPercent > 0 && (
              <p className="text-red-500 font-medium">
                {discountPercent}% OFF
              </p>
            )}
          </div>

          {/* SIZE */}
          {selectedProduct.sizes?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Size</h3>
              <div className="flex gap-2 flex-wrap">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STOCK */}
          <p
            className={`mb-4 font-medium ${
              outOfStock ? "text-red-500" : "text-green-600"
            }`}
          >
            {outOfStock ? "Out of Stock" : "In Stock"}
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Add ${selectedProduct.name} to cart${selectedSize ? ` in size ${selectedSize}` : ''}`}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Buy ${selectedProduct.name} now${selectedSize ? ` in size ${selectedSize}` : ''}`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
