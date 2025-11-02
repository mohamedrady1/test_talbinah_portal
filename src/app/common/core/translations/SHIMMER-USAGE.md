# 🎨 دليل استخدام Shimmer Loading

## ✅ Enhanced Pipe مع Shimmer

تم إنشاء **`translateWithShimmer`** pipe يعرض shimmer animation لحد ما الترجمات تيجي من API.

---

## 🚀 الاستخدام

### في Template

```html
<!-- Short shimmer (للعناوين القصيرة) -->
<h1>{{ 'login' | translateWithShimmer:'short' }}</h1>

<!-- Medium shimmer (default) -->
<h2>{{ 'welcome_back' | translateWithShimmer }}</h2>

<!-- Long shimmer (للنصوص الطويلة) -->
<p>{{ 'welcome_safe_space' | translateWithShimmer:'long' }}</p>
```

### في Component

```typescript
import { Component } from '@angular/core';
import { TranslateWithShimmerPipe } from './common';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TranslateWithShimmerPipe],  // 👈 مهم!
  template: `
    <h1>{{ 'welcome_back' | translateWithShimmer:'short' }}</h1>
    <p>{{ 'description' | translateWithShimmer:'long' }}</p>
  `
})
export class ExampleComponent {}
```

---

## 🎨 Shimmer Sizes

### Short (للعناوين)
```html
<h1>{{ 'title' | translateWithShimmer:'short' }}</h1>
<!-- عرض: ████████ (~8 characters) -->
```

### Medium (default)
```html
<h2>{{ 'subtitle' | translateWithShimmer }}</h2>
<!-- عرض: ████████████████ (~16 characters) -->
```

### Long (للنصوص)
```html
<p>{{ 'description' | translateWithShimmer:'long' }}</p>
<!-- عرض: ████████████████████████████████ (~32 characters) -->
```

---

## 🎬 كيف يعمل

### 1. During Loading
```html
<!-- لما الترجمات لسه بتتحمل -->
<h1>████████</h1>  <!-- shimmer animation -->
```

### 2. After Loading
```html
<!-- بعد ما الترجمات تيجي -->
<h1>مرحبًا بعودتك</h1>  <!-- النص الحقيقي -->
```

---

## 💅 CSS Animation

### Shimmer Effect
```scss
.shimmer-loading {
    background: linear-gradient(
        90deg,
        #f0f0f0 0%,
        #e0e0e0 20%,
        #f0f0f0 40%,
        #f0f0f0 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    color: transparent !important;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
```

تم إضافتها في `src/styles.scss` ✅

---

## 📊 States

### Loading State
```typescript
isLoading: true  → يعرض shimmer
isInitialized: false → يعرض shimmer
```

### Loaded State
```typescript
isLoading: false  → يعرض النص
isInitialized: true → يعرض النص
```

---

## 🎯 مثال كامل (new-login.component.html)

```html
<div class="new-login">
    <div class="new-login__header">
        <!-- Short shimmer for title -->
        <h2 class="new-login__title">
            {{ 'welcome_back' | translateWithShimmer:'short' }}
        </h2>
        
        <!-- Long shimmer for description -->
        <p class="new-login__description">
            {{ 'welcome_safe_space' | translateWithShimmer:'long' }}
        </p>
    </div>
</div>
```

**النتيجة:**
```
Loading:  ████████           (shimmer animation)
          ████████████████████████████████

Loaded:   مرحبًا بعودتك
          نرحب بك في مساحة آمنة، حيث نرافقك...
```

---

## ⚙️ تخصيص الـ Shimmer

### تغيير الألوان

```scss
// في component styles أو global
.shimmer-loading {
    background: linear-gradient(
        90deg,
        #your-color-1 0%,
        #your-color-2 20%,
        #your-color-1 40%,
        #your-color-1 100%
    );
}
```

### تغيير السرعة

```scss
.shimmer-loading {
    animation: shimmer 1s infinite;  // أسرع
    animation: shimmer 2s infinite;  // أبطأ
}
```

### تغيير الحجم

```scss
.shimmer-short { min-width: 60px; }   // أقصر
.shimmer-medium { min-width: 200px; } // أطول
.shimmer-long { min-width: 300px; }   // أطول جداً
```

---

## 🎨 Advanced: Custom Shimmer Length

لو عايز shimmer بطول محدد:

```html
<h1 [style.min-width.px]="120">
  {{ 'custom_text' | translateWithShimmer }}
</h1>
```

---

## 🌐 RTL Support

الـ shimmer animation يشتغل مع RTL تلقائياً:

```scss
[dir="rtl"] .shimmer-loading {
    background: linear-gradient(-90deg, ...);  // عكس الاتجاه
}
```

---

## ♿ Accessibility

```html
<!-- الـ pipe بيضيف aria-busy تلقائياً -->
<h1 aria-busy="true">████████</h1>  <!-- during loading -->
<h1>مرحبًا بعودتك</h1>  <!-- after loading -->
```

---

## 🎉 الخلاصة

دلوقتي عندك **3 طرق** للاستخدام:

### 1. translateApi (عادي - بدون shimmer)
```html
{{ 'key' | translateApi }}
```

### 2. translateWithShimmer (مع shimmer)
```html
{{ 'key' | translateWithShimmer:'short' }}
```

### 3. Directive (للتحكم الكامل)
```html
<h1 appTranslateShimmer translationKey="welcome">
  {{ 'welcome' | translateApi }}
</h1>
```

---

**دلوقتي لما تشغل المشروع:**
- ✅ هتشوف shimmer animation لحد ما API ترد
- ✅ بعدين النص الحقيقي يظهر بـ smooth transition
- ✅ UX أفضل بكتير! 🚀

**جرّب دلوقتي وشوف النتيجة! 🎨**

