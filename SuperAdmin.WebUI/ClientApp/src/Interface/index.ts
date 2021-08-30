export interface Inotification {
    _notificationSystem?: any;
}

export interface IBrowserHistory {
    history?: any;
    location?: any;
    componentPermissions?: IComponentPermissions;
}
export interface ILoggedinUser {
    id: number;
    customerId: string;
    customer_Id: number;
    profileImage: string;
    role: string;
    userId: string;
    userName: string;
    userPermission?: IUserPermissions | null;
    firstName?: string;
    lastName?: string;
    lastLogin: string;

}
export interface IUser {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    CustomerName?: string,
    isLoggedIn?: boolean;
}
export interface ICompany extends IErrors, IBrowserHistory {
    id?: number;
    admin?: IUser;
    name?: string;
    phone?: number;
    customerType?: string;
    customerId?: string;
    address?: string;
    showModal?: boolean;
    createdDate?: string;


}

export interface IAdminNavbarLinksProps extends IBrowserHistory {
    userInfo: any;

    updateProfile: (data: any) => void,
    resetPassword: (data: any) => void,
    UpdateUserPassword: (data: any) => void,
}

export interface ICompanyProps extends Ialerts, IBrowserHistory {
    isLoggedIn: boolean;
    isLoading: boolean;
    companies?: ICompany[];
    showModal: boolean,
    isAddingCompany?: boolean;
    isGettingCompanies: boolean;
    roles: any[];
    persona_roles: any[];
    personas: any[];
    userId: string;
    permissions: IUserPermissions

    AddCompany: (data: any) => void;
    AddUserProfile: (data: any) => void;
    updateCompany: (data: any) => void
    getAllCompanies: () => void;
    getRoles: () => void;
    getRolesByPersona: (persona: string) => void;
    getPersonas: () => void;
}

export interface ITableActionsProps extends IBrowserHistory {
    row : any,
    addUserProfilePermission: boolean,
    updatePermission: boolean,
    showDevicePermission: boolean,
    registerDevicePermission: boolean,
    persona_roles: any[];
    userId: string;

    AddUserProfile: (data: any) => void;
    updateCompany: (data: any) => void;
    getRolesByPersona: (persona: string) => void;
}

export interface IUserProps extends Ialerts, IBrowserHistory {
    userCredentials: ILoggedinUser | undefined;
    isLoggedIn: boolean;
    authenticateUser: (data: any) => void;
    isLoading: boolean;
}
export interface deviceProps extends Ialerts, IBrowserHistory {
    companies: ICompany[];
    getAllCompanies: () => void;
    updateDevice: (data: any) => void;
    AddDevices: (data: any) => void;
    devices: Idevice[];
    getDevices: () => void;
    isAddingDevice?: boolean;
    isGettingDevices: boolean;
    deviceBatch?: string;
    devicesBatchList?: any[]
    getDeviceBatchList: () => void;
    permissions: IUserPermissions;
    userInfo: ILoggedinUser | null;
}
export interface IdeviceMonitoringState extends IBrowserHistory {
    showModal?: boolean
    companyName: string,
    deviceName: string,
    companyId?: number,
    isDisabled: boolean,
    errors: {
        name: '',
        address: ''
    },
}
export interface IErrors {
    errors?: any
    isDisabled?: boolean
}
export interface IdeviceState extends IErrors {
    companyName: string,
    companyId: number,
    selectedCustomerId: string,
    deviceName: string,
    devicePrefix: string,
    devicePrefix2: string,
    startRange: string,
    endRange: string,
    createdBy?: string,
    deviceBatch?: string,
    newBatch?: string,
    isAddingNewBatch?: boolean,
    batchId?: string,
}
export interface Idevice extends IBrowserHistory {

    id?: number,
    deviceName?: string,
    devicePrefix?: string,
    isActive?: boolean,
    isConfigured?: boolean,
    isInstalled?: boolean,
    isOnline?: boolean,
    serialNumber?: string,
    customerId?: string,
    createdBy?: string,
    createdDate?: string,
    modifiedDate?: string,
    lastMaintenanceDate?: string,
    connectivityStatus?: string,
    permissions: IUserPermissions;
}
export interface Iroute {
    path: string,
    name: string,
    icon: string,
    component: any,
    parent?: string,
    layout: string
    disabled?: boolean;
}
export interface Ialerts {
    loginAlertStatus: string;
    addCompanyAlertStatus: string;
    addDeviceAlertStatus: string;
    getUsageReportStatus: string;
}

export interface ILoginState extends IUser {
    errors: any

}

