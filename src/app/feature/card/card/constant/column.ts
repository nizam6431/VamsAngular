export const Constants = {
    "card":[
        { "key": "photoUrl", "value": "grid_columns.card.photo" },
         { "key": "category", "value": "grid_columns.card.category" },
        { "key": "firstName", "value": "grid_columns.card.firstName" },
        { "key": "lastName", "value": "grid_columns.card.lastName" },
        //  { "key": "gender", "value": "grid_columns.card.gender" },
        { "key": "mobileNo", "value": "grid_columns.card.phone" },
         { "key": "designation", "value": "grid_columns.card.designation" },
        // { "key": "passType", "value": "grid_columns.card.passType" },
         { "key": "vehicleNumber", "value": "grid_columns.card.vehicleNumber" },
         {"key":"issueDate","value":"grid_columns.card.cardIssueDate"},
        {"key":"passExpiryDate","value":"grid_columns.card.cardExpiryDate"},
        //  { "key": "vehicleNumber", "value": "grid_columns.card.vehicleNumber" },
        {"key":"status","value":"grid_columns.card.status"},
        { "value": "", "key": "action" }
    ],
    "documentCard":[
        {"key":"documentType","value":"grid_columns.documentCard.documentType"},
        {"key":"View","value":"grid_columns.documentCard.viewDocument"},
        { "value": "Remove", "key": "action" }
    ],
    "ViewdocumentCard":[
        {"key":"documentType","value":"grid_columns.documentCard.documentType"},
        {"key":"View","value":"grid_columns.documentCard.viewDocument"},
    ]
    ,
    "passValidity": [
        {"value": "", "key": "action" },
        {"key":"passType","value":"grid_columns.passValidity.passType"},
        { "key": "validity", "value": "grid_columns.passValidity.validity" },
         { "key": "expireDate", "value": "grid_columns.passValidity.expireDate" },
          {"key":"price","value":"grid_columns.passValidity.price"},
    ]
    ,
    "walkinVisitorCheckinCount":[
        {"key": "visitorName", "value": "grid_columns.walkin_visitor.name" },
        {"key": "hostName", "value": "grid_columns.walkin_visitor.nameOfPersonToMeet" },
        {"key":"visitorPurpose","value":"grid_columns.walkin_visitor.purpose_of_visit"},
        {"key":"checkedInTime","value":"grid_columns.walkin_visitor.Check_CheckInTime"},
    ],
    "walkinVisitorCheckOutCount":[
        {"key": "visitorName", "value": "grid_columns.walkin_visitor.name" },
        {"key": "hostName", "value": "grid_columns.walkin_visitor.nameOfPersonToMeet" },
        {"key":"visitorPurpose","value":"grid_columns.walkin_visitor.purpose_of_visit"},
        {"key":"checkedOutTime","value":"grid_columns.walkin_visitor.Check_CheckOutTime"},
    ]
}

   