import { ChangeDetectionStrategy, Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../../shared/services/model.service';
import { StatusInfoComponent } from '../../../payments/components/status-info/status-info.component';
import { Logger } from '../../../../common';
import { ChangeUserPasswordFacade } from '../../services/change-user-password.facade';
import { LogoutFacade } from '../../services/logout.facade';
import { IChangePasswordRequestDto } from '../../dtos';
import { ToastService } from '../../../../shared/services/toast-service.service';
import { UserContextService } from '../../../authentication/user-authentication/services/user-context.service';
import { UserIdentityStore } from '../../../talbinah-community/routes/user-identity.service';
import { StorageService } from '../../../../common';
import { StorageKeys } from '../../../../shared';
import { AuthenticationRoutesEnum } from '../../../authentication/user-authentication/constants/auth-routes.enum';
import { Router } from '@angular/router';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateApiPipe],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _modalService = inject(ModalService);
  private readonly _changePasswordFacade = inject(ChangeUserPasswordFacade);
  private readonly _logoutFacade = inject(LogoutFacade);
  private readonly _toastService = inject(ToastService);
  private readonly _userContext = inject(UserContextService);
  private readonly _userIdentityStore = inject(UserIdentityStore);
  private readonly _storage = inject(StorageService);
  private readonly _router = inject(Router);

  changePasswordForm: FormGroup;
  passwordVisibility = {
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  };

  constructor() {
    this.changePasswordForm = this._formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Setup effects to watch facade state
    this.setupEffects();
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (group.get('confirmPassword')?.hasError('passwordMismatch')) {
      group.get('confirmPassword')?.setErrors(null);
    }

    return null;
  }

  private setupEffects(): void {
    // Watch for password change success
    effect(() => {
      const success = this._changePasswordFacade.success();
      if (success) {
        this.handlePasswordChangeSuccess();
      }
    });

    // Watch for password change error
    effect(() => {
      const errorMessage = this._changePasswordFacade.errorMessage();
      if (errorMessage) {
        this.openErrorModal(errorMessage);
        this._changePasswordFacade.resetState();
      }
    });

    // Watch for logout success
    effect(() => {
      const logoutSuccess = this._logoutFacade.success();
      if (logoutSuccess) {
        this.performLocalLogout();
        this._logoutFacade.resetState();
      }
    });

    // Watch for logout error
    effect(() => {
      const logoutError = this._logoutFacade.errorMessage();
      if (logoutError) {
        this.performLocalLogout();
        this._logoutFacade.resetState();
      }
    });
  }

  private handlePasswordChangeSuccess(): void {
    const successMessage = this._changePasswordFacade.successMessage();

    this._toastService.add({
      severity: 'success',
      summary: 'general.statusSuccess',
      detail: successMessage ?? 'general.successPasswordChange',
      life: 3000
    });

    // Reset facade state
    this._changePasswordFacade.resetState();
    // Close all modals first
    this._modalService.closeAll();
    // Perform logout immediately
    this.performLogout();
  }

  private performLogout(): void {
    // Perform local logout immediately for better UX
    // Also call the facade logout for server-side cleanup (optional)
    this._logoutFacade.logout();
  }

  private performLocalLogout(): void {
    this._userContext.clear();
    this._userIdentityStore.clear();

    this._storage.removeItem(StorageKeys.TOKEN);
    this._storage.removeItem(StorageKeys.CURRENT_USER_INFO);
    this._storage.removeItem(StorageKeys.QUCIK_ACCESS_CARDS);
    this._storage.removeItem(StorageKeys.MY_COMMUNITY_USER_PROFILE_DATA);
  }

  togglePasswordVisibility(field: keyof typeof this.passwordVisibility): void {
    this.passwordVisibility[field] = !this.passwordVisibility[field];
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.changePasswordForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.changePasswordForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return `changePassword_${fieldName}Required`;
    }

    if (field.errors['minlength']) {
      return 'new_password_min_length';
    }

    if (field.errors['passwordMismatch']) {
      return 'change_password_mismatch';
    }

    return '';
  }

  markAllAsTouched(): void {
    Object.keys(this.changePasswordForm.controls).forEach(key => {
      const control = this.changePasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = this.changePasswordForm.value;

    const payload: IChangePasswordRequestDto = {
      old_password: formData.oldPassword,
      new_password: formData.newPassword,
      confirmation_new_password: formData.confirmPassword
    };

    this._changePasswordFacade.changePassword(payload);
  }

  isLoading(): boolean {
    return this._changePasswordFacade.isLoading() || this._logoutFacade.isLoading();
  }

  private openSuccessModal(): void {
    this._modalService.open(StatusInfoComponent, {
      inputs: {
        image: 'images/settings/modal-icons/security.png',
        title: 'change_password_successed',
        subtitle: 'change_password_successed2',
        data: {
          statusLabels: {
            successTitle: 'change_password_successed',
          },
          item: {
            storeSuccess: true
          }
        }
      },
      outputs: {
        closed: () => {
          Logger.debug('Success modal closed');
          this.changePasswordForm.reset();
        }
      },
      width: '40%',
      isPhoneFromDown: true,
      minHeight: '10rem',
      maxHeight: '60rem',
    });
  }

  private openErrorModal(errorMessage: string): void {
    this._modalService.open(StatusInfoComponent, {
      inputs: {
        image: 'images/settings/modal-icons/security.png',
        title: 'change_password_failed2',
        subtitle: 'change_password_error',
        data: {
          statusLabels: {
            errorSubTitle: errorMessage ?? 'change_password_failed2',
          },
          item: {
            storeSuccess: false,
            errorMessage: errorMessage
          }
        }
      },
      outputs: {
        closed: () => {
          Logger.debug('Error modal closed');
        }
      },
      width: '40%',
      isPhoneFromDown: true,
      minHeight: '10rem',
      maxHeight: '60rem',
    });
  }
}
