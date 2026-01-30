import { memo } from "react";
import ProductCard from "./ProductCard";

const ProductGrid = memo(({ products = [] }) => {
  if (!products.length) {
    return (
      <main className="w-full lg:w-3/4 flex items-center justify-center py-20">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No products found.
        </p>
      </main>
    );
  }

  return (
    <main className="w-full lg:w-3/4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.$id} product={product} />
        ))}
      </div>
    </main>
  );
});

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;
