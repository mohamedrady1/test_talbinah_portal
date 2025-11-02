# Notification Sound Service

خدمة لتشغيل أصوات الإشعارات في تطبيق Talbinah Portal.

## 📋 نظرة عامة

`NotificationSoundService` هي خدمة Angular مسؤولة عن تشغيل الأصوات عند استلام الإشعارات. تدعم الخدمة أنواع أصوات متعددة والتحكم في مستوى الصوت.

## 🚀 الاستخدام

### 1. الاستيراد في Component

```typescript
import { NotificationSoundService } from './shared';

@Component({
  selector: 'app-example',
  // ...
})
export class ExampleComponent {
  constructor(private notificationSoundService: NotificationSoundService) {}
}
```

### 2. تشغيل صوت الإشعار

#### تشغيل بسيط (بالإعدادات الافتراضية)

```typescript
// تشغيل الصوت بمستوى صوت 100%
this.notificationSoundService.playNotificationSound();
```

#### تشغيل بمستوى صوت مخصص

```typescript
// تشغيل الصوت بمستوى صوت 50%
this.notificationSoundService.playNotificationSound(0.5);
```

#### تشغيل نوع صوت معين

```typescript
// تشغيل صوت رسالة جديدة
this.notificationSoundService.playNotificationSound(1.0, 'message');
```

#### استخدام مع Async/Await

```typescript
async handleNotification() {
  try {
    await this.notificationSoundService.playNotificationSound();
    console.log('تم تشغيل الصوت بنجاح');
  } catch (error) {
    console.error('فشل تشغيل الصوت:', error);
  }
}
```

## 🎛️ التحكم في الصوت

### ضبط مستوى الصوت الافتراضي

```typescript
// ضبط مستوى الصوت إلى 70%
this.notificationSoundService.setVolume(0.7);
```

### كتم الصوت

```typescript
// كتم جميع أصوات الإشعارات
this.notificationSoundService.mute();
```

### إلغاء كتم الصوت

```typescript
// إعادة تشغيل الصوت بعد الكتم
this.notificationSoundService.unmute();
```

### التحقق من دعم المتصفح

```typescript
if (this.notificationSoundService.isSupported()) {
  console.log('المتصفح يدعم تشغيل الصوت');
} else {
  console.log('المتصفح لا يدعم تشغيل الصوت');
}
```

## 📂 أنواع الأصوات المتاحة

حالياً، الأصوات التالية متوفرة:

| النوع | الوصف | المسار |
|-------|-------|--------|
| `default` | الصوت الافتراضي | `/sounds/notification-sound.mp3` |
| `message` | صوت رسالة جديدة | `/sounds/notification-sound.mp3` |

### إضافة أصوات جديدة

لإضافة صوت جديد، اتبع الخطوات التالية:

1. **إضافة ملف الصوت:**
   ```
   public/sounds/your-new-sound.mp3
   ```

2. **تحديث الخدمة:**
   ```typescript
   // في notification-sound.service.ts
   private readonly soundPaths: Record<string, string> = {
     default: '/sounds/notification-sound.mp3',
     message: '/sounds/notification-sound.mp3',
     alert: '/sounds/your-new-sound.mp3', // الصوت الجديد
   };
   ```

3. **الاستخدام:**
   ```typescript
   this.notificationSoundService.playNotificationSound(1.0, 'alert');
   ```

## 🔍 مثال كامل

### مثال من `app.component.ts`

```typescript
import { NotificationSoundService } from './shared';

@Component({
  selector: 'app-root',
  // ...
})
export class AppComponent {
  private readonly _NotificationSoundService = inject(NotificationSoundService);

  private handleNotificationPayload(payload: any) {
    // تشغيل صوت الإشعار
    this._NotificationSoundService.playNotificationSound();

    // عرض Toast
    this._ToastService.add({
      severity: 'info',
      summary: 'إشعار جديد',
      detail: 'لديك رسالة جديدة',
      life: 5000
    });
  }
}
```

### مثال مع أنواع إشعارات مختلفة

```typescript
private handleNotificationByType(type: string) {
  switch (type) {
    case 'message':
      // تشغيل صوت رسالة بمستوى صوت كامل
      this.notificationSoundService.playNotificationSound(1.0, 'message');
      break;
    
    case 'reminder':
      // تشغيل صوت تذكير بمستوى صوت متوسط
      this.notificationSoundService.playNotificationSound(0.6, 'default');
      break;
    
    default:
      // تشغيل الصوت الافتراضي
      this.notificationSoundService.playNotificationSound();
      break;
  }
}
```

## ⚙️ معلمات الدوال

### `playNotificationSound(volume?, soundType?)`

| المعامل | النوع | القيمة الافتراضية | الوصف |
|---------|------|-------------------|-------|
| `volume` | `number` | `1.0` | مستوى الصوت من 0.0 إلى 1.0 |
| `soundType` | `string` | `'default'` | نوع الصوت المراد تشغيله |

**القيمة المرجعة:** `Promise<void>`

### `setVolume(volume)`

| المعامل | النوع | الوصف |
|---------|------|-------|
| `volume` | `number` | مستوى الصوت من 0.0 إلى 1.0 |

**القيمة المرجعة:** `void`

## 🛡️ معالجة الأخطاء

الخدمة تتعامل مع الأخطاء بشكل آمن ولا تعطل تدفق الإشعارات:

```typescript
try {
  await this.notificationSoundService.playNotificationSound();
} catch (error) {
  // الأخطاء يتم التعامل معها داخلياً
  // لن يتوقف تدفق الإشعارات
  console.error('فشل تشغيل الصوت:', error);
}
```

## 🌐 دعم المتصفحات

- ✅ Chrome/Edge (Modern)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ⚠️ لا يعمل في وضع Server-Side Rendering (SSR)

## 📝 ملاحظات مهمة

1. **SSR (Server-Side Rendering):**
   - الخدمة تتحقق تلقائياً من البيئة ولن تحاول تشغيل الصوت في بيئة الخادم

2. **أذونات المتصفح:**
   - بعض المتصفحات تتطلب تفاعل المستخدم قبل تشغيل الصوت
   - إذا فشل تشغيل الصوت، تأكد من أن المستخدم قد تفاعل مع الصفحة

3. **الأداء:**
   - الخدمة تستخدم نفس كائن `Audio` لجميع الأصوات لتحسين الأداء
   - لا حاجة للقلق بشأن تسريبات الذاكرة

## 🔧 استكشاف الأخطاء

### الصوت لا يشتغل

**المشكلة:** لا يتم تشغيل الصوت عند استلام الإشعار

**الحلول:**
1. تحقق من أن ملف الصوت موجود في المسار الصحيح
2. تأكد من أن المستخدم قد تفاعل مع الصفحة
3. تحقق من إعدادات كتم الصوت في المتصفح
4. افتح Console وتحقق من الأخطاء

### الصوت منخفض جداً

**الحلول:**
```typescript
// زيادة مستوى الصوت
this.notificationSoundService.setVolume(1.0);
```

### تحقق من دعم المتصفح

```typescript
if (!this.notificationSoundService.isSupported()) {
  console.log('المتصفح لا يدعم تشغيل الصوت');
}
```

## 📚 موارد إضافية

- [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [HTML Audio Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)

## 👥 المساهمة

لتحسين الخدمة أو إضافة ميزات جديدة، يرجى:
1. إنشاء branch جديد
2. تطبيق التغييرات
3. كتابة tests إذا لزم الأمر
4. إنشاء Pull Request

---

**تاريخ آخر تحديث:** أكتوبر 2025  
**الإصدار:** 1.0.0

