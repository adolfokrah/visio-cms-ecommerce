import { getProjectMode } from 'visio-cms-lib';
import { create } from 'zustand';
import { toast } from 'sonner';
import { persist, createJSONStorage } from 'zustand/middleware';

type Cart = {
  cart: {
    id: number;
    qty: number;
    color: string;
  }[];
  addToCart: (product: { id: number; qty: number; color: string }) => void;
  removeFromCart: (productId: number, color: string) => void;
  updateQty: (productId: number, qty: number, color: string) => void;
};

export const useCartState = create(
  persist<Cart>(
    (set) => ({
      cart: [],
      addToCart: (product) => {
        const isLiveMode = getProjectMode() === 'LIVE';
        if (!isLiveMode) return;
        set((state) => {
          const existingProduct = state.cart.find((p) => p.id === product.id && p.color == product.color);
          if (existingProduct) {
            const updatedcart = state.cart.map((p) => {
              if (p.id === product.id && p.color === product.color) {
                return { ...p, qty: p.qty + product.qty };
              }
              return p;
            });
            return { cart: updatedcart };
          } else {
            return { cart: [...state.cart, product] };
          }
        });
        toast.success('Product added to cart');
      },
      removeFromCart: (productId, color) => {
        const isLiveMode = getProjectMode() === 'LIVE';
        if (!isLiveMode) return;
        console.log(color, productId);
        set((state) => {
          const data = state.cart.filter((product) => product.id !== productId || product.color !== color);
          return { cart: data };
        });
        toast.success('Product removed');
      },
      updateQty: (productId, qty, color) => {
        const isLiveMode = getProjectMode() === 'LIVE';
        if (!isLiveMode) return;
        set((state) => ({
          cart: state.cart.map((product) => {
            if (product.id == productId && product.color == color) {
              return { ...product, qty };
            }
            return product;
          }),
        }));
        toast.success('Quantity updated');
      },
    }),
    {
      name: 'cart-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

export default useCartState;
