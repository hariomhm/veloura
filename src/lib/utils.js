export const getSellingPrice = (product) => {
  return (
    product.sellingPrice ||
    product.mrp ||
    product.price
  );
};
