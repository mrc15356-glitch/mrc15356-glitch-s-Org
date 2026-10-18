import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  ExternalLink,
  Send,
  Navigation,
  CheckCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';

export const LocationAndContact: React.FC = () => {
  const { t, language } = useLanguage();
  const { settings } = useShop();

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('profile');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  const saudiPhone = cleanPhone.startsWith('0') ? '966' + cleanPhone.slice(1) : cleanPhone;

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;

    const message =
      language === 'ar'
        ? `*استفسار جديد من موقع مركز المالك للدهانات بالطائف:*\n` +
          `• *الاسم:* ${inquiryName}\n` +
          `• *رقم الجوال:* ${inquiryPhone}\n` +
          `• *نوع الاستفسار:* ${inquiryType}\n` +
          `• *الرسالة والتفاصيل:* ${inquiryMessage || 'لا توجد ملاحظات إضافية'}`
        : `*New Website Inquiry for Markaz Almalak Taif:*\n` +
          `• Name: ${inquiryName}\n` +
          `• Phone: ${inquiryPhone}\n` +
          `• Type: ${inquiryType}\n` +
          `• Details: ${inquiryMessage || 'N/A'}`;

    window.open(`https://wa.me/${saudiPhone}?text=${encodeURIComponent(message)}`, '_blank');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Shop Location & Working Hours Info (Left/Right) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold mb-2 border border-blue-200">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'ar' ? 'مقرنا الرئيسي في الطائف' : 'Our Taif Headquarters'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                {language === 'ar' ? 'تفضل بزيارتنا أو تواصل مباشرة' : 'Visit Our Store or Contact Us'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {language === 'ar'
                  ? 'يسعدنا استقبالكم في فرعنا بالطائف لتنسيق الألوان وتجهيز رشة البروفايل ومطابقة الخلطات على الكمبيوتر'
                  : 'Welcome to our showroom in Taif for exact color matching, sample swatches, and immediate supplies'}
              </p>
            </div>

            {/* Address Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'ar' ? 'العنوان الوطني المعتمد:' : 'Verified National Address:'}
                  </h4>
                  <p className="text-base font-black text-slate-950">
                    2936 Hassan Ibn Thabit | 2936 حسان بن ثابت
                  </p>
                  <p className="text-xs font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-md inline-block">
                    TAAG2936, 8733، حي الشهداء الشمالية، At Taif 26513
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    {language === 'ar' ? 'شارع البحرين - بعد شركة زين مباشرة' : 'Bahrain St - Directly after Zain'}
                  </p>
                  <div className="pt-1 flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded">
                      الإحداثيات: 21.267656, 40.417657
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('21.267656, 40.417657');
                        alert(language === 'ar' ? 'تم نسخ الإحداثيات (21.267656, 40.417657)' : 'Coordinates copied!');
                      }}
                      className="text-[11px] text-blue-900 font-sans underline hover:text-amber-600"
                    >
                      {language === 'ar' ? 'نسخ الإحداثيات' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Working hours */}
              <div className="flex items-start gap-3 pt-3 border-t border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">
                    {language === 'ar' ? 'أوقات العمل واستقبال الطلبات:' : 'Operating Hours:'}
                  </h4>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {settings.workingHoursAr}
                  </p>
                </div>
              </div>

              {/* Tax & Commercial verification */}
              <div className="flex items-start gap-3 pt-3 border-t border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">
                    {t('taxNumberLabel')}:
                  </h4>
                  <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                    {settings.taxNumber}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <a
                  href="https://www.google.com/maps?q=21.267656,40.417657"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <MapPin className="w-4 h-4 text-slate-950" />
                  <span>{language === 'ar' ? 'فتح موقع المحل على خرائط Google' : 'Open in Google Maps'}</span>
                </a>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=21.267656,40.417657"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
                >
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ar' ? 'الاتجاهات والملاحة' : 'Get Directions'}</span>
                </a>
                <a
                  href={`tel:${settings.phone}`}
                  className="px-3.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-4 h-4 text-slate-700" />
                  <span>{settings.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${saudiPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساب</span>
                </a>
              </div>
            </div>

            {/* Real Interactive Google Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-md relative h-64 bg-slate-100 flex flex-col justify-end group">
              <iframe
                title="Markaz Almalak Paint Shop Location"
                src="https://maps.google.com/maps?q=21.267656,40.417657&z=17&output=embed"
                className="w-full h-full border-0 absolute inset-0"
                loading="lazy"
                allowFullScreen
              />
              <div className="relative z-10 bg-slate-950/85 backdrop-blur-xs p-3 flex flex-wrap items-center justify-between gap-2 text-white border-t border-white/10">
                <div className="text-xs">
                  <p className="font-bold flex items-center gap-1.5 text-amber-400">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>2936 حسان بن ثابت، حي الشهداء الشمالية</span>
                  </p>
                  <p className="text-[10px] text-slate-300 font-mono">21.267656, 40.417657 • الطائف 26513</p>
                </div>
                <a
                  href="https://www.google.com/maps?q=21.267656,40.417657"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <span>{language === 'ar' ? 'فتح في تطبيق خرائط Google' : 'Open in Google Maps'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Inquiry / Quotation Booking Form */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-400/40">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase text-amber-400">
                {language === 'ar' ? 'طلب تسعيرة أو استشارة' : 'Price Quotation'}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {language === 'ar' ? 'احصل على عرض سعر لمشروعك' : 'Request Paint Project Quote'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'ar'
                  ? 'أدخل بياناتك وسيتواصل معك فني مركز المالك لتقديم أفضل أسعار الجملة والتجزئة'
                  : 'Submit your contact info and our technical team will coordinate immediately'}
              </p>
            </div>

            <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'ar' ? 'مثال: أبو محمد العتيبي' : 'Your name'}
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {t('phone')} *
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="05XXXXXXXX"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-start"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {language === 'ar' ? 'نوع الدهانات المطلوبة:' : 'Interested in:'}
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="رشة بروفايل واجهات خارجية">رشة بروفايل واجهات خارجية للفلل والعمائر</option>
                  <option value="دهانات جدران داخلية وحريرية">دهانات جدران داخلية وحريرية ومطفية</option>
                  <option value="الدهانات الديكورية وورق الحائط">دهانات ديكورية وفلفت وورق حائط</option>
                  <option value="عوازل أسطح وخزانات مياه">عوازل أسطح وخزانات مائية وحرارية</option>
                  <option value="دهانات صناعية وإيبوكسي">دهانات صناعية وإيبوكسي أرضيات</option>
                  <option value="أدوات ومستلزمات دهان">أدوات، معجون، وسلالم دهانات</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {language === 'ar' ? 'المساحة التقديرية أو الملاحظات:' : 'Estimated Area or Notes:'}
                </label>
                <textarea
                  rows={3}
                  placeholder={language === 'ar' ? 'مثال: فيلا دورين في حي الحوية، أحتاج رشة بروفايل مع جوتن داخلي...' : 'e.g. 2-story villa in Taif, need exterior profile...'}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'ar' ? 'إرسال الاستفسار عبر الواتساب' : 'Send Inquiry to Shop WhatsApp'}</span>
              </button>

              {sentSuccess && (
                <div className="p-2.5 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded-xl flex items-center gap-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === 'ar' ? 'تم تجهيز الرسالة وفتح الواتساب!' : 'Opening WhatsApp with your request!'}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
