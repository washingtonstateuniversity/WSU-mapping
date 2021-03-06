#region using
using System;
using System.Collections;
using System.Collections.Generic;
using Castle.ActiveRecord;
using Castle.ActiveRecord.Queries;
using Castle.ActiveRecord.Framework;
using Castle.MonoRail.Framework;
using Castle.MonoRail.ActiveRecordSupport;
using campusMap.Models;
using MonoRailHelper;
using System.IO;
using System.Net;
using System.Web;
using NHibernate.Criterion;
using System.Xml;
using System.Xml.XPath;
using System.Text.RegularExpressions;
using System.Text;
using System.Net.Sockets;
using System.Web.Mail;
using campusMap.Services;

using System.CodeDom;
using System.CodeDom.Compiler;
using System.Reflection;
using Microsoft.CSharp;
using System.Reflection.Emit;
using System.Runtime.InteropServices;
using System.Runtime.Remoting;
using System.Threading;
using Microsoft.SqlServer.Types;
using System.Data.SqlTypes;
/* Newtonsoft slated to remove */
using Newtonsoft.Json;
using Newtonsoft.Json.Utilities;
using Newtonsoft.Json.Linq;

using log4net;
using log4net.Config;



using System.Collections.ObjectModel;
using System.Dynamic;
using System.Linq;
using System.Web.Script.Serialization;

using System.Net.Mail;
using Castle.Components.Common.EmailSender;
using Castle.Components.Common.EmailSender.Smtp;

using System.Collections.Specialized;


#endregion




namespace campusMap.Controllers {


    //[Layout("central")]
    public class publicController : BaseController {
        //ILog log = log4net.LogManager.GetLogger("publicController");
        PlaceService placeservice = new PlaceService();

        #region JSON OUTPUT

        /*public void get_pace_type()
            {
                CancelView();
                CancelLayout();
                place_types[] types = ActiveRecordBase<place_types>.FindAll();

                List<JsonAutoComplete> type_list = new List<JsonAutoComplete>();
                foreach (place_types place_type in types)
                {
                    JsonAutoComplete obj = new JsonAutoComplete();
                    obj.id = place_type.id;
                    obj.label = place_type.name;
                    obj.value = place_type.name;
                    type_list.Add(obj);
                }
                string json = JsonConvert.SerializeObject(type_list);
                RenderText(json);
            }*/

        public void get_json(String TYPE) {
            CancelView();
            CancelLayout();
            Type t = Type.GetType("campusMap.Models." + TYPE);
            Ijson_autocomplete theclass = (Ijson_autocomplete)Activator.CreateInstance(t);
            RenderText(theclass.get_json_data());
        }

        #endregion

        #region URL rendering

        public void general(string aspxerrorpath) {
            CancelLayout();
            CancelView();
            LayoutName = "error";
            RenderView("errors/general404");
        }
        public void error(string aspxerrorpath) {
            CancelView();
            CancelLayout();
            Exception LastErrorOccured;
            LastErrorOccured = Context.LastException;
            PropertyBag["error"] = LastErrorOccured;
            LayoutName = "error";
            RenderView("errors/error");
        }
        public void render() {
            HttpRequest httpRequest = HttpContext.Current.Request;

            String everUrl = Context.Request.RawUrl;
            // URL comes in like http://sitename/edit/dispatch/handle404.castle?404;http://sitename/pagetorender.html
            // So strip it all out except http://sitename/pagetorender.html
            everUrl = Regex.Replace(everUrl, "(.*:80)(.*)", "$2");
            everUrl = Regex.Replace(everUrl, "(.*:443)(.*)", "$2");
            everUrl = everUrl.Replace("/public/render.castle?everUrl=", "");
            String urlwithnoparams = Regex.Replace(everUrl, @"(.*?)(\?.*)", "$1");
            String querystring = Regex.Replace(everUrl, @"(.*?)(\?.*)", "$2");



            if (httpRequest.Browser.IsMobileDevice && !((urlwithnoparams.ToString().IndexOf("/embed/") > -1) || (urlwithnoparams.ToString().IndexOf("/rt/") > -1) || (urlwithnoparams.ToString().IndexOf("/t/") > -1))) {
                //HttpContext.Current.Response.Redirect("http://goo.gl/maps/4P71");
            }


            Dictionary<string, string> queryparams = new Dictionary<string, string>();
            if (urlwithnoparams != querystring) {
                foreach (string kvp in querystring.Split(',')) {
                    var tmp = kvp;
                    if (kvp.StartsWith("?")) tmp = kvp.TrimStart('?');
                    queryparams.Add(tmp.Split('=')[0], tmp.Split('=')[1]);
                }
            }

            CancelView();
            
            if (everUrl == "/default.aspx") {
                //Redirect(HttpContext.Request.ApplicationPath + "/Admin/editByUrl.castle?editurl=" + Context.Server.UrlEncode(everUrl));
                central(HttpContext.Current.Request.Params["cat"].Split(','), int.Parse(HttpContext.Current.Request.Params["activePlace"]), int.Parse(HttpContext.Current.Request.Params["pid"]), Convert.ToBoolean(HttpContext.Current.Request.Params["eb"]));
                LayoutName = "central"; // would be a var
                RenderView("central"); // would be a var
                return;
            }
            if (urlwithnoparams.EndsWith("/central")) {
                central(HttpContext.Current.Request.Params["cat"].Split(','), int.Parse(HttpContext.Current.Request.Params["activePlace"]), int.Parse(HttpContext.Current.Request.Params["pid"]), Convert.ToBoolean(HttpContext.Current.Request.Params["eb"]));
                LayoutName = "central"; // would be a var
                RenderView("central"); // would be a var
                return;
            }
            /* 
            if (everUrl == "/default.aspx"){
                //Redirect(HttpContext.Request.ApplicationPath + "/Admin/editByUrl.castle?editurl=" + Context.Server.UrlEncode(everUrl));
                Index();
                RenderView("index");
                return;
            }
            if (urlwithnoparams.EndsWith("index.castle")){
                LayoutName = "secondary-tabs";
                string url = Regex.Replace(urlwithnoparams, @"/read/(.*)", "$1");
                readmore(placeService.placeByURL_id(url));
                RenderView("readmore");
                return;
            }
            if (urlwithnoparams.EndsWith("sitemap.xml")){
                seoSitemap();
                RenderView("seoSitemap");
                return;
            }
            if (urlwithnoparams.EndsWith("/home")){
                Index();
                RenderView("index");
                return;
            }
            if (urlwithnoparams.EndsWith("readmore.castle")){
                LayoutName = "secondary-tabs";
                string id = Regex.Replace(querystring, @"\?id=(.*)", "$1");
                readmore(Convert.ToInt32(id));
                RenderView("readmore");
                return;
            }
            if (urlwithnoparams.ToString().IndexOf("read/") == 1){
                LayoutName="secondary-tabs";
                string url = Regex.Replace(urlwithnoparams, @"/read/(.*)", "$1");
                readmore(placeService.placeByURL_id(url));
                RenderView("readmore");
                return;
            }
            */

            if (urlwithnoparams.ToString().IndexOf("/embed/") > -1) {
                string alias = Regex.Replace(urlwithnoparams, @"/embed/(.*)", "$1");
                String mode = "";
                String callback = "";
                sendEmbedScript(alias, HttpContext.Current.Request.Params["mode"], HttpContext.Current.Request.Params["callback"]);
                return;
            }


            if (urlwithnoparams.ToString().IndexOf("/rt/") > -1) {
                string alias = Regex.Replace(urlwithnoparams, @"/rt/(.*)", "$1");
                String mode = "";
                String callback = "";
               /* IList<map_views> c = ActiveRecordBase<map_views>.FindAllByProperty("alias", alias);
                if (c.Count == 0)
                {
                    RenderText("false");
                    return;
                }
                int id = c[0].;*/
                fetchMap(alias, HttpContext.Current.Request.Params["mode"], HttpContext.Current.Request.Params["callback"]);
                return;
            }
            if (urlwithnoparams.ToString().IndexOf("/t/") > -1) {
                string smallUrl = Regex.Replace(urlwithnoparams, @"/t/(.*)", "$1");
                String mode = "";
                String callback = "";

                small_url[] u = ActiveRecordBase<small_url>.FindAllByProperty("sm_url", smallUrl);
                if (u.Count() == 0) {
                    RenderText("false");
                    return;
                }
                string[] queries = u[0].or_url.Split('?')[1].Split('&');
                string[] cats = u[0].or_url.Contains("cat") ? null : new string[0];
                int activePlace = u[0].or_url.Contains("activePlace") ? -1 : 0;
                int pid = u[0].or_url.Contains("pid") ? -1 : 0;
                //Boolean embedded = u[0].or_url.Contains("eb") ? true : false;
                Boolean layout = true;
                foreach (string query in queries) {
                    if (cats == null && query.Contains("cat")) cats = query.ToString().Replace("cat[]=", "").Split(',');
                    if (activePlace == -1 && query.Contains("activePlace")) activePlace = int.Parse(query.ToString().Replace("activePlace=", ""));
                    if (pid == -1 && query.Contains("pid")) pid = int.Parse(query.ToString().Replace("pid=", ""));
                    //if (query.Contains("eb")) embedded = Convert.ToBoolean(query.ToString().Replace("eb=", ""));
                }
                if (querystring.IndexOf("layout") >-1)
                    layout = Convert.ToBoolean(HttpContext.Current.Request.Params["layout"]);
                central(cats, activePlace, pid, false, true, smallUrl, layout);
                return;
            }
        }
        #endregion

       

        public void get_sm_url(String _url) {
            CancelLayout();
            CancelView();
            RenderText(make_sm_url(_url));
        }

