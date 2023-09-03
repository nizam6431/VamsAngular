export class GetAllContractorsReq {
    pageSize: any;
    pageIndex: any;
    orderBy: string;
    orderDirection: string;
    fromTime: string;
    toTime: string;
    globalSearch: string;
    level2Ids: number[];
    level3Ids: number[];
    status:string[];
}

export class GetAllContractorRes {
    id: number;
    contractorName: string;
    location: string;
    subLocation: string;
    mobileno: string;
    email: string;
    contractorCompanyId: number;
    firstName: string;
    lastName: string;
    isdCode: number;
    phone: string;
    contractorPhotoURL: string;
    departmentName: string;
    startDate: string;
    endDate: string
    startTime: string;
    endTime: string;
    checkInTime: string;
    checkOutTime: string;
    status: string;
    contractorCompanyName:string
}

export class GetContractorDetailsByQrCodeReq {
    appointmentId: number;
    qrCode: string;
}

export class GetContractorDetailsByQrCodeRes {
    appointmentId: number;
    contractorId: number;
    firstName: string;
    lastName: string;
    email: string;
    isdCode: string;
    phone: string;
    hostName: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    timeIn: any;
    timeOut: any;
    isTimeIn: boolean;
    isTimeOut: boolean
}

export class ContractorCheckInCheckOutReq {
    appointmentId: number;
    qrCode: string;
    level2Id: number;
    level3Id: number;
    checkinType: string;
}
export class ContractorCheckInCheckOutRes {
    statusCode: number;
    message: string;
    data: string;
    errors: any
}