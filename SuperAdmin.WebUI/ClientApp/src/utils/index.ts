import { IPersonaPermissionResponse, Iroute, IUserPermissions, IRolePermissionResponse, IComponentPermissions } from "Interface";
import { dashboardRoutes } from "constants/routes";
import { toast } from "react-toastify";
import jwt_decode from 'jwt-decode';
import moment from "moment";
export const isAuthenticated = () => {
    if (localStorage.getItem('API_Key')) {
        return true;
    }
    return false;
}

export const setToken = (API_Key: string) => {
    localStorage.setItem('API_Key', API_Key);
}

export const getToken = () => {
    return localStorage.getItem('API_Key');
}

export const clearToken = () => {
    localStorage.removeItem('API_Key');
    localStorage.removeItem('state');
    window.location.href = "/";
}


export const isEmpty = (element: any) => {
    return element == '' || element == null || element == undefined;
}

export const isTokenExpired = () => {
    let token = getToken();
    try {
        if (token != null) {
            var decoded = jwt_decode(token) as any;
            if(decoded && decoded.exp && moment(decoded.exp) < moment(moment().unix()))
            {
                return true;
            }         
        }
        return false;
    } catch (err) {
        return true;
    }

}

export const filterCaseInsensitive = (filter: any, row: any) => {
    const id = filter.pivotId || filter.id;
    const content = row[id];
    if (typeof content !== 'undefined') {
        // filter by text in the table or if it's a object, filter by key
        if (typeof content === 'object' && content !== null && content.key) {
            return String(content.key).toLowerCase().includes(filter.value.toLowerCase());
        } else {
            return String(content).toLowerCase().includes(filter.value.toLowerCase());
        }
    }
    return true;
};

export const textWrapStyle = { 'whiteSpace': 'unset' };

export const displayModeList = [{ mode: 0, name: 'Tabular Mode' }, { mode: 1, name: 'Graphical Mode' }];
export const userProfileTypes = [
    { id: 1, type: 'Consumer' },
    { id: 2, type: 'Distributor' },
    { id: 3, type: 'Manufacturer' },
    { id: 4, type: 'Administrator' }]

export const sortOnCreatedDate = (items: any) => {
    return items.sort(function (a: any, b: any) {
        let aDate = a.createdDate ? new Date(a.createdDate) : '';
        let bDate = b.createdDate ? new Date(b.createdDate) : '';
        return aDate < bDate ? 1 : -1;
    });
}


export const getPersonaPermissionsData = (data: any, formsData: any, personaData: any) => {

    return data.map((item: any) => {
        let obj = item;
        let form = formsData.filter((f: any) => f.id == obj.formId);
        let persona = personaData.filter((p: any) => p.id == obj.personaId);

        if (form.length) {
            obj['formName'] = form[0].formName
        }

        if (persona.length) {
            obj['personaName'] = persona[0].personaName
        }

        return obj;

    })

}

export const getRolePermissionsData = (data: any, formsData: any, roleData: any) => {

    return data.map((item: any) => {
        let obj = item;
        let form = formsData.filter((f: any) => f.id == obj.formId);
        let role = roleData.filter((p: any) => p.id == obj.roleId);

        if (form.length) {
            obj['formName'] = form[0].formName
        }

        if (role.length) {
            obj['roleName'] = role[0].role1
        }

        return obj;

    })
}


export const getFormNameFromID = (formId: any, formsData: any) => {

    let form = formsData.filter((f: any) => f.id == formId);
    return form[0].formName;
}

export const getRoleNameFromID = (RoleId: any, roleData: any) => {
    let role = roleData.filter((f: any) => f.id == RoleId);
    return role[0].role1;
}


export const getPersonaNameFromID = (personaId: any, personaData: any) => {

    let persona = personaData.filter((f: any) => f.id == personaId);
    return persona[0].personaName;
}

export const isOptionDisabled = (data: any[], op1: number, op2: number, key1: string, key2: string) => {
    let obj = data.filter((item: any) => item[key1] == op1 && item[key2] == op2);
    if (obj.length)
        return true;
    return false;
}


