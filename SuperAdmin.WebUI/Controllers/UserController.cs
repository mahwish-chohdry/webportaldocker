using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.Configuration;
using CommonSuperAdmin.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using SuperAdmin.Common;
using SuperAdmin.Models;
using SuperAdmin.Models.DTOs;
using SuperAdmin.Models.Models;
using SuperAdmin.Services;
using SuperAdmin.Services.Interfaces;

namespace SuperAdmin.WebUI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        IWebHostEnvironment _webHost { get; }
        private IUserService _userService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;
        IHostingEnvironment _hostingEnvironment { get; }

        public UserController(IWebHostEnvironment webHost,
            IUserService userService,
            IMapper mapper,
            IOptions<AppSettings> appSettings, IHostingEnvironment hostingEnvironment)
        {
            _webHost = webHost;
            _userService = userService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _hostingEnvironment = hostingEnvironment;
        }


        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] UserLoginDTO userDto)
        {
            var LoginEndPoint = _appSettings.BaseUrl + _appSettings.LoginEndPoint;

            var user = _userService.Authenticate(userDto.Email, userDto.Password, LoginEndPoint);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });


            var token = AppUtilities.generateAuthenticationToken(_appSettings.Secret, userDto.Email);
            Response.Headers.Add("API_Key", user.Token);


            //var endPoint = _appSettings.BaseUrl + _appSettings.GetUserPermission;
            // var authtoken = "Bearer " + token.ToString();
            //var userManagementPermission = _userService.GetUserPermissions(endPoint, authtoken, user.customerId, user.userId);
            // user.userPermission = userManagementPermission;
            // user.userPermission = item;
            return Ok(user);
        }

        [Authorize]
        [HttpGet("GetUserPermission/{customerId}/{userId}")]
        public IActionResult GetUserPermission(string customerId, string userId)
        {
            var endPoint = _appSettings.BaseUrl + _appSettings.GetUserPermission;
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];

            try
            {
                // save 
                var userManagementPermission = _userService.GetUserPermissions(endPoint, authorizationToken, customerId, userId);
                CustomLogging.InfoLog(userManagementPermission.ToString(), _hostingEnvironment.ContentRootPath);
                return Ok(userManagementPermission);
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
        [HttpPost("ResetPassword")]
        public IActionResult ResetPassword(ResetPasswordDTO resetPassword)
        {
            var endPoint = _appSettings.BaseUrl + _appSettings.ResetPasswordEndpoint;
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];

            try
            {
                // save 
                var result = _userService.ResetPassword(endPoint, authorizationToken, resetPassword);
                CustomLogging.InfoLog(result.ToString(), _hostingEnvironment.ContentRootPath);

                return Ok(result);
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

        [AllowAnonymous]
        [HttpGet("GetRoles")]
        public IActionResult GetRoles()
        {
            var RolesEndPoint = _appSettings.BaseUrl + _appSettings.GetRolesEndPoint;
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];

            try
            {
                // save 
                var roles = _userService.GetRoles(RolesEndPoint, authorizationToken);
                CustomLogging.InfoLog(roles.ToString(), _hostingEnvironment.ContentRootPath);
                return Ok(roles);
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
        [HttpGet("GetUsers")]
        public IActionResult GetUsers(string customerId)
        {
            var userEndPoint = _appSettings.BaseUrl + _appSettings.GetUsersEndpoint;
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];

            try
            {
                // save 
                var users = _userService.GetUsers(userEndPoint, authorizationToken, customerId);
                CustomLogging.InfoLog(users.ToString(), _hostingEnvironment.ContentRootPath);
                return Ok(users);
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
        [HttpPost("UpdateUser")]
        public IActionResult UpdateUser([FromBody] UserDto user)
        {
            var userEndPoint = _appSettings.BaseUrl + _appSettings.UpdateUsersEndpoint;
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];

            try
            {
                // save 
                var userObj = _userService.UpdateUser(userEndPoint, authorizationToken, user);
                CustomLogging.InfoLog(userObj.ToString(), _hostingEnvironment.ContentRootPath);
                return Ok(userObj);
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
        [HttpPost("UpdateUserPassword")]
        public IActionResult UpdateUserPassword([FromBody] UserDto user)
        {
            var userEndPoint = _appSettings.BaseUrl + _appSettings.UpdateUserPasswordEndpoint;
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];

            try
            {
                // save 
                var userObj = _userService.UpdateUserPassword(userEndPoint, authorizationToken, user);
                CustomLogging.InfoLog(userObj.ToString(), _hostingEnvironment.ContentRootPath);
                return Ok(userObj);
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

        [AllowAnonymous]
        [HttpGet("GetRoleByPersona/{persona}")]
        public IActionResult GetRoleByPersona(string persona)
        {
            var RolesEndPoint = _appSettings.BaseUrl + _appSettings.GetRolesbyPersonaEndPoint;
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];

            try
            {
                // save 
                var roles = _userService.GetRoleByPersona(persona, RolesEndPoint, authorizationToken);
                CustomLogging.InfoLog(roles.ToString(), _hostingEnvironment.ContentRootPath);
                return Ok(roles);
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

        [HttpGet("GetRoleByNameAndPersona/{roleName}/{personaName}")]
        [Authorize]
        public IActionResult GetRoleByNameAndPersona(string roleName, string personaName)
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var PersonaEndPoint = _appSettings.BaseUrl + _appSettings.GetRoleByNameAndPersonaEndPoint;

            try
            {
                var response = _userService.GetRoleByPersonaAndRolename(personaName, roleName, PersonaEndPoint, authorizationToken);
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

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody]UserDto userDto)
        {
            // map dto to entity
            var user = _mapper.Map<User>(userDto);

            try
            {
                // save 
                //var response = _userService.Create(user, userDto.Password);
                //CustomLogging.InfoLog(response.ToString(), _hostingEnvironment.ContentRootPath);
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


        [HttpGet("GetForm")]
        [Authorize]
        public IActionResult GetForm()
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var formEndPoint = _appSettings.BaseUrl + _appSettings.GetFormEndPoint;

            try
            {
                var response = _userService.GetForm(formEndPoint, authorizationToken);
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
        [HttpPost("CreateForm/{formName}")]
        public IActionResult CreateForm(string formName)
        {

            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var formEndPoint = _appSettings.BaseUrl + _appSettings.CreateFormEndPoint;
            try
            {

                var response = _userService.CreateForm(formEndPoint, authorizationToken, formName);
                if (response == null)
                {
                    return BadRequest();
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
        [HttpPost("UpdateForm/{formId}/{formName}")]
        public IActionResult UpdateForm(string formId, string formName)
        {

            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var formEndPoint = _appSettings.BaseUrl + _appSettings.UpdateFormEndPoint;

            try
            {
                var response = _userService.UpdateForm(formEndPoint, authorizationToken, formId, formName);
                if (response == null)
                {
                    return BadRequest();
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
        [HttpPost("DeleteForm/{formId}")]
        public IActionResult DeleteForm(string formId)
        {

            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var formEndPoint = _appSettings.BaseUrl + _appSettings.DeleteFormEndPoint;

            try
            {
                var response = _userService.DeleteForm(formEndPoint, authorizationToken, formId);
                if (response == null)
                {
                    return BadRequest();
                }
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

        [HttpGet("GetRolePermission")]
        [Authorize]
        public IActionResult GetRolePermission()
        {
            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var rolePermission = _appSettings.BaseUrl + _appSettings.GetRolePermissionEndPoint;

            try
            {
                var response = _userService.GetRolePermission(rolePermission, authorizationToken);
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
        [HttpPost("CreateRolePermission")]
        public IActionResult CreateRolePermission([FromBody] RolePermissionDTO rolePermissionDTO)
        {

            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var rolePermission = _appSettings.BaseUrl + _appSettings.CreateRolePermissionEndPoint;
            try
            {

                var response = _userService.CreateRolePermission(rolePermission, authorizationToken, rolePermissionDTO);
                if (response == null)
                {
                    return BadRequest();
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
        [HttpPost("UpdateRolePermission")]
        public IActionResult UpdateRolePermission([FromBody] RolePermissionDTO rolePermissionDTO)
        {

            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var rolePermission = _appSettings.BaseUrl + _appSettings.UpdateRolePermissionEndPoint;

            try
            {
                var response = _userService.UpdateRolePermission(rolePermission, authorizationToken, rolePermissionDTO);
                if (response == null)
                {
                    return BadRequest();
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
        [HttpPost("DeleteRolePermission/{rolePermissionId}")]
        public IActionResult DeleteRolePermission(string rolePermissionId)
        {

            var authorizationToken = HttpContext.Request?.Headers["Authorization"];
            var rolePermission = _appSettings.BaseUrl + _appSettings.DeleteRolePermissionEndPoint;

            try
            {
                var response = _userService.DeleteRolePermission(rolePermission, authorizationToken, rolePermissionId);
                if (response == null)
                {
                    return BadRequest();
                }
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