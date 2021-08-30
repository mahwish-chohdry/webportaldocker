using SuperAdmin.Models.DTOs;
using SuperAdmin.Models.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Services.Interfaces
{
    public interface IDeviceService
    {
        IEnumerable<Device> AddDevices(DeviceDTO deviceDTO);
        ResponseDTO CreateFanDevices(DeviceDTO deviceDTO,string createDeviceEndpoint,string authorizationToken);
        ResponseDTO UpdateFan(DeviceDTO deviceDTO, string createDeviceEndpoint, string authorizationToken);
        IEnumerable<Device> getAllDevices();
        List<FanDevice> GetDeviceStats(string getDeviceStatsEndPoint, string authorizationToken, string CustomerId = "", string UserId = "");
        List<UsageReportDTO> FanUsageReport(string serviceEndPoint,string customerId,string emailId, string device, string Date,string Days,  string authorizationToken);
        List<UsageReportDTO> FanAllUsageReport(string serviceEndPoint, string customerId, string emailId, string Date, string Days, string authorizationToken);
        List<FanDeviceDTO> GetAllFanDevices(string serviceEndPoint , string authorizationToken, string CustomerId = null);

        List<BatchDTO> GetAllBatchId(string serviceEndPoint, string authorizationToken);
        BarReportDTO ReportTransformation(List<UsageReportDTO> data);
        ResponseDTO Uploadbom(BomDTO bom, string createDeviceEndpoint, string authorizationToken);

        ResponseDTO UploadFirmware(FirmwareDTO firmware, string createDeviceEndpoint, string authorizationToken);

        List<AlarmWarningDTO> GetAllAlarmWarning(string serviceEndPoint, string authorizationToken);
        List<AlarmWarningReportDTO> GetAllAlarmWarningReport(string serviceEndPoint, string authorizationToken,string customerId,string batchId,string deviceId,string Date);
        List<MaintenanceReportDTO> GetMaintenanceReport(string serviceEndPoint, string authorizationToken, string customerId, string batchId, string deviceId, string Date);

        List<DeviceAlarmHistoryReportDTO> GetDeviceAlarmReport(string serviceEndPoint, string authorizationToken, string customerId, string deviceId);
        CustomerDeviceMaintenanceReportDTO GetCustomerMaintenanceReport(string serviceEndPoint, string authorizationToken, string customerId,  string date, string day);
        List<ConsumptionReportDTO> GetDeviceConsumptionReport(string serviceEndPoint, string authorizationToken, string customerId, string deviceId,string date);
    }
}
