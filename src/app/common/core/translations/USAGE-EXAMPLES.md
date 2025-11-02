# أمثلة عملية لاستخدام نظام الترجمات

## 1. استخدام في Component بسيط

```typescript
// home.component.ts
import { Component } from '@angular/core';
import { TranslateApiPipe } from '@common/core/translations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateApiPipe],
  template: `
    <div class="container">
      <h1>{{ 'home.hero.title' | translateApi }}</h1>
      <p>{{ 'home.hero.subtitle' | translateApi }}</p>
      <button class="btn">{{ 'common.buttons.get_started' | translateApi }}</button>
    </div>
  `
})
export class HomeComponent {}
```

---

## 2. استخدام في Forms

```typescript
// login-form.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateApiPipe } from '@common/core/translations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateApiPipe],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label>{{ 'auth.email.label' | translateApi }}</label>
        <input 
          type="email" 
          formControlName="email"
          [placeholder]="'auth.email.placeholder' | translateApi"
        />
        <span class="error" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
          {{ 'auth.email.error' | translateApi }}
        </span>
      </div>

      <div class="form-group">
        <label>{{ 'auth.password.label' | translateApi }}</label>
        <input 
          type="password" 
          formControlName="password"
          [placeholder]="'auth.password.placeholder' | translateApi"
        />
      </div>

      <button type="submit" [disabled]="loginForm.invalid">
        {{ 'auth.login.button' | translateApi }}
      </button>
    </form>
  `
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);
  
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
  }
}
```

---

## 3. استخدام في Modals/Dialogs

```typescript
// confirmation-modal.component.ts
import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { TranslateApiPipe } from '@common/core/translations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, TranslateApiPipe],
  template: `
    <div class="modal-content">
      <h2>{{ 'modals.confirmation.title' | translateApi }}</h2>
      <p>{{ 'modals.confirmation.message' | translateApi }}</p>
      
      <div class="modal-actions">
        <button (click)="onCancel()" class="btn-secondary">
          {{ 'common.buttons.cancel' | translateApi }}
        </button>
        <button (click)="onConfirm()" class="btn-primary">
          {{ 'common.buttons.confirm' | translateApi }}
        </button>
      </div>
    </div>
  `
})
export class ConfirmationModalComponent {
  private dialogRef = inject(DialogRef);

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
```

---

## 4. استخدام في Services مع Toast Messages

```typescript
// user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslationsFacade } from '@common/core/translations';
import { ToastService } from '@shared';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private translationsFacade = inject(TranslationsFacade);
  private toastService = inject(ToastService);

  updateProfile(data: any) {
    return this.http.put('/api/user/profile', data).pipe(
      tap(() => {
        const successMsg = this.translationsFacade.translate('messages.profile_updated_success');
        this.toastService.showSuccess(successMsg);
      }),
      catchError(error => {
        const errorMsg = this.translationsFacade.translate('messages.profile_update_error');
        this.toastService.showError(errorMsg);
        throw error;
      })
    );
  }

