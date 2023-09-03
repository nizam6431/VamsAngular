export enum VisitorStatusObject {
    // cancelled ="cancelled",
    inprogress="inprogress",
    completed="completed",
    // noshow="noshow",
    // declined="declined",
    // pending="pending",
    // approved="approved",
    // rejected="rejected",
}

export enum AppointmentStatusObject {
    cancelled = "cancelled",
    inprogress = "inprogress",
    completed = "completed",
    scheduled = "scheduled",
    noshow = "noshow",
    declined = "declined",

    // pending="pending",
    // approved="approved",
    // rejected="rejected",
}

export enum hsqStatusObject {
    cancelled = "cancelled",
    inprogress = "inprogress",
    completed = "completed",
    scheduled = "scheduled",
    declined = "declined",
}

export enum EmailStatusObject {
    success="Success",
    failure="Failure"
}

export enum type {
    visitor_report="visitor_report",
    appointment_report="appointment_report",
    hsq_report="hsq_report",
    first_password="first_password",
    email_report="email_report"
    // reset_password="reset_password",
    
    // email_log="email_log",
}
export enum fileType {
    excel="excel",
    // csv="CSV"
}

export interface advanceFilter {
    status:string;
    timeRange:any;
    walkIn:boolean;
    scheduled:boolean;
    searchQueryByHost:string;
    searchQueryByVisitor:string;
    showOnlyComplexVisitor:boolean;
    includeVisitorPhoto?:boolean;
    includeComplexVisitor?:boolean;
    selectedBuildings?:any;
    selectedCompany?:any;
    complexLevelVisitor?:boolean;
    selectAllCompany:boolean,
    selectAllBuilding:boolean,
    noShow:boolean;
    VisitorTypeId:number;
    visitorPurposeId:number;
}