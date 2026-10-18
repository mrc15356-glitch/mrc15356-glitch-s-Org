import { createClient } from '@supabase/supabase-js';

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
