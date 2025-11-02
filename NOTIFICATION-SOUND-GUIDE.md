# دليل استخدام Notification Sound Service

## ⚡ نظرة سريعة

تم إنشاء خدمة `NotificationSoundService` لتشغيل أصوات الإشعارات تلقائياً عند استلام إشعار جديد.

## 📁 الملفات المضافة/المعدلة

### ✨ ملفات جديدة:
- `src/app/shared/services/notification-sound.service.ts` - الخدمة الرئيسية
- `src/app/shared/services/notification-sound-service.README.md` - دليل مفصل

### 📝 ملفات معدلة:
- `src/app/shared/services/index.ts` - تصدير الخدمة
- `src/app/app.component.ts` - استخدام الخدمة

## 🎵 ملفات الصوت

الصوت المستخدم: `public/sounds/notification-sound.mp3`

## 🚀 استخدام سريع

### الاستيراد:
```typescript
import { NotificationSoundService } from './shared';
```

### الحقن:
```typescript
private readonly _NotificationSoundService = inject(NotificationSoundService);
```

### التشغيل:
```typescript
// تشغيل بسيط
this._NotificationSoundService.playNotificationSound();

// مع التحكم في الصوت (50%)
this._NotificationSoundService.playNotificationSound(0.5);

// نوع صوت معين
this._NotificationSoundService.playNotificationSound(1.0, 'message');
```

## 🎛️ وظائف إضافية

```typescript
// ضبط مستوى الصوت
this._NotificationSoundService.setVolume(0.7);

// كتم الصوت
this._NotificationSoundService.mute();

// إلغاء الكتم
this._NotificationSoundService.unmute();

// التحقق من الدعم
if (this._NotificationSoundService.isSupported()) {
  // المتصفح يدعم الصوت
}
```

## 📍 مكان الاستخدام الحالي

في `app.component.ts` داخل دالة `handleNotificationPayload`:

```typescript
private handleNotificationPayload(payload: any) {
  // تشغيل صوت الإشعار ✅
  this._NotificationSoundService.playNotificationSound();
  
  // بقية الكود...
}
```

## ➕ إضافة أصوات جديدة

1. ضع ملف الصوت في: `public/sounds/your-sound.mp3`

2. أضف في `notification-sound.service.ts`:
```typescript
private readonly soundPaths: Record<string, string> = {
  default: '/sounds/notification-sound.mp3',
  alert: '/sounds/your-sound.mp3', // الصوت الجديد
};
```

3. استخدم:
```typescript
this._NotificationSoundService.playNotificationSound(1.0, 'alert');
```

## 📚 للمزيد من التفاصيل

راجع الدليل المفصل: `src/app/shared/services/notification-sound-service.README.md`

---

**تاريخ الإنشاء:** أكتوبر 14, 2025  
**الحالة:** ✅ جاهز للاستخدام

