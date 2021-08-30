using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
    public class CustomerDTO
    {
        public int Id { get; set; }
        public UserLoginDTO Admin { get; set; }
        public string Name { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public short? IsActive { get; set; }
        public short? IsDeleted { get; set; }
        public string CustomerId { get; set; }
        public string CustomerType { get; set; }
        public string Address { get; set; }
        public string Language { get; set; }
        public CustomerDTO()
        {
            Language = "en";
        }

    }
}
