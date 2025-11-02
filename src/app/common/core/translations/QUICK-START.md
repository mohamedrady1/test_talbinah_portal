# 🚀 البداية السريعة - نظام الترجمات

## ✅ النظام جاهز! إزاي تستخدمه؟

---

## 🎯 الخطوة الأولى: تفعيل Mock Mode (للتطوير)

حالياً الـ API endpoint مش جاهز بعد، عشان كده **فعّل Mock Mode**:

### في `translation-config.model.ts`

```typescript
export const DEFAULT_TRANSLATION_CACHE_CONFIG = {
    cacheDuration: 24 * 60 * 60 * 1000,
    useTransferState: true,
    useLocalStorage: true,
    useMock: true, // 👈 استخدام Mock Data
};
```

✅ **تم التفعيل بالفعل!**

---

## 🧪 الخطوة الثانية: اختبار النظام

### 1. شغّل المشروع
```bash
npm start
```

### 2. افتح Developer Console
```
F12 → Console Tab
```

### 3. شوف الـ Logs
```
[AppComponent] Initializing API translations for ar
[TranslationsService] Fetching ar from API
[TranslationsService] ar translations fetched and cached
[AppComponent] API translations loaded successfully for ar
```

### 4. افتح localStorage
```
F12 → Application Tab → Local Storage → http://localhost:4200
```

**هتلاقي:**
```
Key: talbinah-translations-ar
Value: {
  data: { "login": "تسجيل الدخول", ... },
  language: "ar",
  timestamp: 1729513200000,
  expiresAt: 1729599600000
}
```

---

## 💻 الخطوة الثالثة: استخدام في Component

### مثال بسيط

```typescript
// test.component.ts
import { Component, inject } from '@angular/core';
import { TranslateApiPipe } from './common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [TranslateApiPipe],
  template: `
    <div class="test-container">
      <h1>{{ 'login' | translateApi }}</h1>
      <p>{{ 'welcome' | translateApi }}</p>
      <button>{{ 'save' | translateApi }}</button>
    </div>
  `
})
export class TestComponent {}
```

**النتيجة:**
```html
<h1>تسجيل الدخول</h1>
<p>مرحبا بك</p>
<button>حفظ</button>
```

---

## 🔄 الخطوة الرابعة: تغيير اللغة

### غيّر اللغة من Header
```
اضغط على Language Selector → English
```

**هيحصل:**
1. يحفظ `language: 'en'` في localStorage
2. يستدعي `TranslationsFacade.setCurrentLanguage('en')`
3. يحمّل الترجمات الإنجليزية من Mock
4. يحفظ في localStorage: `talbinah-translations-en`
5. يعمل reload للصفحة

**بعد الـ reload:**
```
[AppComponent] Initializing API translations for en
[TranslationsService] Loaded en from localStorage cache
```

---

## 🐛 Troubleshooting

### المشكلة: localStorage فاضي

**الحل:**
1. تأكد إن `useMock: true` ✅
2. شوف Console للأخطاء
3. تأكد إن `initializeTranslations()` اتنادت:
   ```javascript
   // في Console
   console.log('[AppComponent] Initializing API translations')
   ```

### المشكلة: Pipe مش شغال

**الحل:**
```typescript
// تأكد إنك عامل import للـ Pipe
@Component({
  imports: [TranslateApiPipe],  // 👈 مهم!
})
```

### المشكلة: الترجمات بتطلع key بدل value

**الحل:**
```typescript
// تأكد إن الـ Facade initialized
const facade = inject(TranslationsFacade);
console.log('Is Initialized:', facade.isInitialized());
console.log('Current Translations:', facade.getCurrentTranslations());
```

---

## ✅ التحقق من النظام

### Browser Console Commands

```javascript
// 1. فحص localStorage
const arCache = localStorage.getItem('talbinah-translations-ar');
console.log('AR Cache:', JSON.parse(arCache));

const enCache = localStorage.getItem('talbinah-translations-en');
console.log('EN Cache:', JSON.parse(enCache));

// 2. فحص الـ Facade (في component)
console.log('Current Lang:', this._TranslationsFacade.currentLanguage());
console.log('Is Initialized:', this._TranslationsFacade.isInitialized());
console.log('Translations:', this._TranslationsFacade.getCurrentTranslations());

// 3. اختبار ترجمة
console.log('Login:', this._TranslationsFacade.translate('login'));
console.log('Welcome:', this._TranslationsFacade.translate('welcome'));
```

---

## 🔧 عشان تستخدم Real API (لما يكون جاهز)

### 1. عطّل Mock Mode
```typescript
// في translation-config.model.ts
useMock: false,  // 👈 استخدام Real API
```

### 2. تأكد من الـ Endpoint
```typescript
// في translations-api.client.ts
const endpoint = `${this.apiUrl}/translations`;

// هيكون: https://api.dev.talbinah.net/translations
```

### 3. تأكد من Header
```typescript
const headers = new HttpHeaders({
    'Accept-Language': lang,  // 'ar' or 'en'
});
```

### 4. Expected Response
```json
{
  "status": true,
  "message": null,
  "data": {
    "login": "تسجيل الدخول",
    "welcome": "مرحبا بك",
    ...
  }
}
```

---

## 📊 Cache Verification

### في Developer Tools

```
Application Tab
  └─ Local Storage
     └─ http://localhost:4200
        ├─ talbinah-translations-ar ✅
        │  {
        │    "data": { ... },
        │    "language": "ar",
        │    "timestamp": ...,
        │    "expiresAt": ...
        │  }
        │
        └─ talbinah-translations-en ✅
           {
             "data": { ... },
             "language": "en",
             "timestamp": ...,
             "expiresAt": ...
           }
```

---

## 🎉 الخلاصة

النظام دلوقتي:
- ✅ **Mock Mode مُفعّل** - للتطوير والاختبار
- ✅ **يتحمّل في AppComponent** - عند بدء التطبيق في البراوزر
- ✅ **Cache منفصل** - لكل لغة
- ✅ **SSR Support** - TransferState جاهز
- ✅ **On-demand** - اللغة الحالية بس

**شغّل المشروع وهتلاقي localStorage فيه البيانات! 🚀**