        public String make_sm_url(String _url) {
            String sm_url = "";
            small_url[] u = ActiveRecordBase<small_url>.FindAllByProperty("or_url", _url);
            if (u.Count() == 0) {
                small_url url = new small_url();
                url.or_url = _url;
                url.sm_url = String.Format("{0:X}", _url.GetHashCode());
                url.Save();
                Array.Resize(ref u, 1);
                sm_url = url.sm_url;
            } else {
                sm_url = u[0].sm_url;
            }
            return sm_url;
        }
        public void produce_sitemap() {
            CancelView();
            CancelLayout();
            small_url[] urls = ActiveRecordBase<small_url>.FindAll(); //ActiveRecordBase<small_url>.FindAllByProperty("sm_url", smallUrl);
            if (urls.Count() == 0) {
                RenderText("false");
                return;
            }
            String appPath = getRootPath();
            String cachePath = appPath + "/";
            String file = "sitemap.xml";
            if (!File.Exists(cachePath + file) || !String.IsNullOrWhiteSpace(HttpContext.Current.Request.Params["dyno"])) {
                String sitemap = "<?xml version='1.0' encoding='UTF-8'?><urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'> ";


                foreach (small_url url in urls) {
                    sitemap += @"
    <url>
        <loc>https://map/wsu.edu/t/" + url.sm_url + @"</loc>
    </url>";
                   /* string[] queries = url.or_url.Split('?')[1].Split('&');
                    string[] cats = url.or_url.Contains("cat") ? null : new string[0];
                    int activePlace = url.or_url.Contains("activePlace") ? -1 : 0;
                    int pid = url.or_url.Contains("pid") ? -1 : 0;
                    Boolean eb = url.or_url.Contains("eb") ? false : false;
                    Boolean layout = true;
                    url.
                    foreach (string query in queries) {
                        if (cats == null && query.Contains("cat")) cats = query.ToString().Replace("cat[]=", "").Split(',');
                        if (activePlace == -1 && query.Contains("activePlace")) activePlace = int.Parse(query.ToString().Replace("activePlace=", ""));
                        if (pid == -1 && query.Contains("pid")) pid = int.Parse(query.ToString().Replace("pid=", ""));
                        if (query.Contains("eb")) eb = Convert.ToBoolean(query.ToString().Replace("eb=", ""));
                    }*/
                }
                sitemap += @"
</urlset>";
                setJsonCache(cachePath, file, sitemap);
            }
                
        }
        /* this is to be turned into to the main map view switcher */
        //[Layout("central")]
        //[DefaultAction]

        public void central(string[] cat, int activePlace, int pid, Boolean embedded) {
            central(cat, activePlace, pid, embedded, false, null, true, true, true, true);
        }
        public void central(string[] cat, int activePlace, int pid, Boolean embedded, Boolean hasUrl, string sm_url){
            central(cat, activePlace, pid, embedded, hasUrl, null, true, true, true, true); 
        }
        public void central(string[] cat, int activePlace, int pid, Boolean embedded, Boolean hasUrl, string sm_url, Boolean layout) {
            central(cat, activePlace, pid, embedded, hasUrl, sm_url, layout, true, true, true);
        }
        public void central(string[] cat, int activePlace, int pid, Boolean embedded, Boolean layout) {
            central(cat, activePlace, pid, embedded, false, null, layout, true, true, true);
        }


        public void central(string[] cat, int activePlace, int pid, Boolean embedded, Boolean hasUrl, string sm_url, Boolean layout, Boolean header, Boolean search, Boolean directions) {
            if (activePlace == 0 && pid != 0)
                activePlace = pid;

            if (!hasUrl) {

                String _url = Request.Url;
                sm_url = make_sm_url(_url);
            }

            String urlQueries = "";
            foreach (string category in cat) {
                urlQueries += "," + category;
            }
            PropertyBag["urlQueries"] = String.IsNullOrWhiteSpace(urlQueries) ? "" : "cat[]=" + urlQueries.TrimStart(',');
            if (pid > 0)
            {
                PropertyBag["urlQueries"] += (String.IsNullOrWhiteSpace(urlQueries) ? "" : "&") + "pid=" + pid.ToString();
            }

            PropertyBag["selectedCats"] = cat;
            PropertyBag["activePlace"] = activePlace;

            central(embedded, hasUrl, sm_url, layout, header, search, directions);
        }

        public void central(Boolean embedded, Boolean hasUrl, string sm_url, Boolean layout, Boolean header, Boolean search, Boolean directions)
        {
            PropertyBag["url"] = sm_url;
            PropertyBag["campus"] = ActiveRecordBase<campus>.FindAllByProperty("name", "Pullman")[0];
            PropertyBag["layout"] = layout;
            PropertyBag["header"] = header;
            PropertyBag["search"] = search;
            PropertyBag["directions"] = directions;
            PropertyBag["debug"] = !String.IsNullOrWhiteSpace(HttpContext.Current.Request.Params["debug"]) ? "true" : "false";
            if (Request.IsLocal)
                PropertyBag["debug"] = "true";

            PropertyBag["embedded"] = embedded;

            PropertyBag["menuItems"] = ActiveRecordBase<categories>.FindAllByProperty("position", "active", true);

            LayoutName = "central"; // would be a var
            RenderView("central"); // would be a var
        }




