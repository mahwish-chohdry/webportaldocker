using SuperAdmin.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.EntityFrameworkCore;
using SuperAdmin.BusinessLayer.Interface;
using SuperAdmin.Repository.Concrete;
using SuperAdmin.Repository.Interface;

namespace SuperAdmin.BusinessLayer.Concrete
{
    public class UserBL : IUserBL
    {
        private readonly IUnitOfWork uow;
        private SmartAdminPortalContext context;
        private IRepository<User> repo;
        public UserBL(SmartAdminPortalContext Context)
        {
            context = Context;
            uow = new UnitOfWork<SmartAdminPortalContext>(context);
            repo = uow.GetRepository<User>();
        }
        public bool DeleteUser(int userId)
        {
            try
            {
                //repo.Delete(userId);
                //uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw ex;

            }
        }

        public User GetUser(int Id)
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

        public User GetUserbyEmail(string email)
        {
           return  repo.Queryable().Where(x => x.Email == email).Include(x=>x.Company). SingleOrDefault();
        }

        public IEnumerable<User> GetUsers()
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

        public User InsertUser(User user)
        {
            try
            {
                //repo.Add(user);
                //uow.SaveChanges();

                return user;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IQueryable<User> QueryUser()
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

        public User UpdateUser(User user)
        {
            try
            {
                //repo.Update(user);
                //uow.SaveChanges();
                return user;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
