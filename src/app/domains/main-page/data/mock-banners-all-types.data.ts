import { IBannerItem } from "../dtos";
import { BannerActionType, BannerPageType, BannerType, NormalBannerType } from "../enums";

/**
 * ملف البيانات التجريبية الشامل لكل أنواع البانرات
 * يحتوي على أمثلة لكل نوع من أنواع BannerPageType الموجودة في النظام
 * 
 * تصنيف الأنواع:
 * ================
 * 
 * 1️⃣ صفحات Routes (تفتح صفحة جديدة):
 *    - SUPPORT_SESSIONS
 *    - BOOK_APPOINTMENT  
 *    - PODCAST
 *    - ARTICLES
 *    - TALBINAH_COMMUNITY
 *    - MENTAL_HEALTH_SCALES
 *    - THERAPEUTIC_PROGRAMS
 *    - KHAWIIK
 *    - SUPPORT_GROUPS
 *    - APPOINTMENTS
 *    - URGENT_APPOINTMENT
 *    - SETTINGS
 *    - PROFILE
 * 
 * 2️⃣ صفحات Popups/Modals (تفتح نافذة منبثقة):
 *    - QUICK_RESERVATION (نافذة حجز سريع)
 *    - WALLET_GIFT (مودال المحفظة)
 *    - GOVERNMENT_AGENCIES (مودال الجهات الحكومية)
 * 
 * 3️⃣ روابط خارجية (LINK):
 *    - يمكن استخدام أي رابط خارجي
 * 
 * ملاحظة: بعض الأنواع المذكورة في قائمتك غير موجودة حالياً في BannerPageType:
 * ❌ DOCTORS, DOCTOR_DETAILS, COUPONS, SUPERVISORY_SESSION, PACKAGE, VISIT_REPORT
 * ❌ NOTIFICATIONS,
 *  POINTS,
 *  LISTENED_PODCASTS,
 *  POINTS_REWARDS,
 *  FAVORITES
 * ❌ REFERAL_CODE, MOOD, HEALTH_SCALE_REPORT, SETTINGS_NOTIFICATIONS, SECURITY
 * ❌ FAQS, IMPORTANT_NUMBERS, PROBLEMS, CONTACT_US, INVITE_FRIENDS
 * ❌ PRESCRIPTION_LIST, LOGOUT, RATEAPP, TECHNICAL_SUPPORT, TOPIC
 * ❌ APPOINTMENTSTAP, DOCTORCHATS, DOCTORREPORT
 */

// ============================================
// 1️⃣ بانرات الصفحات (Routes)
// ============================================

export const BANNER_SUPPORT_SESSIONS: IBannerItem = {
    id: 1,
    type: BannerType.IMAGE,
    title: 'جلسات الدعم النفسي',
    subTitle: 'احجز جلسة دعم نفسي مع متخصصين',
    icon: 'images/home/icons/support-sessions.png',
    color: '#4CAF50',
    button_name: 'احجز الآن',
    button_color: '#2E7D32',
    image: 'images/home/cards/support-sessions.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.SUPPORT_SESSIONS,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.FEATURED
};

export const BANNER_BOOK_APPOINTMENT: IBannerItem = {
    id: 2,
    type: BannerType.IMAGE,
    title: 'احجز موعدك',
    subTitle: 'احجز موعد مع طبيبك النفسي',
    icon: 'images/appointment/talbinah-clinic-icon.png',
    color: '#2196F3',
    button_name: 'احجز موعد',
    button_color: '#1976D2',
    image: 'images/appointment/mental-well-being.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.BOOK_APPOINTMENT,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.NORMAL
};

export const BANNER_PODCAST: IBannerItem = {
    id: 3,
    type: BannerType.IMAGE,
    title: 'استمع إلى البودكاست',
    subTitle: 'حلقات صوتية مفيدة للصحة النفسية',
    icon: 'images/podcast/podcast-icon.png',
    color: '#FF9800',
    button_name: 'استمع الآن',
    button_color: '#F57C00',
    image: 'images/podcast/podcast-banner.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.PODCAST,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.NORMAL
};

