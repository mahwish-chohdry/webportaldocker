import { Dispatch } from 'redux';
import api from './api';
import { ThunkResult, handleLoader } from './login';
// NOT USING IT TO DISPLAY ALERTS
export enum AlertActionTypes {
    LOGIN_ALERT = 'LOGIN_ALERT',
    ADD_COMPANY_ALERT = 'ADD_COMPANY_ALERT',
    ADD_DEVICE_ALERT = 'ADD_DEVICE_ALERT',
    GET_USAGE_REPORT_STATUS = 'GET_USAGE_REPORT_STATUS'

}

interface LoginAlert {
    type: AlertActionTypes.LOGIN_ALERT;
    payload: string;
}
interface AddCompanyAlert {
    type: AlertActionTypes.ADD_COMPANY_ALERT;
    payload: string;
}
interface AddDeviceAlert {
    type: AlertActionTypes.ADD_DEVICE_ALERT;
    payload: string;
}
interface GetUsageReportStatus {
    type: AlertActionTypes.GET_USAGE_REPORT_STATUS;
    payload: string;
}
export const handleLoginAlert = (dispatch:Dispatch<LoginAlert>,response: string) => {
    dispatch({
        type: AlertActionTypes.LOGIN_ALERT,
        payload: response,
    });
}
export const handleAddCompanyAlert = (dispatch:Dispatch<AddCompanyAlert>,response: string) => {
    dispatch({
        type: AlertActionTypes.ADD_COMPANY_ALERT,
        payload: response,
    });
}
export const handleAddDeviceAlert = (dispatch:Dispatch<AddDeviceAlert>,response: string) => {
    dispatch({
        type: AlertActionTypes.ADD_DEVICE_ALERT,
        payload: response,
    });
}
export const handleGetUsageReportStatus = (dispatch:Dispatch<GetUsageReportStatus>,response: string) => {
    dispatch({
        type: AlertActionTypes.GET_USAGE_REPORT_STATUS,
        payload: response,
    });
}

export type AlertActions = 
| LoginAlert
| AddDeviceAlert
| AddCompanyAlert
| GetUsageReportStatus;