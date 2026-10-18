import React, { useState } from 'react';
import {
  ShoppingBag,
  Send,
  Calculator,
  ShieldCheck,
  Truck,
  Sparkles,
  Palette,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  Crown,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { POPULAR_SAUDI_COLORS } from '../../data/mockData';

export const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { setActivePage, settings, setSelectedProductForModal, products } = useShop();
  const [activeSwatch, setActiveSwatch] = useState(POPULAR_SAUDI_COLORS[0]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white">
      {/* Decorative Background Lighting and Geometry */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-amber-500 blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-indigo-500 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Content (Left in LTR, Right in RTL) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
            {/* Top Crown Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold shadow-inner">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'الوجهة الأولى للدهانات ومواد التشطيب في الطائف' : 'Taif’s Premier Paint & Finishes Center'}</span>
            </div>

            {/* Bilingual Headings */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                <span className="block text-amber-400 font-extrabold">{settings.shopNameAr}</span>
                <span className="block text-xl sm:text-2xl lg:text-3xl font-medium text-slate-200 mt-1 font-serif">
                  {settings.shopNameEn}
                </span>
              </h1>

              {/* Taglines */}
              <div className="pt-2">
                <p className="text-lg sm:text-2xl font-bold text-amber-300">
                  {t('heroTagline')}
                </p>
                <p className="text-sm sm:text-base text-slate-300 font-medium mt-1">
                  {settings.taglineAr}
                </p>
              </div>
            </div>

            {/* Location & Tax Highlight */}
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {language === 'ar'
                ? 'نوفر لكم أحدث خيارات دهانات الجدران الداخلية والخارجية، رشات بروفايل الواجهات، ورق حائط كلاسيك ومودرن، وعوازل معتمدة مع التوصيل الفوري لكافة أحياء الطائف وفاتورة ضريبية نظامية.'
                : 'Browse and book premium interior & exterior paints, textured facade profiles, wallpapers, and waterproofing with swift delivery across Taif and certified VAT invoices.'}
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              {/* Shop Now */}
              <button
                onClick={() => {
                  setActivePage('shop');
                  window.scrollTo({ top: 500, behavior: 'smooth' });
                }}
                className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5 text-slate-950" />
                <span>{t('shopNow')}</span>
              </button>

              {/* Book Your Order */}
              <button
                onClick={() => {
                  setActivePage('shop');
                  window.scrollTo({ top: 500, behavior: 'smooth' });
                }}
                className="px-6 sm:px-8 py-3.5 bg-blue-900/80 hover:bg-blue-800 text-white font-bold text-sm sm:text-base rounded-2xl border border-blue-700/60 shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Send className="w-5 h-5 text-amber-400" />
                <span>{t('bookOrder')}</span>
              </button>

              {/* Paint Calculator */}
              <button
                onClick={() => {
                  setActivePage('calculator');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm rounded-2xl border border-slate-700 hover:text-amber-300 transition-all flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>{t('calculator')}</span>
              </button>
            </div>

            {/* 4 Trust Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 text-start">
              <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">{t('heroBadge1')}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">{t('heroBadge2')}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <Palette className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">{t('heroBadge3')}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">{t('heroBadge4')}</span>
              </div>
            </div>
          </div>

          {/* Interactive Paint Showcase Card (Right in LTR, Left in RTL) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-6 sm:p-8 bg-slate-900/80 border-2 border-amber-400/30 backdrop-blur-md shadow-2xl space-y-6">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                    🎨
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {language === 'ar' ? 'معمل اختيار الألوان والرشة' : 'Color & Swatch Studio'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {language === 'ar' ? 'درجات الألوان الأكثر طلباً في الطائف' : 'Top trending shades in Taif'}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-900 text-blue-200 font-mono">
                  {activeSwatch.code}
                </span>
              </div>

              {/* Virtual Wall Preview with Active Color */}
              <div
                className="relative h-44 rounded-2xl shadow-inner border border-slate-700 p-4 flex flex-col justify-between transition-colors duration-500 overflow-hidden"
                style={{ backgroundColor: activeSwatch.hex }}
              >
                {/* Simulated wall texture overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 pointer-events-none"></div>

                <div className="relative z-10 flex justify-between items-start">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold shadow-xs bg-slate-900/70 text-white backdrop-blur-xs">
                    {language === 'ar' ? activeSwatch.nameAr : activeSwatch.nameEn}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/80 text-slate-900 font-bold">
                    {activeSwatch.hex}
                  </span>
                </div>

                <div className="relative z-10 bg-slate-900/85 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 text-white flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      {language === 'ar' ? 'دهان موصى به' : 'Recommended Base'}
                    </p>
                    <p className="text-xs font-bold truncate">فينوماستيك حريري أو رشة بروفايل</p>
                  </div>
                  <button
                    onClick={() => {
                      if (products[0]) setSelectedProductForModal(products[0]);
                    }}
                    className="text-xs bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg hover:bg-amber-300 transition-colors"
                  >
                    {language === 'ar' ? 'اطلب الدرجة' : 'Order Shade'}
                  </button>
                </div>
              </div>

              {/* Swatches Selector */}
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-2">
                  {language === 'ar' ? 'اضغط لتجربة درجات الجدران والواجهات:' : 'Click to preview wall shades:'}
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {POPULAR_SAUDI_COLORS.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setActiveSwatch(c)}
                      className={`group relative h-10 rounded-xl transition-all border-2 flex items-center justify-center ${
                        activeSwatch.code === c.code
                          ? 'border-amber-400 scale-110 shadow-lg'
                          : 'border-slate-700 hover:border-slate-500 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={`${c.nameAr} - ${c.code}`}
                    >
                      {activeSwatch.code === c.code && (
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-xs border border-white"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fast Taif Branch Notice */}
              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>📍 شارع البحرين بعد زين</span>
                <span className="text-emerald-400 font-bold">● مفتوح اليوم حتى 10:30 م</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
