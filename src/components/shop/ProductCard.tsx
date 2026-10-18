import React, { useState } from 'react';
import { ShoppingCart, Send, Eye, Star, Check, AlertCircle } from 'lucide-react';
import { Product, ProductColor, ProductSize } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useShop } from '../../context/ShopContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { settings } = useShop();

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

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, undefined, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleDirectWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
    const saudiPhone = cleanPhone.startsWith('0') ? '966' + cleanPhone.slice(1) : cleanPhone;

    const message =
      language === 'ar'
        ? `السلام عليكم، أود حجز وشراء المنتج التالي من مركز المالك للدهانات بالطائف:\n` +
          `• *المنتج:* ${product.nameAr}\n` +
          `• *الشركة:* ${product.brand}\n` +
          `• *المقاس:* ${selectedSize.labelAr}\n` +
          (selectedColor ? `• *اللون:* ${selectedColor.nameAr} (${selectedColor.hex})\n` : '') +
          `• *الكمية:* ${quantity}\n` +
          `• *السعر الإفرادي:* ${selectedSize.price} ر.س\n` +
          `• *الإجمالي التقديري:* ${selectedSize.price * quantity} ر.س\n\n` +
          `أرجو تأكيد توفر المواد والتجهيز في شارع البحرين أو التوصيل.`
        : `Hello, I want to order the following from Markaz Almalak Paint Shop Taif:\n` +
          `• Product: ${product.nameEn}\n` +
          `• Brand: ${product.brand}\n` +
          `• Size: ${selectedSize.labelEn}\n` +
          (selectedColor ? `• Color: ${selectedColor.nameEn}\n` : '') +
          `• Quantity: ${quantity}\n` +
          `• Unit Price: ${selectedSize.price} SAR\n` +
          `• Estimated Total: ${selectedSize.price * quantity} SAR`;

    window.open(`https://wa.me/${saudiPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Image & Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.nameAr}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Brand Badge */}
        <span className="absolute top-2.5 start-2.5 bg-blue-950/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm border border-white/10">
          {product.brand}
        </span>

        {/* Demo Data Tag (Mandatory as per instructions) */}
        {product.isDemo && (
          <span className="absolute bottom-2.5 start-2.5 bg-amber-500/90 backdrop-blur-xs text-blue-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs">
            {t('demoTag')}
          </span>
        )}

        {/* Best seller or discount badge */}
        <div className="absolute top-2.5 end-2.5 flex flex-col gap-1 items-end">
          {product.isBestSeller && (
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
              ★ {language === 'ar' ? 'الأكثر طلباً' : 'Best Seller'}
            </span>
          )}
          {product.discountPercent && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 bg-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            className="bg-white/95 text-blue-950 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 hover:bg-amber-400 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'معاينة المواصفات' : 'Quick Details'}</span>
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        {/* Category & Title */}
        <div>
          <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block mb-1">
            {language === 'ar' ? product.categoryNameAr : product.categoryNameEn}
          </span>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
            {language === 'ar' ? product.nameAr : product.nameEn}
          </h3>
          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {language === 'ar' ? product.descriptionAr : product.descriptionEn}
          </p>
        </div>

        {/* Color preview dots if any */}
        {product.colors && product.colors.length > 0 && (
          <div className="pt-1" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>{language === 'ar' ? 'درجات الألوان:' : 'Colors:'}</span>
              <span className="text-slate-700 font-semibold truncate max-w-[120px]">
                {selectedColor ? (language === 'ar' ? selectedColor.nameAr : selectedColor.nameEn) : ''}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.colors.slice(0, 6).map((c) => (
                <button
                  key={c.code || c.hex}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-5 h-5 rounded-full border transition-all ${
                    selectedColor?.hex === c.hex
                      ? 'ring-2 ring-blue-900 ring-offset-1 scale-110 border-white'
                      : 'border-slate-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={language === 'ar' ? c.nameAr : c.nameEn}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size Selection Pills */}
        <div className="pt-1" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span>{t('size')}:</span>
            <span className="text-emerald-700 font-semibold">{t('inStock')}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s.size}
                type="button"
                onClick={() => setSelectedSize(s)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-all ${
                  selectedSize.size === s.size
                    ? 'bg-blue-950 text-white border-blue-950 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Quantity & Actions */}
        <div className="pt-3 border-t border-slate-100 space-y-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 block">{language === 'ar' ? 'السعر المحدد:' : 'Price:'}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-blue-950">
                  {selectedSize.price}
                </span>
                <span className="text-xs font-bold text-amber-600">
                  {t('currency')}
                </span>
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-sm font-bold"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-bold font-mono text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-sm font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-950 hover:bg-blue-900 text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تمت الإضافة' : 'Added!'}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('addToCart')}</span>
                </>
              )}
            </button>

            {/* Direct WhatsApp Order */}
            <button
              type="button"
              onClick={handleDirectWhatsAppOrder}
              className="py-2 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              title="Order on WhatsApp"
            >
              <Send className="w-3 h-3 text-emerald-600" />
              <span>{language === 'ar' ? 'طلب واتساب' : 'WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
