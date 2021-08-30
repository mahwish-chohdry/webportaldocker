using AutoMapper;
using SuperAdmin.Models;
using SuperAdmin.Models.Models;
using SuperAdmin.Services;
using System;
using System.Collections.Generic;
using System.Text;
using SuperAdmin.BusinessLayer.Interface;
using SuperAdmin.Services.Interfaces;

namespace SuperAdmin.Services
{
    
    public class CompanyService : ICompanyService
    {
        private ICompanyBL _companyBl;
        public CompanyService(ICompanyBL companyBl)
        {
            _companyBl = companyBl;
        }
        public Company Create(Company Company)
        {
            _companyBl.InsertCompany(Company);
            return Company;
        }
        public IEnumerable<Company> getAllCompanies()
        {
           return _companyBl.GetCompanies();
        }
    }
}
