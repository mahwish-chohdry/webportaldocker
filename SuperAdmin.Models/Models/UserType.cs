using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SuperAdmin.Models.Models
{
    public partial class UserType
    {
        public UserType()
        {
            User = new HashSet<User>();
            UserPermission = new HashSet<UserPermission>();
        }

        [Key]
        [Column("userTypeID")]
        public int UserTypeId { get; set; }
        [Required]
        [Column("typeName")]
        [StringLength(50)]
        public string TypeName { get; set; }

        [InverseProperty("UserType")]
        public virtual ICollection<User> User { get; set; }
        [InverseProperty("UserType")]
        public virtual ICollection<UserPermission> UserPermission { get; set; }
    }
}
