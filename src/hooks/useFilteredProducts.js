import { useMemo, useCallback } from "react";
import { getSellingPrice } from "../lib/utils";

export default function useFilteredProducts({
  products,
  gender,
  searchTerm,
  selectedCategory,
  selectedGender,
  selectedBrand,
  selectedSize,
  selectedColor,
  minPrice,
  maxPrice,
  sortBy,
  priceRange,
}) {
  const filterProducts = useCallback(
    (products) => {
      /* ---------------- NORMALIZE GENDER ---------------- */
      const normalizedPageGender = Array.isArray(gender)
        ? gender.map(g => g.toLowerCase())
        : gender?.toLowerCase();

      const normalizedSelectedGender = selectedGender?.toLowerCase();

      let list = products.filter((p) => {
        const name = (p.productName || p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const price = getSellingPrice(p);
        const term = searchTerm?.toLowerCase() || "";
        const productGender = p.gender?.toLowerCase();

        /* -------- PAGE LEVEL GENDER (LOCKED) -------- */
        const pageGenderMatch = !normalizedPageGender
          ? true
          : Array.isArray(normalizedPageGender)
          ? normalizedPageGender.includes(productGender)
          : productGender === normalizedPageGender;

        /* -------- USER SELECTED GENDER (FILTER) -------- */
        const selectedGenderMatch = !normalizedSelectedGender
          ? true
          : productGender === normalizedSelectedGender;

        return (
          pageGenderMatch &&
          selectedGenderMatch &&
          (!term || name.includes(term) || desc.includes(term)) &&
          (!selectedCategory || p.category === selectedCategory) &&
          (!selectedBrand || p.brand === selectedBrand) &&
          (!selectedSize || (p.sizes && p.sizes.includes(selectedSize))) &&
          (!selectedColor || p.color === selectedColor) &&
          (!minPrice || price >= Number(minPrice)) &&
          (!maxPrice || price <= Number(maxPrice)) &&
          (!priceRange || price <= priceRange.value)
        );
      });

      /* ---------------- SORT ---------------- */
      switch (sortBy) {
        case "price-low":
          return list.sort(
            (a, b) => getSellingPrice(a) - getSellingPrice(b)
          );

        case "price-high":
          return list.sort(
            (a, b) => getSellingPrice(b) - getSellingPrice(a)
          );

        case "rating":
          return list.sort(
            (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
          );

        case "newest":
          return list.sort(
            (a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0)
          );

        case "name":
        default:
          return list.sort((a, b) =>
            (a.productName || a.name || "").localeCompare(
              b.productName || b.name || ""
            )
          );
      }
    },
    [
      gender,
      searchTerm,
      selectedCategory,
      selectedGender,
      selectedBrand,
      selectedSize,
      selectedColor,
      minPrice,
      maxPrice,
      sortBy,
      priceRange,
    ]
  );

  return useMemo(() => filterProducts(products), [products, filterProducts]);
}
