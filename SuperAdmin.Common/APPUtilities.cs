using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SuperAdmin.Models.DTOs;

namespace SuperAdmin.Common
{
    public enum RequestsMethods
    {
        GET,
        POST,
        DELETE,
        PUT
    };
    static public class AppUtilities
    {
        static public string RestAPICall(string Data, string URL, string RequestType = "Post", string authorizationToken = null)
        {
            //string logPath = "";
            var request = (HttpWebRequest)WebRequest.Create(URL);
            request.Timeout = 300000;
            request.ReadWriteTimeout = 600000;
            try
            {
                if (RequestType.ToUpper() == "POST")
                {
                    if (authorizationToken != null)
                    {
                        request.Headers.Add("Authorization", authorizationToken);
                    }
                    request.Method = "POST";
                    if (Data != "")
                    {
                        request.ContentType = "application/json";
                        request.ContentLength = Data.Length;
                    }

                    using (var webStream = request.GetRequestStream())
                    {
                        using (var requestWriter = new StreamWriter(webStream, System.Text.Encoding.ASCII))
                        {
                            requestWriter.Write(Data);
                        }
                    }
                    var webResponse = request.GetResponse();
                    using (var webStream = webResponse.GetResponseStream() ?? Stream.Null)
                    {
                        using (var responseReader = new StreamReader(webStream))
                        {
                            string response = responseReader.ReadToEnd();
                            Console.Out.WriteLine(response);
                            return response;
                        }
                    }
                }
                else
                {

                    if (authorizationToken != null)
                    {
                        request.Headers.Add("Authorization", authorizationToken);
                    }
                    var webResponse = request.GetResponse();
                    using (var webStream = webResponse.GetResponseStream() ?? Stream.Null)
                    {
                        using (var responseReader = new StreamReader(webStream))
                        {
                            string response = responseReader.ReadToEnd();
                            Console.Out.WriteLine(response);
                            return response;
                        }
                    }
                }
            }
            catch (WebException ex)
            {
                if (ex.Status == WebExceptionStatus.Timeout)
                {
                    // Handle timeout exception
                }
                if (ex.Status == WebExceptionStatus.ProtocolError)
                {
                    // Handle bad request exception
                }
                //CustomLogging.InfoLog("Status: " + ex.Status + ", Message: " + ex.Message + ", Endpoint: " + URL, logPath);
                //CustomLogging.ErrorLog(ex, logPath);
                throw new AppException(new ResponseDTO
                {
                    StatusCode = "Warning",
                    Message = ex.Message,
                    Data = null
                });
            }
            catch (Exception ex)
            {
                //CustomLogging.ErrorLog(ex, logPath);
                Console.Out.WriteLine(ex.Message);
                throw new AppException(new ResponseDTO
                {
                    StatusCode = "Warning",
                    Message = ex.Message,
                    Data = null
                });

            }
            finally
            {
                request.Abort();
            }

        }
        static public string generateAuthenticationToken(string secret, string claim)
        {
            byte[] key = Encoding.UTF8.GetBytes(secret);
            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                    {
                    new Claim(ClaimTypes.Name,claim)

                    }),
                Expires = DateTime.UtcNow.AddHours(24),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256),


            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescription);
            var token = tokenHandler.WriteToken(securityToken);
            return token;

        }

        public static string ApiRequestAsync(string url, RequestsMethods method, string contentType = "application/json", string jsonPayload = null, bool isPayloadExist = false)
        {

            var data = "";
            HttpResponseMessage response = null;
            StringContent dataToSend = null;
            try
            {
                using (var httpClient = new HttpClient())
                {
                    // payload 
                    if (isPayloadExist)
                    {
                        dataToSend = new StringContent(jsonPayload, Encoding.UTF8, contentType);
                    }


                    // method 
                    switch (method)
                    {
                        case RequestsMethods.GET:
                            {
                                response = httpClient.GetAsync(new Uri(url)).GetAwaiter().GetResult();
                                break;
                            }
                        case RequestsMethods.POST:
                            {
                                response = httpClient.PostAsync(new Uri(url), dataToSend).GetAwaiter().GetResult();
                                break;
                            }
                        case RequestsMethods.DELETE:
                            {
                                response = httpClient.DeleteAsync(new Uri(url)).GetAwaiter().GetResult();
                                break;
                            }

                    }


                    // response               
                    if (response.IsSuccessStatusCode)
                    {
                        data = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                    }


                    return data;
                }

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

    }
}
