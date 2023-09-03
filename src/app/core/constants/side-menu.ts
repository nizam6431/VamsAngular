import { permissionKeys } from "src/app/shared/constants/permissionKeys";

export const sequenceOfsideBarBottomMenu = [
    'master', 'configure', 'settings'
]

export const sequenceOfsideBarTopMenu = [
    'dashboard', 'accounts', 'seepz_report', 'appointments', 'visitors', 'contractor_pass','card','daily_pass',
    'permanent_pass_request','permanent_pass_checkin','pass_checkout','permanent_pass_print','seepz_general_ledger'
]
// permissions
// 'dashboard'

export const sideBarBottomMenu = {

    master:
    {
        name: "grid_side_menu.master",
        class: "icon-master",
        navigateTo: "/master",
        state: { title: "grid_side_menu.master" },
        permissionKeys: permissionKeys.MASTERVIEWEDIT
    },
    configure:
    {
        name: "grid_side_menu.configure",
        isDisable: false,
        class: "icon-configure",
        navigateTo: "/configure",
        state: { title: "grid_side_menu.configure" },
        permissionKeys: permissionKeys.CONFIGURATION
    },
    settings:
    {
        name: "grid_side_menu.settings",
        isDisable: true,
        class: "icon-setting",
        navigateTo: "/setting",
        state: { title: "grid_side_menu.setting" },
        permissionKeys: permissionKeys.SETTING
    }
}

export const sideBarTopMenu = {
    accounts:
    {
        name: "grid_side_menu.accounts",
        // class: "icon-accounts",
        class: "icon-setting",
        navigateTo: "/accounts",
        state: { title: "Accounts" },
        permissionKeys: permissionKeys.SUPERADMIN
    },

    // reports:
    // {
    //     name: "grid_side_menu.report",
    //     isDisable: true,
    //     class: "icon-reports",
    //     navigateTo: "/reports",
    //     state: { title: "grid_side_menu.report" },
    //     permissionKeys: permissionKeys.REPORTS
    // },
    seepz_report:
    {
        name: "grid_side_menu.report",
        isDisable: true,
        class: "icon-reports",
        navigateTo: "seepzReport",
        state: { title: "grid_side_menu.seepz_report" },
        permissionKeys: permissionKeys.REPORTS
    },
    dashboard:
    {
        name: "grid_side_menu.dashboard",
        isDisable: false,
        class: "icon-dashboard",
        navigateTo: "dashboard",
        state: { title: "grid_side_menu.dashboard" },
        permissionKeys: permissionKeys.DASHBOARD
    },
    appointments:
    {
        name: "grid_side_menu.appointments",
        isDisable: true,
        class: "icon-appointment",
        navigateTo: "appointments",
        state: { title: "grid_side_menu.appointments" },
        permissionKeys: permissionKeys.APPOINTMENT
    },
    visitors:
    {
        name: "grid_side_menu.restricted_visitors",
        isDisable: true,
        class: "icon-visitors",
        navigateTo: "visitors",
        state: { title: "grid_side_menu.restricted_visitors" },
        permissionKeys: permissionKeys.VISITORDETAILVIEW
    },
    contractor_pass:
    {
        name: "grid_side_menu.contractor_pass",
        isDisable: true,
        class: "icon-pass",
        navigateTo: "contractor-pass",
        state: { title: "grid_side_menu.contractor_pass" },
        permissionKeys: permissionKeys.CONTRACTORPASS
    },
    card:
    {
        name: "card.Title",
        isDisable: true,
        class: "icon-Permanent-Pass",
        navigateTo: "permanentPass",
        state: { title: "grid_side_menu.card" },
        permissionKeys: permissionKeys.PERMANENTPASS
    },
    daily_pass:
    {
        name: "grid_side_menu.daily_pass",
        isDisable: true,
        class: "icon-Daily-Pass",
        navigateTo: "dailyPass",
        state: { title: "grid_side_menu.daily_pass" },
        permissionKeys: permissionKeys.DAILYPASS
    },
    permanent_pass_request:
    {
        name: "grid_side_menu.pass_request",
        isDisable: true,
        class: "icon-Permanent-Pass",
        navigateTo: "permanentPassRequest",
        state: { title: "grid_side_menu.daily_pass" },
        permissionKeys: permissionKeys.PERMANENTPASSREQUEST
    },
    permanent_pass_checkin:
    {
        name: "grid_side_menu.check_in",
        isDisable: true,
        class: "icon-check-in",
        navigateTo: "checkIn",
        state: { title: "grid_side_menu.check_in" },
        permissionKeys: permissionKeys.PASSCHECKIN
    },
    permanent_pass_print:
    {
        name: "grid_side_menu.permanent_pass_print",
        isDisable: true,
        class: "icon-Permanent-pass-print",
        navigateTo: "permanentPassPrint",
        state: { title: "grid_side_menu.permanent_pass_print" },
        permissionKeys: permissionKeys.PERMANENTPASSPRINT
    },
    pass_checkout:
    {
        name: "grid_side_menu.check_out",
        isDisable: true,
        class: "icon-check-out",
        navigateTo: "checkOut",
        state: { title: "grid_side_menu.check_out" },
        permissionKeys: permissionKeys.PASSCHECKIN
    },
    seepz_general_ledger:
    {
        name: "grid_side_menu.seepz_general_ledger",
        isDisable: true,
        class: "icon-company-account-ledger",
        navigateTo: "seepzGeneralLedger",
        state: { title: "grid_side_menu.seepz_general_ledger" },
        permissionKeys: permissionKeys.LEDGEREPORT
    },
  
    
}

