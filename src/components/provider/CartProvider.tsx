import { useMemo, type ReactNode } from "react";
import type { Cart, CartItem } from "../../interfaces/cartInterfaces";
import {
  addItemToCart,
  getUserCart,
  removeItemFromCart,
  updateItemQuantity,
} from "../../services/cartServices";
import type { Product } from "../../interfaces/productInterfaces";
import toast from "react-hot-toast";
import { CartContext } from "../../context/CartContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Define the data type for updates
interface UpdateItemData {
  itemId: number;
  quantity: number;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // 1. FETCH CART
  // We read directly from data. We do NOT use useState/useEffect here.
  const {
    data: cartData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getUserCart,
  });

  // Derived state (calculated on the fly, no useState needed)
  const cartItems = useMemo(() => cartData?.items || [], [cartData]);

  const totalAmount = useMemo(
    () =>
      cartItems.reduce(
        (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
        0
      ),
    [cartItems]
  );

  // 2. ADD ITEM MUTATION
  const { mutate: addToCartMutation } = useMutation({
    mutationFn: async (product: Product) => {
      // Assuming your API returns the updated Cart or CartItem
      return await addItemToCart(product.id, 1);
    },
    onMutate: async (product) => {
      // A. Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // B. Snapshot previous value
      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      // C. Optimistically update the CACHE directly
      queryClient.setQueryData<Cart>(["cart"], (oldCart) => {
        if (!oldCart) return oldCart;

        const existingItem = oldCart.items.find(
          (item) => item.product.id === product.id
        );

        let newItems: CartItem[];

        if (existingItem) {
          // Increment quantity
          newItems = oldCart.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // Add new item with temp ID
          const newItem: CartItem = {
            id: Math.random(), // Temp ID
            cartId: oldCart.id,
            productId: product.id,
            quantity: 1,
            product,
          };
          newItems = [...oldCart.items, newItem];
        }

        return { ...oldCart, items: newItems };
      });

      // D. Return context
      return { previousCart };
    },
    onError: (err, _newTodo, context) => {
      console.error("Add failed", err);
      toast.error("Gagal menyimpan");
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // 3. UPDATE ITEM QUANTITY MUTATION
  const { mutate: updateItemMutation } = useMutation({
    mutationFn: async (data: UpdateItemData) => {
      return await updateItemQuantity(data.itemId, data.quantity);
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      queryClient.setQueryData<Cart>(["cart"], (oldCart) => {
        if (!oldCart) return oldCart;
        return {
          ...oldCart,
          items: oldCart.items.map((item) =>
            item.id === data.itemId
              ? { ...item, quantity: data.quantity }
              : item
          ),
        };
      });

      return { previousCart };
    },
    onError: (error, _variables, context) => {
      console.error("Update failed", error);
      toast.error("Gagal update");
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // 4. REMOVE ITEM MUTATION
  const { mutate: removeFromCartMutation } = useMutation({
    mutationFn: async (data: { itemId: number }) => {
      return await removeItemFromCart(data.itemId);
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      queryClient.setQueryData<Cart>(["cart"], (oldCart) => {
        if (!oldCart) return oldCart;
        return {
          ...oldCart,
          items: oldCart.items.filter((item) => item.id !== data.itemId),
        };
      });

      return { previousCart };
    },
    onSuccess: () => {
      toast.success("Item dihapus");
    },
    onError: (error, _variables, context) => {
      console.error("Remove failed", error);
      toast.error("Gagal menghapus");
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // --- MEMOIZED CONTEXT VALUE ---
  // Prevents re-renders of all consumers when CartProvider renders,
  // unless values actually change.
  const contextValue = useMemo(
    () => ({
      cart: cartData || ({} as Cart),
      cartItems,
      totalAmount,
      addToCart: (product: Product) => addToCartMutation(product),
      removeFromCart: (itemId: number) => removeFromCartMutation({ itemId }),
      updateItem: (itemId: number, quantity: number) => {
        if (quantity < 1) return;
        updateItemMutation({ itemId, quantity });
      },
      isLoading,
      isError: !!error,
    }),
    [
      cartData,
      cartItems,
      totalAmount,
      isLoading,
      error,
      addToCartMutation,
      removeFromCartMutation,
      updateItemMutation,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