        [Layout("blank")]
        public void sendEmbedScript(String alias, String mode, String callback) {
            CancelView();
            CancelLayout();
            String output = "";
            string appPath = getRootPath();
            String cachePath = appPath + "cache/embeds/";
            string file = HelperService.CalculateMD5Hash(alias)  + ".ext";
            if (!File.Exists(cachePath + file) || !String.IsNullOrWhiteSpace(HttpContext.Current.Request.Params["dyno"])) {

                IList<map_views> c = ActiveRecordBase<map_views>.FindAllByProperty("alias", alias);
                if (c.Count == 0) {
                    RenderText("false");
                    return;
                }
                PropertyBag["debug"] = !String.IsNullOrWhiteSpace(HttpContext.Current.Request.Params["debug"])?"true":"false";
                PropertyBag["map"] = c[0];
                PropertyBag["campus"] = ActiveRecordBase<campus>.FindAllByProperty("name", "Pullman")[0];
                PropertyBag["options_json"] = Regex.Replace(Regex.Replace(c[0].options_obj.Replace(@"""false""", "false").Replace(@"""true""", "true"), @"(""\w+"":\""\"",?)", "", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.CultureInvariant).Replace(",}", "}"), @"""(\d+)""", "$1", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.CultureInvariant).Replace(",}", "}");
                PropertyBag["baseJson"] = Regex.Replace(c[0].options_obj, @".*?(""mapTypeId"":""(\w+)"".*$)", "$2", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.CultureInvariant);
                PropertyBag["upload_path"] = cachePath;
                PropertyBag["file"] = file;
                Response.ContentType = "text/javascript; charset=UTF-8";
                RenderView("embedScript");
                return;
            }
            output = System.IO.File.ReadAllText(cachePath + file);
            Response.ContentType = "text/javascript; charset=UTF-8";
            RenderText(output);
            return;

        }

        [Layout("map_views")]
        public void fetchMap(String alias, String mode, String callback) {
            PropertyBag["debug"] = !String.IsNullOrWhiteSpace(HttpContext.Current.Request.Params["debug"])?"true":"false";
            PropertyBag["campus"] = ActiveRecordBase<campus>.FindAllByProperty("name", "Pullman")[0];
            PropertyBag["menuItems"] = ActiveRecordBase<categories>.FindAllByProperty("position", "active", true);
            IList<map_views> c = ActiveRecordBase<map_views>.FindAllByProperty("alias", alias);
            if (c.Count == 0) {
                RenderText("false");
                return;
            }

            PropertyBag["map"] = c[0];

            PropertyBag["options_json"] = Regex.Replace(Regex.Replace(c[0].options_obj.Replace(@"""false""", "false").Replace(@"""true""", "true"), @"(""\w+"":\""\"",?)", "", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.CultureInvariant).Replace(",}", "}"), @"""(\d+)""", "$1", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.CultureInvariant).Replace(",}", "}");
            PropertyBag["baseJson"] = Regex.Replace(c[0].options_obj, @".*?(""mapTypeId"":""(\w+)"".*$)", "$2", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.CultureInvariant);
            PropertyBag["places"] = c[0].places;
            PropertyBag["shapes"] = c[0].geometrics;
            central(true, true, null, true, true, true, true);
            return;
            /*
            if (mode == "json") {
                CancelLayout();
                if (!String.IsNullOrEmpty(callback)) PropertyBag["callback"] = callback;
                PropertyBag["map"] = c[0];
                PropertyBag["options_json"] = Regex.Replace(Regex.Replace(c[0].options_obj.Replace(@"""false""", "false").Replace(@"""true""", "true"), @"(""\w+"":\""\"",?)", "", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.CultureInvariant).Replace(",}", "}"), @"""(\d+)""", "$1", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.CultureInvariant).Replace(",}", "}");
                PropertyBag["baseJson"] = Regex.Replace(c[0].options_obj, @".*?(\""mapTypeId\"":""(\w+)"".*$)", "$2", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.CultureInvariant);

                PropertyBag["callback"] = callback;

                RenderView("map_json");
                return;
            }
            if (mode == "standalone") {
                PropertyBag["map"] = c[0];

                PropertyBag["options_json"] = Regex.Replace(Regex.Replace(c[0].options_obj.Replace(@"""false""", "false").Replace(@"""true""", "true"), @"(""\w+"":\""\"",?)", "", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.CultureInvariant).Replace(",}", "}"), @"""(\d+)""", "$1", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.CultureInvariant).Replace(",}", "}");
                PropertyBag["baseJson"] = Regex.Replace(c[0].options_obj, @".*?(""mapTypeId"":""(\w+)"".*$)", "$2", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.CultureInvariant);
                PropertyBag["places"] = c[0].places;
                PropertyBag["shapes"] = c[0].geometrics;
                central(true, true, null, true, true, true, true);
                //RenderView("map_view/map_standalone");
                return;
            }
            LayoutName = "map_views";
            PropertyBag["map"] = c[0];
            RenderView("map_view/map_basic");*/
        }


        #region API get items from the db
        public void get_categories_list(String callback)
        {
            CancelView();
            CancelLayout();
            String cached = getJsonCache(getDefaultAppPath(), "getCategoriesList.ext", DateTime.Now.AddDays(-7));
            if (cached == null)
            {
                var tmp = ActiveRecordBase<categories>.FindAllByProperty("position", "active", true).Select(i => new { i.id, i.friendly_name, i.name, parentid = (i.Parent == null ? 0 : i.Parent.id) });
                String result = null;
                if (tmp.Count() > 0)
                {
                    result = render_list_json(tmp, callback);
                    setJsonCache(getDefaultAppPath(), "getCategoriesList.ext", result);
                }
                else
                {
                    RenderText("false");
                }
            }          
            else
                sendCachedJson(cached, callback);
        }

        public void get_colleges_list(String callback) {
            CancelView();
            CancelLayout();
            var tmp = ActiveRecordBase<colleges>.FindAll().Select(i => new { i.id, i.name });
            if (tmp.Count() > 0) {
                render_list_json(tmp, callback);
            } else {
                RenderText("false");
            }
        }
        public void get_admindepartments_list(String callback) {
            CancelView();
            CancelLayout();
            var tmp = ActiveRecordBase<admindepartments>.FindAll().Select(i => new { i.id, i.name });
            if (tmp.Count() > 0) {
                render_list_json(tmp, callback);
            } else {
                RenderText("false");
            }
        }
        public void get_departments_list(String callback) {
            CancelView();
            CancelLayout();
            var tmp = ActiveRecordBase<departments>.FindAll().Select(i => new { i.id, i.name });
            if (tmp.Count() > 0) {
                render_list_json(tmp, callback);
            } else {
                RenderText("false");
            }
        }
        public void get_schools_list(String callback) {
            CancelView();
            CancelLayout();
            var tmp = ActiveRecordBase<schools>.FindAll().Select(i => new { i.id, i.name });
            if (tmp.Count() > 0) {
                render_list_json(tmp, callback);
            } else {
                RenderText("false");
            }
        }
        public void get_programs_list(String callback) {
            CancelView();
            CancelLayout();
            var tmp = ActiveRecordBase<programs>.FindAll().Select(i => new { i.id, i.name });
            if (tmp.Count() > 0) {
                render_list_json(tmp, callback);
            } else {
                RenderText("false");
            }
        }


        public void get_authors_places_list(String callback) {
            get_authors_places_list(userService.getUserFull(), callback);
        }

        public void get_authors_places_list(users user, String callback) {
            CancelView();
            CancelLayout();
            String nsql = "SELECT p FROM place AS p WHERE " + user.id + " in Elements(p.Authors)";
            SimpleQuery<place> nq = new SimpleQuery<place>(typeof(place), nsql);
            var tmp = nq.Execute();
            var tmp2 = tmp.ToArray().Select(i => new { i.id, i.prime_name });

            if (tmp2.Count() > 0) {
                render_list_json(tmp2, callback);
            } else {
                RenderText("false");
            }
        }
        /* come back to
        public void get_owned_sections_list(String callback)
        {
            get_owned_sections_list(UserService.getUser(), callback);
        }

        public void get_owned_sections_list(authors user, String callback)
        {
            CancelView();
            CancelLayout();
            String nsql = "SELECT p FROM place AS p WHERE " + user + " in Elements(p.Authors)";
            SimpleQuery<place> nq = new SimpleQuery<place>(typeof(place), nsql);
            var tmp = nq.Execute();
            var tmp2 = tmp.ToArray().Select(i => new { i.id, i.prime_name });

            if (tmp2.Count() > 0)
            {
                render_list_json(tmp2, callback);
            }
            else
            {
                RenderText("false");
            }
        }
        */

        public void get_all_places_list(String callback) {
            CancelView();
            CancelLayout();
            var tmp = ActiveRecordBase<place>.FindAll().Select(i => new { i.id, i.prime_name});
            if (tmp.Count() > 0) {
                render_list_json(tmp, callback);
            } else {
                RenderText("false");
            }
        }



        // by = deparment
        public void get_place_list_attr(string by, int id, String callback) {
            CancelView();
            CancelLayout();

            // Search place names
            String nsql = "SELECT p FROM place AS p WHERE " + id + " in Elements(p." + by + ")";
            SimpleQuery<place> nq = new SimpleQuery<place>(typeof(place), nsql);
            var tmp = nq.Execute();
            var tmp2 = tmp.ToArray().Select(i => new { i.id, i.prime_name, i.staticMap  });

            if (tmp2.Count() > 0) {
                render_list_json(tmp2, callback);
            } else {
                RenderText("false");
            }
        }


        public void get_authors_geometrics_list(String callback) {
            get_authors_geometrics_list(userService.getUserFull(), callback);
        }

        public void get_authors_geometrics_list(users user, String callback) {
            CancelView();
            CancelLayout();
            String nsql = "SELECT g FROM geometrics AS g WHERE " + user.id + " in Elements(g.Authors)";
            SimpleQuery<geometrics> nq = new SimpleQuery<geometrics>(typeof(geometrics), nsql);
            var tmp = nq.Execute();
            var tmp2 = tmp.ToArray().Select(i => new { i.id, i.name });

            if (tmp2.Count() > 0) {
                render_list_json(tmp2, callback);
            } else {
                RenderText("false");
            }
        }
        public void get_all_geometrics_list(String callback) {
            CancelView();
            CancelLayout();
            var tmp = ActiveRecordBase<geometrics>.FindAll().Select(i => new { i.id, i.name, i.parent }).Where(x => x.parent==null);
            if (tmp.Count() > 0) {
                render_list_json(tmp, callback);
            } else {
                RenderText("false");
            }
        }







        public String render_list_json(dynamic tmp, String callback) {
            var jss = new JavaScriptSerializer();
            var json = jss.Serialize(tmp);
            //String json = Serialize(tmp);
            if (!string.IsNullOrEmpty(callback)) {
                json = callback + "(" + json + ")";
            }
            Response.ContentType = "application/json; charset=UTF-8";
            RenderText(json);
            return json;
        }




        public void get_Style(int id, String callback) {
            CancelView();
            CancelLayout();
            styles style = ActiveRecordBase<styles>.Find(id);
            String json = style.style_obj;
            if (!string.IsNullOrEmpty(callback)) {
                json = callback + "(" + json + ")";
            }
            Response.ContentType = "application/json; charset=UTF-8";
            RenderText(json);
        }
        #endregion



        public void emailDir(String name, String email, String directions, String notes, String recipientname, String recipientemail) {
            CancelView();
            CancelLayout();

            if (!helperService.IsValidEmail(email)) {
                RenderText("email:false");
                return;
            }
            if (!helperService.IsValidEmail(recipientemail)) {
                RenderText("recipientemail:false");
                return;
            }



            List<String> sentemails = new List<String>();

            PropertyBag["date"] = formatDate(DateTime.Now);
            PropertyBag["directions"] = directions;
            PropertyBag["name"] = name;
            PropertyBag["recipientname"] = recipientname;
            PropertyBag["notes"] = notes;

            System.Net.Mail.MailMessage email_mass = RenderMailMessage("directions", null, PropertyBag);
            email_mass.IsBodyHtml = true;
            email_mass.From = new MailAddress("noreply@wsu.edu");
            email_mass.To.Add(new MailAddress(email, name));
            email_mass.To.Add(new MailAddress(recipientemail, recipientname));
            email_mass.Subject = "Directions from WSU";

            try {
                DeliverEmail(email_mass);
                RenderText("Sent");
                return;
            } catch (Exception ex) {
                RenderText("false");
                return;
            }


        }
        public void reportError(String name, String email, String reported_url, String place_name, int place_id, String ua, String description, String issueType, String data) {
            CancelView();
            CancelLayout();

            //users[] users = ActiveRecordBase<users>.FindAllByProperty("access_levels", ActiveRecordBase<user_groups>.Find(1));

            List<String> sentemails = new List<String>();
            String date = formatDate(DateTime.Now);
            PropertyBag["date"] = date;
            PropertyBag["description"] = description;
            PropertyBag["name"] = name;
            PropertyBag["email"] = email;
            PropertyBag["reported_url"] = reported_url;
            PropertyBag["place_id"] = place_id;
            PropertyBag["issueType"] = issueType;
            PropertyBag["place_name"] = place_name;
            PropertyBag["ua"] = ua;
            PropertyBag["data"] = data;

            if ((issueType == "local" || issueType == "content") && place_id > 0) {
                place item = ActiveRecordBase<place>.Find(place_id);
                item.needs_update = true;
                ActiveRecordMediator<place>.Save(item);
                ActiveRecordMediator<place>.Refresh(item);
            }

            // Create and return new Hashtable.
            Hashtable emails = new Hashtable();
            emails.Add("nathan_owen@wsu.edu", "Nathan Owen");
            if (!String.IsNullOrWhiteSpace(email) && !String.IsNullOrWhiteSpace(name)) {
                emails.Add(email, name);
            }

            foreach (DictionaryEntry entry in emails) {
                PropertyBag["reporter"] = false;
                if (!String.IsNullOrWhiteSpace(name) && entry.Value.ToString() == name) {
                    PropertyBag["reporter"] = true;
                }
                System.Net.Mail.MailMessage email_mass = RenderMailMessage("place_errors", null, PropertyBag);
                email_mass.IsBodyHtml = true;
                email_mass.From = new MailAddress("noreply@wsu.edu");
                email_mass.To.Add(new MailAddress(entry.Key.ToString(), entry.Value.ToString()));

                if ((issueType == "local" || issueType == "content") && place_id > 0) {
                    place place = ActiveRecordBase<place>.Find(place_id);
                    foreach (users auth in place.authors) {
                       // email_mass.To.Add(new MailAddress(auth.email, auth.name));
                    }
                }


                email_mass.Subject = "Reported Map error: " + issueType;

                try {
                    DeliverEmail(email_mass);
                } catch (Exception ex) {
                    RenderText(ex.ToString());
                }
            }

                    //if (!String.IsNullOrWhiteSpace(user.email)) {}
                //if (user.nid == "jeremy.bass") {}
            //foreach (users user in users) {}
            RenderText("true");
        }
        public void emailRequest(String name, String email, String Deparments, String description, String issueType) {
            CancelView();
            CancelLayout();

            users[] users = ActiveRecordBase<users>.FindAllByProperty("access_levels", ActiveRecordBase<user_groups>.Find(1));

            List<String> sentemails = new List<String>();

            PropertyBag["date"] = formatDate(DateTime.Now);
            PropertyBag["description"] = description;
            PropertyBag["name"] = name;
            PropertyBag["email"] = email;
            PropertyBag["Deparments"] = Deparments;
            PropertyBag["issueType"] = issueType;

            foreach (users user in users) {
                if (user.nid == "nathan_owen") {
                    System.Net.Mail.MailMessage email_mass = RenderMailMessage("access_request", null, PropertyBag);
                    email_mass.IsBodyHtml = true;
                    email_mass.From = new MailAddress("noreply@wsu.edu");
                    email_mass.To.Add(new MailAddress("nathan_owen@wsu.edu", "Nathan Owen"));
                    email_mass.Subject = "Access to Map request: " + issueType;
                    if (!String.IsNullOrWhiteSpace(user.email)) {
                        try {
                            DeliverEmail(email_mass);
                            RenderText("Sent");
                        } catch (Exception ex) {
                            RenderText(ex.ToString());
                        }
                    }
                }
            }
            RenderText("true");
        }


        /*
         * Get the value of a field that is attached to the 
         * place.
         */
        public static string getFieldVal(field_types field_type, place _place) {
            string value = "";

            List<AbstractCriterion> typeEx = new List<AbstractCriterion>();
            typeEx.Add(Expression.Eq("type", field_type));
            if (!object.ReferenceEquals(_place, null)) typeEx.Add(Expression.Eq("owner", _place.id));
            fields field = ActiveRecordBase<fields>.FindFirst(typeEx.ToArray());
            value = FieldsService.getFieldVal(field_type, field);
            return value;
        }

        /*
         * Take a string loop over all the fields 
         * test if the pattern with the field.alias is in
         * the text.  if in text replace with value.
         */
        public string processFields(string text, place place) {
            String result = text;
            if (place.model != null) {
                List<AbstractCriterion> typeEx = new List<AbstractCriterion>();
                typeEx.Add(Expression.Eq("model", "placeController"));
                typeEx.Add(Expression.Eq("set", place.model.id));

                field_types[] ft = ActiveRecordBase<field_types>.FindAll(typeEx.ToArray());
                List<string> fields = new List<string>();


                //log.Error(" place:" + place.prime_name);


                if (ft != null) {
                    foreach (field_types ft_ in ft) {
                        string value = "";
                        if (text.Contains("$!{" + ft_.alias + "}")) {
                            //log.Error("on field:" + ft_.alias);
                            value = getFieldVal(ft_, place);
                            result = result.Replace("$!{" + ft_.alias + "}", value);
                            PropertyBag["" + ft_.alias] = value;
                        }
                    }
                }
            }
            return result;
        }
        /*
         * Take a string loop over all the fields 
         * test if the pattern with the field.alias is in
         * the text.  if in text replace with value.
         */
        public string autoProcessFeilds(place place) {
            String text = "";
            if (place.model != null) {
                //log.Info("________________________________________________________________________________\nLoading feilds For:" + place.prime_name+"("+place.id+")\n");
                List<AbstractCriterion> typeEx = new List<AbstractCriterion>();
                typeEx.Add(Expression.Eq("model", "placeController"));
                typeEx.Add(Expression.Eq("set", place.model.id));

                field_types[] ft = ActiveRecordBase<field_types>.FindAll(typeEx.ToArray());
                List<string> fields = new List<string>();


                //log.Error(" place:" + place.prime_name);
                Hashtable hashtable = new Hashtable();
                hashtable["place"] = place;

                if (ft != null) {
                    foreach (field_types ft_ in ft) {
                        string value = "";
                        value = getFieldVal(ft_, place);
                        hashtable["" + ft_.alias] = value;
                        //log.Info("hashtable[" + ft_.alias+"]" + value);
                    }
                }
                String renderPath = getRootPath();

                text = System.IO.File.ReadAllText(renderPath + "Views/public/central/accessibilties.vm");
                text = helperService.proccessText(hashtable, text, true).Trim();
                //log.Info("text:" + text);
            }
            return text;
        }
        /*
         * Take a string loop over all the fields 
         * test if the pattern with the field.alias is in
         * the text.  if in text replace with value.
         */
        public string autoFeildProcessing(place place, string text) {
            if (place.model != null) {
                //log.Info("________________________________________________________________________________\nLoading feilds For:" + place.prime_name+"("+place.id+")\n");
                List<AbstractCriterion> typeEx = new List<AbstractCriterion>();
                typeEx.Add(Expression.Eq("model", "placeController"));
                typeEx.Add(Expression.Eq("set", place.model.id));

                field_types[] ft = ActiveRecordBase<field_types>.FindAll(typeEx.ToArray());
                List<string> fields = new List<string>();


                //log.Error(" place:" + place.prime_name);
                Hashtable hashtable = new Hashtable();
                hashtable["place"] = place;

                if (ft != null) {
                    foreach (field_types ft_ in ft) {
                        string value = "";
                        value = getFieldVal(ft_, place);
                        hashtable["" + ft_.alias] = value;
                        //log.Info("hashtable[" + ft_.alias+"]" + value);
                    }
                }
                text = helperService.proccessText(hashtable, text, false).Trim();
                //log.Info("text:" + text);
            }
            return text;
        }



        public void setJsonCache(string uploadPath, string file, string blob) {
            if (!HelperService.DirExists(uploadPath)) {
                System.IO.Directory.CreateDirectory(uploadPath);
            }
            System.IO.File.WriteAllText(uploadPath + file, blob);
        }

        public String getJsonCache(String uploadPath, string file, DateTime oldestAllowed)
        {
            DateTime lastWriteTime = File.GetLastWriteTime(uploadPath + file);
            if (lastWriteTime > oldestAllowed || oldestAllowed == DateTime.MinValue)
                return System.IO.File.ReadAllText(uploadPath + file);
            else
                return null;
        }

        public String getFileName(String[] categoriesarray, String pid)
        {
            String categories = String.Join("", categoriesarray);
            return getFileName(categories, pid);
        }

        public String getFileName(String categories, String pid)
        {
            String key = categories + pid;
            String filename = key.GetHashCode()  + "_centralplacehash.ext";
            return filename;
        }
        
        public static place[] searchAndAddResultsToHashtable(String hql, String searchterm) {
            SimpleQuery<place> query = new SimpleQuery<place>(typeof(place), hql);
            query.SetParameter("searchterm", "%" + searchterm + "%");
            return query.Execute();
        }

        public void keywordAutoComplete(string name_startsWith, string callback) {
            CancelView();
            CancelLayout();

            String term = name_startsWith.Trim();

            SortedDictionary<string, int> results = search_place_string(term);

            /* end of this hacky thing.. now you need to return a place id tied so un hack it */
            String labelsList = "";
            foreach (String key in results.Keys) {
                if (!key.StartsWith("RELATED|")) {
                    string name = key.Split(':')[1];
                    labelsList += @"{";
                    labelsList += @"""label"":""" + name + @""",";
                    labelsList += @"""value"":""" + name + @""",";
                    labelsList += @"""place_id"":""" + int.Parse(results[key].ToString()) + @""",";
                    labelsList += @"""related"":""false""";
                    labelsList += @"},";
                }
            }


