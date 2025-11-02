export class PodcastsManagementCollections {
  static ModuleName: string = 'api';

  static Podcasts: string = `${PodcastsManagementCollections.ModuleName}`;

  static AllPodcastsListing(): string {
    return `${PodcastsManagementCollections.Podcasts}/podcast`;
  }

  static PodcastCategories(): string {
    return `${PodcastsManagementCollections.Podcasts}/podcast/categories`;
  }
  static toggleFavorite(): string {
    return `${PodcastsManagementCollections.Podcasts}/toggleFavorite`;
  }

  static FavoritePodcasts(): string {
    return `${PodcastsManagementCollections.Podcasts}/podcastfavorites`;
  }
  static RandomPodcasts(): string {
    return `${PodcastsManagementCollections.Podcasts}/podcast/random-podcasts`;
  }
  static RecommendedPodcasts(): string {
    // return `${PodcastsManagementCollections.Podcasts}/podcast/recommended-podcasts`;
    return `${PodcastsManagementCollections.Podcasts}/podcast/random-podcasts`;
  }
  static GetPodcastById(id: string): string {
    return `${PodcastsManagementCollections.Podcasts}/podcast/${id}`;
  }
}
