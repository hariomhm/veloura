import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import { useSearchParams } from "react-router-dom";

import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import TopFilterBar from "../components/TopFilterBar";
import FilterDrawer from "../components/FilterDrawer";
import Loading from "../components/Loading";
import Error from "../components/Error";

import useFilteredProducts from "../hooks/useFilteredProducts";

const CategoryPage = ({ gender, title }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((s) => s.products);
  const [searchParams] = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);

  /* FILTER STATE */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedBrand, setSelectedBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 5000,
    value: 5000,
  });

  /* FETCH PRODUCTS */
  useEffect(() => {
    if (!products.length) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  /* FILTER OPTIONS */
  const categories = useMemo(
    () => [...new Set(products.map(p => p.category).filter(Boolean))],
    [products]
  );

  const brands = useMemo(
    () => [...new Set(products.map(p => p.brand).filter(Boolean))],
    [products]
  );

  /* FILTERED PRODUCTS (gender locked) */
  const filteredProducts = useFilteredProducts({
    products,
    gender,
    searchTerm,
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    sortBy,
    priceRange,
  });

  if (loading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} />;

  return (
    <div className="max-w-350 mx-auto px-4 py-6">
      {/* BREADCRUMB */}
      <div className="text-sm text-gray-500 mb-4">
        Home / Collections /{" "}
        <span className="text-gray-900 font-medium">{title}</span>
      </div>

      {/* BANNER */}
      {!Array.isArray(gender) && (
        <section className="relative h-[50vh] mb-8">
          <img
            src={`/${gender.toLowerCase()}${gender.toLowerCase() === 'kids' ? '' : 's'}bannerimage.png`}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">{title}</h1>
          </div>
        </section>
      )}

      {/* TOP FILTER BAR (same as Products) */}
      <TopFilterBar
        total={filteredProducts.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onOpenFilters={() => setShowFilters(true)}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      {/* PRODUCTS GRID */}
      {filteredProducts.length ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="text-center py-20 text-gray-500">
          No products found
        </div>
      )}

      {/* FILTER DRAWER (mobile – SAME as Products) */}
      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      >
        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          brands={brands}
          showGenderFilter={false} // gender is locked
        />
      </FilterDrawer>
    </div>
  );
};

export default CategoryPage;
