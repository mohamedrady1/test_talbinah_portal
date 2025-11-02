export class BasicGroupsManagementCollections {
  static ModuleName = 'basic-groups-management';

  static Departments = `${BasicGroupsManagementCollections.ModuleName}/departments`;
  static Department(providerId: string) {
    return `${BasicGroupsManagementCollections.Departments}/${providerId}`;
  }

  static JobGrades = `${BasicGroupsManagementCollections.ModuleName}/job-grades`;
  static JobGrade(providerId: string) {
    return `${BasicGroupsManagementCollections.Departments}/${providerId}`;
  }
}