export interface IDeviceBatchProps extends IBrowserHistory {
    companies?: ICompany[];
    devicesBatchList?: any[];
    getAllCompanies: () => void;
    getDeviceBatchList: () => void;
    uploadBOM: (data: any, file: any) => void;
    isUploadingBOM?: boolean;
    permissions: IUserPermissions;
    userInfo: ILoggedinUser | null;
}


export interface IDeviceFirmwareProps extends IBrowserHistory {
    companies?: ICompany[];
    devicesBatchList?: any[];
    getAllCompanies: () => void;
    getDeviceBatchList: () => void;
    updateFirmware: (data: any, file: any) => void;
    isUploadingFirmware?: boolean;
    permissions: IUserPermissions;
    userInfo: ILoggedinUser | null;
}


export interface IErrorCode {
    type?: string;
    code?: string;
    registerNumber?: string;
    description?: string;
    reasonAnalysis?: string;
}

export interface IErrorCodeState extends IErrors {
    selectedItem: IErrorCode;
    showModal?: boolean;
    isDisabled?: boolean;
    typeFilter: "All" | "Alarm" | "Warning";
    pageSize: number;
}


export interface IErrorCodeProps extends IBrowserHistory {
    errorCodesList?: IErrorCode[];
    getErrorCodesList: () => void;
    updateErrorCode: (data: IErrorCode) => void;
    isUpdatingErrorCode?: boolean;
    isGettingErrorCode?: boolean;
    permissions: IUserPermissions;
}


export interface IAlarmWarningReport extends IErrorCode {
    timestamp?: string;
    deviceId?: string;
    deviceName?: string;
    deviceStatus?: string;
}


export interface IReportFilters {
    user: { id: number | null, name: string, selectedCustomerId: string };
    device: { id: number | null, name: string };
    batch: string;
    date: string;
}

export interface IErrorOccurrence {
    code: string;
    count: number;
}

export interface IAlarmWarningReportState {
    selectedFilters: IReportFilters;
    selectedHistoryType: "All" | "Alarm" | "Warning";
    alarmReportData: IAlarmWarningReport[];
    isDisabled: boolean;
    errorOccurrence: IErrorOccurrence[];
    isExpanded: boolean;
    sort: any[];
    pageSize: number;
    displayMode: number;
}


export interface IAlarmWarningReportProps extends IBrowserHistory {
    errorCodesList?: IErrorCode[];
    isGettingErrorCode?: boolean;
    companies: ICompany[],
    devicesBatchList?: any[],
    devices?: Idevice[],
    alarmReportData?: IAlarmWarningReport[],
    isGettingAlarmsReport: boolean;
    permissions: IUserPermissions;
    userInfo: ILoggedinUser | null;
    getErrorCodesList: () => void;
    getAllCompanies: () => void;
    getDeviceBatchList: () => void;
    getDevices: () => void;
    getAlarmAndWarningReport: (data: any) => void;
    clearAlarmReportData: (data: string) => void;

}

export interface IEnergyReportProps extends IBrowserHistory {
    companies: ICompany[],
    devicesBatchList?: any[],
    devices?: Idevice[],
    reportData?: any[],
    isGettingEnergyDetails: boolean;
    permissions: IUserPermissions;
    userInfo: ILoggedinUser | null;
    getAllCompanies: () => void;
    getDeviceBatchList: () => void;
    getDevices: () => void;
    getEnergyReport: (data: any) => void;
    clearReportData: (data: string) => void;

}

export interface IEnergyReportState {
    selectedFilters: IReportFilters;
    reportData: any[];
    isDisabled: boolean;
    isExpanded: boolean;
    sort: any[];
    pageSize: number;
    displayMode: number;
}


export interface IMaintainenceReportState {
    selectedFilters: IReportFilters;
    maintenanceReportData: IAlarmWarningReport[];
    isDisabled: boolean;
    isExpanded: boolean;
    sort: any[];
    pageSize: number;
    displayMode: number;

}


export interface IMaintainenceReportProps extends IBrowserHistory {
    companies: ICompany[];
    devicesBatchList: any[];
    devices: Idevice[];
    maintenanceReportData: any[];
    isGettingMaintenanceReport: boolean;
    permissions: IUserPermissions;
    userInfo: ILoggedinUser | null;
    getErrorCodesList: () => void;
    getAllCompanies: () => void;
    getDeviceBatchList: () => void;
    getDevices: () => void;
    getMaintenanceReport: (data: any) => void;
    clearMaintenanceReport: (data: string) => void;

}

export interface IPLCInverterDetails {
    alarm: string | null;
    code: string | null;
    deviceId: any;
    direction: any;
    outputCurrent: any;
    outputFrequency: any;
    outputPower: any;
    outputVoltage: any;
    reasonAnalysis: string | null;
    rpm: any;
    speed: any;
    timestamp: string | null;
    title: string | null;
    warning: string | null;

}

