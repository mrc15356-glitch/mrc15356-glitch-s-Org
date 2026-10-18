import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS } from './src/data/mockData.ts';
import { Order, OrderStatus, Product, ShopSettings } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Supabase Configuration
const SUPABASE_PROJECT_ID = 'ryvxezwdbvvajlkmatpt';
const SUPABASE_URL = process.env.SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_ylQvVaA7mn_exGSKvld_fA_5KQy_NX1';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Persistent Data File
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'store.json');

interface StoreData {
  products: Product[];
  categories: any[];
  settings: ShopSettings;
  orders: Order[];
}

// Load or initialize store data
function loadStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading store file, initializing defaults:', err);
  }

  const initialStore: StoreData = {
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    settings: INITIAL_SETTINGS,
    orders: [],
  };

  saveStore(initialStore);
  return initialStore;
}

function saveStore(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store data:', err);
  }
}

let store = loadStore();

// Sync Order / Invoice to Supabase
async function saveInvoiceToSupabase(order: Order) {
  try {
    const payload = {
      id: order.id,
      reference_number: order.referenceNumber,
      customer_name: order.customer.fullName,
      customer_phone: order.customer.phone,
      customer_whatsapp: order.customer.whatsapp || null,
      customer_city: order.customer.city || 'الطائف',
      customer_district: order.customer.district || null,
      delivery_address: order.customer.address || null,
      delivery_method: order.deliveryMethod,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      subtotal: Number(order.subtotal),
      vat_amount: Number(order.vatAmount),
      delivery_fee: Number(order.deliveryFee),
      total_amount: Number(order.totalAmount),
      status: order.status,
      items: order.items,
      notes: order.customer.notes || null,
      created_at: order.createdAt || new Date().toISOString(),
    };

    // Attempt upsert to 'invoices' table
    const { data, error } = await supabase
      .from('invoices')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase [invoices] table note:', error.message);
      // Fallback try 'orders' table
      const fallback = await supabase
        .from('orders')
        .upsert(payload, { onConflict: 'id' });
      if (fallback.error) {
        return { success: false, error: error.message };
      }
      return { success: true, table: 'orders' };
    }
    return { success: true, table: 'invoices', data };
  } catch (err: any) {
    console.error('Error saving invoice to Supabase:', err);
    return { success: false, error: err?.message || String(err) };
  }
}

app.use(express.json());

// API Endpoints

// 1. Health & Meta
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    shop: store.settings.shopNameAr,
    taxNumber: store.settings.taxNumber,
    timestamp: new Date().toISOString(),
  });
});

// 2. Settings
app.get('/api/settings', (req: Request, res: Response) => {
  res.json(store.settings);
});

app.put('/api/settings', (req: Request, res: Response) => {
  const newSettings = req.body;
  if (!newSettings || !newSettings.taxNumber) {
    return res.status(400).json({ error: 'Invalid settings payload' });
  }
  store.settings = { ...store.settings, ...newSettings };
  saveStore(store);
  res.json(store.settings);
});

// 3. Categories
app.get('/api/categories', (req: Request, res: Response) => {
  res.json(store.categories);
});

// 4. Products
app.get('/api/products', (req: Request, res: Response) => {
  const { category, brand, search } = req.query;
  let result = [...store.products];

  if (category && typeof category === 'string') {
    result = result.filter((p) => p.categoryId === category);
  }
  if (brand && typeof brand === 'string') {
    result = result.filter((p) => p.brand === brand);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  res.json(result);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = store.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    ...req.body,
    id: req.body.id || `p-${Date.now()}`,
    isDemo: false,
  };
  store.products.unshift(newProduct);
  saveStore(store);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const idx = store.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  store.products[idx] = { ...store.products[idx], ...req.body, id: req.params.id };
  saveStore(store);
  res.json(store.products[idx]);
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  store.products = store.products.filter((p) => p.id !== req.params.id);
  saveStore(store);
  res.json({ success: true });
});

