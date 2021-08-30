using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.Models
{
    public partial class DeviceStats
    {
        public int TotalDevices { get; set; }
        public int UnConfigured { get; set; }
        public int Configured { get; set; }
        public int Online { get; set; }
        public int Offline { get; set; }
        public int Firmware { get; set; }

        public DeviceStats()
        {
            TotalDevices = 0;
            UnConfigured = 0;
            Configured = 0;
            Online = 0;
            Offline = 0;
            Firmware = 0;
        }
    }
}
