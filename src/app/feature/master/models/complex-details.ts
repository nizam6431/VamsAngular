
export interface AccountConfig {
    displayId: string;
    prefix: string;
    contractorPrefix: string;
    timezone: string;
    dateFormat: string;
    timeFormat: number;
    level2Id: number;
    level1Id: number;
}

export interface Address {
    addressId: string;
    line1: string;
    line2: string;
    officeNo: string;
    floorNo: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
    contactEmail: string;
    contactIsd: string;
    contactMobile: string;
    mapLink: string;
}

export interface Data {
    displayId: string;
    name: string;
    status: string;
    shortName: string;
    domainName: string;
    darkThemeId: number;
    lightThemeId: number;
    addressId: number;
    licenseCount: number;
    productType: string;
    lightThemeLogoUrl: string;
    darkThemeLogoUrl: string;
    accountConfigId: number;
    accountConfig: AccountConfig;
    address: Address;
    setupQRCodeUrl: string;
    qrLogo:string;
}

export interface RootObject {
    statusCode: number;
    message?: any;
    data: Data;
    errors?: any;
}

export interface AccountConfigToUpdate {
    prefix: string;
    contractorPrefix: string;
    timezone: string;
    dateFormat: string;
    timeFormat: number;
    timeZoneId:number;
    level2Id: number;//complexId
    level1Id: number;//buildingId
}
export interface AddressToUpdate {
    line1: string;
    line2: string;
    officeNo: string;
    floorNo: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
    contactEmail: string;
    contactIsd: string;
    contactMobile: string;
    mapLink: string;
}

export class ComplexDetailsUpdate {
    id: number;
    displayId: string;
    name: string;
    shortName: string;
    domainName: string;
    darkThemeDisplayId: string;
    lightThemeDisplayId: string;
    licenseCount: number;
    productType: string;
    lightThemeLogoUrl: string;
    darkThemeLogoUrl: string;
    setupQRCodeUrl: string;
    accountConfig: AccountConfigToUpdate = <AccountConfigToUpdate>{};
    address: AddressToUpdate = <AddressToUpdate>{};
    qrLogo:string
}

export class AppEvent<T> {
    constructor(
      public type: "LOGO_CHANGED",
      public payload: T,
    ) {}
  }

export class AppBuildingEvent<T> {
    constructor(
      public type: "BUILDING_CHANGED",
      public payload: T,
    ) {}
  }