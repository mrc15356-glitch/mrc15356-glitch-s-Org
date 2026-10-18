import React, { useState } from 'react';
import {
  X,
  Star,
  Check,
  ShoppingCart,
  Send,
  ShieldCheck,
  Truck,
  Droplets,
  Clock,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { Product, ProductColor, ProductSize } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useShop } from '../../context/ShopContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { settings } = useShop();

  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes[0] || {
      size: 'Standard',
      labelAr: 'قياسي',
      labelEn: 'Standard',
      price: product.basePrice,
      inStock: true,
    }
  );

  const [selectedColor, setSelectedColor] = useState<ProductColor | undefined>(
    product.colors[0]
  );
  const [customCode, setCustomCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, customCode.trim() || undefined, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleDirectWhatsAppOrder = () => {
    const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
    const saudiPhone = cleanPhone.startsWith('0') ? '966' + cleanPhone.slice(1) : cleanPhone;

    const message =
      language === 'ar'
        ? `السلام عليكم، أود حجز وتجهيز هذا الصنف من مركز المالك للدهانات بالطائف:\n` +
          `• *الصنف:* ${product.nameAr}\n` +
          `• *الشركة:* ${product.brand}\n` +
          `• *المقاس المختار:* ${selectedSize.labelAr} (${selectedSize.size})\n` +
          (selectedColor ? `• *اللون المقترح:* ${selectedColor.nameAr} (${selectedColor.hex})\n` : '') +
          (customCode.trim() ? `• *كود خلط مخصص:* ${customCode.trim()}\n` : '') +
          `• *الكمية:* ${quantity}\n` +
          `• *سعر الحبة:* ${selectedSize.price} ر.س\n` +
          `• *المجموع التقديري:* ${selectedSize.price * quantity} ر.س\n\n` +
          `أرجو تأكيد التجهيز في المحل بشارع البحرين أو التوصيل بالطائف.`
        : `Hello, I want to order from Markaz Almalak Paint Shop Taif:\n` +
          `• Product: ${product.nameEn}\n` +
          `• Brand: ${product.brand}\n` +
          `• Size: ${selectedSize.labelEn}\n` +
          (selectedColor ? `• Color: ${selectedColor.nameEn}\n` : '') +
          (customCode.trim() ? `• Custom Tint Code: ${customCode.trim()}\n` : '') +
          `• Quantity: ${quantity}\n` +
          `• Total: ${selectedSize.price * quantity} SAR`;

    window.open(`https://wa.me/${saudiPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Image & Technical Highlights (Left/Right) */}
          <div className="md:col-span-5 bg-slate-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-e border-slate-200">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-200 shadow-md">
                <img
                  src={product.image}
                  alt={product.nameAr}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 start-3 bg-blue-950 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  {product.brand}
                </span>

                {product.isDemo && (
                  <span className="absolute bottom-3 start-3 bg-amber-400 text-blue-950 text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                    {t('demoTag')}
                  </span>
                )}
              </div>

              {/* Technical Specifications */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-2">
                  {language === 'ar' ? 'المواصفات الفنية للدهان:' : 'Technical Specifications:'}
                </h4>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t('coverage')}:</span>
                  </span>
                  <span className="font-bold text-slate-800">{product.coverage}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('dryTime')}:</span>
                  </span>
                  <span className="font-bold text-slate-800">{product.dryTime}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t('finishType')}:</span>
                  </span>
                  <span className="font-bold text-slate-800">{product.finish}</span>
                </div>
              </div>
            </div>

            {/* Store Guarantee */}
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{language === 'ar' ? 'أصلي 100% معتمد من مركز المالك بالطائف' : '100% Authentic certified product'}</span>
            </div>
          </div>

          {/* Details & Selectors (Right/Left) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Title */}
              <div>
                <span className="text-xs text-amber-600 font-bold uppercase tracking-wider block mb-1">
                  {language === 'ar' ? product.categoryNameAr : product.categoryNameEn}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 leading-snug">
                  {language === 'ar' ? product.nameAr : product.nameEn}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400">({product.reviewsCount} {language === 'ar' ? 'تقييم' : 'reviews'})</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'ar' ? product.descriptionAr : product.descriptionEn}
              </p>

              {/* Sizes Selection */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  {language === 'ar' ? 'اختر المقاس المطلوب:' : 'Select Size:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-start transition-all flex items-center justify-between ${
                        selectedSize.size === s.size
                          ? 'border-blue-900 bg-blue-50 text-blue-950 shadow-xs ring-1 ring-blue-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{language === 'ar' ? s.labelAr : s.labelEn}</span>
                      <span className="font-mono text-amber-700 font-black shrink-0 ms-1">
                        {s.price} {t('currency')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <label className="font-bold text-slate-800">
                      {language === 'ar' ? 'الألوان الشائعة المقترحة:' : 'Popular Color Swatches:'}
                    </label>
                    <span className="font-semibold text-slate-600">
                      {selectedColor ? (language === 'ar' ? selectedColor.nameAr : selectedColor.nameEn) : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.colors.map((c) => (
                      <button
                        key={c.code || c.hex}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`h-8 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          selectedColor?.hex === c.hex
                            ? 'ring-2 ring-blue-900 ring-offset-1 border-blue-900 bg-slate-100 font-bold'
                            : 'border-slate-200 hover:border-slate-400 bg-white'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-[11px]">{language === 'ar' ? c.nameAr : c.nameEn}</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom color code input */}
                  <div className="mt-3">
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      {language === 'ar'
                        ? 'أو أدخل كود خلط كمبيوتر مخصص (جوتن / الجزيرة):'
                        : 'Or type custom tint code (Jotun/Jazeera):'}
                    </label>
                    <input
                      type="text"
                      placeholder={language === 'ar' ? 'مثال: جوتن 10678 Space أو الجزيرة CT-401' : 'e.g. Jotun 10678 or CT-401'}
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Demo Notice Disclaimer */}
              <div className="bg-amber-50/80 rounded-xl p-2.5 border border-amber-200 flex items-center gap-2 text-[11px] text-amber-900">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{t('demoNotice')}</span>
              </div>
            </div>

            {/* Price & Checkout Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">{language === 'ar' ? 'السعر الإجمالي:' : 'Total Price:'}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-blue-950">
                      {selectedSize.price * quantity}
                    </span>
                    <span className="text-xs font-bold text-amber-600">
                      {t('currency')}
                    </span>
                    <span className="text-[10px] text-slate-400 ms-1">({t('vatIncluded')})</span>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-200 text-base font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold font-mono text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-200 text-base font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-blue-950 to-indigo-950 hover:from-blue-900 hover:to-indigo-900 text-white'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{language === 'ar' ? 'تمت الإضافة للسلة!' : 'Added to Cart!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 text-amber-400" />
                      <span>{t('addToCart')}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDirectWhatsAppOrder}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('orderViaWhatsApp')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
