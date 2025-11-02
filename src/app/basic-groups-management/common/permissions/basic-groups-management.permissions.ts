import { CustomersPermissions } from "./basic-groups-management.customers.permissions";
import { JobGradesPermissions } from "./basic-groups-management.job-grades.permissions ";

export class BasicGroupsManagementPermissions {
  static BasicGroupsCustomers = CustomersPermissions?.Permissions;

  static BasicGroupsJobGrades = JobGradesPermissions?.Permissions;
  // static BasicGroupsCustomersCategories = ProviderExpenseCategoriesPermissions?.Permissions;
}

export function getBasicGroupsManagementModuleName() {
  return 'BasicGroupsManagement';
}
