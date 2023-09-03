export class visitorReportsRequest {
    pageSize: number;
    pageIndex: number;
    orderBy: string;
    orderDirection: string;
    level2Ids: number[];
    level3Ids: number[];
    status: string[];
    fromDate: string;
    toDate: string;
    visitorGlobalSearch: string;
    hostGlobalSearch: string;
    includeVisitorPhoto: boolean;
    includeComplexVisitor:boolean;
    scheduled:boolean;
    walkin:boolean;
    noShow:boolean;
    VisitorTypeId:number;
    visitorPurposeId:number;
}

export interface summary {
    totalVisitor: number;
    checkedOutVisitors: number;
    onPremises: number;
}

export interface records {
    totalCount: number;
    pageCount: number;
    list: reportData[];
}

export interface Data {
    summary: summary;
    records: records;
}

export interface reportData {
    appointmentId: number;
    visitorFirstName: string;
    visitorLastName: string;
    visitorIsd: string;
    visitorPhone: string;
    visitorEmailId: string;
    visitorCompany: string;
    hostFirstName: string;
    hostLastName: string;
    hostIsd: string;
    hostPhone: string;
    hostEmail: string;
    hostCompany: string;
    checkInDate: string;
    checkInTime: string;
    checkOutDate: string;
    checkOutTime: string;
    timeInVenue: string;
    timeInTime: string;
    timeOutTime: string;
    complex: string;
    building: string;
    company: string;
}

export class FirstTimeLoginRequest {
    pageSize: number;
    pageIndex: number;
    orderBy: string;
    orderDirection: string;
    level2Ids: number[];
    level3Ids: number[];
    status: string[];
    fromDate: string;
    toDate: string;
    includeVisitorPhoto: boolean;
    employeeGlobalSearch:string;
    includeComplexEmployee:boolean;
}
export  interface ReportsResponse {
    statusCode: number;
    message?: any;
    data: Data;
    errors?: any;
}