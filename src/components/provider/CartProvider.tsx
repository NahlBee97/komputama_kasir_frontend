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

  // 1. LOCAL STATE (Replacing useQuery)
  const [cartData, setCartData] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // 2. FETCH CART INITIAL DATA
  useEffect(() => {
    let isMounted = true;

    const fetchCart = async () => {
      if (!user) {
        setCartData(null);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getUserCart();
        if (isMounted) setCartData(data);
      } catch (error) {
        if (isMounted) setError(error as Error);
        console.error("Failed to fetch cart", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCart();

    return () => {
      isMounted = false;
    };
  }, [user]);

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

  // 3. MANUAL OPTIMISTIC UPDATE: ADD ITEM
  const addToCart = useCallback(
    async (product: Product) => {
      // A. Snapshot previous state
      const prevCart = cartData;

      // B. Optimistically update UI
      setCartData((oldCart) => {
        // Handle case where cart doesn't exist yet
        if (!oldCart) {
          // Create a temporary mock structure if needed, or wait for server.
          // Usually better to wait if no cart exists, but assuming structure:
          return oldCart;
        }

        const existingItem = oldCart.items.find(
          (item) => item.product.id === product.id
        );

        let newItems: CartItem[];

        if (existingItem) {
          // Increment quantity locally
          newItems = oldCart.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // Add new item with temp ID so UI renders it immediately
          const newItem: CartItem = {
            id: Date.now(), // Temp ID
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
        // C. Call API
        // Assuming API returns the updated Cart or the new CartItem
        // It is best to reload the cart or use the response to ensure IDs are correct
        await addItemToCart(product.id, 1);

        // Refresh with real data to replace Temp IDs with Real IDs
        const updatedCart = await getUserCart();
        setCartData(updatedCart);
      } catch (error) {
        console.error("Add failed", error);
        toast.error("Gagal menyimpan");
        // D. Rollback on error
        setCartData(prevCart);
      }
    },
    [cartData]
  );

  // 4. MANUAL OPTIMISTIC UPDATE: UPDATE QUANTITY
  const updateItem = useCallback(
    async (itemId: number, quantity: number) => {
      if (quantity < 1) return;

      const prevCart = cartData;

      // Optimistic UI update
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
        // We don't necessarily need to refetch here if we trust the logic,
        // but fetching ensures consistency.
      } catch (error) {
        console.error("Update failed", error);
        toast.error("Gagal update");
        setCartData(prevCart);
      }
    },
    [cartData]
  );

  // 5. MANUAL OPTIMISTIC UPDATE: REMOVE ITEM
  const removeFromCart = useCallback(
    async (itemId: number) => {
      const prevCart = cartData;

      // Optimistic UI update
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
      isLoading,
      error,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
