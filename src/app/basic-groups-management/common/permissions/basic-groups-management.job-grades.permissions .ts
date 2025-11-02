import { getGroupPermissionFactory, PermissionEnum } from '../../../common/core/permissions';
import { getBasicGroupsManagementModuleName } from './basic-groups-management.permissions';

export class JobGradesPermissions {
  static GroupName = `${getBasicGroupsManagementModuleName()}.JobGrades`;

  static getPermissions = getGroupPermissionFactory(JobGradesPermissions.GroupName); // BasicGroupsManagement.JobGrades

  static Permissions = {
    Create: JobGradesPermissions.getPermissions(PermissionEnum.CREATE),
    Read: JobGradesPermissions.getPermissions(PermissionEnum.READ),
    ReadAll: JobGradesPermissions.getPermissions(PermissionEnum.READ_ALL),
    Update: JobGradesPermissions.getPermissions(PermissionEnum.UPDATE),
    Activate: JobGradesPermissions.getPermissions(PermissionEnum.ACTIVATE),
    DeActivate: JobGradesPermissions.getPermissions(PermissionEnum.DE_ACTIVATE)
  };
}
