using System;
using System.Linq;
using SuperAdmin.Common;
using Microsoft.EntityFrameworkCore;
using SuperAdmin.Models;
using SuperAdmin.Models.Models;
using SuperAdmin.Services.Interfaces;
using SuperAdmin.BusinessLayer.Interface;
using SuperAdmin.Models.DTOs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading;

namespace SuperAdmin.Services
{
    
    public class UserService : IUserService
    {
        private SmartAdminPortalContext _context;
        private IUserBL _userBL;

        public UserService(SmartAdminPortalContext context,IUserBL userBL)
        {
            _userBL = userBL;
            _context = context;
        }

        public UserProfileDTO Authenticate(string email, string password,string serviceEndpoint)
        {
            var data = new LoginDTO();
            data.deviceType = "portal";
            data.email = email;
            data.password = password;

            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall(JsonConvert.SerializeObject(data), serviceEndpoint, "Post"));

            if (response.StatusCode == "Success")
            {


                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<UserProfileDTO>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }


        }
        public User Create(User user, string password)
        {
            // validation
            if (string.IsNullOrWhiteSpace(password))
                throw new AppException("Password is required");

            //if (_context.User.Any(x => x.Email == user.Email))
            //    throw new AppException("Email \"" + user.Email + "\" is already taken");

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);
            
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.UserTypeId = 1;
            _userBL.InsertUser(user);
           // _context.User.Add(user);
            //_context.SaveChanges();

            return user;
        }
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }
      

        public List<RoleDTO> GetRoles(string serviceEndpoint, string authorizationToken)
        {
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", serviceEndpoint, "Get", authorizationToken));

            if (response.StatusCode == "Success")
            {


                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<List<RoleDTO>>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }
        }

        public List<RoleDTO> GetRoleByPersona(string persona,string serviceEndpoint, string authorizationToken)
        {
            var roleByPersonaEndpoint = serviceEndpoint + persona;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", roleByPersonaEndpoint, "Get", authorizationToken));

            if (response.StatusCode == "Success")
            {


                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<List<RoleDTO>>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }
        }

        public RoleDTO GetRoleByPersonaAndRolename(string persona, string roleName, string endPoint, string authorizationToken)
        {
            var GetRoleByPersonaAndRolename = endPoint + roleName + "&personaName=" + persona;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", GetRoleByPersonaAndRolename, "Get", authorizationToken));

            if (response.StatusCode == "Success")
            {


                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<RoleDTO>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }
        }

        public List<FormDTO> GetForm(string serviceEndpoint, string authorizationToken)
        {
           
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", serviceEndpoint, "Get", authorizationToken));


            if (response.StatusCode == "Success")
            {


                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<List<FormDTO>>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }
        }

        public FormDTO CreateForm(string serviceEndpoint, string authorizationToken, string formName)
        {
            var endpoint = serviceEndpoint + formName;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "Post", authorizationToken));
           
            if (response.StatusCode == "Success")
            {


                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<FormDTO>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }
        }

        public ResponseDTO DeleteForm(string serviceEndpoint, string authorizationToken, string formId)
        {
            var endpoint = serviceEndpoint + formId;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "Post", authorizationToken));


            if (response.StatusCode == "Success")
            {


                return response;
            }
            else
            {
                throw new AppException(response);
            }
        }

        public FormDTO UpdateForm(string serviceEndpoint, string authorizationToken, string formId, string formName)
        {
            var endpoint = serviceEndpoint + formId + "/" + formName;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "Post", authorizationToken));

            if (response.StatusCode == "Success")
            {


                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<FormDTO>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }
        }

        public List<PersonasRolePermissionsDTO> GetRolePermission(string serviceEndpoint, string authorizationToken)
        {
            
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", serviceEndpoint, "Get", authorizationToken));

            if (response.StatusCode == "Success")
            {


                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<List<PersonasRolePermissionsDTO>>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }
        }

        public PersonasRolePermissionsDTO CreateRolePermission(string serviceEndpoint, string authorizationToken, RolePermissionDTO rolepermission)
        {
            var endpoint = serviceEndpoint;
           
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall(JsonConvert.SerializeObject(rolepermission), endpoint, "Post", authorizationToken));
           
            if (response.StatusCode == "Success")
            {


                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<PersonasRolePermissionsDTO>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }
        }

        public ResponseDTO DeleteRolePermission(string serviceEndpoint, string authorizationToken, string rolepermissionId)
        {
            var endpoint = serviceEndpoint + rolepermissionId;

            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "Post", authorizationToken));

            if (response.StatusCode == "Success")
            {
                return response;
            }
            else
            {
                throw new AppException(response);
            }
        }

        public RolePermissionDTO UpdateRolePermission(string serviceEndpoint, string authorizationToken, RolePermissionDTO rolepermission)
        {
            var endpoint = serviceEndpoint;

            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall(JsonConvert.SerializeObject(rolepermission), endpoint, "Post", authorizationToken));

            if (response.StatusCode == "Success")
            {
                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<RolePermissionDTO>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }
            }
            else
            {
                throw new AppException(response);
            }
        }

        public UserPermissionManagement GetUserPermissions(string serviceEndpoint, string authorizationToken, string customerId, string userId)
        {
            var endpoint = serviceEndpoint + customerId + "/" + userId;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "Get", authorizationToken));

            if (response.StatusCode == "Success")
            {
                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<UserPermissionManagement>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }
            }
            else
            {
                throw new AppException(response);
            }
        }

        public List<UserDto> GetUsers(string endPoint, string authorizationToken, string customerId)
        {
            endPoint = endPoint + "customerId=" + customerId;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endPoint, "Get", authorizationToken));
            if (response.StatusCode == "Success")
            {
                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<List<UserDto>>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }
            }
            else
            {
                throw new AppException(response);
            }
        }

        public UserDto UpdateUser(string endPoint, string authorizationToken, UserDto userDto)
        {
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall(JsonConvert.SerializeObject(userDto), endPoint, "Post", authorizationToken));
            if (response.StatusCode == "Success")
            {
                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<UserDto>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }
            }
            else
            {
                throw new AppException(response);
            }
        }


        public UserDto UpdateUserPassword(string endPoint, string authorizationToken, UserDto userDto)
        {
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall(JsonConvert.SerializeObject(userDto), endPoint, "Post", authorizationToken));
            if (response.StatusCode == "Success")
            {
                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<UserDto>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }
            }
            else
            {
                throw new AppException(response);
            }
        }

        public ResponseDTO ResetPassword(string serviceEndpoint, string authorizationToken, ResetPasswordDTO resetPassword)
        {
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall(JsonConvert.SerializeObject(resetPassword), serviceEndpoint, "Post", authorizationToken));
            if (response.StatusCode == "Success")
                return response;
            else
                throw new AppException(response);
        }
    }
}
