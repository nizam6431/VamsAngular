
export class Visitor {
    firstName: string;
    lastName: string;
    isdCode: string;
    phone: string;
    email: string;
    visitorCompany: string;
    visitorPhotoUrl:string;
}

export class AppointmentSchedule {
    device: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    visitorTypeId: number;
    visitPurposeId: number;
    meetingNotes: string;
    employeeId: number;
    visitors: Visitor[] = [];
    level2Id:number;
}

export class shareAppointmentSchedule {
    token:string;
    device: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    visitorTypeId: number;
    visitPurposeId: number;
    meetingNotes: string;
    employeeId: number;
    visitors: Visitor[] = [];
}

export interface Schedule {
    isRestricted: any;
    id: number;
    startTime: string;
    endTime: string;
    date: string;
    status: string;
    hostFirstName: string;
    hostLastName: string;
    hostIsdCode: string;
    hostPhone: string;
    hostEmail: string;
    hostCompany:string;
    departmentName:string;
    employeeId:number;
    type: string;
    isIdProofExists:boolean;
    isHSQForIdProof: boolean;
    checkInTime: Date;
    checkOutTime: Date;
    meetingNotes?: any;
    visitorType?: any;
    visitorFirstName: string;
    visitorLastName: string;
    visitorEmail: string;
    visitorIsd?: any;
    visitorPhone?: any;
    visitorPurpose?: any;
    visitCompany?: any;
    rejectReason?: any;
    isMultiDayAppointment?: boolean;
    isBypass:boolean;
    isTimeIn:boolean;
    isTimeOut:boolean
}

export interface Data {
    totalCount: number;
    pageCount: number;
    list: Schedule[];
    pageSize:number;
}

export interface AppointmentScheduleDetails {
    statusCode: number;
    message?: any;
    data: Data;
    errors?: any;
}

export class GetAppointmentRequest {
    pageSize: number;
    pageIndex: number;
    orderBy: string;
    orderDirection: string;
    fromTime: string;
    toTime: string;
    globalSearch: string;
    status: string[];
    level2Ids:number[];
    includeComplexVisitor: boolean;
}
export interface RestrictedVisitorRequest {
    firstName: string,
    lastName: string,
    emailId: string,
    isd: string,
    mobileNo: string,
    level2Id: number,
    level3Id: number,
    companyUnitId: number
}

export class DriversLicenseDetails{

}

export interface visitorScheduleDetails {
    statusCode: number;
    message?: any;
    data: Data;
    errors?: any;
}
export class AllRestrictedVisitorRequest {
    pageSize: number;
    pageIndex: number;
    orderBy: string;
    orderDirection: string;
    fromTime: string;
    toTime: string;
    globalSearch: string;
    status: string[];
}