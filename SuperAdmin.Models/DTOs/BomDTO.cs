using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
   public class BomDTO
    {
        public string BatchId { get; set; }
        public string CustomerId { get; set; }
        public string BomData { get; set; }
        public string BomType { get; set; }
        public string FileFormat { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
