import React from 'react';
import { X, ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';

export const PolicyModal: React.FC = () => {
  const { t, language } = useLanguage();
  const { activePolicy, setActivePolicy, settings } = useShop();

  if (!activePolicy) return null;

  const getPolicyContent = () => {
    switch (activePolicy) {
      case 'privacy':
        return {
          title: language === 'ar' ? 'سياسة الخصوصية وسرية البيانات' : 'Privacy & Data Protection Policy',
          icon: ShieldCheck,
          bodyAr: (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <p>
                نحن في <strong>{settings.shopNameAr}</strong> بالطائف نقدر خصوصية عملائنا ونلتزم بحماية بياناتهم الشخصية وفقاً للأنظمة واللوائح المعمول بها في المملكة العربية السعودية.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">1. البيانات التي نجمعها</h4>
              <p>
                نجمع فقط البيانات الضرورية لتنفيذ وتوصيل طلبات الدهانات، وتشمل: الاسم، رقم الجوال للتواصل وتنسيق التسليم، العنوان التفصيلي أو رابط الموقع الجغرافي داخل مدينة الطائف، والمنتجات والألوان المحددة.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. استخدام البيانات</h4>
              <p>
                تُستخدم البيانات فقط لغرض: تجهيز مواد الدهانات ورشات البروفايل، تنسيق موعد التسليم مع مندوب التوصيل، إصدار الفاتورة الضريبية بالرقم الضريبي ({settings.taxNumber})، وتقديم خدمة ما بعد البيع والاستشارات اللونية.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. حماية وسرية المعلومات</h4>
              <p>
                نلتزم بعدم بيع أو مشاركة بيانات العملاء مع أي طرف ثالث غير معني بتنفيذ عملية الشحن والتوصيل. جميع البيانات مخزنة بشكل آمن ومشفر.
              </p>
            </div>
          ),
          bodyEn: (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <p>
                At <strong>{settings.shopNameEn}</strong> in Taif, we take customer privacy seriously in compliance with applicable Saudi data privacy regulations.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">1. Information We Collect</h4>
              <p>
                We collect essential contact information including full name, Saudi mobile number, district delivery address in Taif, and purchased paint specifications.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. Use of Information</h4>
              <p>
                Your data is strictly utilized for paint formulation, dispatch coordination, issuing certified VAT invoices (VAT ID: {settings.taxNumber}), and client support.
              </p>
            </div>
          ),
        };

      case 'terms':
        return {
          title: language === 'ar' ? 'الشروط والأحكام العامة للتعامل' : 'Terms and Conditions',
          icon: FileText,
          bodyAr: (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <h4 className="font-bold text-slate-900 text-sm">1. مقدمة</h4>
              <p>
                تحكم هذه الشروط عمليات الشراء وحجز الطلبات عبر موقع مركز المالك للدهانات في مدينة الطائف، شارع البحرين.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. الأسعار والضريبة</h4>
              <p>
                جميع الأسعار المعروضة بالريال السعودي (SAR / ر.س) وتشمل ضريبة القيمة المضافة المقررة نظاماً بنسبة 15%. يتم إصدار فاتورة ضريبية رسمية لكل طلب.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. دقة الألوان والخلط بالكمبيوتر</h4>
              <p>
                يتم خلط الألوان بدقة عالية باستخدام أحدث أجهزة التلوين بالكمبيوتر وفق أكواد الشركات الرسمية (جوتن، الجزيرة، وغيرها). قد تختلف درجة اللون قليلاً عن شاشات الجوال بحسب درجة الإضاءة ونوع السطح، وننصح دائماً بتجربة عينة 1 لتر على الجدار الفعلي.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">4. إرسال الطلب عبر الواتساب</h4>
              <p>
                إرسال الطلب عبر الواتساب أو الموقع هو لحجز وتجهيز المواد ولا يعتبر سداداً نهائياً أو ضمان تسليم حتى يتم تأكيد ذلك من قبل إدارة المحل.
              </p>
            </div>
          ),
          bodyEn: (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <h4 className="font-bold text-slate-900 text-sm">1. Introduction</h4>
              <p>
                These terms govern browsing, reservations, and orders placed with Markaz Almalak Paint Shop on Bahrain Street, Taif.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. Pricing & VAT</h4>
              <p>
                All prices are in Saudi Riyals (SAR) and include 15% Saudi VAT. A certified invoice is provided with every order.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. WhatsApp Order Confirmation</h4>
              <p>
                Transmitting order summaries via WhatsApp facilitates material preparation and scheduling; final confirmation occurs upon customer service verification.
              </p>
            </div>
          ),
        };

      case 'delivery':
        return {
          title: language === 'ar' ? 'سياسة التوصيل والشحن داخل الطائف' : 'Taif Shipping & Delivery Policy',
          icon: Truck,
          bodyAr: (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <h4 className="font-bold text-slate-900 text-sm">1. نطاق التوصيل</h4>
              <p>
                نغطي التوصيل السريع لكافة أحياء ومخططات مدينة الطائف (الشهداء، شهار، الحوية، الخالدية، الوسام، مسرة، الحلقة، الريان، الفيصلية، وطرق الشفا والهدا).
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. الرسوم والتوصيل المجاني</h4>
              <p>
                رسوم التوصيل القياسية داخل الطائف هي {settings.deliveryFee} ر.س. ونقدم <strong>توصيل مجاني</strong> لكافة الطلبات التي تتجاوز قيمتها {settings.freeDeliveryThreshold} ر.س.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. مواعيد التوصيل والاستلام</h4>
              <p>
                يتم التوصيل عادةً في نفس اليوم أو خلال 24 ساعة كحد أقصى حسب وقت تأكيد الطلب وحجم كميات رشة البروفايل أو خلط الألوان. كما يتاح خيار الاستلام الفوري والمجاني من فرعنا بشارع البحرين بعد شركة زين.
              </p>
            </div>
          ),
          bodyEn: (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <h4 className="font-bold text-slate-900 text-sm">1. Delivery Coverage</h4>
              <p>
                Prompt delivery across all Taif districts (Ash Shuhada, Shehar, Al-Hawiyah, Al-Khalidiyah, etc.).
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. Fees & Free Delivery Threshold</h4>
              <p>
                Standard delivery within Taif is {settings.deliveryFee} SAR. Orders exceeding {settings.freeDeliveryThreshold} SAR qualify for <strong>Free Delivery</strong>.
              </p>
            </div>
          ),
        };

      case 'return':
        return {
          title: language === 'ar' ? 'سياسة الاسترجاع والاستبدال والخلط' : 'Return, Exchange & Tinting Policy',
          icon: RotateCcw,
          bodyAr: (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <h4 className="font-bold text-slate-900 text-sm">1. المنتجات غير المخلطة (الأصناف القياسية)</h4>
              <p>
                يحق للعميل استبدال أو استرجاع علب ودهانات الأساس والأدوات غير المفتوحة والتي بحالتها الأصلية خلال 7 أيام من تاريخ الاستلام بموجب الفاتورة الرسمية.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. الدهانات المخلطة برغبة العميل (Custom Tinted)</h4>
              <p>
                الدهانات ورشات البروفايل التي يتم تلوينها أو خلطها بالكمبيوتر خصيصاً بناءً على طلب العميل واختياره لكود معين لا تقبل الاسترجاع أو الاستبدال بعد بدء عملية التلوين وفقاً للائحة وزارة التجارة السعودية لحماية المستهلك للمنتجات المصنعة بمواصفات خاصة.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. عيوب التصنيع أو التلف أثناء النقل</h4>
              <p>
                في حال وجود أي تلف ناتج عن التوصيل أو عيب مصنعي، يتم استبدال المنتج فوراً على حساب المحل وبدون أي تكلفة إضافية على العميل.
              </p>
            </div>
          ),
          bodyEn: (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <h4 className="font-bold text-slate-900 text-sm">1. Standard Unopened Products</h4>
              <p>
                Unopened standard primers, base coats, and accessories in original condition may be returned or exchanged within 7 days with invoice proof.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. Custom Tinted Paints</h4>
              <p>
                Paints specifically tinted or mixed to order according to customer color codes are non-returnable and non-refundable once mixed, in line with Ministry of Commerce special-order regulations.
              </p>
            </div>
          ),
        };

      default:
        return null;
    }
  };

  const policy = getPolicyContent();
  if (!policy) return null;

  const Icon = policy.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="p-5 bg-gradient-to-r from-blue-950 to-indigo-950 text-white flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm sm:text-base">{policy.title}</h3>
          </div>
          <button
            onClick={() => setActivePolicy(null)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {language === 'ar' ? policy.bodyAr : policy.bodyEn}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setActivePolicy(null)}
            className="px-5 py-2 bg-blue-950 text-white rounded-xl text-xs font-bold hover:bg-blue-900 transition-colors"
          >
            {language === 'ar' ? 'إغلاق ومتابعة التصفح' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
