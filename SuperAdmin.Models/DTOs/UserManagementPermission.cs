using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
   public  class UserPermissionManagement
    {
        public string PersonaName { get; set; }
        public List<roleFormPermission> RolePermission { get; set; }
        public List<personaFormPermission> PersonaPermission { get; set; }
        public string RoleName { get; set; }
    }

    public class personaFormPermission
    {

        public string FormName { get; set; }


    }
    public class roleFormPermission
    {
        public string FormId { get; set; }
        public string FormName { get; set; }
        public bool? CanView { get; set; }
        public bool? CanInsert { get; set; }
        public bool? CanUpdate { get; set; }
        public bool? CanDelete { get; set; }
        public bool? CanExport { get; set; }
    }
}
