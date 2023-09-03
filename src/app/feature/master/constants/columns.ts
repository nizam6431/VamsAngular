export const Constants = {
    "building_column": [
        { "value": "grid_columns.building.Name", "key": "name" },
        { "value": "grid_columns.building.Status", "key": "status" },
        { "value": "grid_columns.building.show_company_list", "key": "showCompanyList" },
        { "value": "", "key": "action" }
    ],
    "building_columns_Hospital": [
        { "value": "grid_columns.building.Name", "key": "name" },
        { "value": "grid_columns.building.Status", "key": "status" },
        { "value": "grid_columns.building.show_hospital_list", "key": "showHospitalList" },
        { "value": "", "key": "action" }
    ],

    "building_column_company": [
        { "value": "grid_columns.building.Name", "key": "name" }
    ],
    "company_column": [
        { "key": "name", "value": "grid_columns.company.Name" },
        { "key": "shortName", "value": "grid_columns.company.Short_Name" },
        // { "key": "building", "value": "Building" },
        // { "key": "floor", "value": "Floor" },
        // { "key": "cell", "value": "Phone No" },
        { "key": "email", "value": "grid_columns.company.Email" },
        { "key": "status", "value": "grid_columns.company.Status" },
        { "key": "departments", "value": "grid_columns.company.Departments" },
        { "key": "employees", "value": "grid_columns.company.Employees" },
        // { "key": "subLocation", "value": "grid_columns.company.subLocation" },
        // { "key": "contractors", "value": "Contractors" },
        { "value": "", "key": "action" }
    ],
    "company_column_Hospital": [
        { "key": "name", "value": "grid_columns.company.Name" },
        { "key": "shortName", "value": "grid_columns.company.Short_Name" },
        { "key": "email", "value": "grid_columns.company.Email" },
        { "key": "status", "value": "grid_columns.company.Status" },
        { "key": "employees", "value": "grid_columns.company.Petient" },
        { "value": "", "key": "action" }
    ],
    "department_column": [
        { "value": "grid_columns.department.Name", "key": "name" },
        { "value": "grid_columns.department.Status", "key": "status" },
        { "value": "", "key": "action" }
    ],
    "employee_column": [
        { "key": "name", "value": "grid_columns.employee.Name" },
        { "key": "mobile", "value": "grid_columns.employee.Cell_number" },
        { "key": "email", "value": "grid_columns.employee.Email" },
        { "key": "userName", "value": "grid_columns.employee.Username"},
        { "key": "department", "value": "grid_columns.employee.Department" },
        { "key": "role", "value": "grid_columns.employee.Role" },
        { "key": "status", "value": "grid_columns.employee.Status" },
        { "key": "action", "value": "" },
    ],
    "employee_column_Hospital": [
        { "key": "name", "value": "grid_columns.employee.Name" },
        { "key": "mobile", "value": "grid_columns.employee.Cell_number" },
        { "key": "email", "value": "grid_columns.employee.Email" },
        { "key": "userName", "value": "grid_columns.employee.Username"},
        { "key": "role", "value": "grid_columns.employee.Role" },
        { "key": "status", "value": "grid_columns.employee.Status" },
        { "key": "action", "value": "" },
    ],
    "contractor_column": [
        { "key": "contractorName", "value": "grid_columns.contractor.contractor_name" },
        { "key": "location", "value": "grid_columns.contractor.location" },
        { "key": "mobileno", "value": "grid_columns.contractor.cell_number" },
        { "key": "email", "value": "grid_columns.contractor.email" },
        { "key": "startDate", "value": "grid_columns.contractor.valid_from" },
        { "key": "endDate", "value": "grid_columns.contractor.valid_upto" },
        { "key": "printPass", "value": "grid_columns.contractor.print_pass" },
        { "key": "status", "value": "grid_columns.contractor.status" },
        { "key": "action", "value": "" }
    ],

    "contractor_company_column": [
        { "key": "uniqueId", "value": "grid_columns.contract_company_column.uniqueId" },
        { "key": "companyName", "value": "grid_columns.contract_company_column.contractor_name" },
        { "key": "name", "value": "grid_columns.contract_company_column.contact_person" },
        { "key": "url", "value": "grid_columns.contract_company_column.url" },
        { "key": "email", "value": "grid_columns.contract_company_column.email" },
        { "key": "phone", "value": "grid_columns.contract_company_column.cell_number" },
        // { "key": "city", "value": "grid_columns.contract_company_column.city" },
        // { "key": "state", "value": "grid_columns.contract_company_column.state" },
        // { "key": "country", "value": "grid_columns.contract_company_column.country" },
        { "key": "status", "value": "grid_columns.contract_company_column.status" },
        { "key": "contractors", "value": "Contractors" },

        { "key": "action", "value": "" }
    ],
    "appointment_column": [
        { "key": "host", "value": "grid_columns.appointment.Host" },
        { "key": "start_date", "value": "grid_columns.appointment.Start_date" },
        { "key": "end_start", "value": "grid_columns.appointment.End_date" },
        { "key": "visitor_details", "value": "grid_columns.appointment.Visitor_details" },
    ],
    "all_visitor_column": [
        { "key": "name", "value": "Name" },
        { "key": "mobile", "value": "Cell number" },
        { "key": "email", "value": "Email" },
        { "key": "idProof", "value": "ID Proof" },
        { "key": "company", "value": "Company" },
    ],
    "contractor_visitor_column": [
        { "key": "name", "value": "Name" },
        { "key": "mobile", "value": "Cell number" },
        { "key": "email", "value": "Email" },
        { "key": "idProof", "value": "ID Proof" },
        { "key": "company", "value": "Company" },
    ],
    "blacklisted_visitor_column": [
        { "key": "photo", "value": "Photo" },
        { "key": "name", "value": "Name" },
        { "key": "company", "value": "Company" },
        { "key": "remark", "value": "Remark" },
        { "key": "action", "value": "" },
    ],
    "bio_security_device_columns":[
        { "key": "name", "value": "grid_columns.bio_security_device.Device_name" },
        { "key": "buildingName", "value": "grid_columns.bio_security_device.Building_name" },
        { "key": "accessLevels", "value": "grid_columns.bio_security_device.Access_level" },
        { "key": "url", "value": "grid_columns.bio_security_device.Url"},
        { "key": "status", "value": "grid_columns.bio_security_device.Status"},
        { "key": "action", "value": "Action"},
        // { "key": "model", "value": "Model" },
        // { "key": "level2Id", "value": "Level 2 Id" },
        // { "key": "level1Id", "value":"Level 1 Id"},
        // { "key": "token", "value": "Token" },  
    ],
    "loction_column": [
        { "value": "grid_columns.location.location", "key": "name" },
        { "value": "grid_columns.location.isdCode", "key": "contactIsd" },
        { "value": "grid_columns.location.country", "key": "country" },
        { "value": "grid_columns.location.dateformat", "key": "dateformat" },
        { "value": "grid_columns.location.timeformat", "key": "timeformat" },
        { "value": "grid_columns.location.timezone", "key": "timezone" },
        { "value": "grid_columns.location.status", "key": "status" },
        { "value": "", "key": "action" }
    ],
    "sub_location_column": [
        { "value": "grid_columns.sub-location.Name", "key": "name" },
        { "value": "grid_columns.sub-location.Status", "key": "status" },
        { "value": "", "key": "action" }
    ],
 
 
}