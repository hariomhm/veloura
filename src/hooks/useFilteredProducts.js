import { useMemo } from "react";

export default function useFilteredProducts({
  products,
  gender,
  searchTerm,
  selectedCategory,
  selectedGender,
  selectedBrand,
  minPrice,
  maxPrice,
  sortBy,
  priceRange,
}) {
  return useMemo(() => {
    /* ---------------- NORMALIZE GENDER ---------------- */
    const normalizedPageGender = Array.isArray(gender)
      ? gender.map(g => g.toLowerCase())
      : gender?.toLowerCase();

    const normalizedSelectedGender = selectedGender?.toLowerCase();

    let list = products.filter((p) => {
      const name = (p.productName || p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const price = Number(p.sellingPrice ?? p.price ?? 0);
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
        (!minPrice || price >= Number(minPrice)) &&
        (!maxPrice || price <= Number(maxPrice)) &&
        (!priceRange || price <= priceRange.value)
      );
    });

    /* ---------------- SORT ---------------- */
    switch (sortBy) {
      case "price-low":
        return list.sort(
          (a, b) =>
            (a.sellingPrice ?? a.price) - (b.sellingPrice ?? b.price)
        );

      case "price-high":
        return list.sort(
          (a, b) =>
            (b.sellingPrice ?? b.price) - (a.sellingPrice ?? a.price)
        );

      case "name":
      default:
        return list.sort((a, b) =>
          (a.productName || a.name || "").localeCompare(
            b.productName || b.name || ""
          )
        );
    }
  }, [
    products,
    gender,
    searchTerm,
    selectedCategory,
    selectedGender,
    selectedBrand,
    minPrice,
    maxPrice,
    sortBy,
    priceRange,
  ]);
}
