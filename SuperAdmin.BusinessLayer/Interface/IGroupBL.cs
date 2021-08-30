using SuperAdmin.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SuperAdmin.BusinessLayer.Interface
{
    public interface IGroupBL
    {
        Group InsertGroup(Group company);
        Group UpdateGroup(Group company);
        IEnumerable<Group> GetGroupies();
        bool DeleteGroup(int companyId);
        Group GetGroup(int Id);
        IQueryable<Group> QueryGroup();
    }
}
