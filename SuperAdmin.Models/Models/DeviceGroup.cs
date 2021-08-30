using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SuperAdmin.Models.Models
{
    public partial class DeviceGroup
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        [Column("deviceID")]
        public int DeviceId { get; set; }
        [Column("GroupID")]
        public int GroupId { get; set; }

        [ForeignKey(nameof(DeviceId))]
        [InverseProperty("DeviceGroup")]
        public virtual Device Device { get; set; }
        [ForeignKey(nameof(GroupId))]
        [InverseProperty("DeviceGroup")]
        public virtual Group Group { get; set; }
    }
}
