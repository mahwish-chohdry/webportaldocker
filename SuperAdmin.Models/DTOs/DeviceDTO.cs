using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
    public class DeviceDTO
    {
        public int companyId { get; set; }
        public int deviceId { get; set; }
        public string batchId { get; set; }
        public string companyName { get; set; }
        public string deviceSerialId { get; set; }
        public string deviceName { get; set; }
        public string devicePrefix { get; set; }
        public int startRange { get; set; }
        public int endRange { get; set; }
        public string createdBy { get; set; }
       
    }
}
