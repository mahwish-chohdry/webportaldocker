using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SuperAdmin.Models.Models
{
    public partial class Group
    {
        public Group()
        {
            DeviceGroup = new HashSet<DeviceGroup>();
            UserGroup = new HashSet<UserGroup>();
        }

        [Key]
        [Column("groupID")]
        public int GroupId { get; set; }
        [Required]
        [Column("groupName")]
        [StringLength(50)]
        public string GroupName { get; set; }
        public int CompanyId { get; set; }

        [InverseProperty("Group")]
        public virtual ICollection<DeviceGroup> DeviceGroup { get; set; }
        [InverseProperty("Group")]
        public virtual ICollection<UserGroup> UserGroup { get; set; }
    }
}
