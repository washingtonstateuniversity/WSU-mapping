#region Directives
    using Castle.MonoRail.Framework;
    using campusMap.Services;
    using System.Text.RegularExpressions;
    using System;
    using campusMap.Models;
    using Castle.ActiveRecord;
    using MonoRailHelper;
    using campusMap.Filters;
    using log4net;
    using log4net.Config;
    using System.Text;

#endregion
namespace campusMap.Controllers
{
    [Filter(ExecuteWhen.BeforeAction, typeof(loggedinFilter))]
    [Filter(ExecuteWhen.BeforeAction, typeof(scriptFilter))]
    [Layout("default"), Rescue("generalerror")]
    public abstract class BaseController : MonoRailHelper.HelperBaseController
	{
        ILog log = log4net.LogManager.GetLogger("baseController");

        protected PlaceService placeService = new PlaceService();
        protected HelperService helperService = new HelperService();
        protected ImageService imageService = new ImageService();
        protected UserService userService = new UserService();
        protected LogService logService = new LogService();
        protected FieldsService fieldsService = new FieldsService();
        protected StylesService StylesService = new StylesService();
        protected googleService googleService = new googleService();
        protected geometricService geometricService = new geometricService();
        protected ScriptsService ScriptsService = new ScriptsService();
        

        #region STRING METHODS
            public string Tabs(int n)
        {
            return new String('\t', n);
        }
            public static string Truncate(string source, int length)
        {
            if (source.Length > length)
            {
                source = source.Substring(0, length);
            }
            return source;
        }
            //-jb || this will repeate str and {$i} is a the number pattern insertion
            public string repeatStr(string str,int n)
        {
            StringBuilder sb = new StringBuilder(str.Length * n);
            for (int i = 0; i < n; i++)
            {
                string tmp = "";
                if (str.Contains("{$i}"))
                {
                    tmp = str.Replace("{$i}", "" + i);
                }
                else
                {
                    tmp = str;
                }
                sb.Append(tmp);
            }
            return sb.ToString();
        }
            public string capitalize(string s)
        {
            // Check for empty string.
            if (string.IsNullOrEmpty(s))
            {
                return string.Empty;
            }
            // Return char and concat substring.
            return char.ToUpper(s[0]) + s.Substring(1);
        }

            public String Escape(String str)
            {
                return str.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace("\"", "&quot;").Replace("\'", "&apos;");
            }
            const string HTML_TAG_PATTERN = "<.*?>";
            public string StripHTML(string inputString)
            {
                return Regex.Replace
                    (inputString, HTML_TAG_PATTERN, string.Empty);
            }
            public string stripNonSenseContent(string inputString)
            {
                String output = Regex.Replace(inputString, @"<p>\s{0,}</p>", string.Empty);
                        output = Regex.Replace(output, @"\s{3,}", string.Empty);
                        output = output.Replace('\t', ' ');
                        output = output.Replace("\\r\\n", "");
                        output = output.Replace("\r\n", "");
                        output = output.Replace(@"
", "");
                        output = output.Replace("\"", @"\""");
                        output = output.Replace("\\\"", "\"");
                        output = output.Replace('\r', ' ');
                        output = output.Replace('\n', ' ');
                        
                return output;
            }



        #endregion

        #region MCV INFO METHODS
            public string getView()
            {
                return SelectedViewName.Split('\\')[0];
            }
            public string getRootUrl()
            {
                String root = "";
                if (!Request.IsLocal)
                {
                    root = "http://map.wsu.edu/";
                }
                else
                {
                    root = System.Web.HttpContext.Current.Request.Url.AbsoluteUri.Replace(System.Web.HttpContext.Current.Request.Url.PathAndQuery, "/"); 
                }
                return root;
            }
            public bool isLocal()
            {
                return Request.IsLocal;
            }
            public string getAction()
            {
                if (SelectedViewName.Split('\\')[1].Contains("../"))
                {
                    string[] act = SelectedViewName.Split('\\')[1].Split('/');
                    return act[act.Length-1];
                }
                else
                {
                    return SelectedViewName.Split('\\')[1];
                }
            }
            public string getViewAndAction()
            {
                return SelectedViewName.Replace("\\", "/");
            }
            public object getVar(string var)
            {
                return PropertyBag[var];
            }
         #endregion

    }
}
