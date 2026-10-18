import React from 'react';
import { ChevronRight, ArrowLeft, ArrowRight, Paintbrush, Layers, Shield, Droplets, Sparkles, Home, Wrench, Hammer, SprayCan, PaintBucket } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { Category } from '../../types';

const ICON_MAP: Record<string, React.ElementType> = {
  Paintbrush,
  Home,
  Sparkles,
  Shield,
  Droplets,
  SprayCan,
  PaintBucket,
  Wrench,
  Layers,
  Hammer,
};

export const CategoryShowcase: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const { categories, setSelectedCategory, setActivePage } = useShop();

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setActivePage('shop');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>{language === 'ar' ? 'تشكيلة متكاملة لكافة أعمال البناء والتشطيب' : 'Complete Paint & Finishing Catalog'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              {t('browseCategories')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {t('categoriesSubtitle')}
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

        {/* 10 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat: Category) => {
            const Icon = ICON_MAP[cat.iconName] || Paintbrush;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative cursor-pointer bg-slate-50 hover:bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-amber-400/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Image Banner with Gradient */}
                <div className="relative h-28 sm:h-32 rounded-xl overflow-hidden mb-3.5 bg-slate-200">
                  <img
                    src={cat.image}
                    alt={cat.nameAr}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
                  
                  {/* Category Icon Badge */}
                  <div className="absolute top-2.5 start-2.5 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs text-blue-950 flex items-center justify-center shadow-xs">
                    <Icon className="w-4 h-4 text-blue-900" />
                  </div>

                  {/* Count Badge */}
                  <span className="absolute bottom-2 end-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-blue-950 shadow-xs">
                    {cat.productCount} {language === 'ar' ? 'صنف' : 'items'}
                  </span>
                </div>

                {/* Category Title & Description */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                    {language === 'ar' ? cat.nameAr : cat.nameEn}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {language === 'ar' ? cat.descriptionAr : cat.descriptionEn}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-blue-900 font-bold group-hover:text-amber-600">
                  <span className="text-[11px]">{t('exploreCategory')}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
