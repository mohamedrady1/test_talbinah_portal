# LazyLoadImageDirective

## نظرة عامة

`LazyLoadImageDirective` هو directive مخصص لتحميل الصور بشكل lazy مع دعم SSR ومعالجة أخطاء متقدمة.

## المميزات

### ✅ Lazy Loading
- تحميل الصور فقط عند ظهورها في viewport
- استخدام IntersectionObserver API
- fallback للمتصفحات القديمة

### ✅ Server-Side Rendering (SSR)
- دعم كامل للـ SSR
- تحميل مباشر للصور على الخادم للـ SEO
- إعداد `ssrFallback` للتحكم في السلوك

### ✅ معالجة الأخطاء المتقدمة
- placeholder للصور البديلة
- مصفوفة fallback images متعددة
- تسجيل الأخطاء في console

### ✅ تحسين الأداء
- منع التحميل المتكرر
- تنظيف الذاكرة عند destroy
- تحسين Core Web Vitals

## الاستخدام

### الاستخدام الأساسي
```html
<img 
  appLazyLoadImage="path/to/image.jpg"
  alt="وصف الصورة"
  ngOptimizedImage
  width="200"
  height="200"
/>
```

### مع placeholder
```html
<img 
  appLazyLoadImage="path/to/image.jpg"
  placeholder="path/to/placeholder.jpg"
  alt="وصف الصورة"
  ngOptimizedImage
  width="200"
  height="200"
/>
```

### مع fallback images متعددة
```html
<img 
  appLazyLoadImage="path/to/image.jpg"
  [fallbackImages]="['fallback1.jpg', 'fallback2.jpg', 'fallback3.jpg']"
  placeholder="default-placeholder.jpg"
  alt="وصف الصورة"
  ngOptimizedImage
  width="200"
  height="200"
/>
```

### إعدادات متقدمة
```html
<img 
  appLazyLoadImage="path/to/image.jpg"
  placeholder="path/to/placeholder.jpg"
  [threshold]="0.5"
  rootMargin="100px"
  [ssrFallback]="true"
  [fallbackImages]="['fallback1.jpg', 'fallback2.jpg']"
  alt="وصف الصورة"
  ngOptimizedImage
  width="200"
  height="200"
/>
```

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `appLazyLoadImage` | `string` | - | رابط الصورة المطلوب |
| `placeholder` | `string` | `'assets/placeholder-image.jpg'` | صورة placeholder |
| `threshold` | `number` | `0.1` | نسبة الظهور المطلوبة (0-1) |
| `rootMargin` | `string` | `'50px'` | هامش إضافي حول viewport |
| `ssrFallback` | `boolean` | `true` | تحميل مباشر في SSR |
| `fallbackImages` | `string[]` | `[]` | مصفوفة صور fallback |

## CSS Classes

### حالات التحميل
```scss
// حالة التحميل
img.lazy-loading {
  opacity: 0.3;
  filter: blur(2px);
}

// حالة التحميل المكتمل
img.lazy-loaded {
  opacity: 1;
  filter: blur(0);
}

// حالة الخطأ
img.lazy-error {
  opacity: 0.5;
  filter: grayscale(100%);
}
```

### Animation
```scss
// مؤشر التحميل
.lazy-loading::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## Public Methods

### `loadImageNow()`
```typescript
// تحميل الصورة فوراً
@ViewChild('myImage') imageElement!: ElementRef;
this.imageElement.nativeElement.loadImageNow();
```

### `isLoaded()`
```typescript
// التحقق من حالة التحميل
@ViewChild('myImage') imageElement!: ElementRef;
const isLoaded = this.imageElement.nativeElement.isLoaded();
```

## معالجة الأخطاء

### تسلسل Fallback
1. **الصورة الأصلية**: `appLazyLoadImage`
2. **Fallback Images**: `fallbackImages` array
3. **Placeholder**: `placeholder`
4. **حالة خطأ**: CSS class `lazy-error`

### مثال على معالجة الأخطاء
```html
<img 
  appLazyLoadImage="user-profile.jpg"
  [fallbackImages]="[
    'user-profile-fallback1.jpg',
    'user-profile-fallback2.jpg'
  ]"
  placeholder="default-avatar.jpg"
  alt="صورة المستخدم"
  ngOptimizedImage
  width="50"
  height="50"
/>
```

## SSR Support

### السلوك الافتراضي
- **SSR**: تحميل مباشر للصورة الأصلية
- **Client**: lazy loading مع fallback

### تخصيص السلوك
```html
<!-- تعطيل SSR fallback -->
<img 
  appLazyLoadImage="image.jpg"
  [ssrFallback]="false"
  placeholder="placeholder.jpg"
  alt="صورة"
/>
```

## أمثلة عملية

### صورة المستخدم مع fallback
```html
<img 
  appLazyLoadImage="{{ userInfoConfig.image }}"
  [fallbackImages]="[
    'images/not-found/no-woman-doctor.svg',
    'images/not-found/no-doctor.svg'
  ]"
  placeholder="images/not-found/default-avatar.svg"
  [alt]="userInfoConfig.full_name"
  ngOptimizedImage
  width="24"
  height="24"
  priority
/>
```

### صورة المنتج مع placeholder
```html
<img 
  appLazyLoadImage="{{ product.image }}"
  placeholder="images/products/placeholder.jpg"
  [alt]="product.name"
  ngOptimizedImage
  width="200"
  height="200"
/>
```

### صورة المقال مع إعدادات متقدمة
```html
<img 
  appLazyLoadImage="{{ article.featuredImage }}"
  [fallbackImages]="[
    article.thumbnail,
    'images/articles/default.jpg'
  ]"
  placeholder="images/articles/placeholder.jpg"
  [threshold]="0.2"
  rootMargin="100px"
  [alt]="article.title"
  ngOptimizedImage
  width="400"
  height="300"
  priority
/>
```

## استكشاف الأخطاء

### الصورة لا تظهر
- تحقق من صحة رابط الصورة
- تأكد من وجود placeholder
- راجع console للأخطاء

### Lazy loading لا يعمل
- تأكد من دعم IntersectionObserver
- تحقق من إعدادات threshold و rootMargin
- راجع أن الصورة في viewport

### مشاكل في SSR
- تأكد من إعداد `ssrFallback="true"`
- تحقق من أن الصور متاحة على الخادم
- راجع server logs للأخطاء

### Fallback لا يعمل
- تحقق من صحة روابط fallback images
- تأكد من وجود placeholder
- راجع console للأخطاء

## الأداء المتوقع

- ✅ **تحسين LCP**: تحسين Largest Contentful Paint
- ✅ **تحسين CLS**: منع Cumulative Layout Shift
- ✅ **تقليل استهلاك البيانات**: تحميل الصور عند الحاجة فقط
- ✅ **تحسين الذاكرة**: تحرير الذاكرة للصور غير المرئية
- ✅ **تحسين SEO**: صور محسنة للـ crawlers
- ✅ **تجربة مستخدم أفضل**: تحميل سريع مع fallback ذكي 