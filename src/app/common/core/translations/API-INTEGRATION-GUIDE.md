# دليل تكامل API الترجمات - Talbinah Portal

## 📋 نظرة عامة

هذا الدليل يشرح كيفية استخدام نظام الترجمات مع API الخاص بـ Talbinah، بما في ذلك:
- بنية الـ API Response
- كيفية استخدام الـ Mock Data
- أمثلة عملية
- استكشاف الأخطاء وحلها

---

## 🔌 تفاصيل الـ API

### Endpoint
```
GET https://api.dev.talbinah.net/api/translations
```

### Headers
```http
talbinah-token: s4kl2fC852tSpczXsdAJIH6fORLbgG4zfwVJVjLlolop74kUUyT0aYRxZSGAQXRB
```

### Parameters
```typescript
{
  lang?: string  // Language code (ar, en) - Currently not required by API
}
```

### Response Structure
```typescript
{
  "status": boolean,
  "message": string | null,
  "data": {
    "key1": "value1",
    "key2": "value2",
    // ... more translations
  }
}
```

### مثال على Response فعلي (العربية)
```json
{
  "status": true,
  "message": null,
  "data": {
    "about_consultant": "نبذة عن المستشار",
    "about_podcast": "عن الحلقة",
    "accept": "قبول",
    "activate": "تفعيل",
    "login": "تسجيل الدخول",
    "logout": "تسجيل الخروج"
  }
}
```

---

## 📦 الـ Interfaces

### ITranslationsApiResponse
```typescript
interface ITranslationsApiResponse {
    status: boolean;           // حالة الطلب
    message: string | null;    // رسالة من الـ API
    data: ILanguageTranslations; // الترجمات
}
```

### ILanguageTranslations
```typescript
interface ILanguageTranslations {
    [key: string]: string | INestedTranslation;
}
```

### ITranslationsData (للاستخدام الداخلي)
```typescript
interface ITranslationsData {
    ar: ILanguageTranslations;
    en: ILanguageTranslations;
}
```

---

## 🔧 الاستخدام

### 1. استخدام Real API

الكود الحالي يستخدم الـ API الحقيقي بشكل افتراضي:

```typescript
// في app.config.ts - التكوين موجود بالفعل
{
  provide: APP_INITIALIZER,
  useFactory: translationsInitializerFactory,
  multi: true,
}
```

### 2. استخدام Mock Data للتطوير

#### تفعيل Mock Mode

##### Option 1: عبر Environment
```typescript
// في environment.dev.ts أو أي environment آخر
export const environment = {
  // ... other configs
  useTranslationsMock: true // أضف هذا الخيار
};
```

##### Option 2: عبر Config مباشر
```typescript
// في translation-config.model.ts
export const DEFAULT_TRANSLATION_CACHE_CONFIG: ITranslationCacheConfig = {
    cacheDuration: 24 * 60 * 60 * 1000,
    useTransferState: true,
    useLocalStorage: true,
    useMock: true, // 👈 تفعيل Mock Mode
};
```

#### استخدام Mock Client مباشرة
```typescript
import { TranslationsApiMockClient } from '@common/core/translations';

// في Component أو Service
const mockClient = inject(TranslationsApiMockClient);

// تخصيص سلوك الـ Mock
mockClient.configure({
  simulateNetworkDelay: true,
  networkDelayMs: 500,
  simulateError: false
});

// إضافة ترجمة جديدة للاختبار
mockClient.addMockTranslation('test_key', 'قيمة اختبار', 'ar');
mockClient.addMockTranslation('test_key', 'Test Value', 'en');

// الحصول على الترجمات
mockClient.getTranslations().subscribe(data => {
  console.log(data);
});
```

---

## 📝 أمثلة عملية

### مثال 1: استخدام Pipe في Template

```html
<!-- استخدام بسيط -->
<h1>{{ 'about_consultant' | translateApi }}</h1>
<!-- Output: نبذة عن المستشار -->

<button>{{ 'login' | translateApi }}</button>
<!-- Output: تسجيل الدخول -->

<!-- تحديد اللغة يدوياً -->
<h1>{{ 'about_consultant' | translateApi:'en' }}</h1>
<!-- Output: About Consultant -->

<!-- في Attributes -->
<input 
  type="text" 
  [placeholder]="'search' | translateApi"
  [aria-label]="'search' | translateApi"
/>
```

