using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
    public class PersonasRolePermissionsDTO
    {
        public int Id { get; set; }
        public int? RoleId { get; set; }
        public int? FormId { get; set; }
        public bool? CanView { get; set; }
        public bool? CanInsert { get; set; }
        public bool? CanUpdate { get; set; }
        public bool? CanDelete { get; set; }
        public bool? CanExport { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string PersonaId { get; set; }

        public string PersonaName { get; set; }
    }
}
