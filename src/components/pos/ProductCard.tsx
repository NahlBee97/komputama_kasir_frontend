import { formatCurrency } from "../../helper/formatCurrentcy";
import type { Product } from "../../interfaces/productInterfaces";

interface ProductCardProps {
  item: Product;
  onClick: () => void;
  disabled?: boolean;
}

const ProductCard = ({ item, onClick, disabled }: ProductCardProps) => {
  return (
    <div
      key={item.id}
      onClick={disabled ? undefined : onClick}
      className="bg-black/50 flex flex-col gap-3 rounded-lg border border-[#f9f906]/30 justify-end aspect-square p-4 cursor-pointer transition-all duration-300 hover:border-[#f9f906] hover:shadow-[0_0_15px_rgba(249,249,6,0.3)] group relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(10, 10, 10, 0.9) 0%, rgba(10, 10, 10, 0) 100%), url("${item.image}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10">
        <p className="text-[#f9f906] text-sm font-bold leading-tight drop-shadow-md">
          {item.name}
        </p>
        <p className="text-white text-base font-medium">
          {formatCurrency(item.price)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
