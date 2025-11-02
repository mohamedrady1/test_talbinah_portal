import { getGroupPermissionFactory, PermissionEnum } from '../../../common/core/permissions';
import { getBasicGroupsManagementModuleName } from './basic-groups-management.permissions';

export class CustomersPermissions {
  static GroupName = `${getBasicGroupsManagementModuleName()}.Customers`;

  static getPermissions = getGroupPermissionFactory(CustomersPermissions.GroupName); // BasicGroupsManagement.Customers

  static Permissions = {
    Create: CustomersPermissions.getPermissions(PermissionEnum.CREATE),
    Read: CustomersPermissions.getPermissions(PermissionEnum.READ),
    ReadAll: CustomersPermissions.getPermissions(PermissionEnum.READ_ALL),
    Update: CustomersPermissions.getPermissions(PermissionEnum.UPDATE),
    Activate: CustomersPermissions.getPermissions(PermissionEnum.ACTIVATE),
    DeActivate: CustomersPermissions.getPermissions(PermissionEnum.DE_ACTIVATE)
  };
}
