export enum ProductTypes {
  Commercial = "Commercial",
  Enterprise = "Enterprise",
  Hospital   = "Hospital"
}

export enum LevelAdmins {
  Level1Admin = "L1Admin",
  Level2Admin = "L2Admin",
  Level3Admin = "L3Admin"
}

export enum CommonTabs {
  departments,
  employees,
  contractors
}

export enum AppointmentStatus {
    scheduled,
    in_progress,
    awaiting_approval
}
export enum pagination {
  _0 = 5,
  _1 = 25,
  _2 = 50,
  _3 = 100,
  _4 = 200
  // _0 = 5,
  // _1 = 50,
  // _2 = 100,
  // _3 = 200,
}
export enum pagination_ {
  _0 = 5,
  _1 = 25,
  _2 = 50,
  _3 = 100,
  _4 = 200  
  // _1 = 50,
  // _2 = 100,
  // _3 = 200,
}

export enum defaultVal {
  pageSize = 25,
  searchStatus = "ACTIVE",
  pageIndex = 1
}

export enum excel_walkin_screens {
  "walkin_form" = "walkin_form",
  "pass_screen" = "pass_screen"
}
export enum Level {
  Level1 = "Level1",
  Level2 = "Level2",
  Level3 = "Level3" //Employee
}

export enum Level2Roles {
  l2Reception = "L2Reception",
  l2Security = "L2SecurityGuard",
  l2SecurityHead = "L2SecurityHead",
  l2Admin = "L2Admin",
  l2Host	= "L2Host" //It is employee
  
}

export enum Level1Roles {
  l1Reception = "L1Reception",
  l1Security = "L1SecurityGuard",
  l1SecurityHead = "L1SecurityHead",
  l1Admin = "L1Admin",
  l1Host	= "L1Host" //It is employee
}

export enum Level3Roles {
  l3Admin = "L3Admin",
  l3Reception = "L3Reception",
  l3Host = "L3Host" //It is employee
}

export enum AppointmentsStatus {
  scheduled = "SCHEDULED",
  inprogress = "INPROGRESS",
  walkin = 'WALKIN',
  approved = 'APPROVED',
  awaitingapproval = 'AWAITINGAPPROVAL'
}

export enum timeFormat{
  format_12_hr = "hh:mm A",
  format_24_hr = "HH:mm"
}