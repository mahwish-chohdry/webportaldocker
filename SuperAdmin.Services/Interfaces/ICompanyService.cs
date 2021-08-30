using System;
using System.Collections.Generic;
using System.Text;
using SuperAdmin.Models.Models;

namespace SuperAdmin.Services.Interfaces
{
    public interface ICompanyService
    {
        Company Create(Company company);
       
        IEnumerable<Company> getAllCompanies();
    }
}
