using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
   public class FormDTO
    {
        public int Id { get; set; }
        public string FormId { get; set; }
        public string FormName { get; set; }
        public string IsActive { get; set; }
        public string CreatedDate { get; set; }
    }
}
