# إعدادات اللغة الافتراضية - العربية

## نظرة عامة

تم إعداد التطبيق ليعمل باللغة العربية كلغة افتراضية. جميع الإعدادات مكونة لضمان أن التطبيق يبدأ باللغة العربية.

## الإعدادات الحالية

### 1. اللغة الافتراضية
```typescript
// في ملف: src/app/layouts/site-header/language-selector/data/default-language.data.ts
export const DEFAULT_LANGUAGE: Language = AVAILABLE_LANGUAGES.find(lang => lang.code === 'ar')!;
export const DEFAULT_LANGUAGE_CODE: string = DEFAULT_LANGUAGE.code; // 'ar'
```

### 2. إعدادات التطبيق
```typescript
// في ملف: src/app/app.config.ts
{
  provide: LOCALE_ID,
  useValue: DEFAULT_LANGUAGE_CODE, // اللغة الافتراضية العربية
}
```

### 3. خدمة الترجمة
```typescript
// في ملف: src/app/app.config.ts
provideTranslateService({
  loader: {
    provide: TranslateLoader,
    useFactory: httpLoaderFactory,
    deps: [HttpClient],
  },
  defaultLanguage: DEFAULT_LANGUAGE_CODE, // 'ar'
}),
```

### 4. تسجيل البيانات المحلية
```typescript
// في ملف: src/app/app.config.ts
import localeAr from '@angular/common/locales/ar';
registerLocaleData(localeAr);
```

## اللغات المتاحة

```typescript
// في ملف: src/app/layouts/site-header/language-selector/data/available-languages.data.ts
export const AVAILABLE_LANGUAGES: Language[] = [
  {
    code: 'ar',        // العربية (الافتراضية)
    name: 'Arabic',
    nativeName: 'العربية',
    iconPath: 'assets/flags/ar.svg',
    direction: 'rtl'
  },
  {
    code: 'en',        // الإنجليزية
    name: 'English',
    nativeName: 'English',
    iconPath: 'assets/flags/en.svg',
    direction: 'ltr'
  },
  {
    code: 'ru',        // الروسية
    name: 'Russian',
    nativeName: 'Русский',
    iconPath: 'assets/flags/ru.svg',
    direction: 'ltr'
  },
  {
    code: 'zh',        // الصينية
    name: 'Chinese',
    nativeName: '中文',
    iconPath: 'assets/flags/zh.svg',
    direction: 'ltr'
  }
];
```

## ملفات الترجمة

### العربية (الافتراضية)
- **الملف**: `public/i18n/ar.json`
- **الحجم**: 75KB
- **عدد الأسطر**: 1452 سطر
- **الحالة**: ✅ متوفر ومكتمل

### الإنجليزية
- **الملف**: `public/i18n/en.json`
- **الحجم**: 61KB
- **عدد الأسطر**: 1467 سطر
- **الحالة**: ✅ متوفر ومكتمل

## كيفية عمل النظام

### 1. عند بدء التطبيق
```typescript
// في AppLanguageService
initialize(): void {
  const storedLang = this.storage.getItem<string>(StorageKeys.LANGUAGE);
  const browserLang = this.translate.getBrowserLang();
  const selectedLang = storedLang || DEFAULT_LANGUAGE_CODE || browserLang || AVAILABLE_LANGUAGES[0].code;
  // النتيجة: 'ar' (العربية)
}
```

### 2. ترتيب الأولوية
1. **اللغة المحفوظة**: إذا كان المستخدم قد اختار لغة سابقاً
2. **اللغة الافتراضية**: `DEFAULT_LANGUAGE_CODE` ('ar')
3. **لغة المتصفح**: إذا كانت مدعومة
4. **أول لغة متاحة**: العربية

### 3. إعداد الاتجاه
```typescript
setDirection(lang: string): void {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const html = this.document.documentElement;
  html.setAttribute('dir', dir);        // 'rtl' للعربية
  html.setAttribute(StorageKeys.LANGUAGE, lang); // 'ar'
  html.setAttribute('class', lang);     // 'ar'
}
```

## المميزات

- ✅ **اللغة الافتراضية**: العربية
- ✅ **دعم RTL**: الاتجاه من اليمين لليسار
- ✅ **ملفات ترجمة مكتملة**: العربية والإنجليزية
- ✅ **تخزين تفضيل المستخدم**: حفظ اختيار اللغة
- ✅ **دعم متصفحات متعددة**: العربية والإنجليزية والروسية والصينية
- ✅ **SSR متوافق**: يعمل مع Server-Side Rendering

## كيفية تغيير اللغة

### برمجياً
```typescript
import { TranslateService } from '@ngx-translate/core';

constructor(private translate: TranslateService) {}

// تغيير إلى الإنجليزية
this.translate.use('en');

// تغيير إلى العربية
this.translate.use('ar');
```

### من خلال واجهة المستخدم
```typescript
// في مكون اختيار اللغة
onLanguageChange(langCode: string) {
  this.translate.use(langCode);
  this.storage.setItem(StorageKeys.LANGUAGE, langCode);
}
```

## ملاحظات مهمة

1. **اللغة الافتراضية**: العربية ('ar')
2. **الاتجاه الافتراضي**: RTL (من اليمين لليسار)
3. **التخزين**: يتم حفظ تفضيل المستخدم في localStorage
4. **SSR**: يعمل بشكل صحيح مع Server-Side Rendering
5. **الأداء**: ملفات الترجمة محملة عند الحاجة فقط

## استكشاف الأخطاء

### اللغة لا تتغير
- تحقق من وجود ملف الترجمة
- تأكد من تسجيل اللغة في `addLangs()`
- راجع console للأخطاء

### الاتجاه لا يتغير
- تحقق من دالة `setDirection()`
- تأكد من تطبيق `dir` attribute على `html`
- راجع CSS للـ RTL

### الترجمة لا تظهر
- تحقق من وجود المفتاح في ملف الترجمة
- تأكد من استخدام `translate.instant()` أو `translate.get()`
- راجع أن اللغة مفعلة في `use()` 