            bool hasRelated = false;

            foreach (String key in results.Keys) {
                if (key.StartsWith("RELATED|")) {

                    if (!hasRelated) {
                        labelsList += @"{";
                        labelsList += @"""label"":""------"",";
                        labelsList += @"""value"":""------"",";
                        labelsList += @"""place_id"":""------"",";
                        labelsList += @"""related"":""header""";
                        labelsList += @"},";
                    }
                    hasRelated = true;
                    string name = key.Split('|')[1].Split(':')[1];
                    labelsList += @"{";
                    labelsList += @"""label"":""" + name + @""",";
                    labelsList += @"""value"":""" + name + @""",";
                    labelsList += @"""place_id"":""" + int.Parse(results[key].ToString()) + @""",";
                    labelsList += @"""related"":""true""";
                    labelsList += @"},";
                }
            }




            String json = "[" + labelsList.TrimEnd(',') + "]";

            if (!string.IsNullOrEmpty(callback)) {
                json = callback + "(" + json + ")";
            }
            Response.ContentType = "application/json; charset=UTF-8";
            RenderText(json);
        }

        public static List<place> filterPage(String term) {
            List<place> listtems = new List<place>();
            int sid = 0;
            if (!int.TryParse(term, out sid)) {
                term = term.Trim();
                SortedDictionary<string, int> results = search_place_string(term);
                List<int> ids = new List<int>();
                foreach (int res in results.Values) {
                    if (!ids.Contains(res)){
                        listtems.Add(ActiveRecordBase<place>.Find(res));
                        ids.Add(res);
                    }
                }

            }
            if (sid > 0) {

                listtems.Add(ActiveRecordBase<place>.Find(sid));
            }
            return listtems;
        }

        public void get_place(String id, string callback) {
            CancelView();
            CancelLayout();
            Response.ContentType = "application/json; charset=UTF-8";
            int sid = 0;
            if (!int.TryParse(id, out sid)) {
                String term = id.Trim();
                SortedDictionary<string, int> results = search_place_string(term);
                foreach (String key in results.Keys) {
                    if (key.Split(':')[1].ToLower().Trim() == id.ToLower().Trim() || key.Split(':')[1].ToLower().Trim().Contains(id.ToLower().Trim())) {
                        sid = int.Parse(results[key].ToString());
                        break;
                    }
                }
            }
            if (sid > 0) {
                place item = ActiveRecordBase<place>.Find(sid);
                place[] obj = new place[1];
                obj[0] = item;
                sendPlaceJson(obj, callback);
            } else {
                RenderText("false");
            }
        }
        public void get_place_obj(String id, string callback) {
            CancelView();
            CancelLayout();
            Response.ContentType = "application/json; charset=UTF-8";
            int sid = 0;
            if (!int.TryParse(id, out sid)) {
                String term = id.Trim();
                SortedDictionary<string, int> results = search_place_string(term);
                foreach (String key in results.Keys) {
                    if (key.Split(':')[1].ToLower().Trim() == id.ToLower().Trim() || key.Split(':')[1].ToLower().Trim().Contains(id.ToLower().Trim())) {
                        sid = int.Parse(results[key].ToString());
                        break;
                    }
                }
            }
            if (sid > 0) {
                place item = ActiveRecordBase<place>.Find(sid);
                place[] obj = new place[1];
                obj[0] = item;
                send_place_json(obj, callback);
            } else {
                RenderText("false");
            }
        }
        public static SortedDictionary<string, int> search_place_string(string term) {
            // Use hashtable to store name/value pairs
            SortedDictionary<string, int> results = new SortedDictionary<string, int>();
            //id is for order
            int i = 0;
			status publishedStatus = ActiveRecordMediator<status>.FindByPrimaryKey(3);
            // Trying a different Query method
            // Here was the all inclusive query (not used for now except for reference)
            String overallsqlstring = @"from place p where 
                   p.abbrev_name LIKE :searchterm 
                or p.prime_name like :searchterm
                or (p in (select p from p.tags as t where t.name like :searchterm)) 
                or (p in (select p from p.names as n where n.name like :searchterm))
where p.status = 3
                order by p.prime_name ASC
                ";


            // Search place prime name
            String searchprime_name = @"SELECT p FROM place AS p WHERE p.prime_name LIKE '%" + term + "%' and p.status =3  order by p.prime_name ASC";

            SimpleQuery<place> pq = new SimpleQuery<place>(typeof(place), searchprime_name);
            place[] places = pq.Execute();

            foreach (place place in places) {
                //results[i.ToString() + ":" + place.prime_name] = place.id;
                if (results.Any(item => item.Key.Split(':')[1].Trim() == place.prime_name.Trim())
                    && results.Any(item => item.Value == place.id)
                    ) {
                } else {
                    results.Add(i.ToString() + ":" + place.prime_name.Trim(), place.id);
                    i++;
                }
            }

            // Search place abbrev
            String searchabbrev = @"from place p where 
                   p.abbrev_name LIKE :searchterm 
			and p.status = 3
 order by p.prime_name ASC
                ";

            foreach (place place in searchAndAddResultsToHashtable(searchabbrev, term)) {
                //results[i.ToString()+":"+place.abbrev_name] = place.id;
                if (results.Any(item => item.Key.Split(':')[1].Trim() == place.abbrev_name.Trim())
                    && results.Any(item => item.Value == place.id)
                    ) {
                } else {
                    results.Add(i.ToString() + ":" + place.abbrev_name.Trim(), place.id);
                    i++;
                }
            }

            // Search place names
            String nsql = "SELECT DISTINCT pn FROM place_names AS pn WHERE NOT pn.name = 'NULL'";
            if (!String.IsNullOrEmpty(term)) {
                nsql += " AND pn.name LIKE  '%" + term + "%'";
            }
            SimpleQuery<place_names> nq = new SimpleQuery<place_names>(typeof(place_names), nsql);
            place_names[] placenames = nq.Execute();
            // Loop through the place names
            foreach (place_names placename in placenames) {
				foreach(place oneplace in placename.places)
				if (oneplace.status == publishedStatus)
				{
					if (results.Any(item => item.Key.Split(':')[1].Trim() == placename.name.Trim())
						&& results.Any(item => item.Value == oneplace.id)
						)
					{
					}
					else
					{
						//results[i.ToString() + ":" + placename.name] = placename.place_id;
						results.Add(i.ToString() + ":" + placename.name.Trim(), oneplace.id);
						i++;
					}
				}
            }


            // Search tags
            String sql = "SELECT DISTINCT t FROM tags AS t WHERE NOT t.name = 'NULL'";
            if (!String.IsNullOrEmpty(term)) {
                sql += " AND t.name LIKE  '%" + term + "%'";
            }
            SimpleQuery<tags> q = new SimpleQuery<tags>(typeof(tags), sql);
            tags[] tags = q.Execute();
            // Loop through the tags' places
            foreach (tags tag in tags) {
                String ids = "";
                foreach (place place in tag.places) {
					if(place.status == publishedStatus)
					{ 
						if (String.IsNullOrEmpty(ids))
							ids = place.id.ToString();
						else
							ids += "," + place.id.ToString();

						if (results.Any(item => item.Key.Split(':')[1] == place.prime_name.Trim())
							&& results.Any(item => item.Value == place.id))
						{
						}
						else
						{
							results.Add("RELATED|" + i.ToString() + ":" + place.prime_name.Trim(), place.id);
							i++;
						}
					}
				}
                //results[i.ToString() + ":" + tag.name] = ids;
            }
            return results;
        }




