using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
    public class LoginDTO
    { 
       public  string email { get; set; }
       public  string password { get; set; }
       public  string deviceType { get; set; }
       public  string deviceIdentifier { get; set; }
    }
}
