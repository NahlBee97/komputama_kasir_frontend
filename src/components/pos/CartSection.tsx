import { useMutation } from "@tanstack/react-query";
import type { CartItem } from "../../interfaces/cartInterfaces";
import Loader from "../Loader";
import EmptyCart from "./EmptyCart";
import { useEffect, useState } from "react";
import PaymentModal from "./FinalizePayment";
import { createOrder } from "../../services/orderServices";
import type { NewOrder, OrderItem } from "../../interfaces/orderInterface";
import { Receipt } from "./Receipt";
import { formatCurrency } from "../../helper/formatCurrentcy";
import { WarningIcon } from "../Icons";
import CartItemCard from "./CartItemCard";
import LoadingModal from "../LoadingModal";
import { useCart } from "../../hooks/useCart";
import toast from "react-hot-toast";

const CartSection = () => {
  // 1. Use values from Context
  const {
    cart,
    cartItems,
    isLoading: isCartLoading,
    totalAmount,
    isError: isCartError,
    refreshCart,
  } = useCart();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for receipt
  const [receiptData, setReceiptData] = useState<{
    // eslint-disable-next-line
    order: any;
    orderItems: OrderItem[];
  } | null>(null);

  // 2. Automated Print Logic
  useEffect(() => {
    if (receiptData && receiptData.order?.id) {
      const timer = setTimeout(async () => {
        window.print();
        setReceiptData(null);
        await refreshCart();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [receiptData, refreshCart]);

  // 3. Checkout Mutation
  const { mutate: checkout, isPending } = useMutation({
    mutationKey: ["checkout"],
    mutationFn: async (orderData: NewOrder) => {
      return createOrder(orderData);
    },
    onSuccess: async (data) => {
      setReceiptData(data);

      setIsModalOpen(false);

      toast.success("Pembayaran Berhasil!");
    },
    onError: (error: Error) => {
      toast.error("Gagal memproses pembayaran: " + error.message);
    },
  });

  const handleConfirmPayment = (cashReceived: number, change: number) => {
    if (!cart?.userId) {
      toast.error("Data User tidak valid. Silakan refresh.");
      return;
    }

    const orderData: NewOrder = {
      userId: cart.userId,
      totalAmount: totalAmount,
      paymentCash: cashReceived,
      paymentChange: change,
    };

    checkout(orderData);
  };

  // --- RENDER STATES ---

  if (isCartLoading) {
    return (
      <div className="flex flex-col gap-2 w-full h-full items-center justify-center bg-white">
        <Loader size="lg" variant="dark" />
        <h3 className="text-black font-bold uppercase">Memuat Keranjang...</h3>
      </div>
    );
  }

  if (isCartError) {
    return (
      <div className="flex flex-col gap-2 w-full h-full items-center justify-center bg-white text-red-600">
        <WarningIcon />
        <h3 className="text-black font-bold uppercase">
          Gangguan Memuat Keranjang
        </h3>
      </div>
    );
  }

  // 4. CRITICAL FIX:
  // Do not show "EmptyCart" if we are currently trying to print a receipt (receiptData exists).
  // This keeps the DOM mounted so window.print() can see the Receipt component.
  if (!receiptData && (!cartItems || cartItems.length === 0)) {
    return <EmptyCart />;
  }

  return (
    <div className="flex flex-col w-full h-screen bg-white overflow-hidden">
      {/* Header (Fixed) */}
      <h2 className="shrink-0 text-black h-20 p-6 text-lg font-black leading-tight tracking-tight uppercase border-b border-black">
        Detail Pesanan
      </h2>

      {/* List Items (Scrollable) */}
      <div className="flex-1 min-h-0 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-black/30 scrollbar-track-transparent hover:scrollbar-thumb-black/50">
        {/* Handle case where we have receiptData but cart is empty (prevent crash map) */}
        {cartItems.map((item: CartItem) => (
          <div
            key={item.id}
            className="flex items-center gap-4 px-4 py-4 justify-between border-b border-black/10 hover:bg-black/5 transition-colors"
          >
            <CartItemCard item={item} />
          </div>
        ))}
      </div>

      {/* Footer (Fixed) */}
      <div className="shrink-0 p-6 border-t border-black mt-auto bg-white">
        <div className="flex justify-between items-center mb-4">
          <p className="text-black font-medium text-lg uppercase tracking-wider">
            Total
          </p>
          <p className="text-black font-black text-2xl">
            {formatCurrency(totalAmount)}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isPending || isCartLoading || cartItems.length === 0}
          className="group w-full bg-black text-white text-lg font-black py-4 rounded-full 
                      shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] 
                      hover:shadow-none hover:translate-y-0.5 
                      active:scale-[0.98] active:translate-y-0.5
                      transition-all duration-200 ease-out 
                      uppercase tracking-widest border border-black
                      disabled:bg-gray-300 disabled:shadow-none disabled:border-gray-300 disabled:cursor-not-allowed"
        >
          {isPending ? "MEMPROSES..." : "BAYAR SEKARANG"}
        </button>
      </div>

      {/* Modals & Overlays */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        total={totalAmount}
        onConfirm={handleConfirmPayment}
      />

      {/* 5. RECEIPT COMPONENT */}
      {/* This must be present in the DOM when window.print() triggers */}
      {receiptData && <Receipt data={receiptData} />}

      <LoadingModal isOpen={isPending} message="Memproses Pembayaran..." />
    </div>
  );
};

export default CartSection;