### مثال 2: استخدام في Component

```typescript
import { Component, inject } from '@angular/core';
import { TranslationsFacade, TranslateApiPipe } from '@common/core/translations';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TranslateApiPipe],
  template: `
    <h1>{{ 'welcome' | translateApi }}</h1>
    <p>{{ greeting }}</p>
    <button (click)="showMessage()">
      {{ 'confirm' | translateApi }}
    </button>
  `
})
export class ExampleComponent {
  private readonly facade = inject(TranslationsFacade);
  
  greeting = this.facade.translate('welcome');
  
  showMessage() {
    const msg = this.facade.translate('success');
    console.log(msg);
  }
}
```

### مثال 3: استخدام مع Signals

```typescript
import { Component, inject, computed } from '@angular/core';
import { TranslationsFacade } from '@common/core/translations';

@Component({
  selector: 'app-dynamic',
  standalone: true,
  template: `
    <h1>{{ pageTitle() }}</h1>
    <p>{{ currentLang() }}</p>
    @if (isLoading()) {
      <p>{{ loadingText() }}</p>
    }
  `
})
export class DynamicComponent {
  private readonly facade = inject(TranslationsFacade);
  
  // Signals من الـ Facade
  currentLang = this.facade.currentLanguage();
  isLoading = this.facade.isLoading();
  
  // Computed signals
  pageTitle = computed(() => 
    this.facade.translate('home')
  );
  
  loadingText = computed(() => 
    this.facade.translate('loading')
  );
}
```

### مثال 4: اختبار مع Mock Data

```typescript
import { 
  TranslationsApiMockClient,
  getMockTranslation,
  hasMockTranslation 
} from '@common/core/translations';

// في Component أو Test
const mockClient = inject(TranslationsApiMockClient);

// اختبار وجود key
if (hasMockTranslation('login', 'ar')) {
  const loginText = getMockTranslation('login', 'ar');
  console.log(loginText); // "تسجيل الدخول"
}

// إضافة ترجمة للاختبار
mockClient.addMockTranslation('custom_key', 'قيمة مخصصة', 'ar');

// اختبار Error Handling
mockClient.configure({ simulateError: true });
mockClient.getTranslations().subscribe({
  next: data => console.log(data),
  error: err => console.error('Error:', err)
});

// إعادة تعيين
mockClient.configure({ simulateError: false });
```

---

## 🎨 Mock Data المتوفرة

### الترجمات العربية المتوفرة في Mock
```typescript
{
  "about_consultant": "نبذة عن المستشار",
  "about_podcast": "عن الحلقة",
  "accept": "قبول",
  "activate": "تفعيل",
  "login": "تسجيل الدخول",
  "logout": "تسجيل الخروج",
  "welcome": "مرحبا بك",
  "home": "الرئيسية",
  "settings": "الإعدادات",
  "profile": "ملفي الشخصي",
  // ... والمزيد
}
```

### إضافة بيانات Mock إضافية
```typescript
// في ملف translations-mock.data.ts
export const MOCK_AR_TRANSLATIONS_RESPONSE: ITranslationsApiResponse = {
    status: true,
    message: null,
    data: {
        // أضف ترجماتك هنا
        "your_custom_key": "الترجمة العربية",
        "another_key": "ترجمة أخرى"
    }
};
```

---

## 🔍 استكشاف الأخطاء وحلها

### المشكلة: الترجمات لا تظهر

**الحلول:**

1. **تحقق من Console**
   ```typescript
   // في Browser Console
   const facade = inject(TranslationsFacade);
   console.log('Is Initialized:', facade.isInitialized());
   console.log('Translations Data:', facade.translationsData());
   console.log('Current Language:', facade.currentLanguage());
   ```

2. **تحقق من API Response**
   - افتح Network Tab في DevTools
   - ابحث عن request لـ `/api/translations`
   - تأكد من الـ status: 200
   - تأكد من وجود `talbinah-token` في Headers

3. **تحقق من Cache**
   ```typescript
   // في Console
   const facade = inject(TranslationsFacade);
   console.log('Cache Valid:', facade.isCacheValid());
   console.log('Cache Expiration:', new Date(facade.getCacheExpiration()!));
   ```

