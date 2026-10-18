import React, { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  MessageCircle,
  Truck,
  CreditCard,
  Building,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Send,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Store,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useShop } from '../../context/ShopContext';
import { TAIF_DISTRICTS } from '../../data/mockData';
import { CustomerInfo, DeliveryMethod, PaymentMethod } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { t, language, dir } = useLanguage();
  const { items, subtotal, vatAmount, deliveryFee, totalAmount, clearCart } = useCart();
  const { settings, createOrder, setActivePage } = useShop();

  if (!isOpen) return null;

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [district, setDistrict] = useState(TAIF_DISTRICTS[0].ar);
  const [customDistrict, setCustomDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('صباحاً (9:00 ص - 1:00 م)');
  const [notes, setNotes] = useState('');

  // Options
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('home_delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const finalDeliveryFee = deliveryMethod === 'store_pickup' ? 0 : deliveryFee;
  const finalTotalAmount = deliveryMethod === 'store_pickup' ? subtotal : totalAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg(language === 'ar' ? 'يرجى إدخال الاسم الكامل' : 'Please enter your full name');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9) {
      setErrorMsg(language === 'ar' ? 'يرجى إدخال رقم جوال صحيح (مثال: 0581234567)' : 'Please enter a valid mobile number');
      return;
    }

    if (deliveryMethod === 'home_delivery' && !address.trim()) {
      setErrorMsg(language === 'ar' ? 'يرجى كتابة العنوان التفصيلي للتوصيل داخل الطائف' : 'Please provide detailed delivery address in Taif');
      return;
    }

    setIsSubmitting(true);

    try {
      const customerData: CustomerInfo = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        city: 'الطائف (Taif)',
        district: customDistrict.trim() || district,
        address: deliveryMethod === 'store_pickup' ? 'استلام مباشر من فرع المحل - شارع البحرين' : address.trim(),
        googleMapsUrl: googleMapsUrl.trim() || undefined,
        preferredDate: preferredDate || undefined,
        preferredTimeSlot,
        notes: notes.trim() || undefined,
      };

      await createOrder(customerData, paymentMethod, deliveryMethod);
      setIsSubmitting(false);
      onClose();
      onOrderSuccess();
    } catch (err) {
      console.error(err);
      setErrorMsg(language === 'ar' ? 'حدث خطأ أثناء حجز الطلب، يرجى المحاولة ثانية' : 'Error booking order, please retry');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">{t('checkoutTitle')}</h2>
              <p className="text-xs text-amber-300">
                {settings.shopNameAr} • {settings.addressAr}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-8">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left/Right Column: Customer Information & Delivery Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery or Pickup Selection */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  {t('deliveryMethod')}:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('home_delivery')}
                    className={`p-3.5 rounded-2xl border text-xs font-bold text-start transition-all flex items-start gap-3 ${
                      deliveryMethod === 'home_delivery'
                        ? 'border-blue-900 bg-blue-50 text-blue-950 ring-2 ring-blue-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{language === 'ar' ? 'توصيل لباب المنزل في الطائف' : 'Taif Home Delivery'}</p>
                      <p className="text-[11px] font-normal text-slate-500 mt-0.5">
                        {deliveryFee === 0 ? 'مجاناً للطلبات فوق 450 ر.س' : 'رسوم التوصيل: 25 ر.س'}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('store_pickup')}
                    className={`p-3.5 rounded-2xl border text-xs font-bold text-start transition-all flex items-start gap-3 ${
                      deliveryMethod === 'store_pickup'
                        ? 'border-blue-900 bg-blue-50 text-blue-950 ring-2 ring-blue-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <Store className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{language === 'ar' ? 'استلام مباشر من المحل' : 'Store Pickup (Taif)'}</p>
                      <p className="text-[11px] font-normal text-slate-500 mt-0.5">
                        شارع البحرين بعد زين (مجاناً)
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Customer Personal Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  {t('customerInfo')}
                </h4>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'ar' ? 'مثال: عبدالله محمد الشهري' : 'e.g. Abdullah Al-Shehri'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {t('phone')} (+966) *
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="05XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-start"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {t('whatsappNumber')}
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder={language === 'ar' ? 'نفس رقم الجوال أو رقم آخر' : 'Same as phone or other'}
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-start"
                    />
                  </div>
                </div>

                {/* Address details if delivery */}
                {deliveryMethod === 'home_delivery' && (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          {t('district')} *
                        </label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                        >
                          {TAIF_DISTRICTS.map((d, i) => (
                            <option key={i} value={d.ar}>
                              {language === 'ar' ? d.ar : d.en}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          {language === 'ar' ? 'أو اكتب الحي إذا لم يظهر:' : 'Or custom neighborhood:'}
                        </label>
                        <input
                          type="text"
                          placeholder={language === 'ar' ? 'مثال: مخطط البيعة / جبرة...' : 'e.g. Al-Bayaah'}
                          value={customDistrict}
                          onChange={(e) => setCustomDistrict(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        {t('addressDetails')} *
                      </label>
                      <input
                        type="text"
                        required={deliveryMethod === 'home_delivery'}
                        placeholder={language === 'ar' ? 'اسم الشارع، معلم بارز بجوار المنزل، رقم العمارة أو الفيلا...' : 'Street name, landmark, building number...'}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        {t('mapsLink')}
                      </label>
                      <input
                        type="url"
                        placeholder="https://maps.app.goo.gl/..."
                        value={googleMapsUrl}
                        onChange={(e) => setGoogleMapsUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-start"
                      />
                    </div>
                  </div>
                )}

                {/* Timing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {language === 'ar' ? 'تاريخ التوصيل / الاستلام المفضل:' : 'Preferred Date:'}
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {t('preferredTime')}
                    </label>
                    <select
                      value={preferredTimeSlot}
                      onChange={(e) => setPreferredTimeSlot(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    >
                      <option value="صباحاً (9:00 ص - 1:00 م)">الفترة الصباحية (9:00 ص - 1:00 م)</option>
                      <option value="عصراً (4:30 م - 7:30 م)">فترة العصر (4:30 م - 7:30 م)</option>
                      <option value="مساءً (8:00 م - 10:30 م)">الفترة المسائية (8:00 م - 10:30 م)</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {language === 'ar' ? 'ملاحظات خلط الألوان أو تعليمات إضافية:' : 'Color tint codes or special instructions:'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={t('notesPlaceholder')}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  {t('paymentMethod')}
                </h4>
                <div className="space-y-2">
                  {/* COD */}
                  <label className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-blue-900 bg-blue-50 ring-1 ring-blue-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-0.5 accent-blue-900"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">{t('cod')}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {language === 'ar' ? 'سدد عند استلام الدهانات نقداً أو عبر جهاز الشبكة (مدى) مع المندوب' : 'Pay in cash or Mada card upon delivery'}
                      </p>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-blue-900 bg-blue-50 ring-1 ring-blue-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-0.5 accent-blue-900"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">{t('bankTransfer')}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {language === 'ar' ? 'تحويل لحساب مؤسسة مركز المالك بمصرف الراجحي مع إرفاق الإشعار' : 'Direct transfer to official Al Rajhi account'}
                      </p>
                    </div>
                  </label>

                  {/* Bank Transfer Details Accordion */}
                  {paymentMethod === 'bank_transfer' && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs ms-6 text-slate-700">
                      <p className="font-bold text-blue-950">{settings.bankName}</p>
                      <p>اسم المستفيد: <span className="font-semibold text-slate-900">{settings.bankAccountHolder}</span></p>
                      <p className="font-mono text-xs font-bold text-amber-800">IBAN: {settings.iban}</p>
                      <p className="text-[10px] text-slate-400">سيتم تزويدك برقم الآيبان مجدداً في صفحة الفاتورة لتسهيل النسخ.</p>
                    </div>
                  )}

                  {/* Online Payment */}
                  <label className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'online_card'
                      ? 'border-blue-900 bg-blue-50 ring-1 ring-blue-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'online_card'}
                      onChange={() => setPaymentMethod('online_card')}
                      className="mt-0.5 accent-blue-900"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">{t('onlineCard')}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {language === 'ar' ? 'دفع إلكتروني فوري ومؤمّن (مدى / فيزا / أبل باي)' : 'Instant secure payment via Mada or Apple Pay'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right/Left Column: Order Summary & Review */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                {t('orderSummary')} ({items.length} {language === 'ar' ? 'أصناف' : 'items'})
              </h4>

              {/* Items scroll */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto divide-y divide-slate-100">
                {items.map((it) => (
                  <div key={it.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={it.image}
                        alt={it.productNameAr}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-bold text-slate-900 truncate">
                          {language === 'ar' ? it.productNameAr : it.productNameEn}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {it.sizeLabelAr || it.size} × {it.quantity}
                          {it.color ? ` • ${it.color.nameAr}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-900 shrink-0 ms-2">
                      {it.price * it.quantity} {t('currency')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>{t('subtotal')}:</span>
                  <span className="font-bold font-mono text-slate-900">{subtotal} {t('currency')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>{t('deliveryFee')}:</span>
                  <span className="font-bold font-mono">
                    {finalDeliveryFee === 0 ? (
                      <span className="text-emerald-700">{t('freeDelivery')}</span>
                    ) : (
                      `${finalDeliveryFee} ${t('currency')}`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{t('vat')}:</span>
                  <span className="font-mono">{vatAmount} {t('currency')}</span>
                </div>
                <div className="flex items-center justify-between text-base font-black text-blue-950 pt-2 border-t border-slate-200">
                  <span>{t('total')}:</span>
                  <span className="text-xl text-amber-600 font-mono">
                    {finalTotalAmount} {t('currency')}
                  </span>
                </div>
              </div>

              {/* Legal & WhatsApp Disclaimer */}
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <p className="font-bold mb-0.5 flex items-center gap-1 text-amber-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{t('taxNumberLabel')}: {settings.taxNumber}</span>
                </p>
                <p>{t('whatsappDisclaimer')}</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-sm font-black rounded-2xl shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{t('submitting')}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-slate-950" />
                    <span>{t('submitOrder')} ({finalTotalAmount} {t('currency')})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
