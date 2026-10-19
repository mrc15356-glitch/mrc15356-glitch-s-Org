import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Image as ImageIcon,
  Layers,
  Palette,
  SlidersHorizontal,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { Category, Product, ProductColor, ProductSize } from '../../types';

interface ProductEditorModalProps {
  isOpen: boolean;
  product: Partial<Product> | null;
  categories: Category[];
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
  language: 'ar' | 'en';
}

const PRESET_PAINT_IMAGES = [
  {
    titleAr: 'جالون بوية داخلي فاخر',
    titleEn: 'Interior Paint Can',
    url: '/src/assets/images/interior_paint_bucket_1792392340490.jpg',
  },
  {
    titleAr: 'واجهات ورشة بروفايل',
    titleEn: 'Exterior Profile Paint',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  },
  {
    titleAr: 'ديكوري ومخملي / ستوكو',
    titleEn: 'Decorative & Velvet Finish',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
  },
  {
    titleAr: 'برايمر وأساس تثبيت',
    titleEn: 'Primer & Wall Sealer',
    url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
  },
  {
    titleAr: 'عازل أسطح وخزانات',
    titleEn: 'Roof Waterproofing',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80',
  },
  {
    titleAr: 'بخاخ طلاء ورذاذ',
    titleEn: 'Spray Aerosol Paint',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  },
  {
    titleAr: 'رولات وفراشي دهان',
    titleEn: 'Rollers & Brushes',
    url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
  },
  {
    titleAr: 'إيبوكسي أرضيات وورش',
    titleEn: 'Floor Epoxy Kit',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
  },
  {
    titleAr: 'برايمر حديد ومضاد صدأ',
    titleEn: 'Anti-Rust Metal Primer',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
  },
];

const SAUDI_POPULAR_COLORS: ProductColor[] = [
  { nameAr: 'أوف وايت نقي', nameEn: 'Pure Off-White', hex: '#FAF9F6', code: 'ALM-101' },
  { nameAr: 'رمادي لؤلؤي', nameEn: 'Pearl Gray', hex: '#E2E5E8', code: 'ALM-204' },
  { nameAr: 'بيج صحراوي دافئ', nameEn: 'Desert Sand Dune', hex: '#EAD7BA', code: 'ALM-305' },
  { nameAr: 'رمادي دخاني مودرن', nameEn: 'Smoke Modern Gray', hex: '#A8B2BA', code: 'ALM-410' },
  { nameAr: 'أزرق ملكي فاخر', nameEn: 'Royal Malak Blue', hex: '#1E3A8A', code: 'ALM-501' },
  { nameAr: 'أخضر ميرمية هادئ', nameEn: 'Sage Green Tranquility', hex: '#9CAF88', code: 'ALM-608' },
  { nameAr: 'كشمير ناعم', nameEn: 'Soft Cashmere', hex: '#DFCFBE', code: 'ALM-712' },
  { nameAr: 'ذهبي كلاسيك', nameEn: 'Classic Royal Gold', hex: '#D4AF37', code: 'ALM-888' },
];

