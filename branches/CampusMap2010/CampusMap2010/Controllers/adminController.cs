#region Directives
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using Castle.ActiveRecord;
    using Castle.ActiveRecord.Queries;
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
    using Newtonsoft.Json;
    using Newtonsoft.Json.Utilities;
    using Newtonsoft.Json.Linq;
    using SquishIt.Framework;
#endregion
namespace campusMap.Controllers
{
    [Layout("default")]
    public class adminController : SecureBaseController
    {
        #region JSON OUTPUT
            public void get_pace_type()
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
            }
            /*public void get_place_tags(string type)
            {
                CancelView();
                CancelLayout();
                t[] all_tag = ActiveRecordBase<t>.FindAll();

                List<JsonAutoComplete> tag_list = new List<JsonAutoComplete>();
                foreach (t tag in all_tag)
                {
                    JsonAutoComplete obj = new JsonAutoComplete();
                    obj.id = tag.id;
                    obj.label = tag.name;
                    obj.value = tag.name;
                    tag_list.Add(obj);
                }
                string json = JsonConvert.SerializeObject(tag_list);
                RenderText(json);
            }*/
        #endregion

        #region URL rendering
            public void render()
        {
            String everUrl = Context.Request.RawUrl;
            // URL comes in like http://sitename/edit/dispatch/handle404.castle?404;http://sitename/pagetorender.html
            // So strip it all out except http://sitename/pagetorender.html
            everUrl = Regex.Replace(everUrl, "(.*:80)(.*)", "$2");
            everUrl = Regex.Replace(everUrl, "(.*:443)(.*)", "$2");
            String urlwithnoparams = Regex.Replace(everUrl, @"(.*?)(\?.*)", "$1");
            String querystring = Regex.Replace(everUrl, @"(.*?)(\?.*)", "$2");
            /* CancelView();
            if (everUrl == "/default.aspx")
            {
                //Redirect(HttpContext.Request.ApplicationPath + "/Admin/editByUrl.castle?editurl=" + Context.Server.UrlEncode(everUrl));
                Index();
                RenderView("index");
                return;
            }
            if (urlwithnoparams.EndsWith("index.castle"))
            {
                LayoutName = "secondary-tabs";
                string url = Regex.Replace(urlwithnoparams, @"/read/(.*)", "$1");
                readmore(placeService.placeByURL_id(url));
                RenderView("readmore");
                return;
            }
            if (urlwithnoparams.EndsWith("sitemap.xml"))
            {
                seoSitemap();
                RenderView("seoSitemap");
                return;
            }
            if (urlwithnoparams.EndsWith("/home"))
            {
                Index();
                RenderView("index");
                return;
            }
            if (urlwithnoparams.EndsWith("readmore.castle"))
            {
                LayoutName = "secondary-tabs";
                string id = Regex.Replace(querystring, @"\?id=(.*)", "$1");
                readmore(Convert.ToInt32(id));
                RenderView("readmore");
                return;
            }
            if (urlwithnoparams.ToString().IndexOf("read/") == 1)
            {
                LayoutName="secondary-tabs";
                string url = Regex.Replace(urlwithnoparams, @"/read/(.*)", "$1");
                readmore(placeService.placeByURL_id(url));
                RenderView("readmore");
                return;
            }*/
        }
        #endregion

        #region VIEWS
            public void admin()
            {
                authors user = UserService.getUser();
                IList<place> places = user.getUserPlaces(1, 5);
                PropertyBag["places"] = places;


                IList<place> temp = new List<place>();

                place[] erroredPlaces = ActiveRecordBase<place>.FindAllByProperty("outputError", true);
                PropertyBag["erroredPlaces"] = erroredPlaces;



                PropertyBag["user"] = user;
                IList<authors> activeUser = new List<authors>();
                authors[] _authors = ActiveRecordBase<authors>.FindAllByProperty("logedin", true);
                foreach (authors _author in _authors)
                {
                    if (_author != null && _author.LastActive > DateTime.Today.AddHours(-1))
                    {
                        activeUser.Add(_author);
                    }
                }
                PropertyBag["activeUsers"] = activeUser;
                RenderView("../admin/splash");
            }
            public void help()
            {
                RenderView("../admin/help");
            }
        #endregion

        #region METHODS
            public void getInfoTemplates(string callback)
            {
                CancelView();
                CancelLayout();
                IList<infotabs_templates> tempList = ActiveRecordBase<infotabs_templates>.FindAll();
                String jsonStr = "";
                foreach (infotabs_templates temp in tempList)
                {
                    jsonStr += @"{";
                    jsonStr += @"""alias"":""" + temp.alias + @""",";
                    jsonStr += @"""id"":""" + temp.id + @""",";
                    jsonStr += @"""name"":""" + temp.name + @""",";
                    jsonStr += @"""process"":""" + temp.process + @"""";
                    jsonStr += @"},";
                }

                String json = "[" + jsonStr.TrimEnd(',') + "]";

                if (!string.IsNullOrEmpty(callback))
                {
                    json = callback + "(" + json + ")";
                }
                Response.ContentType = "application/json; charset=UTF-8";
                RenderText(json);
            }
        #endregion

    }
}