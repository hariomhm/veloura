import { FaSlidersH } from "react-icons/fa";

const TopFilterBar = ({
  total,
  sortBy,
  setSortBy,
  onOpenFilters,
  priceRange,
  setPriceRange,
}) => {
  return (
    <div className="flex items-center justify-between border-b py-3 mb-6 text-sm">
      {/* LEFT */}
      <button
        onClick={onOpenFilters}
        className="flex items-center gap-2 font-medium"
      >
        <FaSlidersH />
        Filter
      </button>

      {/* CENTER */}
      <div className="flex items-center gap-6">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-transparent focus:outline-none"
        >
          <option value="relevance">Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>

        <span className="text-gray-600">
          {total} products
        </span>
      </div>

      {/* RIGHT (PRICE SLIDER PLACEHOLDER) */}
      <div className="hidden md:flex items-center gap-2">
        <input
          type="range"
          min={priceRange.min}
          max={priceRange.max}
          value={priceRange.value}
          onChange={(e) =>
            setPriceRange({ ...priceRange, value: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default TopFilterBar;
