import { ThunkAction } from 'redux-thunk';
import api from './api';
import {RootActions, RootState } from  'reducers/index';
import { Dispatch } from 'react';
import { toast } from 'react-toastify';
import { handleUpdatePasswordResponse } from 'utils';
import { UpdateMyProfile } from './login';

export type ThunkResult<R> = ThunkAction<R,RootState, undefined,RootActions>;
export enum ActionTypes {

    GET_ALL_USER_PROFILES = "GET_ALL_USER_PROFILES",
    GET_ALL_USER_PROFILES_SUCCESS = "GET_ALL_USER_PROFILES_SUCCESS",
    GET_ALL_USER_PROFILES_FAILED = "GET_ALL_USER_PROFILES_FAILED",

    UPDATE_USER_PROFILES = "UPDATE_USER_PROFILES",
    UPDATE_USER_PROFILES_SUCCESS = "UPDATE_USER_PROFILES_SUCCESS",
    UPDATE_USER_PROFILES_FAILED = "UPDATE_USER_PROFILES_FAILED",

    UPDATE_PASSWORD = "UPDATE_PASSWORD",
    UPDATE_PASSWORD_SUCCESS = "UPDATE_PASSWORD_SUCCESS",
    UPDATE_PASSWORD_FAILED = "UPDATE_PASSWORD_FAILED",

    CLEAR_USER_PROFILES = 'CLEAR_USER_PROFILES'

}

/**_______________________________ CLEAR USER_PROFILES _________________________________________ */

interface ClearUserProfiles {
    type: ActionTypes.CLEAR_USER_PROFILES;
}
export const clearUserProfileList = (): ThunkResult<void> => async (dispatch:Dispatch<ClearUserProfiles>) => {
    dispatch({
        type: ActionTypes.CLEAR_USER_PROFILES,
    });
};

/**_______________________________ GET USER PROFILE _________________________________________ */
interface GetAllUserProfiles {
    type: ActionTypes.GET_ALL_USER_PROFILES;
}
interface GetAllUserProfilesSuccess {
    type: ActionTypes.GET_ALL_USER_PROFILES_SUCCESS;
    payload: any
}
interface GetAllUserProfilesFailed {
    type: ActionTypes.GET_ALL_USER_PROFILES_FAILED;
}


export const GetUserProfiles = (data:any): ThunkResult<void> => async dispatch => {
    handleGetAllUserProfiles(dispatch);
    api.UserProfile().GetUsers(data)
    .then(response => { 
         
        handleGetAllUserProfilesSuccess(dispatch, response.data);
    })
    .catch(err => {
        handleGetAllUserProfilesFailed(dispatch, err.response.data.message);
    })
};

export const handleGetAllUserProfiles = (dispatch:Dispatch<GetAllUserProfiles>) => {
    dispatch({type: ActionTypes.GET_ALL_USER_PROFILES});
}

export const handleGetAllUserProfilesSuccess = (dispatch:Dispatch<GetAllUserProfilesSuccess>, response:any) => {
    if(response.length === 0){
        toast.warn("No Data found", {
            position: toast.POSITION.BOTTOM_RIGHT
          });
    } else{
        // toast.success("Successfully Loaded Data", {
        //     position: toast.POSITION.BOTTOM_RIGHT
        //   });
    }
    dispatch({type: ActionTypes.GET_ALL_USER_PROFILES_SUCCESS,  payload: response});
}

export const handleGetAllUserProfilesFailed = (dispatch:Dispatch<GetAllUserProfilesFailed>, errorMessage:string) => {
    toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.GET_ALL_USER_PROFILES_FAILED});
}

/**_______________________________ UPDATE USER PROFILE _________________________________________ */

interface UpdateUserProfiles {
    type: ActionTypes.UPDATE_USER_PROFILES;
}
interface UpdateUserProfilesSuccess {
    type: ActionTypes.UPDATE_USER_PROFILES_SUCCESS;
    payload: any
}
interface UpdateUserProfilesFailed {
    type: ActionTypes.UPDATE_USER_PROFILES_FAILED;
}

export const UpdateProfiles = (data:any): ThunkResult<void> => async( dispatch, getState) => {
    handleUpdateUserProfiles(dispatch);
    let state = getState();
      
    // If user is updating his own profile via USER PROFILES MODULE then it will call Update my profile method 
    // replication removal 
    if(data.emailAddress === state.User.UserInfo.userId)
    {
        dispatch(UpdateMyProfile(data));
    }
    else
    {
        api.UserProfile().UpdateUser(data)
        .then(response => { 
            handleUpdateUserProfilesSuccess(dispatch, response.data);
        })
        .catch(err => {
            handleUpdateUserProfilesFailed(dispatch, err.response.data.message);
        })
    }
     
   
};

export const handleUpdateUserProfiles = (dispatch:Dispatch<UpdateUserProfiles>) => {
    dispatch({type: ActionTypes.UPDATE_USER_PROFILES});
}

export const handleUpdateUserProfilesSuccess = (dispatch:Dispatch<UpdateUserProfilesSuccess>, response:any) => {
    // toast.success("Successfully Updated!", {
    //     position: toast.POSITION.BOTTOM_RIGHT
    //   });
    dispatch({type: ActionTypes.UPDATE_USER_PROFILES_SUCCESS,  payload: response});
}

export const handleUpdateUserProfilesFailed = (dispatch: Dispatch<UpdateUserProfilesFailed>, errorMessage: string) => {
    toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.UPDATE_USER_PROFILES_FAILED});
}

/**_______________________________ UPDATE PASSWORD _________________________________________ */
interface UpdatePassword {
    type: ActionTypes.UPDATE_PASSWORD;
}

interface UpdatePasswordSuccess {
    type: ActionTypes.UPDATE_PASSWORD_SUCCESS;
    payload: any
}

interface UpdatePasswordFailed {
    type: ActionTypes.UPDATE_PASSWORD_FAILED;
}

export const ChangePassword = (data:any): ThunkResult<void> => async dispatch => {
    handleUpdatePassword(dispatch);
    api.UserProfile().UpdatePassword(data)
    .then(response => { 
         
        handleUpdatePasswordSuccess(dispatch, response.data);
    })
    .catch(err => {
        handleUpdatePasswordFailed(dispatch, err.response.data.message);
    })
};

export const handleUpdatePassword = (dispatch:Dispatch<UpdatePassword>) => {
    dispatch({type: ActionTypes.UPDATE_PASSWORD});
}

export const handleUpdatePasswordSuccess = (dispatch:Dispatch<UpdatePasswordSuccess>, response:any) => {
    handleUpdatePasswordResponse(response.statusCode,response.message);
    dispatch({type: ActionTypes.UPDATE_PASSWORD_SUCCESS,  payload: response});
}

export const handleUpdatePasswordFailed = (dispatch: Dispatch<UpdatePasswordFailed>, errorMessage: string) => {
    toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.UPDATE_PASSWORD_FAILED});
}

export type UserProfile = 
| GetAllUserProfiles
| GetAllUserProfilesSuccess
| GetAllUserProfilesFailed
| UpdateUserProfiles
| UpdateUserProfilesSuccess
| UpdateUserProfilesFailed
| UpdatePassword
| UpdatePasswordSuccess
| UpdatePasswordFailed
| ClearUserProfiles