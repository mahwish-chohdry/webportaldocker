using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
    public class UserProfileDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string EmailAddress { get; set; }
        public int Customer_Id { get; set; }
        public string customerId { get; set; }
        public string Customertype { get; set; }
        public string role { get; set; }
        public string userId { get; set; }
        public string profileImage { get; set; }
        public string Token { get; set; }
        public UserPermissionManagement userPermission { get; set; }
    }
}
