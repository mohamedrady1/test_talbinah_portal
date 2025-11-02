# Banner System Guide

## Overview
تم إضافة نظام عرض البانرز (Banners) في الصفحة الرئيسية. النظام يدعم عرض عدة بانرز مع إمكانية التنقل بينها تلقائياً أو يدوياً.

## Features
- ✅ عرض البانرز من API `/api/home`
- ✅ Carousel مع نقاط تحكم (Dots)
- ✅ تحرك تلقائي كل 5 ثوانٍ
- ✅ أزرار للتنقل (Next/Previous)
- ✅ تسجيل النقر على البانر في API `/api/banners/user-click`
- ✅ التوجيه للصفحات المختلفة بناءً على نوع البانر
- ✅ Responsive Design
- ✅ RTL Support

## API Integration

### 1. Get Banners
```typescript
GET /api/home

Response:
{
  "status": true,
  "message": null,
  "data": {
    "banners": [
      {
        "id": 37,
        "type": "Image",
        "title": "",
        "subTitle": "",
        "icon": "...",
        "color": "#000000",
        "button_name": null,
        "button_color": "#000000",
        "image": "https://...",
        "action": "page",
        "page": "SUPPORT_SESSIONS",
        "pageID": null,
        "link": "",
        "banner_type": "normal"
      }
    ]
  }
}
```

### 2. Track Banner Click
```typescript
POST /api/banners/user-click?banner_id=37

Request Body:
{
  "banner_id": 37
}

Response:
{
  "status": true,
  "message": null,
  "data": {
    "id": 37,
    "click_count": 1,
    "original_active": null,
    "users_clicked": 3
  }
}
```

## File Structure

```
src/app/domains/main-page/
├── enums/
│   ├── banner-type.enum.ts          # Banner enums (BannerType, BannerActionType, BannerPageType)
│   └── index.ts
├── dtos/
│   ├── requests/
│   │   └── banner-click-request.dto.ts
│   ├── responses/
│   │   ├── banner-response.dto.ts
│   │   ├── banner-click-response.dto.ts
│   │   └── home-response.dto.ts     # Updated to include banners
│   └── index.ts
├── collections/
│   └── main-page.collections.ts     # Updated with BannerClick()
├── clients/
│   ├── i-main-page-api.client.ts    # Updated interface
│   ├── main-page-api.client.ts      # Implemented sendBannerClick
│   └── main-page-api.inmemory.client.ts
├── components/
│   ├── banner-carousel/
│   │   ├── banner-carousel.component.ts
│   │   ├── banner-carousel.component.html
│   │   ├── banner-carousel.component.scss
│   │   └── index.ts
│   └── index.ts
└── containers/
    └── main-page-layout/
        ├── main-page-layout.component.ts    # Updated to fetch and display banners
        ├── main-page-layout.component.html  # Added banner section
        └── main-page-layout.component.scss  # Added banner styles
```

## Enums

### BannerType
```typescript
export enum BannerType {
  IMAGE = 'Image',
  VIDEO = 'Video',
  TEXT = 'Text'
}
```

### BannerActionType
```typescript
export enum BannerActionType {
  PAGE = 'page',      // Navigate to internal page
  LINK = 'link',      // Open external link
  NONE = 'none'       // No action
}
```

### BannerPageType
```typescript
export enum BannerPageType {
  SUPPORT_SESSIONS = 'SUPPORT_SESSIONS',
  BOOK_APPOINTMENT = 'BOOK_APPOINTMENT',
  PODCAST = 'PODCAST',
  ARTICLES = 'ARTICLES',
  TALBINAH_COMMUNITY = 'TALBINAH_COMMUNITY',
  MENTAL_HEALTH_SCALES = 'MENTAL_HEALTH_SCALES',
  THERAPEUTIC_PROGRAMS = 'THERAPEUTIC_PROGRAMS',
  KHAWIIK = 'KHAWIIK',
  SUPPORT_GROUPS = 'SUPPORT_GROUPS',
  APPOINTMENTS = 'APPOINTMENTS',
  URGENT_APPOINTMENT = 'URGENT_APPOINTMENT',
  SETTINGS = 'SETTINGS',
  PROFILE = 'PROFILE'
}
```

## Usage

### In Component
```typescript
// Banners are automatically fetched in MainPageLayoutComponent
// and passed to BannerCarouselComponent

// In main-page-layout.component.ts:
public banners = signal<IBannerItem[]>([]);

private fetchHomeContent(): void {
  this._MainPageApiClient.getHomeContent()
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: (response) => {
        if (response?.banners && Array.isArray(response.banners)) {
          this.banners.set(response.banners);
        }
      }
    });
}
```

### In Template
```html
<!-- Banner section above quick-access-cards -->
@if(banners() && banners()!.length > 0) {
<section class="home-page__banners">
  <app-banner-carousel [banners]="banners()!" />
</section>
}
```

## Page Navigation Mapping

البانرز تدعم التوجيه للصفحات التالية:

| Page Type | Route |
|-----------|-------|
| SUPPORT_SESSIONS | `/support-groups` |
| BOOK_APPOINTMENT | `/book-appointment` |
| PODCAST | `/podcasts` |
| ARTICLES | `/articles` |
| TALBINAH_COMMUNITY | `/talbinah-community` |
| MENTAL_HEALTH_SCALES | `/mental-health-scales` |
| THERAPEUTIC_PROGRAMS | `/therapeutic-programs` |
| KHAWIIK | `/khawiik` |
| SUPPORT_GROUPS | `/support-groups` |
| APPOINTMENTS | `/appointments` |
| URGENT_APPOINTMENT | `/urgent-appointment` |
| SETTINGS | `/settings` |
| PROFILE | `/talbinah-community/profile` |

## Customization

### Auto-play Duration
تغيير مدة التحرك التلقائي في `banner-carousel.component.ts`:

```typescript
private startAutoPlay(): void {
  this.autoPlayInterval = setInterval(() => {
    this.nextSlide();
  }, 5000); // Change this value (milliseconds)
}
```

### Image Dimensions
تغيير أبعاد الصور في `banner-carousel.component.scss`:

```scss
&__image {
  min-height: 200px;
  max-height: 400px;  // Adjust as needed
}
```

### Fallback Image
تغيير الصورة الافتراضية عند فشل التحميل في `banner-carousel.component.ts`:

```typescript
protected onImageError(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.src = 'images/home/home.png'; // Change this path
}
```

## Notes

1. البانرز تظهر فقط إذا كان هناك بانرز في الـ response من الـ API
2. النقاط (Dots) والأزرار تظهر فقط إذا كان هناك أكثر من بانر واحد
3. التحرك التلقائي يبدأ فقط في المتصفح (SSR-safe)
4. يتم تسجيل كل نقرة على بانر في الـ API
5. التوجيه يحدث تلقائياً بناءً على نوع الـ action والـ page

## Future Enhancements

يمكن إضافة:
- 🔄 Swipe gesture للموبايل
- 🎬 دعم الفيديوهات
- ⏸️ إيقاف التحرك التلقائي عند hover
- 📊 Analytics للبانرز
- 🎨 Custom animations
- 🔗 Deep linking مع parameters

