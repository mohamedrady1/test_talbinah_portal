# Notification Service - دليل الاستخدام

## نظرة عامة
نظام الإشعارات الجديد مصمم بشكل مشابه لإشعارات فيسبوك، يظهر في الأسفل على اليمين ويدعم الانتقال التلقائي للصفحات حسب نوع الإشعار.

## الميزات الرئيسية
- ✅ تصميم حديث شبيه بفيسبوك
- ✅ يظهر في الأسفل على اليمين
- ✅ يدعم RTL و LTR
- ✅ انتقال تلقائي للصفحات حسب النوع
- ✅ أيقونة قابلة للتخصيص (افتراضياً: logo-2.png)
- ✅ مؤقت تلقائي للاختفاء
- ✅ أنيميشن سلس
- ✅ Responsive

## طريقة الاستخدام

### 1. استيراد الخدمة
```typescript
import { NotificationService } from './shared';

export class YourComponent {
  private notificationService = inject(NotificationService);
}
```

### 2. إضافة إشعار بسيط
```typescript
this.notificationService.add({
  title: 'تم بنجاح',
  body: 'تم حفظ البيانات بنجاح',
  type: 'success',
  life: 5000 // اختياري، الافتراضي 8000ms
});
```

### 3. إشعار مع انتقال تلقائي
```typescript
this.notificationService.add({
  title: 'رسالة جديدة',
  body: 'لديك رسالة جديدة من الدكتور أحمد',
  type: 'new_message',
  icon: 'images/icons/logo-2.png', // اختياري
  life: 8000,
  data: {
    url: '/messages', // سينتقل تلقائياً عند الضغط على الإشعار
    messageId: 123
  }
});
```

### 4. أنواع الإشعارات المتاحة
```typescript
type NotificationType = 
  // Navigation Types (with specific page routing)
  | 'session_reminder'  // ينتقل إلى /appointments
  | 'new_message'       // ينتقل إلى /messages
  | 'appointment'       // ينتقل إلى /appointments
  | 'reservation'       // ينتقل إلى /appointments (لون: Pink #e91e63)
  | 'podcast'           // ينتقل إلى /podcasts (لون: Orange #ff6b35)
  | 'community'         // ينتقل إلى /talbinah-community (لون: Cyan #00bcd4)
  | 'task'              // ينتقل إلى /appointments/session (لون: Amber #ffc107)
  | 'offer'             // ينتقل إلى /therapeutic-programs (لون: Green #4caf50)
  
  // Status Types
  | 'general'           // يمكن تحديد URL مخصص في data (لون: Gray)
  | 'success'           // للنجاح (لون: Green #47af73)
  | 'warning'           // للتحذير (لون: Yellow #f6c23e)
  | 'error'             // للأخطاء (لون: Red #ff4d4f)
  | 'info';             // للمعلومات (لون: Blue #477cd2)
```

## أمثلة متقدمة

### مثال 1: إشعار تذكير بجلسة
```typescript
this.notificationService.add({
  title: 'تذكير بالجلسة',
  body: 'لديك جلسة مع الدكتور محمد بعد 15 دقيقة',
  type: 'session_reminder',
  icon: 'images/doctors/doctor-1.png',
  life: 10000,
  data: {
    sessionId: 456
  }
});
```

### مثال 2: إشعار رسالة جديدة
```typescript
this.notificationService.add({
  title: 'رسالة جديدة',
  body: 'الدكتور أحمد: شكراً على تواصلك معنا',
  type: 'new_message',
  data: {
    messageId: 789,
    senderId: 101
  }
});
```

### مثال 3: إشعار عام مع URL مخصص
```typescript
this.notificationService.add({
  title: 'عرض جديد',
  body: 'لديك خصم 20% على جلسة الاستشارة',
  type: 'general',
  data: {
    url: '/offers/special-discount'
  }
});
```

### مثال 4: إشعار نجاح بعد عملية
```typescript
this.notificationService.add({
  title: 'تم الحفظ',
  body: 'تم حفظ التغييرات بنجاح',
  type: 'success',
  life: 3000
});
```

### مثال 5: إشعار خطأ
```typescript
this.notificationService.add({
  title: 'حدث خطأ',
  body: 'فشل في حفظ البيانات، يرجى المحاولة مرة أخرى',
  type: 'error',
  life: 6000
});
```

### مثال 6: إشعار حجز جديد (Reservation)
```typescript
this.notificationService.add({
  title: 'حجز جديد',
  body: 'تم تأكيد حجزك مع الدكتور أحمد يوم السبت 10 صباحاً',
  type: 'reservation',
  data: {
    reservationId: 123
  }
});
// سينتقل إلى: /appointments/123
```

