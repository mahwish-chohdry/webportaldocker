using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SuperAdmin.BusinessLayer.Interface;
using SuperAdmin.Models.Models;
using SuperAdmin.Repository.Concrete;
using SuperAdmin.Repository.Interface;

namespace SuperAdmin.BusinessLayer.Concrete
{
    public class CompanyBL : ICompanyBL
    {
        private readonly IUnitOfWork uow;
        private SmartAdminPortalContext context;
        private IRepository<Company> repo;

        public CompanyBL(SmartAdminPortalContext Context)
        {
            context = Context;
            uow = new UnitOfWork<SmartAdminPortalContext>(context);
            repo = uow.GetRepository<Company>();
        }
        public bool DeleteCompany(int companyId)
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

        public IEnumerable<Company> GetCompanies()
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

        public Company GetCompany(int Id)
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

        public Company InsertCompany(Company company)
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

        public IQueryable<Company> QueryCompany()
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

        public Company UpdateCompany(Company company)
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
