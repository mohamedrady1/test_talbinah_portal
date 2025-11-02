export class UserManagementCollections {
  static ModuleName: string = 'api';

  static Authentication: string = `${UserManagementCollections.ModuleName}`;

  static checkNumber(): string {
    return `${UserManagementCollections.Authentication}/check-number`;
    // phone_no=1018388777&country_id=63&role=user&device_type=Android
  }

  static methodSelection(): string {
    return `${UserManagementCollections.Authentication}/send-otp/talbinah-sa-medical/jghnvsurlsb`;
    // phone_no=1018388777&country_id=63&role=user&device_type=Android
  }

  static VerifyCode(): string {
    return `${UserManagementCollections.Authentication}/register/check-code`;
  }

  static Login(): string {
    return `${UserManagementCollections.Authentication}/login`;
  }

  static resetPassword(): string {
    return `${UserManagementCollections.Authentication}/recovery-by-password/reset-password`;
    // phone_no=1018388777&country_id=63&role=user&device_type=Android
  }

  static Register(): string {
    return `${UserManagementCollections.Authentication}/register`;
  }

  static UpdateFcmNotifications(): string {
    return `${UserManagementCollections.Authentication}/notifications/update-fcm`;
  }

  static SendNotification(): string {
    return `${UserManagementCollections.Authentication}/send-general-notification`;
  }

  static asGuest(): string {
    return `site/guest/start`;
  }

}
