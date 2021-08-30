import { ThunkAction } from 'redux-thunk';
import api from './api';
import {RootActions, RootState } from 'reducers/index'
import { Dispatch } from 'react';
import { ILoggedinUser } from 'interface';
import { setToken, handleUpdatePasswordResponse } from 'utils';
import { handleLoginAlert } from './alerts';
import { toast } from 'react-toastify';

export type ThunkResult<R> = ThunkAction<R,RootState, undefined,RootActions>;
export enum ActionTypes {
    CREATE = 'CREATE',
    AUTHENTICATE = 'AUTHENTICATE',
    AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS',
    AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
    LOADER = "LOADER",


    UPDATE_MY_USER_PROFILE = "UPDATE_MY_USER_PROFILE",
    UPDATE_MY_USER_PROFILE_SUCCESS = "UPDATE_MY_USER_PROFILE_SUCCESS",
    UPDATE_MY_USER_PROFILE_FAILED = "UPDATE_MY_USER_PROFILE_FAILED",

    UPDATE_MY_PASSWORD = "UPDATE_MY_PASSWORD",
    UPDATE_MY_PASSWORD_SUCCESS = "UPDATE_MY_PASSWORD_SUCCESS",
    UPDATE_MY_PASSWORD_FAILED = "UPDATE_MY_PASSWORD_FAILED",

}

interface AuthenticateUser {
    type: ActionTypes.AUTHENTICATE;
    payload: ILoggedinUser;
}

interface AuthenticateUserSuccess {
    type: ActionTypes.AUTHENTICATION_SUCCESS;
}

interface AuthenticateUserFailed {
    type: ActionTypes.AUTHENTICATION_FAILED;
}
interface LoaderAction {
    type:ActionTypes.LOADER;
    payload: boolean;
}


export const Authenticate = (data: any): ThunkResult<void> => async (dispatch,getState) => {
    let state = getState();
    
    handleLoginAlert(dispatch,"Not Assigned");
    handleLoader(dispatch,true);
    api.Authenticate().Authenticate(data)
    .then(response => {
        setToken(response.headers.api_key);
        let userName = response.data.userName;       
        handleAuthenticatedUser(dispatch, response.data);
        handleAuthenticatedUserSuccess(dispatch,userName)
        handleLoader(dispatch,false);
        handleLoginAlert(dispatch,"Success");
    })
    .catch(err => {
        handleLoader(dispatch,false);
        handleLoginAlert(dispatch,"Failed");
        handleAuthenticatedUserFailed(dispatch);
    })
};

export const handleAuthenticatedUser = (dispatch:Dispatch<AuthenticateUser>, response: ILoggedinUser) => {
    dispatch({type: ActionTypes.AUTHENTICATE,
        payload: response
    });
}

export const handleAuthenticatedUserSuccess = (dispatch:Dispatch<AuthenticateUserSuccess>, userName:string) => {

    
}
export const handleAuthenticatedUserFailed = (dispatch:Dispatch<AuthenticateUserFailed>) => {
    toast.error("Please provide right credentials", {
            position: toast.POSITION.BOTTOM_RIGHT
          }); 
}
export const handleLoader = (dispatch:Dispatch<LoaderAction>, response: boolean) => {
    dispatch({
        type: ActionTypes.LOADER,
        payload: response
});
}


/** Update profile for my Profile */
interface UpdateUserProfiles {
    type: ActionTypes.UPDATE_MY_USER_PROFILE;
}
interface UpdateUserProfilesSuccess {
    type: ActionTypes.UPDATE_MY_USER_PROFILE_SUCCESS;
    payload: any
}
interface UpdateUserProfilesFailed {
    type: ActionTypes.UPDATE_MY_USER_PROFILE_FAILED;
}

export const UpdateMyProfile = (data:any): ThunkResult<void> => async dispatch => {
    handleUpdateUserProfiles(dispatch);
    api.UserProfile().UpdateUser(data)
    .then(response => { 
    
         
        handleUpdateUserProfilesSuccess(dispatch, response.data);
    })
    .catch(err => {
        handleUpdateUserProfilesFailed(dispatch);
    })
};

export const handleUpdateUserProfiles = (dispatch:Dispatch<UpdateUserProfiles>) => {
    dispatch({type: ActionTypes.UPDATE_MY_USER_PROFILE});
}

export const handleUpdateUserProfilesSuccess = (dispatch:Dispatch<UpdateUserProfilesSuccess>, response:any) => {
    toast.success("Successfully Updated!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.UPDATE_MY_USER_PROFILE_SUCCESS,  payload: response});
}

export const handleUpdateUserProfilesFailed = (dispatch:Dispatch<UpdateUserProfilesFailed>) => {
    toast.error("Failed!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.UPDATE_MY_USER_PROFILE_FAILED});
}



/**_______________________________ UPDATE PASSWORD _________________________________________ */
interface UpdatePassword {
    type: ActionTypes.UPDATE_MY_PASSWORD;
}

interface UpdatePasswordSuccess {
    type: ActionTypes.UPDATE_MY_PASSWORD_SUCCESS;
    payload: any
}

interface UpdatePasswordFailed {
    type: ActionTypes.UPDATE_MY_PASSWORD_FAILED;
}

export const ChangePassword = (data:any): ThunkResult<void> => async dispatch => {
    handleUpdatePassword(dispatch);
   
    api.UserProfile().UpdatePassword(data)
    .then(response => { 
        handleUpdatePasswordSuccess(dispatch, response.data);
    })
    .catch(err => {
        handleUpdatePasswordFailed(dispatch);
    })
};
export const ChangeMyPassword = (data:any): ThunkResult<void> => async dispatch => {
    handleUpdatePassword(dispatch);
   
    api.UserProfile().UpdateMyPassword(data)
    .then(response => { 
        handleUpdatePasswordSuccess(dispatch, response.data);
    })
    .catch(err => {
        handleUpdatePasswordFailed(dispatch);
    })
};

export const handleUpdatePassword = (dispatch:Dispatch<UpdatePassword>) => {
    dispatch({type: ActionTypes.UPDATE_MY_PASSWORD});
}

export const handleUpdatePasswordSuccess = (dispatch:Dispatch<UpdatePasswordSuccess>, response:any) => {
    handleUpdatePasswordResponse(response.statusCode,response.message);
    dispatch({type: ActionTypes.UPDATE_MY_PASSWORD_SUCCESS,  payload: response});
}

export const handleUpdatePasswordFailed = (dispatch:Dispatch<UpdatePasswordFailed>) => {
    toast.error("Failed!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.UPDATE_MY_PASSWORD_FAILED});
}

export type LoginAction = 
| AuthenticateUser
| AuthenticateUserSuccess
| AuthenticateUserFailed
| LoaderAction
| UpdateUserProfiles
| UpdateUserProfilesSuccess
| UpdateUserProfilesFailed
| UpdatePassword
| UpdatePasswordSuccess
| UpdatePasswordFailed
