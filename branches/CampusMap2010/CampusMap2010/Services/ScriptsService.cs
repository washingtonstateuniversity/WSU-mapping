#region Directives
using campusMap.Models;
using campusMap.Services;

using System;
using System.Data;
using System.Configuration;
using System.Net;
using System.IO;
using System.Web;
using MonoRailHelper;

using SquishIt.Framework;
using SquishIt.Framework.Css;
using SquishIt.Framework.JavaScript;
#endregion

namespace campusMap.Services {
    public class ScriptsService {
        public static String Css(String files) { return Css(files, false); }
        public static String Css(String files, Boolean debug) {

            String name = HelperService.CalculateMD5Hash(files);
            String path = @"/cache/script/css/";
            String FilePath = path + name + ".css";

            if (!HelperService.DirExists(path)) {
                System.IO.Directory.CreateDirectory(path);
            }
            CSSBundle css = new CSSBundle();
            foreach (string fl in files.Split(',')) {
                if (File.Exists(HttpContext.Current.Server.MapPath(fl))) {
                    css.Add(fl);
                } else {

                }
            }
            if (debug) {
                return css.ForceRelease().ForceDebug().Render(FilePath);
            } else {
                return css.ForceRelease().Render(FilePath);
            }
        }
        public static String Js(String files) { return Js(files, false); }
        public static String Js(String files, Boolean debug) {
            String name = HelperService.CalculateMD5Hash(files);
            String path = @"/cache/script/js/";
            String FilePath = path + name + ".js";

            if (!HelperService.DirExists(path)) {
                System.IO.Directory.CreateDirectory(path);
            }
            JavaScriptBundle js = new JavaScriptBundle();
            foreach (string fl in files.Split(',')) {
                if (File.Exists(HttpContext.Current.Server.MapPath(fl))) js.Add(fl);
            }
            if (debug == true) {
                return js.ForceRelease().ForceDebug().Render(FilePath);
            } else {
                return js.ForceRelease().Render(FilePath);
            }
        }
    }
}
