using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
    public  class AlarmWarningDTO
    {
        public string Type { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string ReasonAnalysis { get; set; }
        public string RegisterNumber { get; set; }
    }
}
