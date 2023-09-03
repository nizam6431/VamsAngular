export const Constants = {
    "visitor_report_column": [
        { key: "visitorName", value: "grid_columns.reports.visitor_name", sortRequired: false },
        // { key: "visitorFirstName", value: "Visitor First Name", sortRequired: false },
        // { key: "visitorLastName", value: "Visitor Last Name", sortRequired: false },
        // { key: "visitorCellNo", value: "Visitor Cell No.", sortRequired: false },
        // { key: "visitorIsd", value: "visitor Isd", sortRequired: false },
        { key: "visitorPhone", value: "grid_columns.reports.visitor_cell_no", sortRequired: false },
        { key: "visitorEmailId", value: "grid_columns.reports.visitor_email", sortRequired: false },
        // { key: "VisitorID", value: "Visitor ID", sortRequired: false },
        { key: "visitorCompany", value: "grid_columns.reports.visitor_comapny", sortRequired: false },
        { key: "hostName", value: "grid_columns.reports.host_name", sortRequired: false },
        // { key: "hostFirstName", value: "Host First Name", sortRequired: false },
        // { key: "hostLastName", value: "Host Last Name", sortRequired: false },
        // { key: "hostCellNo", value: "Host Cell no.", sortRequired: false },
        // { key: "hostIsd", value: "host Isd", sortRequired: false },
        { key: "hostPhone", value: "grid_columns.reports.host_cell_number", sortRequired: false },

        { key: "hostEmail", value: "grid_columns.reports.host_email", sortRequired: false },
        { key: "hostCompany", value: "grid_columns.reports.host_company", sortRequired: false },
        { key: "building", value: "grid_columns.reports.building", sortRequired: false },
        { key: "location", value: "grid_columns.reports.appointment_location", sortRequired: false },

       
        { key: "checkInDate", value: "grid_columns.reports.checkin_date", sortRequired: false },
        { key: "checkInTime", value: "grid_columns.reports.checkin_time", sortRequired: false },
        { key: "checkOutDate", value: "grid_columns.reports.checkout_date", sortRequired: false },
        { key: "checkOutTime", value: "grid_columns.reports.checkout_time", sortRequired: false },
        { key: "timeInTime", value: "grid_columns.reports.time_in_time", sortRequired: false },
        { key: "timeOutTime", value: "grid_columns.reports.time_out_time", sortRequired: false },
          // Columns for enterprise visitor table 
         
        { key: "visitorType", value: "grid_columns.reports.type_of_visitor", sortRequired: false },
        { key: "visitorPurposeType", value: "grid_columns.reports.purpose_of_visit", sortRequired: false },
         
        
    ],
    appointment_report_column: [
        { key: "visitorName", value: "grid_columns.reports.visitor_name", sortRequired: false },
        
        { key: "visitorPhone", value: "grid_columns.reports.visitor_cell_no", sortRequired: false },
        { key: "visitorEmailId", value: "grid_columns.reports.visitor_email", sortRequired: false },

        { key: "visitorCompany", value: "grid_columns.reports.visitor_comapny", sortRequired: false },
        { key: "hostName", value: "grid_columns.reports.host_name", sortRequired: false },
        { key: "hostPhone", value: "grid_columns.reports.host_cell_number", sortRequired: false },
        { key: "hostEmail", value: "grid_columns.reports.host_email", sortRequired: false },
        { key: "hostCompany", value: "grid_columns.reports.host_company", sortRequired: false },
        { key: "building", value: "grid_columns.reports.building", sortRequired: false },

        // Columns for enterprise appointments table 
        { key: "location", value: "grid_columns.reports.appointment_location", sortRequired: false },
        { key: "visitorType", value: "grid_columns.reports.type_of_visitor", sortRequired: false },
        { key: "visitorPurposeType", value: "grid_columns.reports.purpose_of_visit", sortRequired: false },

        { key: "appointmentStartDate", value: "grid_columns.reports.appointment_start_date", sortRequired: false },
        { key: "appointmentStartTime", value: "grid_columns.reports.appointment_start_time", sortRequired: false },
        { key: "appointmentEndDate", value: "grid_columns.reports.appointment_end_date", sortRequired: false },
        { key: "appointmentEndTime", value: "grid_columns.reports.appointment_end_time", sortRequired: false },

        { key: "appointmentType", value: "grid_columns.reports.appointment_type", sortRequired: false },
        { key: "status", value: "grid_columns.reports.appointment_status", sortRequired: false },
        { key: "multidayAppointment", value: "grid_columns.reports.multiday_appointment", sortRequired: false },
        
       
        // { key: "timeInTime", value: "Time In Time", sortRequired: false },
        // { key: "timeOutTime", value: "Timeout Time", sortRequired: false },

        //Hide above two column as per discussion with nilesh and snenal
    ],
    hsq_report_column : [
        { key: "visitorName", value: "grid_columns.reports.visitor_name", sortRequired: false },
        
        { key: "visitorPhone", value: "grid_columns.reports.visitor_cell_no", sortRequired: false },
        { key: "visitorEmailId", value: "grid_columns.reports.visitor_email", sortRequired: false },

        { key: "visitorCompany", value: "grid_columns.reports.visitor_comapny", sortRequired: false },
        { key: "hostName", value: "grid_columns.reports.host_name", sortRequired: false },
        { key: "hostPhone", value: "grid_columns.reports.host_cell_number", sortRequired: false },
        { key: "hostEmail", value: "grid_columns.reports.host_email", sortRequired: false },
        { key: "hostCompany", value: "grid_columns.reports.host_company", sortRequired: false },
        { key: "building", value: "grid_columns.reports.building", sortRequired: false },
        { key: "appointmentStartDate", value: "grid_columns.reports.appointment_start_date", sortRequired: false },
        { key: "appointmentStartTime", value: "grid_columns.reports.appointment_start_time", sortRequired: false },
        { key: "appointmentEndDate", value: "grid_columns.reports.appointment_end_date", sortRequired: false },
        { key: "appointmentEndTime", value: "grid_columns.reports.appointment_end_time", sortRequired: false },

        { key: "appointmentType", value: "grid_columns.reports.appointment_type", sortRequired: false },
        { key: "status", value: "grid_columns.reports.appointment_status", sortRequired: false },
        { key: "multidayAppointment", value: "grid_columns.reports.multiday_appointment", sortRequired: false },
        { key: "hsqStatus", value: "grid_columns.reports.hsqStatus", sortRequired: false },
        // { key: "timeInTime", value: "Time In Time", sortRequired: false },
        // { key: "timeOutTime", value: "Timeout Time", sortRequired: false },

        //Hide above two column as per discussion with nilesh and snenal
    ],
    email_report_column : [
        { key: "employeeName", value: "EmaileportDetails.employeeName", sortRequired: false },
        { key: "companyName", value: "EmaileportDetails.companyName", sortRequired: false },
        { key: "buildingName", value: "EmaileportDetails.buildingName", sortRequired: false },
        { key: "username", value: "EmaileportDetails.username", sortRequired: false },
        { key: "emailOfRecipient", value: "EmaileportDetails.emailOfRecipient", sortRequired: false },
        { key: "emailSentDate", value: "EmaileportDetails.emailSentDate", sortRequired: false },
        { key: "emailSentTime", value: "EmaileportDetails.emailSentTime", sortRequired: false },
        { key: "status", value: "EmaileportDetails.status", sortRequired: false }
    ],
    first_time_password_change : [
        { key: "employeeFirstName", value: "grid_columns.reports.employee_name", sortRequired: false },
        { key: "userName", value: "grid_columns.reports.user_name", sortRequired: false },
        { key: "passwordChangeDate", value: "grid_columns.reports.password_change", sortRequired: false },
        { key: "passwordChangeTime", value: "grid_columns.reports.password_change_time", sortRequired: false },
        { key: "buildingName", value: "grid_columns.reports.building_name", sortRequired: false },
        { key: "companyName", value: "grid_columns.reports.company_name", sortRequired: false },
        { key: "cellNumber", value: "grid_columns.reports.cell_number", sortRequired: false },
        { key: "emailId", value: "grid_columns.reports.email_id", sortRequired: false },
    ]
}   