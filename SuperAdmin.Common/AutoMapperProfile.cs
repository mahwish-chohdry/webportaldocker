using AutoMapper;
using SuperAdmin.Models;
using SuperAdmin.Models.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace SuperAdmin.Common
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
            CreateMap<Company, CompanyDTO>();
            CreateMap<CompanyDTO, Company>();
        }
    }
}
