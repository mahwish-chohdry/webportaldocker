import { AlertActionTypes, AlertActions} from '../action/alerts';
import { Ialerts } from '../interface';
import { Reducer } from 'redux';

const initialState = {
    loginAlertStatus: 'Not Assigned',
    addCompanyAlertStatus: 'Not Assigned',
    addDeviceAlertStatus: 'Not Assigned',
    getUsageReportStatus: 'Not Assigned',
}
export const alertReducer: Reducer<Ialerts, AlertActions> = (state = initialState, action) => {
    switch(action.type){
        case AlertActionTypes.LOGIN_ALERT:
            return{
                ...state,
                loginAlertStatus: action.payload
            }
        case AlertActionTypes.ADD_COMPANY_ALERT:
            return{
                ...state,
                addCompanyAlertStatus: action.payload
            }
        case AlertActionTypes.ADD_DEVICE_ALERT:
            return{
                ...state,
                addDeviceAlertStatus: action.payload
            }
        case AlertActionTypes.GET_USAGE_REPORT_STATUS:
            return{
                ...state,
                getUsageReportStatus: action.payload
            }
        default:
            return state;
    }
} 