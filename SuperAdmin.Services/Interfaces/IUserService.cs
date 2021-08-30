using System;
using System.Collections.Generic;
using System.Text;
using SuperAdmin.Models;
using SuperAdmin.Models.DTOs;
using SuperAdmin.Models.Models;

namespace SuperAdmin.Services.Interfaces
{
    public interface IUserService
    {
        UserProfileDTO Authenticate(string username, string password, string endpoint);
        User Create(User user, string password);


        List<RoleDTO> GetRoles(string endPoint, string authorizationToken);

        List<UserDto> GetUsers(string endPoint, string authorizationToken, string customerId);
        UserDto UpdateUser(string endPoint, string authorizationToken, UserDto userDto);
        UserDto UpdateUserPassword(string endPoint, string authorizationToken, UserDto userDto);

        List<RoleDTO> GetRoleByPersona(string persona, string endPoint, string authorizationToken);

        RoleDTO GetRoleByPersonaAndRolename(string persona, string roleName, string endPoint, string authorizationToken);
        List<FormDTO> GetForm(string serviceEndpoint, string authorizationToken);

        FormDTO CreateForm(string serviceEndpoint, string authorizationToken, string formName);

        ResponseDTO DeleteForm(string serviceEndpoint, string authorizationToken, string formId);

        FormDTO UpdateForm(string serviceEndpoint, string authorizationToken, string formId, string formName);

        List<PersonasRolePermissionsDTO> GetRolePermission(string serviceEndpoint, string authorizationToken);

        PersonasRolePermissionsDTO CreateRolePermission(string serviceEndpoint, string authorizationToken, RolePermissionDTO rolepermission);

        ResponseDTO DeleteRolePermission(string serviceEndpoint, string authorizationToken, string rolepermissionId);

        RolePermissionDTO UpdateRolePermission(string serviceEndpoint, string authorizationToken, RolePermissionDTO rolepermission);

        UserPermissionManagement GetUserPermissions(string serviceEndpoint, string authorizationToken, string customerId, string userId);

        ResponseDTO ResetPassword(string serviceEndpoint, string authorizationToken, ResetPasswordDTO resetPassword);
    }
}

