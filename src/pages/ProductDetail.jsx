import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProductById, clearSelectedProduct } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import config from '../config';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error } = useSelector(state => state.products);
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct && selectedProduct.sizes && selectedProduct.sizes.length > 0) {
      if (!selectedSize || !selectedProduct.sizes.includes(selectedSize)) {
        setSelectedSize(selectedProduct.sizes[0]);
      }
    }
  }, [selectedProduct]);

  const handleAddToCart = () => {
    if (selectedProduct && selectedSize) {
      dispatch(addToCart({ product: selectedProduct, size: selectedSize }));
    }
  };

  if (loading) return <div className="text-center py-10">Loading product...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!selectedProduct) return <div className="text-center py-10">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={selectedProduct.imageUrls ? selectedProduct.imageUrls[currentImageIndex] : selectedProduct.image} alt={selectedProduct.name} className="w-full h-96 object-cover rounded-lg mb-4" />
          {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {selectedProduct.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${selectedProduct.name} ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${index === currentImageIndex ? 'border-blue-500' : 'border-gray-300'}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{selectedProduct.name}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedProduct.description}</p>
          <p className="text-2xl font-bold text-green-600 mb-4">{config.currencySymbol}{selectedProduct.price}</p>
          {selectedProduct.discountPrice && selectedProduct.discountPrice < selectedProduct.price && (
            <p className="text-lg text-red-500 mb-4">Discount: {config.currencySymbol}{selectedProduct.discountPrice}</p>
          )}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Size:</h3>
            <div className="flex gap-2">
              {selectedProduct.sizes && selectedProduct.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded ${selectedSize === size ? 'bg-blue-500 text-white' : 'bg-white text-black dark:bg-gray-700 dark:text-white'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
