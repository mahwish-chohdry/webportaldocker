import { Dispatch } from 'redux';
import api from './api';
import { ThunkResult, handleLoader } from './login';
import { Idevice, IErrorCode } from './../Interface';
import { handleAddDeviceAlert, handleGetUsageReportStatus } from './alerts';
import { toast } from 'react-toastify';
import { reportNames } from 'constants/index';

export enum DeviceActionTypes {
    ADD_DEVICE = 'ADD_DEVICE',
    ADD_DEVICE_SUCCESS = 'ADD_DEVICE_SUCCESS',
    ADD_DEVICE_FAILED = 'ADD_DEVICE_FAILED',

    GET_ALL_DEVICES = 'GET_ALL_DEVICES',
    GET_ALL_DEVICES_SUCCESS = 'GET_ALL_DEVICES_SUCCESS',
    GET_ALL_DEVICES_FAILED = 'GET_ALL_DEVICES_FAILED',

    // GET_ALL_USAGEREPORT = 'GET_ALL_USAGEREPORT',
    // GET_ALL_USAGEREPORT_SUCCESS = 'GET_ALL_USAGEREPORT_SUCCESS',
    // GET_ALL_USAGEREPORT_FAILED = 'GET_ALL_USAGEREPORT_FAILED',

    UPDATE_DEVICE = 'UPDATE_DEVICE',
    UPDATE_DEVICE_SUCCESS = 'UPDATE_DEVICE_SUCCESS',
    UPDATE_DEVICE_FAILED = 'UPDATE_DEVICE_FAILED',


    UPLOAD_BOM = 'UPLOAD_BOM',
    UPLOAD_BOM_SUCCESS = 'UPLOAD_BOM_SUCCESS',
    UPLOAD_BOM_FAILED = 'UPLOAD_BOM_FAILED',


    UPDATE_FIRMWARE = 'UPDATE_FIRMWARE',
    UPDATE_FIRMWARE_SUCCESS = 'UPDATE_FIRMWARE_SUCCESS',
    UPDATE_FIRMWARE_FAILED = 'UPDATE_FIRMWARE_FAILED',


    GET_DEVICE_BATCH = 'GET_DEVICE_BATCH',
    GET_DEVICE_BATCH_SUCCESS = 'GET_DEVICE_BATCH_SUCCESS',
    GET_DEVICE_BATCH_FAILED  = 'GET_DEVICE_BATCH_FAILED',


    GET_ERROR_CODES = 'GET_ERROR_CODES',
    GET_ERROR_CODES_SUCCESS = 'GET_ERROR_CODES_SUCCESS',
    GET_ERROR_CODES_FAILED  = 'GET_ERROR_CODES_FAILED',


    UPDATE_ERROR_CODE = 'UPDATE_ERROR_CODE',
    UPDATE_ERROR_CODE_SUCCESS = 'UPDATE_ERROR_CODE_SUCCESS',
    UPDATE_ERROR_CODE_FAILED = 'UPDATE_ERROR_CODE_FAILED',


    // GET_ALARMS_REPORT = 'GET_ALARMS_REPORT',
   
    // GET_ALARMS_REPORT_SUCCESS = 'GET_ALARMS_REPORT_SUCCESS',
    // GET_ALARMS_REPORT_FAILED = 'GET_ALARMS_REPORT_FAILED',

    // GET_MAINTENANCE_REPORT = 'GET_MAINTENANCE_REPORT',
    // GET_MAINTENANCE_REPORT_SUCCESS = 'GET_MAINTENANCE_REPORT_SUCCESS',
    // GET_MAINTENANCE_REPORT_FAILED = 'GET_MAINTENANCE_REPORT_FAILED',



    // GET_INVERTER_DETAILS = 'GET_INVERTER_DETAILS',
    // GET_INVERTER_DETAILS_SUCCESS = 'GET_INVERTER_DETAILS_SUCCESS',
    // GET_INVERTER_DETAILS_FAILED = 'GET_INVERTER_DETAILS_FAILED',


    // GET_ENERGY_CONSUMPTION_DATA = 'GET_ENERGY_CONSUMPTION_DATA',
    // GET_ENERGY_CONSUMPTION_SUCCESS = 'GET_ENERGY_CONSUMPTION_SUCCESS',
    // GET_ENERGY_CONSUMPTION_FAILED = 'GET_ENERGY_CONSUMPTION_FAILED',

    CLEAR_REPORT_DATA = 'CLEAR_REPORT_DATA',

