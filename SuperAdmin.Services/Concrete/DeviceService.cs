using System;
using System.Collections.Generic;
using System.Text;
using SuperAdmin.BusinessLayer.Interface;
using SuperAdmin.Models.DTOs;
using SuperAdmin.Models.Models;
using SuperAdmin.Services.Interfaces;
using SuperAdmin.Common;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace SuperAdmin.Services.Concrete
{
    public class DeviceService : IDeviceService
    {
        private IDeviceBL _deviceBL;
        public DeviceService(IDeviceBL deviceBL)
        {
            _deviceBL = deviceBL;
        }
        public IEnumerable<Device> AddDevices(DeviceDTO deviceDTO)
        {
            bool status = _deviceBL.AddDevices(deviceDTO);
            if (status)
            {
                return _deviceBL.GetDevices();
            }
            else
            {
                return null;
            }
        }

        public ResponseDTO CreateFanDevices(DeviceDTO deviceDTO, string createDeviceEndPoint, string authorizationToken)
        {
            var endpoint = createDeviceEndPoint + deviceDTO.devicePrefix + "&startRange=" + deviceDTO.startRange + "&endRange=" + deviceDTO.endRange + "&customerId=" + deviceDTO.companyName + "&BatchId=" + deviceDTO.batchId;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "Post", authorizationToken));
            if (response.StatusCode == "Success")
                return response;
            else
                throw new AppException(response);


        }

        public List<UsageReportDTO> FanUsageReport(string serviceEndPoint, string customerId, string emailId, string device, string Date, string Days, string authorizationToken)
        {
            var endpoint = serviceEndPoint + customerId + "/" + emailId + "/" + device + "/" + Date + "/" + Days;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "GET", authorizationToken));
            if (response.StatusCode == "Success")
            {


                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<List<UsageReportDTO>>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }

        }

        public List<UsageReportDTO> FanAllUsageReport(string serviceEndPoint, string customerId, string emailId, string Date, string Days, string authorizationToken)
        {
            var endpoint = serviceEndPoint + customerId + "/" + emailId + "/" + Date + "/" + Days;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "GET", authorizationToken));
            if (response.StatusCode == "Success")
            {
                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<List<UsageReportDTO>>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }

        }

        public List<AlarmWarningDTO> GetAllAlarmWarning(string serviceEndPoint, string authorizationToken)
        {
            var endpoint = serviceEndPoint;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "GET", authorizationToken));
            if (response.StatusCode == "Success")
            {
                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<List<AlarmWarningDTO>>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }
        }

        public List<AlarmWarningReportDTO> GetAllAlarmWarningReport(string serviceEndPoint, string authorizationToken, string customerId, string batchId, string deviceId, string Date)
        {
            var endpoint = serviceEndPoint;
            if (customerId != "null")
            {
                endpoint = endpoint + "&Customer=" + customerId;
            }

            if (batchId != "null")
            {
                endpoint = endpoint + "&BatchId=" + batchId;
            }

            if (deviceId != "null")
            {
                endpoint = endpoint + "&DeviceId=" + deviceId;
            }

            if (Date != "null")
            {
                endpoint = endpoint + "&Date=" + Date;
            }
            //var endpoint = serviceEndPoint + customerId + "&BatchId=" + batchId + "&DeviceId=" + deviceId + "&Date=" + Date;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "Get", authorizationToken));
            if (response.StatusCode == "Success")
            {
                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<List<AlarmWarningReportDTO>>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }
        }

        public List<BatchDTO> GetAllBatchId(string serviceEndPoint, string authorizationToken)
        {
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", serviceEndPoint, "Get", authorizationToken));

            if (response.StatusCode == "Success")
            {
                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<List<BatchDTO>>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }
        }

        public IEnumerable<Device> getAllDevices()
        {
            //get fan device 

            return _deviceBL.GetDevices();
        }

        public List<FanDeviceDTO> UpdateFanStatus(List<FanDeviceDTO> FanList)
        {
            foreach (var fan in FanList)
            {
                if (Convert.ToBoolean(fan.IsInstalled))
                {
                    DateTime modifiedDate = (DateTime)fan.Devicestatus[0].ModifiedDate;
                    fan.connectivityStatus = GetStatusMessage(modifiedDate);
                }
                else
                {
                    fan.connectivityStatus = "Offline";
                }
            }

            return FanList;
        }

        public static string GetStatusMessage(DateTime lastRecord)
        {
            var statusMessage = "Offline";
            try
            {
                var year = DateTime.UtcNow.Year - lastRecord.Year;
                var month = DateTime.UtcNow.Month - lastRecord.Month;
                var day = DateTime.UtcNow.Day - lastRecord.Day;
                var hour = DateTime.UtcNow.Subtract(lastRecord).Hours;
                var minutes = DateTime.UtcNow.Subtract(lastRecord).Minutes;

                if (year == 0 && month == 0 && day == 00 && day == 00 && hour == 0)
                {
                    if (minutes < 2)
                        statusMessage = "Online";
                    else if (minutes >= 2 && minutes <= 10)
                        statusMessage = "Idle for " + minutes + " minutes";
                    else
                        statusMessage = "Offline";
                }
                else
                    statusMessage = "Offline";
            }
            catch (Exception ex)
            {

            }

            return statusMessage;
        }

        public List<FanDeviceDTO> GetAllFanDevices(string getDeviceEndPoint, string authorizationToken, string CustomerId = null)
        {
            var endpoint = getDeviceEndPoint;
            if (CustomerId != null)
            {
                endpoint = endpoint + "/" + CustomerId;
            }

            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "Get", authorizationToken));

            if (response.StatusCode == "Success")
            {
                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<List<FanDeviceDTO>>(response.Data.ToString());
                    UpdateFanStatus(result);
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }




        }

        public List<FanDevice> GetDeviceStats(string getDeviceStatsEndPoint, string authorizationToken, string CustomerId = "", string UserId = "")
        {
            var endpoint = getDeviceStatsEndPoint;
            if (!string.IsNullOrEmpty(CustomerId))
            {
                endpoint = endpoint + "?CustomerId=" + CustomerId + "&UserId=" + UserId;
            }

            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "Get", authorizationToken));

            if (response.StatusCode == "Success")
            {
                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<List<FanDevice>>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }




        }

        public List<DeviceAlarmHistoryReportDTO> GetDeviceAlarmReport(string serviceEndPoint, string authorizationToken, string customerId, string deviceId)
        {

            var endPoint = serviceEndPoint + customerId + "/" + deviceId;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endPoint, "Get", authorizationToken));


            if (response.StatusCode == "Success")
            {
                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<List<DeviceAlarmHistoryReportDTO>>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }
        }

        public List<ConsumptionReportDTO> GetDeviceConsumptionReport(string serviceEndPoint, string authorizationToken, string customerId, string deviceId, string date)
        {
            var endPoint = serviceEndPoint + "Date=" + date + "&DeviceId=" + deviceId + "&Customer=" + customerId;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endPoint, "Get", authorizationToken));
            if (response.StatusCode == "Success")
            {
                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<List<ConsumptionReportDTO>>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }

        }

        public List<MaintenanceReportDTO> GetMaintenanceReport(string serviceEndPoint, string authorizationToken, string customerId, string batchId, string deviceId, string Date)
        {
            var endpoint = serviceEndPoint;
            if (customerId != "null")
            {
                endpoint = endpoint + "&Customer=" + customerId;
            }

            if (batchId != "null")
            {
                endpoint = endpoint + "&BatchId=" + batchId;
            }

            if (deviceId != "null")
            {
                endpoint = endpoint + "&DeviceId=" + deviceId;
            }

            if (Date != "null")
            {
                endpoint = endpoint + "&Date=" + Date;
            }
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "Get", authorizationToken));
            if (response.StatusCode == "Success")
            {
                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<List<MaintenanceReportDTO>>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }


        }


        public CustomerDeviceMaintenanceReportDTO GetCustomerMaintenanceReport(string serviceEndPoint, string authorizationToken, string customerId, string date, string day)
        {
            var endpoint = serviceEndPoint + "Customer=" + customerId + "&Date=" + date + "&Day=" + day;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "Get", authorizationToken));
            if (response.StatusCode == "Success")
            {
                if (response.Data.ToString() != "[]")
                {
                    var result = JsonConvert.DeserializeObject<CustomerDeviceMaintenanceReportDTO>(response.Data.ToString());
                    return result;
                }
                else
                {
                    throw new AppException(new ResponseDTO { StatusCode = "Warning", Message = "Record is not  available.", Data = null, });
                }

            }
            else
            {
                throw new AppException(response);
            }

        }


        public BarReportDTO ReportTransformation(List<UsageReportDTO> data)
        {
            if (data == null)
            {
                return null;
            }
            BarReportDTO newData = new BarReportDTO();
            newData.labels = new List<string>();
            newData.series = new List<List<int>>();
            List<int> seriesList = new List<int>();
            foreach (UsageReportDTO dt in data)
            {
                var parsedDate = DateTime.Parse(dt.Date).ToShortDateString().ToString();
                newData.labels.Add(parsedDate);
                seriesList.Add(int.Parse(dt.runningHours));
            }
            newData.series.Add(seriesList);
            return newData;
        }


        public ResponseDTO UpdateFan(DeviceDTO deviceDTO, string createDeviceEndpoint, string authorizationToken)
        {

            var endpoint = createDeviceEndpoint + deviceDTO.companyName + "/" + deviceDTO.deviceSerialId + "/" + deviceDTO.deviceName;
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall("", endpoint, "Post", authorizationToken));

            if (response.StatusCode == "Success")
                return response;
            else
                throw new AppException(response);
        }

        public ResponseDTO Uploadbom(BomDTO bom, string createDeviceEndpoint, string authorizationToken)
        {

            var data = JsonConvert.SerializeObject(bom);
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall(data, createDeviceEndpoint, "Post", authorizationToken));

            if (response.StatusCode == "Success")
                return response;
            else
                throw new AppException(response);
        }

        public ResponseDTO UploadFirmware(FirmwareDTO firmware, string createDeviceEndpoint, string authorizationToken)
        {
            var data = JsonConvert.SerializeObject(firmware);
            var response = JsonConvert.DeserializeObject<ResponseDTO>(AppUtilities.RestAPICall(data, createDeviceEndpoint, "Post", authorizationToken));

            if (response.StatusCode == "Success")
                return response;
            else
                throw new AppException(response);
        }
    }
}
