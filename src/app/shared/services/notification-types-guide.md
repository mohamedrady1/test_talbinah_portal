# دليل أنواع الإشعارات - Notification Types Guide

## جدول الأنواع والألوان والمسارات

| النوع (Type) | اللون (Color) | المسار (Route) | الاستخدام |
|-------------|--------------|---------------|-----------|
| `reservation` | 🔴 Pink `#e91e63` | `/appointments` أو `/appointments/:id` | حجوزات ومواعيد جديدة |
| `podcast` | 🟠 Orange `#ff6b35` | `/podcasts` أو `/podcasts?id=:id` | بودكاست جديد أو حلقة جديدة |
| `community` | 🔵 Cyan `#00bcd4` | `/talbinah-community` | منشورات وتفاعلات المجتمع |
| `task` | 🟡 Amber `#ffc107` | `/appointments/session/:id` | مهام من الجلسات |
| `offer` | 🟢 Green `#4caf50` | `/therapeutic-programs` | عروض وخصومات |
| `session_reminder` | 🔵 Blue `#1877f2` | `/appointments` | تذكير بجلسة قادمة |
| `new_message` | 🟢 Green `#06c755` | `/messages` | رسالة جديدة |
| `appointment` | 🟣 Purple `#9b59b6` | `/appointments` | موعد عام |
| `success` | ✅ Green `#47af73` | حسب `data.url` | رسالة نجاح |
| `warning` | ⚠️ Yellow `#f6c23e` | حسب `data.url` | تحذير |
| `error` | ❌ Red `#ff4d4f` | حسب `data.url` | خطأ |
| `info` | ℹ️ Blue `#477cd2` | حسب `data.url` | معلومة |
| `general` | ⚪ Gray `#65676b` | حسب `data.url` | عام |

---

## أمثلة الاستخدام السريعة

### 1️⃣ Reservation (حجز)
```typescript
this._NotificationService.add({
  title: 'تم تأكيد الحجز',
  body: 'موعدك مع د.أحمد يوم السبت 10 صباحاً',
  type: 'reservation',
  data: { reservationId: 123 }
});
// 👉 ينتقل إلى: /appointments/123
```

### 2️⃣ Podcast (بودكاست)
```typescript
this._NotificationService.add({
  title: 'حلقة جديدة 🎙️',
  body: 'استمع الآن: كيف تتعامل مع القلق',
  type: 'podcast',
  data: { podcastId: 456 }
});
// 👉 ينتقل إلى: /podcasts?id=456
```

### 3️⃣ Community (مجتمع)
```typescript
this._NotificationService.add({
  title: 'تفاعل جديد 💬',
  body: 'أحمد علق على منشورك',
  type: 'community',
  data: { 
    postId: 789,
    userId: 101 
  }
});
// 👉 ينتقل إلى: /talbinah-community?postId=789
// أو: /talbinah-community/profile/101
```

### 4️⃣ Task (مهمة)
```typescript
this._NotificationService.add({
  title: 'مهمة جديدة 📝',
  body: 'لديك مهمة من جلستك الأخيرة',
  type: 'task',
  data: { 
    sessionId: 555,
    taskId: 888 
  }
});
// 👉 ينتقل إلى: /appointments/session/555
```

### 5️⃣ Offer (عرض)
```typescript
this._NotificationService.add({
  title: 'عرض خاص! 🎉',
  body: 'خصم 30% على البرنامج العلاجي',
  type: 'offer',
  data: { 
    offerId: 999,
    discountPercentage: 30 
  }
});
// 👉 ينتقل إلى: /therapeutic-programs?offerId=999
```

---

## الفرق بين الأنواع

### أنواع التنقل (Navigation Types)
تنتقل لصفحات محددة في التطبيق:
- `reservation`, `podcast`, `community`, `task`, `offer`
- `session_reminder`, `new_message`, `appointment`

### أنواع الحالة (Status Types)
تستخدم لرسائل النظام:
- `success`, `warning`, `error`, `info`, `general`

---

## البيانات الإضافية (data)

### Reservation
```typescript
data: {
  reservationId: number // ID الحجز
}
```

### Podcast
```typescript
data: {
  podcastId: number // ID الحلقة
}
```

### Community
```typescript
data: {
  postId?: number,   // ID المنشور
  userId?: number    // ID المستخدم
}
```

### Task
```typescript
data: {
  sessionId: number, // ID الجلسة
  taskId?: number    // ID المهمة
}
```

### Offer
```typescript
data: {
  offerId?: number,         // ID العرض
  url?: string,             // مسار مخصص
  discountPercentage?: number
}
```

### General/Status Types
```typescript
data: {
  url?: string  // مسار مخصص للانتقال
}
```

---

## ملاحظات مهمة

1. **الألوان تلقائية**: كل نوع له لون مميز يظهر في border و indicator
2. **التنقل الذكي**: عند الضغط على الإشعار ينتقل للصفحة المناسبة
3. **البيانات الإضافية**: استخدم `data` لتمرير معلومات إضافية
4. **المرونة**: يمكن استخدام `data.url` لأي مسار مخصص

---

## النظام يستخدم Route Enums

النظام بيستخدم الـ Route Enums من المشروع عشان يضمن navigation صحيح:

```typescript
import { 
    AppointmentsRoutesEnum,
    PodcastRoutesEnum,
    TalbinahCommunityRoutesEnum,
    TherapeuticProgramsRoutesEnum
} from '../../../domains';
```

### أمثلة الـ Navigation:

```typescript
// Reservation -> Appointments
this.router.navigate([AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE]);

// Podcast -> Podcasts
this.router.navigate([PodcastRoutesEnum.PODCASTSMAINPAGE], { 
    queryParams: { id: podcastId } 
});

// Community -> Talbinah Community
this.router.navigate([TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE]);

// Task -> Session in Appointments
this.router.navigate([
    AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE,
    AppointmentsRoutesEnum.APPOINTMENTS_SESSION,
    sessionId
]);

// Offer -> Therapeutic Programs
this.router.navigate([TherapeuticProgramsRoutesEnum.THERAPEUTIC_PROGRAMS_MAIN_PAGE], { 
    queryParams: { offerId: offerId } 
});
```

## مثال كامل في Firebase Handler

```typescript
private handleNotificationPayload(payload: any) {
  const title = payload?.data?.title || 'إشعار';
  const body = payload?.data?.body || '';
  const notificationType = payload?.data?.type || NotificationTypeEnum.GENERAL;

  this._NotificationSoundService.playNotificationSound(0.3);

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

---

**تم التحديث:** أكتوبر 2025

