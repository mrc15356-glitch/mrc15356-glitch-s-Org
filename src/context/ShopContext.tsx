import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category, CustomerInfo, DeliveryMethod, Order, OrderStatus, PaymentMethod, Product, ShopSettings } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/mockData';
import { useCart } from './CartContext';
import { saveOrderToSupabase } from '../lib/supabase';

type ActivePage = 'home' | 'shop' | 'calculator' | 'track' | 'admin' | 'confirmation';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  settings: ShopSettings;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedBrand: string | null;
  setSelectedBrand: (brand: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  activePolicy: 'privacy' | 'terms' | 'delivery' | 'return' | null;
  setActivePolicy: (policy: 'privacy' | 'terms' | 'delivery' | 'return' | null) => void;
  
  // Orders
  currentConfirmedOrder: Order | null;
  createOrder: (
    customer: CustomerInfo,
    paymentMethod: PaymentMethod,
    deliveryMethod: DeliveryMethod
  ) => Promise<Order>;
  trackOrder: (orderRef: string, phone: string) => Promise<Order | null>;
  allOrders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<boolean>;
  
  // Product & Settings Admin
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateSettings: (newSettings: ShopSettings) => Promise<void>;
  
  // Filter reset
  resetFilters: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'almalak_orders_history_v1';
const PRODUCTS_STORAGE_KEY = 'almalak_products_catalog_v1';
const SETTINGS_STORAGE_KEY = 'almalak_shop_settings_v1';

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { items: cartItems, clearCart, subtotal, vatAmount, deliveryFee, totalAmount } = useCart();
  
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [settings, setSettings] = useState<ShopSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [allOrders, setAllOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'delivery' | 'return' | null>(null);
  const [currentConfirmedOrder, setCurrentConfirmedOrder] = useState<Order | null>(null);

  // Sync with backend API if available
  useEffect(() => {
    const fetchRemoteData = async () => {
      try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const data = await prodRes.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
          }
        }
      } catch {
        // Fallback to local storage state
      }

      try {
        const settingsRes = await fetch('/api/settings');
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data && data.taxNumber) {
            setSettings(data);
          }
        }
      } catch {
        // Fallback
      }

      try {
        const ordersRes = await fetch('/api/orders');
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          if (Array.isArray(data) && data.length > 0) {
            setAllOrders(data);
          }
        }
      } catch {
        // Fallback
      }
    };

    fetchRemoteData();
  }, []);

  // Save changes to localStorage as a reliable backup
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(allOrders));
    } catch (e) {
      console.error(e);
    }
  }, [allOrders]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSelectedBrand(null);
    setPriceRange([0, 1000]);
  };

  const createOrder = async (
    customer: CustomerInfo,
    paymentMethod: PaymentMethod,
    deliveryMethod: DeliveryMethod
  ): Promise<Order> => {
    // Generate unique reference
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `MALAK-${new Date().getFullYear()}-${randomDigits}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}_${randomDigits}`,
      referenceNumber,
      createdAt: new Date().toISOString(),
      customer,
      items: cartItems.map((item) => ({
        productId: item.productId,
        productNameAr: item.productNameAr,
        productNameEn: item.productNameEn,
        size: item.size,
        sizeLabelAr: item.sizeLabelAr,
        sizeLabelEn: item.sizeLabelEn,
        color: item.color,
        customColorCode: item.customColorCode,
        unitPrice: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
      subtotal,
      vatAmount,
      deliveryFee: deliveryMethod === 'store_pickup' ? 0 : deliveryFee,
      totalAmount: deliveryMethod === 'store_pickup' ? subtotal : totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'online_card' ? 'paid' : 'pending',
      deliveryMethod,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: 'تم استلام وحجز طلب الدهانات بنجاح من الموقع الإلكتروني',
        },
      ],
    };

    // 1. Direct sync to Supabase (Client-Side Immediate Sync)
    try {
      const sbResult = await saveOrderToSupabase(newOrder);
      if (sbResult.success) {
        newOrder.supabaseSynced = true;
        newOrder.supabaseTable = sbResult.syncedTable || 'invoices';
        newOrder.supabaseSyncedAt = new Date().toISOString();
        console.log('Order successfully synced to Supabase table:', sbResult.syncedTable);
      } else {
        console.warn('Direct Supabase sync warning:', sbResult.error);
      }
    } catch (sbErr) {
      console.warn('Direct Supabase sync exception:', sbErr);
    }

    // 2. Try posting to backend API
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (response.ok) {
        const savedOrder = await response.json();
        // Preserve client-side supabaseSync flag
        savedOrder.supabaseSynced = true;
        savedOrder.supabaseTable = newOrder.supabaseTable || 'invoices';
        setAllOrders((prev) => [savedOrder, ...prev]);
        setCurrentConfirmedOrder(savedOrder);
        clearCart();
        return savedOrder;
      }
    } catch (err) {
      console.warn('Backend API order post failed, utilizing local persistence:', err);
    }

    // Local state fallback
    setAllOrders((prev) => [newOrder, ...prev]);
    setCurrentConfirmedOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const trackOrder = async (orderRef: string, phone: string): Promise<Order | null> => {
    const cleanRef = orderRef.trim().toUpperCase();
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    // Check backend first
    try {
      const res = await fetch(`/api/orders/track?ref=${encodeURIComponent(cleanRef)}&phone=${encodeURIComponent(cleanPhone)}`);
      if (res.ok) {
        const found = await res.json();
        if (found) return found;
      }
    } catch {
      // fallback
    }

    // Check local orders
    const matched = allOrders.find(
      (o) =>
        (o.referenceNumber.toUpperCase() === cleanRef || o.id === cleanRef) &&
        (cleanPhone === '' || o.customer.phone.replace(/[^0-9]/g, '').includes(cleanPhone.slice(-7)))
    );

    return matched || null;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, note?: string): Promise<boolean> => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note }),
      });
    } catch (e) {
      console.warn('Remote status update error:', e);
    }

    setAllOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.referenceNumber === orderId) {
          const newHistory = [
            ...ord.statusHistory,
            {
              status,
              timestamp: new Date().toISOString(),
              note: note || `تحديث الحالة إلى: ${status}`,
            },
          ];
          return {
            ...ord,
            status,
            statusHistory: newHistory,
          };
        }
        return ord;
      })
    );

    return true;
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `p-${Date.now()}`,
      isDemo: false,
    };

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
    } catch (e) {
      console.warn(e);
    }

    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
    } catch (e) {
      console.warn(e);
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = async (productId: string) => {
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn(e);
    }

    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateSettings = async (newSettings: ShopSettings) => {
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
    } catch (e) {
      console.warn(e);
    }

    setSettings(newSettings);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        settings,
        activePage,
        setActivePage,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedBrand,
        setSelectedBrand,
        priceRange,
        setPriceRange,
        selectedProductForModal,
        setSelectedProductForModal,
        activePolicy,
        setActivePolicy,
        currentConfirmedOrder,
        createOrder,
        trackOrder,
        allOrders,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        resetFilters,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
