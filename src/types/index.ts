export type Language = 'ar' | 'en';

export interface ProductSize {
  size: string;
  labelAr: string;
  labelEn: string;
  price: number;
  inStock: boolean;
}

export interface ProductColor {
  nameAr: string;
  nameEn: string;
  hex: string;
  code?: string;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryId: string;
  categoryNameAr: string;
  categoryNameEn: string;
  brand: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  sizes: ProductSize[];
  colors: ProductColor[];
  basePrice: number;
  rating: number;
  reviewsCount: number;
  coverage: string; // e.g. "12-14 m²/L"
  dryTime: string;  // e.g. "2-4 hours"
  finish: string;   // e.g. "Silk" / "Matt" / "Textured"
  isBestSeller?: boolean;
  isSpecialOffer?: boolean;
  discountPercent?: number;
  stock: number;
  isDemo?: boolean;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  iconName: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  id: string; // Unique combination of productId + size + color
  productId: string;
  productNameAr: string;
  productNameEn: string;
  brand: string;
  image: string;
  size: string;
  sizeLabelAr: string;
  sizeLabelEn: string;
  color?: ProductColor;
  customColorCode?: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'bank_transfer' | 'online_card';
export type DeliveryMethod = 'home_delivery' | 'store_pickup';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  whatsapp: string;
  city: string;
  district: string;
  address: string;
  googleMapsUrl?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productNameAr: string;
  productNameEn: string;
  size: string;
  sizeLabelAr: string;
  sizeLabelEn: string;
  color?: ProductColor;
  customColorCode?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  referenceNumber: string; // e.g. MALAK-2026-8491
  createdAt: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  vatAmount: number; // 15% Saudi VAT
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'verified_by_admin';
  deliveryMethod: DeliveryMethod;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  supabaseSynced?: boolean;
  supabaseTable?: string;
  supabaseSyncedAt?: string;
}

export interface ShopSettings {
  shopNameAr: string;
  shopNameEn: string;
  taglineAr: string;
  taglineEn: string;
  taxNumber: string; // 311056774700003
  phone: string;     // 0581702837
  whatsapp: string;  // 0581702837
  addressAr: string;
  addressEn: string;
  cityAr: string;
  cityEn: string;
  workingHoursAr: string;
  workingHoursEn: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  bankName: string;
  bankAccountHolder: string;
  iban: string;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  nationalAddress?: string;
}