export interface IPLCInverterDetailsState {
    selectedFilters: IReportFilters;
    inverterData: IPLCInverterDetails[];
    isDisabled: boolean;
    sort: any[];
    pageSize: number;
    displayMode: number;


}
export interface IPLCInverterDetailsProps extends IBrowserHistory {
    companies: ICompany[];
    devices: Idevice[];
    inverterData: IPLCInverterDetails[];
    isGettingInverterDetails: boolean;
    permissions: IUserPermissions;
    userInfo: ILoggedinUser | null;
    getAllCompanies: () => void;
    getDevices: () => void;
    getMaintenanceReport: (data: any) => void;
    getInverterData: (data: any) => void;
    clearInverterData: (data: string) => void;

}

export interface IPermissions {
    selectedUserRole: string;
    selectedUserRoleId: number;
    selectedFormId: number;
    selectedFormType: string;
    selectedUserPersona: string,
    selectedUserPersonaId: number,
    canView: boolean;
    canInsert: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canExport: boolean;
    allOption: boolean;
    pageSize: number;
    persona_roles_list: any,
    persona_forms_list: any,
    showModal: boolean;
    toBeDeleted: number;
    //modal component 
    isOpen: boolean;
    idToBeEdited: number;
    selectedTab: number;
}

export interface IPersonaPermissions {
    selectedPersonaId: {
        id: number,
        name: string
    },
    selectedFormId: {
        id: number,
        name: string
    },
    isDisabled: boolean,
    pageSize: number,
    showModal: boolean,
    toBeDeleted: number,
    //modal component 
    isOpen: boolean,
    idToBeEdited: number,
    selectedTab: number
}
export interface IFormsPermissions extends IErrors {

    forms: {
        formName: string;
        isAddFormDisabled: boolean;
        showModal: boolean;
        pageSize: number;
        toBeDeleted: number;
        //modal component 
        isOpen: boolean;
        idToBeEdited: number;
    }

}
export interface IUserRightsManagementState extends IErrors {
    selectedTab: string;
}

export interface IRolePermissionResponse {
    formId: string;
    formName: string;
    canView?: boolean;
    canInsert?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
    canExport?: boolean;
}

export interface IPersonaPermissionResponse {
    formName: string;
}

export interface IUserPermissions {
    personaName: string;
    rolePermission: IRolePermissionResponse[];
    personaPermission: IPersonaPermissionResponse[];
    roleName: string;
}

export interface IComponentPermissions {
    canView: boolean;
    canInsert: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canExport: boolean;

}


export interface IComputedData {

    alarms: any[];
    warnings: any[];
    configuredDevices: number;
    unConfiguredDevices: number;
    offlineDevices: number;
    onlineDevices: number;
    firmwareUpdates: number;
    myDevices: number;
    runningAvg: number;
    maintained: number;
}
export interface IDashboardProps extends IBrowserHistory {
    companies: any[];
    dashboardDeviceStats: any;
    isGettingStats: boolean;
    currentCustomerId: string;
    currentUserId: string;
    isGettingCompanies: boolean;
    permissions: any;
    isGettingAlarmsReport: boolean;
    maintainedDevices: any[];
    pendingMaintainanceDevices: any[];
    alarmsWarningData: any[];
    isGettingMaintenanceReport: boolean;
    userInfo: any;

    usageData: any;
    isGettingUsageData: boolean;

    getStats: (customerId: string, userId: string) => void;
    getUserProfiles: () => void;
    getAlarmAndWarningReport: (data: any) => void;
    getMaintenanceReport: (data: any) => void;
    getUsageReport: (data: any) => void;
}

export interface IDashboardState extends IErrors {
    chartgrid: any;
    infogrid: any;
    statsgrid: any;
    devices: any[];
    companies: any[];
    data: {};
    computedData: IComputedData;
}

export interface IUsageReportState extends IErrors {

    companyName: string;
    deviceName: string;
    deviceId: string;
    date: string;
    companyId: any;
    lastUpdate: string;
    displayMode: number;
    usageReport: any;
    selectedCustomerId: any;

}

export interface IUsageReportProps extends IBrowserHistory{
    usageReport: any;
    isLoading: boolean;
    userInfo: any;
    companies: any[]; //companies dropdown list
    devices: any[], // device dropdown list
    isFetchingUsageReport: boolean;
    getUsageReportStatus: string;
    permissions: any;
    GetUsageReport: (data: any) => void;
    getAllCompanies: () => void;
    getDevices: () => void;
    exportUsageReport: (data: any) => void;
    clearReportData: (data: string) => void;
    componentPermissions: IComponentPermissions
}





