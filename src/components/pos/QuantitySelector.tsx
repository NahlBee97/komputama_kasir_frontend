import type { CartItem } from "../../interfaces/cartInterfaces";
import { MinusIcon, PlusIcon } from "../Icons";
import { useState } from "react";
import { formatCurrency } from "../../helper/formatCurrentcy";
import ConfirmModal from "../ConfirmModal";
import { useCart } from "../../hooks/useCart";

interface QuantitySelectorProps {
  item: CartItem;
}

const QuantitySelector = ({ item }: QuantitySelectorProps) => {
  // 1. Use the new updateItem function from context
  const { updateItem, removeFromCart, isLoading } = useCart();
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  // 2. Logic for Minus Button
  const handleClickMinus = () => {
    if (item.quantity > 1) {
      // Direct call: Context handles the instant UI update
      updateItem(item.id, item.quantity - 1);
    } else {
      // If quantity is 1, ask to remove
      setIsConfirmOpen(true);
    }
  };

  // 3. Logic for Plus Button
  const handleClickPlus = () => {
    updateItem(item.id, item.quantity + 1);
  };

  // Shared button class
  const buttonClass = `
    group flex h-7 w-7 items-center justify-center rounded-full 
    border border-black bg-white text-black 
    transition-all duration-200 
    hover:bg-black hover:text-white 
    active:scale-90
    disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black
  `;

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-3">
        <button
          onClick={handleClickMinus}
          disabled={isLoading}
          className={buttonClass}
          aria-label="Decrease quantity"
        >
          <MinusIcon />
        </button>

        {/* 4. Display item.quantity directly (Source of Truth) */}
        <span className="min-w-5 text-center text-base font-black text-black">
          {item.quantity}
        </span>

        <button
          onClick={handleClickPlus}
          disabled={isLoading}
          className={buttonClass}
          aria-label="Increase quantity"
        >
          <PlusIcon />
        </button>
      </div>

      <p className="text-black text-base font-black">
        {formatCurrency(item.product.price * item.quantity)}
      </p>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Hapus Item"
        message="Apakah Anda yakin ingin menghapus item ini dari keranjang?"
        onConfirm={() => {
          removeFromCart(item.id);
          setIsConfirmOpen(false);
        }}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default QuantitySelector;
