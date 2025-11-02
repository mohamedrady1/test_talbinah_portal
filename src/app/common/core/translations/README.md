# نظام الترجمات من API

نظام متكامل لإدارة الترجمات من API مع دعم كامل لـ SSR، Caching، وExpiration.

## المميزات

✅ **تحميل تلقائي عند بدء التطبيق**: يتم تحميل الترجمات مرة واحدة عند بدء التطبيق باستخدام `APP_INITIALIZER`  
✅ **دعم SSR كامل**: استخدام `TransferState` لنقل البيانات من Server إلى Client  
✅ **Caching ذكي مع Expiration**: تخزين الترجمات في localStorage مع فترة صلاحية (24 ساعة افتراضياً)  
✅ **Pipe سهل الاستخدام**: `translateApi` pipe للاستخدام المباشر في Templates  
✅ **Facade Pattern**: واجهة موحدة للوصول للترجمات  
✅ **دعم Nested Keys**: مفاتيح متداخلة باستخدام dot notation (مثل: `home.welcome.title`)  
✅ **تبديل اللغات**: تزامن تلقائي مع `AppLanguageService`  
✅ **Error Handling**: معالجة أخطاء API بدون تعطيل التطبيق  

---

## البنية

```
translations/
├── clients/                    # API Clients
│   ├── i-translations-api.client.ts
│   └── translations-api.client.ts
├── dtos/                       # Data Transfer Objects
│   └── responses/
│       └── i-translations-api.response.ts
├── models/                     # Models & Configs
│   └── translation-config.model.ts
├── services/                   # Services & Facade
│   ├── translations.service.ts
│   └── translations.facade.ts
├── pipes/                      # Pipes
│   └── translate-api.pipe.ts
├── initializers/               # APP_INITIALIZER
│   └── translations.initializer.ts
├── index.ts                    # Barrel exports
└── README.md                   # هذا الملف
```

---

## الإعداد

### 1. تحديث API Endpoint

في ملف `translations-api.client.ts`:

```typescript
getTranslations(): Observable<ITranslationsApiResponse> {
  const endpoint = `${this.apiUrl}/translations`; // 👈 عدل هذا الـ endpoint
  return this.httpClient.get<ITranslationsApiResponse>(endpoint);
}
```

### 2. شكل Response المتوقع من الـ API

```typescript
{
  "success": true,
  "message": "Translations fetched successfully",
  "data": {
    "ar": {
      "home": {
        "welcome": {
          "title": "مرحباً بك",
          "subtitle": "في موقعنا"
        }
      },
      "auth": {
        "login": "تسجيل الدخول",
        "logout": "تسجيل الخروج"
      }
    },
    "en": {
      "home": {
        "welcome": {
          "title": "Welcome",
          "subtitle": "To our website"
        }
      },
      "auth": {
        "login": "Login",
        "logout": "Logout"
      }
    }
  }
}
```

### 3. التكوين تم بالفعل في `app.config.ts`

```typescript
{
  provide: APP_INITIALIZER,
  useFactory: translationsInitializerFactory,
  multi: true,
}
```

---

## الاستخدام

### 1. استخدام Pipe في Templates

#### استخدام بسيط

```html
<h1>{{ 'home.welcome.title' | translateApi }}</h1>
<p>{{ 'home.welcome.subtitle' | translateApi }}</p>
<button>{{ 'auth.login' | translateApi }}</button>
```

#### تحديد اللغة يدوياً

```html
<!-- عرض الترجمة العربية بغض النظر عن اللغة الحالية -->
<h1>{{ 'home.welcome.title' | translateApi:'ar' }}</h1>

<!-- عرض الترجمة الإنجليزية -->
<h1>{{ 'home.welcome.title' | translateApi:'en' }}</h1>
```

#### استخدام في Attributes

```html
<input 
  type="text" 
  [placeholder]="'auth.email.placeholder' | translateApi"
  [aria-label]="'auth.email.label' | translateApi"
/>

<img 
  [src]="imageUrl" 
  [alt]="'home.hero.image.alt' | translateApi"
/>
```

#### استخدام في *ngIf

```html
<div *ngIf="showMessage">
  {{ 'messages.success' | translateApi }}
</div>
```

---

### 2. استخدام Facade في Component

#### Standalone Component

```typescript
import { Component, inject } from '@angular/core';
import { TranslationsFacade, TranslateApiPipe } from '@common/core/translations';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TranslateApiPipe], // 👈 استيراد الـ Pipe
  template: `
    <h1>{{ 'home.title' | translateApi }}</h1>
    <p>{{ translatedText }}</p>
  `
})
export class ExampleComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  // الحصول على ترجمة في TypeScript
  translatedText = this.translationsFacade.translate('home.welcome.subtitle');
  
  // أو باستخدام Signal
  currentLang = this.translationsFacade.currentLanguage();
  
  onButtonClick() {
    const text = this.translationsFacade.translate('auth.login');
    console.log(text);
  }
}
```

