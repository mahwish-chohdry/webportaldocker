using SuperAdmin.Models.DTOs;
using System;
using System.Globalization;

namespace SuperAdmin.Common
{
    public class AppException : Exception
    {
        private static readonly string DefaultMessage = "An exception has occured";
        public ResponseDTO _response { get; set; }
        public AppException() : base() { }

        public AppException(string message) : base(message) { }

        public AppException(ResponseDTO response)
       : base(DefaultMessage)
        {
            _response = response;
        }

        public AppException(string message, params object[] args)
            : base(String.Format(CultureInfo.CurrentCulture, message, args))
        {
        }
    }
}
