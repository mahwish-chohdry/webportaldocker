export const columns = [
    {
      Header: 'Company Name',
      accessor: 'companyName',
    },
    {
      Header: 'Company Type',
        accessor: 'customerType',
    },
    {
      Header: 'Address',
      accessor: 'address',
    },
    {
      Header: 'Phone',
      accessor: 'phone',
    },
  ]

// if any change occures in names of these reports in devcie reducer 
// then these names should also be changed
  export const reportNames = {
    ALARM_REPORT: 'alarmReportData',
    MAINTENANCE_REPORT: 'maintenanceReportData',
    INVERTER_REPORT: 'inverterData',
    ENERGY_CONSUMPTION_REPORT: 'energyConsumptionReportData',
    USAGE_REPORT: 'usageReport'
  }

  export const NOT_ALLOWED = "/admin/notPermitted";

  export const MAINTENANCE_REPORT_DAYS = 30;
  export const USAGE_REPORT_DAYS = 30;
  export const FIRMWARE_UPDATE_REPORT_DAYS = 30;
  export const MOBILE_SCREEN_BREAK_POINT = 415;
  export const  PIE_CHART_SIZE = 220;


  //___________________max lengths______________
  export const USER_NAME_MAX_LENGTH = 50;
  export const DEVICE_NAME_MAX_LENGTH = 10;
  export const DEVICE_BATCH_NAME_MAX_LENGTH = 10;
  


  export const DIGITAL_TWIN_BASE_URL = "http://dt.xavor.com:88/view/twin";
 


