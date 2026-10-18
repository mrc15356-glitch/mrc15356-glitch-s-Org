import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone, MapPin, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { useCart } from '../../context/CartContext';

export const WhatsAppFloating: React.FC = () => {
  const { t, language } = useLanguage();
  const { settings } = useShop();
  const { items, totalAmount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  const saudiPhone = cleanPhone.startsWith('0') ? '966' + cleanPhone.slice(1) : cleanPhone;

  const handleSendToWhatsApp = (messageText: string) => {
    const encoded = encodeURIComponent(messageText);
    const url = `https://wa.me/${saudiPhone}?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleSendCartSummary = () => {
    if (items.length === 0) {
      handleSendToWhatsApp(
        language === 'ar'
          ? `السلام عليكم ورحمة الله، أود الاستفسار عن أسعار وتوفر الدهانات في مركز المالك للدهانات بالطائف.`
          : `Hello, I would like to inquire about paints and coatings at Markaz Almalak Paint Shop Taif.`
      );
      return;
    }

    let summary = language === 'ar'
      ? `*طلب استفسار وتجهيز دهانات من موقع مركز المالك بالطائف*\n`
      : `*Paint Order Inquiry from Markaz Almalak Taif Web Store*\n`;
      
    summary += `------------------------------\n`;
    items.forEach((item, idx) => {
      summary += `${idx + 1}. ${language === 'ar' ? item.productNameAr : item.productNameEn}\n`;
      summary += `   • ${language === 'ar' ? 'المقاس:' : 'Size:'} ${item.sizeLabelAr || item.size}\n`;
      if (item.color) {
        summary += `   • ${language === 'ar' ? 'اللون:' : 'Color:'} ${item.color.nameAr} (${item.color.hex})\n`;
      }
      if (item.customColorCode) {
        summary += `   • ${language === 'ar' ? 'كود اللون:' : 'Color Code:'} ${item.customColorCode}\n`;
      }
      summary += `   • ${language === 'ar' ? 'الكمية:' : 'Qty:'} ${item.quantity} × ${item.price} ر.س = ${item.quantity * item.price} ر.س\n\n`;
    });

    summary += `------------------------------\n`;
    summary += `${language === 'ar' ? '*إجمالي السلة التقريبي:*' : '*Estimated Cart Total:*'} ${totalAmount} ${t('currency')}\n`;
    summary += `${language === 'ar' ? '📍 التوصيل أو الاستلام:' : '📍 Fulfillment:'} ${t('taifLocation')}\n\n`;
    summary += `${language === 'ar' ? 'أرجو تأكيد توفر المواد والوقت المناسب للتجهيز والتوصيل.' : 'Please confirm availability and prep time.'}`;

    handleSendToWhatsApp(summary);
  };

  return (
    <div className="fixed bottom-6 end-6 z-40 flex flex-col items-end">
      {/* Quick Chat Popup */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-lg">
                  🎨
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-700 rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">{settings.shopNameAr}</h4>
                <p className="text-xs text-emerald-100 flex items-center gap-1">
                  <span>خدمة عملاء الطائف • متاحون للرد</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3 max-h-96 overflow-y-auto text-sm">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <p className="text-xs text-slate-500 mb-1 font-semibold flex items-center gap-1 text-emerald-700">
                <CheckCircle className="w-3.5 h-3.5" />
                {language === 'ar' ? 'خدمة الطلب والاستفسار المباشر' : 'Direct Order & Consultation'}
              </p>
              <p className="text-slate-700 leading-relaxed text-xs">
                {language === 'ar'
                  ? 'مرحباً بك في مركز المالك للدهانات بالطائف! يسعدنا مساعدتك في اختيار الدهانات، حساب الكميات، أو إرسال طلبك مباشرة للمحل.'
                  : 'Welcome to Markaz Almalak Paint Shop Taif! How can we assist you with paints, quantities, or orders today?'}
              </p>
            </div>

            {/* Cart info if has items */}
            {items.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-2">
                  <span>{language === 'ar' ? 'سلتك الحالية:' : 'Your Cart:'} ({items.length} {language === 'ar' ? 'أصناف' : 'items'})</span>
                  <span>{totalAmount} {t('currency')}</span>
                </div>
                <button
                  onClick={handleSendCartSummary}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('sendCartWhatsApp')}</span>
                </button>
              </div>
            )}

            {/* Quick Templates */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {language === 'ar' ? 'اختر رسالة سريعة:' : 'Quick Messages:'}
              </p>
              <button
                onClick={() =>
                  handleSendToWhatsApp(
                    language === 'ar'
                      ? 'السلام عليكم، أرغب في الاستفسار عن رشات البروفايل للواجهات الخارجية وأسعار البراميل بالطائف.'
                      : 'Hello, I want to inquire about exterior profile texture paints and drum prices in Taif.'
                  )
                }
                className="w-full text-start p-2 text-xs bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-700 transition-colors"
              >
                🧱 {language === 'ar' ? 'استفسار عن رشة بروفايل للواجهات' : 'Exterior Profile Texture Inquiries'}
              </button>
              <button
                onClick={() =>
                  handleSendToWhatsApp(
                    language === 'ar'
                      ? 'السلام عليكم، أحتاج مساعدة في حساب كمية الدهان الداخلي لغرفة أو شقة بالطائف.'
                      : 'Hello, I need help estimating paint gallons for an apartment in Taif.'
                  )
                }
                className="w-full text-start p-2 text-xs bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-700 transition-colors"
              >
                📐 {language === 'ar' ? 'مساعدة في حساب كميات الدهان' : 'Paint Quantity Calculation Help'}
              </button>
              <button
                onClick={() =>
                  handleSendToWhatsApp(
                    language === 'ar'
                      ? 'السلام عليكم، هل تتوفر خلطات كمبيوتر لأكواد جوتن والجزيرة لديكم بشارع البحرين؟'
                      : 'Hello, do you provide computerized tinting for Jotun and Al-Jazeera color codes?'
                  )
                }
                className="w-full text-start p-2 text-xs bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-700 transition-colors"
              >
                🎨 {language === 'ar' ? 'خلط ألوان كمبيوتر ومطابقة الأكواد' : 'Computerized Color Tinting'}
              </button>
            </div>

            {/* Custom input */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Type custom message...'}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customMsg.trim()) {
                    handleSendToWhatsApp(customMsg);
                    setCustomMsg('');
                  }
                }}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                disabled={!customMsg.trim()}
                onClick={() => {
                  if (customMsg.trim()) {
                    handleSendToWhatsApp(customMsg);
                    setCustomMsg('');
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white p-2 rounded-lg text-xs font-semibold"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-tight">
              {t('whatsappDisclaimer')}
            </p>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="WhatsApp Support"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-6 h-6" />
        <span className="font-bold text-sm hidden sm:inline">
          {language === 'ar' ? 'تواصل عبر الواتساب' : 'Chat on WhatsApp'}
        </span>
      </button>
    </div>
  );
};
