export class MainPageManagementCollections {
  static ModuleName: string = 'main-page-management';

  static Home: string = `${MainPageManagementCollections.ModuleName}/home`;

  static QuickAccessCards(): string {
    return `${MainPageManagementCollections.Home}/quick-access-cards`;
  }
  static PodcastStories(): string {
    return `${MainPageManagementCollections.Home}/podcast/stories`;
  }
  static homeContent(): string {
    return `api/home`;
  }
  static BannerClick(): string {
    return 'api/banners/user-click';
  }
}
