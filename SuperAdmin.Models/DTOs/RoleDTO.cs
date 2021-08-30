using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
    public class RoleDTO
    {
        public int id { get; set; }
        public string role1 { get; set; }
        public string description { get; set; }
        public string isActive { get; set; }
        public string isDeleted { get; set; }
        public string createdBy { get; set; }
        public string createdDate { get; set; }
        public string modifiedBy { get; set; }

        public string modifiedDate { get; set; }
      
       
    }
}
