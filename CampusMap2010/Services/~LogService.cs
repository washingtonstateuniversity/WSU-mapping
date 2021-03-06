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
            UserService userService = new UserService();
            logs loger = new logs();
            loger.entry = txt;
            loger.nid = userService.getNid()!=""? userService.getNid():"";
            loger.ip = userService.getUserIp();
            loger.date = DateTime.Now;
            loger.Save();
        }
    }
}
