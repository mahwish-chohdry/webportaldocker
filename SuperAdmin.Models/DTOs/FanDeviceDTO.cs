using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
   public   class FanDeviceDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DeviceId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public short? IsActive { get; set; }
        public short? IsDeleted { get; set; }
        public string DeviceCode { get; set; }
        public int? CustomerId { get; set; }
        public short? IsInstalled { get; set; }
        public DateTime? LastMaintenanceDate { get; set; }
        public string Apssid { get; set; }
        public string Appassword { get; set; }
        public string connectivityStatus { get; set; }

        public List<Devicestatus> Devicestatus { get; set; }
    }
}
