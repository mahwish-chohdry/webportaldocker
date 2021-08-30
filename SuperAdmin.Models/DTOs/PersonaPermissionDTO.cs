using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Models.DTOs
{
    public class PersonaPermissionDTO
    {
        public int Id { get; set; }
        public int? PersonaId { get; set; }
        public int? FormId { get; set; }
    }
}
