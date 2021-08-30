using System;

namespace SuperAdmin.Models
{
    public class UserDto
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public int? CustomerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string UserId { get; set; }
        public string EmailAddress { get; set; }
        public string Password { get; set; }
        public string DeviceType { get; set; }
        public string DeviceIdentifier { get; set; }
        public string IdentityProvider { get; set; }
        public string DomainUserName { get; set; }
        public string ProfilePicture { get; set; }
        public short? IsActive { get; set; }
        public short? IsDeleted { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
