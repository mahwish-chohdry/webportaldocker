using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SuperAdmin.Models.Models
{
    public partial class Device
    {
        public Device()
        {
            DeviceGroup = new HashSet<DeviceGroup>();
            UserDevice = new HashSet<UserDevice>();
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string DeviceName { get; set; }
        [Required]
        [StringLength(50)]
        public string DevicePrefix { get; set; }
        [Column("isActive")]
        public bool IsActive { get; set; }
        [Column("isConfigured")]
        public bool IsConfigured { get; set; }
        [Column("isOnline")]
        public bool IsOnline { get; set; }
        [Required]
        [StringLength(50)]
        public string SerialNumber { get; set; }
        [StringLength(50)]
        public string CompanyId { get; set; }
        [StringLength(50)]
        public string CreatedBy { get; set; }
        [Column(TypeName = "date")]
        public DateTime? CreatedDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? ModifiedDate { get; set; }

        [InverseProperty("Device")]
        public virtual ICollection<DeviceGroup> DeviceGroup { get; set; }
        [InverseProperty("Device")]
        public virtual ICollection<UserDevice> UserDevice { get; set; }
    }
}
