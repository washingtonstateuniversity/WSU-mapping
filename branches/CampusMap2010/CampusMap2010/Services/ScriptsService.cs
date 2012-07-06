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
using Castle.MonoRail.Framework;
using campusMap.Filters;
using log4net;
using log4net.Config;
using System.Text;

#endregion

namespace campusMap.Services
{
    public class ScriptsService
    {
       /* public String Js(string identifier)
        {
            // Set max-age to a year from now
            HttpContext.Current.Response.Cache.SetMaxAge(TimeSpan.FromDays(365));
            // In release, the cache breaker is appended, so always return 304 Not Modified
            HttpContext.Current.Response.StatusCode = 304;
            return Bundle.JavaScript().RenderCached(identifier);
        }

        public String Css(string identifier)
        {
            // Set max-age to a year from now
            HttpContext.Current.Response.Cache.SetMaxAge(TimeSpan.FromDays(365));
            // In release, the cache breaker is appended, so always return 304 Not Modified
            HttpContext.Current.Response.StatusCode = 304;
            return Bundle.Css().RenderCached(identifier);
        }
        */
    }
}