const COMMON_BRANDS = [
  'جوتن (Jotun)',
  'دهانات الجزيرة (Al-Jazeera)',
  'امريكي(Amrici)',
  'سافيتو (Saveto)',
  'ناشيونال (National Paints)',
  'بوسني (Bosny)',
  'كابارول (Caparol)',
  'مركز المالك (Malak Center)',
];

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  isOpen,
  product,
  categories,
  onClose,
  onSave,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'sizes' | 'colors' | 'image' | 'specs'>('basic');
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New size row input
  const [customSizeCode, setCustomSizeCode] = useState('');
  const [customSizeLabelAr, setCustomSizeLabelAr] = useState('');
  const [customSizePrice, setCustomSizePrice] = useState<number>(0);

  // New color row input
  const [customColorNameAr, setCustomColorNameAr] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#2563EB');
  const [customColorCode, setCustomColorCode] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        sizes: product.sizes && product.sizes.length > 0
          ? [...product.sizes]
          : [
              { size: '1L', labelAr: '1 لتر (علبة صغيرة)', labelEn: '1 Liter', price: product.basePrice || 48, inStock: true },
              { size: '4L', labelAr: '4 لتر (جالون قياسي)', labelEn: '4 Liters (Gallon)', price: (product.basePrice || 48) * 3, inStock: true },
              { size: '18L', labelAr: '18 لتر (برميل كبير)', labelEn: '18 Liters (Drum)', price: (product.basePrice || 48) * 12, inStock: true },
            ],
        colors: product.colors ? [...product.colors] : [],
      });
    } else {
      setFormData({
        nameAr: '',
        nameEn: '',
        brand: 'جوتن (Jotun)',
        basePrice: 150,
        stock: 30,
        categoryId: categories[0]?.id || 'interior-paints',
        descriptionAr: '',
        descriptionEn: '',
        image: '/src/assets/images/interior_paint_bucket_1792392340490.jpg',
        sizes: [
          { size: '1L', labelAr: '1 لتر (علبة)', labelEn: '1 Liter', price: 48, inStock: true },
          { size: '4L', labelAr: '4 لتر (جالون قياسي)', labelEn: '4 Liters', price: 150, inStock: true },
          { size: '18L', labelAr: '18 لتر (برميل كبير)', labelEn: '18 Liters', price: 580, inStock: true },
        ],
        colors: [...SAUDI_POPULAR_COLORS],
        coverage: '12-14 م² / لتر',
        dryTime: 'ساعتان للجفاف السطحي',
        finish: 'حريري ناعم (Silk)',
        rating: 4.9,
        reviewsCount: 15,
        isBestSeller: true,
      });
    }
    setActiveTab('basic');
    setErrorMsg(null);
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddDefaultSaudiSizes = () => {
    const base = Number(formData.basePrice) || 50;
    const defaultSizes: ProductSize[] = [
      { size: '1L', labelAr: '1 لتر (علبة صغيرة)', labelEn: '1 Liter', price: Math.round(base * 0.35), inStock: true },
      { size: '4L', labelAr: '4 لتر (جالون قياسي)', labelEn: '4 Liters (Gallon)', price: base, inStock: true },
      { size: '9L', labelAr: '9 لتر (نصف برميل)', labelEn: '9 Liters', price: Math.round(base * 2.1), inStock: true },
      { size: '18L', labelAr: '18 لتر (برميل كبير)', labelEn: '18 Liters (Drum)', price: Math.round(base * 3.8), inStock: true },
    ];
    setFormData((prev) => ({ ...prev, sizes: defaultSizes }));
  };

  const handleAddChemicalSizes = () => {
    const base = Number(formData.basePrice) || 180;
    const kitSizes: ProductSize[] = [
      { size: 'Kit-5kg', labelAr: 'طقم 5 كجم (أساس + مقسي)', labelEn: '5kg Kit (Base + Hardener)', price: base, inStock: true },
      { size: 'Kit-20kg', labelAr: 'طقم 20 كجم كبير للمستودعات', labelEn: '20kg Large Kit', price: Math.round(base * 3.4), inStock: true },
    ];
    setFormData((prev) => ({ ...prev, sizes: kitSizes }));
  };

  const handleAddCustomSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSizeCode.trim() || !customSizeLabelAr.trim() || customSizePrice <= 0) return;

    const newSize: ProductSize = {
      size: customSizeCode.trim(),
      labelAr: customSizeLabelAr.trim(),
      labelEn: customSizeCode.trim(),
      price: Number(customSizePrice),
      inStock: true,
    };

    setFormData((prev) => ({
      ...prev,
      sizes: [...(prev.sizes || []), newSize],
    }));

    setCustomSizeCode('');
    setCustomSizeLabelAr('');
    setCustomSizePrice(0);
  };

  const handleRemoveSize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: (prev.sizes || []).filter((_, i) => i !== index),
    }));
  };

  const handleUpdateSizePrice = (index: number, newPrice: number) => {
    setFormData((prev) => {
      const updated = [...(prev.sizes || [])];
      if (updated[index]) {
        updated[index] = { ...updated[index], price: Number(newPrice) };
      }
      return { ...prev, sizes: updated };
    });
  };

  const handleToggleSizeStock = (index: number) => {
    setFormData((prev) => {
      const updated = [...(prev.sizes || [])];
      if (updated[index]) {
        updated[index] = { ...updated[index], inStock: !updated[index].inStock };
      }
      return { ...prev, sizes: updated };
    });
  };

  const handleAddCustomColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customColorNameAr.trim()) return;

    const newColor: ProductColor = {
      nameAr: customColorNameAr.trim(),
      nameEn: customColorNameAr.trim(),
      hex: customColorHex,
      code: customColorCode.trim() || `CLR-${Math.floor(100 + Math.random() * 900)}`,
    };

    setFormData((prev) => ({
      ...prev,
      colors: [...(prev.colors || []), newColor],
    }));

    setCustomColorNameAr('');
    setCustomColorCode('');
  };

  const handleRemoveColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: (prev.colors || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.nameAr?.trim()) {
      setErrorMsg('يرجى إدخال اسم الدهان بالعربية');
      setActiveTab('basic');
      return;
    }

    if (!formData.basePrice || Number(formData.basePrice) <= 0) {
      setErrorMsg('يرجى تحديد سعر أساسي صحيح للمنتج');
      setActiveTab('sizes');
      return;
    }

    const catObj = categories.find((c) => c.id === formData.categoryId) || categories[0];
    const baseP = Number(formData.basePrice);

    const finalSizes: ProductSize[] = (formData.sizes && formData.sizes.length > 0)
      ? formData.sizes
      : [
          { size: '1L', labelAr: '1 لتر', labelEn: '1 Liter', price: baseP, inStock: true },
          { size: '4L', labelAr: '4 لتر (جالون)', labelEn: '4 Liters', price: Math.round(baseP * 3), inStock: true },
        ];

    const finalProduct: Product = {
      id: formData.id || `p-${Date.now()}`,
      nameAr: formData.nameAr.trim(),
      nameEn: (formData.nameEn || formData.nameAr).trim(),
      categoryId: catObj?.id || 'interior-paints',
      categoryNameAr: catObj?.nameAr || 'دهانات عامة',
      categoryNameEn: catObj?.nameEn || 'General Paints',
      brand: (formData.brand || 'مركز المالك').trim(),
      descriptionAr: (formData.descriptionAr || '').trim(),
      descriptionEn: (formData.descriptionEn || '').trim(),
      image: (formData.image || '/src/assets/images/interior_paint_bucket_1792392340490.jpg').trim(),
      sizes: finalSizes,
      colors: formData.colors || [],
      basePrice: baseP,
      rating: formData.rating || 4.9,
      reviewsCount: formData.reviewsCount || 12,
      coverage: formData.coverage || '12-14 م² / لتر',
      dryTime: formData.dryTime || 'ساعتان للجفاف السطحي',
      finish: formData.finish || 'حريري ناعم (Silk)',
      isBestSeller: Boolean(formData.isBestSeller),
      isSpecialOffer: Boolean(formData.isSpecialOffer),
      discountPercent: formData.discountPercent ? Number(formData.discountPercent) : undefined,
      stock: Number(formData.stock ?? 30),
      isDemo: false,
    };

    setIsSubmitting(true);
    try {
      await onSave(finalProduct);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'حدث خطأ أثناء حفظ المنتج');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black">
                {formData.id ? 'تعديل وتحديث بيانات الصنف' : 'إضافة صنف دهان جديد للمتجر'}
              </h3>
              <p className="text-xs text-amber-300/90">
                {formData.id ? `معرف الصنف: ${formData.id}` : 'مركز المالك للدهانات - الطائف'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'basic' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>1. البيانات والتصنيف</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sizes')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'sizes' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>2. الأحجام والأسعار ({formData.sizes?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('colors')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'colors' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. الألوان والصبغات ({formData.colors?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'image' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
            <span>4. صورة المنتج</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'specs' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            <span>5. المواصفات والوصف</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
          {/* TAB 1: Basic Info */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    اسم صنف الدهان (بالعربية) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: دهان رويال فينوماستيك حريري"
                    value={formData.nameAr || ''}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    اسم الدهان (بالإنجليزية)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fenomastic Pure Silk Interior Paint"
                    value={formData.nameEn || ''}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    القسم / تصنيف الصنف <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoryId || categories[0]?.id}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameAr} ({c.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    العلامة التجارية / الشركة المصنعة
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: جوتن، الجزيرة، امريكي، سافيتو"
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                  {/* Quick brand selectors */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {COMMON_BRANDS.slice(0, 5).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setFormData({ ...formData, brand: b })}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700 font-bold transition-colors"
                      >
                        {b.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badges & Flags */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <p className="font-bold text-slate-800">شارات وتمييز الصنف في المتجر:</p>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isBestSeller)}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-950 focus:ring-blue-900"
                    />
                    <span className="font-bold text-slate-700">الأكثر طلباً ومبيعاً ⭐</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isSpecialOffer)}
                      onChange={(e) => setFormData({ ...formData, isSpecialOffer: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-950 focus:ring-blue-900"
                    />
                    <span className="font-bold text-slate-700">عرض خاص مخفض 🏷️</span>
                  </label>
                </div>

                {formData.isSpecialOffer && (
                  <div className="pt-2">
                    <label className="font-bold text-slate-700 block mb-1">نسبة الخصم (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={formData.discountPercent || 15}
                      onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                      className="w-32 bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono font-bold"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Sizes & Pricing */}
          {activeTab === 'sizes' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    السعر الأساسي يبدأ من (ر.س) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="150"
                    value={formData.basePrice || ''}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono font-black text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                  <span className="text-[10px] text-slate-500">هذا هو السعر الذي يظهر على بطاقة المنتج الرئيسية</span>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    المخزون المتوفر في مستودع الطائف
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="30"
                    value={formData.stock ?? 25}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                  <span className="text-[10px] text-slate-500">الكمية المتوفرة للطلب الفوري في المستودع</span>
                </div>
              </div>

              {/* Sizes List */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div>
                    <h4 className="font-black text-slate-900">الأحجام وسعر كل حجم</h4>
                    <p className="text-[11px] text-slate-500">يمكن للعميل اختيار الحجم المطلوب وتحديث السعر تلقائياً</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleAddDefaultSaudiSizes}
                      className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg text-[10px] font-bold transition-colors"
                    >
                      أحجام البويات القياسية (1L, 4L, 9L, 18L)
                    </button>
                    <button
                      type="button"
                      onClick={handleAddChemicalSizes}
                      className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[10px] font-bold transition-colors"
                    >
                      أطقم العوازل والإيبوكسي
                    </button>
                  </div>
                </div>

                {/* Table of sizes */}
                <div className="space-y-2">
                  {(formData.sizes || []).map((s, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-950 text-amber-400 font-mono font-bold rounded-md text-[11px]">
                          {s.size}
                        </span>
                        <span className="font-bold text-slate-800 text-xs">{s.labelAr}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <label className="text-[11px] text-slate-500">السعر:</label>
                          <input
                            type="number"
                            min="0"
                            value={s.price}
                            onChange={(e) => handleUpdateSizePrice(idx, Number(e.target.value))}
                            className="w-20 bg-slate-50 border border-slate-300 rounded-lg p-1 text-center font-mono font-bold text-xs"
                          />
                          <span className="text-[10px] text-slate-500">ر.س</span>
                        </div>

                        <label className="flex items-center gap-1 cursor-pointer text-[11px] font-bold text-slate-600">
                          <input
                            type="checkbox"
                            checked={s.inStock}
                            onChange={() => handleToggleSizeStock(idx)}
                            className="w-3.5 h-3.5 rounded text-emerald-600"
                          />
                          <span>متوفر</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemoveSize(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف هذا الحجم"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new size input row */}
                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="رمز الحجم (e.g. 1L, 4L, 20L)"
                    value={customSizeCode}
                    onChange={(e) => setCustomSizeCode(e.target.value)}
                    className="w-28 bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono font-bold"
                  />
                  <input
                    type="text"
                    placeholder="الوصف بالعربية (e.g. 4 لتر جالون)"
                    value={customSizeLabelAr}
                    onChange={(e) => setCustomSizeLabelAr(e.target.value)}
                    className="flex-1 min-w-[140px] bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold"
                  />
                  <input
                    type="number"
                    placeholder="السعر (ر.س)"
                    value={customSizePrice || ''}
                    onChange={(e) => setCustomSizePrice(Number(e.target.value))}
                    className="w-24 bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono font-bold text-center"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="px-3 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>إضافة حجم</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Colors & Tinting */}
          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                <div>
                  <h4 className="font-black text-slate-900">خيارات درجات الألوان وتجهيز الصبغات</h4>
                  <p className="text-[11px] text-slate-500">
                    يمكنك تمكين درجات الألوان التي يتم تلوينها آلياً بواسطة كمبيوتر الخلط بالمعرض
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, colors: [...SAUDI_POPULAR_COLORS] }))}
                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>إضافة درجات الألوان السعودية الشائعة (8 ألوان)</span>
                </button>
              </div>

              {/* Colors Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(formData.colors || []).map((clr, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-black/10 shadow-xs shrink-0"
                        style={{ backgroundColor: clr.hex }}
                      />
                      <div className="truncate">
                        <p className="font-bold text-slate-900 text-[11px] truncate">{clr.nameAr}</p>
                        <p className="text-[9px] text-slate-400 font-mono">{clr.code || clr.hex}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(idx)}
                      className="text-red-400 hover:text-red-600 p-1"
                      title="حذف هذا اللون"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Color */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-800 text-xs">إضافة لون وصبغة مخصصة:</p>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-2 py-1">
                    <input
                      type="color"
                      value={customColorHex}
                      onChange={(e) => setCustomColorHex(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="font-mono text-xs">{customColorHex}</span>
                  </div>

                  <input
                    type="text"
                    placeholder="اسم اللون بالعربية (e.g. أزرق فيروزي)"
                    value={customColorNameAr}
                    onChange={(e) => setCustomColorNameAr(e.target.value)}
                    className="flex-1 min-w-[140px] bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold"
                  />

                  <input
                    type="text"
                    placeholder="كود اللون (e.g. ALM-901)"
                    value={customColorCode}
                    onChange={(e) => setCustomColorCode(e.target.value)}
                    className="w-28 bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono font-bold"
                  />

                  <button
                    type="button"
                    onClick={handleAddCustomColor}
                    className="px-3 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>إضافة اللون</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Image Management */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Image Preview Card */}
                <div className="md:col-span-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <p className="font-bold text-slate-700 text-xs mb-3">معاينة الصورة الحالية للمنتج:</p>
                  <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-white border border-slate-300 shadow-sm relative group">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="w-10 h-10 mb-1" />
                        <span className="text-[11px]">لا توجد صورة محددة</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 truncate w-full" title={formData.image}>
                    {formData.image?.startsWith('data:') ? 'صورة مرفوعة من الجهاز' : formData.image}
                  </p>
                </div>

                {/* Upload & URL Inputs */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      رفع صورة من جهازك مباشرة (كمبيوتر / هاتف)
                    </label>
                    <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-blue-900/40 hover:border-blue-900 bg-blue-50/50 hover:bg-blue-50 rounded-2xl cursor-pointer transition-colors text-blue-950 font-bold text-xs">
                      <Upload className="w-5 h-5 text-amber-500" />
                      <span>اضغط لاختيار صورة من هاتفك أو جهازك</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      أو أدخل رابط الصورة (URL):
                    </label>
                    <input
                      type="text"
                      placeholder="https://example.com/paint.jpg أو /src/assets/..."
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono text-start"
                    />
                  </div>

                  {/* Preset library */}
                  <div>
                    <p className="font-bold text-slate-800 text-xs mb-2">أو اختر من مكتبة صور الدهانات الجاهزة عالية الدقة:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {PRESET_PAINT_IMAGES.map((preset, idx) => (
                        <div
                          key={idx}
                          onClick={() => setFormData({ ...formData, image: preset.url })}
                          className={`cursor-pointer rounded-xl overflow-hidden border p-1 text-center transition-all ${
                            formData.image === preset.url
                              ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-50/50'
                              : 'border-slate-200 hover:border-slate-400 bg-slate-50'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.titleAr}
                            className="w-full h-14 object-cover rounded-lg mb-1"
                            referrerPolicy="no-referrer"
                          />
                          <p className="text-[9px] font-bold text-slate-800 truncate">{preset.titleAr}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Specs & Description */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">معدل التغطية</label>
                  <input
                    type="text"
                    placeholder="مثال: 12-14 م² / لتر"
                    value={formData.coverage || ''}
                    onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">زمن الجفاف</label>
                  <input
                    type="text"
                    placeholder="مثال: ساعتان للجفاف السطحي"
                    value={formData.dryTime || ''}
                    onChange={(e) => setFormData({ ...formData, dryTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">اللمسة النهائية (Sheen)</label>
                  <input
                    type="text"
                    placeholder="مثال: حريري ناعم، مطفي، نصف لمعة"
                    value={formData.finish || ''}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">وصف المنتج ومميزاته بالعربية</label>
                <textarea
                  rows={3}
                  placeholder="اكتب وصفاً جذاباً يشمل قابلية الغسيل، مقاومة البقع، الاستخدام الداخلي أو الخارجي..."
                  value={formData.descriptionAr || ''}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">وصف المنتج بالإنجليزية (اختياري)</label>
                <textarea
                  rows={2}
                  placeholder="English product description and benefits..."
                  value={formData.descriptionEn || ''}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500 font-bold">
              {activeTab === 'basic' && 'الخطوة 1 من 5: البيانات والتصنيف'}
              {activeTab === 'sizes' && 'الخطوة 2 من 5: تحديد الأحجام والأسعار'}
              {activeTab === 'colors' && 'الخطوة 3 من 5: ألوان وصبغات الدهان'}
              {activeTab === 'image' && 'الخطوة 4 من 5: صورة وعرض المنتج'}
              {activeTab === 'specs' && 'الخطوة 5 من 5: المواصفات والوصف'}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-950 to-blue-900 hover:from-blue-900 hover:to-blue-850 text-white rounded-xl font-black shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>جاري الحفظ...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>{formData.id ? 'حفظ وتحديث الصنف' : 'إضافة الصنف الآن للمتجر'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
