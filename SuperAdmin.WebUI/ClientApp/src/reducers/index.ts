 import {combineReducers } from "redux";
 import { loginReducer, loginState } from './login'
 import { LoginAction } from 'action/login';
 import { CompanyReducer, CompanyState } from './company';
 import { deviceReducer, deviceState } from './device';
 import { settingsState, settingsReducer } from './admin_settings';
 import { userProfileState, userProfileReducer} from './userProfile';
 import { Ialerts } from "interface";
 import { alertReducer } from './alerts';
 import { dashboardState, dashboardReducer } from './dashboard'
import { ReportAction } from "action/reports";
import { reportReducer, reportState } from "./reports";
export type RootActions =  LoginAction;
 
 export interface RootState {
     User : loginState;
     Company : CompanyState;
     Device : deviceState;
     Alerts: Ialerts;
     Settings: settingsState;
     UserProfile: userProfileState;
     Dashboard: dashboardState;
     Report: reportState;
 }
 export const rootReducers = combineReducers ({
     User: loginReducer,
     Company: CompanyReducer,
     Device: deviceReducer,
     Alerts: alertReducer,
     Settings: settingsReducer,
     UserProfile: userProfileReducer,
     Dashboard: dashboardReducer,
     Report: reportReducer,
 });