export const BANNER_ARTICLES: IBannerItem = {
    id: 4,
    type: BannerType.IMAGE,
    title: 'المقالات العلمية',
    subTitle: 'اقرأ مقالات متخصصة في الصحة النفسية',
    icon: 'images/articles/article-icon.png',
    color: '#9C27B0',
    button_name: 'تصفح المقالات',
    button_color: '#7B1FA2',
    image: 'images/articles/calender.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.ARTICLES,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.NORMAL
};

export const BANNER_TALBINAH_COMMUNITY: IBannerItem = {
    id: 5,
    type: BannerType.IMAGE,
    title: 'مجتمع طلبينة',
    subTitle: 'انضم إلى مجتمعنا وشارك تجربتك',
    icon: 'images/community/Container.png',
    color: '#E91E63',
    button_name: 'انضم الآن',
    button_color: '#C2185B',
    image: 'images/community/people.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.TALBINAH_COMMUNITY,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.FEATURED
};

export const BANNER_MENTAL_HEALTH_SCALES: IBannerItem = {
    id: 6,
    type: BannerType.IMAGE,
    title: 'مقاييس الصحة النفسية',
    subTitle: 'قيم حالتك النفسية من خلال المقاييس العلمية',
    icon: 'images/mentalHealthScale/icons/scale-icon.png',
    color: '#00BCD4',
    button_name: 'ابدأ الاختبار',
    button_color: '#0097A7',
    image: 'images/mentalHealthScale/bg.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.MENTAL_HEALTH_SCALES,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.NORMAL
};

export const BANNER_THERAPEUTIC_PROGRAMS: IBannerItem = {
    id: 7,
    type: BannerType.IMAGE,
    title: 'البرامج العلاجية',
    subTitle: 'برامج علاجية متخصصة لتحسين صحتك النفسية',
    icon: 'images/therapeutic-programs/program-icon.png',
    color: '#673AB7',
    button_name: 'تصفح البرامج',
    button_color: '#512DA8',
    image: 'images/therapeutic-programs/program-banner.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.THERAPEUTIC_PROGRAMS,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.PROMOTIONAL
};

export const BANNER_KHAWIIK: IBannerItem = {
    id: 8,
    type: BannerType.IMAGE,
    title: 'اسأل خويك',
    subTitle: 'تحدث مع مساعدنا الذكي خويك',
    icon: 'images/khawiik/khawiik-header-icon.png',
    color: '#009688',
    button_name: 'ابدأ المحادثة',
    button_color: '#00796B',
    image: 'images/khawiik/khawiik-welcome-mian-icon.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.KHAWIIK,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.FEATURED
};

export const BANNER_SUPPORT_GROUPS: IBannerItem = {
    id: 9,
    type: BannerType.IMAGE,
    title: 'مجموعات الدعم',
    subTitle: 'انضم إلى مجموعات الدعم الجماعية',
    icon: 'images/supportGroups/support-group-icon.png',
    color: '#8BC34A',
    button_name: 'انضم',
    button_color: '#689F38',
    image: 'images/supportGroups/support-group-banner.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.SUPPORT_GROUPS,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.NORMAL
};

export const BANNER_APPOINTMENTS: IBannerItem = {
    id: 10,
    type: BannerType.IMAGE,
    title: 'مواعيدي',
    subTitle: 'تصفح وإدارة مواعيدك القادمة',
    icon: 'images/home/icons/appointments.png',
    color: '#FF5722',
    button_name: 'عرض المواعيد',
    button_color: '#E64A19',
    image: 'images/appointment/circle-waves.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.APPOINTMENTS,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.NORMAL
};

export const BANNER_URGENT_APPOINTMENT: IBannerItem = {
    id: 11,
    type: BannerType.IMAGE,
    title: 'موعد طارئ',
    subTitle: 'احجز موعد طارئ فوراً',
    icon: 'images/urgent-appointment/urgent-icon.png',
    color: '#F44336',
    button_name: 'حجز فوري',
    button_color: '#D32F2F',
    image: 'images/urgent-appointment/urgent-banner.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.URGENT_APPOINTMENT,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.PROMOTIONAL
};

