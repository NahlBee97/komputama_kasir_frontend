import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "../../services/productServices";
import { useMemo } from "react";
import Loader from "../Loader";
import ProductCard from "./ProductCard";
import { addItemToCart } from "../../services/cartServices";
import type { Product } from "../../interfaces/productInterfaces";
import { WarningIcon } from "../Icons";

interface AddItemData {
  productId: number;
  quantity: number;
}

interface ProductSectionProps {
  activeCategory: string;
  searchQuery: string;
}

const ProductSection = ({
  searchQuery,
  activeCategory,
}: ProductSectionProps) => {
  const queryClient = useQueryClient();

  const {
    data: queryResult,
    isLoading: isProductLoading,
    error: productError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(1),
  });

  const { mutate: addItem, isPending } = useMutation({
    mutationFn: (data: AddItemData) => {
      return addItemToCart(data.productId, data.quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      alert("Error: " + error);
    },
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

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col gap-2 w-full h-full items-center justify-center">
        <h3 className="text-[#f9f906]">Tidak Ada Produk</h3>
      </div>
    );
  }

  if (isProductLoading || productError) {
    return (
      <div className="flex flex-col gap-2 w-full h-full items-center justify-center">
        {productError ? (
          <WarningIcon />
        ) : (
          <Loader size="lg" variant="primary" />
        )}
        <h3 className="text-[#f9f906]">
          {productError ? "Gangguan Memuat Product..." : "Memuat Product..."}
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {filteredItems.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
          disabled={isPending}
          onClick={() => addItem({ productId: item.id, quantity: 1 })}
        />
      ))}
    </div>
  );
};

export default ProductSection;
