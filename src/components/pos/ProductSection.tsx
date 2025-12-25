import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../services/productServices";
import { useMemo } from "react";
import Loader from "../Loader";
import ProductCard from "./ProductCard";
import type { Product } from "../../interfaces/productInterfaces";
import { WarningIcon } from "../Icons";
import { useCart } from "../../hooks/useCart";

interface ProductSectionProps {
  activeCategory: string;
  searchQuery: string;
}

const ProductSection = ({
  searchQuery,
  activeCategory,
}: ProductSectionProps) => {
  const { cartItems, addToCart, updateItem, isLoading } = useCart();

  const {
    data: queryResult,
    isLoading: isProductLoading,
    error: productError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(1),
  });

  const products: Product[] = useMemo(
    () => queryResult?.products || [],
    [queryResult]
  );

  const filteredItems: Product[] = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        product.category.toLowerCase() === activeCategory.toLowerCase();

      // 2. Filter by Search Query
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, activeCategory]);

  const handleProductClick = (product: Product) => {
    const isProductExist = cartItems.some((item) => item.id === product.id);
    if (isProductExist) {
      updateItem(
        product.id,
        cartItems.find((item) => item.id === product.id)!.quantity + 1
      );
    } else {
      addToCart(product);
    }
  };

  // --- Loading / Error State ---
  if (isProductLoading || productError) {
    return (
      <div className="flex flex-col gap-4 w-full h-[50vh] items-center justify-center">
        {productError ? <WarningIcon /> : <Loader size="lg" variant="dark" />}
        <h3 className="text-black font-black uppercase tracking-widest text-sm">
          {productError ? "Gagal Memuat Data" : "Memuat Produk..."}
        </h3>
      </div>
    );
  }

  // --- Empty State ---
  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col gap-3 w-full h-64 items-center justify-center border-2 border-dashed border-black/10 rounded-2xl m-2">
        <h3 className="text-black font-bold text-lg uppercase">
          Tidak Ada Produk
        </h3>
        <p className="text-black/40 font-medium text-sm">
          Coba cari dengan kata kunci lain
        </p>
      </div>
    );
  }

  // --- Grid Layout ---
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
      {filteredItems.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
          disabled={isLoading}
          onClick={handleProductClick}
        />
      ))}
    </div>
  );
};

export default ProductSection;
