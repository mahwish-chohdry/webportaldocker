import { ReportActionTypes, ReportAction } from '../action/reports';
import { Idevice, IErrorCode } from '../interface';
import { Reducer } from 'redux';
// import Devices from 'views/Devices';
export interface reportState {
    usageReport: any;
    isFetchingUsageReport: boolean;
    alarmReportData: any[];
    maintenanceReportData: any[];
    inverterData: any[];
    energyConsumptionReportData: any[];
    
    isGettingAlarmsReport?: boolean;
    isGettingMaintenanceReport?: boolean;
    isGettingInverterDetails?:boolean;
    isGettingEnergyDetails?:boolean;

}
const initialState = {
    usageReport: null,
    isFetchingUsageReport: false,
    alarmReportData:[],
    inverterData:[],
    maintenanceReportData:[],
    energyConsumptionReportData: [],
    
    isGettingAlarmsReport:false,
    isGettingMaintenanceReport:false,
    isGettingInverterDetails:false,
    isGettingEnergyDetails:false,
  
}

export const reportReducer: Reducer<reportState, ReportAction> = (state = initialState, action) => {
    let clone = { ...state };
    switch (action.type) {
        case ReportActionTypes.GET_ALL_USAGEREPORT:
            return {
                ...state,
                usageReport: null,
                isFetchingUsageReport: true,
            }
        case ReportActionTypes.GET_ALL_USAGEREPORT_SUCCESS:
            return {
                ...state,
                usageReport: action.payload,
                isFetchingUsageReport: false,
            }
        case ReportActionTypes.GET_ALL_USAGEREPORT_FAILED:
            return {
                ...state,
                isFetchingUsageReport: false,
            }
        case ReportActionTypes.GET_ALARMS_REPORT:
            return {
                ...state,
                isGettingAlarmsReport:true
            }
        case ReportActionTypes.GET_ALARMS_REPORT_SUCCESS:
            return {
                ...state,
                alarmReportData: action.payload,
                isGettingAlarmsReport:false
            }
        case ReportActionTypes.GET_ALARMS_REPORT_FAILED:
            return {
                ...state,
                isGettingAlarmsReport:false,
                alarmReportData:[]
            }
        case ReportActionTypes.GET_MAINTENANCE_REPORT:
            return {
                ...state,
                maintenanceReportData: [],
                isGettingMaintenanceReport:true
            }

        case ReportActionTypes.GET_MAINTENANCE_REPORT_SUCCESS:
            return {
                ...state,
                maintenanceReportData: action.payload,
                isGettingMaintenanceReport:false
            }
        case ReportActionTypes.GET_MAINTENANCE_REPORT_FAILED:
            return {
                ...state,
                maintenanceReportData: [],
                isGettingMaintenanceReport:false
            }
        case ReportActionTypes.GET_INVERTER_DETAILS:
            return {
                ...state,
                isGettingInverterDetails:true
            }

        case ReportActionTypes.GET_INVERTER_DETAILS_SUCCESS:
            return {
                ...state,
                inverterData: action.payload,
                isGettingInverterDetails:false
            }
        case ReportActionTypes.GET_INVERTER_DETAILS_FAILED:
            return {
                ...state,
                isGettingInverterDetails:false,
                inverterData:[]
            }
        case ReportActionTypes.GET_ENERGY_CONSUMPTION_DATA:
            return {
                ...state,
                isGettingEnergyDetails:true
            }
        case ReportActionTypes.GET_ENERGY_CONSUMPTION_SUCCESS:
            return {
                ...state,
                energyConsumptionReportData: action.payload,
                isGettingEnergyDetails:false
            }
        case ReportActionTypes.GET_ENERGY_CONSUMPTION_FAILED:
            return {
                ...state,
                isGettingEnergyDetails:false,
                energyConsumptionReportData:[]
            }
        case ReportActionTypes.CLEAR_REPORT_DATA:
            let reportName = action.payload;
            return {
                ...state,
                [reportName]: []              
            }
        default:
            return state;
    }
} 