#### استخدام مع Signals

```typescript
import { Component, inject, computed } from '@angular/core';
import { TranslationsFacade } from '@common/core/translations';

@Component({
  selector: 'app-dynamic',
  standalone: true,
  template: `
    <h1>{{ pageTitle() }}</h1>
    <p>Current Language: {{ currentLang() }}</p>
  `
})
export class DynamicComponent {
  private readonly facade = inject(TranslationsFacade);
  
  // Signals من الـ Facade
  currentLang = this.facade.currentLanguage();
  isLoading = this.facade.isLoading();
  
  // Computed signal للترجمة الديناميكية
  pageTitle = computed(() => 
    this.facade.translate('pages.dashboard.title')
  );
}
```

---

### 3. الحصول على جميع ترجمات اللغة

```typescript
const arTranslations = this.translationsFacade.getLanguageTranslations('ar');
const enTranslations = this.translationsFacade.getLanguageTranslations('en');
```

---

### 4. التحقق من وجود مفتاح ترجمة

```typescript
if (this.translationsFacade.hasTranslation('home.welcome.title')) {
  // المفتاح موجود
}
```

---

### 5. إعادة تحميل الترجمات (Force Refresh)

```typescript
// حذف الـ cache وتحميل من API
this.translationsFacade.refresh().subscribe(data => {
  console.log('Translations refreshed', data);
});
```

---

### 6. التحقق من صلاحية الـ Cache

```typescript
if (this.translationsFacade.isCacheValid()) {
  console.log('Cache is still valid');
} else {
  console.log('Cache expired');
}

// الحصول على وقت انتهاء الـ Cache
const expiration = this.translationsFacade.getCacheExpiration();
if (expiration) {
  console.log('Cache expires at:', new Date(expiration));
}
```

---

## التكوينات المتقدمة

### تغيير مدة الـ Cache

في ملف `translation-config.model.ts`:

```typescript
export const DEFAULT_TRANSLATION_CACHE_CONFIG: ITranslationCacheConfig = {
  cacheDuration: 24 * 60 * 60 * 1000, // 24 ساعة (بالميلي ثانية)
  useTransferState: true,
  useLocalStorage: true,
};
```

يمكنك تغيير `cacheDuration` إلى:
- `12 * 60 * 60 * 1000` - 12 ساعة
- `7 * 24 * 60 * 60 * 1000` - أسبوع
- `30 * 24 * 60 * 60 * 1000` - شهر

---

## آلية العمل

### 1. عند بدء التطبيق

```
1. APP_INITIALIZER يستدعي translationsInitializerFactory()
2. TranslationsFacade.initialize()
3. TranslationsService يتحقق من:
   a. TransferState (SSR) ✅
   b. localStorage Cache (مع فحص expiration) ✅
   c. API Call (إذا لم تتوفر البيانات)
4. حفظ البيانات في:
   - TransferState (للـ SSR)
   - localStorage (للـ Browser)
```

### 2. عند تحميل الصفحة في الـ Browser

```
1. TransferState يحتوي على البيانات من الـ Server
2. يتم قراءة البيانات وحذفها من TransferState
3. يتم حفظ البيانات في localStorage مع expiration
4. التطبيق جاهز للاستخدام فوراً بدون انتظار API
```

### 3. عند إعادة زيارة الموقع

```
1. التحقق من localStorage
2. إذا كان Cache صالح → استخدامه مباشرة
3. إذا كان Cache منتهي → استدعاء API وتحديث Cache
```

---

## SSR Considerations

### Server-Side

```typescript
// في الـ Server، الترجمات يتم:
1. تحميلها من API
2. حفظها في TransferState
3. إرسالها مع الـ HTML للمتصفح
```

### Client-Side

```typescript
// في الـ Browser، الترجمات يتم:
1. قراءتها من TransferState (أول مرة فقط)
2. حفظها في localStorage
3. إعادة استخدامها من localStorage في الزيارات القادمة
```

---

## أمثلة متقدمة

### استخدام في Guard

```typescript
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationsFacade } from '@common/core/translations';
import { ToastService } from '@shared';

export const translationsLoadedGuard = () => {
  const facade = inject(TranslationsFacade);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (!facade.isInitialized()) {
    const errorMsg = facade.translate('errors.translations_not_loaded');
    toast.showError(errorMsg);
    return router.createUrlTree(['/loading']);
  }

  return true;
};
```

