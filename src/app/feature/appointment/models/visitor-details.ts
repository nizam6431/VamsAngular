export interface visitorInfo{
    checkInTime:string
    checkOutTime: string
    date: string
    endTime: string
    hostEmail: string
    hostFirstName: string
    hostIsdCode: string
    hostLastName: string
    hostPhone: string
    id: number
    meetingNotes: string
    rejectReason: string;
    startTime: string;
    status: string;
    type:string;
    visitCompany: string;
    visitorEmail: string;
    visitorFirstName: string;
    visitorIsd: string;
    visitorLastName: string;
    visitorPhone: string;
    visitorPurpose: string;
    visitorType: string;
    departmentName:string;
    hostCompany:string;
    isTimeIn:boolean;
    isTimeOut:boolean;
    isMultiDayAppointment:boolean;
    multiDayStartDate:string;
    multiDayEndDate: string;
    hostFullName: string;
}

export interface appointment{
    appointmentId: number;
    checkInTime: string
    date:string
    email: string
    endTime:string
    firstName:string
    isdCode:string
    lastName:string
    meetingNotes:string
    phone:string
    rejectReason:string
    startTime:string;
    status:string;
    visitorCompany:string;
    visitorName:string;
    visitorPurpose:string;
    visitorType:string;
}

export interface appointmentGrid{
    host:string;
    startDate:string;
    endDate:string;
    visitorDetails:string;
}