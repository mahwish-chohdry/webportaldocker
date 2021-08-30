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
using ServiceStack.Text;
using SuperAdmin.Common;
using SuperAdmin.Models.DTOs;
using SuperAdmin.Services.Interfaces;

namespace SuperAdmin.WebUI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        IWebHostEnvironment _webHost { get; }
        private IDeviceService _deviceService;
        private readonly AppSettings _appSettings;
        IHostingEnvironment _hostingEnvironment { get; }
        public ReportController(IWebHostEnvironment webHost, IOptions<AppSettings> appSettings, IDeviceService deviceService, IHostingEnvironment hostingEnvironment)
        {
            _webHost = webHost;
            _appSettings = appSettings.Value;
            _deviceService = deviceService;
            _hostingEnvironment = hostingEnvironment;
        }

        [Authorize]
        [HttpGet("UsageReport/{customerId}/{emailid}/{deviceid}/{date}/{days}")]
        public IActionResult UsageReport(string customerId, string emailId, string deviceId, string date, string days)
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var serviceEndPoint = _appSettings.BaseUrl + _appSettings.GetUsageReportEndPoint;

            if (string.IsNullOrEmpty(date))
                date = DateTime.Now.Date.ToString("yyyy-MM-dd");

            try
            {
                ResponseDTO response = new ResponseDTO();
                var usageReports = _deviceService.FanUsageReport(serviceEndPoint, customerId, emailId, deviceId, date, days, authorizationToken);
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
        [HttpPost("exportUsageReport/{customerId}/{emailid}/{deviceid}/{date}/{days}")]
        public IActionResult exportUsageReport(string customerId, string emailId, string deviceId, string date, string days)
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var serviceEndPoint = _appSettings.BaseUrl + _appSettings.GetUsageReportEndPoint;

            if (string.IsNullOrEmpty(date))
                date = DateTime.Now.Date.ToString("yyyy-MM-dd");

            try
            {
                var usageReports = _deviceService.FanUsageReport(serviceEndPoint, customerId, emailId, deviceId, date, days, authorizationToken);
                JsConfig<DateTime>.SerializeFn = date => date.ToString("g");
                var csv = CsvSerializer.SerializeToCsv(usageReports);

                var fileName = DateTime.Now.Date.ToString("yyyyMMdd") + ".csv";

                var bytes = CustomLogging.WriteCsv(fileName, csv, _webHost.ContentRootPath);

                if (bytes != null)
                    return File(new System.IO.MemoryStream(bytes), "text/csv", fileName);
                else
                    return BadRequest("Data invalid or not found.");


                //return Ok();
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
        [HttpGet("MaintenanceReport/{customerId}/{batchId}/{deviceid}/{date}")]
        public IActionResult MaintenanceReport(string customerId, string batchId, string deviceId, string date)
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var serviceEndPoint = _appSettings.BaseUrl + _appSettings.GetMaintenanceReportingEndPoint;

            if (string.IsNullOrEmpty(date))
                date = DateTime.Now.Date.ToString("yyyy-MM-dd");

            try
            {
                ResponseDTO response = new ResponseDTO();
                var report = _deviceService.GetMaintenanceReport(serviceEndPoint, authorizationToken, customerId, batchId, deviceId, date);

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
    }
}