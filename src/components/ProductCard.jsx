import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import config from '../config';
import { FaShoppingCart } from 'react-icons/fa';

const ProductCard = React.memo(({ product }) => {
  const dispatch = useDispatch();

  const productName = product.productName || product.name;
  const imageSrc = product.imageUrls ? product.imageUrls[0] : product.image;
  const discountedPrice = product.priceafterdiscount || product.discountPrice || Math.round(product.price * 0.9);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    dispatch(addToCart({ product }));
  }, [dispatch, product]);

  return (
    <Link to={`/product/${product.$id}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={imageSrc} alt={productName} className="w-full h-48 object-cover" loading="lazy" />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{productName}</h2>
        <p className="text-lg text-gray-500 line-through mb-1">{config.currencySymbol}{product.price}</p>
        <p className="text-2xl font-bold text-green-600 mb-4">{config.currencySymbol}{discountedPrice}</p>
        <button
          onClick={handleAddToCart}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors flex items-center justify-center"
        >
          <FaShoppingCart className="mr-2" />
          Add to Cart
        </button>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
