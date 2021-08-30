using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SuperAdmin.Models.Models;

namespace SuperAdmin.BusinessLayer.Interface
{
   public  interface ICompanyBL
    {
        Company InsertCompany(Company company);
        Company UpdateCompany(Company company);
        IEnumerable<Company> GetCompanies();
        bool DeleteCompany(int companyId);
        Company GetCompany(int Id);
        IQueryable<Company> QueryCompany();
    }
}
