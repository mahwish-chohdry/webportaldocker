using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommonSuperAdmin.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SuperAdmin.Common;
using SuperAdmin.Models.DTOs;
using SuperAdmin.Models.Models;
using SuperAdmin.Services.Interfaces;

namespace SuperAdmin.WebUI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        IWebHostEnvironment _webHost { get; }
        private IDeviceService _deviceService;
        IHostingEnvironment _hostingEnvironment { get; }
        private readonly AppSettings _appSettings;
        public DashboardController(IWebHostEnvironment webHost, IDeviceService deviceService, IOptions<AppSettings> appSettings, IHostingEnvironment hostingEnvironment)
        {
            _webHost = webHost;
            _deviceService = deviceService;
            _appSettings = appSettings.Value;
            _hostingEnvironment = hostingEnvironment;

        }

        // GET: api/Device
        [Authorize]
        [HttpGet("getDeviceStats")]
        public IActionResult getDeviceStats(string customerId, string userId)
        {
            try
            {
                var stats = new DeviceStats();
                //get Fan Devices 
                var authorizationToken = HttpContext.Request?.Headers["Authorization"];
                var getDeviceStatsEndPoint = _appSettings.BaseUrl + _appSettings.GetDeviceStatsEndPoint;
                var deviceStats = _deviceService.GetDeviceStats(getDeviceStatsEndPoint, authorizationToken, customerId, userId);

                if (deviceStats != null && deviceStats.Count() > 0)
                {
                    var unconfigured = deviceStats.Where(w => !w.IsConfigured).ToList();
                    var configured = deviceStats.Where(w => w.IsConfigured).ToList();
                    var online = configured.Where(w => w.connectivityStatus.ToLower().Equals("online")).ToList();
                    var offline = configured.Where(w => string.IsNullOrEmpty(w.connectivityStatus) || w.connectivityStatus.ToLower().Equals("offline") || w.connectivityStatus.ToLower().Equals("idle")).ToList();
                    var toBeFirmware = configured.Where(w => !string.IsNullOrEmpty(w.latestFirmwareVersion) && w.currentFirmwareVersion != w.latestFirmwareVersion).ToList();

                    stats.Configured = configured.Count();
                    stats.Offline = offline.Count();
                    stats.Online = online.Count();
                    stats.TotalDevices = deviceStats.Count();
                    stats.UnConfigured = unconfigured.Count();
                    stats.Firmware = toBeFirmware.Count();
                }

                ResponseDTO response = new ResponseDTO();
                if (deviceStats != null)
                {
                    response.StatusCode = "Success";
                    response.Message = "Successfully fetched the device stats.";
                    response.Data = stats;
                }
                else
                {
                    response.StatusCode = "Warning";
                    response.Message = "Invalid request.";
                    response.Data = deviceStats;
                }
                CustomLogging.InfoLog(response.ToString(), _hostingEnvironment.ContentRootPath);
                return Ok(response);
            }
            catch (AppException ex)
            {

                if (ex._response.StatusCode == "Warning")
                {
                    CustomLogging.InfoLog(ex._response.Message, _hostingEnvironment.ContentRootPath);
                    return BadRequest(ex._response);
                }
                else if (ex._response.StatusCode != null)
                {
                    CustomLogging.ErrorLog(ex, _hostingEnvironment.ContentRootPath);
                    return BadRequest(ex._response);
                }
                else
                {
                    CustomLogging.ErrorLog(ex, _hostingEnvironment.ContentRootPath);
                    return BadRequest(new ResponseDTO { Message = ex.Message, StatusCode = "Warning", Data = null });
                }
            }
        }

        [Authorize]
        [HttpGet("UsageReport/{customerId}/{emailId}")]
        public IActionResult UsageReport(string customerId, string emailId)
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var serviceEndPoint = _appSettings.BaseUrl + _appSettings.GetAllUsageReportEndPoint;

            string date = DateTime.Now.Date.ToString("yyyy-MM-dd");

            try
            {
                ResponseDTO response = new ResponseDTO();
                var usageReports = _deviceService.FanAllUsageReport(serviceEndPoint, customerId, emailId, date, _appSettings.DashboardUsageDays, authorizationToken);
                var transformedReport = _deviceService.ReportTransformation(usageReports);
                if (usageReports != null)
                {
                    response.StatusCode = "Success";
                    response.Message = "Successfully fetched the list.";
                    response.Data = transformedReport;
                }
                else
                {
                    response.StatusCode = "Warning";
                    response.Message = "Invalid request.";
                    response.Data = transformedReport;
                }
                CustomLogging.InfoLog(response.ToString(), _hostingEnvironment.ContentRootPath);
                return Ok(response);
            }
            catch (AppException ex)
            {
                if (ex._response.StatusCode == "Warning")
                {
                    CustomLogging.InfoLog(ex._response.Message, _hostingEnvironment.ContentRootPath);
                    return BadRequest(ex._response);
                }
                else if (ex._response.StatusCode != null)
                {
                    CustomLogging.ErrorLog(ex, _hostingEnvironment.ContentRootPath);
                    return BadRequest(ex._response);
                }
                else
                {
                    CustomLogging.ErrorLog(ex, _hostingEnvironment.ContentRootPath);
                    return BadRequest(new ResponseDTO { Message = ex.Message, StatusCode = "Warning", Data = null });
                }
            }

        }

        [Authorize]
        [HttpGet("MaintenanceReport/{customerId}/{date}")]
        public IActionResult MaintenanceReport(string customerId, string date)
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var serviceEndPoint = _appSettings.BaseUrl + _appSettings.GetCustomerMaintenanceReportingEndPoint;

            if (string.IsNullOrEmpty(date))
                date = DateTime.Now.Date.ToString("yyyy-MM-dd");

            try
            {
                ResponseDTO response = new ResponseDTO();
                var report = _deviceService.GetCustomerMaintenanceReport(serviceEndPoint, authorizationToken, customerId, date, _appSettings.DashboardMaintenanceDays);

                if (report != null)
                {
                    response.StatusCode = "Success";
                    response.Message = "Successfully fetched the list.";
                    response.Data = report;
                }
                else
                {
                    response.StatusCode = "Warning";
                    response.Message = "Invalid request.";
                    response.Data = report;
                }
                CustomLogging.InfoLog(response.ToString(), _hostingEnvironment.ContentRootPath);
                return Ok(response);
            }
            catch (AppException ex)
            {

                if (ex._response.StatusCode == "Warning")
                {
                    CustomLogging.InfoLog(ex._response.Message, _hostingEnvironment.ContentRootPath);
                    return BadRequest(ex._response);
                }
                else if (ex._response.StatusCode != null)
                {
                    CustomLogging.ErrorLog(ex, _hostingEnvironment.ContentRootPath);
                    return BadRequest(ex._response);
                }
                else
                {
                    CustomLogging.ErrorLog(ex, _hostingEnvironment.ContentRootPath);
                    return BadRequest(new ResponseDTO { Message = ex.Message, StatusCode = "Warning", Data = null });
                }
            }

        }

        [Authorize]
        [HttpGet("AlarmWarningReport/{customerId}/{batchId}/{deviceid}/{date}")]
        public IActionResult AlarmWarningReport(string customerId, string batchId, string deviceId, string date)
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var serviceEndPoint = _appSettings.BaseUrl + _appSettings.GetAlarmWarningReportingEndPoint;

            if (string.IsNullOrEmpty(date))
                date = DateTime.Now.Date.ToString("yyyy-MM-dd");

            try
            {
                ResponseDTO response = new ResponseDTO();
                var report = _deviceService.GetAllAlarmWarningReport(serviceEndPoint, authorizationToken, customerId, batchId, deviceId, date);

                if (report != null)
                {
                    response.StatusCode = "Success";
                    response.Message = "Successfully fetched the list.";
                    response.Data = report;
                }
                else
                {
                    response.StatusCode = "Warning";
                    response.Message = "Invalid request.";
                    response.Data = report;
                }
                CustomLogging.InfoLog(response.ToString(), _hostingEnvironment.ContentRootPath);
                return Ok(response);
            }
            catch (AppException ex)
            {

                if (ex._response.StatusCode == "Warning")
                {
                    CustomLogging.InfoLog(ex._response.Message, _hostingEnvironment.ContentRootPath);
                    return BadRequest(ex._response);
                }
                else if (ex._response.StatusCode != null)
                {
                    CustomLogging.ErrorLog(ex, _hostingEnvironment.ContentRootPath);
                    return BadRequest(ex._response);
                }
                else
                {
                    CustomLogging.ErrorLog(ex, _hostingEnvironment.ContentRootPath);
                    return BadRequest(new ResponseDTO { Message = ex.Message, StatusCode = "Warning", Data = null });
                }
            }

        }
        [Authorize]
        [HttpGet("DeviceAlarmHistory/{customerId}/{deviceid}/")]
        public IActionResult DeviceAlarmHistory(string customerId, string batchId, string deviceId, string date)
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var serviceEndPoint = _appSettings.BaseUrl + _appSettings.GetDeviceAlarmReportingEndPoint;

            if (string.IsNullOrEmpty(date))
                date = DateTime.Now.Date.ToString("yyyy-MM-dd");

            try
            {
                ResponseDTO response = new ResponseDTO();
                var report = _deviceService.GetDeviceAlarmReport(serviceEndPoint, authorizationToken, customerId, deviceId);

                if (report != null)
                {
                    response.StatusCode = "Success";
                    response.Message = "Successfully fetched the list.";
                    response.Data = report;
                }
                else
                {
                    response.StatusCode = "Warning";
                    response.Message = "Invalid request.";
                    response.Data = report;
                }
                CustomLogging.InfoLog(response.ToString(), _hostingEnvironment.ContentRootPath);
                return Ok(response);
            }
            catch (AppException ex)
            {

                if (ex._response.StatusCode == "Warning")
                {
                    CustomLogging.InfoLog(ex._response.Message, _hostingEnvironment.ContentRootPath);
                    return BadRequest(ex._response);
                }
                else if (ex._response.StatusCode != null)
                {
                    CustomLogging.ErrorLog(ex, _hostingEnvironment.ContentRootPath);
                    return BadRequest(ex._response);
                }
                else
                {
                    CustomLogging.ErrorLog(ex, _hostingEnvironment.ContentRootPath);
                    return BadRequest(new ResponseDTO { Message = ex.Message, StatusCode = "Warning", Data = null });
                }
            }

        }


        [Authorize]
        [HttpGet("DeviceConsumptionReport/{customerId}/{deviceid}/{Date}")]
        public IActionResult DeviceConsumptionReport(string customerId, string deviceId, string date)
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var serviceEndPoint = _appSettings.BaseUrl + _appSettings.GetConsumptionReport;

            if (string.IsNullOrEmpty(date))
                date = DateTime.Now.Date.ToString("yyyy-MM-dd");

            try
            {
                ResponseDTO response = new ResponseDTO();
                var report = _deviceService.GetDeviceConsumptionReport(serviceEndPoint, authorizationToken, customerId, deviceId, date);

                if (report != null)
                {
                    response.StatusCode = "Success";
                    response.Message = "Successfully fetched the list.";
                    response.Data = report;
                }
                else
                {
                    response.StatusCode = "Warning";
                    response.Message = "Invalid request.";
                    response.Data = report;
                }

                return Ok(response);
            }
            catch (AppException ex)
            {

                if (ex._response.StatusCode == "Warning")
                {
                    CustomLogging.InfoLog(ex._response.Message, _hostingEnvironment.ContentRootPath);
                    return BadRequest(ex._response);
                }
                else if (ex._response.StatusCode != null)
                {
                    CustomLogging.ErrorLog(ex, _hostingEnvironment.ContentRootPath);
                    return BadRequest(ex._response);
                }
                else
                {
                    CustomLogging.ErrorLog(ex, _hostingEnvironment.ContentRootPath);
                    return BadRequest(new ResponseDTO { Message = ex.Message, StatusCode = "Warning", Data = null });
                }
            }

        }
    }
}