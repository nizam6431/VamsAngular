export class grid_resp {
    data: any;
    mode: string;
}

export class buildingListObjClass {
    data: any;
    mode: string;
}

export class dataSourceForSmsTemplate {
    data: any;
    mode: string;
}

export class getAllEmailTemplate {
    pageSize: any;
    pageIndex: any;
    orderBy: String;
    orderDirection: String;
    name: String;
    tags: String;
    level2Id: Number;
    globalSearch: any
}

export class updateEmailTemplateBYIdReq {
    emailTemplateId: String;
    subject: String;
    htmlContent: String
}
export class getEmailTemplateByIdReq {
    emailTemplateId: String
}

export class getEmailTemplateByIdRes {
    emailTemplateId: String;
    displayId: String;
    shortCode: String;
    name: String;
    tags: String;
    languageCode: String;
    subject: String;
    htmlContent: String;
    productType: String;
    level1Id: Number;
    level2Id: Number;
}

export class updateEmailTemplateBYIdRes {
    statusCode: Number;
    message: String;
    data: null;
    errors: null;
}

export class emailTemplateRowClass {
    displayId: String;
    htmlContent: String;
    languageCode: String
    emailTemplateId: any;
    level1Id: 0
    level2Id: 0
    name: String
    productType: String
    shortCode: String
    subject: String
    tags: String
}

export class smsGetAllReq {
    pageSize: any;
    pageIndex: any;
    orderBy: String;
    orderDirection: String;
    globalSearch: String;
    level2Id: any
}

export class smsGetAllRes {
    pageSize: any;
    pageIndex: any;
    orderBy: String;
    orderDirection: String;
    globalSearch: String;
    level2Id: any
}

export class smsGetByIdReq {
    id: any;
    level2Id: any;
}

export class smsGetByIdRes {
    name: String;
    smsContent: String;
    tag: String;
    languageCode: String;
    id: any
}

export class smsUpdateByIdReq {
    id: any;
    level2Id: any;
    smsContent: any
}

export class smsUpdateByIdRes {
    name: String;
    smsContent: String;
    tag: String;
    languageCode: String
}

export class commonResponse {
    data: any
    errors: any
    message: String
    statusCode: Number
}

export class smsTemplateRowClass {
    name: String;
    smsContent: String;
    tag: String;
    languageCode: String;
    id: String;
    level2Id: any;
}

export class contractorConfigGetAllReq {
    pageSize: any;
    pageIndex: any;
    orderBy: String;
    orderDirection: String;
    globalSearch: String;
    level2Id: any;
    searchByStatus: boolean;
    level3Id: any;
}

export class contractorConfigGetAllRes {
    configId: number;
    displayId: String;
    productType: String;
    configFieldName: String;
    configValue: String;
    isActive: boolean;
    level1Id: Number;
    level2Id: Number;
    level3Id: Number;
}


export class contractorConfigGetByIdReq {
    configId: number
}

export class contractorConfigGetByIdRes {
    configId: number;
    displayId: String;
    productType: String;
    configFieldName: String;
    configValue: String;
    isActive: boolean;
    level1Id: Number;
    level2Id: Number;
    level3Id: Number;
}

export class contractorConfigUpdateByIdReq {
    configId: number;
    configFieldName: String;
    configValue: String;
}

export class contractorConfigUpdateByIdRes {
    message: 'Updated Successfully'
}

export class contractorConfigRow {
    configFieldName: String
    configId: number
    configValue: String
    displayId: String
    isActive: boolean
    level2Id: any
    level3Id: any
}

export class contractorConfigaAddReq {
    configFieldName: String;
    // configValue: any;
    level2Id: Number;
    level3Id: Number;
}

export class contractorConfigAddRes {
    message: "Contractor Config updated successfully."
}

export class contractorConfigaDeleteReq {
    configId: number
}

export class contractorConfigDeleteRes {
    message: "Contractor Config deleted successfully."
}

export class deviceNames{
    gallagher: "Gallagher";
    kantech:"Kantech"
}
export class cardType{

}
