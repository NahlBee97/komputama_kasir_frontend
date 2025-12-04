import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../services/productServices";
import { useMemo } from "react";
import type { Product } from "../../interfaces/dataInterfaces";
import Loader from "../Loader";

interface ProductSectionProps {
  activeCategory: string;
  searchQuery: string;
}

const ProductSection = ({
  activeCategory,
  searchQuery,
}: ProductSectionProps) => {
  const {
    data: products = [],
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
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
          <div
            key={item.id}
            // onClick={() => addToCart(item)}
            className="bg-black/50 flex flex-col gap-3 rounded-lg border border-[#f9f906]/30 justify-end aspect-square p-4 cursor-pointer transition-all duration-300 hover:border-[#f9f906] hover:shadow-[0_0_15px_rgba(249,249,6,0.3)] group relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(10, 10, 10, 0.9) 0%, rgba(10, 10, 10, 0) 100%), url("${item.image}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10">
              <p className="text-[#f9f906] text-lg font-bold leading-tight line-clamp-2 drop-shadow-md">
                {item.name}
              </p>
              <p className="text-white text-base font-medium">
                Rp. {Number(item.price).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
