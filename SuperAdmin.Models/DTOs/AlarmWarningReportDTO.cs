using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
    public class AlarmWarningReportDTO
    {
        public string deviceId { get; set; }
        public string deviceName { get; set; }
        public string deviceCode { get; set; }
        public string deviceStatus { get; set; }
        public string Type { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string ReasonAnalysis { get; set; }
        public int RegisterNumber { get; set; }
        public string timestamp { get; set; }
    }
}
