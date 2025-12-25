import {
  useMemo,
  type ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
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
import { useAuth } from "../../hooks/useAuth";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  // 1. LOCAL STATE
  const [cartData, setCartData] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // 2. NEW: REFRESH CART METHOD (Extracted for reusability)
  const refreshCart = useCallback(async () => {
    if (!user) {
      setCartData(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getUserCart();
      setCartData(data);
    } catch (error) {
      setError(error as Error);
      console.error("Failed to fetch cart", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // 3. FETCH CART INITIAL DATA (Uses the method above)
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Derived state
  const cartItems = useMemo(() => cartData?.items || [], [cartData]);

  const totalAmount = useMemo(
    () =>
      cartItems.reduce(
        (sum: number, item: CartItem) =>
          sum + item.product.price * item.quantity,
        0
      ),
    [cartItems]
  );

  // 4. MANUAL OPTIMISTIC UPDATE: ADD ITEM
  const addToCart = useCallback(
    async (product: Product) => {
      const prevCart = cartData;

      // Optimistic Update
      setCartData((oldCart) => {
        if (!oldCart) return oldCart;

        const existingItem = oldCart.items.find(
          (item) => item.product.id === product.id
        );

        let newItems: CartItem[];

        if (existingItem) {
          newItems = oldCart.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          const newItem: CartItem = {
            id: Date.now(),
            cartId: oldCart.id,
            productId: product.id,
            quantity: 1,
            product,
          };
          newItems = [...oldCart.items, newItem];
        }

        return { ...oldCart, items: newItems };
      });

      try {
        await addItemToCart(product.id, 1);
        // Refresh to ensure IDs and data are synced with server
        const updatedCart = await getUserCart();
        setCartData(updatedCart);
      } catch (error) {
        console.error("Add failed", error);
        toast.error("Gagal menyimpan");
        setCartData(prevCart);
      }
    },
    [cartData]
  );

  // 5. MANUAL OPTIMISTIC UPDATE: UPDATE QUANTITY
  const updateItem = useCallback(
    async (itemId: number, quantity: number) => {
      if (quantity < 1) return;
      const prevCart = cartData;

      setCartData((oldCart) => {
        if (!oldCart) return oldCart;
        return {
          ...oldCart,
          items: oldCart.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        };
      });

      try {
        await updateItemQuantity(itemId, quantity);
      } catch (error) {
        console.error("Update failed", error);
        toast.error("Gagal update");
        setCartData(prevCart);
      }
    },
    [cartData]
  );

  // 6. MANUAL OPTIMISTIC UPDATE: REMOVE ITEM
  const removeFromCart = useCallback(
    async (itemId: number) => {
      const prevCart = cartData;

      setCartData((oldCart) => {
        if (!oldCart) return oldCart;
        return {
          ...oldCart,
          items: oldCart.items.filter((item) => item.id !== itemId),
        };
      });

      try {
        await removeItemFromCart(itemId);
        toast.success("Item dihapus");
      } catch (error) {
        console.error("Remove failed", error);
        toast.error("Gagal menghapus");
        setCartData(prevCart);
      }
    },
    [cartData]
  );

  // --- MEMOIZED CONTEXT VALUE ---
  const contextValue = useMemo(
    () => ({
      cart: cartData || ({} as Cart),
      cartItems,
      totalAmount,
      addToCart,
      removeFromCart,
      updateItem,
      refreshCart, // <--- Exposed here
      isLoading,
      isError: !!error,
    }),
    [
      cartData,
      cartItems,
      totalAmount,
      addToCart,
      removeFromCart,
      updateItem,
      refreshCart,
      isLoading,
      error,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