export const MenuPermissions = {
    TopMenu: {
        accounts: {
            name: 'accounts',
            permissions: [permissionKeys.SUPERADMIN]
        },
        reports: {
            name: 'reports',
            permissions: [permissionKeys.REPORTS]
        },
        dashboard: {
            name: 'dashboard',
            permissions: [permissionKeys.DASHBOARD]
        },
        appointments: {
            name: 'appointments',
            permissions: [permissionKeys.APPOINTMENT]
        },
        visitors: {
            name: 'visitors',
            permissions: [permissionKeys.RESTRICTEDVISITOR, permissionKeys.RESTRICTVISITORADD]
        },
        contractor_pass: {
            name: 'contractor_pass',
            permissions: [permissionKeys.CONTRACTORPASS]
        },
        card: {
            name: 'card',
            permissions: [permissionKeys.PERMANENTPASS]
        },
        daily_pass: {
            name: 'daily_pass',
            permissions: [permissionKeys.DAILYPASS]
        },
        permanent_pass_request: {
            name: 'pass_request',
            permissions: [permissionKeys.PERMANENTPASSREQUEST]
        },
        permanent_pass_checkin: {
            name: 'check_in',
            permissions: [permissionKeys.PASSCHECKIN]
        },
        pass_checkout: {
            name: 'check_out',
            permissions: [permissionKeys.PASSCHECKIN]
        },
        permanent_pass_print: {
            name: 'permanent_pass_print',
            permissions: [permissionKeys.PERMANENTPASSPRINT]
        },
        seepz_report: {
            name: 'seepz_report',
            permissions: [permissionKeys.REPORTS]
        },
        seepz_general_ledger: {
            name: 'seepz_general_ledger',
            permissions: [permissionKeys.LEDGEREPORT]
        }
    },
    BottumMenu: {
        master: {
            name: 'master',
            permissions: [permissionKeys.MASTERVIEWEDIT, permissionKeys.MASTERVIEWONLY]
        },
        configure: {
            name: 'configure',
            permissions: [permissionKeys.CONFIGURATION]
        },
        settings: {
            name: 'settings',
            permissions: [permissionKeys.SETTING]
        },
    }
}

