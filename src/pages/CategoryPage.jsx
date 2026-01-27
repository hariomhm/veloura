import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import { useSearchParams } from "react-router-dom";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import Loading from "../components/Loading";
import Error from "../components/Error";

const CategoryPage = ({ gender, title }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedBrand, setSelectedBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("name");

  /* Fetch only once */
  useEffect(() => {
    if (!products.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  /* Derived filters */
  const categories = useMemo(
    () => [...new Set(products.map(p => p.category).filter(Boolean))],
    [products]
  );

  const brands = useMemo(
    () => [...new Set(products.map(p => p.brand).filter(Boolean))],
    [products]
  );

  /* Filter + Sort */
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const name = (p.productName || p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const price = Number(p.price) || 0;

        return (
          p.gender === gender &&
          (!searchTerm || name.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase())) &&
          (!selectedCategory || p.category === selectedCategory) &&
          (!selectedBrand || p.brand === selectedBrand) &&
          (!minPrice || price >= Number(minPrice)) &&
          (!maxPrice || price <= Number(maxPrice))
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return (a.productName || a.name || "")
          .localeCompare(b.productName || b.name || "");
      });
  }, [
    products,
    gender,
    searchTerm,
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    sortBy
  ]);

  if (loading) return <Loading message="Loading products..." />;
  if (error) return <Error message={`Error: ${error}`} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedGender={gender}
          setSelectedGender={() => {}}
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
          genders={[]}
          showGenderFilter={false}
        />

        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
};

export default CategoryPage;