        public void getShapesJson_byIds(int[] ids, string callback) {

            if (ids.LongCount() == 0 || (ids.LongCount() == 1 && ids[0] == 0)) {
                RenderText("false");
                return;
            }
            List<geometrics> items = new List<geometrics> { };
            foreach (int id in ids) {
                items.Add(ActiveRecordBase<geometrics>.Find(id));
            }


            IList<geometrics> tmpGeo = items;
            String json = "";
            json += @"  {""shapes"":[";
            int i = 0;
            foreach (geometrics geo in tmpGeo) {
                if (geo!=null && geo.id > 0) {
                    String shape = geometricService.getShapeLatLng_json_str(geo.id, true);
                    if (!String.IsNullOrWhiteSpace(shape)) {
                        json += shape;
                        if (i < tmpGeo.Count - 1) {
                            json += ",";
                        }
                        i++;
                    }
                }
            }
            if (tmpGeo.Count == 0){
                json += "{}";
            }
            json += @"]}";
            if (!string.IsNullOrEmpty(callback)) {
                json = callback + "(" + json + ")";
            }
            Response.ContentType = "application/json; charset=UTF-8";
            RenderText(jsonEscape(json));

        }



        public string loadPlaceShape(place place) {
            IList<geometrics> tmpGeo = place.geometrics;
            String json = "";
            json += @"  [";
            int i = 0;
            foreach (geometrics geo in tmpGeo) {

                json += geometricService.getShapeLatLng_json_str(geo.id, true);
                if (i < tmpGeo.Count - 1) json += ",";
                i++;
            }
            if (tmpGeo.Count == 0) json += "{}";
            json += @"]";

            return json;
        }

        public void get_place_by_name(string name, string callback) {
            CancelView();
            CancelLayout();
            string cleanedname = Regex.Replace(name, @"\(.*?\)", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);
            if (!String.IsNullOrEmpty(cleanedname))
                cleanedname = cleanedname.Trim();
            IList<place_names> c = ActiveRecordBase<place_names>.FindAllByProperty("name", cleanedname);
            String sql = "from place p where p.prime_name = :p0 or p.infoTitle = :p0 or p.abbrev_name = :p0 ";
            if(c.Count > 0)
                sql += " or :p1 in elements(p.names)";

            SimpleQuery<place> q = new SimpleQuery<place>(typeof(place), sql);
            q.SetParameter("p0", cleanedname);
            if(c.Count > 0)
                q.SetParameter("p1", c[0]);

            place[] list = q.Execute();

            sendPlaceJson(list, callback);
        }

        //deprecated
        public void get_place_by_category(string[] cat, string pid, string callback) {
            CancelView();
            CancelLayout();
            String cachedversion = getJsonCache(getDefaultAppPath(), getFileName(cat, pid), DateTime.Now.AddDays(-7));
            if (cachedversion == null)
            {
                String sql = "from place p where ";
                int id = 1;
                foreach (string category in cat)
                {
                    string cats = HttpUtility.UrlDecode(category);
                    IList<categories> c = ActiveRecordBase<categories>.FindAllByProperty("friendly_name", cats);
                    if (c.Count > 0)
                    {
                        sql += " :p" + id + " in elements(p.categories) ";
                        id = id + 1;
                        sql += " or ";
                    }
                }
                sql += " 1=0 ";
                sql += " ORDER BY p.prime_name ASC ";
                SimpleQuery<place> q = new SimpleQuery<place>(typeof(place), sql);
                id = 1;
                foreach (string category in cat)
                {
                    string cats = HttpUtility.UrlDecode(category);
                    IList<categories> c = ActiveRecordBase<categories>.FindAllByProperty("friendly_name", cats);
                    if (c.Count > 0)
                    {
                        q.SetParameter("p" + id, c[0]);
                        id = id + 1;
                    }
                }
                place[] items = q.Execute();
                String json = sendPlaceJson(items, callback);
                setJsonCache(getDefaultAppPath(), getFileName(cat, pid), json);
            }
            else
                sendCachedJson(cachedversion, callback);
        }


        public void get_place_obj_by_category(string[] cat, string pid, string callback) {
            CancelView();
            CancelLayout();

            String sql = "from place p where ";
            int id = 1;
            foreach (string category in cat) {
                string cats = HttpUtility.UrlDecode(category);
                IList<categories> c = ActiveRecordBase<categories>.FindAllByProperty("friendly_name", cats);
                if (c.Count > 0) {
                    sql += " :p" + id + " in elements(p.categories) ";
                    id = id + 1;
                    sql += " or ";
                }
            }
            sql += " 1=0 ";
            sql += " ORDER BY p.prime_name ASC ";
            SimpleQuery<place> q = new SimpleQuery<place>(typeof(place), sql);
            id = 1;
            foreach (string category in cat) {
                string cats = HttpUtility.UrlDecode(category);
                IList<categories> c = ActiveRecordBase<categories>.FindAllByProperty("friendly_name", cats);
                if (c.Count > 0) {
                    q.SetParameter("p" + id, c[0]);
                    id = id + 1;
                }
            }
            place[] items = q.Execute();
            send_place_json(items, callback);
        }



        public void gamedaytourmode()  {
            Hashtable result = new Hashtable();
            campus thecampus = ActiveRecordBase<campus>.Find(1);
            result["mode"] = thecampus.gameDayTourOn;
            RenderText( JsonConvert.SerializeObject(result) );
        }

        public void get_place_by_categoryname(string catname, string callback) {
            CancelView();
            CancelLayout();
            place[] items = new List<place>().ToArray();
            IList<categories> c = ActiveRecordBase<categories>.FindAllByProperty("name", catname);
            if (c.Count > 0)
            {
                String sql = "from place p where :p in elements(p.categories) ORDER BY p.prime_name ASC ";
                SimpleQuery<place> q = new SimpleQuery<place>(typeof(place), sql);
                q.SetParameter("p", c[0]);
                items = q.Execute();
            }
            sendPlaceJson(items, callback);
        }
        public void get_place_by_keyword(string str, string callback) {
            sendPlaceJson(placeservice.getPlacesByKeyword(str), callback);
        }

        //deprecated
        public void getPlaceJson_byIds(int[] ids, string callback) {
            List<place> items = new List<place> { };
            foreach (int id in ids) {
                items.Add(ActiveRecordBase<place>.Find(id));
            }
            sendPlaceJson(items.ToArray(), callback);
        }
        //deprecated
        public String sendPlaceJson(place[] items, string callback) {
            String json = createPlaceJson(items);
            if (!string.IsNullOrEmpty(callback)) {
                json = callback + "(" + json + ")";
            }
            Response.ContentType = "application/json; charset=UTF-8";
            RenderText(json);
            return json;
        }

        public void sendCachedJson(String json, string callback)
        {
            if (!string.IsNullOrEmpty(callback))
            {
                json = callback + "(" + json + ")";
            }
            Response.ContentType = "application/json; charset=UTF-8";
            RenderText(json);
        }


        public void get_places(int[] ids, string callback) {
            List<place> items = new List<place> { };
            foreach (int id in ids) {
                if (id > 0) {
                    items.Add(ActiveRecordBase<place>.Find(id));
                }
            }
            send_place_json(items.ToArray(), callback);
        }

        public void send_place_json(place[] items, string callback) {
            String json = create_place_json(items);
            if (!string.IsNullOrEmpty(callback)) {
                json = callback + "(" + json + ")";
            }
            Response.ContentType = "text/javascript; charset=UTF-8";
            RenderText(json);
        }




