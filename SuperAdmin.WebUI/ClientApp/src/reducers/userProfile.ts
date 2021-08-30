import { UserProfile , ActionTypes } from '../action/userProfile';
import { Reducer } from 'redux';

export interface userProfileState {
    isGettingProfiles: boolean;
    userProfiles: any[];

}
const initialState = {
    userProfiles: [],
    isGettingProfiles: false,
}

export const userProfileReducer: Reducer<userProfileState, UserProfile > = (state = initialState, action) => {
    let clone = {...state};
    switch (action.type) {
        case ActionTypes.GET_ALL_USER_PROFILES:
            return {
                ...state,
                userProfiles: [],
                isGettingProfiles: true,
            }
        case ActionTypes.GET_ALL_USER_PROFILES_SUCCESS:
            return {
                ...state,
                userProfiles: action.payload,
                isGettingProfiles: false,
            }
        case ActionTypes.GET_ALL_USER_PROFILES_FAILED:
            return {
                ...state,
                userProfiles: [],
                isGettingProfiles: false,
            }
        case ActionTypes.CLEAR_USER_PROFILES:
            return {
                ...state,
                userProfiles: []
            }
        case ActionTypes.UPDATE_USER_PROFILES:
            return {
                ...state,
                isUpdatingProfile: true
            }
        case ActionTypes.UPDATE_USER_PROFILES_SUCCESS:

            let profileToBeUpdated = action.payload;    
            clone.userProfiles = clone.userProfiles.map(profile => {
                // additional fields which are modal can be added here 
                if(profile.id === profileToBeUpdated.id)
                {
                   profile.firstName = profileToBeUpdated.firstName;
                   profile.lastName = profileToBeUpdated.lastName;
                   profile.profilePicture = profileToBeUpdated.profilePicture;
                }    
                return profile;
            })

            return {
                ...clone,
                isUpdatingProfile: false,
            }
        case ActionTypes.UPDATE_USER_PROFILES_FAILED:
            return {
                ...state,
                isUpdatingProfile: false,
            }
        case ActionTypes.UPDATE_PASSWORD:
            return {
                ...state,
                isUpdatingPassword: true
            }
        case ActionTypes.UPDATE_PASSWORD_SUCCESS:
            return {
                ...state,
                isUpdatingPassword: false,
            }
        case ActionTypes.UPDATE_PASSWORD_FAILED:
            return {
                ...state,
                isUpdatingPassword: false,
            }
        default:
            return state;
    }
} 