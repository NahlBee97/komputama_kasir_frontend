import { formatCurrency } from "../../helper/formatCurrentcy";
import type { Product } from "../../interfaces/productInterfaces";

interface ProductCardProps {
  item: Product;
  onClick: (item: Product) => void;
  disabled?: boolean;
}

const ProductCard = ({ item, onClick, disabled }: ProductCardProps) => {
  const isOutOfStock = item.stock <= 0;

  return (
    <button
      key={item.id}
      onClick={disabled ? undefined : () => onClick(item)}
      disabled={disabled || isOutOfStock}
      className={`
        group relative flex flex-col aspect-square w-full overflow-hidden 
        rounded-2xl border border-[#007ACC] bg-white text-left
        transition-all duration-200 ease-out
        ${
          disabled || isOutOfStock
            ? "cursor-not-allowed opacity-60 grayscale" // Slightly increased opacity so text is readable
            : "cursor-pointer hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none active:scale-98"
        }
      `}
    >
      {/* Image Container - Added 'relative' here to position the badge */}
      <div className="relative flex-1 w-full overflow-hidden border-b border-[#007ACC] bg-gray-50">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
          style={{
            backgroundImage: `url("${item.image}")`,
          }}
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
            <span className="rotate-6 rounded border border-[#007ACC] bg-[#007ACC] px-3 py-1 text-xs font-black uppercase tracking-widest text-white shadow-sm">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex w-full flex-col justify-center bg-white px-4 py-3">
        <p className="line-clamp-2 w-full text-xs font-bold tracking-tight text-gray-500 transition-colors group-hover:text-[#007ACC]">
          {item.name}
        </p>
        <div className="flex justify-between items-center">
          <p className="mt-0.5 text-base font-black text-[#007ACC]">
            {formatCurrency(item.price)}
          </p>
          <p className="text-xs text-gray-500">Stok: {item.stock}</p>
        </div>
      </div>
    </button>
  );
};

export default ProductCard;
