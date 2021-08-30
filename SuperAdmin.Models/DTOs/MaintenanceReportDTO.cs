using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
     public class MaintenanceReportDTO
    {
        public string DeviceId { get; set; }
        public string DeviceName { get; set; }
        public string DeviceStatus { get; set; }
        public string Temperature { get; set; }
        public string RunningHours { get; set; }

        public string MaintenanceHour { get; set; }
        public string AverageUsagehour { get; set; }

        public string LastMaintenanceDate { get; set; }
        public string ExpectedMaintenanceDate { get; set; }
    }
}
