import CategoryPage from "./CategoryPage";

export default function Products() {
  return (
    <CategoryPage
      gender={["men", "women", "kids"]}
      title="Shop All"
      seoPath="/products"
    />
  );
}