    GET_DEVICES_LIST = 'GET_DEVICES_LIST',
    GET_DEVICES_LIST_SUCCESS = 'GET_DEVICES_LIST_SUCCESS',
    GET_DEVICES_LIST_FAILED = 'GET_DEVICES_LIST_FAILED',
}


interface clearAlarmReportData {
    type: DeviceActionTypes.CLEAR_REPORT_DATA;
    payload: string;
}
// interface GetInverterDetails{
//     type: DeviceActionTypes.GET_INVERTER_DETAILS;
// }

// interface GetInverterDetailsSuccess {
//     type: DeviceActionTypes.GET_INVERTER_DETAILS_SUCCESS;
//     payload: any[];
// }
// interface GetInverterDetailsFailed {
//     type: DeviceActionTypes.GET_INVERTER_DETAILS_FAILED;
// }

interface GetAllErrorCodes{
    type: DeviceActionTypes.GET_ERROR_CODES;
}

interface GetAllErrorCodesSuccess {
    type: DeviceActionTypes.GET_ERROR_CODES_SUCCESS;
    payload: Idevice[];
}

interface GetAllErrorCodesFailed {
    type: DeviceActionTypes.GET_ERROR_CODES_FAILED;
}

// interface GetAlarmAndWarningReport{
//     type: DeviceActionTypes.GET_ALARMS_REPORT;
// }

// interface GetAlarmAndWarningReportSuccess {
//     type: DeviceActionTypes.GET_ALARMS_REPORT_SUCCESS;
//     payload: any[];
// }

// interface GetAlarmAndWarningReportFailed {
//     type: DeviceActionTypes.GET_ALARMS_REPORT_FAILED;
// }

// interface GetMaintenanceReport{
//     type: DeviceActionTypes.GET_MAINTENANCE_REPORT;
// }

// interface GetMaintenanceReportSuccess {
//     type: DeviceActionTypes.GET_MAINTENANCE_REPORT_SUCCESS;
//     payload: any[];
// }

// interface GetMaintenanceReportFailed {
//     type: DeviceActionTypes.GET_MAINTENANCE_REPORT_FAILED;
// }

interface UploadBOM {
    type: DeviceActionTypes.UPLOAD_BOM;
}

interface UploadBOMSuccess {
    type: DeviceActionTypes.UPLOAD_BOM_SUCCESS;
    payload?: any;
}

interface UploadBOMFailed {
    type: DeviceActionTypes.UPLOAD_BOM_FAILED;
    payload: any;
}

interface UpdateFirmware {
    type: DeviceActionTypes.UPDATE_FIRMWARE;
}

interface UpdateFirmwareSuccess {
    type: DeviceActionTypes.UPDATE_FIRMWARE_SUCCESS;
    payload?: any;
}

interface UpdateFirmwareFailed {
    type: DeviceActionTypes.UPDATE_FIRMWARE_FAILED;
    payload: any;
}

interface GetDeviceBatch {
    type: DeviceActionTypes.GET_DEVICE_BATCH;
}

interface GetDeviceBatchSuccess {
    type: DeviceActionTypes.GET_DEVICE_BATCH_SUCCESS;
    payload: any[];
}

interface AddDevice {
    type: DeviceActionTypes.ADD_DEVICE;
}

interface AddDeviceSuccess {
    type: DeviceActionTypes.ADD_DEVICE_SUCCESS;
    payload: Idevice[];
}

interface AddDeviceFailed {
    type: DeviceActionTypes.ADD_DEVICE_FAILED;
}

// interface GetUsageReport {
//     type: DeviceActionTypes.GET_ALL_USAGEREPORT;
// }

// interface GetUsageReportSuccess {
//     type: DeviceActionTypes.GET_ALL_USAGEREPORT_SUCCESS;
//     payload: any;
// }

// interface GetUsageReportFailed {
//     type: DeviceActionTypes.GET_ALL_USAGEREPORT_FAILED;
// }

interface GetAllDevices{
    type: DeviceActionTypes.GET_ALL_DEVICES;
}

interface GetAllDevicesSuccess {
    type: DeviceActionTypes.GET_ALL_DEVICES_SUCCESS;
    payload: Idevice[];
}

interface GetAllDevicesFailed {
    type: DeviceActionTypes.GET_ALL_DEVICES_FAILED;
}

interface UpdateDevice {
    type: DeviceActionTypes.UPDATE_DEVICE;
    payload: Idevice | any;
}

interface UpdateDeviceSuccess {
    type: DeviceActionTypes.UPDATE_DEVICE_SUCCESS;
    payload: Idevice[];
}

