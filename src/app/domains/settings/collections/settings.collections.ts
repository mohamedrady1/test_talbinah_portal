export class SettingsManagementCollections {
  static ModuleName: string = 'api';

  static Settings: string = `${SettingsManagementCollections.ModuleName}`;

  static getSettingsMenu(): string {
    return `${SettingsManagementCollections.Settings}/menu-items`;
  }

  static getGovernmentAgencies(): string {
    return `${SettingsManagementCollections.Settings}/government-agencies`;
  }
  static sendGovernmentAgenciesEmailVerification(): string {
    return `${SettingsManagementCollections.Settings}/government-agencies/send-verify-email`;
  }
  static verifyGovernmentAgenciesEmailOtp(): string {
    return `${SettingsManagementCollections.Settings}/government-agencies/verify-code`;
  }
  static getGovernmentAgenciesDoctors(): string {
    return `${SettingsManagementCollections.Settings}/doctors`;
  }

  static getFavoritesDoctors(): string {
    return `${SettingsManagementCollections.Settings}/favorites`;
  }
  static chargeWallet(): string {
    return `${SettingsManagementCollections.Settings}/wallets`;
  }

  static getPointsData(): string {
    return `${SettingsManagementCollections.Settings}/point-system/service-points/welcome-page`;
  }
  static getPointsGifts(): string {
    return `${SettingsManagementCollections.Settings}/point-system/service-points`;
  }
  static getWalletPointsRecords(): string {
    return `${SettingsManagementCollections.Settings}/point-system/wallet`;
  }
  static getServicePointsGifts(): string {
    return `${SettingsManagementCollections.Settings}/point-system/service-points/gift`;
  }
  static walletPointsToCoupon(): string {
    return `${SettingsManagementCollections.Settings}/point-system/gifts/points-to-coupon`;
  }
  static getFetchRewards(): string {
    return `${SettingsManagementCollections.Settings}/point-system/gifts`;
  }
  static getDoctorTickets(): string {
    return `${SettingsManagementCollections.Settings}/doctor/tickets`;
  }
  static getTickets(): string {
    return `${SettingsManagementCollections.Settings}/tickets`;
  }
  static changeUserPassword(): string {
    return `${SettingsManagementCollections.Settings}/profile/update-password`;
  }

  static logout(): string {
    return `${SettingsManagementCollections.Settings}/logout`;
  }

  static verifyNationalId(): string {
    return `${SettingsManagementCollections.Settings}/profile/verify-national-id`;
  }

  static updateProfile(): string {
    return `${SettingsManagementCollections.Settings}/profile/update`;
  }
  static Wallet(): string {
    return `${SettingsManagementCollections.Settings}/wallets`;
  }
  static DepositWallet(): string {
    return `${SettingsManagementCollections.Settings}/wallets/deposit`;
  }
  static Movements(): string {
    return `${SettingsManagementCollections.Settings}/movements`;
  }
  static ImportantNumbers(): string {
    return `${SettingsManagementCollections.Settings}/important-numbers`;
  }
  static FaqsCategories(): string {
    return `${SettingsManagementCollections.Settings}/faqs/categories`;
  }
  static Faqs(): string {
    return `${SettingsManagementCollections.Settings}/faqs`;
  }
  static getSentGifts(): string {
    return `${SettingsManagementCollections.Settings}/wallet-gifts-sender`;
  }
  static getReceivedGifts(): string {
    return `${SettingsManagementCollections.Settings}/wallet-gifts-reciver`;
  }
  static sendGift(): string {
    return `${SettingsManagementCollections.Settings}/wallet-gifts-sender/store`;
  }
  static acceptGift(): string {
    return `${SettingsManagementCollections.Settings}/wallet-gifts-reciver/store`;
  }
  static cancelGift(): string {
    return `${SettingsManagementCollections.Settings}/wallet-gifts/cancel`;
  }
  static getDoctorTicketProblems(): string {
    return `${SettingsManagementCollections.Settings}/doctor/tickets/problems`;
  }
}
