using SuperAdmin.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models
{
    public class CompanyDTO
    {
        public int Id { get; set; }
        public UserLoginDTO Admin { get; set; }
        public string Name { get; set; }
        public string CompanyType { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string CreatedBy { get; set; }
        public string Language { get; set; }
        public CompanyDTO()
        {
            Language = "en";
        }
    }
}
