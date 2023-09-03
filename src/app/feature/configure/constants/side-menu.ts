//Please add 'DynamicPermissions'in below array to show the permissions tab in side bar

export const sequenceOfMenu = [
    'EmailServerConfig', 
    'AppointmentRejectReasonMaster', 
    'PrivacyAndPolicy', 
    'TermsAndCondition', 
    'PrivacyPolicyForVistior', 
    'TermsAndConditionForVisitor', 
    'BannerImage', 
    'HsqScreeningQuestionnaire',
    // 'SmsTemplate',
    // 'EmailTemplate',
    'ContactorConfigFields',
    "NDA",
    'ProviderSetup',
    // 'ContactorConfigFields',
    // 'ProviderSetup'
    'RateCard'
]
export const sideBarMenu = {
    EmailServerConfig:
    {
        key:"email_server_config"
    },
    // SmsServerConfig:
    // {
    //     key:"sms_server_config"
    // },
    // HsqMaster:
    // {
    //     key:"HSQ_master_for_visitor_and_employee"
    // },
    // EmailTemplate:
    // {
    //     key:"email_templates"
    // },
    AppointmentRejectReasonMaster:
    {
        key:"appointment_reject_reason_master"
    },
    HsqScreeningQuestionnaire:
    {
        key:"HSQ_screening_questionnaire"
    },
    NDA:
    {
        key:"NDA"
    },
    // EmployeeForm:
    // {
    //     key:"employee_form"
    // },
    // RoleMaster:
    // {
    //     key:"role_master"
    // },
    PrivacyAndPolicy:{
        key:"privacy_policy"
    },
    TermsAndCondition:{
        key:"terms_condition"
    },
    ProviderSetup: {
        key:"provider_setup"
    },
    // ProviderDeviceDetails: {
    //     key: "provider_device"
    // },
    PrivacyPolicyForVistior: {
        key: "privacy_policy_visitor"
    },
    TermsAndConditionForVisitor: {
        key: "terms_condition_visitor"
    },
    BannerImage: {
        key:"banner_image"
    },
    // BioSecurityDevice:{
    //     key:"bio_security_device"
    // },
    // BioSecurityServer:{
    //     key:"bio_security_server"
    // }

    //commented for as of now need to uncomment when need to deploy
    // DynamicPermissions: {
    //     key: "dynamic_permissions"
    // }
    SmsTemplate:{
        key:"sms_template"
    },
    EmailTemplate:{
        key:"email_template"
    },
    ContactorConfigFields:{
        key:"contractor_config_field"
    },
    RateCard: {
        key:'rateCard'
    }
}