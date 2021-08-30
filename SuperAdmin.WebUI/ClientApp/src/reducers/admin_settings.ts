import { SettingsActions, ActionTypes } from '../action/admin_settings';
import { Reducer } from 'redux';
import { getPersonaPermissionsData, getRolePermissionsData, getFormNameFromID, getPersonaNameFromID, getRoleNameFromID } from 'utils';

export interface settingsState {
    roles: any[];
    persona_roles: any[];
    personas: any[];
    formNames: any[];
    rolePermissionList: any[];

    isCreatingPersona: boolean;
    personaPermissionsList: any[];
    isAddingFormName: boolean;
    isCreatingRolePermission: boolean;

}
const initialState = {
    persona_roles: [],
    roles: [],
    personas: [],
    formNames: [],
    rolePermissionList: [],
    isCreatingPersona: false,
    isAddingFormName: false,
    isCreatingRolePermission: false,

    personaPermissionsList: [

    ]
}

export const settingsReducer: Reducer<settingsState, SettingsActions> = (state = initialState, action) => {
    let data = '' as any;
    let personaPermissionsList = [];
    let rolePermissionList = [];
    let clone = {...state};
    let afterDelete = []
    switch (action.type) {
        case ActionTypes.GET_ROLES:
            if (!Array.isArray(action.payload))
                data = [] as any[]
            else
                data = action.payload

            rolePermissionList = getRolePermissionsData(state.rolePermissionList, state.formNames, data);

            return {
                ...state,
                roles: data
            }

        case ActionTypes.GET_ROLES_FAILED:
            return {
                ...state,
                roles: []
            }
        case ActionTypes.GET_ROLES_BY_PERSONA:
            if (!Array.isArray(action.payload))
                data = [] as any[]
            else
                data = action.payload

            return {
                ...state,
                persona_roles: data
            }
        case ActionTypes.GET_ROLES_BY_PERSONA_FAILED:
            return {
                ...state,
                persona_roles: []
            }

        case ActionTypes.GET_PERSONAS:
            if (!Array.isArray(action.payload))
                data = [] as any[]
            else
                data = action.payload

            personaPermissionsList = getPersonaPermissionsData(state.personaPermissionsList, state.formNames, data);

            return {
                ...state,
                personas: data,
                personaPermissionsList
            }
        case ActionTypes.GET_PERSONAS_FAILED:
            return {
                ...state,
                personas: []
            }
        case ActionTypes.GET_FORMS:
            if (!Array.isArray(action.payload))
                data = [] as any[]
            else
                data = action.payload
            personaPermissionsList = getPersonaPermissionsData(state.personaPermissionsList, data, state.personas);
            rolePermissionList = getRolePermissionsData(state.rolePermissionList, data, state.roles);
            return {
                ...state,
                formNames: data,
                personaPermissionsList,
                rolePermissionList
            }

        case ActionTypes.GET_FORMS_FAILED:
            return {
                ...state,
                formNames: []
            }

        case ActionTypes.ADD_FORM_NAME:
            return {
                ...state,
                isAddingFormName: true
            }
        case ActionTypes.ADD_FORM_NAME_SUCCESS:

            return {
                ...state,
                formNames: [...state.formNames, action.payload],
                isAddingFormName: false,
            }
        case ActionTypes.ADD_FORM_NAME_FAILED:
            return {
                ...state,
                isAddingFormName: false,
            }


        case ActionTypes.CREATE_PERSONA_PERMISSIONS:
            return {
                ...state,
                isCreatingPersona: true

            }
        case ActionTypes.CREATE_PERSONA_PERMISSIONS_SUCCESS:
            let personaObj = {
                formId: action.payload.Form.id,
                formName: action.payload.Form.name,
                personaId: action.payload.Persona.id,
                personaName: action.payload.Persona.name
            }
            return {
                ...state,
                isCreatingPersona: false,
                personaPermissionsList: [...state.personaPermissionsList, personaObj]
            }
        case ActionTypes.CREATE_PERSONA_PERMISSIONS_FAILED:
            return {
                ...state,
                isCreatingPersona: false
            }

        case ActionTypes.CREATE_ROLE_PERMISSIONS:
            return {
                ...state,
                isCreatingRolePermission: true,
            }
        case ActionTypes.CREATE_ROLE_PERMISSIONS_SUCCESS:

            let rolePermission = action.payload
            // Mapping FormName and RoleName
            rolePermission.formName = getFormNameFromID(rolePermission.formId, clone.formNames)
            rolePermission.roleName = getRoleNameFromID(rolePermission.roleId, clone.roles)
            return {
                ...state,
                isCreatingRolePermission: false,
                rolePermissionList: [...state.rolePermissionList, rolePermission]
            }
        case ActionTypes.CREATE_ROLE_PERMISSIONS_FAILED:
            return {
                ...state,
                isCreatingRolePermission: false
            }
        case ActionTypes.GET_PERSONA_PERMISSIONS:
            return {
                ...state,
            }
        case ActionTypes.GET_PERSONA_PERMISSIONS_SUCCESS:
            if (!Array.isArray(action.payload))
                data = [] as any[]
            else
                data = action.payload

            data = getPersonaPermissionsData(data, state.formNames, state.personas);
            return {
                ...state,
                personaPermissionsList: data,
            }
        case ActionTypes.GET_PERSONA_PERMISSIONS_FAILED:
            return {
                ...state,
                personaPermissionsList: []
            }
        case ActionTypes.GET_ROLE_PERMISSIONS:
            return {
                ...state,
            }
        case ActionTypes.GET_ROLE_PERMISSIONS_SUCCESS:

            if (!Array.isArray(action.payload))
                data = [] as any[]
            else
                data = action.payload

            data = getRolePermissionsData(data, state.formNames, state.roles);
            return {
                ...state,
                rolePermissionList: data,
            }
        case ActionTypes.GET_ROLE_PERMISSIONS_FAILED:
            return {
                ...state,
                rolePermissionList: []
            }
        case ActionTypes.DELETE_PERSONA_PERMISSION:
            return {
                ...state,
            }
        case ActionTypes.DELETE_PERSONA_PERMISSION_SUCCESS:
            afterDelete = state.personaPermissionsList.filter((item: any) => item.id != action.payload);
            return {
                ...state,
                personaPermissionsList: afterDelete,
            }
        case ActionTypes.DELETE_PERSONA_PERMISSION_FAILED:
            return {
                ...state
            }
        case ActionTypes.UPDATE_ROLE_PERMISSIONS_SUCCESS:
             
            let toBeUpdateItem = action.payload;    
            clone.rolePermissionList = clone.rolePermissionList.map(permission =>{
                // additional fields which are modal can be added here 
                if(permission.id == toBeUpdateItem.id)
                {
                    permission.canView = toBeUpdateItem.canView;
                    permission.canInsert = toBeUpdateItem.canInsert;
                    permission.canUpdate = toBeUpdateItem.canUpdate;
                    permission.canDelete = toBeUpdateItem.canDelete;
                    permission.canExport = toBeUpdateItem.canExport;
                }    
                return permission;
            })
            return{
                ...clone,
            }
        case ActionTypes.UPDATE_ROLE_PERMISSIONS_FAILED:
            return{
                ...state,
            }
        case ActionTypes.UPDATE_ROLE_PERMISSIONS:
            return {
                ...state,
            }
        case ActionTypes.UPDATE_FORM_NAME_SUCCESS:
             
            let form_Item = action.payload;    
            clone.formNames = clone.formNames.map(form =>{
                // additional fields which are modal can be added here 
                if(form.id == form_Item.id)
                {
                    form.formName = form_Item.formName
                }    
                return form;
            })
            return{
                ...clone,
            }
        case ActionTypes.UPDATE_FORM_NAME_FAILED:
            return{
                ...state,
            }
        case ActionTypes.UPDATE_FORM_NAME:
            return {
                ...state,
            }
        case ActionTypes.UPDATE_PERSONA_PERMISSIONS_SUCCESS:
            let persona_Item = action.payload;    
            clone.personaPermissionsList = clone.personaPermissionsList.map(persona =>{
                // additional fields which are modal can be added here 
                if(persona.id == persona_Item.id)
                {
                    persona.formId = persona_Item.formId;
                    persona.personaId = persona_Item.personaId;
                    persona.formName = getFormNameFromID(persona_Item.formId,clone.formNames);
                    persona.personaName = getPersonaNameFromID(persona_Item.personaId, clone.personas);

                }
                return persona;
            })
            return{
                ...clone,
            }
        case ActionTypes.UPDATE_PERSONA_PERMISSIONS_FAILED:
            return{
                ...state,
            }
        case ActionTypes.UPDATE_PERSONA_PERMISSIONS:
            return {
                ...state,
            }
        case ActionTypes.DELETE_FORM:
            return {
                ...state,
            }
        case ActionTypes.DELETE_FORM_SUCCESS:
            afterDelete = state.formNames.filter((item: any) => item.id != action.payload);
            return {
                ...state,
                formNames: afterDelete,
            }
        case ActionTypes.DELETE_FORM_FAILED:
            return {
                ...state
            }
        case ActionTypes.DELETE_ROLE_PERMISSION:
            return {
                ...state,
            }
        case ActionTypes.DELETE_ROLE_PERMISSION_SUCCESS:
            afterDelete = state.rolePermissionList.filter((item: any) => item.id != action.payload);
            return {
                ...state,
                rolePermissionList: afterDelete,
            }
        case ActionTypes.DELETE_ROLE_PERMISSION_FAILED:
            return {
                ...state
            }
        default:
            return state;
    }
} 