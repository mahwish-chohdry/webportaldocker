using System;
using System.Collections.Generic;
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
using SuperAdmin.Models;
using SuperAdmin.Models.DTOs;
using SuperAdmin.Models.Models;
using SuperAdmin.Services.Interfaces;

namespace SuperAdmin.WebUI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        IWebHostEnvironment _webHost { get; }
        private ICompanyService _companyService;
        private ICustomerService _customerService;
        private IUserService _userService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;
        IHostingEnvironment _hostingEnvironment { get; }

        public CompanyController(IWebHostEnvironment webHost, ICompanyService companyService, ICustomerService customerService, IUserService userService, IMapper mapper,
            IOptions<AppSettings> appSettings, IHostingEnvironment hostingEnvironment)
        {
            _webHost = webHost;
            _customerService = customerService;

            _userService = userService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _hostingEnvironment = hostingEnvironment;
        }
        [HttpPost("update")]
        [Authorize]
        public IActionResult update([FromBody] CustomerDTO Company)
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var updateCustomerEndpoint = _appSettings.BaseUrl + _appSettings.UpdateCustomerEndpoint;

            try
            {
                var response = _customerService.updateCustomer(Company, updateCustomerEndpoint, authorizationToken);
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


        [HttpGet("GetPersonas")]
        [Authorize]
        public IActionResult GetPersonas()
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var updateCustomerEndpoint = _appSettings.BaseUrl + _appSettings.PersonasEndPoint;

            try
            {
                var response = _customerService.GetPersona(updateCustomerEndpoint, authorizationToken);
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



        // POST: api/Company

        [HttpPost("create")]
        [Authorize]
        public IActionResult create([FromBody] CustomerDTO Company)
        {
            //var company = _mapper.Map<Company>(Company);
            //var user = _mapper.Map<User>(Company.Admin);
            //company.CompanyName = Company.Name;
            //company.CustomerId = Company.Name;

            if (HttpContext != null && HttpContext.User != null && HttpContext.User.Identity != null && !string.IsNullOrEmpty(HttpContext.User.Identity.Name))
            {
                Company.CreatedBy = HttpContext.User.Identity.Name;
            }

            try
            {
                //Creating fan customer 
                var authorizationToken = HttpContext.Request?.Headers["Authorization"];
                var response = _customerService.createCustomer(Company, _appSettings.BaseUrl + _appSettings.CustomerEndpoint, authorizationToken);

                CustomLogging.InfoLog(response.ToString(), _hostingEnvironment.ContentRootPath);
                return Ok(new
                {
                    companyName = Company.Name,
                    //phone = Company.Phone,
                    customerType = Company.CustomerType,
                    address = Company.Address
                });

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


        [HttpPost("CreateCustomerUser/{userId}/{customerId}/{roleType}/{firstName}/{lastName}/{emailaddress}/{lang}")]
        [Authorize]
        public IActionResult CreateCustomerUser(string userId, string customerId, string roleType, string firstName, string lastName, string emailaddress, string lang)
        {

            try
            {
                var authorizationToken = HttpContext.Request?.Headers["Authorization"];
                var response = _customerService.CreateCustomerUser(userId, customerId, roleType, firstName, lastName, emailaddress, lang, _appSettings.BaseUrl + _appSettings.CreateCustomerUserEndPoint, authorizationToken);
                CustomLogging.InfoLog(response.ToString(), _hostingEnvironment.ContentRootPath);
                return Ok();
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


        [HttpGet("getAllCompanies")]
        [Authorize]
        public IActionResult getAllCompanies()
        {
            try
            {
                var authorizationToken = HttpContext.Request?.Headers["Authorization"];
                var getCustomerEndpoint = _appSettings.BaseUrl + _appSettings.GetCustomerEndpoint;
                // get customers
                var Customers = _customerService.getAllCustomers(getCustomerEndpoint, authorizationToken);

                //Portal Code
                //var companies = _companyService.getAllCompanies();
                ResponseDTO response = new ResponseDTO();
                if (Customers != null)
                {
                    response.StatusCode = "Success";
                    response.Message = "Successfully fetched the list.";
                    response.Data = Customers;
                }
                else
                {
                    response.StatusCode = "Warning";
                    response.Message = "Invalid request.";
                    response.Data = Customers;
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

        [HttpGet("getCompanyList")]
        [Authorize]
        public IActionResult getCompanyList()
        {
            try
            {
                var authorizationToken = HttpContext.Request?.Headers["Authorization"];
                var getCustomerEndpoint = _appSettings.BaseUrl + _appSettings.GetCustomerEndpoint;
                // get customers
                var Customers = _customerService.getAllCustomers(getCustomerEndpoint, authorizationToken).OrderBy(x => x.Name);

                //Portal Code
                //var companies = _companyService.getAllCompanies();
                ResponseDTO response = new ResponseDTO();
                if (Customers != null)
                {
                    response.StatusCode = "Success";
                    response.Message = "Successfully fetched the list.";
                    response.Data = Customers;
                }
                else
                {
                    response.StatusCode = "Warning";
                    response.Message = "Invalid request.";
                    response.Data = Customers;
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


        [HttpGet("GetPersonaPermission")]
        [Authorize]
        public IActionResult GetPersonaPermission()
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var PersonaEndPoint = _appSettings.BaseUrl + _appSettings.GetPersonaPermissionEndPoint;

            try
            {
                var response = _customerService.GetPersonaPermission(PersonaEndPoint, authorizationToken);
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
        [HttpPost("CreatePersonaPermission")]
        public IActionResult CreatePersonaPermission([FromBody] PersonaPermissionDTO personaPermission)
        {

            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var PersonaEndPoint = _appSettings.BaseUrl + _appSettings.CreatePersonaPermissionEndPoint;
            try
            {

                var response = _customerService.CreatePersonaPermission(PersonaEndPoint, authorizationToken, personaPermission);
                if (response == null)
                {
                    return BadRequest(response);
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
        [HttpPost("UpdatePersonaPermission")]
        public IActionResult UpdatePersonaPermission([FromBody] PersonaPermissionDTO personaPermission)
        {

            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var PersonaEndPoint = _appSettings.BaseUrl + _appSettings.UpdatePersonaPermissionEndPoint;

            try
            {
                var response = _customerService.UpdatePersonaPermission(PersonaEndPoint, authorizationToken, personaPermission);
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
        [HttpPost("DeletePersonaPermission/{rolePermissionId}")]
        public IActionResult DeletePersonaPermission(string rolePermissionId)
        {

            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var PersonaEndPoint = _appSettings.BaseUrl + _appSettings.DeletePersonaPermissionEndPoint;

            try
            {
                var response = _customerService.DeletePersonaPermission(PersonaEndPoint, authorizationToken, rolePermissionId);
                CustomLogging.InfoLog(response.ToString(), _hostingEnvironment.ContentRootPath);
                return Ok();

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
