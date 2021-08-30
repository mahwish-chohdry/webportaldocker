using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SuperAdmin.BusinessLayer.Interface;
using SuperAdmin.Models.DTOs;
using SuperAdmin.Models.Models;
using SuperAdmin.Repository.Concrete;
using SuperAdmin.Repository.Interface;

namespace SuperAdmin.BusinessLayer.Concrete
{
    public class DeviceBL : IDeviceBL
    {
        private readonly IUnitOfWork uow;
        private SmartAdminPortalContext context;
        private IRepository<Device> repo;
        public DeviceBL(SmartAdminPortalContext Context)
        {
            context = Context;
            uow = new UnitOfWork<SmartAdminPortalContext>(context);
            repo = uow.GetRepository<Device>();
        }
        public bool DeleteDevice(int deviceId)
        {
            try
            {
                //repo.Delete(deviceId);
                //uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw ex;

            }
        }

        public Device GetDevice(int Id)
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

        public IEnumerable<Device> GetDevices()
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

        public Device InsertDevice(Device device)
        {
            try
            {
                //repo.Add(device);
                //uow.SaveChanges();

                return device;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IQueryable<Device> QueryDevices()
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

        public Device UpdateDevice(Device device)
        {
            try
            {
                //repo.Update(device);
                //uow.SaveChanges();
                return device;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool AddDevices(DeviceDTO deviceDTO)
        {
            try
            {
                for(int i = deviceDTO.startRange; i <= deviceDTO.endRange; i++)
                {
                    //Device device = new Device();
                    //device.DeviceName = deviceDTO.deviceName;
                    //device.DevicePrefix = deviceDTO.devicePrefix;
                    //device.CreatedBy = deviceDTO.createdBy;
                    //device.CompanyId = deviceDTO.companyId.ToString();
                    //device.CreatedDate = DateTime.Now;
                    //device.ModifiedDate = DateTime.Now;
                    //device.SerialNumber = deviceDTO.devicePrefix + i;
                    //repo.Add(device);
                }
                //uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        
    }
}