interface UpdateDeviceFailed {
    type: DeviceActionTypes.UPDATE_DEVICE_FAILED;
}

interface UpdateErrorCode {
    type: DeviceActionTypes.UPDATE_ERROR_CODE;
}

interface UpdateErrorCodeSuccess {
    type: DeviceActionTypes.UPDATE_ERROR_CODE_SUCCESS;
    payload: IErrorCode | any;
}

interface UpdateErrorCodeFailed {
    type: DeviceActionTypes.UPDATE_ERROR_CODE_FAILED;
}

interface GetDevicesList{
    type: DeviceActionTypes.GET_DEVICES_LIST;
}

interface GetDevicesListSuccess {
    type: DeviceActionTypes.GET_DEVICES_LIST_SUCCESS;
    payload: any[];
}

interface GetDevicesListFailed {
    type: DeviceActionTypes.GET_DEVICES_LIST_FAILED;
}


export const AddDevice = (data: any): ThunkResult<void> => async dispatch => {  
    handleAddDevice(dispatch);
    // handleLoader(dispatch,true)
    handleAddDeviceAlert(dispatch,'not assigned');
    api.Device().AddDevice(data)
    .then(response => {
        dispatch(getAllDevices())
        handleAddDeviceSuccess(dispatch, response.data.data);
        handleAddDeviceAlert(dispatch,'Success');
        // handleLoader(dispatch,false);
    })
    .catch(err => {
        handleAddDeviceFailed(dispatch);
        handleAddDeviceAlert(dispatch,'Failed');
        // handleLoader(dispatch,false)
    })
};

export const handleAddDevice = (dispatch:Dispatch<AddDevice>) => {
    dispatch({type: DeviceActionTypes.ADD_DEVICE});
}

export const handleAddDeviceSuccess = (dispatch:Dispatch<AddDeviceSuccess>, response: Idevice[] ) => {
    toast.success("Added Successfully!", {
            position: toast.POSITION.BOTTOM_RIGHT
          });
    dispatch({
        type: DeviceActionTypes.ADD_DEVICE_SUCCESS,
        payload: response
});
}
export const handleAddDeviceFailed = (dispatch:Dispatch<AddDeviceFailed>) => {
    toast.error("Failed!", {
        position: toast.POSITION.BOTTOM_RIGHT
    });

    dispatch({
        type: DeviceActionTypes.ADD_DEVICE_FAILED
});
}
/*____________________________ GET ALL Devices________________________________________ */
export const getAllDevices = (): ThunkResult<void> => async dispatch => {
    handleGetDevices(dispatch);
    handleLoader(dispatch,true)
    api.Device().getDevices()
    .then(response => {
        handleLoader(dispatch,false)
        handleGetDevicesSuccess(dispatch, response.data.data)
    })
    .catch(err => {
        handleLoader(dispatch,false)
        handleGetDevicesFailed(dispatch);
    })
};

export const handleGetDevices = (dispatch:Dispatch<GetAllDevices>) => {
    dispatch({
        type: DeviceActionTypes.GET_ALL_DEVICES
    });
}

export const handleGetDevicesSuccess = (dispatch:Dispatch<GetAllDevicesSuccess>, response: Idevice[] ) => {
    dispatch({
        type: DeviceActionTypes.GET_ALL_DEVICES_SUCCESS,
        payload: response
});
}
export const handleGetDevicesFailed = (dispatch:Dispatch<GetAllDevicesFailed>) => {
    dispatch({
        type: DeviceActionTypes.GET_ALL_DEVICES_FAILED
});
}


export const UpdateDevice = (data: any): ThunkResult<void> => async dispatch => {
    handleLoader(dispatch,true)
    api.Device().UpdateDevice(data)
    .then(response => {
        handleUpdateDevice(dispatch, data);
        handleUpdateDeviceSuccess(dispatch, response.data.data);
        handleLoader(dispatch,false);
    })
    .catch(err => {
        handleUpdateDeviceFailed(dispatch, err.response.data.message);
        handleLoader(dispatch,false)
    })
};

export const handleUpdateDevice = (dispatch:Dispatch<UpdateDevice>, data: any) => {
    dispatch({type: DeviceActionTypes.UPDATE_DEVICE, payload: data});
}

