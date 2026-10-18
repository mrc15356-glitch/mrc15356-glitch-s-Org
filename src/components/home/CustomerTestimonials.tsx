import React from 'react';
import { Star, Quote, MapPin, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { CUSTOMER_TESTIMONIALS } from '../../data/mockData';

export const CustomerTestimonials: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-16 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3 border border-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{language === 'ar' ? 'تجارب عملائنا في الطائف' : 'Customer Reviews in Taif'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            {language === 'ar' ? 'ماذا يقول عملاؤنا عن خدماتنا؟' : 'What Our Customers Say'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === 'ar'
              ? 'نفخر بخدمة آلاف المنازل والمشاريع والمقاولين في مختلف أحياء مدينة الطائف'
              : 'Proudly serving homeowners, decorators, and contractors across Taif'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CUSTOMER_TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <Quote className="w-6 h-6 text-slate-300 mb-2" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{language === 'ar' ? item.commentAr : item.commentEn}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {language === 'ar' ? item.authorAr : item.authorEn}
                  </h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span>{language === 'ar' ? item.districtAr : item.districtEn}</span>
                  </p>
                </div>

                <span className="text-[10px] text-slate-400 font-medium">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
