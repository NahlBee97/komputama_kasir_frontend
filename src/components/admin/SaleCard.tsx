import { useState } from "react";
import { formatCurrency } from "../../helper/formatCurrentcy";
import type { Order } from "../../interfaces/orderInterface";
import OrderDetailsModal from "./DetailOrderModal";

const GLOW_BORDER_SUBTLE = "0 0 5px rgba(249, 249, 6, 0.3)";

const SaleCard = ({ order }: { order: Order }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className="flex items-center p-4 bg-[#111111] border border-[#f9f906]/50 rounded-lg transition-all duration-300 hover:shadow-[0_0_10px_rgba(249,249,6,0.5)] hover:border-[#f9f906]"
      style={{ boxShadow: GLOW_BORDER_SUBTLE }}
    >
      <div className="w-1/4 text-white font-medium">#{order.id}</div>
      <div className="w-1/4 text-[#f9f906]/80">
        {order.createdAt.toString()}
      </div>
      <div className="w-1/4 text-white font-semibold">
        {formatCurrency(order.totalAmount)}
      </div>
      <div className="w-1/4 flex justify-end">
        <button
          className="bg-[#f9f906] text-black font-bold text-sm leading-normal tracking-wide px-6 py-2 rounded-md hover:brightness-110 transition-all"
          onClick={() => setIsOpen(true)}
        >
          VIEW DETAIL
        </button>
      </div>
      <OrderDetailsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        order={order}
        onReprint={() => alert("Reprinting receipt...")}
      />
    </div>
  );
};

export default SaleCard;
