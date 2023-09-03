export interface CountryData {
    statusCode: number;
    message?: any;
    data: Data[];
    errors?: any;
}

export interface Data {
    id: number;
    did: string;
    name: string;
    niceName: string;
    isoCode: string;
    isO3: string;
    isdCode: number;
    minMobileLength: number;
    maxMobileLength: number;
}

export interface TimeZoneData {
    id: number;
    name: string;
    displayName: string;
    shortName: string;
    countryId: number;
}

export interface TimeZoneObject {
    statusCode: number;
    message?: any;
    data: TimeZoneData[];
    errors?: any;
}