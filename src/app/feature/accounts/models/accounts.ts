export interface ComplexPermissionData {
    "permissionId": string;
    "permissionName": string;
    "isDisabled": boolean;
    "isPermissible": boolean;
    "isHidden": boolean;
    "permissionKey": string;
}

export interface ComplexPermissions {
    statusCode: number;
    message?: any;
    data: ComplexPermissionData;
    errors?: any;
}