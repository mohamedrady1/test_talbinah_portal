export class PaymentsManagementCollections {
  static ModuleName: string = 'support-groups-management';

  static Payments: string = `${PaymentsManagementCollections.ModuleName}/support-groups`;

  static PodcastsListing(): string {
    return `${PaymentsManagementCollections.Payments}/list`;
  }
  static FavoritePayments(): string {
    return `${PaymentsManagementCollections.Payments}/favorites`;
  }
  static GetPodcastById(id: string): string {
    return `${PaymentsManagementCollections.Payments}/${id}`;
  }
}
