import axios from "axios";
import { getToken } from "utils"
import UsageReport from "views/UsageReport";
const baseUrl = window.location.origin + "/api/";

let token = getToken();
export default {
    Authenticate(url = baseUrl + 'User/authenticate/') {
        return {
            Authenticate: (UserCredentails: any) => axios.post(url, UserCredentails),
        }
    },
    Company(url = baseUrl + 'Company/') {
        token = getToken();
        return {
            CreateCompany: (CompanyData: any) => axios.post(url + 'create/', CompanyData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            CreateUserProfile: (data: any) => axios.post(url + `CreateCustomerUser/${data.userId}/${data.customerId}/${data.roleType}/${data.firstName}/${data.lastName}/${data.emailAddress}/${data.lang}`,data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
            getAllCompanies: () => axios.get(url + 'getAllCompanies/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            UpdateCompany: (CompanyData: any) => axios.post(url + 'update', CompanyData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            GetCustomerList: () => axios.get(url + 'getCompanyList/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
        }
    },
    Settings(url = baseUrl) {
        token = getToken();
        return {

            GetRolesList: () => axios.get(url + 'User/GetRoles/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            GetRolesListByPersona: (persona:any) => axios.get(url + `User/GetRoleByPersona/${persona}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            GetCustomerTypes: () => axios.get(url + 'Company/GetPersonas/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            addFormName: (formName: any) => axios.post(url + 'User/CreateForm/'+formName, formName, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            GetFormTypes: () => axios.get(url + 'User/GetForm/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            GetPersonaPermissionsList: () => axios.get(url + 'Company/GetPersonaPermission', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            GetRolePermissionsList: () => axios.get(url + 'User/GetRolePermission', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            CreatePersonaPermissions: (data: any) => axios.post(`${url}Company/CreatePersonaPermission`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            DeletePersonaPermission: (data: any) => axios.post(`${url}Company/DeletePersonaPermission/${data}`,data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            DeleteForm: (data: any) => axios.post(`${url}User/DeleteForm/${data}`,data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            DeleteRolePermissions: (data: any) => axios.post(`${url}User/DeleteRolePermission/${data}`,data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            CreateRolePermissions: (data: any) => axios.post(`${url}User/CreateRolePermission`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            UpdateRolePermissions: (data: any) => axios.post(`${url}User/UpdateRolePermission`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            UpdateForm: (data: any) => axios.post(`${url}User/UpdateForm/${data.formId}/${data.formName}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            UpdatePersonaPermissions: (data: any) => axios.post(`${url}Company/UpdatePersonaPermission`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),


        }
    },
    Device(url = baseUrl + 'Device/') {
        token = getToken();
        return {
            AddDevice: (deviceData: any) => axios.post(url + 'addDevices/', deviceData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            getDevices: () => axios.get(url + 'getAllDevices/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            // UsageReport: (data: any) => axios.get(url + 'UsageReport/' + data.companyName + '/mshafiq@xavor.com/' + data.deviceId + '/' + data.date + '/7', {
            //     headers: {
            //         'Authorization': `Bearer ${token}`
            //     }
            // }),
            UpdateDevice: (deviceData: any) => axios.post(url + 'updatedevice', deviceData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            GetDeviceBatchList: () => axios.get(url + 'getdeviceBatchNumber', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            UploadBOM: (data: any, formData: any) => axios.post(url + `uploadBom/${data.companyId}/${data.deviceBatch}/${data.fileformat}/${data.bomType}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data'
                }
            }),

            UpdateFirmware: (data: any, formData: any) => axios.post(url + `updateFirmware/${data.companyId}/${data.deviceBatch}/${data.fileformat}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data'
                }
            }),

            GetErrorCodes: () => axios.get(url + `getAllAlarmWarning`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),

            UpdateErrorCode: (data: any) => axios.post(url + 'updateAlarmWarning', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),

            // GetAlarmAndWarningReportData: (data: any) => axios.get(url + `AlarmWarningReport/${data.customerId}/${data.batchId}/${data.deviceId}/${data.date}`, {
            //     headers: {
            //         'Authorization': `Bearer ${token}`
            //     }
            // }),
            // GetMaintenanceReport: (data: any) => axios.get(url + `MaintenanceReport/${data.customerId}/${data.batchId}/${data.deviceId}/${data.date}`, {
            //     headers: {
            //         'Authorization': `Bearer ${token}`
            //     }
            // }),

            // GetInverterDetails: (data: any) => axios.get(url + `DeviceAlarmHistory/${data.customerId}/${data.deviceId}`, {
            //     headers: {
            //         'Authorization': `Bearer ${token}`
            //     }
            // }),

            // GetEnergyConsumptionReport: (data: any) => axios.get(url + `DeviceConsumptionReport/${data.customerId}/${data.deviceId}/${data.date}`, {
            //     headers: {
            //         'Authorization': `Bearer ${token}`
            //     }
            // }), 
            GetDeviceList: () => axios.get(url + 'getDeviceList/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })       
        }
    },
    UserProfile(url = baseUrl + 'User/'){
        return {
            GetUsers: (customerId: any) => axios.get(url + 'GetUsers/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params:{
                    customerId: customerId
                }
            }),
            UpdateUser: (data: any) => axios.post(url + 'UpdateUser/', data ,{
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }),
            UpdatePassword: (data: any) => axios.post(url + 'ResetPassword/', data ,{
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }),
            UpdateMyPassword: (data: any) => axios.post(url + 'UpdateUserPassword/', data ,{
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }),
        }
    },
    Dashboard(url = baseUrl + 'Dashboard/') {
        token = getToken();
        return {
            UsageReport: (data: any) => axios.get(url + 'UsageReport/' + data.customerId + '/' + data.userId,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            GetAlarmAndWarningReportData: (data: any) => axios.get(url + `AlarmWarningReport/${data.customerId}/${data.batchId}/${data.deviceId}/${data.date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            GetMaintenanceReport: (data: any) => axios.get(url + `MaintenanceReport/${data.customerId}/${data.date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),

            GetInverterDetails: (data: any) => axios.get(url + `DeviceAlarmHistory/${data.customerId}/${data.deviceId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),

            GetEnergyConsumptionReport: (data: any) => axios.get(url + `EnergyData/${data.customerId}/${data.batchId}/${data.deviceId}/${data.date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            GetStats: (data:any) => axios.get(url + `getDeviceStats?customerId=${data.customerId}&userId=${data.userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),

        }
    },
    Report(url = baseUrl + 'Report/') {
        token = getToken();
        return {
            UsageReport: (data: any) => axios.get(url + 'UsageReport/' + data.selectedCustomerId + '/'+ data.emailId +'/' + data.deviceId + '/' + data.date + '/'+ data.days, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            GetAlarmAndWarningReportData: (data: any) => axios.get(url + `AlarmWarningReport/${data.customerId}/${data.batchId}/${data.deviceId}/${data.date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            GetMaintenanceReport: (data: any) => axios.get(url + `MaintenanceReport/${data.customerId}/${data.batchId}/${data.deviceId}/${data.date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),

            GetInverterDetails: (data: any) => axios.get(url + `DeviceAlarmHistory/${data.customerId}/${data.deviceId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),

            GetEnergyConsumptionReport: (data: any) => axios.get(url + `DeviceConsumptionReport/${data.customerId}/${data.deviceId}/${data.date}`, { // removed ${data.batchId}/
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            ExportUsageReport: (data: any) => axios.post(url + 'exportUsageReport/' + data.selectedCustomerId + '/'+ data.emailId +'/' + data.deviceId + '/' + data.date + '/'+data.days, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
        }
    },

}