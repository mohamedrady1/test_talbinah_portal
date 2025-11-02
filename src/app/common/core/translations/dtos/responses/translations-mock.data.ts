import { ITranslationsApiResponse, ILanguageTranslations } from './i-translations-api.response';

/**
 * Mock Arabic Translations Response
 * Sample data from the actual API response
 */
export const MOCK_AR_TRANSLATIONS_RESPONSE: ITranslationsApiResponse = {
    status: true,
    message: null,
    data: {
        "about_consultant": "نبذة عن المستشار",
        "about_podcast": "عن الحلقة",
        "about_program": "✨ عن البرنامج",
        "accept": "قبول",
        "activate": "تفعيل",
        "Active Sessions This Month": "الجلسات النشطة هذا الشهر",
        "active_codes": "الأكواد المفعلة",
        "active_packages": "الباقات المفعلة",
        "activities": "انشطة",
        "adapted": "متأقلم",
        "add": "أضف",
        "add2": "إضافة",
        "login": "تسجيل الدخول",
        "logout": "تسجيل الخروج",
        "welcome": "مرحبا بك",
        "welcome_back": "مرحبًا بعودتك",
        "welcome_safe_space": "نرحب بك في مساحة آمنة، حيث نرافقك في رحلتك نحو التوازن النفسي والطمأنينة.",
        "home": "الرئيسية",
        "settings": "الإعدادات",
        "profile": "ملفي الشخصي",
        "appointments": "المواعيد",
        "doctors": "الاطباء",
        "search": "بحث...",
        "cancel": "إلغاء",
        "confirm": "تأكيد",
        "save": "حفظ",
        "edit": "تعديل",
        "delete": "حذف",
        "yes_delete": "نعم، حذف",
        "no": "لا",
        "back": "رجوع",
        "next": "التالي",
        "previous": "السابق",
        "loading": "جاري التحميل...",
        "error": "خطأ",
        "success": "نجاح",
        "warning": "تحذير",
        "info": "معلومة"
    }
};

/**
 * Mock English Translations Response
 * Sample data for English translations
 */
export const MOCK_EN_TRANSLATIONS_RESPONSE: ITranslationsApiResponse = {
    status: true,
    message: null,
    data: {
        "about_consultant": "About Consultant",
        "about_podcast": "About Episode",
        "about_program": "✨ About Program",
        "accept": "Accept",
        "activate": "Activate",
        "Active Sessions This Month": "Active Sessions This Month",
        "active_codes": "Active Codes",
        "active_packages": "Active Packages",
        "activities": "Activities",
        "adapted": "Adapted",
        "add": "Add",
        "add2": "Add",
        "login": "Login",
        "logout": "Logout",
        "welcome": "Welcome",
        "welcome_back": "Welcome Back",
        "welcome_safe_space": "We welcome you to a safe space, where we accompany you on your journey towards psychological balance and peace of mind.",
        "home": "Home",
        "settings": "Settings",
        "profile": "Profile",
        "appointments": "Appointments",
        "doctors": "Doctors",
        "search": "Search...",
        "cancel": "Cancel",
        "confirm": "Confirm",
        "save": "Save",
        "edit": "Edit",
        "delete": "Delete",
        "yes_delete": "Yes, Delete",
        "no": "No",
        "back": "Back",
        "next": "Next",
        "previous": "Previous",
        "loading": "Loading...",
        "error": "Error",
        "success": "Success",
        "warning": "Warning",
        "info": "Info"
    }
};


/**
 * Mock Error Response
 * For testing error handling
 */
export const MOCK_ERROR_RESPONSE: ITranslationsApiResponse = {
    status: false,
    message: "Failed to fetch translations",
    data: {}
};

