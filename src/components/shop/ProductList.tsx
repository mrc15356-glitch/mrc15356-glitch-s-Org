import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Filter,
  ArrowUpDown,
  Tag,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';

export const ProductList: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedBrand,
    setSelectedBrand,
    priceRange,
    setPriceRange,
    setSelectedProductForModal,
    resetFilters,
  } = useShop();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract unique brands from products
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.brand));
    return Array.from(set);
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory && p.categoryId !== selectedCategory) return false;

        // Brand filter
        if (selectedBrand && p.brand !== selectedBrand) return false;

        // Price filter
        if (p.basePrice < priceRange[0] || p.basePrice > priceRange[1]) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName =
            p.nameAr.toLowerCase().includes(q) ||
            p.nameEn.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.categoryNameAr.toLowerCase().includes(q) ||
            p.categoryNameEn.toLowerCase().includes(q) ||
            p.descriptionAr.toLowerCase().includes(q);
          if (!matchName) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
        if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [products, selectedCategory, selectedBrand, priceRange, searchQuery, sortBy]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>{t('home')}</span>
            <span>/</span>
            <span className="font-bold text-blue-950">
              {activeCategoryObj ? (language === 'ar' ? activeCategoryObj.nameAr : activeCategoryObj.nameEn) : t('allCategories')}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
                {activeCategoryObj
                  ? (language === 'ar' ? activeCategoryObj.nameAr : activeCategoryObj.nameEn)
                  : (language === 'ar' ? 'كتالوج دهانات ورشات مركز المالك' : 'Paint Catalog & Products')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {activeCategoryObj
                  ? (language === 'ar' ? activeCategoryObj.descriptionAr : activeCategoryObj.descriptionEn)
                  : (language === 'ar' ? 'تصفح كافة مستلزمات الدهانات والرشات الديكورية وأدوات العزل بالطائف' : 'Explore high-grade exterior, interior, and decorative paints in Taif')}
              </p>
            </div>

            {/* Demo data disclaimer notice */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold self-start md:self-auto shadow-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t('demoNotice')}</span>
            </div>
          </div>
        </div>

        {/* Categories Bar (horizontal pill scrolls) */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === null
                ? 'bg-blue-950 text-amber-400 shadow-md ring-2 ring-amber-400/40'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t('allCategories')} ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-950 text-amber-400 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {language === 'ar' ? cat.nameAr : cat.nameEn}
            </button>
          ))}
        </div>

        {/* Main Grid with Sidebar Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filters Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-6 sticky top-28">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                <span>{language === 'ar' ? 'تصفية المنتجات' : 'Filter Products'}</span>
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] text-blue-900 hover:text-amber-600 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
              </button>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">
                {t('allBrands')}
              </label>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedBrand(null)}
                  className={`w-full text-start px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedBrand === null
                      ? 'bg-blue-900 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {language === 'ar' ? 'جميع الشركات والماركات' : 'All Brands'}
                </button>
                {availableBrands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBrand(b === selectedBrand ? null : b)}
                    className={`w-full text-start px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedBrand === b
                        ? 'bg-blue-900 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                <span>{t('filterByPrice')}</span>
                <span className="text-amber-700 font-mono">
                  {priceRange[1]} {t('currency')}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="800"
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-blue-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>10 ر.س</span>
                <span>800 ر.س</span>
              </div>
            </div>

            {/* Location Guarantee */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">
                {language === 'ar' ? '📍 فرع الطائف المباشر:' : 'Taif Store Pickup:'}
              </p>
              <p className="text-[11px] text-slate-500">الشهداء الشمالية - شارع البحرين</p>
              <p className="text-[10px] text-emerald-700 font-bold mt-1">
                ✓ متوفر للاستلام الفوري أو التوصيل
              </p>
            </div>
          </div>

          {/* Catalog Main Column */}
          <div className="lg:col-span-9 space-y-4">
            {/* Toolbar: Count, Mobile filter button & Sort */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600 font-semibold">
                  {language === 'ar' ? 'عرض' : 'Showing'} <strong className="text-blue-950 font-black">{filteredProducts.length}</strong> {language === 'ar' ? 'منتج متوفر' : 'products'}
                </span>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Filter className="w-3.5 h-3.5 text-blue-900" />
                  <span>{language === 'ar' ? 'تصفية وبحث' : 'Filter'}</span>
                </button>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold">{t('sortBy')}:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 font-bold text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-900"
                >
                  <option value="featured">{t('sortDefault')}</option>
                  <option value="price-asc">{t('sortPriceLow')}</option>
                  <option value="price-desc">{t('sortPriceHigh')}</option>
                  <option value="rating">{t('sortRating')}</option>
                </select>
              </div>
            </div>

            {/* Mobile Filters Dropdown if open */}
            {showMobileFilters && (
              <div className="lg:hidden bg-white p-4 rounded-2xl border border-slate-200 shadow-md space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-bold text-slate-900">{language === 'ar' ? 'خيارات التصفية' : 'Filters'}</h4>
                  <button onClick={resetFilters} className="text-xs text-blue-900 font-bold">
                    {language === 'ar' ? 'تفريغ الكل' : 'Clear'}
                  </button>
                </div>
                {/* Brand select */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">{t('allBrands')}</label>
                  <select
                    value={selectedBrand || ''}
                    onChange={(e) => setSelectedBrand(e.target.value || null)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold"
                  >
                    <option value="">{language === 'ar' ? 'جميع الشركات' : 'All Brands'}</option>
                    {availableBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpenDetails={(item) => setSelectedProductForModal(item)}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'ar' ? 'لم يتم العثور على نتائج تطابق بحثك' : 'No matching paints found'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {language === 'ar'
                    ? 'جرب تقليل شروط التصفية أو البحث باسم الشركة مثل جوتن أو الجزيرة أو نوع الرشة'
                    : 'Try clearing filters or search by brand name like Jotun or Saveto'}
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-blue-950 text-white rounded-xl text-xs font-bold hover:bg-blue-900 transition-colors"
                >
                  {language === 'ar' ? 'إعادة ضبط كافة الفلاتر' : 'Reset All Filters'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
