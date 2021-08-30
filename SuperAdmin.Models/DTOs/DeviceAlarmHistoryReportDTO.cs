using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
    public class DeviceAlarmHistoryReportDTO
    {
        public int DeviceId { get; set; }
        public int? Speed { get; set; }
        public int? Direction { get; set; }
        public string Warning { get; set; }
        public string Alarm { get; set; }
        public double? OutputFrequency { get; set; }
        public double? OutputCurrent { get; set; }
        public double? OutputVoltage { get; set; }
        public double? OutputPower { get; set; }
        public double? Rpm { get; set; }
        public string Title { get; set; }
        public string Code { get; set; }
        public string ReasonAnalysis { get; set; }
        public string Timestamp { get; set; }
    }
}

