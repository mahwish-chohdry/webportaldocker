import { Reducer } from 'redux';
import { CompanyAction, CompanyActionTypes, getAllCompanies } from './../action/company';
import { ICompany } from './../interface';
import _ from 'lodash';

export interface CompanyState { 
    Companies: ICompany[];
    CompaniesList: any[]; //List used in dropdowns
    isAddingCompany: boolean;
    isGettingCompanies: boolean;
    isAddingUserProfile: boolean;
}
const initialState = {
    Companies: [],
    CompaniesList: [],
    isAddingCompany: false,
    isAddingUserProfile: false,
    isGettingCompanies: false
}
export const CompanyReducer: Reducer<CompanyState, CompanyAction> = (state = initialState, action) => {
    switch(action.type){      
        case CompanyActionTypes.ADD_COMPANY:
            return{
                ...state,
                isAddingCompany: true
            }
        case CompanyActionTypes.ADD_COMPANY_SUCCESS:
            return{
                ...state,
               // Companies: [...state.Companies, action.payload],
                isAddingCompany: false
            }
        case CompanyActionTypes.ADD_COMPANY_FAILED:
            return{
                ...state,
                isAddingCompany: false
            }
        case CompanyActionTypes.ADD_USER_PROFILE:
            return{
                ...state,
                isAddingUserProfile: true
            }
        case CompanyActionTypes.ADD_USER_PROFILE_FAILED:
            return{
                ...state,
                isAddingUserProfile: false
            }
        case CompanyActionTypes.ADD_USER_PROFILE_SUCESS:
            return{
                ...state,
                isAddingUserProfile: false
            }
            
        case CompanyActionTypes.UPDATE_COMPANY:
            // Updating Companies List
            let companiesClone = _.cloneDeep(state.Companies)
            let toBeUpdateItem = action.payload;  
            companiesClone = companiesClone.map(company =>{
                // additional fields which are modal can be added here 
                if(company.id == toBeUpdateItem.id)
                {
                    company.address = toBeUpdateItem.address;
                    company.name = toBeUpdateItem.name;
                    company.customerType = toBeUpdateItem.customerType;
                }    
                return company;
            })

            //Upating Companies List - this list is used for dropdowns
            let companiesListClone = _.cloneDeep(state.CompaniesList) 
            companiesListClone = companiesListClone.map(company =>{
                // additional fields which are modal can be added here 
                if(company.id == toBeUpdateItem.id)
                {
                    company.address = toBeUpdateItem.address;
                    company.name = toBeUpdateItem.name;
                    company.customerType = toBeUpdateItem.customerType;
                }    
                return company;
            })

            return{
                ...state,
                Companies: companiesClone,
                CompaniesList: companiesListClone,
            }

        case CompanyActionTypes.UPDATE_COMPANY_FAILED:
            return{
                ...state,
                //isAddingCompany: true
            }
        case CompanyActionTypes.UPDATE_COMPANY_SUCCESS:
            return {
                ...state,
               // Companies: action.payload
            }
        case CompanyActionTypes.GET_ALL_COMPANIES:
            return {
                ...state,
                isGettingCompanies: true
            }
        case CompanyActionTypes.GET_ALL_COMPANIES_SUCCESS:
            return {
                ...state,
                Companies: action.payload,
                isGettingCompanies: false
            }
        case CompanyActionTypes.GET_ALL_COMPANIES_FAILED:
            return {
                ...state,
                isGettingCompanies: false
            }
        // List for Customer Dropdowns
        case CompanyActionTypes.GET_COMPANIES_LIST:
            return {
                ...state,
                // isGettingCompanies: true
            }
        case CompanyActionTypes.GET_COMPANIES_LIST_SUCCESS:
            return {
                ...state,
                CompaniesList: action.payload,
                // isGettingCompanies: false
            }
        case CompanyActionTypes.GET_COMPANIES_LIST_FAILED:
            return {
                ...state,
                // isGettingCompanies: false
            }
        default:
            return state;
    }
} 