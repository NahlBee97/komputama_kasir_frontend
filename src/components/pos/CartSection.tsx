import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CartItem } from "../../interfaces/cartInterfaces";
import { getUserCart } from "../../services/cartServices";
import Loader from "../Loader";
import EmptyCart from "./EmptyCart";
import QuantitySelector from "./QuantitySelector";
import { useEffect, useState } from "react";
import PaymentModal from "./FinalizePayment";
import { createOrder } from "../../services/orderServices";
import type { NewOrder, OrderItem } from "../../interfaces/orderInterface";
import { Receipt } from "./Receipt";

const CartSection = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line
  const [receiptData , setReceiptData] = useState<{order: any; orderItems: OrderItem[]}>({order: {}, orderItems: []});

  useEffect(() => {
    // Check if receiptData has valid order info inside it
    if (receiptData && receiptData.order && receiptData.order.id) {
      // Small timeout ensures React has finished rendering the <Receipt> DOM
      setTimeout(() => {
        window.print();
      }, 100);
    }
  }, [receiptData]);

  const {
    data: cart = { items: [] },
    isLoading: cartLoading,
    error: cartError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getUserCart(),
  });

  const { mutate: checkout, isPending } = useMutation({
    mutationKey: ["checkout"],
    onSuccess: (data) => {
      setReceiptData(data);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    mutationFn: async (orderData: NewOrder) => {
      return createOrder(orderData);
    },
    onError: (error) => {
      alert("Error: " + error);
    },
  });

  const total: number = cart.items.length
    ? cart.items.reduce(
        (sum: number, item: CartItem) =>
          sum + item.product.price * item.quantity,
        0
      )
    : 0;

  const handleConfirmPayment = (cashReceived: number, change: number) => {
    try {
      const orderData = {
        userId: cart.userId as number,
        totalAmount: total,
        paymentCash: cashReceived,
        paymentChange: change,
      };

      checkout(orderData);
    } catch (error) {
      console.error("Payment confirmation error:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="flex flex-col gap-2 w-[35%] h-full bg-[#23230f] items-center justify-center">
        <Loader size="lg" variant="primary" />
        <h3 className="text-[#f9f906]">Loading Cart...</h3>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="flex flex-col text-[#f9f906] w-[35%] h-full bg-[#23230f] items-center justify-center">
        Error loading cart.
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col w-[35%] h-full items-center justify-center">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[35%] h-full bg-[#23230f]">
      <h2
        className="text-[#f9f906] text-[22px] font-bold leading-tight tracking-[-0.015em] px-6 pb-4 pt-6"
        style={{ textShadow: "0 0 10px rgba(249, 249, 6, 0.3)" }}
      >
        DETAIL PESANAN
      </h2>

      <div className="flex-1 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-[#f9f906]/20 scrollbar-track-transparent">
        {cart.items.map((item: CartItem) => (
          <div
            key={item.id}
            className="flex items-center gap-4 px-4 py-3 justify-between hover:bg-black/20 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14 shrink-0"
                style={{ backgroundImage: `url("${item.product.image}")` }}
              ></div>
              <div className="flex flex-col justify-center min-w-0">
                <p className="text-[#f9f906] text-base font-medium leading-normal truncate">
                  {item.product.name}
                </p>
                <p className="text-white/70 text-sm font-normal leading-normal">
                  Rp. {Number(item.product.price).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-end gap-1">
              {/* Quantity selector */}
              <QuantitySelector item={item} />

              <p className="text-white text-base font-semibold">
                Rp.{" "}
                {(Number(item.product.price) * item.quantity).toLocaleString(
                  "id-ID"
                )}
              </p>
            </div>
          </div>
        ))}
        {cart.items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-[#f9f906]/50">
            <p>No items in cart</p>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="p-6 border-t border-t-[#f9f906]/20 mt-auto bg-[#23230f]">
        <div className="flex justify-between items-center">
          <p className="text-[#f9f906] font-bold text-xl">Total</p>
          <p className="text-[#f9f906] font-bold text-xl">
            Rp. {total.toLocaleString("id-ID")}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isPending}
          className="w-full mt-6 bg-[#f9f906] text-black text-xl font-bold py-4 rounded-lg hover:brightness-110 transition-all duration-300 shadow-[0_0_15px_rgba(249,249,6,0.4)] hover:shadow-[0_0_20px_rgba(249,249,6,0.6)]"
        >
          PROCEED TO PAY
        </button>
      </div>
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        total={total}
        onConfirm={handleConfirmPayment}
      />
      <Receipt data={receiptData}/>
    </div>
  );
};

export default CartSection;
