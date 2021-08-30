using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SuperAdmin.Models.Models
{
    public partial class UserPermission
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        [Required]
        [Column("name")]
        [StringLength(50)]
        public string Name { get; set; }
        [Column("canView")]
        public bool CanView { get; set; }
        [Column("canInsert")]
        public bool CanInsert { get; set; }
        [Column("canUpdate")]
        public bool CanUpdate { get; set; }
        [Column("canDelete")]
        public bool CanDelete { get; set; }
        [Column("canExport")]
        public bool CanExport{ get; set; }
        [Column("userTypeID")]
        public int UserTypeId { get; set; }

        [ForeignKey(nameof(UserTypeId))]
        [InverseProperty("UserPermission")]
        public virtual UserType UserType { get; set; }
    }
}