// 5. Orders (Server-side price verification to prevent manipulation)
app.get('/api/orders', (req: Request, res: Response) => {
  res.json(store.orders);
});

app.get('/api/orders/track', (req: Request, res: Response) => {
  const { ref, phone } = req.query;
  if (!ref || typeof ref !== 'string') {
    return res.status(400).json({ error: 'Missing order reference' });
  }

  const cleanRef = ref.trim().toUpperCase();
  const cleanPhone = typeof phone === 'string' ? phone.replace(/[^0-9]/g, '') : '';

  const matched = store.orders.find(
    (o) =>
      o.referenceNumber.toUpperCase() === cleanRef ||
      o.id === cleanRef
  );

  if (!matched) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // If phone is provided, verify match for security
  if (cleanPhone) {
    const orderPhone = matched.customer.phone.replace(/[^0-9]/g, '');
    if (!orderPhone.includes(cleanPhone.slice(-7))) {
      return res.status(401).json({ error: 'Phone verification mismatch' });
    }
  }

  res.json(matched);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const { customer, items, paymentMethod, deliveryMethod } = req.body;

  if (!customer || !customer.fullName || !customer.phone) {
    return res.status(400).json({ error: 'Customer information is incomplete' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one paint item' });
  }

  // Server-side validation of prices against product database
  let verifiedSubtotal = 0;
  const verifiedItems = items.map((clientItem: any) => {
    const product = store.products.find((p) => p.id === clientItem.productId);
    let unitPrice = clientItem.unitPrice || clientItem.price || 50;

    if (product) {
      // Find matching size
      const matchedSize = product.sizes.find((s) => s.size === clientItem.size);
      if (matchedSize) {
        unitPrice = matchedSize.price;
      } else {
        unitPrice = product.basePrice;
      }
    }

    const qty = Math.max(1, Number(clientItem.quantity) || 1);
    const lineTotal = unitPrice * qty;
    verifiedSubtotal += lineTotal;

    return {
      productId: clientItem.productId,
      productNameAr: clientItem.productNameAr || (product ? product.nameAr : 'دهان'),
      productNameEn: clientItem.productNameEn || (product ? product.nameEn : 'Paint Item'),
      size: clientItem.size || 'Standard',
      sizeLabelAr: clientItem.sizeLabelAr || clientItem.size,
      sizeLabelEn: clientItem.sizeLabelEn || clientItem.size,
      color: clientItem.color,
      customColorCode: clientItem.customColorCode,
      unitPrice,
      quantity: qty,
      subtotal: lineTotal,
    };
  });

  const isStorePickup = deliveryMethod === 'store_pickup';
  const deliveryFee = isStorePickup || verifiedSubtotal >= store.settings.freeDeliveryThreshold ? 0 : store.settings.deliveryFee;
  const totalAmount = verifiedSubtotal + deliveryFee;
  const vatAmount = Number(((verifiedSubtotal * 15) / 115).toFixed(2));

  // Generate unique order reference (e.g. MALAK-2026-8491)
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const referenceNumber = `MALAK-${new Date().getFullYear()}-${randomDigits}`;

  const newOrder: Order = {
    id: `ord_${Date.now()}_${randomDigits}`,
    referenceNumber,
    createdAt: new Date().toISOString(),
    customer: {
      fullName: customer.fullName.trim(),
      phone: customer.phone.trim(),
      whatsapp: customer.whatsapp ? customer.whatsapp.trim() : customer.phone.trim(),
      city: customer.city || 'الطائف',
      district: customer.district || 'الشهداء الشمالية',
      address: isStorePickup ? 'استلام من المحل - شارع البحرين' : customer.address,
      googleMapsUrl: customer.googleMapsUrl,
      preferredDate: customer.preferredDate,
      preferredTimeSlot: customer.preferredTimeSlot,
      notes: customer.notes,
    },
    items: verifiedItems,
    subtotal: verifiedSubtotal,
    vatAmount,
    deliveryFee,
    totalAmount,
    paymentMethod: paymentMethod || 'cod',
    paymentStatus: paymentMethod === 'online_card' ? 'paid' : 'pending',
    deliveryMethod: deliveryMethod || 'home_delivery',
    status: 'pending',
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date().toISOString(),
        note: 'تم استلام وحجز الطلب بنجاح عبر المتجر الإلكتروني',
      },
    ],
  };

  store.orders.unshift(newOrder);
  saveStore(store);

  // Sync invoice to user's Supabase account asynchronously
  saveInvoiceToSupabase(newOrder)
    .then((result) => {
      console.log('Supabase sync result for order', newOrder.referenceNumber, result);
    })
    .catch((err) => {
      console.error('Supabase sync error for order', newOrder.referenceNumber, err);
    });

  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', async (req: Request, res: Response) => {
  const { status, note } = req.body;
  const order = store.orders.find((o) => o.id === req.params.id || o.referenceNumber === req.params.id);

  if (!order) return res.status(404).json({ error: 'Order not found' });

  const validStatuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'processing',
    'ready',
    'delivered',
    'cancelled',
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  order.status = status;
  order.statusHistory.push({
    status,
    timestamp: new Date().toISOString(),
    note: note || `تحديث الحالة إلى: ${status}`,
  });

  saveStore(store);

  // Update in Supabase
  try {
    await supabase.from('invoices').update({ status }).eq('id', order.id);
  } catch (e) {
    console.warn('Failed to update status in Supabase:', e);
  }

  res.json(order);
});