### مثال 7: إشعار بودكاست جديد (Podcast)
```typescript
this.notificationService.add({
  title: 'بودكاست جديد',
  body: 'تم إضافة حلقة جديدة: كيف تتعامل مع القلق',
  type: 'podcast',
  icon: 'images/podcast/new-episode.png',
  data: {
    podcastId: 456
  }
});
// سينتقل إلى: /podcasts?id=456
```

### مثال 8: إشعار منشور في المجتمع (Community)
```typescript
this.notificationService.add({
  title: 'تفاعل جديد',
  body: 'أحمد علق على منشورك في المجتمع',
  type: 'community',
  data: {
    postId: 789,
    userId: 101
  }
});
// سينتقل إلى: /talbinah-community?postId=789
```

### مثال 9: إشعار مهمة جديدة (Task)
```typescript
this.notificationService.add({
  title: 'مهمة جديدة',
  body: 'لديك مهمة جديدة من جلستك الأخيرة',
  type: 'task',
  data: {
    sessionId: 555,
    taskId: 888
  }
});
// سينتقل إلى: /appointments/session/555
```

### مثال 10: إشعار عرض خاص (Offer)
```typescript
this.notificationService.add({
  title: 'عرض خاص! 🎉',
  body: 'احصل على خصم 30% على البرنامج العلاجي الشامل',
  type: 'offer',
  life: 10000,
  data: {
    offerId: 999,
    discountPercentage: 30
  }
});
// سينتقل إلى: /therapeutic-programs?offerId=999
```

## التخصيص

### تغيير الأيقونة الافتراضية
الأيقونة الافتراضية هي `images/icons/logo-2.png`، يمكنك تغييرها لكل إشعار:
```typescript
this.notificationService.add({
  title: 'عنوان',
  body: 'محتوى',
  icon: 'images/custom-icon.png' // أيقونة مخصصة
});
```

### تغيير وقت الظهور
```typescript
this.notificationService.add({
  title: 'عنوان',
  body: 'محتوى',
  life: 15000 // 15 ثانية
});
```

### إزالة إشعار محدد
```typescript
const notificationId = 5;
this.notificationService.remove(notificationId);
```

### مسح جميع الإشعارات
```typescript
this.notificationService.clear();
```

## الاستخدام في Firebase Notifications

تم دمج النظام مع Firebase في `app.component.ts`:

```typescript
private handleNotificationPayload(payload: any) {
  const title = payload?.data?.title || 'Notification';
  const body = payload?.data?.body || '';
  const notificationType = payload?.data?.type || 'general';

  // Play notification sound
  this._NotificationSoundService.playNotificationSound(0.3);

  // Show Facebook-style notification
  this._NotificationService.add({
    title: title,
    body: body,
    type: notificationType,
    icon: 'images/icons/logo-2.png',
    life: 8000,
    data: payload?.data
  });
}
```

## الموقع والتصميم
- الموقع: **أسفل يمين الشاشة** (أو أسفل يسار في وضع RTL)
- التصميم: كارت أبيض مع ظل خفيف
- الأنيميشن: يظهر من الأسفل مع حركة سلسة
- الألوان: حسب نوع الإشعار (أزرق للرسائل، أخضر للنجاح، إلخ)

## ملاحظات مهمة
1. النظام يدعم عدة إشعارات في نفس الوقت
2. الإشعارات تتراص من الأسفل للأعلى
3. كل إشعار يختفي تلقائياً بعد انتهاء وقته
4. يمكن إغلاق الإشعار يدوياً بالضغط على زر الإغلاق (X)
5. الضغط على الإشعار ينقلك للصفحة المناسبة ويغلق الإشعار
6. النظام Responsive ويتكيف مع الشاشات الصغيرة

## الفرق بين Toast و Notification
| الميزة | Toast | Notification |
|--------|-------|--------------|
| الموقع | أعلى يسار | أسفل يمين |
| التصميم | شفاف مع blur | أبيض صلب |
| الاستخدام | رسائل نظام | إشعارات مهمة |
| التفاعل | عرض فقط | انتقال للصفحة |
| الأيقونة | أيقونات ثابتة | لوجو التطبيق |

## مثال كامل للاستخدام
```typescript
import { Component, inject } from '@angular/core';
import { NotificationService } from './shared';

@Component({
  selector: 'app-example',
  template: `
    <button (click)="showNotification()">إظهار إشعار</button>
  `
})
export class ExampleComponent {
  private notificationService = inject(NotificationService);

  showNotification() {
    this.notificationService.add({
      title: 'مرحباً!',
      body: 'هذا إشعار تجريبي بتصميم فيسبوك',
      type: 'info',
      icon: 'images/icons/logo-2.png',
      life: 8000,
      data: {
        url: '/dashboard'
      }
    });
  }
}
```

