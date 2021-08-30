import { ThunkAction } from 'redux-thunk';
import api from './api';
import {RootActions, RootState } from  'reducers/index'
import { Dispatch } from 'react';
import { toast } from 'react-toastify';
import { reportNames } from 'constants';

export type ThunkResult<R> = ThunkAction<R,RootState, undefined,RootActions>;
export enum ActionTypes {
    GET_MAINTAINANCE_REPORT = 'GET_MAINTAINANCE_REPORT',
    GET_MAINTAINANCE_REPORT_SUCCESS = 'GET_MAINTAINANCE_REPORT_SUCCESS',
    GET_MAINTAINANCE_REPORT_FAILED = 'GET_MAINTAINANCE_REPORT_FAILED',


    DASHBOARD_GET_ALARMS_REPORT = 'DASHBOARD_GET_ALARMS_REPORT',  
    DASHBOARD_GET_ALARMS_REPORT_SUCCESS = 'DASHBOARD_GET_ALARMS_REPORT_SUCCESS',
    DASHBOARD_GET_ALARMS_REPORT_FAILED = 'DASHBOARD_GET_ALARMS_REPORT_FAILED',

    GET_USAGE_REPORT = 'GET_USAGE_REPORT',
    GET_USAGE_REPORT_SUCCESS = 'GET_USAGE_REPORT_SUCCESS',
    GET_USAGE_REPORT_FAILED = 'GET_USAGE_REPORT_FAILED',

    GET_STATS = 'GET_STATS',
    GET_STATS_SUCCESS = 'GET_STATS_SUCCESS',
    GET_STATS_FAILED = 'GET_STATS_FAILED',
    
}


interface GetMaintainanceReport {
    type: ActionTypes.GET_MAINTAINANCE_REPORT;
}
interface GetMaintainanceReportSuccess {
    type: ActionTypes.GET_MAINTAINANCE_REPORT_SUCCESS;
    payload: any
}
interface GetMaintainanceReportFailed {
    type: ActionTypes.GET_MAINTAINANCE_REPORT_FAILED;
}


export const getDashboardMaintainanceReport = (data:any): ThunkResult<void> => async dispatch => {
    handleGetMaintainanceReport(dispatch);
    api.Dashboard().GetMaintenanceReport(data)
    .then(response => {
         
        handleGetMaintainanceReportSuccess(dispatch, response.data);
    })
    .catch(err => {
        handleGetMaintainanceReportFailed(dispatch);
    })
};

export const handleGetMaintainanceReport = (dispatch:Dispatch<GetMaintainanceReport>) => {
    dispatch({type: ActionTypes.GET_MAINTAINANCE_REPORT});
}
export const handleGetMaintainanceReportSuccess = (dispatch:Dispatch<GetMaintainanceReportSuccess>, response:any) => {
    // toast.success("New Persona Permission Added", {
    //     position: toast.POSITION.BOTTOM_RIGHT
    //   });
    dispatch({type: ActionTypes.GET_MAINTAINANCE_REPORT_SUCCESS,  payload: response});
}
export const handleGetMaintainanceReportFailed = (dispatch:Dispatch<GetMaintainanceReportFailed>) => {
    // toast.error("Failed!", {
    //     position: toast.POSITION.BOTTOM_RIGHT
    //   });
    dispatch({type: ActionTypes.GET_MAINTAINANCE_REPORT_FAILED});
}



 /**_________________________________________________________________________ SEPARATOR______________________________________________________________________________________ */


 interface GetAlarmAndWarningReport{
    type: ActionTypes.DASHBOARD_GET_ALARMS_REPORT;
}

interface GetAlarmAndWarningReportSuccess {
    type: ActionTypes.DASHBOARD_GET_ALARMS_REPORT_SUCCESS;
    payload: any[];
}

interface GetAlarmAndWarningReportFailed {
    type: ActionTypes.DASHBOARD_GET_ALARMS_REPORT_FAILED;
}

 export const getAlarmAndWarningReport = (data:any): ThunkResult<void> => async dispatch => {
    handleGetAlarmAndWarningReport(dispatch);
    api.Dashboard().GetAlarmAndWarningReportData(data)
    .then(response => {

        handleGetAlarmAndWarningReportSuccess(dispatch, response.data.data)
    })
    .catch(err => {
        handleGetAlarmAndWarningReportFailed(dispatch);
    })
};


