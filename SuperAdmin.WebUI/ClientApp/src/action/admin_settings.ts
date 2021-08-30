import { ThunkAction } from 'redux-thunk';
import api from './api';
import {RootActions, RootState } from  'reducers/index'
import { Dispatch } from 'react';
import { toast } from 'react-toastify';

export type ThunkResult<R> = ThunkAction<R,RootState, undefined,RootActions>;
export enum ActionTypes {
    GET_ROLES  = "GET_ROLES",
    GET_ROLES_FAILED  = "GET_ROLES_FAILED",


    GET_ROLES_BY_PERSONA  = "GET_ROLES_BY_PERSONA",
    GET_ROLES_BY_PERSONA_FAILED  = "GET_ROLES_BY_PERSONA_FAILED",

    GET_PERSONAS = "GET_PERSONAS",
    GET_PERSONAS_FAILED = "GET_PERSONAS_FAILED",

    ADD_FORM_NAME = "ADD_FORM_NAME",
    ADD_FORM_NAME_SUCCESS = "ADD_FORM_NAME_SUCCESS",
    ADD_FORM_NAME_FAILED = "ADD_FORM_NAME_FAILED",

    GET_FORMS  = "GET_FORMS",
    GET_FORMS_FAILED  = "GET_FORMS_FAILED",

    CREATE_PERSONA_PERMISSIONS = "CREATE_PERSONA_PERMISSIONS",
    CREATE_PERSONA_PERMISSIONS_SUCCESS = "CREATE_PERSONA_PERMISSIONS_SUCCESS",
    CREATE_PERSONA_PERMISSIONS_FAILED = "CREATE_PERSONA_PERMISSIONS_FAILED",

    CREATE_ROLE_PERMISSIONS = "CREATE_ROLE_PERMISSIONS",
    CREATE_ROLE_PERMISSIONS_SUCCESS = "CREATE_ROLE_PERMISSIONS_SUCCESS",
    CREATE_ROLE_PERMISSIONS_FAILED = "CREATE_ROLE_PERMISSIONS_FAILED",

    GET_PERSONA_PERMISSIONS = "GET_PERSONA_PERMISSIONS",
    GET_PERSONA_PERMISSIONS_SUCCESS = "GET_PERSONA_PERMISSIONS_SUCCESS",
    GET_PERSONA_PERMISSIONS_FAILED = "GET_PERSONA_PERMISSIONS_FAILED",

    GET_ROLE_PERMISSIONS = "GET_ROLE_PERMISSIONS",
    GET_ROLE_PERMISSIONS_SUCCESS = "GET_ROLE_PERMISSIONS_SUCCESS",
    GET_ROLE_PERMISSIONS_FAILED = "GET_ROLE_PERMISSIONS_FAILED",


    DELETE_PERSONA_PERMISSION = "DELETE_PERSONA_PERMISSION",
    DELETE_PERSONA_PERMISSION_SUCCESS = "DELETE_PERSONA_PERMISSION_SUCCESS",
    DELETE_PERSONA_PERMISSION_FAILED = "DELETE_PERSONA_PERMISSION_FAILED",

    UPDATE_ROLE_PERMISSIONS = "UPDATE_ROLE_PERMISSIONS",
    UPDATE_ROLE_PERMISSIONS_SUCCESS = "UPDATE_ROLE_PERMISSIONS_SUCCESS",
    UPDATE_ROLE_PERMISSIONS_FAILED = "UPDATE_ROLE_PERMISSIONS_FAILED",

    UPDATE_FORM_NAME= "UPDATE_FORM_NAME",
    UPDATE_FORM_NAME_SUCCESS = "UPDATE_FORM_NAME_SUCCESS",
    UPDATE_FORM_NAME_FAILED = "UPDATE_FORM_NAME_FAILED",

    UPDATE_PERSONA_PERMISSIONS = "UPDATE_PERSONA_PERMISSIONS",
    UPDATE_PERSONA_PERMISSIONS_SUCCESS = "UPDATE_PERSONA_PERMISSIONS_SUCCESS",
    UPDATE_PERSONA_PERMISSIONS_FAILED = "UPDATE_PERSONA_PERMISSIONS_FAILED",

    DELETE_FORM = "DELETE_FORM",
    DELETE_FORM_SUCCESS = "DELETE_FORM_SUCCESS",
    DELETE_FORM_FAILED = "DELETE_FORM_FAILED",

