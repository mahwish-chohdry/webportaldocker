import { ActionTypes, LoginAction } from '../action/login';
import { ILoggedinUser } from '../interface';
import { Reducer } from 'redux';
import moment from 'moment';


export interface loginState {
    UserInfo: ILoggedinUser;
    isLoggedIn: boolean;
    isLoading: boolean;
    isUpdatingProfile:boolean;
    isUpdatingPassword:boolean;
}
const initialState = {
    UserInfo: {
        customerId: '',
        profileImage: '',
        role: '',
        userId: '',
        userName: '',
        userPermission: {},
        firstName:'',
        lastName:'',
        id: -1,
        customer_Id:-1,
        lastLogin:''
    } as ILoggedinUser,
    isLoggedIn: false,
    isLoading: false,
    isUpdatingProfile:false,
    isUpdatingPassword:false,

}
export const loginReducer: Reducer<loginState, LoginAction> = (state = initialState, action) => {
    var clone = {...state}
    switch (action.type) {
        case ActionTypes.AUTHENTICATE:
             
            return {
                ...state,
                UserInfo: {
                    id: action.payload.id ? action.payload.id : -1,
                    customerId: action.payload.customerId ? action.payload.customerId : '',
                    customer_Id: action.payload.customer_Id ? action.payload.customer_Id : -1,
                    profileImage: action.payload.profileImage ? action.payload.profileImage : '',
                    userId: action.payload.userId ? action.payload.userId : '',
                    role: action.payload.role ? action.payload.role : '',
                    userName: action.payload.userName ? action.payload.userName : '',
                    firstName: action.payload.firstName ? action.payload.firstName : '',
                    lastName: action.payload.lastName ? action.payload.lastName : '',
                    userPermission: action.payload.userPermission ? action.payload.userPermission : null,
                    lastLogin: moment(new Date()).format('hh:mm a')
                },
                isLoggedIn: true,
            }
        case ActionTypes.AUTHENTICATION_FAILED:
            return {
                ...state,
                IsLoggedIn: false
            }
        case ActionTypes.LOADER:
            return {
                ...state,
                isLoading: action.payload
            }
        case ActionTypes.UPDATE_MY_USER_PROFILE:
            return {
                ...state,
                isUpdatingProfile: true
            }
        case ActionTypes.UPDATE_MY_USER_PROFILE_SUCCESS:
           
            let profileToBeUpdated = action.payload;
            
            clone.UserInfo = {...clone.UserInfo, 
                    firstName: profileToBeUpdated.firstName,
                    lastName: profileToBeUpdated.lastName,
                    profileImage: profileToBeUpdated.profilePicture         
            }
        

            return {
                ...clone,
                isUpdatingProfile: false,
            }
        case ActionTypes.UPDATE_MY_USER_PROFILE_FAILED:
            return {
                ...state,
                isUpdatingProfile: false,
            }
        case ActionTypes.UPDATE_MY_PASSWORD:
            return {
                ...state,
                isUpdatingPassword: true
            }
        case ActionTypes.UPDATE_MY_PASSWORD_SUCCESS:
            return {
                ...state,
                isUpdatingPassword: false,
            }
        case ActionTypes.UPDATE_MY_PASSWORD_FAILED:
            return {
                ...state,
                isUpdatingPassword: false,
            }

        default:
            return state;
    }
} 