        public void markerSVG(string idx) {
            CancelView();
            String json = "<?xml version='1.0' encoding='utf-8'?><!-- Generator: Adobe Illustrator 18.1.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version='1.1' id='Layer_2' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='104 23 429.5 739' enable-background='new 104 23 429.5 739' xml:space='preserve'><path fill='#9E1D32' stroke='#FFFFFF' stroke-width='6' stroke-miterlimit='10' d='M529.7,237.8c0,116.1-196.6,521.1-210.4,521.1 c-16.9,0-210.4-404.8-210.4-521.1S203,27.4,319.3,27.4S529.7,121.5,529.7,237.8z'/><text class='marker-number' transform='matrix(1 0 0 1 133.6372 294.8559)' x='180' y='0' text-anchor='middle'  fill='#F1F1F1' font-size='225' >" + idx + "</text></svg>";
            Response.ContentType = "image/svg+xml; charset=UTF-8";
            RenderText(json);
        }

        public void coug_marker() {
            CancelView();
            String json = "<?xml version='1.0' encoding='utf-8'?><!-- Generator: Adobe Illustrator 18.1.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 64 111.7' enable-background='new 0 0 64 111.7' xml:space='preserve'><path fill='#9A1B2F' stroke='#b2b2b2' stroke-width='3' stroke-miterlimit='8' d='M32,0C14.3,0,0,14.3,0,32c0,14.6,21.8,58.6,29.4,77.2c1.4,3.5,3.8,3.5,5.2,0C42.2,90.6,64,46.6,64,32 C64,14.3,49.7,0,32,0z'/><g><g><g><g><g><path fill='#FFFFFF' d='M36.2,49.7c0,0,1.9-0.8,3-4.1c0.9,2,0.7,4,0.7,4C39.1,49.8,36.2,49.7,36.2,49.7z'/><path fill='#FFFFFF' d='M46.7,31.2c0,0,1.2,6.5-3,6.7c-4.1,0.2-6-5.9-6-5.9s1,12,6.7,11.2C50.8,42.3,46.7,31.2,46.7,31.2z'/></g></g><path fill='#FFFFFF' d='M15.8,48.1C15.8,48.1,15.8,48.1,15.8,48.1c4.8-1.1,8.4-6.6,9.4-8.9l0.7-1.4l0.4,1.5 c0,0.1,0.5,1.7,0.5,3.9c0,0.2,0,0.5,0,0.7c1.6,0.1,2.8-0.3,3.5-1c1-1.1,1.4-3.1,1-6.3c-0.2-1.5-0.7-3.9-1.2-6 c-0.3-1.1-0.5-2.1-0.6-2.8c-0.9-4.6,0.2-7.4,1.3-9c0.2-0.3,0.4-0.5,0.6-0.7c-3.3,1.1-6,2.8-8.9,5.7l2,2.3l0.8-0.8 c0.8,2.9,0.2,5.5,0.2,5.5c-1.1-1.6-2.3-2.9-2.3-2.9l0.5-0.9l-1.8-2.1l-0.2-0.2c-2.2,3-2.9,5.5-2.9,5.5l1.6,1.4l0.9,0.8l0.3-0.9 c1.7,3.2,0.1,6.1,0.1,6.1c-0.3-1.1-1.4-2.7-1.4-2.7l0.4-1.5l-2.3-2.1c-2.4,7.6-5.7,10.1-5.7,10.1s3.5-0.6,5.5-1.3 C18.2,40.5,18.2,44.5,15.8,48.1z'/><path fill='#FFFFFF' d='M51.2,20.7l-5.6,0.2c0,0.7-0.1,1.3-0.3,2c0.5,2.3,0.2,3.5,0.2,3.5c-0.9-2.2-1.7-2.8-1.7-2.8 c-5.1-2.3-8,2.9-7.7,6.2c0.3,2.8,1.2,6.4,2,12.1c0.7,4.8-1.8,6.9-4.6,7.4c-0.1,0-0.1,0-0.2,0c0,0,0,0,0,0 c-0.5,0.1-0.9,0.1-1.4,0.1c0,0,0,0-0.1,0c-0.1,0-0.1,0-0.2,0c-0.2,0-0.4,0-0.7-0.1c-2.2-0.3-7.1-1.2-12.1-1.3 c3-1.7,5.3-4.7,6.6-6.9c0.1,0.6,0.1,1.3,0.1,2.1c0,0.4,0,0.8-0.1,1.2l0,0.6l0.6,0.1c2.3,0.2,4-0.2,5-1.4c1.3-1.4,1.7-3.7,1.3-7.2 c-0.2-1.6-0.8-4-1.2-6.1c-0.3-1.1-0.5-2.1-0.6-2.8c-0.8-4.2,0.2-6.7,1.1-8.1c0.8-1.1,1.8-1.9,3-2.3c0,0,0,0,0.1,0l1.9-5.9h0.6 L36,17.1c0.3-0.1,0.6-0.1,0.9-0.1l1.6-5.2h0.6L38,16.8c1.7-0.2,3.6-0.4,5.6-0.5c0.3,0.1,0.7,0.5,1,1.1l5.4-1.7l0.2,0.6l-5.2,2 c0,0.1,0.1,0.2,0.1,0.3l5.6-0.7l0.1,0.6l-5.5,1.1c0,0.1,0,0.2,0,0.3l5.7,0.2L51.2,20.7z M35,23.2c1.1-0.8,3.1-1.4,4.9-1.3 c0.5,0,0.8-0.1,0.4-0.3c-1.4-0.7-4.5-0.5-5.6,0.3c-1.8,1.2-1.5,3.4-1.4,3.4C33.5,24.7,34.1,23.8,35,23.2z'/></g></g></g></svg>";
            Response.ContentType = "image/svg+xml; charset=UTF-8";
            RenderText(json);
        }



        public static String returnPlaceJson(place[] items) {
            String json = new publicController().createPlaceJson(items);
            return json;
        }