export const handleUpdateDeviceSuccess = (dispatch:Dispatch<UpdateDeviceSuccess>, response: Idevice[] ) => {
    toast.success("Added Successfully!", {
            position: toast.POSITION.BOTTOM_RIGHT
          });
    dispatch({
        type: DeviceActionTypes.UPDATE_DEVICE_SUCCESS,
        payload: response
});
}
export const handleUpdateDeviceFailed = (dispatch: Dispatch<UpdateDeviceFailed>, errorMessage: string) => {
    toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT
    });

    dispatch({
        type: DeviceActionTypes.UPDATE_DEVICE_FAILED
});
}

export const getDeviceBatchList = (): ThunkResult<void> => async dispatch => {
    handleGetDevicesBatch(dispatch);
    handleLoader(dispatch,true)
    api.Device().GetDeviceBatchList()
    .then(response => {
        handleLoader(dispatch,false)
        handleGetDevicesBatchSuccess(dispatch, response.data)
    })
    .catch(err => {
        handleLoader(dispatch,false)
    })
};

export const handleGetDevicesBatch = (dispatch:Dispatch<GetDeviceBatch>) => {
    dispatch({
        type: DeviceActionTypes.GET_DEVICE_BATCH
    });
}

export const handleGetDevicesBatchSuccess = (dispatch:Dispatch<GetDeviceBatchSuccess>, data: any[]) => {
    dispatch({
        type: DeviceActionTypes.GET_DEVICE_BATCH_SUCCESS,
        payload: data
    });
}

/** ____________________________________UPLOAD BOM________________________________________ */

