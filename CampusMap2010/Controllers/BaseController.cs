#region Directives
    using Castle.MonoRail.Framework;
    using campusMap.Services;
    using System.Text.RegularExpressions;
    using System;
    using System.Collections;
    using System.Collections.Generic;

    using System.Collections.ObjectModel;
    using System.Linq;
    using System.IO;
    using System.ServiceModel.Web;
    using System.Runtime.Serialization;
    using System.Runtime.Serialization.Formatters.Binary;
    using System.Runtime.Serialization.Json;
    using System.Dynamic;
    using System.Security.Permissions;
    using System.Web.Script.Serialization;
    using campusMap.Models;
    using Castle.ActiveRecord;
    using MonoRailHelper;
    using campusMap.Filters;
    using log4net;
    using log4net.Config;
    using System.Text;

    using System.Reflection;

using System.Linq.Expressions;
using System.Web; 

#endregion
namespace campusMap.Controllers {
    //[Filter(ExecuteWhen.BeforeAction, typeof(loggedinFilter))]
    [Filter(ExecuteWhen.BeforeAction, typeof(scriptFilter))]
    [Layout("default")]
    [Rescue(typeof(RescueController))]//Rescue("generalerror")

    public abstract class BaseController : MonoRailHelper.HelperBaseController {
        ILog log = log4net.LogManager.GetLogger("baseController");

        protected PlaceService placeService = new PlaceService();
        protected HelperService helperService = new HelperService();
        protected ImageService imageService = new ImageService();
        //protected LogService logService = new LogService();
        protected FieldsService fieldsService = new FieldsService();
        //protected StylesService StylesService = new StylesService();
        protected googleService googleService = new googleService();
        protected geometricService geometricService = new geometricService();
        protected ScriptsService ScriptsService = new ScriptsService();
        //protected adminService adminService = new adminService();

        #region STRING METHODS
        public string Tabs(int n) {
            return new String('\t', n);
        }
        public static string Truncate(string source, int length) {
            if (source.Length > length) {
                source = source.Substring(0, length);
            }
            return source;
        }
        //-jb || this will repeate str and {$i} is a the number pattern insertion
        public string repeatStr(string str, int n) {
            StringBuilder sb = new StringBuilder(str.Length * n);
            for (int i = 0; i < n; i++) {
                string tmp = "";
                if (str.Contains("{$i}")) {
                    tmp = str.Replace("{$i}", "" + i);
                } else {
                    tmp = str;
                }
                sb.Append(tmp);
            }
            return sb.ToString();
        }
        public string capitalize(string s) {
            // Check for empty string.
            if (string.IsNullOrEmpty(s)) {
                return string.Empty;
            }
            // Return char and concat substring.
            return char.ToUpper(s[0]) + s.Substring(1);
        }

        public String htmlSafeEscape(String str) {
            return str.Replace("&", "&amp;").Replace("\"", "&quot;").Replace("\'", "&apos;");
        }

        public String Escape(String str) {
            return htmlSafeEscape(str).Replace("<", "&lt;").Replace(">", "&gt;");
        }
        const string HTML_TAG_PATTERN = "<.*?>";
        public string StripHTML(string inputString) {
            return Regex.Replace
                (inputString, HTML_TAG_PATTERN, string.Empty);
        }

