import { DeviceActionTypes, DeviceAction } from '../action/device';
import { Idevice, IErrorCode } from '../interface';
import { Reducer } from 'redux';
import Devices from 'views/Devices';
export interface deviceState {
    devices: any[];
    isAddingDevice: boolean;
    isGettingDevices: boolean;
    // usageReport: any;
    // isFetchingUsageReport: boolean;
    devicesBatchList: any[];
    isUploadingBOM: boolean;
    errorCodes: any[];
    isGettingErrorCode: boolean,
    // alarmReportData: any[];
    // maintenanceReportData: any[];
    // inverterData: any[];
    // energyConsumptionReportData: any[];
    isUpdatingErrorCode?: boolean;
    // isGettingErrorCode?: boolean;
    // isGettingAlarmsReport?: boolean;
    // isGettingMaintenanceReport?: boolean;
    isUploadingFirmware?:boolean;
    // isGettingInverterDetails?:boolean;
    // isGettingEnergyDetails?:boolean;
    deviceList: any[], // For Devices Dropdown

}
const initialState = {
    devices: [],
    isAddingDevice: false,
    isGettingDevices: false,
    // usageReport: null,
    // isFetchingUsageReport: false,
    devicesBatchList: [],
    isUploadingBOM: false,
    errorCodes:[],
    // alarmReportData:[],
    // inverterData:[],
    // maintenanceReportData:[],
    // energyConsumptionReportData: [],
    deviceList: [],
    isUploadingFirmware: false,
    isUpdatingErrorCode: false,
    isGettingErrorCode: false,
    // isGettingAlarmsReport:false,
    // isGettingMaintenanceReport:false,
    // isGettingInverterDetails:false,
    // isGettingEnergyDetails:false,
  
}

export const deviceReducer: Reducer<deviceState, DeviceAction> = (state = initialState, action) => {
    let clone = { ...state };
    switch (action.type) {
        case DeviceActionTypes.ADD_DEVICE:
            return {
                ...state,
                isAddingDevice: true
            }
        case DeviceActionTypes.ADD_DEVICE_SUCCESS:
            return {
                ...state,
                // devices: action.payload,
                isAddingDevice: false
            }
        case DeviceActionTypes.ADD_DEVICE_FAILED:
            return {
                ...state,
                isAddingDevice: false
            }
        case DeviceActionTypes.GET_ALL_DEVICES_SUCCESS:
            return {
                ...state,
                devices: action.payload,
                isGettingDevices: false
            }
        case DeviceActionTypes.GET_ALL_DEVICES_FAILED:
            return {
                ...state,
                isGettingDevices: false
            }
        case DeviceActionTypes.GET_ALL_DEVICES:
            return {
                ...state,
                isGettingDevices: true
            }
        case DeviceActionTypes.UPDATE_DEVICE:
            let toBeUpdateItem = action.payload;
            clone.devices = clone.devices.map(device => {
                if (device.id == toBeUpdateItem.id) {

                    device.name = toBeUpdateItem.deviceName;

                }
                return device;
            })
            return {
                ...clone,
                isAddingDevice: true
            }
        case DeviceActionTypes.UPDATE_DEVICE_SUCCESS:
            return {
                ...state,
                isAddingDevice: false
            }
        case DeviceActionTypes.ADD_DEVICE_FAILED:
            return {
                ...state,
                isAddingDevice: false
            }

        case DeviceActionTypes.GET_DEVICE_BATCH:
            return {
                ...state
            }

        case DeviceActionTypes.GET_DEVICE_BATCH_SUCCESS:
            return {
                ...state,
                devicesBatchList: action.payload
            }
        case DeviceActionTypes.UPLOAD_BOM:
            return {
                ...state,
                isUploadingBOM:true
            }

        case DeviceActionTypes.UPLOAD_BOM_SUCCESS:
            return {
                ...state,
                isUploadingBOM:false
            }
        case DeviceActionTypes.UPLOAD_BOM_FAILED:
            return {
                ...state,
                isUploadingBOM:false
            }
        case DeviceActionTypes.UPDATE_FIRMWARE:
            return {
                ...state,
                isUploadingFirmware:true
            }

        case DeviceActionTypes.UPDATE_FIRMWARE_SUCCESS:
            return {
                ...state,
                isUploadingFirmware:false
            }
        case DeviceActionTypes.UPDATE_FIRMWARE_FAILED:
            return {
                ...state,
                isUploadingFirmware:false
            }

        case DeviceActionTypes.GET_ERROR_CODES:
            return {
                ...state,
                isGettingErrorCode:true
            }

        case DeviceActionTypes.GET_ERROR_CODES_SUCCESS:
            return {
                ...state,
                errorCodes: action.payload,
                isGettingErrorCode:false
            }
        case DeviceActionTypes.GET_ERROR_CODES_FAILED:
            return {
                ...state,
                isGettingErrorCode:false
            }
        case DeviceActionTypes.UPDATE_ERROR_CODE_SUCCESS:
            let updatedErrorCode = action.payload;
            clone.devices = clone.errorCodes.map(item => {
                if (item.code == updatedErrorCode.code) {

                    item.description = updatedErrorCode.description;
                    item.reasonAnalysis = updatedErrorCode.reasonAnalysis;

                }
                return item;
            })
            return {
                ...clone,
                isUpdatingErrorCode:false
            }
        case DeviceActionTypes.UPDATE_ERROR_CODE:
            return {
                ...state,
                isUpdatingErrorCode:true
            }

        case DeviceActionTypes.UPDATE_ERROR_CODE_FAILED:
            return {
                ...state,
                isUpdatingErrorCode:false
            }
        case DeviceActionTypes.GET_DEVICES_LIST_SUCCESS:
            return {
                ...state,
                deviceList: action.payload,
                // isGettingDevices: false
            }
        case DeviceActionTypes.GET_DEVICES_LIST_FAILED:
            return {
                ...state,
                // isGettingDevices: false
            }
        case DeviceActionTypes.GET_DEVICES_LIST:
            return {
                ...state,
                // isGettingDevices: true
            }
        default:
            return state;
    }
} 