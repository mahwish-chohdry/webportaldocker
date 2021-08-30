using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SuperAdmin.Models.DTOs;
using SuperAdmin.Models.Models;

namespace SuperAdmin.BusinessLayer.Interface
{
    public interface IDeviceBL
    {
        Device InsertDevice(Device device);
        Device UpdateDevice(Device device);
        IEnumerable<Device> GetDevices();
       
        bool DeleteDevice(int deviceId);
        Device GetDevice(int Id);
        IQueryable<Device> QueryDevices();
        bool AddDevices(DeviceDTO deviceDTO);
        
    }
}
