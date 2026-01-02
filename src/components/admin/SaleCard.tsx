import { useState } from "react";
import { formatCurrency } from "../../helper/formatCurrentcy";
import type { Order } from "../../interfaces/orderInterface";
import OrderDetailsModal from "./DetailOrderModal";
import { format } from "date-fns";
import { id } from "date-fns/locale"; // Import Indonesian locale if needed

const SaleCard = ({ order }: { order: Order }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className="
        group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 
        p-5 bg-white border-2 border-[#007ACC] rounded-xl 
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        hover:bg-gray-300
      "
    >
      {/* Order ID & Date Group */}
      <div className="flex flex-col gap-1 w-full sm:w-1/3">
        <span className="text-[#007ACC] font-black text-lg tracking-tight">
          #{order.id}
        </span>
        <span className="text-[#007ACC]/60 font-bold text-xs uppercase tracking-wide">
          {format(order.createdAt, "dd MMM yyyy • HH:mm", { locale: id })}
        </span>
      </div>

      {/* Total Amount */}
      <div className="w-full sm:w-1/3 text-left sm:text-center">
        <span className="text-[#007ACC] font-black text-xl tracking-tight block sm:inline">
          {formatCurrency(order.totalAmount)}
        </span>
        {/* Mobile-only label */}
        <span className="sm:hidden text-xs font-bold text-[#007ACC]/40 uppercase ml-2">
          Total
        </span>
      </div>

      {/* Action Button */}
      <div className="w-full sm:w-1/3 flex justify-end">
        <button
          className="
            w-full sm:w-auto
            rounded-full border-2 border-[#007ACC] bg-white px-6 py-2.5 
            text-xs font-black text-[#007ACC] uppercase tracking-widest
            hover:bg-[#007ACC] hover:text-white 
            active:scale-95
            transition-all duration-200
          "
          onClick={() => setIsOpen(true)}
        >
          Rincian
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
