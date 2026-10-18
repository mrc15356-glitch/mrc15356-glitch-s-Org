import React, { useState, useEffect } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  Store,
  MapPin,
  Phone,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { Order, OrderStatus } from '../../types';

interface OrderTrackingProps {
  initialRef?: string;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ initialRef }) => {
  const { t, language } = useLanguage();
  const { trackOrder, settings, allOrders } = useShop();

  const [orderRef, setOrderRef] = useState(initialRef || '');
  const [phone, setPhone] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // If initialRef is passed, auto-search
  useEffect(() => {
    if (initialRef) {
      setOrderRef(initialRef);
      handleSearch(initialRef, '');
    }
  }, [initialRef]);

  const handleSearch = async (refVal?: string, phoneVal?: string) => {
    const searchTarget = refVal !== undefined ? refVal : orderRef;
    const phoneTarget = phoneVal !== undefined ? phoneVal : phone;

    if (!searchTarget.trim()) {
      setSearchError(language === 'ar' ? 'يرجى إدخال رقم مرجع الطلب' : 'Please enter order reference ID');
      return;
    }

    setSearchError('');
    setIsSearching(true);
    setHasSearched(true);

    try {
      const found = await trackOrder(searchTarget, phoneTarget);
      setSearchedOrder(found);
      if (!found) {
        setSearchError(
          language === 'ar'
            ? 'لم يتم العثور على طلب بهذا الرقم. تأكد من صحة رقم المرجع (مثال: MALAK-2026-XXXX)'
            : 'No order found with this reference. Please check your reference code.'
        );
      }
    } catch {
      setSearchError(language === 'ar' ? 'تعذر الاستعلام حالياً' : 'Tracking inquiry failed');
    } finally {
      setIsSearching(false);
    }
  };

  const statusSteps: { key: OrderStatus; labelAr: string; labelEn: string; descAr: string; descEn: string }[] = [
    {
      key: 'pending',
      labelAr: 'تم استلام الطلب',
      labelEn: 'Order Received',
      descAr: 'تم تسجيل الطلب وحجز الكميات بنجاح من الموقع',
      descEn: 'Order booked and reserved online',
    },
    {
      key: 'confirmed',
      labelAr: 'تم التأكيد واعتماد الألوان',
      labelEn: 'Confirmed & Approved',
      descAr: 'تمت مراجعة الخلطات والأكواد واعتماد الفاتورة',
      descEn: 'Color tints and invoice verified',
    },
    {
      key: 'processing',
      labelAr: 'قيد التجهيز والتلوين',
      labelEn: 'Mixing & Packing',
      descAr: 'جاري خلط الدهانات وتعبئة البراميل وتغليف الأدوات',
      descEn: 'Paints are being mixed and packaged',
    },
    {
      key: 'ready',
      labelAr: 'جاهز للاستلام أو الخروج',
      labelEn: 'Ready for Dispatch',
      descAr: 'المواد مجهزة ومكتملة بفرع شارع البحرين',
      descEn: 'Materials ready at Bahrain St store',
    },
    {
      key: 'delivered',
      labelAr: 'تم التسليم بنجاح',
      labelEn: 'Delivered',
      descAr: 'تم تسليم الطلب للعميل واستلام المستحقات',
      descEn: 'Order successfully fulfilled',
    },
  ];

  const getStepStatus = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const orderIndex = statusSteps.findIndex((s) => s.key === currentStatus);
    const stepIndex = statusSteps.findIndex((s) => s.key === stepKey);

    if (currentStatus === 'cancelled') return 'cancelled';
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Truck className="w-6 h-6 text-amber-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
            {t('trackTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('trackSubtitle')}
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-6">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {language === 'ar' ? 'رقم مرجع الطلب (Reference ID) *' : 'Order Reference ID *'}
              </label>
              <input
                type="text"
                placeholder={t('orderNumberPlaceholder')}
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {language === 'ar' ? 'رقم الجوال المسجل (اختياري للتحقق)' : 'Phone number (optional)'}
              </label>
              <input
                type="tel"
                placeholder={t('phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                onClick={() => handleSearch()}
                disabled={isSearching}
                className="w-full py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>{isSearching ? '...' : t('checkStatusBtn')}</span>
              </button>
            </div>
          </div>

          {searchError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Quick Recent Orders helper if any exists in local session */}
          {allOrders.length > 0 && !searchedOrder && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                {language === 'ar' ? 'طلباتك المسجلة مؤخراً على هذا المتصفح:' : 'Recent orders on this device:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {allOrders.slice(0, 3).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setOrderRef(o.referenceNumber);
                      handleSearch(o.referenceNumber, '');
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-mono text-slate-700 font-bold border border-slate-200 flex items-center gap-1"
                  >
                    <span>{o.referenceNumber}</span>
                    <span className="text-[10px] text-amber-600 font-sans">({o.totalAmount} ر.س)</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tracking Details View */}
        {searchedOrder && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Status Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    {t('orderRef')}:
                  </span>
                  <h3 className="text-xl font-mono font-black text-blue-950">
                    {searchedOrder.referenceNumber}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(searchedOrder.createdAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                  </p>
                </div>

                <div className="text-end">
                  <span className="text-xs text-slate-400 block">{language === 'ar' ? 'المبلغ الإجمالي:' : 'Total:'}</span>
                  <span className="text-xl font-mono font-black text-amber-600">
                    {searchedOrder.totalAmount} {t('currency')}
                  </span>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="py-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-6">
                  {language === 'ar' ? 'مراحل تجهيز وتسليم الدهانات:' : 'Fulfillment Timeline:'}
                </h4>

                <div className="space-y-6">
                  {statusSteps.map((step, idx) => {
                    const stepState = getStepStatus(step.key, searchedOrder.status);
                    const isLast = idx === statusSteps.length - 1;

                    return (
                      <div key={step.key} className="relative flex items-start gap-4">
                        {/* Connecting Line */}
                        {!isLast && (
                          <div
                            className={`absolute top-6 start-3.5 -bottom-6 w-0.5 ${
                              stepState === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'
                            }`}
                          />
                        )}

                        {/* Step Icon */}
                        <div
                          className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            stepState === 'completed'
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                              : stepState === 'current'
                              ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 animate-pulse'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {stepState === 'completed' ? '✓' : idx + 1}
                        </div>

                        {/* Step Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5
                              className={`text-xs font-bold ${
                                stepState === 'current'
                                  ? 'text-amber-800 font-black'
                                  : stepState === 'completed'
                                  ? 'text-slate-900'
                                  : 'text-slate-400'
                              }`}
                            >
                              {language === 'ar' ? step.labelAr : step.labelEn}
                            </h5>

                            {stepState === 'current' && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                                {language === 'ar' ? 'المرحلة الحالية' : 'Current Step'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {language === 'ar' ? step.descAr : step.descEn}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order items recap */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  {language === 'ar' ? 'الأصناف المجهزة:' : 'Ordered Items:'}
                </h4>
                <div className="divide-y divide-slate-100 text-xs">
                  {searchedOrder.items.map((it, i) => (
                    <div key={i} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{it.productNameAr}</p>
                        <p className="text-[11px] text-slate-500">
                          {it.sizeLabelAr || it.size} × {it.quantity}
                          {it.color ? ` • اللون: ${it.color.nameAr}` : ''}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-slate-800">{it.subtotal} {t('currency')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Delivery info */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl">
                <div>
                  <p className="font-bold text-slate-400 text-[10px] uppercase">بيانات التوصيل:</p>
                  <p className="font-bold text-slate-900 mt-1">{searchedOrder.customer.fullName}</p>
                  <p className="text-slate-600 mt-0.5">{searchedOrder.customer.district} - {searchedOrder.customer.address}</p>
                  <p className="font-mono text-slate-700 mt-0.5">جوال: {searchedOrder.customer.phone}</p>
                </div>
                <div className="sm:text-end">
                  <p className="font-bold text-slate-400 text-[10px] uppercase">فرع المحل المجهز:</p>
                  <p className="font-bold text-blue-950 mt-1">{settings.shopNameAr}</p>
                  <p className="text-slate-600 mt-0.5">{settings.addressAr}</p>
                  <p className="text-amber-800 font-semibold mt-0.5">هاتف: {settings.phone}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
