import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import { useSearchParams } from 'react-router-dom';
import ProductFilters from '../components/ProductFilters';
import ProductGrid from '../components/ProductGrid';
import Loading from '../components/Loading';
import Error from '../components/Error';

const Womens = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedGender] = useState('Women'); // Fixed to Women
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const productName = product.productName || product.name;
      const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesGender = product.gender === selectedGender;
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      const matchesPrice = (!minPrice || product.price >= parseFloat(minPrice)) &&
                           (!maxPrice || product.price <= parseFloat(maxPrice));
      return matchesSearch && matchesCategory && matchesGender && matchesBrand && matchesPrice;
    });

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => (a.productName || a.name).localeCompare(b.productName || b.name));
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedGender, selectedBrand, minPrice, maxPrice, sortBy]);

  if (loading) return <Loading message="Loading products..." />;
  if (error) return <Error message={`Error: ${error}`} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Women's Collection</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedGender={selectedGender}
          setSelectedGender={() => {}} // No-op since fixed
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          genders={[]} // Not used
          brands={brands}
          showGenderFilter={false}
        />
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
};

export default Womens;
