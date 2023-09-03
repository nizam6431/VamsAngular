export class UpdateEmailConfig {
    mailServerId: number;
    level2Id: number;
    server: string;
    outPort: number;
    fromId: string;
    requireAuthentication: boolean;
    enableSSL: boolean;
    authUserId: string;
    authUserP: string;
    displayName: string;
}

export class AddEmailConfig {
    level2Id: number;
    server: string;
    outPort: number;
    fromId: string;
    requireAuthentication: boolean;
    enableSSL: boolean;
    authUserId: string;
    authUserP: string;
    displayName: string;
}

export class GetAllEmailConfig {
    globalSearch?: any;
    pageSize: number;
    pageIndex: number;
    orderBy?: any;
    orderDirection: string;
}

export interface PermissionDataObj {
    statusCode: number;
    message?: any;
    data: Data[];
    errors?: any;
}

export interface Data {
    roleId: string;
    roleName: string,
    shortName: string,
    permissions: permissions[];
}

export interface permissions {
    permissionId: string,
    permissionName: string,
    isDisabled: string,
    permissionKey: string,
    rolePermissions: reqObj[];
}

export interface reqObj {
    rolePermissionId: string;
    isPermissible: string;
}
