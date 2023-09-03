export const Constants = {
    "provider_master":[
        {"key":"providerName","value":"grid_columns.provider_master.provider_name"},
        {"key":"shortCode","value":"grid_columns.provider_master.shortcode"},
        {"key":"status","value":"grid_columns.provider_master.status"},
        {"key":"action","value":""},
    ]
}

export enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
  
export enum authenticationMethods {
    SMS ="1",
    Email ="2",
    Both ="3"
}