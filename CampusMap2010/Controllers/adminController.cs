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
    using System.Linq;
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
    using System.Dynamic;
    using System.Web.Script.Serialization;
    using System.Runtime.Serialization; 

#endregion
namespace campusMap.Controllers{
    [Layout("default")]
    public class adminController : SecureBaseController {
        #region JSON OUTPUT
           /* public void get_pace_type()
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
            public void get_place_tags(string type)
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
        public void render() {
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


        #endregion

        #region VIEWS
            public void admin()
            {
                users user = UserService.getUserFull();
                IList<place> places = user.getUserPlaces(1, 5);
                PropertyBag["places"] = places;


                IList<place> temp = new List<place>();

                place[] erroredPlaces = ActiveRecordBase<place>.FindAllByProperty("outputError", true);
                PropertyBag["erroredPlaces"] = erroredPlaces;



                PropertyBag["user"] = user;
                IList<users> activeUser = new List<users>();
                users[] _authors = ActiveRecordBase<users>.FindAllByProperty("logedin", true);
                foreach (users _author in _authors)
                {
                    if (_author != null && _author.LastActive > DateTime.Today.AddHours(-1))
                    {
                        activeUser.Add(_author);
                    }
                }
                PropertyBag["activeUsers"] = activeUser;
                RenderView("../admin/splash");
            }
            public void _list_siteSettings()
            {
                var values = new Dictionary<string, object>();
                values.Add("Title", "Hello World!");
                values.Add("Text", "My first post");
                values.Add("Tags", new[] { "hello", "world" });

                var post = new DynamicEntity(values);

                dynamic dynPost = post;
                //var text = dynPost.Text;


                PropertyBag["text"] = dynPost.Text;







                RenderView("../admin/settings/settings");
            }

        /*
            public static string get_userSettingStr(authors user)
            {
                List<AbstractCriterion> typeEx = new List<AbstractCriterion>();
                typeEx.Add(Expression.Eq("type", field_type));
                if (!object.ReferenceEquals(_place, null)) typeEx.Add(Expression.Eq("owner", _place.id));
                fields field = ActiveRecordBase<fields>.FindFirst(typeEx.ToArray());
                string ele_str = FieldsService.getfieldmodel_dynamic(field_type.attr.ToString(), field == null ? null : field.value.ToString());
                return ele_str;
            }
        */
            public static dynamic get_user_setting(string settingName)
            {
                dynamic value = false;
                value = get_user_setting(UserService.getUserFull(), settingName);
                return value;
            }

            public static dynamic get_user_setting(users user, string settingName)
            {
                dynamic value = false;
                var values = new Dictionary<string, object>();
                if (!String.IsNullOrWhiteSpace(user.settings.attr) && user.settings.attr != "{}")
                {
                    var jss = new JavaScriptSerializer();
                    var settings = jss.Deserialize<Dictionary<string, dynamic>>(user.settings.attr);
                    settings.ToList<KeyValuePair<string, dynamic>>();
                    foreach (KeyValuePair<string, dynamic> setting in settings)
                    {
                        if (settingName == setting.Key)
                        {
                            value = setting.Value;
                        }
                    }
                }
                return value;
            }
            public void _edit_settings(int id)
            {
                users user = ActiveRecordBase<users>.Find(id);
                /* give access by group or ownership */
                if (user.id == UserService.getUserFull().id || UserService.getUserFull().groups.id == 2)
                {
                    var values = new Dictionary<string, object>();
                    if (!String.IsNullOrWhiteSpace(user.settings.attr) && user.settings.attr!="{}")
                    {
                        var jss = new JavaScriptSerializer();
                        var settings = jss.Deserialize<Dictionary<string, dynamic>>(user.settings.attr);
                        settings.ToList<KeyValuePair<string, dynamic>>();
                        foreach (KeyValuePair<string, dynamic> setting in settings)
                        {
                            values.Add(setting.Key, setting.Value);
                        }
                    }
                    PropertyBag["settings"] = values;
                    PropertyBag["user"] = user;
                    RenderView("../admin/settings/_edit");
                }
                else
                {
                    Flash["message"] = "You don't have access to this user's settings";
                    RedirectToAction("_list_siteSettings");
                }
            }
            public void _save_siteSettings(
                [ARDataBind("user", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] users user
                )
            {

                Dictionary<string, string> urlparams = getPostParmasAsObj_obj("settings");
                var jss = new JavaScriptSerializer();
                //jss.RegisterConverters(new JavaScriptConverter[] { new DynamicJsonConverter() });

                //var values = new Dictionary<string, object>();
                MyJsonDictionary<String, Object> values = new MyJsonDictionary<String, Object>(); 

                foreach (KeyValuePair<string, string> _urlparams in urlparams)
                {
                    values.Add(_urlparams.Key, _urlparams.Value);
                }
                /*
                    values.Add("Title", "Hello World!");
                    values.Add("Text", "My first post");
                    values.Add("Tags", new[] { "hello", "world" });
                */
                //var usettings = new DynamicEntity(values);

                user.settings.attr = Serialize(values);//jss.Serialize(usettings);
                ActiveRecordMediator<users>.Save(user);
                Flash["message"] = "Your setting were saved";
                RedirectToAction("_list_siteSettings");
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
        public void checkAlias(String alias,String typeName ){

            CancelView();
            CancelLayout();
            object[] temp = HelperService.alias_exsits(alias, typeName);
            if(temp.Length>0){
                RenderText("true");
            }else{
                RenderText("false");
            }
        }

        #endregion

    }
}