        public string stripNonSenseContent(string inputString) {
            return stripNonSenseContent(inputString, false);
        }
        public string stripNonSenseContent(string inputString, bool stripComments) {
            String output = Regex.Replace(inputString, @"<p>\s{0,}</p>", string.Empty);
            output = Regex.Replace(output, @"\t{1,}", " ");
            output = output.Replace('\t', ' ');
            output = Regex.Replace(output, @"\r\n{1,}", " ");
            output = Regex.Replace(output, @"=""\s{0,}(.*?)\s{0,}""", @"=""$1""");
            output = Regex.Replace(output, @"='\s{0,}(.*?)\s{0,}'", @"='$1'");
            output = Regex.Replace(output, @">\s{1,}<", @"><");//set for code with idea never presented in copy too
            if (stripComments) output = Regex.Replace(output, @"<!--(?!<!)[^\[>].*?-->", @"");
            //Just in case it's in type string
            output = output.Replace("\\r\\n", " ");
            output = output.Replace("\r\n", " ");
            output = output.Replace('\r', ' ');
            output = output.Replace('\n', ' ');
            //the retrun is for real.  clears both dos and machine carrage returns but not string
            output = output.Replace(@"
", "");
            output = Regex.Replace(output, @"\s{2,}", " ");
            return output;
        }
        public string jsonEscape(string inputString) {
            String output = stripNonSenseContent(inputString);
            output = output.Replace("\"", @"\""");
            output = output.Replace("\\\"", "\"");
            output = output.Replace(@"\", @"\\");
            output = output.Replace(@"\\", @"\");
            return output;
        }

        public string UrlEncode(string inputString) {
            String output = HttpUtility.UrlEncode(inputString);
            return output;
        }

        

        #endregion

        #region MCV INFO METHODS
        public string getView() {
            return SelectedViewName.Split('\\')[0];
        }
        public string getRootUrl() {
            String root = "";
            if (!System.Web.HttpContext.Current.Request.IsLocal) {
                root = System.Web.HttpContext.Current.Request.Url.AbsoluteUri.Replace(System.Web.HttpContext.Current.Request.Url.PathAndQuery, "/"); //"http://map.wsu.edu/";
            } else {
                root = System.Web.HttpContext.Current.Request.Url.AbsoluteUri.Replace(System.Web.HttpContext.Current.Request.Url.PathAndQuery, "/");
            }
            return root;
        }
        public bool isLocal() {
            return Request.IsLocal;
        }
        public string getAction() {
            if (SelectedViewName.Split('\\')[1].Contains("../")) {
                string[] act = SelectedViewName.Split('\\')[1].Split('/');
                return act[act.Length - 1];
            } else {
                return SelectedViewName.Split('\\')[1];
            }
        }
        public string getViewAndAction() {
            return SelectedViewName.Replace("\\", "/");
        }
        public object getVar(string var) {
            return PropertyBag[var];
        }
        #endregion

        #region methodbase

        #endregion


        #region Method extentions
        public static String getRootPath() {
            return Path.GetDirectoryName(new Uri(Assembly.GetExecutingAssembly().GetName().CodeBase).LocalPath).Replace("bin", "");
        }
        public static Dictionary<string, string> getUrlParmas_obj() {
            String everUrl = System.Web.HttpContext.Current.Request.RawUrl;
            // URL comes in like http://sitename/edit/dispatch/handle404.castle?404;http://sitename/pagetorender.html
            // So strip it all out except http://sitename/pagetorender.html
            everUrl = Regex.Replace(everUrl, "(.*:80)(.*)", "$2");
            everUrl = Regex.Replace(everUrl, "(.*:443)(.*)", "$2");
            String urlwithnoparams = Regex.Replace(everUrl, @"(.*?)(\?.*)", "$1");
            String querystring = Regex.Replace(everUrl, @"(.*?)(\?.*)", "$2");

            Dictionary<string, string> queryparams = new Dictionary<string, string>();
            if (urlwithnoparams != querystring) {
                foreach (string kvp in querystring.Split(',')) {
                    queryparams.Add(kvp.Split('=')[0], kvp.Split('=')[1]);
                }
            }
            return queryparams;
        }

        public static Dictionary<string, string> getPostParmas_obj() {
            Dictionary<string, string> queryparams = new Dictionary<string, string>();
            foreach (String key in System.Web.HttpContext.Current.Request.Form.AllKeys) {
                queryparams.Add(key, System.Web.HttpContext.Current.Request.Form[key]);
            }
            return queryparams;
        }
        public static Dictionary<string, string> getPostParmasAsObj_obj(string name) {
            Dictionary<string, string> queryparams = new Dictionary<string, string>();
            foreach (String key in System.Web.HttpContext.Current.Request.Form.AllKeys) {
                if (key.StartsWith(name)) {
                    queryparams.Add(key.Split('.')[1], System.Web.HttpContext.Current.Request.Form[key]);
                }
            }
            return queryparams;
        }

        public static String Serialize(dynamic data) {
            var serializer = new DataContractJsonSerializer(data.GetType());
            var ms = new MemoryStream();
            serializer.WriteObject(ms, data);

            return Encoding.UTF8.GetString(ms.ToArray());
        }


        #endregion

    }

    public class DynamicEntity : DynamicObject {
        private IDictionary<string, object> _values;

        public DynamicEntity(IDictionary<string, object> values) {
            _values = values;
        }


        public override bool TryGetMember(GetMemberBinder binder, out object result) {
            if (_values.ContainsKey(binder.Name)) {
                result = _values[binder.Name];
                return true;
            }
            result = null;
            return false;
        }
    }
    [Serializable]
    public class MyJsonDictionary<K, V> : ISerializable {
        Dictionary<K, V> dict = new Dictionary<K, V>();

        public MyJsonDictionary() { }

        protected MyJsonDictionary(SerializationInfo info, StreamingContext context) {
            throw new NotImplementedException();
        }

        public void GetObjectData(SerializationInfo info, StreamingContext context) {
            foreach (K key in dict.Keys) {
                info.AddValue(key.ToString(), dict[key]);
            }
        }

        public void Add(K key, V value) {
            dict.Add(key, value);
        }

        public V this[K index] {
            set { dict[index] = value; }
            get { return dict[index]; }
        }
    }







}
