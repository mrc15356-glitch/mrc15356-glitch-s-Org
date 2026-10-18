import React from 'react';
import { Star, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../shop/ProductCard';

export const FeaturedProducts: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const { products, setActivePage, setSelectedCategory, setSelectedProductForModal } = useShop();

  const featured = products.filter((p) => p.isBestSeller).slice(0, 6);

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الأكثر طلباً بين مقاولي وأهالي الطائف' : 'Taif Favorites & Best Sellers'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              {language === 'ar' ? 'أفضل أصناف الدهانات ورشات البروفايل' : 'Featured Paints & Profile Coatings'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {language === 'ar'
                ? 'تشكيلة مختارة بعناية من أفضل الشركات المصنعة لضمان دوام وثبات اللون لسنوات طويلة'
                : 'Top selected high-adhesion formulations engineered for endurance and rich color'}
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory(null);
              setActivePage('shop');
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-900 hover:text-amber-600 transition-colors self-start md:self-end group"
          >
            <span>{t('viewAllProducts')}</span>
            {dir === 'rtl' ? (
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={(p) => setSelectedProductForModal(p)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
