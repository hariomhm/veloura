import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchProductById,
  clearSelectedProduct,
} from "../store/productSlice";
import { addToCart } from "../store/cartSlice";
import config from "../config";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct?.sizes?.length) {
      setSelectedSize(selectedProduct.sizes[0]);
    }
  }, [selectedProduct]);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    dispatch(addToCart({ product: selectedProduct, size: selectedSize }));
  };

  if (loading)
    return <div className="text-center py-10">Loading product...</div>;

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error}
      </div>
    );

  if (!selectedProduct)
    return <div className="text-center py-10">Product not found</div>;

  const images =
    selectedProduct.imageUrls?.length > 0
      ? selectedProduct.imageUrls
      : ["/placeholder.png"];

  const discountedPrice = selectedProduct.sellingPrice || selectedProduct.mrp;

  const discountPercent =
    selectedProduct.discountPercent
      ? selectedProduct.discountPercent
      : 0;

  const outOfStock = selectedProduct.stock <= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* IMAGES */}
        <div>
          <img
            src={images[currentImageIndex]}
            alt={selectedProduct.name}
            className="w-full h-[420px] object-cover rounded-lg mb-4"
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

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
