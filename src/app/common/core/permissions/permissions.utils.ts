export function getPermissionName(groupName: string, permissionName: string) : string {
  return `${groupName}.${permissionName}`;
}

export function getGroupPermissionFactory(groupName: string): (permissionName: string) => string {
  return getPermissionName.bind(null, groupName)
}
