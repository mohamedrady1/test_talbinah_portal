# Details For Mobile Component

## الوصف
هذا الـ component مصمم خصيصاً للـ mobile details pages مع دعم كامل للـ SSR و SEO.

## المميزات
- ✅ SSR Compatible
- ✅ SEO Friendly
- ✅ BEM Methodology
- ✅ Standalone Component
- ✅ OnPush Change Detection
- ✅ Angular 19 Compatible
- ✅ Accessibility Support
- ✅ Animation Support

## الاستخدام

### الاستخدام الأساسي
```html
<app-details-for-mobile 
  [background]="'linear-gradient(45deg, #ff6b6b, #4ecdc4)'"
  (close)="onClose()">
  
  <!-- المحتوى الخاص بك هنا -->
  <div>محتوى الصفحة</div>
  
</app-details-for-mobile>
```

### الاستخدام مع خيارات مخصصة
```html
<app-details-for-mobile 
  [background]="'#ffffff'"
  [showCloseButton]="true"
  (close)="handleClose()">
  
  <div class="custom-content">
    <h1>عنوان الصفحة</h1>
    <p>محتوى الصفحة</p>
  </div>
  
</app-details-for-mobile>
```

## Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `background` | `string` | `''` | خلفية الـ component |
| `showCloseButton` | `boolean` | `true` | إظهار/إخفاء زر الإغلاق |

## Outputs

| Event | Type | Description |
|-------|------|-------------|
| `close` | `EventEmitter<void>` | يتم إطلاقه عند الضغط على زر الإغلاق |

## الـ Styles

الـ component يستخدم الـ BEM methodology مع الـ styles التالية:

```scss
.details-for-mobile {
  display: flex;
  padding: 0 1rem 1.5rem 1rem;
  flex-direction: column;
  gap: 1.25rem;
  border-radius: 1.25rem;
}

.details-for-mobile__header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.625rem;
}

.details-for-mobile__close-btn {
  border-radius: 0.75rem;
  background: var(--Dark-50, #F6F7F8);
}

.details-for-mobile__content {
  padding: 0.75rem 1rem;
}
```

## الـ Animations

الـ component يدعم الـ animations التالية:

```scss
.details-for-mobile--slide-in {
  animation: slideInRight 0.3s ease-out;
}

.details-for-mobile--slide-out {
  animation: slideOutRight 0.3s ease-in;
}
```

## مثال كامل للاستخدام

```typescript
// في الـ component الخاص بك
import { DetailsForMobileComponent } from '@shared/components';

@Component({
  selector: 'app-my-page',
  standalone: true,
  imports: [DetailsForMobileComponent],
  template: `
    <app-details-for-mobile 
      [background]="pageBackground"
      (close)="navigateBack()">
      
      <div class="page-content">
        <h1>{{ pageTitle }}</h1>
        <p>{{ pageContent }}</p>
      </div>
      
    </app-details-for-mobile>
  `
})
export class MyPageComponent {
  pageBackground = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  
  navigateBack(): void {
    // منطق العودة للصفحة السابقة
    this.router.navigate(['/previous-page']);
  }
}
``` 