        public String getDefaultAppPath()
        {
            string appPath = getRootPath();
            return appPath + "cache/places/";
        }
        public String createPlaceJson(place[] items) {
            /* the responsable thing to do here is to remove the html into a template */
            /* secound make the feed a template too so there should be 3 templates */
            string appPath = getRootPath();
            String cachePath = appPath + "cache/places/";
            String placeList = "";
            String jsonStr = "";
            int count = 0;
            foreach (place item in items) {
                if ((item != null && item.status!=null && item.status.id == 3 && item.isPublic) || !String.IsNullOrWhiteSpace(HttpContext.Current.Request.Params["all"])) {
                    if (item.coordinate != null) {

                        string file = item.id + "_centralplace" + ".ext";
                        if (!File.Exists(cachePath + file) || !String.IsNullOrWhiteSpace(HttpContext.Current.Request.Params["dyno"])) {
                            //dynamic value;
                            var jss = new JavaScriptSerializer();
                            string details = ((!string.IsNullOrEmpty(item.details)) ? processFields(item.details, item).Replace("\"", @"\""").Replace('\r', ' ').Replace('\n', ' ') : "");

                            String mainimage = "";
                            if (item.Images.Count > 0) {
                                /* note the width and height should be abstracted out into a map preference*/
                                mainimage = "<a href='" + getRootUrl() + "media/download.castle?placeid=" + item.id + "&id=" + item.Images[0].id + "' alt='" + (String.IsNullOrEmpty(item.Images[0].caption) ? "" : item.Images[0].caption) + "'  hidefocus='true' rel='gouped' class='gouped headImage orientation_" + item.Images[0].orientation + "'>";
                                mainimage += "<span class='imgEnlarge'></span>";
                                mainimage += "<img src='" + getRootUrl() + "media/download.castle?placeid=" + item.id;

                                //NOTE THIS IS AN EXAMPLE OF WHERE THE DEFAULTS WOULD COME INTO PLAY
                                int width = 148;
                                int height = 100;
                                if (item.Images[0].orientation == "v") {
                                    width = 100;
                                    height = 148;
                                }

                                String size = "w=" + width + "&h=" + height + "";

                                mainimage += "&id=" + item.Images[0].id + "&m=crop&" + size + "' rel='gouped' title='" + getRootUrl();
                                mainimage += "media/download.castle?placeid=" + item.id + "&id=" + item.Images[0].id + "' alt='";
                                mainimage += (String.IsNullOrEmpty(item.Images[0].caption) ? "" : item.Images[0].caption);
                                mainimage += "' class='img-main' width='" + width + "' height='" + height + "'/>";
                                mainimage += "</a>";
                            }

                            String infoTitle = "";
                            if (item.hideTitles != true) {
                                infoTitle = "<h2 class='header'>" + ((!string.IsNullOrEmpty(item.infoTitle)) ? item.infoTitle.Trim() : item.prime_name.Trim()) + ((!string.IsNullOrEmpty(item.abbrev_name)) ? " (" + item.abbrev_name.Trim() + ")" : "") + "</h2>";
                            }



                            String imgGallery = "";
                            if (item.Images.Count > 1) {
                                String galImg = "";
                                int c = 0;
                                bool hasImg = false;
                                bool hasVid = false;
                                foreach (media_repo media in item.Images) {
                                    if (c > 0) {
                                        /* note the width and height should be abstracted out into a map preference*/
                                        galImg += "<li><a href='" + getRootUrl() + "media/download.castle?placeid=" + item.id + "&id=" + media.id + "' alt='" + media.caption + "'  hidefocus='true' rel='gouped' class='gouped headImage orientation_" + media.orientation + "'>" +
                                            "<span class=' imgEnlarge'></span>" +
                                            "<img src='" + getRootUrl() + "media/download.castle?placeid=" + item.id + "&id=" + media.id + "&m=constrain&h=156' alt='" + media.caption + "' class='img-main' />" +
                                        "</a></li>";
                                        if (media.type.name == "general_image") hasImg = true;
                                        if (media.type.name == "general_video") hasVid = true;
                                    }
                                    c++;
                                }
                                String nav = "<div class='navArea'>" + (hasImg && hasVid ? "<a href='#' class='photos active' hidefocus='true'>Photos</a>" : "") +
                                    (c > 2 ? "<ul class='cNav'>" +
                                    //repeatStr("<li><a href='#' hidefocus='true'>{$i}</a></li>", item.Images.Count - 1) +
                                    "</ul>" : "") + (hasImg && hasVid ? "<a href='#' class='vids' hidefocus='true'>Video</a>" : "") + "</div>";
                                String gallery = "<div class='cycleArea'><div class='cycle'>" + (c > 2 ? "<a href='#' class='prev' hidefocus='true'>Prev</a>" : "") + "<div class='cWrap'><ul class='items'>" + galImg + "</ul></div>" + (c > 2 ? "<a href='#' class='next' hidefocus='true'>Next</a>" : "") + "</div>" + nav + "</div>";

                                imgGallery += @"
                                        {
                                            ""block"":""" + infoTitle + gallery + @""",
                                            ""title"":""" + (hasImg ? "Views" : "") + (hasImg && hasVid ? "/" : "") + (hasVid ? "Vids" : "") + @"""
                                        }";
                            }


                            String autoAccessibility = "";
                            if (item.autoAccessibility) {
                                string renderedTxt = autoProcessFeilds(item).Trim();
                                //autoProcessFeilds(item)
                                //processFields(defaultAccessibility, item)
                                if (!String.IsNullOrEmpty(renderedTxt)) {
                                    autoAccessibility += @"
                                        {
                                            ""block"":""" + infoTitle + "<ul>" + jsonEscape(renderedTxt) + @"</ul>" + @""",
                                            ""title"":""Accessibility""
                                        }";
                                }
                            }
                            String infotabs = "";
                            if (item.infotabs.Count > 0 || imgGallery != "" || autoAccessibility != "") {
                                infotabs += @"[";

                                String tabStr = "";

                                infotabs += @"
                                            {
                                                ""block"":""" + infoTitle + mainimage + details + @""",
                                                ""title"":""Overview""
                                            }";
                                if (item.infotabs.Count > 0) {
                                    int c = 0;
                                    foreach (infotabs tab in item.infotabs) {
                                        c++;
                                        if (tab.title == "Views") {
                                            if (!String.IsNullOrEmpty(imgGallery)) {
                                                tabStr += imgGallery;
                                                if (c < item.infotabs.Count) tabStr += ",";
                                            }
                                        } else {

                                            //string content = processFields(tab.content, item).Replace("\"", @"\""").Replace('\r', ' ').Replace('\n', ' ');
                                            string content = jsonEscape(autoFeildProcessing(item, tab.content));
                                            if (!String.IsNullOrWhiteSpace(content)) {
                                                tabStr += @"
                                                {
                                                    ""block"":""" + infoTitle + content.Replace("\"", @"\""") + @""",
                                                    ""title"":""" + tab.title + @"""
                                                }";
                                                if (c < item.infotabs.Count) tabStr += ",";
                                            }
                                        }

                                    }
                                }

                                infotabs += (!string.IsNullOrEmpty(tabStr) ? "," : "") + tabStr.TrimEnd(',');

                                infotabs += (!string.IsNullOrEmpty(autoAccessibility) ? "," : "") + autoAccessibility;

                                infotabs += @"]";
                            } else {
                                if (String.IsNullOrEmpty(item.details)) {
                                    infotabs += @"""" + infoTitle + @"""";
                                } else {
                                    string content = jsonEscape(autoFeildProcessing(item, details));
                                    infotabs += @"""" + infoTitle + mainimage + content + @"""";
                                }
                            }




                            placeList = @"
                                {
                                    ""id"":""" + item.id + @""",
                                    ""gamedayparkingpercentfull"":"""+item.percentfull+@""",
                                    ""position"":{
                                                ""latitude"":""" + item.getLat() + @""",
                                                ""longitude"":""" + item.getLong() + @"""
                                                },
                                    ""summary"":""" + ((!string.IsNullOrEmpty(item.summary)) ? StripHtml(jsonEscape(item.summary), false) : Truncate(StripHtml(jsonEscape(details), false), 65) + "...") + @""",
                                    ""title"":""" + ((!string.IsNullOrEmpty(item.infoTitle)) ? item.infoTitle.Trim() : item.prime_name.Trim()) + ((!string.IsNullOrEmpty(item.abbrev_name)) ? " (" + item.abbrev_name.Trim() + ")" : "") + @""",
                                    ""style"":{
                                            ""icon"":""" + (!String.IsNullOrWhiteSpace(item.pointImg) ? getRootUrl() + @"Content/images/map_icons/" + item.pointImg : "null") + @"""
                                            },
                                    ""info"":{
                                            ""content"":" + infotabs + @",
                                            ""title"":""" + item.prime_name + @"""
                                            },
                                    ""shapes"":" + loadPlaceShape(item) + @"
                                }";
                            placeList = jsonEscape(placeList);

                            // the goal with this is to make sure the maps don't break by simple testing that the data can be read
                            // if it can not be read then we place a friendly showing that the data is bad to keep the map working
                            bool dataGood = true;

                            try { jss.Deserialize<Dictionary<string, dynamic>>(placeList); }
                            catch (Exception e) {  
                                dataGood = false; 
                            }

                            if (dataGood) {
                                item.outputError = false;
                                ActiveRecordMediator<place>.Save(item);
                                ActiveRecordMediator<place>.Refresh(item);
                            } else {
                                item.outputError = true;
                                ActiveRecordMediator<place>.Save(item);
                                ActiveRecordMediator<place>.Refresh(item);
                                placeList = @"{""error"":""Error in the output.  This place needs to be edited.""}";
                            }
                            if (dataGood) { 
                                setJsonCache(cachePath, file, placeList);
                            }
                        }
                        jsonStr += System.IO.File.ReadAllText(cachePath + file) + ",";
                        count++;
                    }
                } else {
                    if (item != null) {
                        item.outputError = true;
                        ActiveRecordMediator<place>.Save(item);
                    }

                }

            }
            String json = "";
            json += @"  {
";
            if (count > 0) {
                json += @"""markers"":[";
                json += jsonStr.TrimEnd(',');
                json += @"]";
            }

            json += @"
    }";
            return json;
        }

        //for the gameday parking and anything else that can take use

        /*
         Allow one API post request from the front to update A value on a meta(aka field) property
         -Must be signed in at the least and have the session, but OAuth support later
         -Only allows updating on ONE value, which is filtered
         */
        public Boolean post_place_value_update(int place_id, String field_name, String value) {
            //check that the place is there
            place item = ActiveRecordBase<place>.Find(place_id);
            //get the place fields
            //check that the field requested is there
            //if there set value
            //if value set save field and place accordenly
            //return true if nothing wronge, else
            return false;
        }





        public String create_place_json(place[] items) {
            /* the responsable thing to do here is to remove the html into a template */
            /* secound make the feed a template too so there should be 3 templates */
            string appPath = getRootPath();
            String cachePath = appPath + "cache/places/";
            String placeList = "";
            String jsonStr = "";
            int count = 0;
            foreach (place item in items) {
                if ((item != null && item.status != null && item.status.id == 3 && item.isPublic) || !String.IsNullOrWhiteSpace(HttpContext.Current.Request.Params["all"])) {
                    if (item.coordinate != null) {
                        String view = HttpContext.Current.Request.Params["view"];
                        String style = HttpContext.Current.Request.Params["style"];
                        string file = item.id + (!String.IsNullOrWhiteSpace(view) ? "_" + view + "_" : "") + (!String.IsNullOrWhiteSpace(style) ? "_" + style + "_" : "") + "_render" + ".ext";
                        if (!File.Exists(cachePath + file) || !String.IsNullOrWhiteSpace(HttpContext.Current.Request.Params["dyno"])) {
                            //dynamic value;
                            var jss = new JavaScriptSerializer();
                            string details = ((!string.IsNullOrEmpty(item.details)) ? processFields(item.details, item).Replace("\"", @"\""").Replace('\r', ' ').Replace('\n', ' ') : "");

                            String mainimage = "";
                            if (item.Images.Count > 0) {
                                //NOTE THIS IS AN EXAMPLE OF A DEFAULT SIZE; SIZE IS CHOSEN ON THE CLEINT SIDE
                                int width = 148;
                                int height = 100;
                                if (item.Images[0].orientation == "v") {
                                    width = 100;
                                    height = 148;
                                }
                                String size = "w=" + width + "&h=" + height + "";
                                mainimage = @"""prime_image"":{
                                        ""src"":""" + getRootUrl() + "media/download.castle?placeid=" + (item.id)  + "&id=" + (item.Images[0].id) + @""",
                                        ""thumb_params"":""&m=crop&" + (size) + @""",
                                        ""caption"":"""+ (String.IsNullOrEmpty(item.Images[0].caption) ? "" : item.Images[0].caption) + @""",
                                        ""orientation"":""" + (item.Images[0].orientation) + @"""
                                    },";
                            }

                            String labeling = "";
                            if (item.hideTitles != true) {
                                labeling = @"""labels"":{
                                    ""title"":""" + (!string.IsNullOrEmpty(item.infoTitle) ? item.infoTitle.Trim() : item.prime_name.Trim()) + @""",
                                    ""prime_abbrev"":""" + (!string.IsNullOrEmpty(item.abbrev_name) ? item.abbrev_name.Trim() : "") + @""",
                                    ""other_names"":""""
                                },";
                            }



                            String imgGallery = "";
                            String media_obj = "";
                            if (item.Images.Count > 1) {
                                String galImg = "";
                                int c = 0;
                                bool hasImg = false;
                                bool hasVid = false;
                                media_obj += @"""media"":[";
                                foreach (media_repo media in item.Images) {
                                    if (c > 0) {
                                        /* note the width and height should be abstracted out into a map preference*/
                                        galImg += "<a href='" + getRootUrl() + "media/download.castle?placeid=" + item.id + "&id=" + media.id + "' alt='" + media.caption + "'  hidefocus='true' class='headImage orientation_" + media.orientation + "'>" +
                                            //"<span class=' imgEnlarge'></span>" +
                                            "<img src='" + getRootUrl() + "media/download.castle?placeid=" + item.id + "&id=" + media.id + "&m=constrain&h=156' alt='" + media.caption + "' class='img-main' />" +
                                        "</a>";
                                        if (media.type.name == "general_image") hasImg = true;
                                        if (media.type.name == "general_video") hasVid = true;
                                    }
                                    c++;


                                    media_obj += @"
                                        {
                                            ""id"":""" + media.id + @""",
                                            ""caption"":""" + (media.caption) + @""",
                                            ""orientation"":""" + (media.orientation) + @""",
                                            ""type"":""" + (media.type.name) + @"""
                                        },";
                                }
                                media_obj = media_obj.TrimEnd(',') + @"],";
                                String nav = "<div class='navArea'>" + (hasImg && hasVid ? "<a href='#' class='photos active' hidefocus='true'>Photos</a>" : "") +
                                    (c > 2 ? "<ul class='cNav'>" +
                                    //repeatStr("<li><a href='#' hidefocus='true'>{$i}</a></li>", item.Images.Count - 1) +
                                    "</ul>" : "") + (hasImg && hasVid ? "<a href='#' class='vids' hidefocus='true'>Video</a>" : "") + "</div>";
                                String gallery = "<div class='cycleArea'><div class='cycle'>" + (c > 2 ? "<a href='#' class='prev' hidefocus='true'>Prev</a>" : "") + "<div class='cWrap'><div class='items'>" + galImg + "</div></div>" + (c > 2 ? "<a href='#' class='next' hidefocus='true'>Next</a>" : "") + "</div>" + nav + "</div>";

                                imgGallery += @"
                                        {
                                            ""block"":""" + gallery + @""",
                                            ""title"":""" + (hasImg ? "Views" : "") + (hasImg && hasVid ? "/" : "") + (hasVid ? "Vids" : "") + @"""
                                        }";
                            }


                            String autoAccessibility = "";
                            if (item.autoAccessibility) {
                                string renderedTxt = autoProcessFeilds(item).Trim();
                                //autoProcessFeilds(item)
                                //processFields(defaultAccessibility, item)
                                if (!String.IsNullOrEmpty(renderedTxt)) {
                                    autoAccessibility += @"
                                        {
                                            ""block"":""" + "<ul>" + jsonEscape(renderedTxt) + @"</ul>" + @""",
                                            ""title"":""Accessibility""
                                        }";
                                }
                            }
                            String infotabs = "";
                            if (item.infotabs.Count > 0 || imgGallery != "" || autoAccessibility != "") {
                                infotabs += @"[";

                                String tabStr = "";

                                infotabs += @"
                                            {
                                                ""block"":""" + details + @""",
                                                ""title"":""Overview""
                                            }";
                                if (item.infotabs.Count > 0) {
                                    int c = 0;
                                    foreach (infotabs tab in item.infotabs) {
                                        c++;
                                        if (tab.title == "Views") {
                                            if (!String.IsNullOrEmpty(imgGallery)) {
                                                tabStr += imgGallery;
                                                if (c < item.infotabs.Count) tabStr += ",";
                                            }
                                        } else {

                                            //string content = processFields(tab.content, item).Replace("\"", @"\""").Replace('\r', ' ').Replace('\n', ' ');
                                            string content = jsonEscape(autoFeildProcessing(item, tab.content));
                                            if (!String.IsNullOrWhiteSpace(content)) {
                                                tabStr += @"
                                                {
                                                    ""block"":""" + content.Replace("\"", @"\""") + @""",
                                                    ""title"":""" + tab.title + @"""
                                                }";
                                                if (c < item.infotabs.Count) tabStr += ",";
                                            }
                                        }

                                    }
                                }

                                infotabs += (!string.IsNullOrEmpty(tabStr) ? "," : "") + tabStr.TrimEnd(',');
                                infotabs += (!string.IsNullOrEmpty(autoAccessibility) ? "," : "") + autoAccessibility;
                                infotabs += @"]";
                            } else {
                                if (String.IsNullOrEmpty(item.details)) {
                                    infotabs += @"""""";
                                } else {
                                    string content = jsonEscape(autoFeildProcessing(item, details));
                                    infotabs += @"""" + content + @"""";
                                }
                            }

                            String style_obj = @"""style"":{
                                            ""icon"":""" + (!String.IsNullOrWhiteSpace(item.pointImg) ? getRootUrl() + @"Content/images/map_icons/" + item.pointImg : "null") + @"""
                                            },";


                            placeList = @"
                                {
                                    ""id"":""" + item.id + @""",
                                    ""position"":{
                                                ""latitude"":""" + item.getLat() + @""",
                                                ""longitude"":""" + item.getLong() + @"""
                                                },
                                    ""summary"":""" + ((!string.IsNullOrEmpty(item.summary)) ? StripHtml(jsonEscape(item.summary), false) : Truncate(StripHtml(jsonEscape(details), false), 65) + "...") + @""",
                                    " + mainimage + @"
                                    " + labeling + @"
                                    " + media_obj + @"
                                    " + style_obj + @"
                                    ""content"":" + infotabs + @",
                                    ""metadata"":[
                                                {
                                                    ""name"":""gamedayparkingpercentfull"",
                                                    ""value"":""" + item.percentfull + @"""
                                                }
                                            ],
                                    ""shapes"":" + loadPlaceShape(item) + @"
                                }";
                            placeList = jsonEscape(placeList);

                            // the goal with this is to make sure the maps don't break by simple testing that the data can be read
                            // if it can not be read then we place a friendly showing that the data is bad to keep the map working
                            bool dataGood = true;

                            try { jss.Deserialize<Dictionary<string, dynamic>>(placeList); } catch (Exception e) {
                                dataGood = false;
                            }

                            if (dataGood) {
                                item.outputError = false;
                                ActiveRecordMediator<place>.Save(item);
                                ActiveRecordMediator<place>.Refresh(item);
                            } else {
                                item.outputError = true;
                                ActiveRecordMediator<place>.Save(item);
                                ActiveRecordMediator<place>.Refresh(item);
                                placeList = @"{""error"":""Error in the output.  This place needs to be edited.""}";
                            }
                            if (dataGood) {
                                setJsonCache(cachePath, file, placeList);
                            }
                        }
                        jsonStr += System.IO.File.ReadAllText(cachePath + file) + ",";
                        count++;
                    }
                } else {
                    if (item != null) {
                        item.outputError = true;
                        ActiveRecordMediator<place>.Save(item);
                    }

                }

            }
            String json = "";
            json += @"  {
";
            if (count > 0) {
                json += @"""markers"":[";
                json += jsonStr.TrimEnd(',');
                json += @"]";
            }

            json += @"
    }";
            return json;
        }


        private void getPlaces() {
            place[] places = placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
        }



        #region Comments and helpers
        /*
        [Layout("secondary-tabs")]

        public void userFlag(string flagged, [ARDataBind("place_comments", AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)] comments comment)
        {
            if ( String.IsNullOrEmpty(flagged) )
            {
                RedirectToReferrer();
                return;
            }
            if (flagged == "yes")
            {
                comment.Flagged = true;
                comment.adminRead = false;
                comment.FlagNumber = comment.FlagNumber + 1;
                ActiveRecordMediator<comments>.Save(comment);
                RedirectToReferrer();
                return;
            }
        }

            public void submitComment([ARDataBind("place_comments", AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)] comments comment,
                string Asirra_Ticket,
                string uid,
                string accessToken
                )
        {
            // Check if they filled out spam blocker
            if (String.IsNullOrEmpty(Asirra_Ticket) && String.IsNullOrEmpty(uid) && String.IsNullOrEmpty(accessToken)){
                Flash["message"] = "You may not try to by pass the spam protection.  Please fill out the form and choose the species and directed.";
                RedirectToReferrer();
                return;
            }

            // Check the kitties
            if (!helperService.passedCaptcha(Asirra_Ticket) && String.IsNullOrEmpty(uid) && String.IsNullOrEmpty(accessToken)){
                Flash["message"] = "Please try again.";
                RedirectToReferrer();
                return;
            }else if (!String.IsNullOrEmpty(uid) && !String.IsNullOrEmpty(accessToken)){
                if (!helperService.passedHasFb(uid, accessToken))
                {
                    Flash["message"] = "Please try again.";
                    RedirectToReferrer();
                    return;
                }

            }else{
                Flash["message"] = "Please try again.";
                RedirectToReferrer();
                return;
            }

            //check if valid email
            if (String.IsNullOrEmpty(comment.Email) || !helperService.isEmail(comment.Email))
            {
                Flash["message"] = "You must provide a vaild email.<br/><strong>Note:</strong>This is not published or shared with third parties.";
                RedirectToReferrer();
                return;
            }

            //check if blank
            if (String.IsNullOrEmpty(comment.comment))
            {
                Flash["message"] = "You must post something to post something.";
                RedirectToReferrer();
                return;
            }

            //Setup the decode version to check
            comment.comment = helperService.decodeString(comment.comment);

            //Check if just spaces
            if (comment.comment != null && String.IsNullOrEmpty(comment.comment.Trim()))
            {
                Flash["message"] = "You must post something to post something.";
                RedirectToReferrer();
                return;
            }

            // Strip html elements
            comment.comment = helperService.stripHTMLElements(comment.comment);
            //ReSetup the decode version to check
            comment.comment = helperService.decodeString(comment.comment);
            
            // Check for links
            if (helperService.hasLink(comment.comment))
            {
                comment.Flagged = true;
                comment.published = false;
                Flash["message"] = "Please try again. you may not add links.";
                RedirectToReferrer();
                return;
            }

            //Start chack for cursing
            //String spamresults = helperService.getCommentSpamResultMessage(comment);

            String spamresults = helperService.setCensorMessage(comment);



            if (!String.IsNullOrEmpty(spamresults))
            {
                Flash["message"] = spamresults;
                comment.Flagged = true;
                comment.published = false;
            }
            else
            {
                //Everything is ok so set up the db entry
                comment.published = true;
                comment.adminRead = false;
            }
            comment.CreateTime = DateTime.Now;
            comment.UpdateTime = DateTime.Now;
            ActiveRecordMediator<comments>.Save(comment);
            if (((String)Flash["message"]) == "")
            {
                Flash["message"] = "Your comment has been added.  It will show up when it's been approved.";
            }
            RedirectToReferrer();
        }
 * */
        #endregion




        [Layout("threecols")]

        #region sitemap xml
        public void seoSitemap() {
            Response.ContentType = "text/xml";
            getPlaces();
            CancelLayout();
        }
        #endregion


        #region RSS feeds (note some need to be set up for each type)
        [Layout("secondary")]
        public void rssfeeds() {
            place[] places = placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["Ads"] = placeService.getAdvertisements(places);
            PropertyBag["places"] = places;
            RenderView("rssfeeds");
        }


        public void rss() {
            Response.ContentType = "text/xml";
            getPlaces();
            CancelLayout();
        }
        public void news() {
            place[] places = placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            Context.Response.ContentType = "text/xml";
            CancelLayout();

        }
        public void sports() {
            Response.ContentType = "text/xml";
            getPlaces();
            CancelLayout();
        }
        public void life() {
            Response.ContentType = "text/xml";
            getPlaces();
            CancelLayout();
        }
        public void opinion() {
            Response.ContentType = "text/xml";
            getPlaces();
            CancelLayout();
        }
        #endregion

        [Layout("test")]
        public void test() {
        }

        #region Advertisement  NOTE: needs work
        public void IncClicked(int id) {
            advertisement adv = ActiveRecordBase<advertisement>.Find(id);
            adv.Clicked = adv.Clicked + 1;
            ActiveRecordMediator<advertisement>.Save(adv);
            RedirectToUrl(adv.Url);
        }
        public void IncView(advertisement adv) {
            adv.Views = adv.Views + 1;
            ActiveRecordMediator<advertisement>.Save(adv);
        }
        #endregion

    }
}