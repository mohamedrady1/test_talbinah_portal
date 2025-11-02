# 🧪 دليل اختبار نظام الترجمات

## 📋 Quick Start Testing

### 1. اختبار في Component

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { TranslationsFacade, TranslateApiPipe } from '@common/core/translations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-translations',
  standalone: true,
  imports: [CommonModule, TranslateApiPipe],
  template: `
    <div class="test-container">
      <h2>🧪 Translations Test</h2>
      
      <!-- Test 1: Using Pipe -->
      <div class="test-section">
        <h3>Pipe Test:</h3>
        <p>{{ 'login' | translateApi }}</p>
        <p>{{ 'welcome' | translateApi }}</p>
        <p>{{ 'home' | translateApi }}</p>
      </div>

      <!-- Test 2: Using Facade -->
      <div class="test-section">
        <h3>Facade Test:</h3>
        <p>Login: {{ loginText }}</p>
        <p>Current Lang: {{ currentLang() }}</p>
        <p>Is Loading: {{ isLoading() }}</p>
      </div>

      <!-- Test 3: Language Switching -->
      <div class="test-section">
        <h3>Language Test:</h3>
        <button (click)="switchToArabic()">العربية</button>
        <button (click)="switchToEnglish()">English</button>
      </div>

      <!-- Test 4: Cache Status -->
      <div class="test-section">
        <h3>Cache Status:</h3>
        <p>Cache Valid: {{ cacheValid }}</p>
        <p>Expiration: {{ cacheExpiration | date:'medium' }}</p>
      </div>
    </div>
  `,
  styles: [`
    .test-container { padding: 20px; }
    .test-section { 
      margin: 20px 0; 
      padding: 15px; 
      border: 1px solid #ddd; 
      border-radius: 8px; 
    }
    button { 
      margin: 5px; 
      padding: 10px 20px; 
      cursor: pointer; 
    }
  `]
})
export class TestTranslationsComponent implements OnInit {
  private facade = inject(TranslationsFacade);

  loginText = '';
  cacheValid = false;
  cacheExpiration: Date | null = null;

  // Signals
  currentLang = this.facade.currentLanguage;
  isLoading = this.facade.isLoading;

  ngOnInit() {
    this.loginText = this.facade.translate('login');
    this.checkCache();
  }

  switchToArabic() {
    this.facade.setCurrentLanguage('ar');
    this.loginText = this.facade.translate('login');
  }

  switchToEnglish() {
    this.facade.setCurrentLanguage('en');
    this.loginText = this.facade.translate('login');
  }

  checkCache() {
    this.cacheValid = this.facade.isCacheValid();
    const exp = this.facade.getCacheExpiration();
    this.cacheExpiration = exp ? new Date(exp) : null;
  }
}
```

---

## 🎯 اختبار الـ Mock Mode

### تفعيل Mock

```typescript
// في translation-config.model.ts
export const DEFAULT_TRANSLATION_CACHE_CONFIG = {
    useMock: true, // 👈 تفعيل Mock
    cacheDuration: 24 * 60 * 60 * 1000,
    useTransferState: true,
    useLocalStorage: true,
};
```

### اختبار Mock Client مباشرة

```typescript
import { TestBed } from '@angular/core/testing';
import { TranslationsApiMockClient } from '@common/core/translations';

describe('Mock Translations Client', () => {
  let mockClient: TranslationsApiMockClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    mockClient = TestBed.inject(TranslationsApiMockClient);
  });

  it('should return mock data', (done) => {
    mockClient.getTranslations().subscribe(data => {
      expect(data.ar).toBeDefined();
      expect(data.en).toBeDefined();
      expect(data.ar['login']).toBe('تسجيل الدخول');
      expect(data.en['login']).toBe('Login');
      done();
    });
  });

  it('should simulate network delay', (done) => {
    const start = Date.now();
    mockClient.configure({ simulateNetworkDelay: true, networkDelayMs: 300 });
    
    mockClient.getTranslations().subscribe(() => {
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(300);
      done();
    });
  });

  it('should simulate errors', (done) => {
    mockClient.configure({ simulateError: true });
    
    mockClient.getTranslations().subscribe({
      error: (error) => {
        expect(error).toBeDefined();
        done();
      }
    });
  });
});
```

---

## 🔍 اختبار Browser Console

افتح Developer Tools Console وجرب:

```javascript
// 1. فحص localStorage
const cached = localStorage.getItem('talbinah-translations');
console.log('Cached:', JSON.parse(cached));

