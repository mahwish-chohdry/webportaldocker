import { Dispatch } from 'redux';
import api from './api';
import { ThunkResult, handleLoader } from './login';
import { ICompany } from 'Interface';
import { handleAddCompanyAlert } from './alerts';
import { toast } from 'react-toastify';

export enum CompanyActionTypes {
    ADD_COMPANY = 'ADD_COMPANY',
    ADD_COMPANY_SUCCESS = 'ADD_COMPANY_SUCCESS',
    ADD_COMPANY_FAILED = 'ADD_COMPANY_FAILED',

    ADD_USER_PROFILE = 'ADD_USER_PROFILE',
    ADD_USER_PROFILE_SUCESS = 'ADD_USER_PROFILE_SUCCESS',
    ADD_USER_PROFILE_FAILED = 'ADD_USER_PROFILE_FAILED',

    GET_ALL_COMPANIES = 'GET_ALL_COMPANIES',
    GET_ALL_COMPANIES_SUCCESS = 'GET_ALL_COMPANIES_SUCCESS',
    GET_ALL_COMPANIES_FAILED = 'GET_ALL_COMPANIES_FAILED',

    UPDATE_COMPANY = 'UPDATE_COMPANY',
    UPDATE_COMPANY_SUCCESS = 'UPDATE_COMPANY_SUCCESS',
    UPDATE_COMPANY_FAILED = 'UPDATE_COMPANY_FAILED',

    GET_COMPANIES_LIST = 'GET_COMPANIES_LIST',
    GET_COMPANIES_LIST_SUCCESS = 'GET_COMPANIES_LIST_SUCCESS',
    GET_COMPANIES_LIST_FAILED = 'GET_COMPANIES_LIST_FAILED',

}

interface AddCompany {
    type: CompanyActionTypes.ADD_COMPANY;
}

interface AddCompanySuccess {
    type: CompanyActionTypes.ADD_COMPANY_SUCCESS;
    payload: ICompany;
}

interface AddCompanyFailed {
    type: CompanyActionTypes.ADD_COMPANY_FAILED;
}

interface AddUserProfile {
    type: CompanyActionTypes.ADD_USER_PROFILE;
}

interface AddUserProfileSuccess {
    type: CompanyActionTypes.ADD_USER_PROFILE_SUCESS;
    payload: any;
}
interface AddUserProfileFailed {
    type: CompanyActionTypes.ADD_USER_PROFILE_FAILED;
}


interface GetAllCompanies {
    type: CompanyActionTypes.GET_ALL_COMPANIES;
}

interface GetAllCompaniesSuccess {
    type: CompanyActionTypes.GET_ALL_COMPANIES_SUCCESS;
    payload: ICompany[];
}

interface GetAllCompaniesFailed {
    type: CompanyActionTypes.GET_ALL_COMPANIES_FAILED;
}

interface UpdateCompany {
    type: CompanyActionTypes.UPDATE_COMPANY;
    payload: any;
}

interface UpdateCompanySuccess {
    type: CompanyActionTypes.UPDATE_COMPANY_SUCCESS;
    payload: ICompany[];
}

interface UpdateCompanyFailed {
    type: CompanyActionTypes.UPDATE_COMPANY_FAILED;
}

interface GetCompaniesList {
    type: CompanyActionTypes.GET_COMPANIES_LIST;
}

interface GetCompaniesListSuccess {
    type: CompanyActionTypes.GET_COMPANIES_LIST_SUCCESS;
    payload: any[];
}

interface GetCompaniesListFailed {
    type: CompanyActionTypes.GET_COMPANIES_LIST_FAILED;
}



/*____________________________ ADD USER ________________________________________ */
export const AddCompany = (data: any): ThunkResult<void> => async dispatch => {
    handleAddCompany(dispatch);
    api.Company().CreateCompany(data)
        .then(response => {
            dispatch(getAllCompanies())
            handleAddCompanySuccess(dispatch, response.data)
        })
        .catch(err => {
            handleAddCompanyFailed(dispatch,err.response.data.message);
        })
};

export const handleAddCompany = (dispatch: Dispatch<AddCompany>) => {
    dispatch({ type: CompanyActionTypes.ADD_COMPANY });
}

export const handleAddCompanySuccess = (dispatch: Dispatch<AddCompanySuccess>, response: ICompany) => {
    toast.success("Added Successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT
    });
    dispatch({
        type: CompanyActionTypes.ADD_COMPANY_SUCCESS,
        payload: response
    });
}
export const handleAddCompanyFailed = (dispatch: Dispatch<AddCompanyFailed>, errorMessage: string) => {
    toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT
    });
    dispatch({
        type: CompanyActionTypes.ADD_COMPANY_FAILED
    });
}


