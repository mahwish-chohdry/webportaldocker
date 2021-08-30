using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
    public class CustomerDeviceMaintenanceReportDTO
    {
        public List<MaintenanceReportDTO> pendingDevice { get; set; }

        public List<MaintenanceReportDTO> maintainedDevice { get; set; }
    }
}
