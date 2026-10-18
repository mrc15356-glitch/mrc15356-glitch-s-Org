import React from 'react';
import {
  CheckCircle2,
  Printer,
  Send,
  Truck,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  MapPin,
  Phone,
  Copy,
  Clock,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { Order } from '../../types';

interface OrderConfirmationProps {
  order: Order | null;
  onGoHome: () => void;
  onTrackOrder: (ref: string) => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  onGoHome,
  onTrackOrder,
}) => {
  const { t, language, dir } = useLanguage();
  const { settings } = useShop();

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-800">لا يوجد طلب حالي للعرض</h3>
        <button
          onClick={onGoHome}
          className="px-6 py-2.5 bg-blue-950 text-white rounded-xl text-xs font-bold"
        >
          {t('returnHome')}
        </button>
      </div>
    );
  }

  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  const saudiPhone = cleanPhone.startsWith('0') ? '966' + cleanPhone.slice(1) : cleanPhone;

  const handleShareToWhatsApp = () => {
    let msg = language === 'ar'
      ? `*تأكيد حجز طلب دهانات - مركز المالك للدهانات بالطائف*\n`
      : `*Paint Order Confirmation - Markaz Almalak Taif*\n`;

    msg += `------------------------------\n`;
    msg += `📌 *رقم المرجع:* ${order.referenceNumber}\n`;
    msg += `👤 *العميل:* ${order.customer.fullName}\n`;
    msg += `📞 *الجوال:* ${order.customer.phone}\n`;
    msg += `📍 *طريقة الاستلام:* ${order.deliveryMethod === 'store_pickup' ? 'استلام من المحل (شارع البحرين)' : `توصيل بالطائف - ${order.customer.district}`}\n`;
    msg += `------------------------------\n`;
    msg += `*المنتجات المطلوبة:*\n`;

    order.items.forEach((it, i) => {
      msg += `${i + 1}. ${language === 'ar' ? it.productNameAr : it.productNameEn}\n`;
      msg += `   • المقاس: ${it.sizeLabelAr || it.size}\n`;
      if (it.color) msg += `   • اللون: ${it.color.nameAr} (${it.color.hex})\n`;
      if (it.customColorCode) msg += `   • كود الخلط: ${it.customColorCode}\n`;
      msg += `   • الكمية: ${it.quantity} (السعر: ${it.subtotal} ر.س)\n\n`;
    });

    msg += `------------------------------\n`;
    msg += `💰 *المجموع النهائي:* ${order.totalAmount} ${t('currency')}\n`;
    msg += `💳 *طريقة الدفع:* ${order.paymentMethod === 'cod' ? 'عند الاستلام' : order.paymentMethod === 'bank_transfer' ? 'تحويل بنكي' : 'دفع إلكتروني'}\n`;
    if (order.customer.notes) msg += `📝 *ملاحظات:* ${order.customer.notes}\n`;

    window.open(`https://wa.me/${saudiPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(order.referenceNumber);
    alert(language === 'ar' ? 'تم نسخ رقم المرجع إلى الحافظة' : 'Order reference copied to clipboard');
  };

  return (
    <div className="py-12 bg-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Top Success Badge */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto text-3xl mb-2">
            ✓
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {t('orderSuccessTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
            {t('orderSuccessSubtitle')}
          </p>

          <div className="inline-flex items-center gap-2 bg-slate-950/40 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/20 mt-2">
            <span className="text-xs text-slate-300">{t('orderRef')}:</span>
            <span className="font-mono text-base font-black text-amber-400">
              {order.referenceNumber}
            </span>
            <button
              onClick={handleCopyRef}
              className="p-1 text-slate-300 hover:text-white"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6 print:shadow-none print:border-none">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-950 to-amber-500 p-2 border border-amber-400 flex items-center justify-center text-xl shadow-md text-white">
                👑🎨
              </div>
              <div>
                <h3 className="font-black text-lg text-blue-950">
                  {settings.shopNameAr}
                </h3>
                <p className="text-xs text-amber-700 font-bold">
                  {settings.taglineAr}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {settings.addressAr}
                </p>
              </div>
            </div>

            <div className="sm:text-end text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="font-bold text-slate-900 flex items-center sm:justify-end gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>فاتورة حجز أولية (ضريبية)</span>
              </p>
              <p className="text-slate-600">
                {t('taxNumberLabel')}: <strong className="font-mono text-amber-800">{settings.taxNumber}</strong>
              </p>
              <p className="text-slate-400">
                تاريخ الحجز: {new Date(order.createdAt).toLocaleDateString('ar-SA')}
              </p>
            </div>
          </div>

          {/* Customer & Fulfillment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">
                بيانات العميل:
              </p>
              <p className="font-black text-sm text-slate-900">{order.customer.fullName}</p>
              <p className="font-mono text-slate-700 mt-0.5">الجوال: {order.customer.phone}</p>
              <p className="text-slate-600 mt-0.5">الحي: {order.customer.district}</p>
              <p className="text-slate-500">{order.customer.address}</p>
            </div>

            <div className="sm:text-end">
              <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">
                تفاصيل الاستلام والسداد:
              </p>
              <p className="font-bold text-blue-950">
                {order.deliveryMethod === 'store_pickup'
                  ? 'استلام من فرع المحل بشارع البحرين'
                  : 'توصيل لباب المنزل بالطائف'}
              </p>
              <p className="text-slate-600 mt-0.5">
                طريقة الدفع: {order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : order.paymentMethod === 'bank_transfer' ? 'تحويل بنكي' : 'بطاقة إلكترونية'}
              </p>
              <p className="text-emerald-700 font-bold mt-0.5">
                حالة الطلب: قيد المراجعة والتجهيز
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[11px]">
                  <th className="py-2.5 text-start font-bold">المنتج / الدهان</th>
                  <th className="py-2.5 text-center font-bold">المقاس / اللون</th>
                  <th className="py-2.5 text-center font-bold">الكمية</th>
                  <th className="py-2.5 text-center font-bold">سعر الوحدة</th>
                  <th className="py-2.5 text-end font-bold">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-slate-900">
                      {it.productNameAr}
                    </td>
                    <td className="py-3 text-center text-slate-600">
                      {it.sizeLabelAr || it.size}
                      {it.color ? ` • ${it.color.nameAr}` : ''}
                      {it.customColorCode ? ` [${it.customColorCode}]` : ''}
                    </td>
                    <td className="py-3 text-center font-bold font-mono">
                      {it.quantity}
                    </td>
                    <td className="py-3 text-center font-mono">
                      {it.unitPrice} {t('currency')}
                    </td>
                    <td className="py-3 text-end font-mono font-bold text-slate-900">
                      {it.subtotal} {t('currency')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="text-slate-500 space-y-1">
              <p>• الفاتورة شاملة ضريبة القيمة المضافة 15% بموجب الأنظمة السعودية.</p>
              <p>• عند اختيار التحويل البنكي، يرجى تزويد خدمة العملاء بصورة إشعار التحويل.</p>
            </div>

            <div className="space-y-1.5 sm:text-end min-w-[220px]">
              <div className="flex justify-between text-slate-600">
                <span>المجموع الفرعي:</span>
                <span className="font-mono font-bold">{order.subtotal} {t('currency')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>رسوم التوصيل:</span>
                <span className="font-mono font-bold">
                  {order.deliveryFee === 0 ? 'مجاناً' : `${order.deliveryFee} ${t('currency')}`}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>ضريبة القيمة المضافة (15%):</span>
                <span className="font-mono">{order.vatAmount} {t('currency')}</span>
              </div>
              <div className="flex justify-between text-base font-black text-blue-950 pt-2 border-t border-slate-200">
                <span>الإجمالي الكلي:</span>
                <span className="font-mono text-amber-600 text-lg">
                  {order.totalAmount} {t('currency')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleShareToWhatsApp}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{t('sendOrderWhatsAppBtn')}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-slate-200"
              >
                <Printer className="w-4 h-4" />
                <span>{t('printInvoice')}</span>
              </button>

              <button
                onClick={() => onTrackOrder(order.referenceNumber)}
                className="px-4 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Truck className="w-4 h-4 text-amber-400" />
                <span>{t('trackOrderBtn')}</span>
              </button>
            </div>

            <button
              onClick={onGoHome}
              className="text-xs font-bold text-blue-900 hover:text-amber-600 flex items-center gap-1.5"
            >
              <span>{t('returnHome')}</span>
              {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