  deleteAccount() {
    const confirmMsg = this.translationsFacade.translate('messages.delete_account_confirm');
    
    if (confirm(confirmMsg)) {
      return this.http.delete('/api/user/account').pipe(
        tap(() => {
          const successMsg = this.translationsFacade.translate('messages.account_deleted_success');
          this.toastService.showSuccess(successMsg);
        })
      );
    }
    
    return null;
  }
}
```

---

## 5. استخدام في Lists/Tables

```typescript
// users-list.component.ts
import { Component, signal } from '@angular/core';
import { TranslateApiPipe } from '@common/core/translations';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, TranslateApiPipe],
  template: `
    <div class="table-container">
      <h2>{{ 'users.list.title' | translateApi }}</h2>
      
      <table>
        <thead>
          <tr>
            <th>{{ 'users.table.name' | translateApi }}</th>
            <th>{{ 'users.table.email' | translateApi }}</th>
            <th>{{ 'users.table.status' | translateApi }}</th>
            <th>{{ 'users.table.actions' | translateApi }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of users()">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span [class]="'status-' + user.status">
                {{ 'users.status.' + user.status | translateApi }}
              </span>
            </td>
            <td>
              <button class="btn-sm">{{ 'common.buttons.edit' | translateApi }}</button>
              <button class="btn-sm btn-danger">{{ 'common.buttons.delete' | translateApi }}</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="empty-state" *ngIf="users().length === 0">
        <p>{{ 'users.list.empty' | translateApi }}</p>
      </div>
    </div>
  `
})
export class UsersListComponent {
  users = signal<User[]>([
    { id: 1, name: 'Ahmed', email: 'ahmed@example.com', status: 'active' },
    { id: 2, name: 'Sarah', email: 'sarah@example.com', status: 'inactive' }
  ]);
}
```

---

## 6. استخدام في Navigation Menu

```typescript
// nav-menu.component.ts
import { Component, signal } from '@angular/core';
import { TranslateApiPipe } from '@common/core/translations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  id: string;
  translationKey: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateApiPipe],
  template: `
    <nav class="sidebar">
      <ul>
        <li *ngFor="let item of menuItems()" [routerLinkActive]="'active'">
          <a [routerLink]="item.route">
            <i [class]="item.icon"></i>
            <span>{{ item.translationKey | translateApi }}</span>
          </a>
        </li>
      </ul>
    </nav>
  `
})
export class NavMenuComponent {
  menuItems = signal<MenuItem[]>([
    { id: 'home', translationKey: 'menu.home', route: '/home', icon: 'pi pi-home' },
    { id: 'profile', translationKey: 'menu.profile', route: '/profile', icon: 'pi pi-user' },
    { id: 'settings', translationKey: 'menu.settings', route: '/settings', icon: 'pi pi-cog' },
    { id: 'logout', translationKey: 'menu.logout', route: '/logout', icon: 'pi pi-sign-out' }
  ]);
}
```

---

## 7. استخدام في Breadcrumb

```typescript
// breadcrumb.component.ts
import { Component, inject, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateApiPipe, TranslationsFacade } from '@common/core/translations';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, TranslateApiPipe],
  template: `
    <nav class="breadcrumb">
      <ol>
        <li *ngFor="let item of breadcrumbs(); let last = last">
          <a [routerLink]="item.url" *ngIf="!last">
            {{ item.label }}
          </a>
          <span *ngIf="last">{{ item.label }}</span>
          <span class="separator" *ngIf="!last">/</span>
        </li>
      </ol>
    </nav>
  `
})
export class BreadcrumbComponent {
  private router = inject(Router);
  private facade = inject(TranslationsFacade);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).url)
    )
  );

  breadcrumbs = computed(() => {
    const url = this.currentUrl() || '/';
    const parts = url.split('/').filter(p => p);
    
    return [
      { label: this.facade.translate('breadcrumb.home'), url: '/' },
      ...parts.map((part, index) => ({
        label: this.facade.translate(`breadcrumb.${part}`),
        url: '/' + parts.slice(0, index + 1).join('/')
      }))
    ];
  });
}
```

---

## 8. استخدام في Error Pages

```typescript
// not-found.component.ts
import { Component } from '@angular/core';
import { TranslateApiPipe } from '@common/core/translations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateApiPipe],
  template: `
    <div class="error-page">
      <div class="error-content">
        <h1 class="error-code">404</h1>
        <h2>{{ 'errors.not_found.title' | translateApi }}</h2>
        <p>{{ 'errors.not_found.message' | translateApi }}</p>
        
        <div class="error-actions">
          <a routerLink="/" class="btn-primary">
            {{ 'errors.not_found.go_home' | translateApi }}
          </a>
          <button (click)="goBack()" class="btn-secondary">
            {{ 'errors.not_found.go_back' | translateApi }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {
  goBack() {
    window.history.back();
  }
}
```

---

## 9. استخدام في Validation Messages

```typescript
// validation-messages.component.ts
import { Component, Input, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateApiPipe, TranslationsFacade } from '@common/core/translations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-messages',
  standalone: true,
  imports: [CommonModule, TranslateApiPipe],
  template: `
    <div class="validation-messages" *ngIf="control?.invalid && control?.touched">
      <span class="error-message" *ngFor="let error of getErrors()">
        {{ error }}
      </span>
    </div>
  `
})
export class ValidationMessagesComponent {
  @Input() control: AbstractControl | null = null;
  @Input() fieldName: string = '';
  
  private facade = inject(TranslationsFacade);

  getErrors(): string[] {
    if (!this.control?.errors) return [];

    return Object.keys(this.control.errors).map(errorKey => {
      const errorValue = this.control!.errors![errorKey];
      
      switch (errorKey) {
        case 'required':
          return this.facade.translate('validation.required', { field: this.fieldName });
        case 'email':
          return this.facade.translate('validation.email');
        case 'minlength':
          return this.facade.translate('validation.minlength', { 
            field: this.fieldName, 
            min: errorValue.requiredLength 
          });
        case 'maxlength':
          return this.facade.translate('validation.maxlength', { 
            field: this.fieldName, 
            max: errorValue.requiredLength 
          });
        default:
          return this.facade.translate('validation.invalid', { field: this.fieldName });
      }
    });
  }
}
```

