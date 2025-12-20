import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "../../services/productServices";
import { useMemo, useState } from "react";
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
  searchQuery: string;
}

const categories = ["Ayam Geprek", "Minuman", "Tambahan"];

const ProductSection = ({ searchQuery }: ProductSectionProps) => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

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
    <div className="flex-1 overflow-y-auto px-6 scrollbar-thin scrollbar-thumb-[#f9f906]/20 scrollbar-track-transparent">
      {/* Tabs */}
      <div className="pb-3">
        <div className="flex border-b border-[#f9f906]/20 gap-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-2 transition-colors duration-300 ${
                activeCategory === category
                  ? "border-b-[#f9f906] text-[#f9f906]"
                  : "border-b-transparent text-[#f9f906]/60 hover:text-[#f9f906]"
              }`}
            >
              <p className="text-base font-bold leading-normal tracking-[0.015em]">
                {category}
              </p>
            </button>
          ))}
        </div>
      </div>
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
    </div>
  );
};

export default ProductSection;
