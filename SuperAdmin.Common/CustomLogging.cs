using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace SuperAdmin.Common
{
    public partial class CustomLogging
    {
        public static void ErrorLog(Exception exception, string path)
        {
            try
            {
                string folderPath = Path.Combine(path, ".logs\\error\\");
                if (!System.IO.Directory.Exists(folderPath))
                    System.IO.Directory.CreateDirectory(folderPath);

                var logFilePath = folderPath + DateTime.Now.Date.ToString("yyyyMMdd") + ".txt";

                using (var file = File.AppendText(logFilePath))
                {
                    file.WriteLine("Date & Time: " + DateTime.Now.ToString("F"));
                    file.WriteLine("---------------------------------------------");
                    file.WriteLine("..:: EXCEPTION ::..");
                    file.WriteLine("---------------------------------------------");
                    file.WriteLine();
                    file.WriteLine("Message: " + (string.IsNullOrEmpty(exception.Message) ? "NONE" : exception.Message));
                    file.WriteLine("Source: " + (string.IsNullOrEmpty(exception.Source) ? "NONE" : exception.Source));
                    file.WriteLine("Stack Trace: " + (string.IsNullOrEmpty(exception.StackTrace) ? "NONE" : exception.StackTrace));
                    file.WriteLine();
                    file.WriteLine("---------------------------------------------");
                    file.WriteLine("..:: INNER EXCEPTION ::..");
                    file.WriteLine("---------------------------------------------");
                    file.WriteLine();
                    if (exception.InnerException != null)
                    {
                        file.WriteLine("Message: " + (string.IsNullOrEmpty(exception.InnerException.Message) ? "NONE" : exception.InnerException.Message));
                        file.WriteLine("Source: " + (string.IsNullOrEmpty(exception.InnerException.Source) ? "NONE" : exception.InnerException.Source));
                        file.WriteLine("Stack Trace: " + (string.IsNullOrEmpty(exception.InnerException.StackTrace) ? "NONE" : exception.InnerException.StackTrace));
                        file.WriteLine();
                        file.WriteLine("---------------------------------------------");
                        file.WriteLine("..:: FURTHER INNER EXCEPTION ::..");
                        file.WriteLine("---------------------------------------------");
                        file.WriteLine();
                        if (exception.InnerException.InnerException != null)
                        {
                            file.WriteLine("Message: " + (string.IsNullOrEmpty(exception.InnerException.InnerException.Message) ? "NONE" : exception.InnerException.InnerException.Message));
                            file.WriteLine("Source: " + (string.IsNullOrEmpty(exception.InnerException.InnerException.Source) ? "NONE" : exception.InnerException.InnerException.Source));
                            file.WriteLine("Stack Trace: " + (string.IsNullOrEmpty(exception.InnerException.InnerException.StackTrace) ? "NONE" : exception.InnerException.InnerException.StackTrace));
                        }
                        else
                        {
                            file.WriteLine("NONE");
                        }
                    }
                    else
                    {
                        file.WriteLine("NONE");
                    }
                    file.WriteLine();
                    file.WriteLine("=============================================");
                    file.Dispose();
                }
            }
            catch (Exception ex)
            {

            }
        }

        public static void InfoLog(string info, string path)
        {
            try
            {
                string folderPath = Path.Combine(path, ".logs\\info\\");
                if (!System.IO.Directory.Exists(folderPath))
                    System.IO.Directory.CreateDirectory(folderPath);

                var logFilePath = folderPath + DateTime.Now.Date.ToString("yyyyMMdd") + ".txt";

                using (var file = File.AppendText(logFilePath))
                {
                    file.WriteLine("Date & Time: " + DateTime.Now.ToString("F"));
                    file.WriteLine("--------------------------------------------------");
                    file.WriteLine("..::INFO::..");
                    file.WriteLine("--------------------------------------------------");
                    file.WriteLine();
                    file.WriteLine("Detail: " + info);
                    file.WriteLine();
                    file.WriteLine("==================================================");
                    file.Dispose();
                }
            }
            catch (Exception ex)
            {

            }
        }

        #region Export

        public static byte[] WriteCsv(string fileName, string response, string path)
        {
            try
            {
                string folderPath = Path.Combine(path, ".logs\\Export\\");
                if (!System.IO.Directory.Exists(folderPath))
                    System.IO.Directory.CreateDirectory(folderPath);

                string filePath = Path.Combine(folderPath, fileName);
                System.IO.File.WriteAllText(filePath, response);

                byte[] bytes;

                using (var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        fileStream.CopyTo(memoryStream);
                        bytes = memoryStream.ToArray();
                    }
                }
                return bytes;

            }
            catch (Exception)
            {
                return null;
            }
        }

        #endregion
    }
}
