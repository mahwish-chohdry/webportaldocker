using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SuperAdmin.Models.Models
{
    public partial class UserDevice
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        [Column("userId")]
        public int UserId { get; set; }
        [Column("deviceId")]
        public int DeviceId { get; set; }

        [ForeignKey(nameof(DeviceId))]
        [InverseProperty("UserDevice")]
        public virtual Device Device { get; set; }
        [ForeignKey(nameof(UserId))]
        [InverseProperty("UserDevice")]
        public virtual User User { get; set; }
    }
}
