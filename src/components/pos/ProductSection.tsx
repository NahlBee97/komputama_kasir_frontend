import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "../../services/productServices";
import { useMemo } from "react";
import type { Product } from "../../interfaces/authInterfaces";
import Loader from "../Loader";
import ProductCard from "./ProductCard";
import { addItemToCart } from "../../services/cartServices";

interface AddItemData {
  productId: number;
  quantity: number;
}

interface ProductSectionProps {
  activeCategory: string;
  searchQuery: string;
}

const ProductSection = ({
  activeCategory,
  searchQuery,
}: ProductSectionProps) => {
  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
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

  // Filter items
  const filteredItems: Product[] = useMemo(() => {
    return products.length > 0
      ? products.filter(
          (product: Product) =>
            product.category === activeCategory &&
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];
  }, [activeCategory, searchQuery, products]);

  if (productLoading) {
    return (
      <div className="flex flex-col gap-2 w-full h-full items-center justify-center">
        <Loader size="lg" variant="primary" />
        <h3 className="text-[#f9f906]">Loading Products...</h3>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="flex flex-col gap-2 w-full h-full items-center justify-center">
        <h3 className="text-[#f9f906]">Error loading Products...</h3>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#f9f906]/20 scrollbar-track-transparent">
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
