using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SuperAdmin.Models.Models
{
    public partial class Company
    {
        public Company()
        {
            User = new HashSet<User>();
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string CompanyName { get; set; }
        
        [StringLength(50)]
        public string Phone { get; set; }
        [Required]
        [Column(TypeName = "ntext")]
        public string CompanyType { get; set; }
        [Column(TypeName = "ntext")]
        public string Address { get; set; }
        [StringLength(50)]
        public string CustomerId { get; set; }
        [StringLength(50)]
        public string CreatedBy { get; set; }
        [StringLength(50)]
        public string ModifiedBy { get; set; }
        [Column(TypeName = "date")]
        public DateTime? CreatedDate { get; set; }

        [InverseProperty("Company")]
        public virtual ICollection<User> User { get; set; }
    }
}
