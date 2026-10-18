import React from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  ExternalLink,
  Heart,
  ChevronRight,
  Truck,
  RotateCcw,
  FileText,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const { settings, categories, setSelectedCategory, setActivePage, setActivePolicy } = useShop();

  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  const saudiPhone = cleanPhone.startsWith('0') ? '966' + cleanPhone.slice(1) : cleanPhone;

  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-amber-400">
      {/* Upper Taif Highlights Banner */}
      <div className="bg-blue-950/80 border-b border-blue-900/50 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-start">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">{language === 'ar' ? 'توصيل سريع بالطائف' : 'Fast Delivery in Taif'}</h5>
              <p className="text-xs text-slate-400">{language === 'ar' ? 'لكافة الأحياء مع خيار الاستلام من المحل' : 'To all districts with store pickup'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">{language === 'ar' ? 'فاتورة ضريبية رسمية' : 'Official VAT Invoice'}</h5>
              <p className="text-xs text-slate-400">{t('taxNumberLabel')}: <span className="font-mono text-amber-300">{settings.taxNumber}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">{language === 'ar' ? 'طلب فوري عبر الواتساب' : 'Instant WhatsApp Ordering'}</h5>
              <p className="text-xs text-slate-400">{language === 'ar' ? 'تنسيق واستشارات ألوان فورية' : 'Direct color advice & orders'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">{language === 'ar' ? 'أصناف أصلية ومضمونة' : '100% Genuine Paints'}</h5>
              <p className="text-xs text-slate-400">{language === 'ar' ? 'جوتن، الجزيرة، سافيتو، ناشيونال' : 'Top Saudi & global certified brands'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 to-amber-500 p-2 border border-amber-400 flex items-center justify-center text-lg shadow-md">
                👑🎨
              </div>
              <div>
                <h3 className="font-black text-white text-base leading-tight">
                  {settings.shopNameAr}
                </h3>
                <p className="text-xs text-amber-400 font-semibold">{settings.shopNameEn}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'مركز متخصص في توفير أرقى أنواع الدهانات الداخلية والخارجية، رشات البروفايل المعمارية، الدهانات الديكورية الفاخرة، ورق الحائط، وعوازل الأسطح والخزانات في مدينة الطائف.'
                : 'Premier paint destination in Taif providing premium interior & exterior paints, architectural profile textures, luxury wallpapers, and advanced waterproofing membranes.'}
            </p>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>{t('taxNumberLabel')}:</span>
                <span className="font-mono font-bold text-amber-400">{settings.taxNumber}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>{language === 'ar' ? 'المدينة:' : 'City:'}</span>
                <span className="text-white font-semibold">الطائف - المملكة العربية السعودية</span>
              </div>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>{t('categories')}</span>
              <span className="text-amber-400 text-xs">10 {language === 'ar' ? 'أقسام' : 'cats'}</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActivePage('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-400 text-start w-full"
                  >
                    <ChevronRight className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="truncate">{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setActivePage('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-amber-400 hover:underline font-bold mt-1 inline-block"
                >
                  {t('viewAllProducts')} ←
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links & Policies */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 pb-2 border-b border-slate-800">
              {language === 'ar' ? 'روابط هامة وسياسات المتجر' : 'Quick Links & Policies'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActivePage('calculator');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>{t('calcTitle')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('track');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>{t('trackTitle')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('delivery')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <FileText className="w-3 h-3 text-slate-500" />
                  <span>{t('deliveryPolicy')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('return')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <FileText className="w-3 h-3 text-slate-500" />
                  <span>{t('returnPolicy')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('privacy')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <FileText className="w-3 h-3 text-slate-500" />
                  <span>{t('privacyPolicy')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('terms')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <FileText className="w-3 h-3 text-slate-500" />
                  <span>{t('termsConditions')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm mb-4 pb-2 border-b border-slate-800">
              {t('contactUs')}
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.addressAr}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-amber-400 font-mono">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${saudiPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 font-mono"
                >
                  واتساب: {settings.whatsapp}
                </a>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">{settings.workingHoursAr}</span>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Taif+Ash+Shuhada+Ash+Shamaliyah+Bahrain+Street"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-slate-900 border border-slate-800 hover:border-amber-400/40 px-3 py-2 rounded-lg transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'عرض موقع المحل على خرائط جوجل' : 'View on Google Maps'}</span>
            </a>
          </div>
        </div>

        {/* Accepted Payment Options */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>{language === 'ar' ? 'طرق الدفع المعتمدة في الطائف:' : 'Payment Methods:'}</span>
            <div className="flex flex-wrap items-center gap-2 ms-2">
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300 font-bold text-[10px]">
                مدى Mada
              </span>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300 font-bold text-[10px]">
                Apple Pay
              </span>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300 font-bold text-[10px]">
                Visa / MasterCard
              </span>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300 font-bold text-[10px]">
                تحويل بنكي (الراجحي)
              </span>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300 font-bold text-[10px]">
                كاش عند الاستلام
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            {t('allRightsReserved')}
          </div>
        </div>
      </div>
    </footer>
  );
};
