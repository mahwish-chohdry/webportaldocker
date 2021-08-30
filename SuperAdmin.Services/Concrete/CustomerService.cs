using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SuperAdmin.Common;
using SuperAdmin.Models;
using SuperAdmin.Models.DTOs;
using SuperAdmin.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Services.Concrete
{
    public class CustomerService : ICustomerService
    {
        public ResponseDTO createCustomer(CustomerDTO customerDTO, string serviceEndpoint, string authorizationToken)
        {
            string createCustomerEndpoint = serviceEndpoint + customerDTO.CreatedBy + "/" + customerDTO.Name + "/" + customerDTO.CustomerType + "/" + customerDTO.Address + "/" + customerDTO.Admin.FirstName + "/" + customerDTO.Admin.LastName + "/" + customerDTO.Admin.Email + "/" + customerDTO.Language;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", createCustomerEndpoint,"Post", authorizationToken));

            if (response.StatusCode == "Success")
            {
                return response;
            }
            else
            {
                throw new AppException(response);
            }
        }

        public ResponseDTO CreateCustomerUser(string userId, string customerId, string roleType, string firstName, string lastName, string emailaddress, string lang, string serviceEndPoint, string authorizationToken)
        {
            var CreateCustomerUserEndpoint = serviceEndPoint + userId + "/" + customerId + "/" + roleType + "/" + firstName + "/" + lastName + "/" + emailaddress + "/" + lang;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", CreateCustomerUserEndpoint, "Post", authorizationToken));
            if (response.StatusCode == "Success")
            {

                return response;
            }
            else
            {
                throw new AppException(response);
            }
        }



        public List<CustomerDTO> getAllCustomers(string serviceEndpoint, string authorizationToken)
        {

            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", serviceEndpoint, "Get", authorizationToken));
            if (response.StatusCode == "Success")
            {


                var responseData = JsonConvert.DeserializeObject<List<CustomerDTO>>(response.Data.ToString());
                return responseData;
            }
            else
            {
                throw new AppException(response);
            }


        }

        public List<personaDTO> GetPersona(string serviceEndPoint, string authorizationToken)
        {
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", serviceEndPoint, "Get", authorizationToken));
            if (response.StatusCode == "Success")
            {

                var responseData = JsonConvert.DeserializeObject<List<personaDTO>>(response.Data.ToString());
                return responseData;
            }
            else
            {
                throw new AppException(response);
            }
        }



        public ResponseDTO updateCustomer(CustomerDTO customerDTO, string serviceEndPoint, string authorizationToken)
        {
            var endpoint = serviceEndPoint + customerDTO.Id + "/" + customerDTO.Name + "/" + customerDTO.CustomerType + "/" + customerDTO.Address;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "Post", authorizationToken));
            if (response.StatusCode == "Success")
                return response;
            else
                throw new AppException(response);

        }

        public List<PersonaPermissionDTO> GetPersonaPermission(string serviceEndpoint, string authorizationToken)
        {
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", serviceEndpoint, "Get", authorizationToken));

            if (response.StatusCode == "Success")
            {


                if (response.Data.ToString() != "[]")
                {
                    var personaPermissions = JsonConvert.DeserializeObject<List<PersonaPermissionDTO>>(response.Data.ToString());
                    return personaPermissions;
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
        public PersonaPermissionDTO UpdatePersonaPermission(string serviceEndpoint, string authorizationToken, PersonaPermissionDTO Personapermission)
        {
            var endpoint = serviceEndpoint;

            var response = JsonConvert.DeserializeObject < ResponseDTO > (AppUtilities.RestAPICall(JsonConvert.SerializeObject(Personapermission), endpoint, "Post", authorizationToken));

            if (response.StatusCode == "Success")
            {
                    if (response.Data.ToString() != "[]")
                    {
                        var personaPermission = JsonConvert.DeserializeObject<PersonaPermissionDTO>(response.Data.ToString());
                        return personaPermission;
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

        public PersonaPermissionDTO CreatePersonaPermission(string serviceEndpoint, string authorizationToken, PersonaPermissionDTO personapermission)
        {
            var endpoint = serviceEndpoint;

            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall(JsonConvert.SerializeObject(personapermission), endpoint, "Post", authorizationToken));
           
            if (response.StatusCode == "Success")
            {
                
                if (response.Data.ToString() != "[]")
                {
                    var personaPermission = JsonConvert.DeserializeObject<PersonaPermissionDTO>(response.Data.ToString());
                    return personaPermission;
                }
                throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
            }
            else
            {
                throw new AppException(response);
            }
        }

        public ResponseDTO DeletePersonaPermission(string serviceEndpoint, string authorizationToken, string personapermissionId)
        {
            var endpoint = serviceEndpoint + personapermissionId;

            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "Post", authorizationToken));

            if (response.StatusCode != "Success")
            {
                throw new AppException(response);
            }
            return response;


        }
    }
}
