using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.Models
{
    public partial class FanDevice
    {
        public string customerId { get; set; }
        public string deviceName { get; set; }
        public string deviceId { get; set; }
        public string connectivityStatus { get; set; }
        public bool hasPermission { get; set; }
        public bool IsConfigured { get; set; }
        public string apSsid { get; set; }
        public string apPassword { get; set; }
        public string currentFirmwareVersion { get; set; }
        public string latestFirmwareVersion { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public FanDeviceStatus deviceStatus { get; set; }
    }
}
