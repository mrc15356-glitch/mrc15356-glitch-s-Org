import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  dir: 'rtl' | 'ltr';
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Brand
    shopName: 'مركز المالك للدهانات',
    tagline: 'رشات داخلية وخارجية - ورق حائط',
    heroTagline: 'دهانات عالية الجودة لمساحات أجمل',
    taxNumberLabel: 'الرقم الضريبي',
    vatIncluded: 'الأسعار شاملة ضريبة القيمة المضافة 15%',
    vat: 'ضريبة القيمة المضافة (15%)',
    currency: 'ر.س',
    taifLocation: '2936 حسان بن ثابت، TAAG2936, 8733، حي الشهداء الشمالية، الطائف 26513 (شارع البحرين بعد شركة زين مباشرة)',

    // Nav
    home: 'الرئيسية',
    products: 'المنتجات والدهانات',
    categories: 'أقسام المنتجات',
    calculator: 'حاسبة كمية الدهان',
    offers: 'عروض وتخفيضات',
    whyUs: 'لماذا تختارنا',
    trackOrder: 'تتبع طلبك',
    contactUs: 'تواصل معنا',
    adminLogin: 'لوحة التحكم',
    cart: 'سلة المشتريات',
    demoNotice: 'بيانات تجريبية لأغراض العرض حتى اعتماد الكتالوج الفعلي',

    // Hero
    shopNow: 'تسوق الآن',
    bookOrder: 'احجز طلبك الآن',
    calculatePaints: 'احسب كمية الدهان',
    heroBadge1: 'أصناف أصلية 100%',
    heroBadge2: 'توصيل سريع بالطائف',
    heroBadge3: 'خلط ألوان كمبيوتر دقيق',
    heroBadge4: 'فاتورة ضريبية معتمدة',

    // Featured Categories
    browseCategories: 'تصفح حسب قسم الدهانات',
    categoriesSubtitle: 'جميع مستلزمات التشطيب والتجديد من الأساس حتى اللمسات الأخيرة',
    viewAllProducts: 'عرض جميع المنتجات',
    exploreCategory: 'استعراض القسم',

    // Products & Shop
    allCategories: 'جميع الأقسام',
    allBrands: 'جميع الشركات',
    filterByPrice: 'تصفية بالسعر',
    sortBy: 'ترتيب حسب',
    sortDefault: 'المقترح والأكثر طلباً',
    sortPriceLow: 'السعر: من الأقل للأعلى',
    sortPriceHigh: 'السعر: من الأعلى للأقل',
    sortRating: 'التقييم الأعلى',
    searchPlaceholder: 'ابحث عن اسم الدهان، الشركة، أو الكود (مثل: جوتن، بروفايل، عازل...)',
    size: 'المقاس',
    color: 'اللون المقترح',
    customColor: 'أو حدد درجة مخصصة',
    quantity: 'الكمية',
    addToCart: 'إضافة إلى السلة',
    orderNow: 'اطلب الآن مباشرة',
    orderViaWhatsApp: 'طلب فوري عبر الواتساب',
    inStock: 'متوفر في المحل',
    outOfStock: 'غير متوفر حالياً',
    coverage: 'معدل التغطية',
    dryTime: 'وقت الجفاف',
    finishType: 'نوع التشطيب',
    demoTag: 'بيانات تجريبية',
    productDetails: 'تفاصيل ومواصفات المنتج',

    // Paint Calculator
    calcTitle: 'حاسبة كمية الدهان التقديرية',
    calcSubtitle: 'احسب عدد اللترات أو الجوالين التي تحتاجها لغرفتك أو واجهتك بدقة وبضغطة زر واحدة',
    roomLength: 'طول الغرفة أو الجدار (متر)',
    roomWidth: 'عرض الغرفة (متر)',
    roomHeight: 'ارتفاع السقف (متر)',
    coatsCount: 'عدد الأوجه (الطبقات)',
    doorsWindows: 'خصم الأبواب والنوافذ (متر مربع تقريبي)',
    calculateBtn: 'احسب الكمية الآن',
    calcResultTotalArea: 'إجمالي مساحة الجدران',
    calcResultNetArea: 'المساحة الفعلية للدهان',
    calcResultLiters: 'الكمية المطلوبة تقريباً',
    calcResultGallons: 'جالون (4 لتر)',
    calcResultDrums: 'برميل (18 لتر)',
    calcRecommendation: 'ننصح بشراء جالون أساس (برايمر) لضمان ثبات اللون وقوة الالتصاق.',

    // Why Choose Us
    whyChooseTitle: 'لماذا يختار أهالي الطائف مركز المالك للدهانات؟',
    feature1Title: 'ماركات سعودية وعالمية معتمدة',
    feature1Desc: 'وكلاء وموزعون لأفضل الشركات كجوتن والجزيرة وناشيونال وسافيتو بضمان الجودة.',
    feature2Title: 'أسعار جملة وقطاعي تنافسية',
    feature2Desc: 'نضمن لك أفضل سعر في سوق الطائف لمشاريع الفلل والعمارات ومقاولي التشطيب.',
    feature3Title: 'توصيل سريع واستلام فوري',
    feature3Desc: 'خدمة التوصيل لكافة أحياء الطائف أو الاستلام المباشر من فرعنا بشارع البحرين.',
    feature4Title: 'استشارات واختيار ألوان مجاناً',
    feature4Desc: 'فريقنا الخبير يساعدك في مطابقة الأكواد وحساب الكميات بدقة لمنع الهدر.',

    // Cart
    cartEmpty: 'سلة مشترياتك فارغة حالياً',
    cartEmptyDesc: 'تصفح تشكيلتنا المميزة من الدهانات ورشات البروفايل وأضف ما يناسبك',
    subtotal: 'المجموع الفرعي',
    deliveryFee: 'رسوم التوصيل',
    freeDelivery: 'توصيل مجاني',
    freeDeliveryNote: 'توصيل مجاني للطلبات فوق 450 ر.س في الطائف',
    total: 'المبلغ الإجمالي',
    proceedCheckout: 'متابعة حجز الطلب',
    clearCart: 'تفريغ السلة',
    sendCartWhatsApp: 'إرسال تفاصيل السلة عبر الواتساب',

    // Checkout
    checkoutTitle: 'حجز وإتمام الطلب',
    customerInfo: 'بيانات العميل والتوصيل',
    fullName: 'الاسم الكامل',
    phone: 'رقم الجوال (سعودي)',
    whatsappNumber: 'رقم الواتساب للتنسيق',
    deliveryMethod: 'طريقة الاستلام',
    homeDelivery: 'توصيل لموقعك في الطائف (25 ر.س)',
    storePickup: 'استلام مباشر من المحل (مجاناً - شارع البحرين)',
    district: 'الحي في الطائف',
    addressDetails: 'العنوان التفصيلي (الشارع، المعلم، رقم المبنى)',
    mapsLink: 'رابط خرائط جوجل (اختياري لتسهيل وصول المندوب)',
    preferredTime: 'الوقت المفضل للتوصيل / الاستلام',
    notesPlaceholder: 'أي ملاحظات خاصة بالتعتيق أو خلط اللون أو أوقات التواجد...',
    paymentMethod: 'طريقة الدفع',
    cod: 'الدفع عند الاستلام (كاش أو شبكة مدى مع المندوب)',
    bankTransfer: 'تحويل بنكي مباشر (الراجحي / الأهلي)',
    onlineCard: 'بطاقة مدى / فيزا / أبل باي (بوابة دفع إلكترونية)',
    bankDetailsTitle: 'بيانات الحساب البنكي للتحويل:',
    orderSummary: 'ملخص الطلب',
    submitOrder: 'تأكيد وحجز الطلب الآن',
    submitting: 'جاري تأكيد الطلب...',
    whatsappDisclaimer: 'ملاحظة: إرسال الطلب عبر الواتساب أو الموقع هو لحجز وتجهيز المواد ولا يعتبر سداداً نهائياً حتى يتم تأكيد ذلك من قبل إدارة المحل.',

    // Order Confirmation
    orderSuccessTitle: 'تم تسجيل طلبك بنجاح!',
    orderSuccessSubtitle: 'شكراً لثقتكم بمركز المالك للدهانات بالطائف. سنتواصل معكم فوراً لتأكيد التجهيز والتوصيل.',
    orderRef: 'رقم مرجع الطلب',
    trackOrderBtn: 'تتبع حالة طلبك الآن',
    printInvoice: 'طباعة الفاتورة الضريبية',
    sendOrderWhatsAppBtn: 'مشاركة تفاصيل الطلب عبر الواتساب',
    returnHome: 'العودة للرئيسية',

    // Order Tracking
    trackTitle: 'تتبع حالة طلبك',
    trackSubtitle: 'أدخل رقم المرجع ورقم الجوال لمعرفة حالة تجهيز الدهانات والتوصيل',
    orderNumberPlaceholder: 'رقم الطلب (مثال: MALAK-2026-XXXX)',
    phonePlaceholder: 'رقم الجوال المسجل في الطلب',
    checkStatusBtn: 'استعلام عن الطلب',
    statusPending: 'قيد الانتظار والمراجعة',
    statusConfirmed: 'تم تأكيد الطلب واعتماد الألوان',
    statusProcessing: 'قيد التجهيز وخلط الدهانات والتغليف',
    statusReady: 'جاهز للتوصيل أو الاستلام من المحل',
    statusDelivered: 'تم التوصيل والتسليم بنجاح',
    statusCancelled: 'تم إلغاء الطلب',

    // Admin
    adminDashboard: 'لوحة إدارة متجر مركز المالك',
    adminLoginTitle: 'تسجيل دخول الإدارة',
    emailOrUsername: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    loginBtn: 'دخول اللوحة',
    demoAdminCredentials: 'حساب تجريبي للإدارة: admin@almalak.sa / admin123',
    ordersTab: 'الطلبات والمبيعات',
    productsTab: 'إدارة المنتجات والأسعار',
    settingsTab: 'إعدادات المحل والبيانات',
    databaseTab: 'قاعدة البيانات و Firebase',
    totalOrders: 'إجمالي الطلبات',
    totalRevenue: 'إجمالي المبيعات التقديرية',
    pendingOrders: 'طلبات قيد المراجعة',
    updateStatus: 'تحديث الحالة',
    addNewProduct: 'إضافة منتج دهان جديد',
    saveChanges: 'حفظ التغييرات',
    logout: 'تسجيل الخروج',

    // Policies
    privacyPolicy: 'سياسة الخصوصية',
    termsConditions: 'الشروط والأحكام',
    deliveryPolicy: 'سياسة التوصيل والشحن بالطائف',
    returnPolicy: 'سياسة الاستبدال والاسترجاع والخلط',
    allRightsReserved: 'جميع الحقوق محفوظة لمركز المالك للدهانات بالطائف © 2026',
  },
  en: {
    // Brand
    shopName: 'Markaz Almalak Paint Shop',
    tagline: 'Interior & Exterior Finishes - Wallpapers',
    heroTagline: 'Quality Paints, Beautiful Spaces',
    taxNumberLabel: 'Tax / VAT Number',
    vatIncluded: 'All prices include 15% Saudi VAT',
    vat: 'VAT (15%)',
    currency: 'SAR',
    taifLocation: '2936 Hassan Ibn Thabit, TAAG2936, 8733, Ash Shuhada Ash Shamaliyah, At Taif 26513 (Bahrain St after Zain)',

    // Nav
    home: 'Home',
    products: 'Paints & Products',
    categories: 'Categories',
    calculator: 'Paint Calculator',
    offers: 'Offers & Discounts',
    whyUs: 'Why Choose Us',
    trackOrder: 'Track Order',
    contactUs: 'Contact Us',
    adminLogin: 'Admin Portal',
    cart: 'Shopping Cart',
    demoNotice: 'Demo data for preview purposes until verified shop catalog is linked',

    // Hero
    shopNow: 'Shop Now',
    bookOrder: 'Book Your Order',
    calculatePaints: 'Calculate Paint Quantity',
    heroBadge1: '100% Genuine Brands',
    heroBadge2: 'Fast Taif Delivery',
    heroBadge3: 'Exact Computer Color Mixing',
    heroBadge4: 'Certified VAT Invoices',

    // Featured Categories
    browseCategories: 'Browse by Paint Category',
    categoriesSubtitle: 'Everything from foundation primers to final luxury decorative touches',
    viewAllProducts: 'View All Products',
    exploreCategory: 'Explore Category',

    // Products & Shop
    allCategories: 'All Categories',
    allBrands: 'All Brands',
    filterByPrice: 'Filter by Price',
    sortBy: 'Sort By',
    sortDefault: 'Featured & Best Selling',
    sortPriceLow: 'Price: Low to High',
    sortPriceHigh: 'Price: High to Low',
    sortRating: 'Highest Rated',
    searchPlaceholder: 'Search paints, brands, or codes (e.g., Jotun, Profile, Sealer...)',
    size: 'Size',
    color: 'Recommended Color',
    customColor: 'Or enter custom color code',
    quantity: 'Quantity',
    addToCart: 'Add to Cart',
    orderNow: 'Order Now',
    orderViaWhatsApp: 'Direct WhatsApp Order',
    inStock: 'In Stock in Taif',
    outOfStock: 'Temporarily Out of Stock',
    coverage: 'Coverage Rate',
    dryTime: 'Drying Time',
    finishType: 'Finish Type',
    demoTag: 'Demo Data',
    productDetails: 'Product Specifications & Details',

    // Paint Calculator
    calcTitle: 'Paint Quantity Estimator',
    calcSubtitle: 'Accurately estimate how many liters or gallons you need for your room with one click',
    roomLength: 'Room / Wall Length (Meters)',
    roomWidth: 'Room Width (Meters)',
    roomHeight: 'Ceiling Height (Meters)',
    coatsCount: 'Number of Coats',
    doorsWindows: 'Doors & Windows Deductions (approx. m²)',
    calculateBtn: 'Calculate Quantities',
    calcResultTotalArea: 'Gross Wall Area',
    calcResultNetArea: 'Net Paintable Area',
    calcResultLiters: 'Estimated Liters Needed',
    calcResultGallons: 'Gallons (4L)',
    calcResultDrums: 'Drums (18L)',
    calcRecommendation: 'We advise purchasing a primer sealer coat to ensure maximum paint adhesion.',

    // Why Choose Us
    whyChooseTitle: 'Why Do Taif Residents Choose Markaz Almalak?',
    feature1Title: 'Certified Saudi & Global Brands',
    feature1Desc: 'Official dealers for Jotun, Al-Jazeera, National, and Saveto with authentic warranties.',
    feature2Title: 'Competitive Wholesale & Retail Rates',
    feature2Desc: 'Unmatched prices across Taif for villas, residential buildings, and painting contractors.',
    feature3Title: 'Fast Delivery & Immediate Store Pickup',
    feature3Desc: 'Prompt delivery to all Taif districts or instant pickup at our Bahrain Street shop.',
    feature4Title: 'Free Color Consultation & Tinting',
    feature4Desc: 'Our technical experts assist in color coding and exact quantity estimation to eliminate waste.',

    // Cart
    cartEmpty: 'Your shopping cart is currently empty',
    cartEmptyDesc: 'Explore our catalog of paints, profile textures, and tools to add items',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    freeDelivery: 'Free Delivery',
    freeDeliveryNote: 'Free delivery on orders over 450 SAR in Taif',
    total: 'Total Amount',
    proceedCheckout: 'Proceed to Checkout',
    clearCart: 'Clear Cart',
    sendCartWhatsApp: 'Send Cart to WhatsApp',

    // Checkout
    checkoutTitle: 'Complete Order Booking',
    customerInfo: 'Customer & Delivery Information',
    fullName: 'Full Name',
    phone: 'Saudi Mobile Number',
    whatsappNumber: 'WhatsApp Number for Coordination',
    deliveryMethod: 'Fulfillment Method',
    homeDelivery: 'Home Delivery in Taif (25 SAR)',
    storePickup: 'Store Pickup (Free - Bahrain St)',
    district: 'Taif District / Neighborhood',
    addressDetails: 'Detailed Address (Street, landmark, building)',
    mapsLink: 'Google Maps Link (Optional for easy delivery navigation)',
    preferredTime: 'Preferred Delivery / Pickup Time Slot',
    notesPlaceholder: 'Any custom color tint codes or special delivery notes...',
    paymentMethod: 'Payment Method',
    cod: 'Cash / Mada Card on Delivery',
    bankTransfer: 'Direct Bank Transfer (Al Rajhi / Al Ahli)',
    onlineCard: 'Online Card / Mada / Apple Pay (Configurable Gateway)',
    bankDetailsTitle: 'Official Bank Account Details:',
    orderSummary: 'Order Summary',
    submitOrder: 'Confirm & Book Order Now',
    submitting: 'Confirming your order...',
    whatsappDisclaimer: 'Note: Sending an order via WhatsApp or website is for preparation & reservation; final confirmation occurs upon customer service review.',

    // Order Confirmation
    orderSuccessTitle: 'Your Order Has Been Booked Successfully!',
    orderSuccessSubtitle: 'Thank you for choosing Markaz Almalak in Taif. Our team will contact you shortly to confirm tinting and delivery.',
    orderRef: 'Order Reference ID',
    trackOrderBtn: 'Track Your Order Now',
    printInvoice: 'Print Tax Invoice',
    sendOrderWhatsAppBtn: 'Share Order to WhatsApp',
    returnHome: 'Return to Homepage',

    // Order Tracking
    trackTitle: 'Track Your Order Status',
    trackSubtitle: 'Enter your order reference ID and phone number to check mixing and delivery progress',
    orderNumberPlaceholder: 'Order Reference (e.g. MALAK-2026-XXXX)',
    phonePlaceholder: 'Mobile number used in order',
    checkStatusBtn: 'Check Order Status',
    statusPending: 'Pending Review',
    statusConfirmed: 'Order Confirmed & Color Approved',
    statusProcessing: 'Mixing Paints & Packaging',
    statusReady: 'Ready for Delivery / Store Pickup',
    statusDelivered: 'Delivered Successfully',
    statusCancelled: 'Order Cancelled',

    // Admin
    adminDashboard: 'Markaz Almalak Management Dashboard',
    adminLoginTitle: 'Admin Secure Login',
    emailOrUsername: 'Email or Username',
    password: 'Password',
    loginBtn: 'Login to Portal',
    demoAdminCredentials: 'Demo Admin Credentials: admin@almalak.sa / admin123',
    ordersTab: 'Orders & Sales',
    productsTab: 'Products & Price Management',
    settingsTab: 'Shop Settings & Contacts',
    databaseTab: 'Database & Firebase Status',
    totalOrders: 'Total Orders',
    totalRevenue: 'Estimated Revenue',
    pendingOrders: 'Pending Orders',
    updateStatus: 'Update Status',
    addNewProduct: 'Add New Paint Product',
    saveChanges: 'Save Changes',
    logout: 'Logout',

    // Policies
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    deliveryPolicy: 'Taif Shipping & Delivery Policy',
    returnPolicy: 'Return, Exchange & Color Tinting Policy',
    allRightsReserved: 'All Rights Reserved to Markaz Almalak Paint Shop, Taif © 2026',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('almalak_language');
    return saved === 'en' ? 'en' : 'ar';
  });

  const dir: 'rtl' | 'ltr' = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('almalak_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
