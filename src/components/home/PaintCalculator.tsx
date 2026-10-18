import React, { useState } from 'react';
import { Calculator, Check, Info, Sparkles, ShoppingBag, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';

export const PaintCalculator: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const { setActivePage, setSelectedCategory } = useShop();

  const [length, setLength] = useState<number>(5);
  const [width, setWidth] = useState<number>(4);
  const [height, setHeight] = useState<number>(3);
  const [coats, setCoats] = useState<number>(2);
  const [deductions, setDeductions] = useState<number>(6); // doors & windows m²
  const [paintType, setPaintType] = useState<'smooth' | 'profile'>('smooth'); // smooth: 13m²/L, profile: 1.5m²/kg or ~7m²/drum

  // Calculation logic
  // Perimeter = 2 * (length + width)
  // Gross wall area = Perimeter * height
  const perimeter = 2 * (Number(length) + Number(width));
  const grossArea = Math.max(0, perimeter * Number(height));
  const netArea = Math.max(0, grossArea - Number(deductions));

  // Coverage: smooth paint ~13m²/L per coat, profile ~0.4m²/L or 7m² per 18L drum
  const coverageRate = paintType === 'smooth' ? 13 : 0.45; // m² per liter/unit
  const totalLitersNeeded = paintType === 'smooth'
    ? Math.ceil((netArea * Number(coats)) / coverageRate)
    : Math.ceil((netArea) / 7) * 18; // Profile drums

  const gallons4L = Math.ceil(totalLitersNeeded / 4);
  const drums18L = Math.ceil(totalLitersNeeded / 18);
  const primerLiters = Math.ceil(netArea / 12); // 1 coat primer

  const handleReset = () => {
    setLength(5);
    setWidth(4);
    setHeight(3);
    setCoats(2);
    setDeductions(6);
  };

  return (
    <section className="py-16 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold mb-3 border border-blue-200">
            <Calculator className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'ar' ? 'أداة تقديرية مجانية لعملاء الطائف' : 'Free Paint Estimation Tool'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            {t('calcTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            {t('calcSubtitle')}
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>{language === 'ar' ? 'أبعاد الغرفة أو الواجهة' : 'Room & Wall Dimensions'}</span>
              </h3>
              <button
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-blue-900 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
              </button>
            </div>

            {/* Paint Style Toggle */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                {language === 'ar' ? 'نوع الدهان المطلوب حسابه:' : 'Select Paint Type:'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaintType('smooth')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    paintType === 'smooth'
                      ? 'border-blue-900 bg-blue-50 text-blue-950 shadow-xs ring-1 ring-blue-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  🏡 {language === 'ar' ? 'دهان جدران داخلية ناعم / حريري' : 'Smooth Interior Paint'}
                </button>
                <button
                  type="button"
                  onClick={() => setPaintType('profile')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    paintType === 'profile'
                      ? 'border-blue-900 bg-blue-50 text-blue-950 shadow-xs ring-1 ring-blue-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  🧱 {language === 'ar' ? 'رشة بروفايل واجهات محببة' : 'Exterior Textured Profile'}
                </button>
              </div>
            </div>

            {/* Inputs: Length, Width, Height */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('roomLength')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={length}
                    onChange={(e) => setLength(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                  <span className="absolute end-3 top-2.5 text-xs text-slate-400 font-mono">م</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('roomWidth')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={width}
                    onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                  <span className="absolute end-3 top-2.5 text-xs text-slate-400 font-mono">م</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('roomHeight')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    step="0.2"
                    value={height}
                    onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                  <span className="absolute end-3 top-2.5 text-xs text-slate-400 font-mono">م</span>
                </div>
              </div>
            </div>

            {/* Additional parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('coatsCount')}
                </label>
                <select
                  value={coats}
                  onChange={(e) => setCoats(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                >
                  <option value={1}>وجه واحد (للتجديد السريع)</option>
                  <option value={2}>وجهان (الموصى به لتشطيب مثالي)</option>
                  <option value={3}>3 أوجه (للتغطية العميقة وتغيير اللون)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('doorsWindows')}
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="1"
                  value={deductions}
                  onChange={(e) => setDeductions(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <p className="font-bold mb-0.5">
                  {language === 'ar' ? 'نصيحة فنيي مركز المالك للدهانات بالطائف:' : 'Taif Expert Recommendation:'}
                </p>
                <p>
                  {language === 'ar'
                    ? 'في جدران اللياسة الجديدة أو عند الرغبة في ثبات دهانات الجدران لسنوات أطول، احرص على تطبيق وجه برايمر أساس مائي عازل قبل الدهان، واحتساب 10% احتياط للفواقد والزوايا.'
                    : 'Always apply a primer sealer coat on fresh plaster to equalize suction, and reserve ~10% contingency.'}
                </p>
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-400/40 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-amber-400">
                  {language === 'ar' ? 'نتائج الحساب التقديري' : 'Calculated Output'}
                </span>
                <h4 className="text-lg font-bold text-white">
                  {language === 'ar' ? 'الكميات المقترحة لمشروعك' : 'Suggested Paint Volume'}
                </h4>
              </div>
              <span className="text-2xl">📊</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <p className="text-slate-400 text-[11px]">{t('calcResultTotalArea')}</p>
                <p className="text-lg font-black text-white mt-1">
                  {grossArea.toFixed(1)} <span className="text-xs font-normal">م²</span>
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <p className="text-slate-400 text-[11px]">{t('calcResultNetArea')}</p>
                <p className="text-lg font-black text-amber-400 mt-1">
                  {netArea.toFixed(1)} <span className="text-xs font-normal">م²</span>
                </p>
              </div>
            </div>

            {/* Highlight: Liters & Gallons */}
            <div className="bg-gradient-to-r from-amber-400/20 to-amber-500/10 rounded-2xl p-5 border border-amber-400/40 space-y-3">
              <p className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t('calcResultLiters')}:</span>
              </p>
              
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                  {totalLitersNeeded}
                </span>
                <span className="text-sm font-bold text-amber-300">
                  {language === 'ar' ? 'لتر تقريباً' : 'Liters approx.'}
                </span>
              </div>

              {/* Equivalence in cans */}
              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>{gallons4L} {t('calcResultGallons')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>{drums18L} {t('calcResultDrums')}</span>
                </div>
              </div>
            </div>

            {/* Primer recommendation */}
            <div className="text-xs text-slate-300 bg-white/5 rounded-xl p-3 border border-white/5 space-y-1">
              <p className="font-bold text-white flex items-center gap-1">
                <span>🛡️ الأساس الموصى به:</span>
                <span className="text-amber-400 font-mono">{primerLiters} لتر</span>
              </p>
              <p className="text-[11px] text-slate-400">{t('calcRecommendation')}</p>
            </div>

            {/* Action to shop suitable paints */}
            <button
              onClick={() => {
                setSelectedCategory(paintType === 'smooth' ? 'interior-paints' : 'exterior-paints');
                setActivePage('shop');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{language === 'ar' ? 'تصفح وشراء الدهانات المناسبة لهذه المساحة' : 'Browse Suitable Paints for This Area'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
