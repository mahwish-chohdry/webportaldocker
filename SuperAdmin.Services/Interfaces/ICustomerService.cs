using SuperAdmin.Models;
using SuperAdmin.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Services.Interfaces
{
    public interface ICustomerService
    {
        public ResponseDTO createCustomer(CustomerDTO customerDTO, string serviceEndPoint, string authorizationToken);
        public ResponseDTO updateCustomer(CustomerDTO customerDTO, string serviceEndPoint, string authorizationToken);

        public ResponseDTO CreateCustomerUser(string userId, string customerId, string roleType, string firstName, string lastName, string emailaddress, string lang, string serviceEndPoint, string authorizationToken);
        public List<CustomerDTO> getAllCustomers(string serviceEndPoint, string authorizationToken);

        public List<personaDTO> GetPersona(string serviceEndPoint, string authorizationToken);

        List<PersonaPermissionDTO> GetPersonaPermission(string serviceEndpoint, string authorizationToken);

        PersonaPermissionDTO CreatePersonaPermission(string serviceEndpoint, string authorizationToken, PersonaPermissionDTO rolepermission);

        ResponseDTO DeletePersonaPermission(string serviceEndpoint, string authorizationToken, string rolepermissionId);

        PersonaPermissionDTO UpdatePersonaPermission(string serviceEndpoint, string authorizationToken, PersonaPermissionDTO rolepermission);


    }
}
