export class SupportGroupsManagementCollections {
  static ModuleName: string = 'api';

  static Seminars: string = `${SupportGroupsManagementCollections.ModuleName}`;


  static SeminarsListing(): string {
    return `${SupportGroupsManagementCollections.Seminars}/seminars`;
  }

  static MySeminarsListing(): string {
    return `${SupportGroupsManagementCollections.Seminars}/seminars/my-seminars`;
  }

  static getSeminarById(id: number): string {
    return `${SupportGroupsManagementCollections.Seminars}/seminars/${id}`;
  }

  static storeSeminar(): string {
    return `${SupportGroupsManagementCollections.Seminars}/seminars`;
  }
}
