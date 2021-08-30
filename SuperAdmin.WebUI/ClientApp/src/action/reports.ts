import { Dispatch } from 'redux';
import api from './api';
import { ThunkResult, handleLoader } from './login';
import { Idevice, IErrorCode } from './../Interface';
import { handleAddDeviceAlert, handleGetUsageReportStatus } from './alerts';
import { toast } from 'react-toastify';
import { reportNames } from '../constants/index';

export enum ReportActionTypes {
    
    GET_ALL_USAGEREPORT = 'GET_ALL_USAGEREPORT',
    GET_ALL_USAGEREPORT_SUCCESS = 'GET_ALL_USAGEREPORT_SUCCESS',
    GET_ALL_USAGEREPORT_FAILED = 'GET_ALL_USAGEREPORT_FAILED',

    GET_ALARMS_REPORT = 'GET_ALARMS_REPORT', 
    GET_ALARMS_REPORT_SUCCESS = 'GET_ALARMS_REPORT_SUCCESS',
    GET_ALARMS_REPORT_FAILED = 'GET_ALARMS_REPORT_FAILED',

    GET_MAINTENANCE_REPORT = 'GET_MAINTENANCE_REPORT',
    GET_MAINTENANCE_REPORT_SUCCESS = 'GET_MAINTENANCE_REPORT_SUCCESS',
    GET_MAINTENANCE_REPORT_FAILED = 'GET_MAINTENANCE_REPORT_FAILED',

    GET_INVERTER_DETAILS = 'GET_INVERTER_DETAILS',
    GET_INVERTER_DETAILS_SUCCESS = 'GET_INVERTER_DETAILS_SUCCESS',
    GET_INVERTER_DETAILS_FAILED = 'GET_INVERTER_DETAILS_FAILED',

    GET_ENERGY_CONSUMPTION_DATA = 'GET_ENERGY_CONSUMPTION_DATA',
    GET_ENERGY_CONSUMPTION_SUCCESS = 'GET_ENERGY_CONSUMPTION_SUCCESS',
    GET_ENERGY_CONSUMPTION_FAILED = 'GET_ENERGY_CONSUMPTION_FAILED',

    CLEAR_REPORT_DATA = 'CLEAR_REPORT_DATA',
}


interface clearAlarmReportData {
    type: ReportActionTypes.CLEAR_REPORT_DATA;
    payload: string;
}
interface GetInverterDetails{
    type: ReportActionTypes.GET_INVERTER_DETAILS;
}

interface GetInverterDetailsSuccess {
    type: ReportActionTypes.GET_INVERTER_DETAILS_SUCCESS;
    payload: any[];
}
interface GetInverterDetailsFailed {
    type: ReportActionTypes.GET_INVERTER_DETAILS_FAILED;
}

interface GetAlarmAndWarningReport{
    type: ReportActionTypes.GET_ALARMS_REPORT;
}

interface GetAlarmAndWarningReportSuccess {
    type: ReportActionTypes.GET_ALARMS_REPORT_SUCCESS;
    payload: any[];
}

interface GetAlarmAndWarningReportFailed {
    type: ReportActionTypes.GET_ALARMS_REPORT_FAILED;
}

interface GetMaintenanceReport{
    type: ReportActionTypes.GET_MAINTENANCE_REPORT;
}

interface GetMaintenanceReportSuccess {
    type: ReportActionTypes.GET_MAINTENANCE_REPORT_SUCCESS;
    payload: any[];
}

interface GetMaintenanceReportFailed {
    type: ReportActionTypes.GET_MAINTENANCE_REPORT_FAILED;
}


interface GetUsageReport {
    type: ReportActionTypes.GET_ALL_USAGEREPORT;
}

interface GetUsageReportSuccess {
    type: ReportActionTypes.GET_ALL_USAGEREPORT_SUCCESS;
    payload: any;
}

interface GetUsageReportFailed {
    type: ReportActionTypes.GET_ALL_USAGEREPORT_FAILED;
}




