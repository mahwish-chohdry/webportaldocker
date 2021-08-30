using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SuperAdmin.Models.Models
{
    public partial class User
    {
        public User()
        {
            UserDevice = new HashSet<UserDevice>();
            UserGroup = new HashSet<UserGroup>();
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        [StringLength(50)]
        public string Email { get; set; }
        public int UserTypeId { get; set; }
        public int? CompanyId { get; set; }
        public int? ParentId { get; set; }
        public string Password { get; set; }
        [Required]
        public byte[] PasswordSalt { get; set; }
        [Required]
        public byte[] PasswordHash { get; set; }

        [ForeignKey(nameof(CompanyId))]
        [InverseProperty("User")]
        public virtual Company Company { get; set; }
        [ForeignKey(nameof(UserTypeId))]
        [InverseProperty("User")]
        public virtual UserType UserType { get; set; }
        [InverseProperty("User")]
        public virtual ICollection<UserDevice> UserDevice { get; set; }
        [InverseProperty("User")]
        public virtual ICollection<UserGroup> UserGroup { get; set; }
    }
}
