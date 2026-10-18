import { createClient } from '@supabase/supabase-js';
import { Order } from '../types';

export const SUPABASE_PROJECT_ID = 'ryvxezwdbvvajlkmatpt';
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY =
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_ylQvVaA7mn_exGSKvld_fA_5KQy_NX1';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseInvoiceRecord {
  id: string;
  reference_number: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp?: string;
  customer_city?: string;
  customer_district?: string;
  delivery_address?: string;
  delivery_method?: string;
  payment_method?: string;
  payment_status?: string;
  subtotal: number;
  vat_amount: number;
  delivery_fee: number;
  total_amount: number;
  status: string;
  items: any;
  notes?: string;
  created_at?: string;
}

/**
 * Format order into Supabase database record payload
 */
export function formatOrderToSupabasePayload(order: Order): SupabaseInvoiceRecord {
  return {
    id: order.id,
    reference_number: order.referenceNumber,
    customer_name: order.customer.fullName,
    customer_phone: order.customer.phone,
    customer_whatsapp: order.customer.whatsapp || order.customer.phone,
    customer_city: order.customer.city || 'الطائف',
    customer_district: order.customer.district || 'الشهداء الشمالية',
    delivery_address: order.customer.address || '',
    delivery_method: order.deliveryMethod,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    subtotal: Number(order.subtotal),
    vat_amount: Number(order.vatAmount),
    delivery_fee: Number(order.deliveryFee),
    total_amount: Number(order.totalAmount),
    status: order.status,
    items: order.items,
    notes: order.customer.notes || undefined,
    created_at: order.createdAt || new Date().toISOString(),
  };
}

/**
 * Save order to Supabase table 'invoices', and also try 'order_booking' and 'orders'
 */
export async function saveOrderToSupabase(order: Order): Promise<{
  success: boolean;
  syncedTable: string;
  additionalTables?: string[];
  error?: string;
}> {
  const payload = formatOrderToSupabasePayload(order);
  let primarySuccess = false;
  let syncedTable = '';
  let primaryError = '';
  const additionalSynced: string[] = [];

  // 1. Try 'invoices' table
  try {
    const resInvoices = await supabase.from('invoices').upsert(payload, { onConflict: 'id' });
    if (!resInvoices.error) {
      primarySuccess = true;
      syncedTable = 'invoices';
    } else {
      primaryError = resInvoices.error.message;
      console.warn('Supabase invoices upsert warning:', resInvoices.error);
    }
  } catch (err: any) {
    primaryError = err?.message || String(err);
    console.warn('Supabase invoices network exception:', err);
  }

  // 2. Try 'order_booking' table (in case user created table order_booking)
  try {
    const resOrderBooking = await supabase.from('order_booking').upsert(payload, { onConflict: 'id' });
    if (!resOrderBooking.error) {
      if (!primarySuccess) {
        primarySuccess = true;
        syncedTable = 'order_booking';
      } else {
        additionalSynced.push('order_booking');
      }
    }
  } catch {
    // optional table
  }

  // 3. Try 'orders' table (in case user created table orders)
  try {
    const resOrders = await supabase.from('orders').upsert(payload, { onConflict: 'id' });
    if (!resOrders.error) {
      if (!primarySuccess) {
        primarySuccess = true;
        syncedTable = 'orders';
      } else {
        additionalSynced.push('orders');
      }
    }
  } catch {
    // optional table
  }

  return {
    success: primarySuccess,
    syncedTable: syncedTable || 'invoices',
    additionalTables: additionalSynced,
    error: primarySuccess ? undefined : primaryError,
  };
}

/**
 * Fetch live records from Supabase
 */
export async function fetchLiveSupabaseInvoices(): Promise<{
  data: SupabaseInvoiceRecord[] | null;
  count: number;
  error?: string;
}> {
  try {
    const res = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (res.error) {
      return { data: null, count: 0, error: res.error.message };
    }

    return { data: (res.data as SupabaseInvoiceRecord[]) || [], count: res.data?.length || 0 };
  } catch (err: any) {
    return { data: null, count: 0, error: err?.message || String(err) };
  }
}
