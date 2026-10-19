import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, ProductColor, ProductSize } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: ProductSize, color?: ProductColor, customColorCode?: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  vatAmount: number;
  deliveryFee: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  freeDeliveryThreshold: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'almalak_shopping_cart_v1';
const FREE_DELIVERY_THRESHOLD = 1000;
const STANDARD_DELIVERY_FEE = 25;

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (
    product: Product,
    size: ProductSize,
    color?: ProductColor,
    customColorCode?: string,
    quantity = 1
  ) => {
    const colorKey = color?.code || customColorCode || 'default';
    const itemId = `${product.id}-${size.size}-${colorKey}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          productNameAr: product.nameAr,
          productNameEn: product.nameEn,
          brand: product.brand,
          image: product.image,
          size: size.size,
          sizeLabelAr: size.labelAr,
          sizeLabelEn: size.labelEn,
          color,
          customColorCode,
          price: size.price,
          quantity,
        };
        return [...prevItems, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Saudi VAT is 15% (prices include VAT or add VAT according to regulations)
  // Here prices are net or VAT inclusive. Let's show subtotal, free delivery calculation, and exact totals.
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
  // Subtotal already reflects price in SAR; let's extract the 15% VAT component for invoice clarity
  const vatAmount = Number(((subtotal * 15) / 115).toFixed(2));
  const totalAmount = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        vatAmount,
        deliveryFee,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