export const getPermittedRoutes = (allRoutes: Iroute[], userPermissions: IUserPermissions) => {
    if (userPermissions && userPermissions.roleName == "SuperAdmin") {
        return allRoutes = allRoutes.map(route => {
            route.disabled = false;
            return route;
        });


    }
    else {
        let permittedForms = userPermissions && userPermissions.personaPermission ? userPermissions.personaPermission.map((item: any) => { return item.formName.toLowerCase(); }) : [];

        let permittedRoutes = allRoutes.filter(route => permittedForms.includes(route.name.toLowerCase()));

        let rolePerms = userPermissions && userPermissions.rolePermission ? userPermissions.rolePermission.map((item: any) => { item.formName = item.formName.toLowerCase(); return item }) : [];
        return permittedRoutes.map((route: Iroute) => {
            let rolePermObj = rolePerms.length ? rolePerms.filter(roleP => { return roleP.formName === route.name.toLowerCase() }) : [] as IRolePermissionResponse[];
            if (rolePermObj.length) {
                route.disabled = !rolePermObj[0].canView;
                route.disabled = route.disabled === null ? true : route.disabled;
            }
            return route;
        })
    }
}

export const isPermittedComponent = (allRoutes: Iroute[], userPermissions: IUserPermissions, componentPath: any) => {
    let flag = true;

    let permittedForms = userPermissions && userPermissions.personaPermission ? userPermissions.personaPermission.map((item: any) => { return item.formName.toLowerCase(); }) : [];
    let permittedRoutes = allRoutes.filter(route => { return permittedForms.includes(route.name.toLowerCase()) });

    let paths = permittedRoutes.map((item: Iroute) => {
        return `${item.layout}${item.path}`;
    })

    flag = paths.includes(componentPath);
    if (!flag)
        return flag;
    else {
        let rolePerms = userPermissions && userPermissions.rolePermission ? userPermissions.rolePermission.map((item: any) => { item.formName = item.formName.toLowerCase(); return item }) : [];



        for (var i = 0; i < permittedRoutes.length; i++) {
            let item = permittedRoutes[i];
            if (`${item.layout}${item.path}` === componentPath) {
                let rolePermObj = rolePerms.length ? rolePerms.filter(roleP => { return roleP.formName === item.name.toLowerCase() }) : [] as IRolePermissionResponse[];
                if (rolePermObj.length) {
                    flag = rolePermObj[0].canView;
                    break;
                }
            }
        }
    }

    return flag;
}


export const getAllPermissions = (allRoutes: Iroute[], userPermissions: IUserPermissions, componentPath: any) => {
    let obj = {
        canDelete: false,
        canExport: false,
        canInsert: false,
        canUpdate: false,
        canView: false
    } as IComponentPermissions;
    let rolePerms = userPermissions && userPermissions.rolePermission ? userPermissions.rolePermission.map((item: any) => { item.formName = item.formName.toLowerCase(); return item }) : [];
    let currentRouteArr = allRoutes.filter((item => `${item.layout}${item.path}` === componentPath));
    if (currentRouteArr.length) {
        let currentRoute = currentRouteArr[0];

        let rolePermObj = rolePerms.length ? rolePerms.filter(roleP => { return roleP.formName === currentRoute.name.toLowerCase() }) : [] as IRolePermissionResponse[];
        if (rolePermObj.length) {

            obj.canView = rolePermObj[0].canView;
            obj.canDelete = rolePermObj[0].canDelete;
            obj.canExport = rolePermObj[0].canExport;
            obj.canInsert = rolePermObj[0].canInsert;
            obj.canUpdate = rolePermObj[0].canUpdate;

        }
    }
    return obj;
}

export const getMonitorDevicesPermissionStatus = (userPermissions: IUserPermissions) => {
    let allRoutes = dashboardRoutes;
    let deviceRoute = allRoutes.filter((item: any) => { return item.path === '/monitorDevice' })[0];
    let rolePerms = userPermissions && userPermissions.rolePermission ? userPermissions.rolePermission : [];
    let rolePermObj = rolePerms.length ? rolePerms.filter(roleP => { return roleP.formName.toLowerCase() === deviceRoute.name.toLowerCase() }) : [] as IRolePermissionResponse[];
    if (rolePermObj.length) {
        return rolePermObj[0].canView ? rolePermObj[0].canView : false;
    }

    return false;

}