export const GetUsageReport = (data:any): ThunkResult<void> => async dispatch => {
    handleGetUsageReport(dispatch);
    //handleLoader(dispatch,true)
    handleGetUsageReportStatus(dispatch,'not Assigned')
    api.Report().UsageReport(data)
    .then(response => {
        if(response.data.data.labels.length === 0){
            toast.warn("No Report found for selected option",{
                    position: toast.POSITION.BOTTOM_RIGHT
                  });
        }
        else{
            toast.success("Successful",{
                    position: toast.POSITION.BOTTOM_RIGHT
                  });
        }
         handleGetUsageReportSuccess(dispatch, response.data.data);
    })
    .catch(err => {
        HandleGetUsageReportFailed(dispatch);
        toast.error(err.response.data.message,{
            position: toast.POSITION.BOTTOM_RIGHT
          });
    })
};

export const handleGetUsageReport = (dispatch:Dispatch<GetUsageReport>) => {
    dispatch({type: ReportActionTypes.GET_ALL_USAGEREPORT});
}

export const handleGetUsageReportSuccess = (dispatch:Dispatch<GetUsageReportSuccess>, response: any ) => {
    dispatch({
        type: ReportActionTypes.GET_ALL_USAGEREPORT_SUCCESS,
        payload: response
});
}
export const HandleGetUsageReportFailed = (dispatch:Dispatch<GetUsageReportFailed>) => {
    dispatch({
        type: ReportActionTypes.GET_ALL_USAGEREPORT_FAILED
});
}



/** ____________________________________MAINTENANCE REPORT________________________________ */

 export const getMaintenanceReport = (data:any): ThunkResult<void> => async dispatch => {
    handleGetMaintenanceReport(dispatch);
    api.Report().GetMaintenanceReport(data)
    .then(response => {
         
        handleGetMaintenanceReportSuccess(dispatch, response.data.data)
    })
    .catch(err => {
        handleGetMaintenanceReportFailed(dispatch, err.response.data.message);
    })
};

export const handleGetMaintenanceReport = (dispatch:Dispatch<GetMaintenanceReport>) => {
    dispatch({
        type: ReportActionTypes.GET_MAINTENANCE_REPORT
    });
}

export const handleGetMaintenanceReportSuccess = (dispatch:Dispatch<GetMaintenanceReportSuccess>, response: any[] ) => {
     
    if( response === null || (response && response.length === 0))
    {
        toast.warn("No Data Available for selected filters ", {
            position: toast.POSITION.BOTTOM_RIGHT
          });
    }
    dispatch({
        type: ReportActionTypes.GET_MAINTENANCE_REPORT_SUCCESS,
        payload: response
    });
}
export const handleGetMaintenanceReportFailed = (dispatch: Dispatch<GetMaintenanceReportFailed>, errorMessage: string) => {

    toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({
        type: ReportActionTypes.GET_MAINTENANCE_REPORT_FAILED
    });
}
 
/** ____________________________________ALARM AND WARNING REPORT________________________________ */

export const getAlarmAndWarningReport = (data:any): ThunkResult<void> => async dispatch => {
    handleGetAlarmAndWarningReport(dispatch);
    api.Report().GetAlarmAndWarningReportData(data)
    .then(response => {

        handleGetAlarmAndWarningReportSuccess(dispatch, response.data.data)
    })
    .catch(err => {
        handleGetAlarmAndWarningReportFailed(dispatch, err.response.data.message);
    })
};
export const clearReportData = (reportName:string): ThunkResult<void> => async (dispatch:Dispatch<clearAlarmReportData>) => {
   
        dispatch({
            type: ReportActionTypes.CLEAR_REPORT_DATA,
            payload: reportName
        });

    
};

export const handleGetAlarmAndWarningReport = (dispatch:Dispatch<GetAlarmAndWarningReport>) => {
    dispatch({
        type: ReportActionTypes.GET_ALARMS_REPORT
    });
}

export const handleGetAlarmAndWarningReportSuccess = (dispatch:Dispatch<GetAlarmAndWarningReportSuccess>, response: any[] ) => {
    // if(response && response.length == 0)
    // {
    //     toast.warn("No Data Available for selected filters ", {
    //         position: toast.POSITION.BOTTOM_RIGHT
    //       });
    // }
    dispatch({
        type: ReportActionTypes.GET_ALARMS_REPORT_SUCCESS,
        payload: response
});
}
export const handleGetAlarmAndWarningReportFailed = (dispatch: Dispatch<any>, errorMessage: string) => {
    toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch(clearReportData(reportNames.ALARM_REPORT))
    dispatch({
        type: ReportActionTypes.GET_ALARMS_REPORT_FAILED
});
}





