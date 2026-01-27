const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedGender,
  setSelectedGender,
  selectedBrand,
  setSelectedBrand,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  categories = [],
  genders = [],
  brands = [],
  showGenderFilter = true,
  onReset,
}) => {
  return (
    <aside className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>

        {typeof onReset === "function" && (
          <button
            onClick={onReset}
            className="text-xs text-blue-600 hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Search
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* CATEGORY */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* GENDER */}
      {showGenderFilter && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Gender
          </label>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">All Genders</option>
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* BRAND */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Brand
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* PRICE */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Price Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 p-2 border rounded-md"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 p-2 border rounded-md"
          />
        </div>
      </div>

      {/* SORT */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="relevance">Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </aside>
  );
};

export default ProductFilters;