export const handleGetAlarmAndWarningReport = (dispatch:Dispatch<GetAlarmAndWarningReport>) => {
    dispatch({
        type: ActionTypes.DASHBOARD_GET_ALARMS_REPORT
    });
}

export const handleGetAlarmAndWarningReportSuccess = (dispatch:Dispatch<GetAlarmAndWarningReportSuccess>, response: any[] ) => {

    dispatch({
        type: ActionTypes.DASHBOARD_GET_ALARMS_REPORT_SUCCESS,
        payload: response
});
}
export const handleGetAlarmAndWarningReportFailed = (dispatch:Dispatch<any>) => {
    dispatch({
        type: ActionTypes.DASHBOARD_GET_ALARMS_REPORT_FAILED
});
}

 /**_______________________________________________________ USAGE REPORT _________________________________________ */


 interface GetUsagaeReport{
    type: ActionTypes.GET_USAGE_REPORT;
}

interface GetUsagaeReportSuccess {
    type: ActionTypes.GET_USAGE_REPORT_SUCCESS;
    payload: any[];
}

interface GetUsagaeReportFailed {
    type: ActionTypes.GET_USAGE_REPORT_FAILED;
}

 export const getUsageReport = (data:any): ThunkResult<void> => async dispatch => {
      
    handleGetUsageReport(dispatch);
    api.Dashboard().UsageReport(data)
    .then(response => {

        handleGetUsageReportSuccess(dispatch, response.data.data)
    })
    .catch(err => {
        handleGetUsageReportFailed(dispatch);
    })
};


export const handleGetUsageReport = (dispatch:Dispatch<GetUsagaeReport>) => {
    dispatch({
        type: ActionTypes.GET_USAGE_REPORT
    });
}

export const handleGetUsageReportSuccess = (dispatch:Dispatch<GetUsagaeReportSuccess>, response: any[] ) => {
    dispatch({
        type: ActionTypes.GET_USAGE_REPORT_SUCCESS,
        payload: response
});
}
export const handleGetUsageReportFailed = (dispatch:Dispatch<GetUsagaeReportFailed>) => {
    dispatch({
        type: ActionTypes.GET_USAGE_REPORT_FAILED
});
}

 /**_______________________________________________________ GET STATS _________________________________________ */


 interface GetStats{
    type: ActionTypes.GET_STATS;
}

interface GetStatsSuccess {
    type: ActionTypes.GET_STATS_SUCCESS;
    payload: any[];
}

interface GetStatsFailed {
    type: ActionTypes.GET_STATS_FAILED;
}

 export const getDashboardDeviceStats = (customerId:string, userId: string): ThunkResult<void> => async dispatch => {
    handleGetStats(dispatch);
    api.Dashboard().GetStats({customerId, userId})
    .then(response => {
         
        handleGetStatsSuccess(dispatch, response.data.data)
    })
    .catch(err => {
        handleGetStatsFailed(dispatch);
    })
};


export const handleGetStats = (dispatch:Dispatch<GetStats>) => {
    dispatch({
        type: ActionTypes.GET_STATS,
    });
}

export const handleGetStatsSuccess = (dispatch:Dispatch<GetStatsSuccess>, response: any[] ) => {
    dispatch({
        type: ActionTypes.GET_STATS_SUCCESS,
        payload: response
});
}
export const handleGetStatsFailed = (dispatch:Dispatch<GetStatsFailed>) => {
    dispatch({
        type: ActionTypes.GET_STATS_FAILED
});
}

export type DashbordActions = 
| GetMaintainanceReport
| GetMaintainanceReportSuccess
| GetMaintainanceReportFailed
| GetAlarmAndWarningReport 
| GetAlarmAndWarningReportFailed
| GetAlarmAndWarningReportSuccess
| GetUsagaeReport
| GetUsagaeReportSuccess
| GetUsagaeReportFailed
| GetStats
| GetStatsSuccess
| GetStatsFailed