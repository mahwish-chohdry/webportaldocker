using SuperAdmin.BusinessLayer.Interface;
using SuperAdmin.Models.Models;
using SuperAdmin.Repository.Concrete;
using SuperAdmin.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SuperAdmin.BusinessLayer.Concrete
{
    public class GroupBL : IGroupBL
    {
        private readonly IUnitOfWork uow;
        private SmartAdminPortalContext context;
        private IRepository<Group> repo;

        public GroupBL(SmartAdminPortalContext Context)
        {
            context = Context;
            uow = new UnitOfWork<SmartAdminPortalContext>(context);
            repo = uow.GetRepository<Group>();

        }
        public bool DeleteGroup(int companyId)
        {
            try
            {
                //repo.Delete(companyId);
                //uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw ex;

            }
        }

        public Group GetGroup(int Id)
        {
            try
            {
                if (Id <= default(int))
                    throw new ArgumentException("Invalid id");
                return repo.Find(Id);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public IEnumerable<Group> GetGroupies()
        {
            try
            {
                return repo.GetList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public Group InsertGroup(Group company)
        {
            try
            {
                //repo.Add(company);
                //uow.SaveChanges();

                return company;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IQueryable<Group> QueryGroup()
        {
            try
            {
                return repo.Queryable();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public Group UpdateGroup(Group company)
        {
            try
            {
                //repo.Update(company);
                //uow.SaveChanges();
                return company;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
