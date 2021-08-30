using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CommonSuperAdmin.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SuperAdmin.Common;
using SuperAdmin.Models.DTOs;
using SuperAdmin.Services.Interfaces;

namespace SuperAdmin.WebUI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        IWebHostEnvironment _webHost { get; }
        private IDeviceService _deviceService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;
        IHostingEnvironment _hostingEnvironment { get; }
        public DeviceController(IWebHostEnvironment webHost, IDeviceService deviceService, IMapper mapper, IOptions<AppSettings> appSettings, IHostingEnvironment hostingEnvironment)
        {
            _webHost = webHost;
            _deviceService = deviceService;
            _appSettings = appSettings.Value;
            _mapper = mapper;
            _hostingEnvironment = hostingEnvironment;
        }

        [Authorize]
        [HttpGet("getdeviceBatchNumber")]
        public IActionResult getdeviceBatchNumber()
        {
            try
            {
                var authorizationToken = HttpContext.Request?.Headers["Authorization"];
                var getfanDeviceEndpoint = _appSettings.BaseUrl + _appSettings.GetBatchIdEndPoint;
                var response = _deviceService.GetAllBatchId(getfanDeviceEndpoint, authorizationToken);
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
        // GET: api/Device
        [Authorize]
        [HttpGet("getAllDevices")]
        public IActionResult getAllDevices()
        {
            try
            {
                //get Fan Devices 
                var authorizationToken = HttpContext.Request?.Headers["Authorization"];
                var getfanDeviceEndpoint = _appSettings.BaseUrl + _appSettings.GetFanDevicesEndpoint;
                var fanDevices = _deviceService.GetAllFanDevices(getfanDeviceEndpoint, authorizationToken);
                //old code
                // var devices = _deviceService.getAllDevices();
                ResponseDTO response = new ResponseDTO();
                if (fanDevices != null)
                {
                    response.StatusCode = "Success";
                    response.Message = "Successfully fetched the list.";
                    response.Data = fanDevices;
                }
                else
                {
                    response.StatusCode = "Warning";
                    response.Message = "Invalid request.";
                    response.Data = fanDevices;
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
        [HttpGet("getDeviceList")]
        public IActionResult getDeviceList()
        {
            try
            {
                //get Fan Devices 
                var authorizationToken = HttpContext.Request?.Headers["Authorization"];
                var getfanDeviceEndpoint = _appSettings.BaseUrl + _appSettings.GetFanDevicesEndpoint;
                var fanDevices = _deviceService.GetAllFanDevices(getfanDeviceEndpoint, authorizationToken).OrderBy(x => x.Name);
                //old code
                // var devices = _deviceService.getAllDevices();
                ResponseDTO response = new ResponseDTO();
                if (fanDevices != null)
                {
                    response.StatusCode = "Success";
                    response.Message = "Successfully fetched the list.";
                    response.Data = fanDevices;
                }
                else
                {
                    response.StatusCode = "Warning";
                    response.Message = "Invalid request.";
                    response.Data = fanDevices;
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
        [HttpGet("getAllAlarmWarning")]
        public IActionResult getAllAlarmWarning()
        {
            try
            {
                //get Fan Devices 
                var authorizationToken = HttpContext.Request?.Headers["Authorization"];
                var getAlarmWarningEndPoint = _appSettings.BaseUrl + _appSettings.GetAlarmWarningEndPoint;
                var alarmWarnings = _deviceService.GetAllAlarmWarning(getAlarmWarningEndPoint, authorizationToken);
                //old code

                ResponseDTO response = new ResponseDTO();
                if (alarmWarnings != null)
                {
                    response.StatusCode = "Success";
                    response.Message = "Successfully fetched the list.";
                    response.Data = alarmWarnings;
                }
                else
                {
                    response.StatusCode = "Warning";
                    response.Message = "Invalid request.";
                    response.Data = alarmWarnings;
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

        // GET: api/Device/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        [Authorize]
        [HttpPost("uploadBom/{companyId}/{deviceBatch}/{fileformat}/{bomType}")]
        [HttpPost, DisableRequestSizeLimit, RequestFormLimits(MultipartBodyLengthLimit = 1048576000)]
        public IActionResult UploadBom(string companyId, string deviceBatch, string fileformat, string bomType)
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var serviceEndpoint = _appSettings.BaseUrl + _appSettings.GetBomEndPoint;
            var file = Request.Form.Files;
            var Bom = new BomDTO();
            Bom.BomType = bomType;
            Bom.FileFormat = fileformat;
            Bom.BatchId = deviceBatch;
            Bom.CustomerId = companyId;
            // base64 conversion
            var stream = file[0].OpenReadStream();
            var bytes = new Byte[(int)stream.Length];

            stream.Seek(0, SeekOrigin.Begin);
            stream.Read(bytes, 0, (int)stream.Length);

            var base64Bom = Convert.ToBase64String(bytes);
            Bom.BomData = base64Bom;

            try
            {
                var result = _deviceService.Uploadbom(Bom, serviceEndpoint, authorizationToken);
                ResponseDTO response = new ResponseDTO();
                if (result != null)
                {
                    response.StatusCode = "Success";
                    response.Message = "Successfully fetched the list.";
                    response.Data = result;
                    CustomLogging.InfoLog(response.ToString(), _hostingEnvironment.ContentRootPath);
                    return Ok(response);
                }
                else
                {
                    response.StatusCode = "Warning";
                    response.Message = "Invalid request.";
                    response.Data = null;
                    return BadRequest(response);
                }




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
        [HttpPost("updateFirmware/{companyId}/{deviceBatch}/{fileformat}")]
        [HttpPost, DisableRequestSizeLimit, RequestFormLimits(MultipartBodyLengthLimit = 1048576000)]
        public IActionResult updateFirmware(string companyId, string deviceBatch, string fileformat)
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var serviceEndpoint = _appSettings.BaseUrl + _appSettings.GetFirmwareEndPoint;
            var file = Request.Form.Files;
            var firmware = new FirmwareDTO();
            firmware.BatchId = deviceBatch;
            firmware.CustomerId = companyId;
            firmware.FileFormat = fileformat;

            // File Name as Version 
            var fileName = file[0].FileName;
            string extension = System.IO.Path.GetExtension(fileName);
            string versionNumber = fileName.Substring(0, fileName.Length - extension.Length);
            firmware.FirmwareVersion = versionNumber;
            // base64 conversion
            var stream = file[0].OpenReadStream();
            var bytes = new Byte[(int)stream.Length];
            stream.Seek(0, SeekOrigin.Begin);
            stream.Read(bytes, 0, (int)stream.Length);
            var base64firmware = Convert.ToBase64String(bytes);
            firmware.FirmwareData = base64firmware;

            try
            {
                var result = _deviceService.UploadFirmware(firmware, serviceEndpoint, authorizationToken);
                ResponseDTO response = new ResponseDTO();
                if (result != null)
                {
                    response.StatusCode = "Success";
                    response.Message = "Successfully fetched the list.";
                    response.Data = result;
                    CustomLogging.InfoLog(response.ToString(), _hostingEnvironment.ContentRootPath);
                    return Ok(response);
                }
                else
                {
                    response.StatusCode = "Warning";
                    response.Message = "Invalid request.";
                    response.Data = null;
                    return BadRequest(response);
                }




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

        // POST: api/Device
        [Authorize]
        [HttpPost("addDevices")]
        public IActionResult AddDevices([FromBody] DeviceDTO device)
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            try
            {
                var createDeviceServiceEndpoint = _appSettings.BaseUrl + _appSettings.CreateDeviceEndpoint;
                var result = _deviceService.CreateFanDevices(device, createDeviceServiceEndpoint, authorizationToken);
                //var devices = _deviceService.AddDevices(device);
                ResponseDTO response = new ResponseDTO();
                if (result != null)
                {
                    response.StatusCode = "Success";
                    response.Message = "Successfully fetched the list.";
                    response.Data = result.Data;
                }
                else
                {
                    response.StatusCode = "Warning";
                    response.Message = "Invalid request.";
                    response.Data = result.Data;
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
        [HttpPost("updatedevice")]
        public IActionResult updatedevice([FromBody] DeviceDTO device)
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var createDeviceServiceEndpoint = _appSettings.BaseUrl + _appSettings.UpdateDeviceEndPoint;
            try
            {

                var result = _deviceService.UpdateFan(device, createDeviceServiceEndpoint, authorizationToken);
                ResponseDTO response = new ResponseDTO();
                if (result != null)
                {
                    response.StatusCode = "Success";
                    response.Message = "Successfully fetched the list.";
                    response.Data = result;
                }
                else
                {
                    response.StatusCode = "Warning";
                    response.Message = "Invalid request.";
                    response.Data = result;
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

        // PUT: api/Device/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
