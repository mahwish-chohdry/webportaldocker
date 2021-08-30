using SuperAdmin.BusinessLayer.Interface;
using SuperAdmin.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Services.Concrete
{
    public class GroupService:IGroupService
    {
        private IGroupBL _groupBl;
        public GroupService(IGroupBL groupBL)
        {
            _groupBl = groupBL;
        }
    }
}
