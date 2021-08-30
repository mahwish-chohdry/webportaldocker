using System;
using System.Collections.Generic;
using System.Text;

namespace CommonSuperAdmin.Common
{
    public class AppSettings
    {
        public string Secret { get; set; }
        public string BaseUrl { get; set; }
        public string CustomerEndpoint { get; set; }
        public string CreateDeviceEndpoint { get; set; }
        public string GetCustomerEndpoint { get; set; }
        public string GetFanDevicesEndpoint { get; set; }
        public string GetDeviceStatsEndPoint { get; set; }
        public string GetUsageReportEndPoint { get; set; }
        public string GetAllUsageReportEndPoint { get; set; }
        public string UpdateCustomerEndpoint { get; set; }
        public string UpdateDeviceEndPoint { get; set; }
        public string GetBatchIdEndPoint { get; set; }
        public string GetBomEndPoint { get; set; }
        public string GetFirmwareEndPoint { get; set; }
        public string GetAlarmWarningEndPoint { get; set; }
        public string GetAlarmWarningReportingEndPoint { get; set; }
        public string GetConsumptionReport { get; set; }
        public string GetMaintenanceReportingEndPoint { get; set; }
        public string GetDeviceAlarmReportingEndPoint { get; set; }
        public string LoginEndPoint { get; set; }
        public string CreateCustomerUserEndPoint { get; set; }
        public string GetRolesEndPoint { get; set; }
        public string GetRolesbyPersonaEndPoint { get; set; }
        public string GetRoleByNameAndPersonaEndPoint { get; set; }
        public string PersonasEndPoint { get; set; }
        public string GetFormEndPoint { get; set; }
        public string CreateFormEndPoint { get; set; }
        public string UpdateFormEndPoint { get; set; }
        public string DeleteFormEndPoint { get; set; }
        public string GetRolePermissionEndPoint { get; set; }
        public string CreateRolePermissionEndPoint { get; set; }
        public string UpdateRolePermissionEndPoint { get; set; }
        public string DeleteRolePermissionEndPoint { get; set; }
        public string GetPersonaPermissionEndPoint { get; set; }
        public string CreatePersonaPermissionEndPoint { get; set; }
        public string UpdatePersonaPermissionEndPoint { get; set; }
        public string DeletePersonaPermissionEndPoint { get; set; }
        public string GetUserPermission { get; set; }
        public string GetUsersEndpoint { get; set; }
        public string UpdateUsersEndpoint { get; set; }
        public string UpdateUserPasswordEndpoint { get; set; }
        public string ResetPasswordEndpoint { get; set; }
        public string GetCustomerMaintenanceReportingEndPoint { get; set; }
        public string DashboardUsageDays { get; set; }
        public string DashboardMaintenanceDays { get; set; }
    }
}