// 2. فحص الـ Facade
// في component مفتوح
const facade = this.facade; // inject TranslationsFacade
console.log('Current Lang:', facade.currentLanguage());
console.log('Is Initialized:', facade.isInitialized());
console.log('Translations:', facade.translationsData());

// 3. اختبار ترجمة
console.log('Login AR:', facade.translate('login', 'ar'));
console.log('Login EN:', facade.translate('login', 'en'));

// 4. فحص Cache
console.log('Cache Valid:', facade.isCacheValid());
console.log('Expires At:', new Date(facade.getCacheExpiration()));

// 5. تنظيف Cache
localStorage.removeItem('talbinah-translations');
location.reload();
```

---

## 📊 اختبار Caching

### Test 1: First Load (من API)

```typescript
// تنظيف cache أولاً
localStorage.removeItem('talbinah-translations');

// إعادة تحميل الصفحة
location.reload();

// تحقق من Console Logs:
// [TranslationsService] Fetching translations from API
// [TranslationsService] Translations fetched and cached
```

### Test 2: Second Load (من localStorage)

```typescript
// إعادة تحميل الصفحة مرة أخرى
location.reload();

// تحقق من Console Logs:
// [TranslationsService] Loaded from localStorage cache
```

### Test 3: Expiration

```typescript
// تعيين expiration قصير للاختبار
// في translation-config.model.ts
cacheDuration: 10 * 1000, // 10 ثواني

// انتظر 10 ثواني ثم reload
setTimeout(() => location.reload(), 11000);

// يجب أن يتم تحميل من API مرة أخرى
```

---

## 🌐 اختبار SSR

### Server-Side

```bash
# Build SSR
npm run build:ssr-dev

# Run SSR Server
npm run serve:ssr

# افتح في Browser
http://localhost:4000
```

### تحقق من TransferState

```html
<!-- في View Page Source -->
<script id="app-translations" type="application/json">
  {"ar":{...},"en":{...}}
</script>
```

### Console Logs

```
Server:
[TranslationsService] Fetching translations from API
[TranslationsService] Saved to TransferState

Browser:
[TranslationsService] Loaded from TransferState
[TranslationsService] Saved to localStorage cache
```

---

## 🚨 اختبار Error Handling

### Test 1: API Error

```typescript
// في Mock Client
mockClient.configure({ simulateError: true });

// أو في Real Client - عطّل الـ API
// ستحصل على fallback: { ar: {}, en: {} }
```

### Test 2: Corrupt Cache

```javascript
// في Console
localStorage.setItem('talbinah-translations', 'invalid-json');
location.reload();

// يجب أن يتم:
// 1. اكتشاف الخطأ
// 2. حذف الـ cache
// 3. تحميل من API
```

### Test 3: Missing Translations

```typescript
const text = facade.translate('non_existent_key');
console.log(text); // 'non_existent_key' (يعيد المفتاح نفسه)
```

---

## 📱 اختبار على الأجهزة المختلفة

### Desktop

```bash
npm start
# افتح http://localhost:4200
```

### Mobile (Local Network)

```bash
ng serve --host 0.0.0.0
# افتح من الموبايل: http://YOUR_IP:4200
```

### Production Build

```bash
npm run build:ssr-live
npm run serve:ssr
```

---

## ✅ Checklist

- [ ] Pipe يعمل في Templates
- [ ] Facade يعمل في TypeScript
- [ ] Mock Mode يعمل
- [ ] Real API يعمل
- [ ] TransferState يعمل (SSR)
- [ ] localStorage Cache يعمل
- [ ] Expiration يعمل
- [ ] Language Switching يعمل
- [ ] Error Handling يعمل
- [ ] Console Logs واضحة

---

## 🐛 Common Issues

### Issue: "translations not found"

```typescript
// تحقق من:
1. useMock في config
2. API endpoint صحيح
3. Console للأخطاء
```

### Issue: "Cache not working"

```typescript
// تحقق من:
1. useLocalStorage: true
2. localStorage enabled في Browser
3. Cache expiration
```

### Issue: "SSR not working"

```typescript
// تحقق من:
1. useTransferState: true
2. APP_INITIALIZER مفعّل
3. Server build نظيف
```

---

## 🎉 الخلاصة

نظام الترجمات جاهز ومختبر بالكامل! استخدم هذا الدليل للتأكد من أن كل شيء يعمل بشكل صحيح. 🚀