// 6. Supabase Health & Management Endpoints
app.get('/api/supabase/status', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('invoices').select('count', { count: 'exact', head: true });
    
    if (error) {
      return res.json({
        connected: true,
        projectId: SUPABASE_PROJECT_ID,
        supabaseUrl: SUPABASE_URL,
        tableExists: false,
        message: error.message,
        sqlCreateScript: `CREATE TABLE IF NOT EXISTS invoices (
  id text PRIMARY KEY,
  reference_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_whatsapp text,
  customer_city text,
  customer_district text,
  delivery_address text,
  delivery_method text,
  payment_method text,
  payment_status text,
  subtotal numeric,
  vat_amount numeric,
  delivery_fee numeric,
  total_amount numeric,
  status text DEFAULT 'pending',
  items jsonb,
  notes text,
  created_at timestamptz DEFAULT now()
);`,
      });
    }

    res.json({
      connected: true,
      projectId: SUPABASE_PROJECT_ID,
      supabaseUrl: SUPABASE_URL,
      tableExists: true,
      invoicesCount: data,
    });
  } catch (err: any) {
    res.status(500).json({
      connected: false,
      projectId: SUPABASE_PROJECT_ID,
      error: err?.message || String(err),
    });
  }
});

app.post('/api/supabase/sync', async (req: Request, res: Response) => {
  const results = [];
  let successCount = 0;
  let failCount = 0;
  let lastError = null;

  for (const ord of store.orders) {
    const resSync = await saveInvoiceToSupabase(ord);
    if (resSync.success) {
      successCount++;
    } else {
      failCount++;
      lastError = resSync.error;
    }
    results.push({ ref: ord.referenceNumber, ...resSync });
  }

  res.json({
    total: store.orders.length,
    successCount,
    failCount,
    lastError,
    results,
  });
});

// Admin login endpoint
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (
    (email === 'admin@almalak.sa' || email === 'admin') &&
    password === 'admin123'
  ) {
    return res.json({
      success: true,
      token: 'almalak_admin_secret_token_2026',
      user: {
        email: 'admin@almalak.sa',
        role: 'admin',
        name: 'مدير مركز المالك',
      },
    });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Start Server & mount Vite
async function start() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Markaz Almalak Paint Shop Server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Server startup error:', err);
});