export const BANNER_SETTINGS: IBannerItem = {
    id: 12,
    type: BannerType.IMAGE,
    title: 'الإعدادات',
    subTitle: 'تحكم في إعدادات حسابك',
    icon: 'images/settings/settings-icon.png',
    color: '#607D8B',
    button_name: 'الإعدادات',
    button_color: '#455A64',
    image: 'images/settings/settings-banner.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.SETTINGS,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.NORMAL
};

export const BANNER_PROFILE: IBannerItem = {
    id: 13,
    type: BannerType.IMAGE,
    title: 'ملفي الشخصي',
    subTitle: 'عرض وتعديل ملفك الشخصي',
    icon: 'images/community/user/user-avatar.png',
    color: '#3F51B5',
    button_name: 'عرض الملف',
    button_color: '#303F9F',
    image: 'images/community/Container.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.PROFILE,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.NORMAL
};

// ============================================
// 2️⃣ بانرات الـ Popups/Modals
// ============================================

/**
 * بانر الحجز السريع - يفتح نافذة منبثقة للحجز السريع
 * ⚠️ هذا النوع يفتح Popup وليس صفحة
 */
export const BANNER_QUICK_RESERVATION: IBannerItem = {
    id: 101,
    type: BannerType.IMAGE,
    title: 'حجز سريع',
    subTitle: 'احجز موعد بسرعة من خلال النافذة السريعة',
    icon: 'images/urgent-appointment/urgent-icon.png',
    color: '#FF6B6B',
    button_name: 'حجز سريع',
    button_color: '#EE5A52',
    image: 'images/urgent-appointment/urgent-banner.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.QUICK_RESERVATION,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.PROMOTIONAL
};

/**
 * بانر المحفظة - يفتح مودال المحفظة
 * ⚠️ هذا النوع يفتح Modal وليس صفحة
 */
export const BANNER_WALLET_GIFT: IBannerItem = {
    id: 102,
    type: BannerType.IMAGE,
    title: 'محفظتي',
    subTitle: 'تصفح محفظتك والهدايا المتاحة',
    icon: 'images/settings/modal-icons/wallet.png',
    color: '#FFD700',
    button_name: 'عرض المحفظة',
    button_color: '#FFC700',
    image: 'images/settings/wallet.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.WALLET_GIFT,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.FEATURED
};

/**
 * بانر الجهات الحكومية - يفتح مودال الجهات الحكومية
 * ⚠️ هذا النوع يفتح Modal وليس صفحة
 */
export const BANNER_GOVERNMENT_AGENCIES: IBannerItem = {
    id: 103,
    type: BannerType.IMAGE,
    title: 'الجهات الحكومية',
    subTitle: 'تصفح الجهات الحكومية المتاحة',
    icon: 'images/settings/modal-icons/government-agencies.png',
    color: '#4169E1',
    button_name: 'عرض الجهات',
    button_color: '#3457D5',
    image: 'images/settings/government.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.GOVERNMENT_AGENCIES,
    pageID: null,
    link: '',
    banner_type: NormalBannerType.NORMAL
};

// ============================================
// 3️⃣ بانرات الروابط الخارجية
// ============================================

/**
 * بانر رابط خارجي - يفتح رابط في نافذة جديدة
 */
export const BANNER_EXTERNAL_LINK: IBannerItem = {
    id: 201,
    type: BannerType.IMAGE,
    title: 'زيارة موقعنا',
    subTitle: 'اعرف المزيد عن طلبينة',
    icon: 'images/logos/icon.png',
    color: '#34A853',
    button_name: 'زيارة الموقع',
    button_color: '#2E8B57',
    image: 'images/logos/logo-colored-circle.png',
    action: BannerActionType.LINK,
    page: '',
    pageID: null,
    link: 'https://talbinah.com',
    banner_type: NormalBannerType.PROMOTIONAL
};

// ============================================
// 4️⃣ بانرات مع PageID (لفتح صفحة معينة مع ID)
// ============================================

