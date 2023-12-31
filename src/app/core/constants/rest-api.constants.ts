import { InjectionToken } from "@angular/core";

export let API_CONFIG = new InjectionToken("app.config");

export const restApiSuffix = {
    TOKEN: 'token',
    LOGIN: 'account/login',
    LOGOUT: 'account/Logout',
    GET_MASTER_DETAILS: 'Master/Get',
    GETALL_DEPARTMENTS: 'Department/GetAllAsync',
    UPDATE_DEPARTMENT: 'Department/UpdateAsync',
    ADD_DEPARTMENT: 'Department/AddAsync',
    DELETE_DEPARTMENT: 'Department/DeleteAsync',
    GETALL_LEVEL2: 'Level2/GetAllAsync',
    GETALL_LEVEL2_LOCATION: 'Level2/GetAllVisitLocationAsync',
    UPDATE_LEVEL2: 'Level2/UpdateAsync',
    ADD_LEVEL2: 'Level2/AddAsync',
    GET_LEVEL2_DETAILS: 'Level2/GetAsync',
    DELETE_LEVEL2: 'Level2/DeleteAsync',
    GET_COMPLEX_DETAILS: 'Level1/Get',
    UPDATE_COMPLEX_DETAILS: 'Level1/Update',
    GET_TIME_ZONE_BY_ID: 'Country/GetTimeZoneById',
    GET_ALL_COUNTRY: 'Country/GetAll',
    ADD_LEVEL3: 'Level3/AddAsync',
    GETALL_LEVEL3: 'Level3/GetAll',
    GET_LEVEL3: 'Level3/GetAsync',
    DELETE_LEVEL3: 'Level3/DeleteAsync',
    GETALL_DEPARTMENTS_LEVEL3: 'Department/GetAllAsync',
    DELETE_DEPARTMENT_LEVEL3: 'Department/DeleteAsyn',
    UPDATE_DEPARTMENT_LEVEL3: 'Employee/Update',
    GETALL_EMPLOYEE: 'Employee/GetAll',
    GETALL_LEVEL2_EMPLOYEE: 'Employee/GetLevel2',
    GET_EMPLOYEE_BY_ID: 'Employee/GetById',
    UPDATE_EMPLOYEE: 'Employee/Update',
    ADD_EMPLOYEE: 'Employee/Create',
    DELETE_EMPLOYEE: 'Employee/Delete',
    UPDATE_LEVEL3: 'Level3/UpdateAsync',
    CHANGE_ADMIN_ROLE: "Level3/changeAdminRole",
    GET_ROLE: 'Account/GetRole',
    VALIDATE_INVITATION_TOKEN: 'Account/ValidateInvitationToken',
    SET_FIRST_PASSWORD: 'Account/SetFirstPassword',
    CHANGE_PASSWORD: 'Account/ChangePassword',
    CHANGE_PASSWORD_EXCEL: 'Account/ChangePasswordExcel',
    COMPANY_UNIT_BY_COMPANY: 'Level3/CompanyUnitByCompany',
    VALIDATE_RESET_TOKEN: 'Account/ValidateResetToken',
    RESET_PASSWORD: "Account/ResetPassword",
    GET_ROLE_BY_LEVEL: "Account/GetRoleByLevel",
    GET_BY_ID: "Appointment/GetByIdAsync",
    CHECK_IN_ASYNC: "Appointment/CheckInAsync",
    GET_BY_QR_CODE_ASYNC: "Appointment/GetByQrCodeAsync",
    GET_BY_QR_CODE_ASYNC_BY_TIME_IN_OUT: "Appointment/GetAppointmentDetailsByQRCodeAsync",
    BY_PASS_ASYNC: "Appointment/ByPassAsync",
    CHECK_OUT_ASYNC: "Appointment/CheckOutAsync",
    APPOINTMENT_SCHEDULE: "Appointment/ScheduleAsync",
    APPOINTMENT_GET_ALL_SCHEDULE: "Appointment/GetAllAsync",
    COMPANY_BY_BUILDING: "Level3/CompanyByBuilding",
    CREATE_WALK_IN: "Appointment/WalkInAsync",
    SET_DEFAULT_BUILDING: "Level2/SetDefault",
    SET_DEFAqULT_BUILDING: "Level2/SetDefault",
    APPOINTMENT_RE_SCHEDULE: "Appointment/ReScheduleAsync",
    CANCEL_APPOINTMENT: "Appointment/CancelAsync",
    REJECT_REASON: "RejectReason/GetAllAsync",
    IS_VISITOR_RESTRICTED: "RestrictedVisitor/IsUserRestricted",
    DEVICE_SETTINGS_GET_ALL: "DeviceSetting/GetAllAsync",
    DEVICE_SETTINGS_GET_BY_ID: "DeviceSetting/GetByIdAsync",
    RESTRICT_VISITOR_GET_ALL: "RestrictedVisitor/GetAllAsync",
    TIME_IN_TIME_OUT_GET_BY_ID: "Appointment/GetTimeInOutById",
    TIME_IN_AND_TIME_OUT_GET_BY_ID: "Appointment/TimeInOutAsync",
    TIME_IN_TIME_OUT_HIT: "Appointment/TimeInOutAsync",
    TIME_IN_OUT_BY_QR_CODE: "Appointment/TimeInOutAsyncWithQR",
    APPOINTMENT_DETAILS_QR: "Appointment/GetByDIdAsync",
    GET_ACCESS_LEVELS: "DeviceSetting/GetAccessLevels",
    GET_VISITOR_SETTING: "VisitorSetting/GetDefaultVisitorSettingAsync",
    GET_CURRENT_TYPE_BY_ZONE: "Master/GetCurrentTimeByZone",
    GET_DRIVING_LICENCE_DATA: "USDrivingLicence/PostDL",
    ADD_SHARE_APPOINTMENT_INVITATION: "Appointment/ShareAppointmentInvitationAsync",
    GET_EMPLOYEE_QR_CODE: 'Employee/GetEmployeeQRCode',
    VALIDATE_TOKEN: "Appointment/ValidateAppointmentInvitationToken",
    SHARE_APPOINTMENT_SCHEDULE: "Appointment/ShareAppointmentScheduleAsync",
    VISITOR_REPORTS_DATA: "Report/VisitorReport",
    ADD_RESTRICTED_VISITOR: "RestrictedVisitor/AddAsync",
    REMOVE_RESTRICTED_VISITOR: "RestrictedVisitor/UnblockVisitorAsync",
    GET_BUILDING_AND_COMPANY: "Level2/GetBuildingandCompanies",
    EXPORT_VISITOR_REPORTS_DATA: "Report/ExportVisitorReport",
    EXPORT_EMAIL_REPORTS_DATA: "Report/ExportEmailLogReport",
    ADD_ACCOUNT: "AccountSetup/create",
    APPOINTMENT_REPORTS_DATA: "Report/AppointmentReport",
    HSQ_REPORTS_DATA: "Report/AppointmenthsqReport",
    EMAIL_REPORTS_DATA: "Report/EmailLogReport",
    EXPORT_APPOINTMENTS_REPORTS_DATA: "Report/ExportAppointmentReport",
    EXPORT_APPOINTMENTS_HSQ_REPORTS_DATA: "Report/ExportAppointmenthsqReport",
    APPOINTMENT_TEMPLATE: "ExportImport/exportAppointmentSample",
    APPOINTMENT_IMPORT: "ExportImport/importAppointments",
    REAUTHENTIKATE_TOKEN: "account/UserDetail",
    DRIVING_LICENSE_UPDATE: "Appointment/UpdateDrivingLicenseAsync",
    VISITOR_REPORT_DETAILS: "Report/VisitorReportDetails",
    APPOINTMENT_REPORT_DETAILS: "Report/AppointmentReportDetails",
    EMAIL_LOG_REPORT_DETAILS: "Report/EmailLogReportDetails",
    APPOINTMENT_HSQ_REPORT_DETAILS: "Report/AppointmentReporthsqDetails",
    IS_VISITOR_RESTRICTED_DETAILS: "RestrictedVisitor/IsUserRestrictedData",
    RESTRICT_All_VISITOR_GET_ALL: "RestrictedVisitor/GetAllVisitorsAsync",
    SIGNAL_R_CONNECTION_ADD: "SignalRConnection/AddAsync",
    SIGNAL_R_CONNECTION_DELETE: "SignalRConnection/DeleteAsync",
    NOTIFICATIONSETTING_GETNOTIFICATIONSEGBYID: "NotificationSetting/GetNotificationSettingAsync",
    NOTIFICATIONSETTING_UPDATENOTIFICATIONSETTINASYNC: "NotificationSetting/UpdatetNotificationSettingAsync",
    APPOINTMENT_SETTING_GET_APPOINTMENT_SETTING: "AppointmentSetting/GetAppointmentSettingAsync",
    ADD_MAILSERVER: "MailServer/AddAsync",
    GET_MAILSERVER: "MailServer/GetAllAsync",
    DELETE_MAILSERVER: "MailServer/DeleteAsync",
    UPDATE_MAILSERVER: "MailServer/UpdateAsync",
    GET_MAILSERVER_BY_ID: "MailServer/GetById",
    ADD_APPOINTMENT_CANCEL_REASON: "RejectReason/AddAsync",
    DELETE_APPOINTMENT_CANCEL_REASON: "RejectReason/DeleteAsync",
    UPDATE_APPOINTMENT_CANCEL_REASON: "RejectReason/UpdateAsync",
    EMPLOYEE_SETTING_GET_EMPLOYEE_SETTING_GET_ALL: "EmployeeSetting/GetEmployeeSettingAsync",
    EMPLOYEE_SETTING_UPDATE_EMPLOYEE_SETTING: "EmployeeSetting/UpdatetEmployeeSettingAsync",
    ADD_PDF_URL: "PolicyDocuments/AddAsync",
    GET_PDF_URL: "PolicyDocuments/GetDetailsAsync",
    GET_VISITOR_PDF: "PolicyDocuments/GetVisitorPolicyDocumentAsync",
    UPDATE_PDF_URL: "PolicyDocuments/UpdateAsync",
    UPDATE_APPOINTMENT_SETTING: "AppointmentSetting/UpdateAppointmentSettingAsync",
    GET_GENERAL_SETTINGS: "GeneralSetting/GetGeneralSettingAsync",
    UPDATE_GENERAL_SETTINGS: "GeneralSetting/UpdateGeneralSettingAsync",
    GET_ALL_PROVIDERS: "ProviderSetup/GetAllAsync",
    GET_BYID_PROVIDERS: "ProviderSetup/GetById",
    ADD_PROVIDERS: "ProviderSetup/AddAsync",
    DELETE_PROVIDERS: "ProviderSetup/DeleteAsync",
    UPDATE_PROVIDERS: "ProviderSetup/UpdateAsync",

    GET_VISITOR_SETTING_FOR_SETTING: "VisitorSetting/GetVisitorSetting",
    UPDATE_VISITOR_SETTING: "VisitorSetting/UpdateVisitorSetting",
    GET_BUILDING_LIST: "MailServer/BuildingList",
    PROVIDER_MASTER: "ProviderMaster/GetAllAsync",
    PROVIDER_SERVER_NAME: "ProviderSetup/GetServerName",
    GET_LANGUGE_DETAIL: "Language/GetAllAsync",
    UPDATE_QR_CODE_LINK: "AccountSetup/Update",
    GET_MASTER_S3: "S3/getsmaster3Settings",
    GET_COMMERCIAL_S3: "S3/getcommercials3Settings",
    UPDATE_PRIVACY_POLICY: "Account/CheckAndUpdatePrivacyPolicy",
    UPDATE_TERMS_CONDITIONS: "Account/CheckAndUpdateTermsConditions",
    GET_PROFILE_BY_ID: "Employee/GetEmpProfileById",
    UPDATE_PROFILE: "Employee/UpdateEmpProfile",
    GET_DEFAULT_BANNER_IMAGE: "Level1/GetBannerImage",
    UPDATE_BANNER_IMAGE: "Level1/UpdateBannerImage",
    CHECK_OUT_ALL_APPOINTMENT: "Appointment/CheckOutAllAsync",
    Export_Import_Import_Employee_Template: "ExportImport/importEmployeeTemplate",
    Export_Import_Export_Employee_Template: "ExportImport/exportEmployeeTemplate",
    Export_Import_Validate_Employees: "ExportImport/ValidateEmployees",
    GET_ALL_BUILDINGS: 'Level2/GetAllBuildings',
    ALL_HSQ_QUESTION: "HSQMaster/GetAllAsync",
    ADD_HSQ_QUESTION: "HSQMaster/SaveAsync",
    UPDATE_HSQ_QUESTION: "HSQMaster/UpdateAsync",
    DELETE_HSQ_QUESTION: "HSQMaster/DeleteAsync",
    CompanySampleFile: "ExportImport/exportCompanySample",
    Submit_Upload_company: "ExportImport/importCompanies",
    COMPLEX_ALL_PERMISSION: "Permission/GetRolePermissionByLevel1Async",
    ROLES_OF_COMPLEX: "Permission/GetRolesByLevel1",
    UPDATE_PERMISSION: "Permission/UpdateRolePermission",
    first_time_password_change: "Report/FirstTimeChangePasswordReport",
    first_time_password: "Report/ExportFirstTimeChangePasswordReport",
    VALIDATE_BY_PASS_PIN: "Appointment/ValidateByPassPin",
    CHECK_IN_ASYNC_WITHOUT_ACCESS_CONTROL: "Appointment/CheckInAsyncWithoutAccessControl",
    SUPERADMIN_COMPLEX_LIST: "Level1/GetAllComplex",
    SUPERADMIN_COMPLEX_PERMISSIONS: "Permission/GetRolePermissionsAsync",
    SUPERADMIN_UPDATE_PERMISSIONS: "Permission/UpdatePermission",
    DATA_SYNCCHRONIZATION: "DataSynchronization/AppointmentDataSynchronization",
    HEAP_MAP_DATA: "Appointment/GetAllHeatMapAppointmentsAsync",
    BAR_GRAPH_DATA: "Appointment/GetAllDashBoardPanelLeftDataAsync",
    VISITOR_COUNT_DATA: "Appointment/GetAllDashBoardPanelDownDataAsync",
    PIE_CHART_DATA: "Appointment/GetAllDashBoardPanelLeftChartDataAsync",
    ADD_DEVICE_SETUP: "ProviderDeviceSetup/AddAsync",
    UPDATE_DEVICE_SETUP: "ProviderDeviceSetup/UpdateAsync",
    DELETE_DEVICE_SETUP: "ProviderDeviceSetup/DeleteAsync",
    GET_ALL_DEVICE_SETUP: "ProviderDeviceSetup/GetAllAsync",
    ADD_ACCESS_SETUP: "ProviderAccessSetup/AddAsync",
    DELETE_ACCESS_SETUP: "ProviderAccessSetup/DeleteAsync",
    UPDATE_ACCESS_SETUP: "ProviderAccessSetup/UpdateAsync",
    GET_ALL_ACCESS_SETUP: "ProviderAccessSetup/GetAllAsync",
    GET_ACCESS_LEVEL_LIST: "ProviderAccessSetup/GetAccessLevels",
    GET_DEVICE_UNIQUE_ID: "ProviderAccessSetup/GetDeviceUniqueId",
    ACCESS_SETUP_BY_ID: "ProviderAccessSetup/GetById",
    PROVIDER_MASTERS_LIST: "ProviderMaster/GetAllAsync",
    ADD_PROVIDER_MASTERS: "ProviderMaster/AddAsync",
    UPDATE_PROVIDER_MASTERS: "ProviderMaster/UpdateAsync",
    SAVE_DEFAULT_HSQ: "HSQMaster/SaveDefaultHSQAsync",
    GET_ALL_EMAIL_TEMPLATES: "EmailTemplate/GetAll",
    GET_EMAIL_TEMPLATE_BY_ID: "EmailTemplate/GetByIdAsync",
    UPDATE_TEMPLATE_BY_ID: "EmailTemplate/UpdateAsync",
    GET_ALL_SMS_TEMPLATES: "SmsTemplate/GetAllAsync",
    GET_SMS_TEMPLATE_BY_ID: "SmsTemplate/GetById",
    UPDATE_SMS_TEMPLATE_BY_ID: "SmsTemplate/UpdateAsync",
    GET_SMS_TAG: "SmsTemplate/GetSmsTag",

    GET_VISITOR_TYPE: "VisitorType/GetAllAsync",
    GET_PURPOSE_OF_VISITOR: "VisitorPurpose/GetAllAsync",
    GET_ALL_LOCATION: "Level2/GetAllVisitLocationAsync",
    GET_VISITOR_PURPOSE: "VisitorPurpose/GetAllVisitorPurposeAsync",
    GET_VISITOR_TYPE_All: "VisitorType/GetAllVisitorTypeAsync",

    GET_CONTRACTORCOMPANY:"ContractorCompany/GetAllAsync",
    ADD_CONTRACTOR_COMPANY:"ContractorCompany/AddAsync",
    DELETE_CONTRACTOR_COMPANY:"ContractorCompany/DeleteAsync",
    GET__CONTRACTOR_COMPANY_BY_ID:"ContractorCompany/GetById",
    UPDATE_CONTRACTOR_COMPANY:"ContractorCompany/UpdateAsync",
    ADD_CONRACTOR: "ContractorCompany/AddContractorAsync",
    UPDATE_CONRACTOR: "ContractorCompany/UpdateContractorAsync",
    ALL_CONTACTORS: "ContractorCompany/GetAllContractorAsync",
    GET_CONRACTOR: "ContractorCompany/GetContractorAsync",
    GET_ALL_CONTRACTOR_CONFIG_FIELD: "ContractorConfig/GetAllAsync",
    GET_CONTRACTOR_CONFIG_FIELD_BY_ID: "ContractorConfig/GetByIdAsync",
    UPDATE_CONTRACTOR_CONFIG_FIELD_BY_ID: "ContractorConfig/UpdateAsync",
    ADD_CONTRACTOR_CONFIG: "ContractorConfig/AddAsync",
    DELETE_CONTRACTOR_CONFIG: "ContractorConfig/DeleteAsync",
    DELETE_CONRACTOR: "ContractorCompany/DeleteContractorAsync",
    CREATE_PASS: "ContractorPass/CreatePassAsync",
    CONTRACTOR_PASS_DETAILS: "ContractorPass/GetByIdAsync",
    UPDATE_PASS: "ContractorPass/UpdatePassAsync",
    E_PASS_DETAILS: "ContractorPass/GetByDIdAsync",

    GET_ALL_CONTRACTORS: "ContractorPass/GetAllAsync",
    GET_CONTRACTORS_DETAILS_BY_QR_CODE: "ContractorPass/GetCPassAppointmentDetailsByQRCodeAsync",
    CHEKCK_IN_CHECK_OUT_CONTRACTORS: "ContractorPass/CheckInOutAsyncWithoutAccessControl",
    RESEND_OTP: "Visitor/ReSendOTPAsync",
    VALIDATE_OTP: "Visitor/ValidateUserAync",
    RE_AUTHENTICATE:"Visitor/ReAuthenticateAsync",
    RE_AUTHENTICATE_VALIDATE:"Visitor/ReAuthenticateValidateAsync",
    GET_VISITOR_BY_EMAIL_PHONE:"Visitor/GetVisitorByEmailOrPhoneAsync",
    APPROVE_WALKING_ASYNC:"Appointment/ApproveWalkInAsync",
    APPROVE_CHECKIN_ASYNC:"Appointment/CheckInWalkInAsync",
    GETALL_EMPLOYEES: 'Employee/GetAllHost',
    VISITOR_DETAILS_QR:'Visitor/ValidateVisitorDetailByIdAsync',
    PRINT_PASS_DOCUMENT: "Appointment/PrintBadge",
    PRINT_WALKING_PASS_DOCUMENT: "Appointment/WalkInBadgePrintAsync",
    PIE_CHART_DATA_ENTERPRISE:"Report/GetVisitorCheckInCountAsync",
    BAR_GRAPH_DATA_ENTERPRISE:"Report/GetLocationWiseVisitorCheckInCountAsync",
    HEAP_MAP_DATA_Enterprise:"Report/GetVisitorCheckInHeatmapAsync",
    VISITOR_COUNT_DATA_ENTERPRISE:"Report/GetVisitorCheckInSummaryAsync",
    VISITOR_HOURS_COUNT_DATA_ENTERPRISE:"Report/GetVisitorHourseWiseCountAsync",
    PROVIDER_SETUP_CRADTYPES: "ProviderAccessSetup/GetCardTypes",
    IS_ACTIVE_PROVIDER_SETUP:"ProviderSetup/IsActiveProviderSetup",
    GET_LOCATION_REPORT_ASYNC: "Report/GetLocationReportAsync",
    GET_VISITOR_LIST: "EmergencyNotification/GetVisitorAsync",
    GET_EMPLOYEE_LIST: "EmergencyNotification/GetEmployeeAsync",
    GET_EMERGENCY_MESSAGES: "EmergencyNotification/GetEmergencyMessageTemplateAsync",
    SEND_EMERGENCY_MESSAGE:"EmergencyNotification/SendEmergencyNotificationAsync",
    GET_ALL_ASYNC_PASS:"Seepz/GetAllAsync",
    GET_PASS_CATEGORY_TYPE:"Seepz/GetPassCategory",
    GET_DOCUMENT_TYPE:"Seepz/GetDocumentType",
    SEEPZ_CREATE_PASS:"Seepz/CreatePass",
    SEEPZ_VEHICLE_TYPE: "Seepz/GetVehicleType",
    SEEPZ_PERMANENT_PASS_REQUEST:"Seepz/GetAllPermanentPassByStatusAsync",
    GET_ALL_ASYNC_DAILY_PASS: "Seepz/GetAllDailyPassAsync",
    GET_PASS_VALIDITY:"Seepz/GetAllPassValidityAsync",
    APPROVE_PERMANNENT_PASS:"Seepz/ApprovedPermanentPassAsync",
    REJECT_REASON_SEEPZ:"Seepz/RejectPermanentPassAsync",
    REJECT_REASON_DATA:"Seepz/GetSeepzPassRejectReasonAsync",
    GET_ALL_ASYNC_PERMANENTPASS_GETBYID:"Seepz/GetByIdAsync",
    PERMANENTPASSCHECKIN: "seepz/PassCheckInAsync",
    PASSCHECKOUT: "seepz/PassCheckOutAsync",
    SEEPZ_PASS_REPORT_ASYNC:"Seepz/GetSeepzPassReportAsync",
    EXPORT_SEEPZ_REPORTS_DATA:"Seepz/ExportSeepzPassReportAsync",
    DAILY_EPASS_AFTER_CHECKIN: "Seepz/GetDailyEPaasToVisitorAfterCheckInAsync",
    RATE_CARD: "SeepzMaster/GetAllRateCardMasterAsync",
    ADD_RATE_CARD: "SeepzMaster/AddSeepzRateCardAsync",
    DELETE_RATE_CARD: "SeepzMaster/DeleteAsync",
    UPDATE_RATE_CARD: "SeepzMaster/UpdateAsync",
    GET_VALIDITY: "SeepzMaster/GetCommonMaster",
    GET_BALANCE:"Seepz/GetUnitCurrentBalance",
    RECHARGE_UNIT_WALLET:"Seepz/RechargeUnitBalance",
    GET_PAYMENT_DETAIL_BY_PAYMENT_ID:"Payment/CapturePaymentAsync",
    GET_PAYMENT_ORDER: "Order/CreateOrderAsync",
    GENERAL_LEDGER:"Seepz/GetLedgerReportAsync",
    GET_DAILYPASS_CATEGORYWISE_AMOUNT:"Seepz/GetCategoryWiseMinimumAmount",
    EXPORT_GENERAL_LEDGER_REPORT:"Seepz/ExportLedgerReportAsync",
    GET_RATE_CARD_CATEGORY_MASTER:"SeepzMaster/GetRateCardMasterAsync",
    REPORT_DETAIL_VIEW:"Seepz/GetSeepzPassReportDetails",
    GET_WALKIN_DETAILS:"Seepz/WalkinEPassAsync",
    WALKIN_VISITOR_CHECKIN_COUNT:"Seepz/GetTopVisitorsAsync",
    BAR_CHART_WALKING_DAILYPASS_CHECKIN_CHECKOUT:"Seepz/GetDailyPassVisitorsSummaryAsync",
    BAR_CHART_WALKING_PERMANENT_PASS_CHECKIN_CHECKOUT:"Seepz/GetPermanentPassVisitorsSummaryAsync",
    WALKIN_VISITOR_CHECKIN_COUNTS:"Seepz/GetWalkInVisitorsSummaryAsync",
    CREATE_WALK_IN_SEEPZ:"Seepz/WalkInAsync",
    GET_VISITOR_BY_PHONE_ASYNC:"Seepz/getVisitorByPhoneAsync",
    PRINT_PERMANENT_PASS: "Seepz/GetPassPrint",
    VALID_CATEGORY: "Seepz/ValidateCategory",
    RAISE_FLAG: "Seepz/RaisePassFlagAsync",
    DEACTIVATE_PASS: "Seepz/DeactivatePassAsync",
    DEACTIVATE_REASONS: "SeepzMaster/GetCommonMaster",
    RESEND_SMS:"Seepz/ResendSMSAsync"
}