    DELETE_ROLE_PERMISSION = "DELETE_ROLE_PERMISSION",
    DELETE_ROLE_PERMISSION_SUCCESS = "DELETE_ROLE_PERMISSION_SUCCESS",
    DELETE_ROLE_PERMISSION_FAILED = "DELETE_ROLE_PERMISSION_FAILED",
}

interface GetRoles {
    type: ActionTypes.GET_ROLES;
    payload: any[]
}
interface GetRolesFailed {
    type: ActionTypes.GET_ROLES_FAILED;
}

interface GetRolesByPersona {
    type: ActionTypes.GET_ROLES_BY_PERSONA;
    payload: any[]
}
interface GetRolesByPersonaFailed {
    type: ActionTypes.GET_ROLES_BY_PERSONA_FAILED;
}

interface GetPersonas {
    type: ActionTypes.GET_PERSONAS;
    payload: any[]
}

interface GetPersonasFailed {
    type: ActionTypes.GET_PERSONAS_FAILED;

}
interface AddFormName {
    type: ActionTypes.ADD_FORM_NAME;
}
interface AddFormNameSuccess {
    type: ActionTypes.ADD_FORM_NAME_SUCCESS;
    payload: any[]
}
interface AddFormNameFailed {
    type: ActionTypes.ADD_FORM_NAME_FAILED;
}
interface GetForms {
    type: ActionTypes.GET_FORMS;
    payload: any[]
}
interface GetFormsFailed {
    type: ActionTypes.GET_FORMS_FAILED;
}
/**_______________________________ Get Roles List _________________________________________ */

export const GetRolesListByPersona = (persona:any): ThunkResult<void> => async dispatch => {

    api.Settings().GetRolesListByPersona(persona)
    .then(response => {
        
      handleGetRolesByPersona(dispatch, response.data);

    })
    .catch(err => {

        handleGetRolesByPersonaFailed(dispatch);
    })
};

export const GetRolesList = (): ThunkResult<void> => async dispatch => {

    api.Settings().GetRolesList()
    .then(response => {
        
      handleGetRoles(dispatch, response.data);

    })
    .catch(err => {

        handleGetRolesFailed(dispatch);
    })
};

export const handleGetRoles = (dispatch:Dispatch<GetRoles>, response: any[]) => {
    dispatch({type: ActionTypes.GET_ROLES, payload: response});
}
export const handleGetRolesFailed = (dispatch:Dispatch<GetRolesFailed>) => {
    dispatch({type: ActionTypes.GET_ROLES_FAILED});
}
export const handleGetRolesByPersona = (dispatch:Dispatch<GetRolesByPersona>, response: any[]) => {
    dispatch({type: ActionTypes.GET_ROLES_BY_PERSONA, payload: response});
}
export const handleGetRolesByPersonaFailed = (dispatch:Dispatch<GetRolesByPersonaFailed>) => {
    dispatch({type: ActionTypes.GET_ROLES_BY_PERSONA_FAILED});
}
/**_______________________________ Add form Name _________________________________________ */

