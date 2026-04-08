import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cart: [],
  addToCart: (product, quantity = 1) => set((state) => {
    const existing = state.cart.find(item => item.product.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      };
    }
    return { cart: [...state.cart, { product, quantity }] };
  }),
  updateQuantity: (productId, quantity) => set((state) => ({
    cart: state.cart.map(item => 
      item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  })),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.product.id !== productId)
  })),
  clearCart: () => set({ cart: [] }),
}));
