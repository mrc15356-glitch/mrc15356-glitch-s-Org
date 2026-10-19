import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  MapPin,
  Clock,
  Globe,
  Search,
  ShoppingCart,
  Menu,
  X,
  Calculator,
  Truck,
  ShieldCheck,
  Tag,
  Palette,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { useCart } from '../../context/CartContext';

export const Header: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const {
    settings,
    activePage,
    setActivePage,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProductForModal,
    setSelectedCategory,
  } = useShop();
  const { totalItemsCount, subtotal, setIsCartOpen } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchFilteredProducts = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryNameAr.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSelectSearchResult = (product: any) => {
    setSelectedProductForModal(product);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  const navLinks = [
    { id: 'home', label: t('home'), icon: null },
    { id: 'shop', label: t('products'), icon: Palette },
    { id: 'calculator', label: t('calculator'), icon: Calculator },
    { id: 'track', label: t('trackOrder'), icon: Truck },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-sm border-b border-slate-200">
      {/* Top Info Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Location & Tax Info */}
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <a
              href="https://www.google.com/maps?q=21.267656,40.417657"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
              title="View on Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{settings.addressAr}</span>
            </a>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('taxNumberLabel')}: <strong className="font-mono text-amber-300">{settings.taxNumber}</strong></span>
            </span>
          </div>

          {/* Contact, Hours & Language switch */}
          <div className="flex items-center gap-4 ms-auto">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1.5 text-slate-200 hover:text-amber-400 transition-colors font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.phone}</span>
            </a>

            <div className="hidden lg:flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'ar' ? 'السبت - الخميس 7:30ص - 10:30م' : 'Sat-Thu: 7:30am-10:30pm'}</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 px-2.5 py-1 rounded-md text-xs font-bold transition-all border border-slate-700 hover:border-amber-400/50"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand Name */}
          <div
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Custom Paint Crown Logo Emblem */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-950 p-2 shadow-md border-2 border-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="relative text-center">
                <span className="text-xl">👑</span>
                <span className="absolute -bottom-1 -right-1 text-xs">🎨</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-blue-950 tracking-tight leading-none group-hover:text-blue-800 transition-colors">
                  {settings.shopNameAr}
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  الطائف
                </span>
              </div>
              <p className="text-xs text-amber-700 font-semibold mt-1 flex items-center gap-1">
                <span>رشات داخلية وخارجية - ورق حائط</span>
              </p>
            </div>
          </div>

          {/* Live Search Bar (Desktop/Tablet) */}
          <div ref={searchRef} className="relative hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                  if (activePage !== 'shop' && e.target.value.trim().length > 1) {
                    // stays on dropdown
                  }
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full bg-slate-100/80 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-full py-2.5 ps-10 pe-10 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-inner"
              />
              <Search className="absolute start-3.5 top-3 w-4 h-4 text-slate-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3 top-2.5 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Suggestions */}
            {showSearchDropdown && searchFilteredProducts.length > 0 && (
              <div className="absolute top-full mt-2 inset-x-0 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{language === 'ar' ? 'نتائج البحث السريعة' : 'Quick Search Results'}</span>
                  <span className="text-blue-700">{searchFilteredProducts.length} {language === 'ar' ? 'أصناف' : 'items'}</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {searchFilteredProducts.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectSearchResult(item)}
                      className="p-2.5 hover:bg-blue-50/60 cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.nameAr}
                        className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 truncate">
                          {language === 'ar' ? item.nameAr : item.nameEn}
                        </h5>
                        <p className="text-[11px] text-slate-500">{item.brand} • {item.finish}</p>
                      </div>
                      <div className="text-end shrink-0">
                        <span className="font-bold text-blue-950 text-xs">
                          {item.basePrice} {t('currency')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setActivePage('shop');
                    setShowSearchDropdown(false);
                  }}
                  className="w-full py-2 bg-blue-900 text-white text-xs font-bold text-center hover:bg-blue-800 transition-colors"
                >
                  {t('viewAllProducts')}
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons: Cart & Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 bg-blue-950 hover:bg-blue-900 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md transition-all active:scale-95"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2.5 -end-2.5 bg-amber-400 text-blue-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs border-2 border-blue-950">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-start leading-tight">
                <span className="text-[10px] text-slate-300 block uppercase font-bold">
                  {t('cart')}
                </span>
                <span className="text-xs font-extrabold text-amber-400">
                  {subtotal} {t('currency')}
                </span>
              </div>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => setActivePage('admin')}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                activePage === 'admin'
                  ? 'bg-amber-400 text-blue-950 border-amber-500'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={t('adminLogin')}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="hidden lg:inline">{t('adminLogin')}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search for mobile */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== 'shop') setActivePage('shop');
              }}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2 ps-9 pe-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="absolute start-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Navigation Bar (Desktop) */}
      <nav className="hidden md:block bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActivePage(link.id as any);
                    if (link.id === 'shop') setSelectedCategory(null);
                  }}
                  className={`px-4 py-3 text-xs lg:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                    isActive
                      ? 'border-amber-400 text-amber-300 bg-white/10'
                      : 'border-transparent text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-amber-400" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs text-amber-300 font-semibold py-2">
            <span className="flex items-center gap-1 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30">
              <Tag className="w-3.5 h-3.5" />
              <span>
                {language === 'ar'
                  ? `توصيل مجاني للطلبات فوق ${settings.freeDeliveryThreshold || 1000} ر.س بالطائف`
                  : `Free Taif Delivery over ${settings.freeDeliveryThreshold || 1000} SAR`}
              </span>
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-white border-t border-slate-800 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActivePage(link.id as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-start p-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${
                  isActive ? 'bg-amber-400 text-blue-950' : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                {Icon && <Icon className="w-5 h-5 text-amber-400" />}
                <span>{link.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 bg-amber-400/10 text-amber-300 rounded-xl border border-amber-400/20 text-xs font-semibold">
              <Tag className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {language === 'ar'
                  ? `توصيل مجاني للطلبات فوق ${settings.freeDeliveryThreshold || 1000} ر.س بالطائف`
                  : `Free Taif Delivery over ${settings.freeDeliveryThreshold || 1000} SAR`}
              </span>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl text-slate-300 space-y-2">
              <p className="font-bold text-amber-400">{t('taxNumberLabel')}: {settings.taxNumber}</p>
              <p className="text-[11px] leading-relaxed">{settings.addressAr}</p>
              <p className="font-mono text-emerald-400">جوال: {settings.phone}</p>
              <a
                href="https://www.google.com/maps?q=21.267656,40.417657"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>موقع المحل على خرائط Google</span>
              </a>
            </div>
            <button
              onClick={() => {
                toggleLanguage();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
