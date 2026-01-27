import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import ProductGrid from "../components/ProductGrid";
import ProductFilters from "../components/ProductFilters";
import TopFilterBar from "../components/TopFilterBar";
import FilterDrawer from "../components/FilterDrawer";
import Loading from "../components/Loading";
import Error from "../components/Error";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  const [showFilters, setShowFilters] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 5000,
    value: 5000,
  });

  useEffect(() => {
    if (!products.length) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  const categories = useMemo(
    () => [...new Set(products.map(p => p.category).filter(Boolean))],
    [products]
  );

  const genders = useMemo(
    () => [...new Set(products.map(p => p.gender).filter(Boolean))],
    [products]
  );

  const brands = useMemo(
    () => [...new Set(products.map(p => p.brand).filter(Boolean))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const name = (p.productName || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const price = p.sellingPrice ?? p.price ?? 0;
      const term = searchTerm.toLowerCase();

      return (
        (!term || name.includes(term) || desc.includes(term)) &&
        (!selectedCategory || p.category === selectedCategory) &&
        (!selectedGender || p.gender === selectedGender) &&
        (!selectedBrand || p.brand === selectedBrand) &&
        (!minPrice || price >= Number(minPrice)) &&
        (!maxPrice || price <= Number(maxPrice)) &&
        price <= priceRange.value
      );
    });

    if (sortBy === "price-low") {
      list.sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.sellingPrice - a.sellingPrice);
    }

    return list;
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedGender,
    selectedBrand,
    minPrice,
    maxPrice,
    sortBy,
    priceRange.value,
  ]);

  if (loading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} />;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* BREADCRUMB */}
      <div className="text-sm text-gray-500 mb-4">
        Home / Collections /{" "}
        <span className="text-gray-900 font-medium">
          Vastrado shop all
        </span>
      </div>

      {/* TOP FILTER BAR */}
      <TopFilterBar
        total={filteredProducts.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onOpenFilters={() => setShowFilters(true)}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      {/* PRODUCTS */}
      {filteredProducts.length ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="text-center py-20 text-gray-500">
          No products found
        </div>
      )}

      {/* FILTER DRAWER */}
      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      >
        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          genders={genders}
          brands={brands}
          showGenderFilter
        />
      </FilterDrawer>
    </div>
  );
};

export default Products;