/**
 * بانر مقال معين - يفتح صفحة المقالات مع ID مقال محدد
 */
export const BANNER_SPECIFIC_ARTICLE: IBannerItem = {
    id: 301,
    type: BannerType.IMAGE,
    title: 'مقال مميز',
    subTitle: 'كيفية التعامل مع القلق',
    icon: 'images/articles/article-icon.png',
    color: '#9C27B0',
    button_name: 'اقرأ المقال',
    button_color: '#7B1FA2',
    image: 'images/articles/calender-2.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.ARTICLES,
    pageID: 123, // ⚠️ هنا يتم تمرير ID المقال
    link: '',
    banner_type: NormalBannerType.FEATURED
};

/**
 * بانر بودكاست معين - يفتح صفحة البودكاست مع ID بودكاست محدد
 */
export const BANNER_SPECIFIC_PODCAST: IBannerItem = {
    id: 302,
    type: BannerType.IMAGE,
    title: 'حلقة مميزة',
    subTitle: 'كيف تتغلب على الاكتئاب',
    icon: 'images/podcast/podcast-icon.png',
    color: '#FF9800',
    button_name: 'استمع',
    button_color: '#F57C00',
    image: 'images/podcast/podcast-banner.png',
    action: BannerActionType.PAGE,
    page: BannerPageType.PODCAST,
    pageID: 456, // ⚠️ هنا يتم تمرير ID البودكاست
    link: '',
    banner_type: NormalBannerType.FEATURED
};

// ============================================
// 📦 مصفوفات جاهزة للاستخدام
// ============================================

/**
 * كل البانرات التي تفتح صفحات Routes
 */
export const ROUTE_BANNERS: IBannerItem[] = [
    BANNER_SUPPORT_SESSIONS,
    BANNER_BOOK_APPOINTMENT,
    BANNER_PODCAST,
    BANNER_ARTICLES,
    BANNER_TALBINAH_COMMUNITY,
    BANNER_MENTAL_HEALTH_SCALES,
    BANNER_THERAPEUTIC_PROGRAMS,
    BANNER_KHAWIIK,
    BANNER_SUPPORT_GROUPS,
    BANNER_APPOINTMENTS,
    BANNER_URGENT_APPOINTMENT,
    BANNER_SETTINGS,
    BANNER_PROFILE
];

/**
 * كل البانرات التي تفتح Popups/Modals
 */
export const POPUP_BANNERS: IBannerItem[] = [
    BANNER_QUICK_RESERVATION,
    BANNER_WALLET_GIFT,
    BANNER_GOVERNMENT_AGENCIES
];

/**
 * كل البانرات التي تفتح روابط خارجية
 */
export const LINK_BANNERS: IBannerItem[] = [
    BANNER_EXTERNAL_LINK
];

/**
 * كل البانرات مع PageID
 */
export const ID_BANNERS: IBannerItem[] = [
    BANNER_SPECIFIC_ARTICLE,
    BANNER_SPECIFIC_PODCAST
];

/**
 * كل البانرات - مجموعة شاملة
 */
export const ALL_BANNERS: IBannerItem[] = [
    ...ROUTE_BANNERS,
    ...POPUP_BANNERS,
    ...LINK_BANNERS,
    ...ID_BANNERS
];

/**
 * بانرات مميزة للصفحة الرئيسية
 */
export const FEATURED_HOME_BANNERS: IBannerItem[] = [
    BANNER_BOOK_APPOINTMENT,
    BANNER_KHAWIIK,
    BANNER_QUICK_RESERVATION,
    BANNER_TALBINAH_COMMUNITY,
    BANNER_MENTAL_HEALTH_SCALES
];

/**
 * بانرات ترويجية
 */
export const PROMOTIONAL_BANNERS: IBannerItem[] = [
    BANNER_THERAPEUTIC_PROGRAMS,
    BANNER_URGENT_APPOINTMENT,
    BANNER_QUICK_RESERVATION,
    BANNER_EXTERNAL_LINK
];