### استخدام في Resolver

```typescript
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TranslationsFacade } from '@common/core/translations';
import { of } from 'rxjs';

export const pageTranslationsResolver: ResolveFn<any> = () => {
  const facade = inject(TranslationsFacade);
  
  return facade.isInitialized() 
    ? of(facade.translationsData()) 
    : facade.initialize();
};
```

### استخدام في Custom Directive

```typescript
import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';
import { TranslationsFacade } from '@common/core/translations';

@Directive({
  selector: '[appTranslate]',
  standalone: true
})
export class TranslateDirective implements OnInit {
  @Input('appTranslate') key!: string;
  
  private readonly el = inject(ElementRef);
  private readonly facade = inject(TranslationsFacade);

  ngOnInit() {
    const text = this.facade.translate(this.key);
    this.el.nativeElement.textContent = text;
  }
}
```

---

## Debugging

### تفعيل Logging

جميع العمليات مسجلة باستخدام `Logger`:

```typescript
// في Developer Console ستشاهد:
[TranslationsInitializer] Starting translations initialization
[TranslationsService] Loaded from TransferState
[TranslationsService] Saved to localStorage cache
[TranslationsFacade] Translations loaded successfully
[TranslationsFacade] Language changed to ar
```

### فحص الـ Cache

```typescript
// في Console
const facade = inject(TranslationsFacade);

// فحص البيانات
console.log(facade.translationsData());

// فحص اللغة الحالية
console.log(facade.currentLanguage());

// فحص صلاحية الـ Cache
console.log(facade.isCacheValid());

// فحص وقت انتهاء الـ Cache
console.log(new Date(facade.getCacheExpiration()!));
```

---

## Error Handling

النظام يتعامل مع جميع الأخطاء المحتملة:

✅ **فشل API Call**: يعيد object فارغ `{ ar: {}, en: {} }` لمنع تعطيل التطبيق  
✅ **Cache corrupted**: يحذف الـ cache ويحاول تحميل من API  
✅ **مفتاح ترجمة غير موجود**: يعيد المفتاح نفسه  
✅ **TransferState فارغ**: ينتقل تلقائياً إلى localStorage ثم API  

---

## Migration من ngx-translate

### قبل

```html
<h1>{{ 'home.welcome.title' | translate }}</h1>
```

```typescript
this.translate.instant('home.welcome.title');
```

### بعد

```html
<h1>{{ 'home.welcome.title' | translateApi }}</h1>
```

```typescript
this.translationsFacade.translate('home.welcome.title');
```

---

## Performance

⚡ **سريع**: تحميل مرة واحدة فقط عند بدء التطبيق  
⚡ **SSR Optimized**: بيانات الترجمات تأتي مع الـ HTML  
⚡ **Caching**: localStorage يمنع استدعاءات API المتكررة  
⚡ **Lazy Loading**: Pipe يستخدم ChangeDetectionStrategy.OnPush  

---

## Best Practices

1. ✅ استخدم الـ Pipe في Templates
2. ✅ استخدم الـ Facade في TypeScript
3. ✅ لا تستدعي API يدوياً (النظام يديرها تلقائياً)
4. ✅ استخدم nested keys للتنظيم (`home.welcome.title`)
5. ✅ تأكد من API Response يطابق الـ Interface

---

## Troubleshooting

### المشكلة: الترجمات لا تظهر

**الحل:**
1. تحقق من API endpoint في `translations-api.client.ts`
2. تحقق من Console للأخطاء
3. تحقق من localStorage (`talbinah-translations`)
4. استخدم `facade.refresh()` لإعادة التحميل

### المشكلة: الترجمات لا تتحدث عند تغيير اللغة

**الحل:**
- `AppLanguageService` يتزامن تلقائياً مع `TranslationsFacade`
- تأكد من استدعاء `setDirection()` عند تغيير اللغة

### المشكلة: Cache لا ينتهي

**الحل:**
- تحقق من `cacheDuration` في `translation-config.model.ts`
- استخدم `facade.forceRefresh()` لحذف الـ cache يدوياً

---

## الخلاصة

نظام الترجمات من API جاهز للاستخدام الآن! 🎉

- ✅ يحمل تلقائياً عند بدء التطبيق
- ✅ يدعم SSR بشكل كامل
- ✅ يخزن الترجمات مع expiration
- ✅ سهل الاستخدام في Templates و TypeScript
- ✅ يتكامل تماماً مع النظام الحالي

أي أسئلة؟ راجع الأمثلة أعلاه أو Console Logs! 📖


