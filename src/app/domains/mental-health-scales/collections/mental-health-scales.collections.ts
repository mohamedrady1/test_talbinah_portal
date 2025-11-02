export class MentalHealthScalesManagementCollections {
  static ModuleName: string = 'api';

  static Moods: string = `${MentalHealthScalesManagementCollections.ModuleName}`;
  static MentalHealthScales: string = `${MentalHealthScalesManagementCollections.ModuleName}`;

  // Start Mood
  static getMoods(): string {
    return `${MentalHealthScalesManagementCollections.Moods}/moods`;
  }
  static storeUserMood(): string {
    return `${MentalHealthScalesManagementCollections.Moods}/moods/store`;
  }
  static lastSevenUserMood(): string {
    return `${MentalHealthScalesManagementCollections.Moods}/moods/last-seven`;
  }
  // End Mood

  static MentalHealthScalesListing(): string {
    return `${MentalHealthScalesManagementCollections.MentalHealthScales}/mental-assessment/categories`;
  }
  static CreateMentalHealthScale(): string {
    return `${MentalHealthScalesManagementCollections.MentalHealthScales}/mental-assessment/mental-test`;
  }

  static MyMentalHealthScalesListing(): string {
    return `${MentalHealthScalesManagementCollections.MentalHealthScales}/mental-assessment/report`;
  }
}

