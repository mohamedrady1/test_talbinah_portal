# 📡 دليل التكامل مع API الترجمات

## 🎯 كيف يعمل الـ API

### Endpoint
```
GET /api/translations
```

### Language Detection
- **اللغة يتم تحديدها من الـ Header** (مش من URL)
- الـ API بيشوف الـ `Accept-Language` header
- بيرجع لغة واحدة بس حسب الـ header

### Request Examples

#### طلب الترجمات العربية
```http
GET /api/translations
Accept-Language: ar
```

#### طلب الترجمات الإنجليزية
```http
GET /api/translations
Accept-Language: en
```

---

## 📥 Response Structure

```json
{
  "status": true,
  "message": null,
  "data": {
    "about_consultant": "نبذة عن المستشار",
    "about_podcast": "عن الحلقة",
    "login": "تسجيل الدخول",
    "logout": "تسجيل الخروج",
    "home": "الرئيسية",
    ...
  }
}
```

**ملاحظات:**
- ✅ `status`: boolean - حالة النجاح
- ✅ `message`: string | null - رسالة من API
- ✅ `data`: object - الترجمات الفعلية (key-value pairs)

---

## 🔄 كيف يتعامل النظام مع الـ API

### 1. Initial Load (أول تحميل)

```typescript
// النظام بيعمل 2 calls في نفس الوقت (parallel)
1. GET /api/translations (Header: Accept-Language: ar)
2. GET /api/translations (Header: Accept-Language: en)

// بعدين بيدمجهم
{
  ar: { ... },  // من الـ call الأول
  en: { ... }   // من الـ call التاني
}
```

### 2. Caching Strategy

```typescript
1. Server-Side (SSR):
   - يحمّل الترجمات من API
   - يحفظهم في TransferState
   - يرسلهم مع الـ HTML

2. Client-Side (Browser):
   - يقرأ من TransferState (أول مرة)
   - يحفظ في localStorage
   - يستخدم الـ cache للزيارات القادمة

3. Cache Expiration:
   - المدة الافتراضية: 24 ساعة
   - بعد الانتهاء: يحمّل من API مرة تانية
```

---

## 💻 Implementation في الكود

### TranslationsApiClient

```typescript
getTranslations(): Observable<ITranslationsData> {
  // Fetch both languages in parallel
  return forkJoin({
    ar: this.getTranslationsByLanguage('ar'),
    en: this.getTranslationsByLanguage('en')
  }).pipe(
    map(responses => ({
      ar: responses.ar.data,
      en: responses.en.data
    }))
  );
}

getTranslationsByLanguage(lang: string): Observable<ITranslationsApiResponse> {
  const endpoint = `${this.apiUrl}/translations`;
  
  const headers = new HttpHeaders({
    'Accept-Language': lang
  });

  return this.httpClient.get<ITranslationsApiResponse>(endpoint, { headers });
}
```

---

## ⚙️ Headers Configuration

### Option 1: Accept-Language (مُستخدم حالياً)
```typescript
headers: { 'Accept-Language': 'ar' }
```

### Option 2: Custom Header (إذا كان API يحتاج)
```typescript
headers: { 'X-Language': 'ar' }
```

### Option 3: Multiple Headers
```typescript
headers: { 
  'Accept-Language': 'ar',
  'Content-Language': 'ar'
}
```

**للتعديل:** افتح `translations-api.client.ts` وغيّر الـ headers حسب احتياج الـ API.

---

## 🧪 Testing

### 1. Test من Postman

```bash
# Arabic
GET http://your-api.com/api/translations
Accept-Language: ar

# English
GET http://your-api.com/api/translations
Accept-Language: en
```

### 2. Test من Browser Console

```javascript
// Arabic
fetch('http://your-api.com/api/translations', {
  headers: { 'Accept-Language': 'ar' }
})
.then(r => r.json())
.then(console.log);

// English
fetch('http://your-api.com/api/translations', {
  headers: { 'Accept-Language': 'en' }
})
.then(r => r.json())
.then(console.log);
```

### 3. Test من Angular

```typescript
// في component أو service
this.translationsFacade.initialize().subscribe(data => {
  console.log('Arabic:', data.ar);
  console.log('English:', data.en);
});
```

---

## 🔍 Network Monitoring

### DevTools → Network Tab

```
Request 1:
  URL: /api/translations
  Method: GET
  Headers: Accept-Language: ar
  Response: { status: true, data: { ... } }

Request 2:
  URL: /api/translations
  Method: GET
  Headers: Accept-Language: en
  Response: { status: true, data: { ... } }
```

**Console Logs:**
```
[TranslationsService] Fetching translations from API
[TranslationsService] Translations fetched and cached
[TranslationsFacade] Translations loaded successfully
```

---

## ⚠️ Error Handling

### API Error

```typescript
// إذا فشل الـ API
catchError(error => {
  Logger.error('[TranslationsService] Failed to fetch translations', error);
  // Fallback: empty translations
  return of({ ar: {}, en: {} } as ITranslationsData);
})
```

### Partial Error (لغة واحدة فشلت)

```typescript
// إذا العربي نجح والإنجليزي فشل
{
  ar: { login: "تسجيل الدخول", ... },
  en: {} // empty
}
```

---

## 🛠️ Customization

### تغيير الـ Header Name

إذا الـ API بتاعك بيستخدم header مختلف:

```typescript
// في translations-api.client.ts
const headers = new HttpHeaders({
  'X-Custom-Language': lang,  // 👈 غيّر هنا
});
```

### إضافة Headers إضافية

```typescript
const headers = new HttpHeaders({
  'Accept-Language': lang,
  'X-App-Version': '1.0.0',
  'X-Client-Type': 'web',
});
```

### Conditional Headers

```typescript
const headers: any = {
  'Accept-Language': lang,
};

// Add auth token if available
if (authToken) {
  headers['Authorization'] = `Bearer ${authToken}`;
}

return this.httpClient.get<ITranslationsApiResponse>(
  endpoint, 
  { headers: new HttpHeaders(headers) }
);
```

---

## 📊 Performance

### Parallel Requests (حالياً)
```
Time: ~500ms (both requests in parallel)
  ├─ Request 1 (ar): 500ms
  └─ Request 2 (en): 500ms (في نفس الوقت)
```

### Sequential Requests (لو غيّرناها)
```
Time: ~1000ms (one after another)
  ├─ Request 1 (ar): 500ms
  └─ Request 2 (en): 500ms (بعد الأولى)
```

**لذلك نستخدم `forkJoin` عشان نوفّر وقت!**

---

## ✅ Checklist

- [x] Endpoint واحد: `/api/translations`
- [x] Header: `Accept-Language`
- [x] Response: `{ status, message, data }`
- [x] Parallel requests باستخدام `forkJoin`
- [x] Combine results: `{ ar: {...}, en: {...} }`
- [x] Error handling
- [x] Caching مع expiration
- [x] SSR support مع TransferState

---

## 🎉 الخلاصة

النظام جاهز للعمل مع الـ API:
- ✅ بيستدعي الـ endpoint مرتين (للعربي والإنجليزي)
- ✅ بيستخدم الـ Header الصحيح
- ✅ بيدمج النتائج في object واحد
- ✅ بيحفظ في cache عشان ما يستدعيش API كتير
- ✅ يدعم SSR بشكل كامل

**جاهز للاستخدام! 🚀**

