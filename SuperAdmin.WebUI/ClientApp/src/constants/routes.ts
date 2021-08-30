import DashboardJS from "views/DashboardJS";
import Company from "views/CompanyProfile";
import CustomerMonitoring from "views/CustomerMonitoring";
import Devices from "views/Devices";
import DevicesBatch from "views/DevicesBatch";
import Typography from "views/Typography.jsx";
import DeviceMonitoring from 'views/DeviceMonitoring';
import DeviceFirware from 'views/DeviceFirmware';
import DeviceDigitalTwin from 'views/ManufacturerDigitalTwin';
import DistributorDigitalTwin from 'views/DistributorDigitalTwin';
import UsageReport from 'views/UsageReport'
import ErrorCodesModule from 'views/ErrorCodesModule'
import AlarmWarningReport from "views/AlarmWarningReport";
import InverterDetails from "views/InverterDetails";
import EnergyConsumptionReport from "views/EnergyConsumptionReport";
import PredictivePreventiveReport from 'views/PredictivePreventiveReport';
import UserRightsManagement from "views/UserRightsManagement";
import NotAllowed from "views/NotAllowedPage";
import ContactAdmin from "views/ContactAdminPage";
import UserProfile from 'views/UserProfile';
import ManufacturerDigitalTwin from "views/ManufacturerDigitalTwin";
// import Icons from "views/Icons.jsx";
// import Maps from "views/Maps.jsx";

export const collapsableOptions = [
    {
        name: "Home"
    },
    {
        name: "Administration"
    },
    {
       name: "Device Management"
    },
    {
        name: "Digital Twin"
    },
    {
        name: "Reporting"
    },
    {
        name: "Logging"
    }

]


export const dashboardRoutes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: "pe-7s-graph",
        component: DashboardJS,
        parent: "Home",
        layout: "/admin"
    },
    {
        path: "/customer",
        name: "Add Users",
        icon: "pe-7s-culture",
        component: Company,
        parent: "Administration",
        layout: "/admin"
    },
    {
        path: "/monitorCustomer",
        name: "Monitor Users",
        icon: "pe-7s-culture",
        component: CustomerMonitoring,
        parent: "Administration",
        layout: "/admin"
    },
    {
        path: "/userProfile",
        name: "User Profile",
        icon: "pe-7s-culture",
        component: UserProfile,
        parent: "Administration",
        layout: "/admin"
    },
    {
        path: "/devices",
        name: "Add Devices",
        icon: "pe-7s-phone",
        component: Devices,
        parent: "Device Management",
        layout: "/admin"
    },
    {
        path: "/monitorDevice",
        name: "Monitor Devices",
        icon: "pe-7s-phone",
        component: DeviceMonitoring,
        parent: "Device Management",
        layout: "/admin"
    },
    {
        path: "/errorcodes",
        name: "Error Codes",
        icon: "pe-7s-attention",
        component: ErrorCodesModule,
        parent: "Device Management",
        layout: "/admin"
     },
    {
       path: "/upload",
       name: "Upload BOM",
       icon: "pe-7s-note2",
       component: DevicesBatch,
       parent: "Device Management",
       layout: "/admin"
    },
    {
       path: "/firmware",
       name: "Update Firmware",
       icon: "pe-7s-tools",
       component: DeviceFirware,
       parent: "Device Management",
       layout: "/admin"
    },
   
    {
       path: "/userRights",
       name: "User Management",
       icon: "pe-7s-science",
       component: UserRightsManagement,
       parent: "",
       layout: "/admin"
    },
    {
        path: "/manufacturerDigitalTwin",
        name: "For Manufacturer",
        icon: "pe-7s-global",
        component: ManufacturerDigitalTwin,
        parent: "Digital Twin",
        layout: "/admin"
    },
    {
        path: "/distributorDigitalTwin",
        name: "For Distributor",
        icon: "pe-7s-global",
        component: DistributorDigitalTwin,
        parent: "Digital Twin",
        layout: "/admin"
    },
    {
        path: "/usagereport",
        name: "Device Usage",
        icon: "pe-7s-global",
        component: UsageReport,
        parent: "Reporting",
        layout: "/admin"
    },
    {
        path: "/alarmAndWarningReport",
        name: "Device Alarms & Warnings",
        icon: "pe-7s-attention",
        component: AlarmWarningReport,
        parent: "Reporting",
        layout: "/admin"
    },
    {
        path: "/maintenanceReport",
        name: "Device Maintenance",
        icon: "fa fa-pie-chart",
        component: PredictivePreventiveReport,
        parent: "Reporting",
        layout: "/admin"
    },
    {
        path: "/energyReport",
        name: "Device Energy Consumption",
        icon: "fa fa-bolt",
        component: EnergyConsumptionReport,
        parent: "Reporting",
        layout: "/admin"
    },
    {
       path: "/PLCDetails",
       name: "PLC Inverter Details",
       icon: "pe-7s-plugin",
       component: InverterDetails,
       parent: "Reporting",
       layout: "/admin"
    },
    {
        path: "/accesslogs",
        name: "Access Logs",
        icon: "pe-7s-note2",
        component: Typography,
        parent: "Logging",
        layout: "/admin"
    },
    {
        path: "/auditlogs",
        name: "Audit Logs",
        icon: "pe-7s-science",
        component: Typography,
        parent: "Logging",
        layout: "/admin"
    },
];


export const validationPagesRoutes = [
    {
        path: "/NotPermitted",
        name: "",
        icon: "",
        component: NotAllowed,
        parent: "",
        layout: "/admin"
     },
     {
         path: "/contactAdmin",
         name: "",
         icon: "",
         component: ContactAdmin,
         parent: "",
         layout: "/admin"
     }
]