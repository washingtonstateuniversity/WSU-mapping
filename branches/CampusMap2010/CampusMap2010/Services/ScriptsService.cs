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


using SquishIt.Framework;
using SquishIt.Framework.Css;
using SquishIt.Framework.JavaScript;


#endregion

namespace campusMap.Services
{
    public class ScriptsService
    {
        
        public static String Css(String files)
        {
            return Css(files, false);
        }
        public static String Css(String files, Boolean debug)
        {
            String name = HelperService.CalculateMD5Hash(files);
            String path = @"/cache/script/css/";
            String FilePath = path + name + ".css";

            if (!HelperService.DirExists(path))
            {
                System.IO.Directory.CreateDirectory(path);
            }
            CSSBundle css = new CSSBundle();     
            foreach (string fl in files.Split(','))
            {
                css.Add(fl);
            }
            if (debug)
            {
                return css.ForceRelease().ForceDebug().Render(FilePath);
            }
            else
            {
                return css.ForceRelease().Render(FilePath);
            }
        }

        public static String Js(String files)
        {
            return Js(files, false);
        }
        public static String Js(String files,Boolean debug)
        {

            String name = HelperService.CalculateMD5Hash(files);
            String path = @"/cache/script/js/";
            String FilePath = path + name + ".js" ;

            if (!HelperService.DirExists(path))
            {
                System.IO.Directory.CreateDirectory(path);
            }
            /*if (!File.Exists(cachePath + file) || !String.IsNullOrWhiteSpace(HttpContext.Current.Request.Params["dyno"]))
            {

            }*/
            JavaScriptBundle js = new JavaScriptBundle();
            foreach (string fl in files.Split(','))
            {
                js.Add(fl);
            }
            if (debug==true)
            {
                return js.ForceRelease().ForceDebug().Render(FilePath);
            }
            else
            {
                return js.ForceRelease().Render(FilePath);
            }
        }



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
