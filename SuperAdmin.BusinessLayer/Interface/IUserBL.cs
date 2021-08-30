using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SuperAdmin.Models.Models;

namespace SuperAdmin.BusinessLayer.Interface
{
    public interface IUserBL
    {
        User InsertUser(User role);
        User UpdateUser(User role);
        IEnumerable<User> GetUsers();
        bool DeleteUser(int roleId);
        User GetUser(int Id);
        IQueryable<User> QueryUser();
        User GetUserbyEmail(string email);

        
    }
}
