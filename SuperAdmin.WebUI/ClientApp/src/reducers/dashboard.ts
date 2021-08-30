import { DashbordActions, ActionTypes } from '../action/dashboard';
import { Reducer } from 'redux';

export interface dashboardState {
    maintenanceReport: any;
    isGettingMaintenanceReport: boolean;
    isGettingAlarmsReport: boolean;
    alarmsWarningData: any[];
    usageReport: any[];
    dashboardStats: any[];
    isGettingStats: boolean;
    isGettingUsageData: boolean;
}
const initialState = {
    maintenanceReport: {
        maintainedDevices: [],
        pendingDevices: [],
    },
    isGettingMaintenanceReport: false,
    isGettingAlarmsReport:  false,
    alarmsWarningData: [],
    usageReport: [],
    dashboardStats: [],
    isGettingStats: false,
    isGettingUsageData: false,
}

export const dashboardReducer: Reducer<dashboardState, DashbordActions> = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_MAINTAINANCE_REPORT:
            return {
                ...state,
                maintenanceReport: {
                    maintainedDevices: [],
                    pendingDevices: []
                },
                isGettingMaintenanceReport: true,
            }

        case ActionTypes.GET_MAINTAINANCE_REPORT_SUCCESS:
             
            return {
                ...state,
                maintenanceReport: {
                    maintainedDevices: action.payload.data.maintainedDevice,
                    pendingDevices: action.payload.data.pendingDevice,
                },
                isGettingMaintenanceReport: false,
            }

        case ActionTypes.GET_MAINTAINANCE_REPORT_FAILED:
            return {
                ...state,
                maintenanceReport: {
                    maintainedDevices: [],
                    pendingDevices: []
                },
                isGettingMaintenanceReport: false,
            }
        case ActionTypes.GET_USAGE_REPORT:
            return {
                ...state,
                usageReport: [],
                isGettingUsageData: true
            }

        case ActionTypes.GET_USAGE_REPORT_SUCCESS:
            return {
                ...state,
                usageReport: action.payload,
                isGettingUsageData: false
            }
        case ActionTypes.GET_USAGE_REPORT_FAILED:
            return {
                ...state,
                usageReport: [],
                isGettingUsageData: false
            }

/**___________________________________________________________ SEPARATOR_____________________________________________ */
       
       
        case ActionTypes.DASHBOARD_GET_ALARMS_REPORT:
            return {
                ...state,
                alarmsWarningData: [],
                isGettingAlarmsReport:true
            }

        case ActionTypes.DASHBOARD_GET_ALARMS_REPORT_SUCCESS:
            return {
                ...state,
                alarmsWarningData: action.payload,
                isGettingAlarmsReport:false
            }
        case ActionTypes.DASHBOARD_GET_ALARMS_REPORT_FAILED:
            return {
                ...state,
                alarmsWarningData: [],
                isGettingAlarmsReport:false
            }
        case ActionTypes.GET_STATS:
            return {
                ...state,
                dashboardStats: [],
                isGettingStats: true,
            }

        case ActionTypes.GET_STATS_SUCCESS:
            return {
                ...state,
                dashboardStats: action.payload,
                isGettingStats: false,
            }
        case ActionTypes.GET_STATS_FAILED:
            return {
                ...state,
                dashboardStats: [],
                isGettingStats: false,
            }
        default:
            return state;
    }
} 