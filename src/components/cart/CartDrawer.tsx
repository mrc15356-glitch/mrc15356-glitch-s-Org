import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useShop } from '../../context/ShopContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const { t, language, dir } = useLanguage();
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    vatAmount,
    totalAmount,
    isCartOpen,
    setIsCartOpen,
    freeDeliveryThreshold,
  } = useCart();
  const { settings } = useShop();

  if (!isCartOpen) return null;

  const freeDeliveryRemaining = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  const saudiPhone = cleanPhone.startsWith('0') ? '966' + cleanPhone.slice(1) : cleanPhone;

  const handleSendCartWhatsApp = () => {
    let summary = language === 'ar'
      ? `*طلب استفسار وتجهيز دهانات من سلة موقع مركز المالك بالطائف*\n`
      : `*Paint Order from Cart - Markaz Almalak Taif:*\n`;

    summary += `------------------------------\n`;
    items.forEach((item, idx) => {
      summary += `${idx + 1}. ${language === 'ar' ? item.productNameAr : item.productNameEn}\n`;
      summary += `   • ${language === 'ar' ? 'المقاس:' : 'Size:'} ${item.sizeLabelAr || item.size}\n`;
      if (item.color) {
        summary += `   • ${language === 'ar' ? 'اللون:' : 'Color:'} ${item.color.nameAr} (${item.color.hex})\n`;
      }
      if (item.customColorCode) {
        summary += `   • ${language === 'ar' ? 'كود اللون:' : 'Custom Code:'} ${item.customColorCode}\n`;
      }
      summary += `   • ${language === 'ar' ? 'الكمية:' : 'Qty:'} ${item.quantity} × ${item.price} ر.س = ${item.quantity * item.price} ر.س\n\n`;
    });

    summary += `------------------------------\n`;
    summary += `${language === 'ar' ? '*المجموع الفرعي:*' : '*Subtotal:*'} ${subtotal} ${t('currency')}\n`;
    summary += `${language === 'ar' ? '*رسوم التوصيل بالطائف:*' : '*Delivery:*'} ${deliveryFee === 0 ? 'مجاناً' : `${deliveryFee} ${t('currency')}`}\n`;
    summary += `${language === 'ar' ? '*الإجمالي المطلوب:*' : '*Total:*'} ${totalAmount} ${t('currency')}\n\n`;
    summary += `${language === 'ar' ? '📍 المحل: الطائف - الشهداء الشمالية - شارع البحرين' : '📍 Store: Taif - Bahrain St'}`;

    window.open(`https://wa.me/${saudiPhone}?text=${encodeURIComponent(summary)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        dir={dir}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-950 to-indigo-950 text-white flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                {t('cart')}
              </h3>
              <p className="text-[11px] text-slate-300">
                {items.length} {language === 'ar' ? 'أصناف مختارة' : 'items selected'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] text-red-300 hover:text-red-100 flex items-center gap-1 font-semibold px-2 py-1 rounded bg-white/10"
                title={t('clearCart')}
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">{t('clearCart')}</span>
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Progress Bar */}
        <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-200 text-xs">
          {freeDeliveryRemaining > 0 ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-amber-900 flex items-center justify-between">
                <span>
                  {language === 'ar'
                    ? `أضف دهانات بقيمة ${freeDeliveryRemaining} ر.س للحصول على توصيل مجاني بالطائف!`
                    : `Add ${freeDeliveryRemaining} SAR more for free delivery in Taif!`}
                </span>
                <span className="font-mono font-bold">{Math.round(freeDeliveryProgress)}%</span>
              </p>
              <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <p className="font-bold text-emerald-800 flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? 'تهانينا! مؤهل للتوصيل المجاني داخل الطائف' : 'Eligible for Free Delivery in Taif!'}</span>
            </p>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                🛒
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                {t('cartEmpty')}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {t('cartEmptyDesc')}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-4 py-2 bg-blue-950 text-white rounded-xl text-xs font-bold hover:bg-blue-900 transition-colors"
              >
                {language === 'ar' ? 'ابدأ التسوق الآن' : 'Start Shopping'}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex gap-3 items-center"
              >
                <img
                  src={item.image}
                  alt={item.productNameAr}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {language === 'ar' ? item.productNameAr : item.productNameEn}
                    </h5>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-600 p-1 shrink-0"
                      title="Remove item"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-amber-700 font-semibold">
                    {item.brand} • {item.sizeLabelAr || item.size}
                  </p>

                  {/* Color details if selected */}
                  {(item.color || item.customColorCode) && (
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500">
                      {item.color && (
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: item.color.hex }}
                        />
                      )}
                      <span className="truncate">
                        {item.color ? item.color.nameAr : ''}
                        {item.customColorCode ? ` [${item.customColorCode}]` : ''}
                      </span>
                    </div>
                  )}

                  {/* Price & Quantity stepper */}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                    <span className="text-xs font-black text-blue-950">
                      {item.price * item.quantity} {t('currency')}
                    </span>

                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="w-7 text-center text-xs font-bold font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions (Subtotal, Tax & Checkout) */}
        {items.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>{t('subtotal')}:</span>
                <span className="font-bold text-slate-900 font-mono">{subtotal} {t('currency')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('deliveryFee')}:</span>
                <span className="font-bold font-mono">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">{t('freeDelivery')}</span>
                  ) : (
                    `${deliveryFee} ${t('currency')}`
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{t('vat')}:</span>
                <span className="font-mono">{vatAmount} {t('currency')}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-blue-950 pt-2 border-t border-slate-200">
                <span>{t('total')}:</span>
                <span className="text-base text-amber-600 font-mono">
                  {totalAmount} {t('currency')}
                </span>
              </div>
            </div>

            {/* Checkout & WhatsApp Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <span>{t('proceedCheckout')}</span>
                {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <button
                onClick={handleSendCartWhatsApp}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('sendCartWhatsApp')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
