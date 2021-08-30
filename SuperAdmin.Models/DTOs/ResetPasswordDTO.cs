using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
    public class ResetPasswordDTO
    {
        public string currentPassword { get; set; }
        public string newPassword { get; set; }
        public string email { get; set; }
    }
}