/*____________________________ ADD USER PROFILE________________________________________ */
export const AddUserProfile = (data: any): ThunkResult<void> => async dispatch => {
    handleAddUserProfile(dispatch);
    api.Company().CreateUserProfile(data)
        .then(response => {


            handleAddUserProfileSuccess(dispatch, response.data)
        })
        .catch(err => {
            handleAddUserProfileFailed(dispatch, err.response.data.message);
        })
};

export const handleAddUserProfile = (dispatch: Dispatch<AddUserProfile>) => {
    dispatch({ type: CompanyActionTypes.ADD_USER_PROFILE });
}

export const handleAddUserProfileSuccess = (dispatch: Dispatch<AddUserProfileSuccess>, response: any) => {
    toast.success("Added User Successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT
    });
    dispatch({
        type: CompanyActionTypes.ADD_USER_PROFILE_SUCESS,
        payload: response
    });
}
export const handleAddUserProfileFailed = (dispatch: Dispatch<AddUserProfileFailed>, errorMessage: string) => {
    toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT
    });
    dispatch({
        type: CompanyActionTypes.ADD_USER_PROFILE_FAILED
    });
}


/*____________________________ GET USER ________________________________________ */
export const getAllCompanies = (): ThunkResult<void> => async dispatch => {
    handleGetCompanies(dispatch);
    api.Company().getAllCompanies()
        .then(response => {
            handleGetCompaniesSuccess(dispatch, response.data.data)
        })
        .catch(err => {
            handleGetCompaniesFailed(dispatch);
        })
};

export const handleGetCompanies = (dispatch: Dispatch<GetAllCompanies>) => {
    dispatch({
        type: CompanyActionTypes.GET_ALL_COMPANIES
    });
}

export const handleGetCompaniesSuccess = (dispatch: Dispatch<GetAllCompaniesSuccess>, response: ICompany[]) => {
    dispatch({
        type: CompanyActionTypes.GET_ALL_COMPANIES_SUCCESS,
        payload: response
    });
}
export const handleGetCompaniesFailed = (dispatch: Dispatch<GetAllCompaniesFailed>) => {
    dispatch({
        type: CompanyActionTypes.GET_ALL_COMPANIES_FAILED
    });
}


export const UpdateCompany = (data: any): ThunkResult<void> => async dispatch => {

    // handleLoader(dispatch,true)
    api.Company().UpdateCompany(data)
        .then(response => {


            if (response.status != 200) {
                handleUpdateCompanyFailed(dispatch);

            }
            else {
                handleUpdateCompany(dispatch, data);
                handleUpdateCompanySuccess(dispatch, response.data.data)

            }
            // handleLoader(dispatch,false);


        })
        .catch(err => {
            // handleLoader(dispatch,false);
            handleUpdateCompanyFailed(dispatch);
        })
};

export const handleUpdateCompany = (dispatch: Dispatch<UpdateCompany>, data: any) => {
    dispatch({
        type: CompanyActionTypes.UPDATE_COMPANY,
        payload: data
    });
}

export const handleUpdateCompanySuccess = (dispatch: Dispatch<UpdateCompanySuccess>, response: ICompany[]) => {
    dispatch({
        type: CompanyActionTypes.UPDATE_COMPANY_SUCCESS,
        payload: response
    });
}
export const handleUpdateCompanyFailed = (dispatch: Dispatch<UpdateCompanyFailed>) => {
    dispatch({
        type: CompanyActionTypes.UPDATE_COMPANY_FAILED
    });
}

/*____________________________ GET USER LIST________________________________________ */
export const getCompanyList = (): ThunkResult<void> => async dispatch => {

    handleGetCompaniesList(dispatch);
    api.Company().GetCustomerList()
        .then(response => {

            handleGetCompaniesListSuccess(dispatch, response.data.data)
        })
        .catch(err => {
            handleGetCompaniesListFailed(dispatch);
        })
};

export const handleGetCompaniesList = (dispatch: Dispatch<GetAllCompanies>) => {
    dispatch({
        type: CompanyActionTypes.GET_ALL_COMPANIES
    });
}

export const handleGetCompaniesListSuccess = (dispatch: Dispatch<GetCompaniesListSuccess>, response: any[]) => {
    dispatch({
        type: CompanyActionTypes.GET_COMPANIES_LIST_SUCCESS,
        payload: response
    });
}
export const handleGetCompaniesListFailed = (dispatch: Dispatch<GetCompaniesListFailed>) => {
    dispatch({
        type: CompanyActionTypes.GET_COMPANIES_LIST_FAILED
    });
}

export type CompanyAction =
    | AddCompany
    | AddCompanySuccess
    | AddCompanyFailed
    | GetAllCompanies
    | GetAllCompaniesSuccess
    | GetAllCompaniesFailed
    | UpdateCompany
    | UpdateCompanySuccess
    | UpdateCompanyFailed
    | AddUserProfileFailed
    | AddUserProfile
    | AddUserProfileSuccess
    | GetCompaniesList
    | GetCompaniesListSuccess
    | GetCompaniesListFailed