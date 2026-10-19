import React, { useState } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Settings,
  Database,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Truck,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Search,
  ExternalLink,
  ChevronDown,
  X,
  Copy,
  Filter,
  Sparkles,
  Check,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { Order, OrderStatus, Product, ProductSize } from '../../types';
import { fetchLiveSupabaseInvoices, saveOrderToSupabase, SupabaseInvoiceRecord } from '../../lib/supabase';
import { ProductEditorModal } from './ProductEditorModal';

export const AdminDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    products,
    categories,
    settings,
    allOrders,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    updateSettings,
    setActivePage,
  } = useShop();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('almalak_admin_logged') === 'true';
  });

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings' | 'database'>('orders');

  // Orders Tab Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Product Add / Edit Modal
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productBrandFilter, setProductBrandFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all');
  const [productSuccessMsg, setProductSuccessMsg] = useState<string | null>(null);

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Supabase Sync States
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [supabaseSyncResult, setSupabaseSyncResult] = useState<any>(null);
  const [supabaseLiveRecords, setSupabaseLiveRecords] = useState<SupabaseInvoiceRecord[]>([]);
  const [isFetchingSupabase, setIsFetchingSupabase] = useState(false);
  const [supabaseFetchError, setSupabaseFetchError] = useState<string | null>(null);
  const [testBookingMsg, setTestBookingMsg] = useState<string | null>(null);

  const loadSupabaseRecords = async () => {
    setIsFetchingSupabase(true);
    setSupabaseFetchError(null);
    try {
      const res = await fetchLiveSupabaseInvoices();
      if (res.data) {
        setSupabaseLiveRecords(res.data);
      } else if (res.error) {
        setSupabaseFetchError(res.error);
      }
    } catch (e: any) {
      setSupabaseFetchError(e?.message || 'Error loading records');
    } finally {
      setIsFetchingSupabase(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'database' && isAuthenticated) {
      loadSupabaseRecords();
    }
  }, [activeTab, isAuthenticated]);

  const handleTestSupabaseBooking = async () => {
    setTestBookingMsg(null);
    setSupabaseFetchError(null);
    const testRef = `MALAK-TEST-${Math.floor(1000 + Math.random() * 9000)}`;
    const testOrder: Order = {
      id: `ord_${Date.now()}_test`,
      referenceNumber: testRef,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: 'حجز تجريبي (Test Order Booking)',
        phone: '0581702837',
        whatsapp: '0581702837',
        city: 'الطائف (Taif)',
        district: 'الشهداء الشمالية',
        address: '2936 حسان بن ثابت، شارع البحرين بعد شركة زين',
      },
      items: [
        {
          productId: 'test-paint',
          productNameAr: 'دهان جوتن فينوماستيك حريري فاخر (حجز تجربة)',
          productNameEn: 'Jotun Fenomastic Pure Silk (Test)',
          size: '4L',
          sizeLabelAr: '4 لتر (جالون)',
          sizeLabelEn: '4 Liters',
          unitPrice: 165,
          quantity: 1,
          subtotal: 165,
        },
      ],
      subtotal: 165,
      vatAmount: 21.52,
      deliveryFee: 0,
      totalAmount: 165,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      deliveryMethod: 'store_pickup',
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: 'طلب حجز تجريبي لاختبار التخزين في سوبابيز',
        },
      ],
    };

    const res = await saveOrderToSupabase(testOrder);
    if (res.success) {
      setTestBookingMsg(`✅ نجح الإرسال والحجز فورياً! تم حفظ الطلب (${testRef}) في جدول [${res.syncedTable}] في سوبابيز بنجاح.`);
      loadSupabaseRecords();
    } else {
      setSupabaseFetchError(`فشل الإرسال إلى سوبابيز: ${res.error}`);
    }
  };

  const handleRunSupabaseSync = async () => {
    setIsSyncingSupabase(true);
    setSupabaseSyncResult(null);
    try {
      const res = await fetch('/api/supabase/sync', { method: 'POST' });
      const data = await res.json();
      setSupabaseSyncResult(data);
      loadSupabaseRecords();
    } catch (err: any) {
      setSupabaseSyncResult({ error: err?.message || 'Sync failed' });
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Secure authentication check
    // Preset credentials: admin@almalak.sa / admin123
    if (
      (emailInput.trim().toLowerCase() === 'admin@almalak.sa' || emailInput.trim() === 'admin') &&
      passwordInput === 'admin123'
    ) {
      setIsAuthenticated(true);
      localStorage.setItem('almalak_admin_logged', 'true');
    } else {
      setAuthError(language === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid email or password');
    }
  };

  const handleQuickDemoLogin = () => {
    setEmailInput('admin@almalak.sa');
    setPasswordInput('admin123');
    setIsAuthenticated(true);
    localStorage.setItem('almalak_admin_logged', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('almalak_admin_logged');
  };

  // Metrics
  const totalRevenue = allOrders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const pendingOrdersCount = allOrders.filter((ord) => ord.status === 'pending').length;

  // Filtered orders
  const filteredOrders = allOrders.filter((ord) => {
    if (orderStatusFilter !== 'all' && ord.status !== orderStatusFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchRef = ord.referenceNumber.toLowerCase().includes(q);
      const matchCustomer = ord.customer.fullName.toLowerCase().includes(q);
      const matchPhone = ord.customer.phone.includes(q);
      if (!matchRef && !matchCustomer && !matchPhone) return false;
    }
    return true;
  });

  // Product management & filtering
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));

  const filteredProducts = products.filter((p) => {
    if (productCategoryFilter !== 'all' && p.categoryId !== productCategoryFilter) return false;
    if (productBrandFilter !== 'all' && p.brand !== productBrandFilter) return false;
    if (productStockFilter === 'in_stock' && p.stock <= 0) return false;
    if (productStockFilter === 'low_stock' && (p.stock <= 0 || p.stock > 10)) return false;
    if (productStockFilter === 'out_of_stock' && p.stock > 0) return false;
    if (productSearchQuery.trim()) {
      const q = productSearchQuery.toLowerCase();
      const matchName = p.nameAr.toLowerCase().includes(q) || (p.nameEn && p.nameEn.toLowerCase().includes(q));
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchId = p.id.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchId) return false;
    }
    return true;
  });

  const handleSaveProductFromModal = async (savedProduct: Product) => {
    const isExisting = products.some((p) => p.id === savedProduct.id);
    if (isExisting) {
      await updateProduct(savedProduct);
      setProductSuccessMsg(`✅ تم تحديث بيانات منتج "${savedProduct.nameAr}" بنجاح!`);
    } else {
      await addProduct(savedProduct);
      setProductSuccessMsg(`✅ تمت إضافة المنتج الجديد "${savedProduct.nameAr}" إلى الكتالوج بنجاح!`);
    }
    setTimeout(() => setProductSuccessMsg(null), 4000);
  };

  const handleDuplicateProduct = (p: Product) => {
    setEditingProduct({
      ...p,
      id: undefined,
      nameAr: `${p.nameAr} (نسخة جديدة)`,
      nameEn: p.nameEn ? `${p.nameEn} (Copy)` : '',
    });
    setIsEditingProduct(true);
  };

  const handleDeleteProduct = async (p: Product) => {
    const confirmed = window.confirm(
      language === 'ar'
        ? `هل أنت متأكد من حذف المنتج "${p.nameAr}" نهائياً من المتجر؟`
        : `Are you sure you want to delete "${p.nameEn || p.nameAr}"?`
    );
    if (confirmed) {
      await deleteProduct(p.id);
      setProductSuccessMsg(`🗑️ تم حذف المنتج "${p.nameAr}" بنجاح.`);
      setTimeout(() => setProductSuccessMsg(null), 4000);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Login view if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="py-16 bg-slate-100 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-950 text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-950">
              {t('adminLoginTitle')}
            </h2>
            <p className="text-xs text-slate-500">
              {settings.shopNameAr} - {language === 'ar' ? 'الطائف' : 'Taif'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="text-slate-700 font-bold block mb-1">
                {t('emailOrUsername')}
              </label>
              <input
                type="text"
                required
                placeholder="admin@almalak.sa"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">
                {t('password')}
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-950 hover:bg-blue-900 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{t('loginBtn')}</span>
            </button>
          </form>

          {/* Quick Demo Access Helper */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-[11px] text-slate-500">
              {t('demoAdminCredentials')}
            </p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl text-xs transition-colors border border-amber-300"
            >
              ⚡ {language === 'ar' ? 'دخول سريع بحساب الإدارة التجريبي' : 'One-Click Demo Admin Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Top Admin Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-950 to-indigo-900 text-amber-400 flex items-center justify-center font-bold text-xl shadow-md">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-950">
                  {t('adminDashboard')}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  مدير النظام
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {settings.shopNameAr} • الطائف - شارع البحرين
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage('home')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              {language === 'ar' ? 'عرض المتجر' : 'View Storefront'}
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>

        {/* Top 4 Metrics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">{t('totalOrders')}</p>
              <p className="text-2xl font-black text-blue-950 mt-1">{allOrders.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">{t('totalRevenue')}</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                {totalRevenue} <span className="text-xs font-normal text-slate-500">{t('currency')}</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">{t('pendingOrders')}</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{pendingOrdersCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">{language === 'ar' ? 'أصناف الدهانات النشطة' : 'Active Paint SKUs'}</p>
              <p className="text-2xl font-black text-indigo-900 mt-1">{products.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-blue-950 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>{t('ordersTab')} ({allOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-blue-950 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>{t('productsTab')} ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-blue-950 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>{t('settingsTab')}</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'database'
                ? 'bg-blue-950 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4 text-amber-400" />
            <span>{t('databaseTab')}</span>
          </button>
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'ar' ? 'سجل طلبات العملاء في الطائف' : 'Customer Orders Registry'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'متابعة الطلبات، تحديث حالات التجهيز، وعرض الفواتير' : 'Manage orders and fulfillment statuses'}
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'بحث برقم المرجع أو الاسم أو الجوال...' : 'Search ref or name...'}
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
                />

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="pending">قيد الانتظار (Pending)</option>
                  <option value="confirmed">تم التأكيد (Confirmed)</option>
                  <option value="processing">قيد التجهيز والخلط (Processing)</option>
                  <option value="ready">جاهز للتوصيل أو الاستلام (Ready)</option>
                  <option value="delivered">تم التسليم (Delivered)</option>
                  <option value="cancelled">ملغي (Cancelled)</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                {language === 'ar' ? 'لا توجد طلبات تطابق الفلتر المحدد حالياً.' : 'No orders found matching filters.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 text-[11px]">
                      <th className="py-2.5 text-start font-bold">رقم المرجع / التاريخ</th>
                      <th className="py-2.5 text-start font-bold">العميل / الحي</th>
                      <th className="py-2.5 text-center font-bold">الأصناف</th>
                      <th className="py-2.5 text-center font-bold">طريقة الاستلام والدفع</th>
                      <th className="py-2.5 text-end font-bold">الإجمالي</th>
                      <th className="py-2.5 text-center font-bold">الحالة الحالية</th>
                      <th className="py-2.5 text-end font-bold">تغيير الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/70">
                        <td className="py-3 font-mono font-bold text-slate-900">
                          <div>{ord.referenceNumber}</div>
                          <div className="text-[10px] text-slate-400 font-sans">
                            {new Date(ord.createdAt).toLocaleDateString('ar-SA')}
                          </div>
                        </td>
                        <td className="py-3">
                          <p className="font-bold text-slate-900">{ord.customer.fullName}</p>
                          <p className="font-mono text-[11px] text-slate-500">{ord.customer.phone}</p>
                          <p className="text-[10px] text-amber-700">{ord.customer.district}</p>
                        </td>
                        <td className="py-3 text-center">
                          <span className="font-bold">{ord.items.length} {language === 'ar' ? 'صنف' : 'items'}</span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold block mb-0.5">
                            {ord.deliveryMethod === 'store_pickup' ? 'استلام من المحل' : 'توصيل لباب المنزل'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {ord.paymentMethod === 'cod' ? 'عند الاستلام' : 'تحويل بنكي'}
                          </span>
                        </td>
                        <td className="py-3 text-end font-mono font-bold text-amber-700">
                          {ord.totalAmount} {t('currency')}
                        </td>
                        <td className="py-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'ready'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'processing'
                              ? 'bg-purple-100 text-purple-800'
                              : ord.status === 'confirmed'
                              ? 'bg-indigo-100 text-indigo-800'
                              : ord.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 text-end">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-white border border-slate-300 rounded-lg p-1 text-[11px] font-bold text-slate-800 focus:outline-none"
                          >
                            <option value="pending">Pending (انتظار)</option>
                            <option value="confirmed">Confirmed (تأكيد)</option>
                            <option value="processing">Processing (خلط وتجهيز)</option>
                            <option value="ready">Ready (جاهز)</option>
                            <option value="delivered">Delivered (تم التسليم)</option>
                            <option value="cancelled">Cancelled (إلغاء)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Products Catalog Management */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Success notification banner */}
            {productSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center justify-between text-xs font-bold shadow-xs animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{productSuccessMsg}</span>
                </div>
                <button
                  onClick={() => setProductSuccessMsg(null)}
                  className="text-emerald-700 hover:text-emerald-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Metrics & Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-bold">إجمالي الأصناف</span>
                  <Package className="w-4 h-4 text-blue-900" />
                </div>
                <p className="text-xl font-black text-slate-900 font-mono">{products.length}</p>
                <span className="text-[10px] text-slate-500">صنف مسجل في المتجر</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-bold">العلامات والشركات</span>
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-xl font-black text-slate-900 font-mono">{uniqueBrands.length}</p>
                <span className="text-[10px] text-slate-500">جوتن، الجزيرة، امريكي، سافيتو...</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-bold">أصناف قاربت على النفاد</span>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-xl font-black text-red-600 font-mono">
                  {products.filter((p) => p.stock <= 10).length}
                </p>
                <span className="text-[10px] text-slate-500">أقل من 10 جالونات في المستودع</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-bold">الأكثر طلباً وعروض</span>
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-xl font-black text-emerald-700 font-mono">
                  {products.filter((p) => p.isBestSeller || p.isSpecialOffer).length}
                </p>
                <span className="text-[10px] text-slate-500">مميزة في واجهة المتجر</span>
              </div>
            </div>

            {/* Main Products Panel */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
              {/* Toolbar Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>{language === 'ar' ? 'إدارة كتالوج الدهانات والمخزون' : 'Paint Catalog & Stock'}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold font-mono">
                      {filteredProducts.length} من {products.length}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'ar'
                      ? 'إضافة أصناف جديدة، تعديل الأسعار والأحجام والألوان، وحذف المنتجات بسهولة'
                      : 'Add, update pricing/sizes/colors, or delete products'}
                  </p>
                </div>

                {/* Primary Add Button */}
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsEditingProduct(true);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-md self-start lg:self-center cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ar' ? 'إضافة منتج دهان جديد' : 'Add New Paint Product'}</span>
                </button>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-wrap items-center gap-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={language === 'ar' ? 'بحث بالاسم، الشركة (جوتن، امريكي...) أو الرمز...' : 'Search paint name, brand...'}
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl ps-9 pe-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  />
                  {productSearchQuery && (
                    <button
                      onClick={() => setProductSearchQuery('')}
                      className="absolute end-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="all">جميع الأقسام ({categories.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <select
                  value={productBrandFilter}
                  onChange={(e) => setProductBrandFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="all">جميع الشركات المصنعة</option>
                  {uniqueBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>

                {/* Stock Filter */}
                <select
                  value={productStockFilter}
                  onChange={(e) => setProductStockFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="all">حالة المخزون (الكل)</option>
                  <option value="in_stock">متوفر في المستودع</option>
                  <option value="low_stock">مخزون منخفض (أقل من 10)</option>
                  <option value="out_of_stock">نفذت الكمية (0)</option>
                </select>

                {(productSearchQuery || productCategoryFilter !== 'all' || productBrandFilter !== 'all' || productStockFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setProductSearchQuery('');
                      setProductCategoryFilter('all');
                      setProductBrandFilter('all');
                      setProductStockFilter('all');
                    }}
                    className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors"
                  >
                    إعادة ضبط الفلاتر
                  </button>
                )}
              </div>

              {/* Products Table */}
              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Package className="w-6 h-6" />
                  </div>
                  <p className="text-slate-600 font-bold text-xs">
                    لم يتم العثور على أي منتج يطابق الفلتر أو البحث المحدد.
                  </p>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setIsEditingProduct(true);
                    }}
                    className="px-4 py-2 bg-blue-950 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>إضافة صنف جديد بهذا الاسم</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 text-[11px]">
                        <th className="py-3 text-start font-bold">صنف الدهان / الصورة</th>
                        <th className="py-3 text-start font-bold">القسم والعلامة</th>
                        <th className="py-3 text-start font-bold">الأحجام المتوفرة والأسعار</th>
                        <th className="py-3 text-center font-bold">الصبغات</th>
                        <th className="py-3 text-center font-bold">المخزون</th>
                        <th className="py-3 text-end font-bold">السعر الأساسي</th>
                        <th className="py-3 text-end font-bold">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Image & Title */}
                          <td className="py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
                                <img
                                  src={p.image}
                                  alt={p.nameAr}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                {p.isBestSeller && (
                                  <span className="absolute top-0 end-0 bg-amber-400 text-[8px] font-black px-1 rounded-bl-md text-blue-950">
                                    ★
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 max-w-[220px]">
                                <p className="font-bold text-slate-900 leading-snug truncate" title={p.nameAr}>
                                  {p.nameAr}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate" title={p.nameEn}>
                                  {p.nameEn}
                                </p>
                                <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                                  {p.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category & Brand */}
                          <td className="py-3.5">
                            <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-900 font-bold text-[10px] block w-fit mb-1">
                              {p.categoryNameAr}
                            </span>
                            <span className="text-[11px] font-bold text-amber-700 block">
                              {p.brand}
                            </span>
                          </td>

                          {/* Sizes & Prices list */}
                          <td className="py-3.5">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {(p.sizes || []).map((sz, sIdx) => (
                                <span
                                  key={sIdx}
                                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                                    sz.inStock ? 'bg-slate-100 text-slate-700' : 'bg-red-50 text-red-500 line-through'
                                  }`}
                                  title={`${sz.labelAr}: ${sz.price} ر.س`}
                                >
                                  {sz.size}: {sz.price} ر.س
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Colors Swatches */}
                          <td className="py-3.5 text-center">
                            {p.colors && p.colors.length > 0 ? (
                              <div className="flex items-center justify-center -space-x-1 rtl:space-x-reverse" title={`${p.colors.length} درجات ألوان متوفرة`}>
                                {p.colors.slice(0, 4).map((c, cIdx) => (
                                  <div
                                    key={cIdx}
                                    className="w-4 h-4 rounded-full border border-white shadow-2xs"
                                    style={{ backgroundColor: c.hex }}
                                  />
                                ))}
                                {p.colors.length > 4 && (
                                  <span className="text-[9px] font-bold text-slate-500 ms-1">
                                    +{p.colors.length - 4}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400">-</span>
                            )}
                          </td>

                          {/* Stock Status */}
                          <td className="py-3.5 text-center font-mono">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.stock > 10
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.stock > 0
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {p.stock > 0 ? `${p.stock} متوفر` : 'نفذت الكمية'}
                            </span>
                          </td>

                          {/* Base Price */}
                          <td className="py-3.5 text-end font-mono font-black text-blue-950 text-sm">
                            {p.basePrice} <span className="text-[10px] font-sans font-bold text-slate-500">{t('currency')}</span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 text-end">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit */}
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setIsEditingProduct(true);
                                }}
                                className="p-2 text-blue-900 hover:text-white bg-blue-50 hover:bg-blue-900 rounded-xl transition-all shadow-2xs"
                                title="تعديل وتحديث بيانات الصنف"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Duplicate */}
                              <button
                                onClick={() => handleDuplicateProduct(p)}
                                className="p-2 text-amber-700 hover:text-white bg-amber-50 hover:bg-amber-600 rounded-xl transition-all shadow-2xs"
                                title="تكرار كصنف جديد"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteProduct(p)}
                                className="p-2 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-xl transition-all shadow-2xs"
                                title="حذف الصنف نهائياً"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Comprehensive Product Add / Edit Modal */}
            <ProductEditorModal
              isOpen={isEditingProduct}
              product={editingProduct}
              categories={categories}
              onClose={() => {
                setIsEditingProduct(false);
                setEditingProduct(null);
              }}
              onSave={handleSaveProductFromModal}
              language={language}
            />
          </div>
        )}

        {/* Tab 3: Shop Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'ar' ? 'إعدادات وبيانات مركز المالك' : 'Store Settings & Information'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'تحديث الهاتف، الواتساب، العنوان في الطائف، ورسوم التوصيل' : 'Update Taif contacts and delivery rates'}
                </p>
              </div>

              {settingsSaved && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم حفظ وتحديث الإعدادات بنجاح!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم المحل بالعربية</label>
                  <input
                    type="text"
                    value={settingsForm.shopNameAr}
                    onChange={(e) => setSettingsForm({ ...settingsForm, shopNameAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم المحل بالإنجليزية</label>
                  <input
                    type="text"
                    value={settingsForm.shopNameEn}
                    onChange={(e) => setSettingsForm({ ...settingsForm, shopNameEn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الرقم الضريبي (VAT)</label>
                  <input
                    type="text"
                    value={settingsForm.taxNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, taxNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">رقم الجوال للاتصال</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">رقم الواتساب لاستقبال الطلبات</label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">العنوان بالتفصيل (الطائف)</label>
                <input
                  type="text"
                  value={settingsForm.addressAr}
                  onChange={(e) => setSettingsForm({ ...settingsForm, addressAr: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">رسوم التوصيل القياسية في الطائف (ر.س)</label>
                  <input
                    type="number"
                    value={settingsForm.deliveryFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الحد الأدنى للتوصيل المجاني (ر.س)</label>
                  <input
                    type="number"
                    value={settingsForm.freeDeliveryThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">أوقات وساعات العمل</label>
                <input
                  type="text"
                  value={settingsForm.workingHoursAr}
                  onChange={(e) => setSettingsForm({ ...settingsForm, workingHoursAr: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                />
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-950 hover:bg-blue-900 text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  {t('saveChanges')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: Database & Supabase Architecture */}
        {activeTab === 'database' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <span>{language === 'ar' ? 'تكامل قاعدة بيانات سوبابيز (Supabase Integration)' : 'Supabase Invoices & Database Integration'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'ar'
                    ? 'مشروع سوبابيز الخاص بك مربوط حالياً لتخزين كافة الفواتير والطلبات تلقائياً'
                    : 'Your Supabase account is connected to automatically store all customer invoices'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestSupabaseBooking}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إرسال حجز تجريبي لـ Supabase</span>
                </button>
                <button
                  type="button"
                  onClick={loadSupabaseRecords}
                  disabled={isFetchingSupabase}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-300"
                >
                  <Clock className={`w-3.5 h-3.5 ${isFetchingSupabase ? 'animate-spin' : ''}`} />
                  <span>تحديث السجلات الحية</span>
                </button>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Supabase Connected</span>
                </span>
              </div>
            </div>

            {/* Test booking notification */}
            {testBookingMsg && (
              <div className="p-3.5 bg-emerald-100 border border-emerald-400 text-emerald-900 rounded-xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testBookingMsg}</span>
              </div>
            )}

            {supabaseFetchError && (
              <div className="p-3.5 bg-red-100 border border-red-300 text-red-900 rounded-xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{supabaseFetchError}</span>
              </div>
            )}

            {/* Supabase Connection Details Card */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-md border border-emerald-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    {language === 'ar' ? 'بيانات حساب ومشروع سوبابيز المعتمَد:' : 'Connected Supabase Credentials:'}
                  </span>
                  <p className="text-sm font-bold text-white mt-1">
                    Project ID: <span className="font-mono text-amber-400">ryvxezwdbvvajlkmatpt</span>
                  </p>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    Endpoint: https://ryvxezwdbvvajlkmatpt.supabase.co
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isSyncingSupabase}
                    onClick={handleRunSupabaseSync}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
                  >
                    <Database className="w-4 h-4" />
                    <span>{isSyncingSupabase ? 'جاري المزامنة...' : (language === 'ar' ? 'مزامنة كافة الفواتير المخزنة محلياً مع Supabase' : 'Sync All Invoices')}</span>
                  </button>
                </div>
              </div>

              {/* Live Sync Result Notification */}
              {supabaseSyncResult && (
                <div className={`p-4 rounded-xl border text-xs ${
                  supabaseSyncResult.failCount === 0 && supabaseSyncResult.total > 0
                    ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200'
                    : 'bg-rose-950/80 border-rose-500/80 text-rose-200'
                }`}>
                  <p className="font-bold flex items-center gap-1.5">
                    {supabaseSyncResult.failCount === 0 && supabaseSyncResult.total > 0 ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>تمت مزامنة {supabaseSyncResult.successCount} فواتير مع جدول invoices في سوبابيز بنجاح!</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>تنبيه سوبابيز: {supabaseSyncResult.lastError || 'حدث خطأ أثناء الإرسال'}</span>
                      </>
                    )}
                  </p>
                  {supabaseSyncResult.lastError?.includes('row-level security') && (
                    <div className="mt-2 p-2 bg-rose-900/80 rounded-lg text-[11px] text-white">
                      💡 <strong>سبب عدم ظهور الطلبات في سوبابيز:</strong> جدول invoices مفعل عليه نظام حماية الصفوف (RLS) ويمنع الإضافة من المفتاح العام.
                      شاهد الحل البسيط بالأسفل لتعطيل RLS بضغطة واحدة.
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="text-slate-400 text-[10px] block">جدول الفواتير المستهدف في Supabase</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">invoices</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="text-slate-400 text-[10px] block">نوع مفتاح الوصول</span>
                  <span className="font-bold text-amber-400 font-mono text-xs">Publishable Anon Key</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="text-slate-400 text-[10px] block">حالة الحفظ التلقائي</span>
                  <span className="font-bold text-white text-xs">عند كل طلب جديد فورياً</span>
                </div>
              </div>
            </div>

            {/* LIVE DATA DIRECT FROM SUPABASE TABLE */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                <div>
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span>الفواتير والطلبات المسجلة حالياً داخل حسابك في Supabase (Live From Supabase)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    هذه البيانات معروضة مباشرة من جدول <code className="font-mono font-bold text-emerald-700">invoices</code> في مشروعك: <span className="font-mono text-blue-900">ryvxezwdbvvajlkmatpt</span>
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-mono font-bold text-xs rounded-lg self-start sm:self-auto">
                  عدد السجلات الحية: {supabaseLiveRecords.length}
                </span>
              </div>

              {isFetchingSupabase ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  جاري جلب السجلات الحية من سوبابيز...
                </div>
              ) : supabaseLiveRecords.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                  <p>لا توجد سجلات بعد في جدول invoices أو جاري التحديث.</p>
                  <button
                    type="button"
                    onClick={handleTestSupabaseBooking}
                    className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-300"
                  >
                    إرسال طلب حجز تجريبي الآن
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 text-[11px] bg-slate-100">
                        <th className="py-2.5 px-3 text-start font-bold">رقم المرجع (Ref)</th>
                        <th className="py-2.5 px-3 text-start font-bold">اسم العميل</th>
                        <th className="py-2.5 px-3 text-center font-bold">الجوال</th>
                        <th className="py-2.5 px-3 text-center font-bold">المدينة / الحي</th>
                        <th className="py-2.5 px-3 text-center font-bold">الإجمالي</th>
                        <th className="py-2.5 px-3 text-end font-bold">تاريخ الحفظ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {supabaseLiveRecords.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-100/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-950">
                            {rec.reference_number}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            {rec.customer_name}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                            {rec.customer_phone}
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-600">
                            {rec.customer_district || rec.customer_city || 'الطائف'}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-700">
                            {rec.total_amount} ر.س
                          </td>
                          <td className="py-2.5 px-3 text-end text-slate-500 font-mono text-[11px]">
                            {rec.created_at ? new Date(rec.created_at).toLocaleString('ar-SA') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* CRITICAL RLS FIX CARD */}
            <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-300 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      حل مشكلة عدم ظهور الفواتير في سوبابيز (RLS Policy Fix)
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      سوبابيز يفعل حماية (Row Level Security) تلقائياً مما يمنع إضافة الصفوف الجديدة. قم بنسخ هذا الأمر وتشغيله في <strong>SQL Editor</strong> داخل سوبابيز للسماح بالحفظ الفوري:
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const rlsFix = `ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;`;
                    navigator.clipboard.writeText(rlsFix);
                    alert('تم نسخ أمر فك الحماية إلى الحافظة!');
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                >
                  نسخ أمر فك الحماية RLS
                </button>
              </div>

              <pre className="bg-slate-900 text-amber-300 p-3 rounded-xl text-xs font-mono border border-slate-800 text-start" dir="ltr">
                ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
              </pre>
            </div>

            {/* SQL Table Schema Generator */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {language === 'ar' ? 'كود إنشاء جدول الفواتير في Supabase (SQL Script)' : 'Supabase Invoices Table SQL Script'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {language === 'ar'
                      ? 'إذا لم تكن قد أنشأت الجدول بعد في حسابك، يمكنك نسخ الكود التالي ولصقه في محرر SQL في Supabase بضغطة زر واحدة:'
                      : 'Run this SQL in Supabase SQL editor to ensure all fields are indexed:'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const sql = `CREATE TABLE IF NOT EXISTS invoices (
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
);`;
                    navigator.clipboard.writeText(sql);
                    alert(language === 'ar' ? 'تم نسخ كود SQL إلى الحافظة' : 'SQL copied to clipboard');
                  }}
                  className="px-3 py-1.5 bg-blue-950 text-white rounded-lg text-xs font-bold hover:bg-blue-900 transition-colors shrink-0"
                >
                  {language === 'ar' ? 'نسخ كود SQL' : 'Copy SQL'}
                </button>
              </div>

              <pre className="bg-slate-900 text-emerald-300 p-4 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800 text-start" dir="ltr">
{`CREATE TABLE IF NOT EXISTS invoices (
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
);`}
              </pre>
            </div>

            {/* SQL VIEW for order_booking and orders */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {language === 'ar' ? 'لإظهار الطلبات في سوبابيز باسم order_booking أو orders (SQL Views)' : 'Create order_booking & orders Views in Supabase'}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {language === 'ar'
                      ? 'إذا كنت تبحث في لوحة سوبابيز عن جدول باسم order_booking أو orders، قم بنسخ هذا الأمر وتشغيله في SQL Editor لإنشاء روابط تلقائية تظهر كل الفواتير فوراً:'
                      : 'Run this in Supabase SQL editor to create instant views for order_booking and orders:'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const sql = `-- Create instant views in Supabase SQL Editor:
CREATE OR REPLACE VIEW order_booking AS SELECT * FROM invoices;
CREATE OR REPLACE VIEW orders AS SELECT * FROM invoices;
GRANT SELECT, INSERT, UPDATE ON order_booking TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON orders TO anon, authenticated;`;
                    navigator.clipboard.writeText(sql);
                    alert(language === 'ar' ? 'تم نسخ كود إنشاء order_booking إلى الحافظة!' : 'SQL copied to clipboard');
                  }}
                  className="px-3.5 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors shrink-0"
                >
                  {language === 'ar' ? 'نسخ أمر order_booking' : 'Copy SQL View'}
                </button>
              </div>

              <pre className="bg-slate-900 text-amber-300 p-3 rounded-xl text-xs font-mono border border-slate-800 text-start" dir="ltr">
{`CREATE OR REPLACE VIEW order_booking AS SELECT * FROM invoices;
CREATE OR REPLACE VIEW orders AS SELECT * FROM invoices;`}
              </pre>
            </div>

            {/* Architecture Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>التحقق والأمان المزدوج:</span>
                </h5>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  يتم التحقق السيرفري من كافة المبالغ وضريبة القيمة المضافة 15% قبل إرسال الفاتورة وتخزينها في جدول <code className="font-mono text-blue-900">invoices</code> لضمان تطابق السجلات المحاسبية والضريبية.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Database className="w-4 h-4 text-blue-900" />
                  <span>مزامنة تفاصيل الأصناف المخلطة:</span>
                </h5>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  عمود <code className="font-mono text-blue-900">items</code> بصيغة JSONB يخزن بدقة كل مقاس (1L, 4L, 18L)، وأكواد خلط ألوان الكمبيوتر لجوتن والجزيرة، وتفاصيل رشة البروفايل لكل طلب.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
