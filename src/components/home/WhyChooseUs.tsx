import React from 'react';
import { ShieldCheck, BadgePercent, Truck, Palette, Sparkles, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const WhyChooseUs: React.FC = () => {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: Award,
      title: t('feature1Title'),
      desc: t('feature1Desc'),
      color: 'text-amber-500 bg-amber-50 border-amber-200',
    },
    {
      icon: BadgePercent,
      title: t('feature2Title'),
      desc: t('feature2Desc'),
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      icon: Truck,
      title: t('feature3Title'),
      desc: t('feature3Desc'),
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      icon: Palette,
      title: t('feature4Title'),
      desc: t('feature4Desc'),
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-3 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'ar' ? 'الجودة والموثوقية عنواننا' : 'Quality & Trust'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            {t('whyChooseTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {language === 'ar'
              ? 'خبرة تمتد لسنوات في خدمة مقاولي وأهالي الطائف بأفضل حلول الدهانات والعوازل والديكور'
              : 'Decades of experience delivering top architectural coatings and waterproofing in Taif'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-amber-600">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'ضمان رسمي معتمد' : 'Certified Assurance'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