export const uploadBOM = (data:any, file:any): ThunkResult<void> => async dispatch => {
    handleUploadBOM(dispatch);
    handleLoader(dispatch,true)
    handleAddDeviceAlert(dispatch,'not assigned');
     
    api.Device().UploadBOM(data, file)
    .then(response => {
        handleUploadBOMSuccess(dispatch, response.data.data);
        toast.success(`BOM Uploaded!`, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        // handleLoader(dispatch,false);
    })
    .catch(err => {
        console.log(err);
        //toast
        toast.error(`Failed!`, {
            position: toast.POSITION.BOTTOM_RIGHT
        });
        handleUploadBOMFailed(dispatch);
        // handleLoader(dispatch,false)
    })
};

export const handleUploadBOM = (dispatch:Dispatch<UploadBOM>) => {
    dispatch({
        type: DeviceActionTypes.UPLOAD_BOM
    });
}

export const handleUploadBOMSuccess = (dispatch:Dispatch<UploadBOMSuccess>, data: any[]) => {
    dispatch({
        type: DeviceActionTypes.UPLOAD_BOM_SUCCESS,
        payload: data
    });
}
export const handleUploadBOMFailed = (dispatch:Dispatch<UploadBOMFailed>) => {
    dispatch({
        type: DeviceActionTypes.UPLOAD_BOM_FAILED,
        payload: null
    });
}

/** ___________________________________UPDATE FIRMWARE ________________________________ */


export const updateFirmware = (data:any, file:any): ThunkResult<void> => async dispatch => {
    handleUpdateFirmware(dispatch);
    handleAddDeviceAlert(dispatch,'not assigned');
    api.Device().UpdateFirmware(data, file)
    .then(response => {
       handleUpdateFirmwareSuccess(dispatch, response.data.data);
        //toast 
        toast.success(`Firmware Updated!`, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
    })
    .catch(err => {
        handleUpdateFirmwareFailed(dispatch);
        //toast
        toast.error(`Failed!`, {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    })
};


export const handleUpdateFirmware = (dispatch:Dispatch<UpdateFirmware>) => {
    dispatch({
        type: DeviceActionTypes.UPDATE_FIRMWARE
    });
}

export const handleUpdateFirmwareSuccess = (dispatch:Dispatch<UpdateFirmwareSuccess>, data: any[]) => {
    dispatch({
        type: DeviceActionTypes.UPDATE_FIRMWARE_SUCCESS,
        payload: data
    });
}
export const handleUpdateFirmwareFailed = (dispatch:Dispatch<UpdateFirmwareFailed>) => {
    dispatch({
        type: DeviceActionTypes.UPDATE_FIRMWARE_FAILED,
        payload: null
    });
}

/** ____________________________________ERROR CODES________________________________ */

export const getAllErrorCodes = (): ThunkResult<void> => async dispatch => {
    handleGetAllErrorCodes(dispatch);
    handleLoader(dispatch,true)
    api.Device().GetErrorCodes()
    .then(response => {
        handleLoader(dispatch,false)
        handleGetAllErrorCodesSuccess(dispatch, response.data.data)
    })
    .catch(err => {
        handleLoader(dispatch,false)
        handleGetAllErrorCodesFailed(dispatch);
    })
};

export const handleGetAllErrorCodes = (dispatch:Dispatch<GetAllErrorCodes>) => {
    dispatch({
        type: DeviceActionTypes.GET_ERROR_CODES
    });
}

export const handleGetAllErrorCodesSuccess = (dispatch:Dispatch<GetAllErrorCodesSuccess>, response: Idevice[] ) => {
    dispatch({
        type: DeviceActionTypes.GET_ERROR_CODES_SUCCESS,
        payload: response
});
}
export const handleGetAllErrorCodesFailed = (dispatch:Dispatch<GetAllErrorCodesFailed>) => {
    dispatch({
        type: DeviceActionTypes.GET_ERROR_CODES_FAILED
});
}

//
export const updateErrorCode = (data: any): ThunkResult<void> => async dispatch => {
     handleLoader(dispatch,true)
     handleUpdateErrorCode(dispatch);
     api.Device().UpdateErrorCode(data)
     .then(response => {   
        handleUpdateErrorCodeSuccess(dispatch, data);
     })
     .catch(err => {
        handleUpdateErrorCodeFailed(dispatch);
     })
 };
 
 export const handleUpdateErrorCode = (dispatch:Dispatch<UpdateErrorCode>) => {
     dispatch({type: DeviceActionTypes.UPDATE_ERROR_CODE});
 }
 
 export const handleUpdateErrorCodeSuccess = (dispatch:Dispatch<UpdateErrorCodeSuccess>, response: any ) => {
     toast.success("Error Code Updated", {
             position: toast.POSITION.BOTTOM_RIGHT
           });
     dispatch({
         type: DeviceActionTypes.UPDATE_ERROR_CODE_SUCCESS,
         payload: response
 });
 }
 export const handleUpdateErrorCodeFailed = (dispatch:Dispatch<UpdateErrorCodeFailed>) => {
     toast.error("Failed!", {
         position: toast.POSITION.BOTTOM_RIGHT
     });
 
     dispatch({
         type: DeviceActionTypes.UPDATE_ERROR_CODE_FAILED
 });
 }

/*____________________________ GET Devices List________________________________________ */
export const getDevicesList = (): ThunkResult<void> => async dispatch => {
    handleGetDevicesList(dispatch);
    api.Device().GetDeviceList()
    .then(response => {
         
        handleGetDevicesListSuccess(dispatch, response.data.data)
    })
    .catch(err => {
        handleGetDevicesListFailed(dispatch);
    })
};

export const handleGetDevicesList = (dispatch:Dispatch<GetDevicesList>) => {
    dispatch({
        type: DeviceActionTypes.GET_DEVICES_LIST
    });
}

export const handleGetDevicesListSuccess = (dispatch:Dispatch<GetDevicesListSuccess>, response: any[] ) => {
    dispatch({
        type: DeviceActionTypes.GET_DEVICES_LIST_SUCCESS,
        payload: response
});
}
export const handleGetDevicesListFailed = (dispatch:Dispatch<GetDevicesListFailed>) => {
    dispatch({
        type: DeviceActionTypes.GET_DEVICES_LIST_FAILED
});
}






export type DeviceAction = 
| AddDevice
| AddDeviceSuccess
| AddDeviceFailed
| GetAllDevices
| GetAllDevicesSuccess
| GetAllDevicesFailed
// | GetUsageReportSuccess
// | GetUsageReportFailed
// | GetUsageReport
| UpdateDevice
| UpdateDeviceSuccess
| UpdateDeviceFailed
| GetDeviceBatch
| UploadBOM
| UploadBOMSuccess
| GetDeviceBatchSuccess
| UploadBOMFailed
| UpdateFirmware
| UpdateFirmwareFailed
| UpdateFirmwareSuccess
| GetAllErrorCodes
| GetAllErrorCodesFailed
| GetAllErrorCodesSuccess
| UpdateErrorCodeFailed
| UpdateErrorCode
| UpdateErrorCodeSuccess
// | GetAlarmAndWarningReport
// | GetAlarmAndWarningReportFailed
// | GetAlarmAndWarningReportSuccess
// | GetMaintenanceReport
// | GetMaintenanceReportSuccess
// | GetMaintenanceReportFailed
// | GetInverterDetails
// | GetInverterDetailsSuccess
// | GetInverterDetailsFailed
| clearAlarmReportData
// | GetEnergyConsumptionData
// | GetEnergyConsumptionDataFailed
// | GetEnergyConsumptionDataSuccess
| GetDevicesList
| GetDevicesListFailed
| GetDevicesListSuccess