export const getRegisterDevicesPermissionStatus = (userPermissions: IUserPermissions) => {
    let allRoutes = dashboardRoutes;
    let deviceRoute = allRoutes.filter((item: any) => { return item.path === '/devices' })[0];
    let rolePerms = userPermissions && userPermissions.rolePermission ? userPermissions.rolePermission : [];
    let rolePermObj = rolePerms.length ? rolePerms.filter(roleP => { return roleP.formName.toLowerCase() === deviceRoute.name.toLowerCase() }) : [] as IRolePermissionResponse[];
    if (rolePermObj.length) {
        return rolePermObj[0].canView ? rolePermObj[0].canInsert : false;
    }

    return false;

}


export const getUserProfileInsertionPermissionStatus = (userPermissions: IUserPermissions) => {
    let allRoutes = dashboardRoutes;
    let deviceRoute = allRoutes.filter((item: any) => { return item.path === '/userProfile' })[0];
    let rolePerms = userPermissions && userPermissions.rolePermission ? userPermissions.rolePermission : [];
    let rolePermObj = rolePerms.length ? rolePerms.filter(roleP => { return roleP.formName.toLowerCase() === deviceRoute.name.toLowerCase() }) : [] as IRolePermissionResponse[];
    if (rolePermObj.length) {
        return rolePermObj[0].canView ? rolePermObj[0].canInsert : false;
    }

    return false;

}

export const getBase64 = (file: any, cb: any) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
        let parsedStr = parseString(reader.result)
        cb(parsedStr)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

export const parseString = (result: any) => {

    if (result.startsWith('data:image/jpeg;base64,')) {
        return result.substring(23)
    } else if (result.startsWith('data:image/png;base64,')) {
        return result.substring(22)
    }
    return result;
}

export const handleUpdatePasswordResponse = (statusCode: string, message: string) => {
    if (statusCode === "Success") {
        toast.success("Password Updated!", {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    } else {
        toast.warn(message, {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    }
}


export const arrayUnion = (arr1: any[], arr2: any[], equalityFunc: any) => {
    var union = arr1.concat(arr2);

    for (var i = 0; i < union.length; i++) {
        for (var j = i + 1; j < union.length; j++) {
            if (equalityFunc(union[i], union[j])) {
                union.splice(j, 1);
                j--;
            }
        }
    }

    return union;
}

export const getDefaultCustomer = (userInfo: any, companiesList: any[]) => {
    let companyName = '';

    if (userInfo != null) {
        let _companiesList = companiesList.filter((company: any) => company.customerId === userInfo.customerId)
        if (_companiesList.length)
            companyName = _companiesList[0].name;

    }

    return {
        id: userInfo && userInfo.customer_Id ? userInfo.customer_Id : -1,
        customerId: userInfo && userInfo.customerId ? userInfo.customerId : '',
        name: companyName == '' ? userInfo.customerId : companyName

    }
}

export const firmwareFileFormatList = [{
    id: '.bin',
    value: '.bin'
}]

export const BOMFileFormatList = [{
    id: '.csv',
    value: '.csv'
}, {
    id: '.xls',
    value: '.xls'
}
]

export const BOMTypesList = [{
    id: 'Smart Fan Box',
    value: 'Smart Fan Box'
}, {
    id: 'PLC Inverter',
    value: 'PLC Inverter'
}, {
    id: 'Industrial Fan',
    value: 'Industrial Fan'
}]

// sort function

export const alphabaticalSort = (a: string, b :string) => {
    // Use toUpperCase() to ignore character casing
    const A = a.toUpperCase();
    const B = b.toUpperCase();
  
    let comparison = 0;
    if (A > B) {
      comparison = 1;
    } else if (A < B) {
      comparison = -1;
    }
    return comparison;
  }