#region Directives
    using System;
    using System.Data;
    using System.Configuration;
    using campusMap.Models;
    using NHibernate.Criterion;
    using System.Collections.Generic;
    using Castle.ActiveRecord;
    using System.Net;
    using System.Text.RegularExpressions;
    using System.IO;
    using System.Web;
    using MonoRailHelper;
    using System.Xml;
    using System.Drawing;
    using System.Drawing.Imaging;
    using System.Drawing.Drawing2D;
    using System.Collections.Specialized;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Utilities;
    using Newtonsoft.Json.Linq;
    using campusMap.Services;
#endregion

namespace campusMap.Services
{
    public class LogService
	{


        public static void writelog(string txt)
        {
            logs loger = new logs();

            loger.logentry = txt + " :by: " + UserService.getNid() + " :from: " + UserService.getUserIp();
            loger.dtOfLog = DateTime.Now;
            loger.Save();
        }
    }
}