/** ____________________________________INVERTER DETAILS________________________________ */

export const getInverterDetails = (data:any): ThunkResult<void> => async dispatch => {
    handleGetInverterDetails(dispatch);
    api.Report().GetInverterDetails(data)
    .then((response:any) => {

        handleGetInverterDetailsSuccess(dispatch, response.data.data)
    })
    .catch((err:any) => {
        handleGetInverterDetailsFailed(dispatch, err.response.data.message);
    })
};

export const handleGetInverterDetails = (dispatch:Dispatch<GetInverterDetails>) => {
    dispatch({
        type: ReportActionTypes.GET_INVERTER_DETAILS
    });
}

export const handleGetInverterDetailsSuccess = (dispatch:Dispatch<GetInverterDetailsSuccess>, response: any[] ) => {
    if(response.length == 0)
    {
        toast.warn("No Data Available for selected filters ", {
            position: toast.POSITION.BOTTOM_RIGHT
          });
    }
    dispatch({
        type: ReportActionTypes.GET_INVERTER_DETAILS_SUCCESS,
        payload: response
});
}
export const handleGetInverterDetailsFailed = (dispatch: Dispatch<GetInverterDetailsFailed>, errorMessage: string) => {
    toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({
        type: ReportActionTypes.GET_INVERTER_DETAILS_FAILED
});
}


/** ____________________________________ENERGY CONSUMPTION REPORT________________________________ */


interface GetEnergyConsumptionData {
    type: ReportActionTypes.GET_ENERGY_CONSUMPTION_DATA;
}

interface GetEnergyConsumptionDataSuccess{
    type: ReportActionTypes.GET_ENERGY_CONSUMPTION_SUCCESS;
    payload: any[];
}

interface GetEnergyConsumptionDataFailed {
    type: ReportActionTypes.GET_ENERGY_CONSUMPTION_FAILED;
   
}

export const getEnergyConsumptionData = (data:any): ThunkResult<void> => async dispatch => {
    handleGetEnergyConsumptionData(dispatch);
    api.Report().GetEnergyConsumptionReport(data)
    .then((response:any) => {

        handleGetEnergyConsumptionDataSuccess(dispatch, response.data.data)
    })
    .catch((err:any) => {
        handleGetEnergyConsumptionDataFailed(dispatch, err.response.data.message);
    })
};

export const handleGetEnergyConsumptionData = (dispatch:Dispatch<GetEnergyConsumptionData>) => {
    dispatch({
        type: ReportActionTypes.GET_ENERGY_CONSUMPTION_DATA
    });
}

export const handleGetEnergyConsumptionDataSuccess = (dispatch:Dispatch<GetEnergyConsumptionDataSuccess>, response: any[] ) => {
    if(response.length == 0)
    {
        toast.warn("No Data Available for selected filters ", {
            position: toast.POSITION.BOTTOM_RIGHT
          });
    }
    dispatch({
        type: ReportActionTypes.GET_ENERGY_CONSUMPTION_SUCCESS,
        payload: response
});
}
export const handleGetEnergyConsumptionDataFailed = (dispatch: Dispatch<GetEnergyConsumptionDataFailed>, errorMessage: string) => {
    toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({
        type: ReportActionTypes.GET_ENERGY_CONSUMPTION_FAILED
});
}


export const exportUsageReport = (data:any): ThunkResult<void> => async dispatch => {

    api.Report().ExportUsageReport(data)
    .then((response:any) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.csv'); //or any other extension
        document.body.appendChild(link);
        link.click();
        // handleExportUsageReportSuccess(dispatch, response.data.data)
    })
    .catch((err:any) => {
        console.log(err);
        // handleExportUsageReportFailed(dispatch);
    })
};


export type ReportAction = 
| GetUsageReportSuccess
| GetUsageReportFailed
| GetUsageReport
| GetAlarmAndWarningReport
| GetAlarmAndWarningReportFailed
| GetAlarmAndWarningReportSuccess
| GetMaintenanceReport
| GetMaintenanceReportSuccess
| GetMaintenanceReportFailed
| GetInverterDetails
| GetInverterDetailsSuccess
| GetInverterDetailsFailed
| clearAlarmReportData
| GetEnergyConsumptionData
| GetEnergyConsumptionDataFailed
| GetEnergyConsumptionDataSuccess