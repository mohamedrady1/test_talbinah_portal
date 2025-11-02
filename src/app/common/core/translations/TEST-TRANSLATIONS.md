# اختبار نظام الترجمات

## 🧪 طرق الاختبار

### 1. فحص في Browser Console
```javascript
// افتح Console واكتب:
const facade = window.ng?.getComponent(document.body)?.injector?.get('TranslationsFacade');

// أو بطريقة أسهل - في أي Component:
console.log(inject(TranslationsFacade).translationsData());
console.log(inject(TranslationsFacade).currentLanguage());
console.log(inject(TranslationsFacade).isInitialized());
```

### 2. اختبار في Component
```typescript
import { Component, inject } from '@angular/core';
import { TranslationsFacade } from '@common/core/translations';

@Component({
  selector: 'app-test',
  template: `
    <div>
      <h1>{{ 'about_consultant' | translateApi }}</h1>
      <button (click)="testTranslations()">Test</button>
    </div>
  `
})
export class TestComponent {
  private facade = inject(TranslationsFacade);

  testTranslations() {
    console.log('=== Translations Test ===');
    console.log('Initialized:', this.facade.isInitialized());
    console.log('Current Lang:', this.facade.currentLanguage());
    console.log('Data:', this.facade.translationsData());
    console.log('Translation:', this.facade.translate('about_consultant'));
    console.log('Cache Valid:', this.facade.isCacheValid());
  }
}
```

### 3. فحص الـ Network Request

**في DevTools → Network:**
1. افتح الصفحة
2. ابحث عن `translations` في الـ Filter
3. شوف الـ Request:
   - URL: `https://api.dev.talbinah.net/api/translations`
   - Method: `GET`
   - Headers: `talbinah-token: s4kl2fC852tSpczXsdAJIH6fORLbgG4zfwVJVjLlolop74kUUyT0aYRxZSGAQXRB`

**Expected Response:**
```json
{
  "status": true,
  "message": null,
  "data": {
    "about_consultant": "نبذة عن المستشار",
    "login": "تسجيل الدخول",
    // ... الخ
  }
}
```

### 4. فحص الـ localStorage

```javascript
// في Console:
const cache = localStorage.getItem('talbinah-translations');
console.log(JSON.parse(cache));
```

**Expected Structure:**
```json
{
  "data": {
    "ar": { /* ترجمات عربي */ },
    "en": { /* ترجمات انجليزي */ }
  },
  "timestamp": 1234567890,
  "expiresAt": 1234654290
}
```

---

## 🔍 Signs البيانات شغالة

✅ **مؤشرات نجاح:**
1. في Console: `[TranslationsFacade] Translations loaded successfully`
2. في Network: Status 200 للـ `/api/translations`
3. الترجمات تظهر في الصفحة بدل المفاتيح
4. localStorage فيه `talbinah-translations`

❌ **مؤشرات مشكلة:**
1. في Console: `[TranslationsService] Failed to fetch translations`
2. في Network: Status 401 أو 404
3. الصفحة تعرض المفاتيح بدل الترجمات: `about_consultant`
4. localStorage فارغ

---

## 🛠️ حل المشاكل

### المشكلة: API ما بيستدعي

**السبب المحتمل:**
- الـ initializer مش مفعل
- الـ token غلط
- الـ endpoint غلط

**الحل:**
```typescript
// تحقق من app.config.ts
{
  provide: APP_INITIALIZER,
  useFactory: translationsInitializerFactory,
  multi: true,
}

// تحقق من translations-api.client.ts
private readonly talbinah_token = 's4kl2fC852tSpczXsdAJIH6fORLbgG4zfwVJVjLlolop74kUUyT0aYRxZSGAQXRB';
const endpoint = `${this.apiUrl}/api/translations`;
```

### المشكلة: البيانات مش بتظهر

**الحل:**
```typescript
// امسح الـ cache وأعد التحميل
const facade = inject(TranslationsFacade);
facade.refresh().subscribe(data => {
  console.log('Refreshed:', data);
});
```

### اختبار مع Mock Data

```typescript
// في translation-config.model.ts
export const DEFAULT_TRANSLATION_CACHE_CONFIG = {
  cacheDuration: 24 * 60 * 60 * 1000,
  useTransferState: true,
  useLocalStorage: true,
  useMock: true, // 👈 فعّل هنا للاختبار
};
```

---

## 📊 Expected Behavior

1. **عند فتح التطبيق لأول مرة:**
   - API Call → Response → Save to localStorage → App Ready

2. **عند فتح التطبيق مرة أخرى (خلال 24 ساعة):**
   - localStorage → App Ready (No API Call)

3. **بعد 24 ساعة:**
   - Cache Expired → API Call → New Response → Update localStorage

4. **عند تغيير اللغة:**
   - TranslationsFacade.setCurrentLanguage() → Update UI

---

## 🎯 Quick Test Checklist

- [ ] Console يعرض initialization logs
- [ ] Network tab يعرض successful request
- [ ] localStorage فيه `talbinah-translations`
- [ ] الترجمات تظهر في UI
- [ ] تغيير اللغة يعمل
- [ ] Cache expiration يشتغل

