export const Constants = {
    "email_server":[
        {"key":"buildingName","value":"grid_columns.email_server.building_name"},
        {"key":"server","value":"grid_columns.email_server.server"},
        {"key":"outPort","value":"grid_columns.email_server.out_port"},
        {"key":"fromId","value":"grid_columns.email_server.formId"},
        {"key":"requireAuthentication","value":"grid_columns.email_server.require_authentication"},
        {"key":"enableSSL","value":"grid_columns.email_server.enable_ssl"},
        {"key":"displayName","value":"grid_columns.email_server.display_name"},
        {"key":"action","value":""},
    ],
     "email_server_enterprise":[
        {"key":"buildingName","value":"grid_columns.email_server.location_name"},
        {"key":"server","value":"grid_columns.email_server.server"},
        {"key":"outPort","value":"grid_columns.email_server.out_port"},
        {"key":"fromId","value":"grid_columns.email_server.formId"},
        {"key":"requireAuthentication","value":"grid_columns.email_server.require_authentication"},
        {"key":"enableSSL","value":"grid_columns.email_server.enable_ssl"},
        {"key":"displayName","value":"grid_columns.email_server.display_name"},
        {"key":"action","value":""},
    ],

    "appointment_reject_reason":[
        {"key":"reason","value":"grid_columns.appointment_rejected_reason.reason"},
        {"key":"action","value":""},
    ],
    "provider_setup_commercial": [
        {"key":"buildingName","value":"grid_columns.provider_device.buildingName"},
        { "key": "name", "value": "grid_columns.provider_setup.provider_name" },
        { "key": "url", "value": "grid_columns.provider_setup.url" },
        { "key": "token", "value": "grid_columns.provider_setup.token" },
        { "key": "status", "value": "grid_columns.provider_setup.status" },
        // { "key": "apiVersion", "value": "grid_columns.provider_setup.version" },
        { "key": "action", "value": "" }
    ],
     "provider_setup_enterprise": [
        {"key":"buildingName","value":"grid_columns.provider_device.locationName"},
        { "key": "name", "value": "grid_columns.provider_setup.provider_name" },
        { "key": "url", "value": "grid_columns.provider_setup.url" },
         { "key": "token", "value": "grid_columns.provider_setup.token" },
         { "key": "status", "value": "grid_columns.provider_setup.status" },
        // { "key": "apiVersion", "value": "grid_columns.provider_setup.version" },
        { "key": "action", "value": "" }
    ],
    "provider_device_detail": [
        // { "key": "buildingName", "value": "grid_columns.provider_device.building_id" },
        { "key": "accessLevel", "value": "grid_columns.provider_device.access_level" },
        { "key": "deviceUniqueId", "value": "grid_columns.provider_device.department_name" },
        { "key": "action", "value": "" }
    ],

    "hsq_questions":[
        {"key":"question","value":"grid_columns.hsq_questionnaire.question"},
        {"key":"expectedAnswer","value":"grid_columns.hsq_questionnaire.expected_answer"},
        {"key":"nonStandardTag","value":"grid_columns.hsq_questionnaire.is_vaccinated"},
        // {"key":"status","value":"grid_columns.hsq_questionnaire.status"},
        {"key":"action","value":""},
    ],
    "device_setup": [
        // { "key": "buildingName", "value": "grid_columns.provider_device.buildingName" },
        { "key": "deviceSrNo", "value": "grid_columns.provider_device.deviceSrNo" },
        { "key": "action", "value": "" },
    ],
    "sms_template": [
        { "key": "name", "value": "grid_columns.sms_template.name" },
        { "key": "id", "value": "grid_columns.sms_template.id" },
        { "key": "action", "value": "" },
    ],
    "sms_template_demo": [
        { "key": "name", "value": "grid_columns.sms_template_demo.name" },
        { "key": "smsContent", "value": "grid_columns.sms_template_demo.smsContent" },
        // { "key": "tag", "value": "grid_columns.sms_template_demo.tag" },
        { "key": "languageCode", "value": "grid_columns.sms_template_demo.languageCode" },
        { "key": "action", "value": "grid_columns.sms_template_demo.action" },
    ],
    "email_template_demo": [
        { "key": "name", "value": "grid_columns.email_template_demo.name" },
        { "key": "subject", "value": "grid_columns.email_template_demo.subject" },
        // { "key": "htmlContent", "value": "grid_columns.email_template_demo.emailContent" },
        // { "key": "tag", "value": "grid_columns.email_template_demo.tag" },
        { "key": "languageCode", "value": "grid_columns.email_template_demo.languageCode" },
        { "key": "action", "value": "grid_columns.email_template_demo.action" },
    ],
    "contractor_config_fields": [
        { "key": "configFieldName", "value": "grid_columns.contractor_config.configFieldName" },
        // { "key": "configValue", "value": "grid_columns.contractor_config.configValue" },
        { "key": "action", "value": "grid_columns.contractor_config.action" },
    ],
    "rateCard": [
            { "key": "passType", "value": "rateCard.passType",sortRequired: true },
            { "key": "categoryName", "value": "rateCard.categoryId",sortRequired: true },
            { "key": "validity", "value": "rateCard.validity",sortRequired: false },
            { "key": "price", "value": "rateCard.price" ,sortRequired: false},
            { "key": "action", "value": "grid_columns.sms_template_demo.action" ,sortRequired: false},
    ]
}

