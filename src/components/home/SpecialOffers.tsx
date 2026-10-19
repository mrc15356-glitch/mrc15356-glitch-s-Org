import React from 'react';
import { Tag, Sparkles, Clock, CheckCircle2, ShoppingCart, Percent } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { useCart } from '../../context/CartContext';

export const SpecialOffers: React.FC = () => {
  const { t, language } = useLanguage();
  const { products, setSelectedProductForModal, setActivePage } = useShop();
  const { addToCart } = useCart();

  const discountedProduct = products.find((p) => p.isSpecialOffer) || products[1];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Offer Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold">
              <Percent className="w-3.5 h-3.5 text-rose-400" />
              <span>{language === 'ar' ? 'عرض خاص ومحدود في فرع الطائف' : 'Limited Exclusive Taif Offer'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {language === 'ar' ? 'خصم 15% على رشة البروفايل للواجهات والفلل' : '15% Off Exterior Textured Profile Drums'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {language === 'ar'
                ? 'جهز واجهة منزلك أو عمارتك السكنية بأقوى رشة بروفايل محببة مقاومة لعوامل الطقس وأشعة الشمس والبرودة، مع ضمان مطابقة اللون وتوفير الكميات المطلوبة بأعلى مواصفات.'
                : 'Shield your villa facade with high-build textured profile finish engineered for Taif weather durability, now with an exclusive bulk discount.'}
            </p>

            {/* Offer Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === 'ar' ? 'براميل 18 لتر جاهزة للتطبيق' : '18L High-Yield Drums Ready'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === 'ar' ? 'مقاومة تامة لأمطار ورطوبة الطائف' : 'Superior Rain & Moisture Resistance'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === 'ar' ? 'توصيل مجاني لطلبات الواجهات فوق 1000 ر.س' : 'Free Delivery on Orders Over 1000 SAR'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === 'ar' ? 'استشارة لونية وفنية مجانية للموقع' : 'Complimentary Site Color Consultation'}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => {
                  if (discountedProduct) setSelectedProductForModal(discountedProduct);
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 text-xs sm:text-sm font-extrabold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                <span>{language === 'ar' ? 'عرض تفاصيل العرض' : 'View Offer Details'}</span>
              </button>
              <button
                onClick={() => {
                  setActivePage('shop');
                }}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl border border-white/20 transition-colors"
              >
                {t('viewAllProducts')}
              </button>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 rounded-3xl p-6 border-2 border-amber-400/40 shadow-2xl relative">
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
                  alt="Profile exterior offer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 end-3 bg-rose-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-md">
                  15% OFF
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">
                    {language === 'ar' ? 'رشة بروفايل خارجية حبيبات فاخرة' : 'Royal Exterior Textured Profile'}
                  </h4>
                  <p className="text-xs text-slate-400">برميل 18 لتر للواجهات الخارجية</p>
                </div>
                <div className="text-end">
                  <span className="text-xs text-slate-400 line-through block">230 ر.س</span>
                  <span className="text-xl font-black text-amber-400">195 {t('currency')}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (discountedProduct && discountedProduct.sizes[0]) {
                    addToCart(discountedProduct, discountedProduct.sizes[0], discountedProduct.colors[0], undefined, 1);
                  }
                }}
                className="mt-4 w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-blue-700 transition-colors"
              >
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>{language === 'ar' ? 'إضافة العرض للسلة مباشرة' : 'Add Offer to Cart'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