export const AddFormNames = (data: any): ThunkResult<void> => async dispatch => {
     
    handleAddFormName(dispatch);
    api.Settings().addFormName(data)
    .then(response => {    
            
      handleAddFormNameSuccess(dispatch, response.data);
    })
    .catch(err => {
        handleAddFormNameFailed(dispatch);
    })
};
export const handleAddFormName = (dispatch:Dispatch<AddFormName>) => {
    dispatch({type: ActionTypes.ADD_FORM_NAME});
}
export const handleAddFormNameSuccess = (dispatch:Dispatch<AddFormNameSuccess>, response: any[]) => {
    toast.success("Form Created Successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.ADD_FORM_NAME_SUCCESS, payload: response});
}
export const handleAddFormNameFailed = (dispatch:Dispatch<AddFormNameFailed>) => {
    toast.success("Failed to Create Form!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.ADD_FORM_NAME_FAILED});
}

/**_______________________________ Get Personas List _________________________________________ */

export const GetPersonasList = (): ThunkResult<void> => async dispatch => {

    api.Settings().GetCustomerTypes()
    .then(response => {

        handleGetPersonas(dispatch, response.data);

    })
    .catch(err => {

        handleGetPersonasFailed(dispatch);
    })
};

export const handleGetPersonas = (dispatch:Dispatch<GetPersonas>, response: any[]) => {
    dispatch({type: ActionTypes.GET_PERSONAS, payload: response});
}
export const handleGetPersonasFailed = (dispatch:Dispatch<GetPersonasFailed>) => {
    dispatch({type: ActionTypes.GET_PERSONAS_FAILED});
}
/**_______________________________ Get Form List _________________________________________ */
export const GetFormsList = (): ThunkResult<void> => async dispatch => {
     
    api.Settings().GetFormTypes()
    .then(response => {
         
        handleGetFormsList(dispatch, response.data);

    })
    .catch(err => {

        handleGetFormsListFailed(dispatch);
    })
};

export const handleGetFormsList = (dispatch:Dispatch<GetForms>, response: any[]) => {
    dispatch({type: ActionTypes.GET_FORMS, payload: response});
}
export const handleGetFormsListFailed = (dispatch:Dispatch<GetFormsFailed>) => {
    dispatch({type: ActionTypes.GET_FORMS_FAILED});
}

/**_______________________________ CREATE PERSONA PERMISSION _________________________________________ */
interface CreatePersonaPermissions {
    type: ActionTypes.CREATE_PERSONA_PERMISSIONS;
}
interface CreatePersonaPermissionsSuccess {
    type: ActionTypes.CREATE_PERSONA_PERMISSIONS_SUCCESS;
    payload: any
}
interface CreatePersonaPermissionsFailed {
    type: ActionTypes.CREATE_PERSONA_PERMISSIONS_FAILED;
}


export const CreatePersonaPermissions = (data:any): ThunkResult<void> => async dispatch => {
    handleCreatePersonaPermissions(dispatch);
    let api_data = {
        FormId: data.Form.id,
        PersonaId: data.Persona.id,
        id: 0
    }
    api.Settings().CreatePersonaPermissions(api_data)
    .then(response => { 
        dispatch(GetPersonaPermissionsList());
        handleCreatePersonaPermissionsSuccess(dispatch, data);
    })
    .catch(err => {
        handleCreatePersonaPermissionsFailed(dispatch);
    })
};

export const handleCreatePersonaPermissions = (dispatch:Dispatch<CreatePersonaPermissions>) => {
    dispatch({type: ActionTypes.CREATE_PERSONA_PERMISSIONS});
}
export const handleCreatePersonaPermissionsSuccess = (dispatch:Dispatch<CreatePersonaPermissionsSuccess>, response:any) => {
    toast.success("New Persona Permission Added", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.CREATE_PERSONA_PERMISSIONS_SUCCESS,  payload: response});
}
export const handleCreatePersonaPermissionsFailed = (dispatch:Dispatch<CreatePersonaPermissionsFailed>) => {
    toast.error("Failed!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.CREATE_PERSONA_PERMISSIONS_FAILED});
}

/**_______________________________ CREATE ROLE PERMISSION _________________________________________ */
interface CreateRolePermissions {
    type: ActionTypes.CREATE_ROLE_PERMISSIONS;
}
interface CreateRolePermissionsSuccess {
    type: ActionTypes.CREATE_ROLE_PERMISSIONS_SUCCESS;
    payload: any
}
interface CreateRolePermissionsFailed {
    type: ActionTypes.CREATE_ROLE_PERMISSIONS_FAILED;
}


export const CreateRolePermissions = (data:any): ThunkResult<void> => async dispatch => {
    handleCreateRolePermissions(dispatch);
    api.Settings().CreateRolePermissions(data)
    .then(response => {

         handleCreateRolePermissionsSuccess(dispatch, response.data);
    })
    .catch(err => {
        handleCreateRolePermissionsFailed(dispatch);
    })
};

export const handleCreateRolePermissions = (dispatch:Dispatch<CreateRolePermissions>) => {
    dispatch({type: ActionTypes.CREATE_ROLE_PERMISSIONS});
}
export const handleCreateRolePermissionsSuccess = (dispatch:Dispatch<CreateRolePermissionsSuccess>, response:any) => {
    toast.success("Successfullly Added Role Permission!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.CREATE_ROLE_PERMISSIONS_SUCCESS,  payload: response});
}
export const handleCreateRolePermissionsFailed = (dispatch:Dispatch<CreateRolePermissionsFailed>) => {
    toast.error("Failed!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.CREATE_ROLE_PERMISSIONS_FAILED});
}





/**_______________________________ GET PERSONA PERMISSION DATA  _________________________________________ */

interface IGetPersonaPermissionsList {
    type: ActionTypes.GET_PERSONA_PERMISSIONS;
}
interface IGetPersonaPermissionsListSuccess {
    type: ActionTypes.GET_PERSONA_PERMISSIONS_SUCCESS;
    payload: any
}
interface IGetPersonaPermissionsListFailed {
    type: ActionTypes.GET_PERSONA_PERMISSIONS_FAILED;
}

export const GetPersonaPermissionsList = (): ThunkResult<void> => async dispatch => {
    handleGetPersonaPermissionsList(dispatch);
    api.Settings().GetPersonaPermissionsList()
    .then(response => {
      handleGetPersonaPermissionsListSuccess(dispatch, response.data);

    })
    .catch(err => {

        handleGetPersonaPermissionsListFailed(dispatch);
    })
};

export const handleGetPersonaPermissionsListSuccess = (dispatch:Dispatch<IGetPersonaPermissionsListSuccess>, response: any[]) => {
    dispatch({type: ActionTypes.GET_PERSONA_PERMISSIONS_SUCCESS, payload: response});
}
export const handleGetPersonaPermissionsListFailed = (dispatch:Dispatch<IGetPersonaPermissionsListFailed>) => {
    dispatch({type: ActionTypes.GET_PERSONA_PERMISSIONS_FAILED});
}
export const handleGetPersonaPermissionsList = (dispatch:Dispatch<IGetPersonaPermissionsList>) => {
    dispatch({type: ActionTypes.GET_PERSONA_PERMISSIONS});
}


/**_______________________________ DELETE PERSONA PERMISSION DATA  _________________________________________ */
interface IDeletePersonaPermission {
    type: ActionTypes.DELETE_PERSONA_PERMISSION;
}
interface IDeletePersonaPermissionSuccess {
    type: ActionTypes.DELETE_PERSONA_PERMISSION_SUCCESS;
    payload: any
}
interface IDeletePersonaPermissionFailed {
    type: ActionTypes.DELETE_PERSONA_PERMISSION_FAILED;
}

export const DeletePersonaPermission = (id:any): ThunkResult<void> => async dispatch => {
    handleGetPersonaPermissionsList(dispatch);
    api.Settings().DeletePersonaPermission(id)
    .then(response => {
        handleDeletePersonaPermissionSuccess(dispatch, id);

    })
    .catch(err => {

        handleDeletePersonaPermissionFailed(dispatch);
    })
};

export const handleDeletePersonaPermissionSuccess = (dispatch:Dispatch<IDeletePersonaPermissionSuccess>, response: any[]) => {
    toast.success("Deleted!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.DELETE_PERSONA_PERMISSION_SUCCESS, payload: response});
}
export const handleDeletePersonaPermissionFailed = (dispatch:Dispatch<IDeletePersonaPermissionFailed>) => {
    toast.error("Something went wrong!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.DELETE_PERSONA_PERMISSION_FAILED});
}
export const handleIDeletePersonaPermission = (dispatch:Dispatch<IDeletePersonaPermission>) => {
    dispatch({type: ActionTypes.DELETE_PERSONA_PERMISSION});
}


/**_______________________________ DELETE FORM DATA  _________________________________________ */
interface IDeleteForm {
    type: ActionTypes.DELETE_FORM;
}
interface IDeleteFormSuccess {
    type: ActionTypes.DELETE_FORM_SUCCESS;
    payload: any
}
interface IDeleteFormFailed {
    type: ActionTypes.DELETE_FORM_FAILED;
}

export const DeleteForm = (id:any): ThunkResult<void> => async dispatch => {
    handleDeleteForm(dispatch);
    api.Settings().DeleteForm(id)
    .then(response => {
        handleDeleteFormSuccess(dispatch, id);

    })
    .catch(err => {

        handleDeleteFormFailed(dispatch);
    })
};

export const handleDeleteFormSuccess = (dispatch:Dispatch<IDeleteFormSuccess>, response: any[]) => {
    toast.success("Deleted Form!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.DELETE_FORM_SUCCESS, payload: response});
}
export const handleDeleteFormFailed = (dispatch:Dispatch<IDeleteFormFailed>) => {
    toast.error("Something went wrong!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.DELETE_FORM_FAILED});
}
export const handleDeleteForm= (dispatch:Dispatch<IDeleteForm>) => {
    dispatch({type: ActionTypes.DELETE_FORM});
}


/**_______________________________ DELETE ROLE PERMISSION DATA  _________________________________________ */
interface IDeleteRolePerm {
    type: ActionTypes.DELETE_ROLE_PERMISSION;
}
interface IDeleteRolePermSuccess {
    type: ActionTypes.DELETE_ROLE_PERMISSION_SUCCESS;
    payload: any
}
interface IDeleteRolePermFailed {
    type: ActionTypes.DELETE_ROLE_PERMISSION_FAILED;
}

export const DeleteRolePermission = (id:any): ThunkResult<void> => async dispatch => {
    handleDeleteRolePermission(dispatch);
    api.Settings().DeleteRolePermissions(id)
    .then(response => {
        handleDeleteRolePermissionSuccess(dispatch, id);

    })
    .catch(err => {

        handleDeleteRolePermissionFailed(dispatch);
    })
};

export const handleDeleteRolePermissionSuccess = (dispatch:Dispatch<IDeleteRolePermSuccess>, response: any[]) => {
    toast.success("Deleted Form!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.DELETE_ROLE_PERMISSION_SUCCESS, payload: response});
}
export const handleDeleteRolePermissionFailed = (dispatch:Dispatch<IDeleteRolePermFailed>) => {
    toast.error("Something went wrong!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    dispatch({type: ActionTypes.DELETE_ROLE_PERMISSION_FAILED});
}
export const handleDeleteRolePermission = (dispatch:Dispatch<IDeleteRolePerm>) => {
    dispatch({type: ActionTypes.DELETE_ROLE_PERMISSION});
}


/**_______________________________ GET ROLE PERMISSION DATA  _________________________________________ */

interface IGetRolePermissionsList {
    type: ActionTypes.GET_ROLE_PERMISSIONS;
}
interface IGetRolePermissionsListSuccess {
    type: ActionTypes.GET_ROLE_PERMISSIONS_SUCCESS;
    payload: any
}
interface IGetRolePermissionsListFailed {
    type: ActionTypes.GET_ROLE_PERMISSIONS_FAILED;
}

export const GetRolePermissionsList = (): ThunkResult<void> => async dispatch => {
    handleGetRolePermissionsList(dispatch);
    api.Settings().GetRolePermissionsList()
    .then(response => {
        handleGetRolePermissionsListSuccess(dispatch, response.data);
    })
    .catch(err => {

        handleGetRolePermissionsListFailed(dispatch);
    })
};

export const handleGetRolePermissionsListSuccess = (dispatch:Dispatch<IGetRolePermissionsListSuccess>, response: any[]) => {
    dispatch({type: ActionTypes.GET_ROLE_PERMISSIONS_SUCCESS, payload: response});
}
export const handleGetRolePermissionsListFailed = (dispatch:Dispatch<IGetRolePermissionsListFailed>) => {
    dispatch({type: ActionTypes.GET_ROLE_PERMISSIONS_FAILED});
}
export const handleGetRolePermissionsList = (dispatch:Dispatch<IGetRolePermissionsList>) => {
    dispatch({type: ActionTypes.GET_ROLE_PERMISSIONS});
}

/**_______________________________ UPDATE ROLE PERMISSION DATA  _________________________________________ */

interface IUpdateRolePermission {
    type: ActionTypes.UPDATE_ROLE_PERMISSIONS;
}
interface IUpdateRolePermissionSuccess {
    type: ActionTypes.UPDATE_ROLE_PERMISSIONS_SUCCESS;
    payload: any
}
interface IUpdateRolePermissionFailed {
    type: ActionTypes.UPDATE_ROLE_PERMISSIONS_FAILED;
}

export const UpdateRolePermissions = (data: any): ThunkResult<void> => async dispatch => {
    handleUpdateRolePermission(dispatch);
    api.Settings().UpdateRolePermissions(data)
    .then(response => {
        handleUpdateRolePermissionSuccess(dispatch, response.data);
    })
    .catch(err => {
        handleUpdateRolePermissionFailed(dispatch);
    })
};

export const handleUpdateRolePermissionSuccess = (dispatch:Dispatch<IUpdateRolePermissionSuccess>, response: any[]) => {
    dispatch({type: ActionTypes.UPDATE_ROLE_PERMISSIONS_SUCCESS, payload: response});
}
export const handleUpdateRolePermissionFailed = (dispatch:Dispatch<IUpdateRolePermissionFailed>) => {
    dispatch({type: ActionTypes.UPDATE_ROLE_PERMISSIONS_FAILED});
}
export const handleUpdateRolePermission = (dispatch:Dispatch<IUpdateRolePermission>) => {
    dispatch({type: ActionTypes.UPDATE_ROLE_PERMISSIONS});
}

/**_______________________________ UPDATE form DATA  _________________________________________ */

interface IUpdateForm {
    type: ActionTypes.UPDATE_FORM_NAME;
}
interface IUpdateFormSuccess {
    type: ActionTypes.UPDATE_FORM_NAME_SUCCESS;
    payload: any
}
interface IUpdateFormFailed {
    type: ActionTypes.UPDATE_FORM_NAME_FAILED;
}

export const UpdateFormName = (data: any): ThunkResult<void> => async dispatch => {
    handleUpdateForm(dispatch);
    api.Settings().UpdateForm(data)
    .then(response => {

        handleUpdateFormSuccess(dispatch, response.data);
    })
    .catch(err => {
        handleUpdateFormFailed(dispatch);
    })
};

export const handleUpdateFormSuccess = (dispatch:Dispatch<IUpdateFormSuccess>, response: any[]) => {
    dispatch({type: ActionTypes.UPDATE_FORM_NAME_SUCCESS, payload: response});
}
export const handleUpdateFormFailed = (dispatch:Dispatch<IUpdateFormFailed>) => {
    dispatch({type: ActionTypes.UPDATE_FORM_NAME_FAILED});
}
export const handleUpdateForm = (dispatch:Dispatch<IUpdateForm>) => {
    dispatch({type: ActionTypes.UPDATE_FORM_NAME});
}
/**_______________________________ UPDATE Persona PERMISSION DATA  _________________________________________ */

interface IUpdatePersonaPermission {
    type: ActionTypes.UPDATE_PERSONA_PERMISSIONS;
}
interface IUpdatePersonaPermissionSuccess {
    type: ActionTypes.UPDATE_PERSONA_PERMISSIONS_SUCCESS;
    payload: any
}
interface IUpdatePersonaPermissionFailed {
    type: ActionTypes.UPDATE_PERSONA_PERMISSIONS_FAILED;
}

export const UpdatePersonaPermissions = (data: any): ThunkResult<void> => async dispatch => {
    handleUpdatePersonaPermission(dispatch);
    api.Settings().UpdatePersonaPermissions(data)
    .then(response => {
        handleUpdatePersonaPermissionSuccess(dispatch, response.data);
    })
    .catch(err => {
        handleUpdatePersonaPermissionFailed(dispatch);
    })
};

export const handleUpdatePersonaPermissionSuccess = (dispatch:Dispatch<IUpdatePersonaPermissionSuccess>, response: any[]) => {
    dispatch({type: ActionTypes.UPDATE_PERSONA_PERMISSIONS_SUCCESS, payload: response});
}
export const handleUpdatePersonaPermissionFailed = (dispatch:Dispatch<IUpdatePersonaPermissionFailed>) => {
    dispatch({type: ActionTypes.UPDATE_PERSONA_PERMISSIONS_FAILED});
}
export const handleUpdatePersonaPermission = (dispatch:Dispatch<IUpdatePersonaPermission>) => {
    dispatch({type: ActionTypes.UPDATE_PERSONA_PERMISSIONS});
}
export type SettingsActions = 
| GetRoles
| GetPersonas
| GetRolesFailed
| GetPersonasFailed
| AddFormName
| AddFormNameFailed
| GetForms
| GetFormsFailed
| AddFormNameSuccess
| CreatePersonaPermissionsFailed
| CreatePersonaPermissionsSuccess
| CreatePersonaPermissions
| CreateRolePermissionsFailed
| CreateRolePermissionsSuccess
| CreateRolePermissions
| IGetPersonaPermissionsList
| IGetPersonaPermissionsListFailed
| IGetPersonaPermissionsListSuccess
| IGetRolePermissionsList
| IGetRolePermissionsListFailed
| IGetRolePermissionsListSuccess
| IDeletePersonaPermission
| IDeletePersonaPermissionFailed
| IDeletePersonaPermissionSuccess
| GetRolesByPersona
| GetRolesByPersonaFailed
| IUpdateRolePermission
| IUpdateRolePermissionFailed
| IUpdateRolePermissionSuccess
| IDeleteForm
| IDeleteFormSuccess
| IDeleteFormFailed
| IDeleteRolePerm
| IDeleteRolePermSuccess
| IDeleteRolePermFailed
| IUpdateFormSuccess
| IUpdateFormFailed
| IUpdateForm
| IUpdatePersonaPermission
| IUpdatePersonaPermissionSuccess
| IUpdatePersonaPermissionFailed