---

## 10. استخدام في Settings Panel

```typescript
// settings.component.ts
import { Component, inject } from '@angular/core';
import { TranslateApiPipe, TranslationsFacade } from '@common/core/translations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, TranslateApiPipe],
  template: `
    <div class="settings-panel">
      <h2>{{ 'settings.title' | translateApi }}</h2>

      <section class="settings-section">
        <h3>{{ 'settings.cache.title' | translateApi }}</h3>
        <p>{{ 'settings.cache.description' | translateApi }}</p>
        
        <div class="cache-info">
          <p>
            <strong>{{ 'settings.cache.status' | translateApi }}:</strong>
            {{ cacheStatus() }}
          </p>
          <p *ngIf="cacheExpiration()">
            <strong>{{ 'settings.cache.expires_at' | translateApi }}:</strong>
            {{ cacheExpiration() | date:'medium' }}
          </p>
        </div>

        <button (click)="clearCache()" class="btn-danger">
          {{ 'settings.cache.clear_button' | translateApi }}
        </button>
      </section>

      <section class="settings-section">
        <h3>{{ 'settings.translations.title' | translateApi }}</h3>
        <button (click)="refreshTranslations()" class="btn-primary">
          {{ 'settings.translations.refresh_button' | translateApi }}
        </button>
      </section>
    </div>
  `
})
export class SettingsComponent {
  private facade = inject(TranslationsFacade);

  cacheStatus = () => {
    const isValid = this.facade.isCacheValid();
    return this.facade.translate(
      isValid ? 'settings.cache.valid' : 'settings.cache.expired'
    );
  };

  cacheExpiration = () => {
    const expiration = this.facade.getCacheExpiration();
    return expiration ? new Date(expiration) : null;
  };

  clearCache() {
    if (confirm(this.facade.translate('settings.cache.clear_confirm'))) {
      localStorage.removeItem('talbinah-translations');
      window.location.reload();
    }
  }

  refreshTranslations() {
    this.facade.refresh().subscribe(() => {
      alert(this.facade.translate('settings.translations.refresh_success'));
    });
  }
}
```

---

## شكل الـ JSON المتوقع من الـ API

```json
{
  "success": true,
  "message": "Translations fetched successfully",
  "data": {
    "ar": {
      "home": {
        "hero": {
          "title": "مرحباً بك في تلبينة",
          "subtitle": "منصة الصحة النفسية"
        }
      },
      "auth": {
        "email": {
          "label": "البريد الإلكتروني",
          "placeholder": "أدخل بريدك الإلكتروني",
          "error": "البريد الإلكتروني غير صحيح"
        },
        "password": {
          "label": "كلمة المرور",
          "placeholder": "أدخل كلمة المرور"
        },
        "login": {
          "button": "تسجيل الدخول"
        }
      },
      "common": {
        "buttons": {
          "get_started": "ابدأ الآن",
          "cancel": "إلغاء",
          "confirm": "تأكيد",
          "edit": "تعديل",
          "delete": "حذف"
        }
      },
      "validation": {
        "required": "هذا الحقل مطلوب",
        "email": "البريد الإلكتروني غير صحيح",
        "minlength": "يجب أن يكون على الأقل {min} أحرف",
        "maxlength": "يجب أن لا يزيد عن {max} أحرف"
      }
    },
    "en": {
      "home": {
        "hero": {
          "title": "Welcome to Talbinah",
          "subtitle": "Mental Health Platform"
        }
      },
      "auth": {
        "email": {
          "label": "Email",
          "placeholder": "Enter your email",
          "error": "Invalid email address"
        },
        "password": {
          "label": "Password",
          "placeholder": "Enter your password"
        },
        "login": {
          "button": "Login"
        }
      },
      "common": {
        "buttons": {
          "get_started": "Get Started",
          "cancel": "Cancel",
          "confirm": "Confirm",
          "edit": "Edit",
          "delete": "Delete"
        }
      },
      "validation": {
        "required": "This field is required",
        "email": "Invalid email address",
        "minlength": "Must be at least {min} characters",
        "maxlength": "Must not exceed {max} characters"
      }
    }
  }
}
```

---

هذه أمثلة شاملة لكل الحالات الشائعة. يمكنك البناء عليها حسب احتياجاتك! 🚀


