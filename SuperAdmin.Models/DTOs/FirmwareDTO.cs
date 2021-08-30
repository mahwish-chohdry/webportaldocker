using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
    public class FirmwareDTO
    {

        public string BatchId { get; set; }
        public string CustomerId { get; set; }
        public string FirmwareData { get; set; }
        public string FirmwareVersion { get; set; }
        public string FileFormat { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
