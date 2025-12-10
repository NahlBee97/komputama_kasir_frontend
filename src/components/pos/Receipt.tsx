import { forwardRef } from "react";
import type { OrderItem } from "../../interfaces/dataInterfaces";
import { formatCurrency } from "../../helper/formatCurrentcy";

interface ReceiptProps {
  // eslint-disable-next-line
  data: any;
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(
  ({ data }, ref) => {
    return (
      // This div is hidden on screen, but we will target it in print CSS
      <div
        ref={ref}
        id="printable-receipt"
        className="hidden print:block text-black bg-white font-mono p-2"
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="font-bold text-xl uppercase">Diary Kasir</h1>
          <p className="text-[10px]">Fried Chicken Expert</p>
          <p className="text-[10px]">Jl. Sudirman No. 10</p>
        </div>

        {/* Transaction Details */}
        <div className="text-[10px] mb-2 border-b border-black border-dashed pb-2">
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{new Date().toLocaleDateString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span>Order #:</span>
            <span>{data.order.id}</span>
          </div>
        </div>

        {/* Items */}
        <div className="mb-2 text-[10px]">
          {data.orderItems.map((item: OrderItem) => (
            <div  className="flex justify-between mb-1">
              <span>
               "{item.product.name} x {item.quantity}"
              </span>
              <span>{formatCurrency(item.product.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-black border-dashed pt-2 text-[10px] font-bold">
          <div className="flex justify-between text-xs mb-1">
            <span>TOTAL</span>
            <span>{formatCurrency(data.order.totalAmount)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>CASH</span>
            <span>{formatCurrency(data.order.paymentCash)}</span>
          </div>
          <div className="flex justify-between">
            <span>CHANGE</span>
            <span>{formatCurrency(data.order.paymentChange)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-[10px]">
          <p>Thank You!</p>
          <p>Please Come Again</p>
        </div>
      </div>
    );
  }
);

Receipt.displayName = "Receipt";
