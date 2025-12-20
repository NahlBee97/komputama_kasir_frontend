import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CartItem } from "../../interfaces/cartInterfaces";
import { MinusIcon, PlusIcon } from "../Icons";
import {
  removeItemFromCart,
  updateItemQuantity,
} from "../../services/cartServices";
import { useEffect, useState } from "react";

interface updateItemData {
  itemId: number;
  quantity: number;
}

interface QuantitySelectorProps {
  item: CartItem;
}

const QuantitySelector = ({ item }: QuantitySelectorProps) => {
  const queryClient = useQueryClient();

  const [debouncedQty, setDebouncedQty] = useState<number>(item.quantity);

  const { mutate: updateItem, isPending } = useMutation({
    mutationFn: (data: updateItemData) => {
      return updateItemQuantity(data.itemId, data.quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      alert("Error: " + error);
    },
  });

  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationFn: (data: { itemId: number }) => {
      return removeItemFromCart(data.itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      alert("Error: " + error);
    },
  });

  useEffect(() => {
    if (debouncedQty === item.quantity) return;

    const timer = setTimeout(() => {
      console.log("Updating item quantity");
      updateItem({ itemId: item.id, quantity: debouncedQty });
    }, 1000); // 1000ms (1s)

    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [debouncedQty]);

  const handleClickMinus = () => {
    if (debouncedQty > 1) {
      setDebouncedQty((prev) => (prev > 1 ? prev - 1 : 1));
    } else if (debouncedQty === 1 && item.quantity === 1) {
      deleteItem({ itemId: item.id });
    }
  };

  return (
    <div className="flex items-center gap-2 text-white">
      <button
        onClick={handleClickMinus}
        disabled={isPending || isDeleting}
        className="text-lg font-bold flex h-7 w-7 items-center justify-center rounded-full bg-[#11110A] hover:bg-[#f9f906] hover:text-black transition-colors duration-200 disabled:cursor-not-allowed"
      >
        <MinusIcon />
      </button>
      <span className="text-base font-medium w-5 text-center text-[#f9f906]">
        {debouncedQty}
      </span>
      <button
        onClick={() => setDebouncedQty((prev) => prev + 1)}
        disabled={isPending}
        className="text-lg font-bold flex h-7 w-7 items-center justify-center rounded-full bg-[#11110A] hover:bg-[#f9f906] hover:text-black transition-colors duration-200 disabled:cursor-not-allowed"
      >
        <PlusIcon />
      </button>
    </div>
  );
};

export default QuantitySelector;
