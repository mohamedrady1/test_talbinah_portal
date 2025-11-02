# 🔄 تحديث نظام الترجمات - التكامل مع API الجديد

## 📝 التغييرات الرئيسية

### 1. شكل Response الجديد من API

**القديم (كان متوقع):**
```json
{
  "success": true,
  "message": "Translations fetched successfully",
  "data": {
    "ar": { "key": "value" },
    "en": { "key": "value" }
  }
}
```

**الجديد (الفعلي من API):**
```json
{
  "status": true,
  "message": null,
  "data": {
    "key": "value"
  }
}
```

> ⚠️ **ملاحظة:** API الآن يُرجع ترجمة لغة واحدة فقط لكل request.

---

## 🔧 التعديلات المُنفذة

### 1. ✅ تحديث DTOs

```typescript
// ITranslationsApiResponse - Response لكل لغة
export interface ITranslationsApiResponse {
    status: boolean;
    message: string | null;
    data: ILanguageTranslations;
}

// ITranslationsData - للاستخدام الداخلي (دمج اللغتين)
export interface ITranslationsData {
    ar: ILanguageTranslations;
    en: ILanguageTranslations;
}
```

### 2. ✅ تحديث API Client

الـ Client الآن يستدعي API لكل لغة ثم يدمجهم:

```typescript
getTranslations(): Observable<ITranslationsData> {
    return forkJoin({
        ar: this.getTranslationsByLanguage('ar'),
        en: this.getTranslationsByLanguage('en')
    }).pipe(
        map(responses => ({
            ar: responses.ar.data,
            en: responses.en.data
        }))
    );
}
```

**الـ Endpoints:**
- `GET /api/translations/ar` → ترجمات عربية
- `GET /api/translations/en` → ترجمات إنجليزية

### 3. ✅ إضافة Mock Client

تم إنشاء Mock Client للتطوير والاختبار:

```typescript
// في app.config.ts أو environment
useMock: true  // للتطوير
useMock: false // للإنتاج
```

**المميزات:**
- ✅ Simulate network delay (500ms)
- ✅ Simulate errors للاختبار
- ✅ Add/Remove mock translations بسهولة
- ✅ Mock data شامل من API الفعلي

### 4. ✅ تحديث Service

الـ Service الآن يدعم Mock و Real API:

```typescript
private get apiClient() {
    return this.config.useMock ? this.mockApiClient : this.realApiClient;
}
```

---

## 🎯 كيفية الاستخدام

### وضع التطوير (Mock Mode)

```typescript
// في translation-config.model.ts
export const DEFAULT_TRANSLATION_CACHE_CONFIG = {
    cacheDuration: 24 * 60 * 60 * 1000,
    useTransferState: true,
    useLocalStorage: true,
    useMock: true, // 👈 تفعيل Mock
};
```

### وضع الإنتاج (Real API)

```typescript
export const DEFAULT_TRANSLATION_CACHE_CONFIG = {
    cacheDuration: 24 * 60 * 60 * 1000,
    useTransferState: true,
    useLocalStorage: true,
    useMock: false, // 👈 استخدام API الحقيقي
};
```

---

## 📊 Mock Data

تم إضافة Mock Data شامل في `translations-mock.data.ts`:

```typescript
import { MOCK_TRANSLATIONS_DATA } from '@common/core/translations';

// استخدام في Testing
const translations = MOCK_TRANSLATIONS_DATA;
console.log(translations.ar.login); // "تسجيل الدخول"
console.log(translations.en.login); // "Login"
```

### Helper Functions

```typescript
import { getMockTranslation, hasMockTranslation } from '@common/core/translations';

// الحصول على ترجمة
const text = getMockTranslation('login', 'ar'); // "تسجيل الدخول"

// التحقق من وجود ترجمة
if (hasMockTranslation('welcome', 'en')) {
    // الترجمة موجودة
}
```

---

## 🔄 API Flow الجديد

### Server-Side (SSR)

```
1. APP_INITIALIZER → TranslationsService
2. getTranslations()
3. ├─ GET /api/translations/ar
   └─ GET /api/translations/en
4. Combine responses → { ar: {...}, en: {...} }
5. Save to TransferState
6. Render HTML with data
```

### Client-Side (Browser)

```
1. Check TransferState ✓
2. Load from TransferState
3. Save to localStorage
4. Remove from TransferState
5. App ready with translations
```

### Subsequent Visits

```
1. Check localStorage
2. Check expiration
3. If valid → Use cache
4. If expired → Fetch from API
```

---

## 🧪 Testing

### تفعيل Mock Mode للاختبار

```typescript
import { TranslationsApiMockClient } from '@common/core/translations';

// في test file
const mockClient = TestBed.inject(TranslationsApiMockClient);

// تفعيل error simulation
mockClient.configure({ simulateError: true });

// تعطيل network delay للاختبار السريع
mockClient.configure({ simulateNetworkDelay: false });

// إضافة ترجمة للاختبار
mockClient.addMockTranslation('test_key', 'Test Value', 'en');
```

---

## ⚡ Performance

### Cache Strategy

| المصدر | الأولوية | الاستخدام |
|--------|---------|-----------|
| TransferState | 1 | SSR → Browser (مرة واحدة) |
| localStorage | 2 | Browser (مع expiration) |
| API | 3 | عند عدم وجود cache أو انتهاء صلاحيته |

### Cache Duration

```typescript
cacheDuration: 24 * 60 * 60 * 1000  // 24 ساعة
```

**يمكن تغييرها إلى:**
- `12 * 60 * 60 * 1000` - 12 ساعة
- `7 * 24 * 60 * 60 * 1000` - أسبوع
- `30 * 24 * 60 * 60 * 1000` - شهر

---

## 🐛 Troubleshooting

### المشكلة: الترجمات لا تظهر

**الحل:**
1. تحقق من `useMock` في الـ config
2. تحقق من Console logs:
   ```
   [TranslationsService] Fetching translations from API
   [TranslationsService] Translations fetched and cached
   ```
3. افحص localStorage: `talbinah-translations`

### المشكلة: API Error

**الحل:**
1. تحقق من الـ endpoints في `translations-api.client.ts`
2. فعّل Mock Mode مؤقتاً:
   ```typescript
   useMock: true
   ```
3. تحقق من Network tab في DevTools

### المشكلة: Mock Data لا يعمل

**الحل:**
1. تأكد من `useMock: true` في config
2. تحقق من `translations-mock.data.ts`
3. تأكد من import الـ Mock Client:
   ```typescript
   export * from './clients/translations-api-mock.client';
   ```

---

## 📚 الملفات الجديدة

```
translations/
├── dtos/
│   └── responses/
│       └── translations-mock.data.ts          ✅ جديد
├── clients/
│   └── translations-api-mock.client.ts        ✅ جديد
├── models/
│   └── translation-config.model.ts            ✅ تم التحديث (useMock)
└── README-UPDATE.md                           ✅ جديد (هذا الملف)
```

---

## ✨ الخلاصة

تم تحديث النظام بنجاح للتكامل مع الـ API الجديد:

- ✅ يدعم API الجديد (لغة واحدة لكل request)
- ✅ يدمج الترجمات من كلا اللغتين تلقائياً
- ✅ يدعم Mock Mode للتطوير
- ✅ يحافظ على نفس الـ API للمكونات
- ✅ SSR-ready مع TransferState
- ✅ Caching ذكي مع Expiration
- ✅ Error handling كامل

**النظام جاهز للاستخدام! 🚀**

