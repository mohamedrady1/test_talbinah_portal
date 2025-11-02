import { BasicGroupsManagementPermissions } from "../../permissions/basic-groups-management.permissions";

export interface MenuItem {
  id?: any;
  label?: string;
  textAr?: string;
  textEn?: string;
  selectedIcon?: string;
  icon?: string;
  link?: string;
  state?: boolean;
  expanded?: boolean;
  children?: any;
  permission?: boolean;
  subItems?: any;
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
  isHidden?: boolean;
  outsideLink?: boolean,
  target?: '_blank' | '_self',
}
export function hasPermission(permissionName: string): boolean {
  // let user = UserContextService.getUserContext();
  let user = {
    permissions: ['strings']
  };

  if (!user) {
    return false;
  }
  // return user.hasPermission(permissionName);
  return true;
}


// const hasAccessToDeparmentsList: boolean = UserContextService.hasPermission(
//   ServiceProviderManagementPermissions.ServiceProviderProfiles.ReadAll
// );

const hasAccessToBasicGroupsDeparments: boolean = hasPermission(
  BasicGroupsManagementPermissions.BasicGroupsCustomers.ReadAll
);
const hasAccessToBasicGroupsJobGrades: boolean = hasPermission(
  BasicGroupsManagementPermissions.BasicGroupsJobGrades.ReadAll
);
const hasAccessToBasicGroups: boolean = hasAccessToBasicGroupsDeparments || hasAccessToBasicGroupsJobGrades;

export const basicGroupsManagementMenu: MenuItem[] = [
  {
    id: 'dashboard',
    textAr: 'مجموعات أساسية',
    textEn: 'Basic Groups',
    icon: 'images/layout/icons/group.svg',
    selectedIcon: 'images/layout/icons/group-selected.svg',
    state: false,
    permission: hasAccessToBasicGroups,
    children: [
      {
        id: 'admin',
        textAr: 'الإدارات',
        textEn: 'Departments',
        routerLink: '/dashboard/admin',
        state: false,
        permission: hasAccessToBasicGroupsDeparments,
        child: true
      },
      {
        id: 'job-grades',
        textAr: 'درجات الوظيفة',
        textEn: 'Job Grades',
        routerLink: '/dashboard/job-grades',
        state: false,
        permission: hasAccessToBasicGroupsJobGrades,
        child: true

      },
      {
        id: 'jobs',
        textAr: 'الوظائف',
        textEn: 'Jobs',
        routerLink: '/dashboard/jobs',
        state: false,
        permission: true,
        child: true

      },
      {
        id: 'job-groups',
        textAr: 'مجموعات الوظائف',
        textEn: 'Job Groups',
        routerLink: '/dashboard/job-groups',
        state: false,
        permission: true,
        child: true
      },
    ]
  },
];