4. **إعادة تحميل قسري**
   ```typescript
   facade.refresh().subscribe(data => {
     console.log('Refreshed:', data);
   });
   ```

### المشكلة: API يرجع خطأ 401 Unauthorized

**الحل:**
- تأكد من أن `talbinah-token` صحيح في `translations-api.client.ts`
- تحقق من صلاحية الـ token مع الـ Backend Team

### المشكلة: الترجمات لا تتحدث عند تغيير اللغة

**الحل:**
```typescript
// في AppLanguageService
setDirection(lang: string): void {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const html = this.document.documentElement;
  html.setAttribute('dir', dir);
  html.setAttribute(StorageKeys.LANGUAGE, lang);
  html.setAttribute('class', lang);

  // تأكد من تزامن TranslationsFacade
  this.translationsFacade.setCurrentLanguage(lang);
}
```

### المشكلة: Mock Data لا يعمل

**الحل:**
```typescript
// 1. تأكد من تفعيل useMock في Config
// 2. استخدم TranslationsApiMockClient مباشرة
// 3. تحقق من Console Logs

// مثال للتأكد:
const mockClient = inject(TranslationsApiMockClient);
mockClient.getTranslations().subscribe(
  data => console.log('Mock Data Loaded:', data),
  error => console.error('Mock Error:', error)
);
```

---

## ⚡ Best Practices

### 1. استخدم Pipe في Templates
```html
✅ Good
<h1>{{ 'welcome' | translateApi }}</h1>

❌ Avoid
<h1>{{ facade.translate('welcome') }}</h1>
```

### 2. استخدم Facade في TypeScript
```typescript
✅ Good
const msg = this.facade.translate('success');

❌ Avoid
const msg = this.translate.instant('success'); // Old ngx-translate way
```

### 3. استخدم Mock للتطوير
```typescript
✅ Good - للتطوير السريع بدون الحاجة للـ API
useMock: true

✅ Good - للإنتاج
useMock: false
```

### 4. تنظيم المفاتيح
```typescript
✅ Good - استخدم أسماء واضحة
'login_button_text'
'welcome_message'
'error_invalid_email'

❌ Avoid - أسماء غامضة
'btn1'
'msg'
'err'
```

### 5. التعامل مع الترجمات المفقودة
```typescript
✅ Good
const text = this.facade.translate('some_key');
if (text === 'some_key') {
  // الترجمة غير موجودة، استخدم fallback
  console.warn(`Translation missing: some_key`);
}
```

---

## 📊 Performance Tips

### 1. Cache Duration
```typescript
// للتطوير - cache قصير
cacheDuration: 5 * 60 * 1000, // 5 دقائق

// للإنتاج - cache طويل
cacheDuration: 24 * 60 * 60 * 1000, // 24 ساعة
```

### 2. Network Delay في Mock
```typescript
// للتطوير السريع
mockClient.configure({ 
  simulateNetworkDelay: false 
});

// للاختبار الواقعي
mockClient.configure({ 
  simulateNetworkDelay: true,
  networkDelayMs: 500 
});
```

### 3. SSR Optimization
```typescript
// تأكد من تفعيل TransferState
useTransferState: true  // ✅
```

---

## 🔗 الموارد المفيدة

### الملفات الرئيسية
- **API Client**: `src/app/common/core/translations/clients/translations-api.client.ts`
- **Mock Client**: `src/app/common/core/translations/clients/translations-api-mock.client.ts`
- **Interfaces**: `src/app/common/core/translations/dtos/responses/i-translations-api.response.ts`
- **Mock Data**: `src/app/common/core/translations/dtos/responses/translations-mock.data.ts`
- **Facade**: `src/app/common/core/translations/services/translations.facade.ts`
- **Config**: `src/app/common/core/translations/models/translation-config.model.ts`

### الوثائق الأخرى
- **README.md**: نظرة عامة وأمثلة أساسية
- **USAGE-EXAMPLES.md**: أمثلة متقدمة
- **IMPLEMENTATION-SUMMARY.md**: تفاصيل التنفيذ

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. راجع هذا الدليل
2. تحقق من Console Logs
3. جرب Mock Data للتأكد من أن المشكلة في الـ API
4. تواصل مع Backend Team للتحقق من الـ API

---

**آخر تحديث**: October 2025  
**الإصدار**: 1.0.0

