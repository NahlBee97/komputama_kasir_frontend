import type { Order} from "../../interfaces/orderInterface";
import { formatCurrency } from "../../helper/formatCurrentcy";
import { format } from "date-fns";

// --- Style Constants ---

const PRIMARY_COLOR = "#f9f906";
// const BACKGROUND_DARK = "#23230f"; // Used for text-background-dark utility
const MODAL_BG = "#0a0a00";
const GLOW_SHADOW = "0 0 5px #f9f906, 0 0 10px #f9f906, 0 0 15px #f9f906";
const GLOW_TEXT = "0 0 4px #f9f906";
const HR_SHADOW = "0 0 2px #f9f906";

interface props {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
  onReprint?: () => void;
}

// --- Main Component ---

const OrderDetailsModal = ({
  isOpen,
  order,
  onClose,
  // onReprint,
}: props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm font-sans">
      {/* Modal Container */}
      <div
        className="flex flex-col w-full max-w-md rounded-xl border"
        style={{
          backgroundColor: MODAL_BG,
          borderColor: PRIMARY_COLOR,
          boxShadow: GLOW_SHADOW,
        }}
      >
        {/* Header */}
        <div
          className=" p-6 border-b"
          style={{ borderColor: "rgba(249, 249, 6, 0.2)" }}
        >
          <p
            className="text-4xl font-black leading-tight tracking-[-0.033em]"
            style={{ color: PRIMARY_COLOR, textShadow: GLOW_TEXT }}
          >
            ORDER #{order.id}
          </p>
          <p
            className="font-medium leading-tight tracking-[-0.033em]"
            style={{ color: PRIMARY_COLOR, textShadow: GLOW_TEXT }}
          >
            {format(order.createdAt, "dd MMMM yyyy HH:mm")}
          </p>
        </div>

        {/* Itemized List */}
        <div className="p-6">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between gap-x-6 py-2">
              <p className="text-white/80 text-sm font-normal leading-normal">
                {item.quantity} x {item.product?.name}
              </p>
              <p className="text-white text-sm font-normal leading-normal text-right">
                {formatCurrency(item.product?.price as number)}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="px-6">
          <hr
            className="border-t"
            style={{
              borderColor: "rgba(249, 249, 6, 0.5)",
              boxShadow: HR_SHADOW,
            }}
          />
        </div>

        {/* Total Section */}
        <div className="p-6">
          <div className="flex justify-between items-center gap-x-6 py-2">
            <p
              className="text-2xl font-bold leading-normal"
              style={{ color: PRIMARY_COLOR, textShadow: GLOW_TEXT }}
            >
              TOTAL
            </p>
            <p
              className="text-4xl font-black leading-normal text-right"
              style={{ color: PRIMARY_COLOR, textShadow: GLOW_TEXT }}
            >
              {formatCurrency(order.totalAmount)}
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex flex-1 gap-3 flex-wrap p-6 pt-2 justify-between">
          <button
            onClick={onClose}
            className="flex flex-1 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-transparent border text-base font-bold leading-normal tracking-[0.015em] transition-all"
            style={{
              color: PRIMARY_COLOR,
              borderColor: PRIMARY_COLOR,
            }}
          >
            <span className="truncate">CLOSE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;