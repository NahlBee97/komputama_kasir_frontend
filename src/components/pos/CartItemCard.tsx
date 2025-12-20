import { apiUrl } from "../../config";
import { formatCurrency } from "../../helper/formatCurrentcy";
import type { CartItem } from "../../interfaces/cartInterfaces";

const CartItemCard = ({item} : {item: CartItem}) => {
  return (
    <div className="flex items-center gap-4 min-w-0 flex-1">
      <img
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14 shrink-0"
        src={`${apiUrl}${item.product.image}`}
      />
      <div className="flex flex-col justify-center min-w-0">
        <p className="text-[#f9f906] text-base font-medium leading-normal">
          {item.product.name}
        </p>
        <p className="text-white/70 text-sm font-normal leading-normal">
          {formatCurrency(item.product.price)}
        </p>
      </div>
    </div>
  );
};

export default CartItemCard;
