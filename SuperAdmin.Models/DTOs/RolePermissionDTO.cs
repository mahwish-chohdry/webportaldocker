using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
    public class RolePermissionDTO
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public int FormId { get; set; }
        public bool? CanView { get; set; }
        public bool? CanInsert { get; set; }
        public bool? CanUpdate { get; set; }
        public bool? CanDelete { get; set; }
        public bool? CanExport { get; set; }
        public bool? IsActive { get; set; }
        public string CreatedDate { get; set; }
    }
}
