export class AddContractorCompany {
    id: number;
    uniqueId: string;
    companyName: string;
    companyLogo: string;
    url: string;
    level2Id?: any;
    level3Id?: any;
    contactFirstName: string;
    contactLastName: string;
    email: string;
    IsdCode: string;
    phone: string;
    address: Address = <Address>{};
    status:string;
}

export interface Address {
    addressId: string;
    line1: string;
    line2?: any;
    officeNo?: any;
    floorNo?: any;
    zipCode: string;
    city: string;
    state: string;
    country: string;
    contactEmail?: any;
    contactIsd?: any;
    contactMobile?: any;
    mapLink?: any;
}

export interface Data {
    id: number;
    uniqueId: string;
    companyName: string;
    companyLogo: string;
    url: string;
    contactFirstName: string;
    contactLastName: string;
    email: string;
    isdCode: string;
    phone: string;
    status: string;
    address: Address;
}

export class ContractorCompanyObject{
    statusCode: number;
    message?: any;
    data: Data  = <Data>{};;
    errors?: any;
}