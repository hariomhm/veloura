import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import { useSearchParams } from "react-router-dom";

import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import TopFilterBar from "../components/TopFilterBar";
import FilterDrawer from "../components/FilterDrawer";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { FaSearch } from "react-icons/fa";
import Seo from "../components/Seo";

import useFilteredProducts from "../hooks/useFilteredProducts";
import useDebounce from "../hooks/useDebounce";

const CategoryPage = ({ gender, title, seoPath = "/products" }) => {
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
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
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

  /* SYNC SEARCH PARAM */
  useEffect(() => {
    const fromUrl = searchParams.get("search") || "";
    if (fromUrl !== searchTerm) {
      setSearchTerm(fromUrl);
    }
  }, [searchParams, searchTerm]);

  /* FILTER OPTIONS */
  const categories = useMemo(
    () => [...new Set(products.map(p => p.category).filter(Boolean))],
    [products]
  );

  const brands = useMemo(
    () => [...new Set(products.map(p => p.brand).filter(Boolean))],
    [products]
  );

  const sizes = useMemo(
    () => [...new Set(products.flatMap(p => p.sizes || []).filter(Boolean))],
    [products]
  );

  const colors = useMemo(
    () => [...new Set(products.map(p => p.color).filter(Boolean))],
    [products]
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleOpenFilters = useCallback(() => setShowFilters(true), []);
  const handleCloseFilters = useCallback(() => setShowFilters(false), []);

  /* FILTERED PRODUCTS (gender locked) */
  const filteredProducts = useFilteredProducts({
    products,
    gender,
    searchTerm: debouncedSearchTerm,
    selectedCategory,
    selectedBrand,
    selectedSize,
    selectedColor,
    minPrice,
    maxPrice,
    sortBy,
    priceRange,
  });

  if (loading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} />;

  return (
    <div className="max-w-350 mx-auto px-4 py-6">
      <Seo
        title={title}
        description={`Browse ${title} on Veloura. Filter by size, color, price, and more.`}
        url={seoPath}
      />
      {/* BREADCRUMB */}
      <div className="text-sm text-gray-500 mb-4">
        Home / Collections /{" "}
        <span className="text-gray-900 font-medium">{title}</span>
      </div>

      {/* TOP FILTER BAR (same as Products) */}
      <TopFilterBar
        total={filteredProducts.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onOpenFilters={handleOpenFilters}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      {/* PRODUCTS GRID */}
      {filteredProducts.length ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="text-center py-20">
          <FaSearch className="mx-auto text-6xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Products Found</h2>
          <p className="text-gray-500">Try adjusting your filters or search terms.</p>
        </div>
      )}

      {/* FILTER DRAWER (mobile – SAME as Products) */}
      <FilterDrawer
        isOpen={showFilters}
        onClose={handleCloseFilters}
      >
        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          brands={brands}
          sizes={sizes}
          colors={colors}
          showGenderFilter={false} // gender is locked
        />
      </FilterDrawer>
    </div>
  );
};

export default CategoryPage;
