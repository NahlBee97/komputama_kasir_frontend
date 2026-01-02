import { formatCurrency } from "../../helper/formatCurrentcy";
import type { CartItem } from "../../interfaces/cartInterfaces";
import QuantitySelector from "./QuantitySelector";

const CartItemCard = ({ item }: { item: CartItem }) => {
  return (
    <>
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Image: Added border and slight padding for a "framed" look */}
        <div className="shrink-0 rounded-lg border border-[#007ACC] p-0.5 bg-white">
          <img
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-[5px] size-12"
            src={`${item.product.image}`}
            alt={item.product.name}
          />
        </div>

        <div className="flex flex-col justify-center min-w-0 gap-0.5">
          {/* Product Name: [#007ACC], Uppercase, Truncated */}
          <p className="text-[#007ACC] text-sm font-black leading-tight tracking-tight truncate">
            {item.product.name}
          </p>

          {/* Price: Muted Gray */}
          <p className="text-[#007ACC]/50 text-xs font-bold leading-normal">
            {formatCurrency(item.product.price)}
          </p>
        </div>
      </div>
      <div className="shrink-0">
        <QuantitySelector item={item} />
      </div>
    </>
  );
};

export default CartItemCard;
