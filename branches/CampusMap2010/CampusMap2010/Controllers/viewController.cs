namespace campusMap.Controllers
{
    #region Directives
        using System.Collections.Generic;
        using System.Collections.Specialized;
        using Castle.ActiveRecord;
        using Castle.MonoRail.Framework;
        using Castle.MonoRail.ActiveRecordSupport;
        using Castle.MonoRail.Framework.Helpers;
        using MonoRailHelper;
        using NHibernate.Criterion;
        using System.IO;
        using System.Web;
        using System;
        using campusMap.Models;
        using System.Net.Mail;
        using Castle.Components.Common.EmailSender;   
        using Castle.Components.Common.EmailSender.Smtp;
        using Castle.ActiveRecord.Queries;
        using System.Text.RegularExpressions;
        using System.Collections;
        using campusMap.Services;
    using Microsoft.SqlServer.Types;
    using System.Data.SqlTypes;
    using System.Xml;
    using System.Text;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Utilities;
    using Newtonsoft.Json.Linq;


    using System.Collections.ObjectModel;
    using System.Dynamic;
    using System.Linq;
    using System.Web.Script.Serialization;


    #endregion

    [Layout("default")]
    public class viewController : SecureBaseController
    {

        public void editor(int id, int page)
        {
            if (id == 0){
                New();
            }else{
                _edit(id, page);
            }
            CancelView();
            CancelLayout();
            RenderView("_editor");
            return;
        }


        public void Index()
        {
            //ActiveRecordBase<Block>.FindAll();
            PropertyBag["AccessDate"] = DateTime.Now;           
        }

        public void breakingNewsreadmore(int id)
        {
            map_views view = ActiveRecordBase<map_views>.Find(id);
            PropertyBag["BreakingNews"] = view;
        }
        public void clearConnections()
        {
            map_views[] _views = ActiveRecordBase<map_views>.FindAll();
            foreach (map_views view in _views)
            {
                authors author = view.checked_out_by;
                if (author != null && (!author.active || author.LastActive < DateTime.Today.AddHours(-3)))
                {
                    view.checked_out_by = null;
                    ActiveRecordMediator<map_views>.Save(view);
                }
            }
        }
        public void List(int page, int searchId, string status)
        {
            clearConnections();
            authors user = UserService.getUser();
            PropertyBag["authorname"] = user.name;
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();
            PropertyBag["listtypes"] = ActiveRecordBase<place_types>.FindAll();
            PropertyBag["listcats"] = ActiveRecordBase<categories>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["statuses"] = ActiveRecordBase<status>.FindAll();
            PropertyBag["user"] = user;
            PropertyBag["logedin"] = UserService.getLogedIn();

            int fieldsPaging = 1;
            int draftPaging = 1;
            int reviewPaging = 1;
            int publishedPaging = 1;


                IList<map_views> items;
                int pagesize = 15;
                int paging = 1;
                List<AbstractCriterion> baseEx = new List<AbstractCriterion>();

                if (searchId.Equals(-2))
                {
                    IList<map_views> userviews = user.views;
                    object[] obj = new object[userviews.Count];
                    int i = 0;
                    foreach(map_views view in userviews){
                        obj[i] = view.id;
                        i++;
                    }
                    baseEx.Add(Expression.In("view_id", obj));
                }

            //PUBLISHED
                if (status == "published"){
                    paging = page;
                }else{
                    paging = 1;
                }
                List<AbstractCriterion> pubEx = new List<AbstractCriterion>();
                pubEx.AddRange(baseEx);
                pubEx.Add(Expression.Eq("status", ActiveRecordBase<status>.Find(3)));

                if (searchId > 0)
                {
                    items = ActiveRecordBase<map_views>.FindAll(Order.Desc("order"), pubEx.ToArray());
                }
                else
                {
                    items = ActiveRecordBase<map_views>.FindAll(Order.Desc("published"), pubEx.ToArray());
                }
                PropertyBag["published_list"] = PaginationHelper.CreatePagination(items, pagesize, paging);
                IList<string> buttons = new List<string>();
                buttons.Add("edit");
                buttons.Add("delete");
                buttons.Add("publish");
                //buttons.Add("broadcast");
                //buttons.Add("view"); //NOTE:coming so TODO
                //buttons.Add("order");
                PropertyBag["publishedButtonSet"] = buttons;

            //REVIEW
                if (status == "review"){
                    paging = page;
                }else{
                    paging = 1;
                }
                List<AbstractCriterion> revEx = new List<AbstractCriterion>();
                revEx.AddRange(baseEx);
                revEx.Add(Expression.Eq("status", ActiveRecordBase<status>.Find(2)));

                items = ActiveRecordBase<map_views>.FindAll(Order.Desc("created"), revEx.ToArray());
                PropertyBag["review_list"] = PaginationHelper.CreatePagination(items, pagesize, paging);
                buttons = new List<string>();
                buttons.Add("edit");
                buttons.Add("delete");
                buttons.Add("publish");
                //buttons.Add("view");
                PropertyBag["reviewButtonSet"] = buttons;

            //DRAFT
                if (status == "draft"){
                    paging = page;
                }else{
                    paging = 1;
                }
                List<AbstractCriterion> draftEx = new List<AbstractCriterion>();
                draftEx.AddRange(baseEx);
                draftEx.Add(Expression.Eq("status", ActiveRecordBase<status>.Find(1)));
                items = ActiveRecordBase<map_views>.FindAll(Order.Desc("created"), draftEx.ToArray());
                PropertyBag["draft_list"] = PaginationHelper.CreatePagination(items, pagesize, paging);
                buttons = new List<string>();
                buttons.Add("edit");
                buttons.Add("delete");
                buttons.Add("publish");
                //buttons.Add("view");
                PropertyBag["draftButtonSet"] = buttons;


             RenderView("../admin/listings/list");
        }
        public bool canEdit(map_views views, authors user)
        {
            bool flag = false;
            switch (user.access_levels.name)
            {
                case "Admin":
                    {
                       // foreach (place_types item in place.place_types)
                      //  {
                            //if (views.authors.Contains(user))
                                flag = true; break;
                       // }
                      
                    }

                case "Editor":
                    {
                        //foreach (place_types item in place.place_types)
                       // {
                            //if (user.place_types.Contains(item))
                                flag = true; break;
                        //}
                     
                    }
            }

            return flag;
        }
        /*public bool canPublish(authors user)
        {
            bool flag = false;
            switch (user.access_levels.title)
            {
                case "Admin": flag = true; break;
                case "Editor": flag = true; break;
            }
            return flag;
        }*/



        public void setStatus(int id, int status, bool ajax)
        {
            map_views view = ActiveRecordBase<map_views>.Find(id);
            PropertyBag["view"] = view;
            status published = ActiveRecordBase<status>.Find(status);
            //view.Status = published;
            ActiveRecordMediator<map_views>.Save(view);

            //if(!ajax)
            //RedirectToReferrer();
            string myTime = DateTime.Now.ToString("yyyy.MM.dd HH:mm:ss:ffff");
            NameValueCollection myCol = new NameValueCollection();
            myCol.Add("time", myTime);

            Redirect("view", "list", myCol);
            //}
        }

        public map_views[] getDrafts()
        {
           map_views draft = ActiveRecordBase<map_views>.Find(1);
           ICriterion expression = Expression.Eq("Status", draft);
           map_views[] views = ActiveRecordBase<map_views>.FindAll(expression);
           return views;        
        }
        public map_views[] getReview()
        {
            map_views review = ActiveRecordBase<map_views>.Find(2);
            ICriterion expression = Expression.Eq("Status", review);
            map_views[] views = ActiveRecordBase<map_views>.FindAll(expression);
            return views;
        }
        public map_views[] getPublished()
        {
            map_views published = ActiveRecordBase<map_views>.Find(3);
            ICriterion expression = Expression.Eq("Status", published);
            map_views[] views = ActiveRecordBase<map_views>.FindAll(expression);
            return views;        
        } 
     

        public String GetCredits()
        {
            String sql = "SELECT DISTINCT s.credit FROM media_repo AS s WHERE NOT s.credit = 'NULL'";
            SimpleQuery<String> q = new SimpleQuery<String>(typeof(map_views), sql);
            Array credits = q.Execute();
            String creditsList = "";
            foreach (String s in credits)
            {
                creditsList += '"' + s.ToString() + '"' + ',';
            }
            return creditsList.TrimEnd(',');
        }
        public void _edit(int id, int page)
        {
            campusMap.Services.LogService.writelog("Editing view " + id);
            PropertyBag["credits"] = "";
            PropertyBag["imagetypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["images_inline"] = ActiveRecordBase<media_repo>.FindAll();

            map_views view = ActiveRecordBase<map_views>.Find(id);
            
            authors user = UserService.getUser();
            String username = user.Nid;
            PropertyBag["loginUser"] = user;

            PropertyBag["authorname"] = user.name;
            view.checked_out_by = user;
            ActiveRecordMediator<map_views>.Save(view);
            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"

            PropertyBag["loginUser"] = UserService.getUser();


            PropertyBag["tags"] = ActiveRecordBase<tags>.FindAll();
            if(Flash["view"] !=null)
            {
                map_views flashview = Flash["view"] as map_views;
                flashview.Refresh();
                PropertyBag["view"] = flashview;
            }
            else
            {
                PropertyBag["view"] = view;
            }
            if (view.center != null)
            {
                PropertyBag["lat"] = view.getLat();
                PropertyBag["long"] = view.getLong();
            } PropertyBag["view"] = view;

            var values = new Dictionary<string, object>();
            if (!String.IsNullOrWhiteSpace(view.options_obj) && view.options_obj != "{}")
            {
                var jss = new JavaScriptSerializer();
                var options = jss.Deserialize<Dictionary<string, dynamic>>(view.options_obj);
                options.ToList<KeyValuePair<string, dynamic>>();
                foreach (KeyValuePair<string, dynamic> option in options)
                {
                    values.Add(option.Key, option.Value);
                }
            }
            PropertyBag["options"] = values;
            PropertyBag["options_json"] = Regex.Replace(Regex.Replace(view.options_obj.Replace(@"""false""", "false").Replace(@"""true""", "true"), @"(""\w+"":\""\"",?)", "", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.CultureInvariant).Replace(",}", "}"), @"""(\d+)""", "$1", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.CultureInvariant).Replace(",}", "}");
            PropertyBag["baseJson"] = Regex.Replace(view.options_obj, @".*?(\""mapTypeId\"":""(\w+)"".*$)", "$2", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.CultureInvariant);

            //ImageType imgtype = ActiveRecordBase<ImageType>.Find(1);
            //PropertyBag["images"] = imgtype.Images; //Flash["images"] != null ? Flash["images"] : 
            //PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll();
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();//Flash["authors"] != null ? Flash["authors"] : ActiveRecordBase<author>.FindAll();

            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["statuslists"] = ActiveRecordBase<status>.FindAll();
            PropertyBag["places"] = ActiveRecordBase<place>.FindAll();


            if (page == 0)
                page = 1;
            int pagesize = 10;
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("View", view));

            /*IList<comments> items;

            items = ActiveRecordBase<comments>.FindAll(Order.Desc("CreateTime"), baseEx.ToArray());
            PropertyBag["comments"] = PaginationHelper.CreatePagination(items, pagesize, page);*/

            String CreditList = GetCredits();
            PropertyBag["credits"] = CreditList; 

            List<authors> authors = new List<authors>();
            if (!view.authors.Contains(user)) authors.Add(user);
            authors.AddRange(view.authors);

            PropertyBag["viewauthors"] = authors;
            RenderView("_editor");
       
        }
        public void New()
        {


            map_views view = new map_views();

            PropertyBag["loginUser"] = UserService.getUser();
            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"

            

            PropertyBag["view"] = Flash["view"] != null ? Flash["view"] : view;
            PropertyBag["tags"] = Flash["tags"] != null ? Flash["tags"] : ActiveRecordBase<tags>.FindAll();
            PropertyBag["authors"] = Flash["authors"] != null ? Flash["authors"] : ActiveRecordBase<authors>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["statuslists"] = ActiveRecordBase<status>.FindAll();
            PropertyBag["places"] = ActiveRecordBase<place>.FindAll();


            RenderView("_editor");
        }

        /*public String Getlocation()  // this is to be reviewd with get cord logic
        {
            String sql = "SELECT DISTINCT s.Location FROM View AS s WHERE NOT s.Location = 'NULL'";
            SimpleQuery<String> q = new SimpleQuery<String>(typeof(view), sql);
            Array locations = q.Execute();
            String locationsList ="";
            foreach (String s in locations)
            {
                locationsList += '"'+s.ToString()+'"' + ',';
            }
            return locationsList.TrimEnd(',');
        }*/
        public void list_nav()
        {
            PropertyBag["nav"] = ActiveRecordBase<categories>.FindAll(Order.Asc("position"));
            RenderView("../admin/nav/list");
        }

        public void new_nav()
        {
            categories nav = new categories();
            PropertyBag["nav"] = nav;
            RenderView("../admin/nav/_editor");
        }
        public void edit_nav(int id)
        {
            categories nav = ActiveRecordBase<categories>.Find(id);
            PropertyBag["nav"] = nav;
            RenderView("../admin/nav/_editor");
        }
        public void update_nav([ARDataBind("nav", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] categories nav)
        {
            ActiveRecordMediator<categories>.Save(nav);
            RedirectToAction("list_nav");
        }
        public void reorder_nav([ARDataBind("navs", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] categories[] navs)
        {
            foreach (categories nav in navs)
            {
                ActiveRecordMediator<categories>.Save(nav);
            }
            RedirectToAction("list_nav");
        }
        public void delete_nav(int id)
        {
            categories nav = ActiveRecordBase<categories>.Find(id);
            Flash["message"] = "A Place type, <strong>" + nav.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<categories>.Delete(nav);
            CancelLayout();
            RedirectToAction("list");
        }


        public void GetAddAuthor(int count)
        {
            PropertyBag["count"] = count;
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();
            List<authors> authors = new List<authors>();
            authors.Add(new authors());
            authors.Add(new authors());
            PropertyBag["viewauthors"] = authors;
            RenderView("addauthor", true);
        }
        public void DeleteAuthor(int id, int viewId)
        {
            authors author = ActiveRecordBase<authors>.Find(id);
            map_views view = ActiveRecordBase<map_views>.Find(viewId);
            view.authors.Remove(author);
            ActiveRecordMediator<map_views>.Save(view);
            CancelLayout();
            RenderText("true");
        }


        public void readmore(int id)
        {
            PropertyBag["view"] = id==0? null : ActiveRecordBase<map_views>.Find(id);   
        }
        public void view(int id)
        {
            PropertyBag["view"] = ActiveRecordBase<map_views>.Find(id);
        }
        public void clearLock(int id, bool ajax)
        {
            map_views view = ActiveRecordBase<map_views>.Find(id);
            view.checked_out_by = null;
            ActiveRecordMediator<map_views>.Save(view);
            CancelLayout();
            RenderText("true");
        }
        public void checktitle(string title, bool id)
        {
            int SID = 1;//viewService.viewByURL_id(title);
            CancelLayout();
            if (SID == 0 )
            {
                RenderText("false");
            }
            else
            {
                if (id) { RenderText(SID.ToString()); } else { RenderText("true"); }
            }
        }
        public string NVchecktitle(string title, bool id)
        {
            int SID = 1;//viewService.viewByURL_id(title);
            if (SID == 0 )
            {
                return "false";
            }
            else
            {
                if (id) {
                    return SID.ToString();
                } else {
                    return "true";
                }
            }
        }
        public void cleanUpview_media(int id)
        {
            string uploadPath = Context.ApplicationPath + @"\uploads\";
                   uploadPath += @"view\" + id + @"\";
            if (!HelperService.DirExists(uploadPath))
            {
                return;
            }

            //ok the view has image as the dir was created already to hold them
            string[] filePaths = Directory.GetFiles(uploadPath, "*_TMP_*");
            foreach(string file in filePaths){
                FileInfo ImgFile = new FileInfo(file);
                ImgFile.Delete();
            }
        }
        public void aliasCheck(String alias)
        {
            IList<map_views> c = ActiveRecordBase<map_views>.FindAllByProperty("alias", alias);
            if (c.Count > 0)
            {
                RenderText("false");
            }
            else
            {
                RenderText("true");
            }
            return;
        }
        public void Update(
            [ARDataBind("view", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] map_views view,
            [ARDataBind("tabs", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]infotabs[] tabs,
            int[] cats,
            String[] newtab,
            [ARDataBind("images", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]media_repo[] images,
            String[][] fields,
            bool ajaxed_update,
            bool forced_tmp,
            string LongLength,
            string Length,
            string apply,
            string cancel
            )     
        {
            //if (view.options.id == 0)  ActiveRecordMediator<map_views_options>.Save(view.options);
            
            Flash["view"] = view;
            Flash["tags"] = view;
            Flash["authors"] = view;
            //ActiveRecordMediator<map_views>.Update(view);



            if (cancel != null)
            {
                view.checked_out_by = null;
                ActiveRecordMediator<map_views>.Save(view);
                RedirectToAction("list");
                return;
            }
            if (view.name == null || view.name.Length == 0)
            {
                //Flash["error"] = "You are missing the basic parts of a view";
                //RedirectToReferrer();
                //return;
            }
            if (forced_tmp && view.id == 0)
            {
                view.tmp = true;
            }
            else
            {
                string gemSql = "POINT (" + LongLength + " " + Length + ")";
                string wkt = gemSql;
                SqlChars udtText = new SqlChars(wkt);
                SqlGeography sqlGeometry1 = SqlGeography.STGeomFromText(udtText, 4326);

                MemoryStream ms = new MemoryStream();
                BinaryWriter bw = new BinaryWriter(ms);
                byte[] WKB = sqlGeometry1.STAsBinary().Buffer;
                view.center = geometrics.AsByteArray(sqlGeometry1);//WKB;//
            }

            
            






            //view.tags.Clear(); 
            //view.Images.Clear();


            authors user = UserService.getUser();
            view.authors.Clear();
            if (apply != null){

            }else{
                view.checked_out_by = null;
            }

            if (view.id == 0)
            {
                if (!UserService.checkPrivleage("can_publish") || view.status == null)
                {
                    status stat = ActiveRecordBase<status>.Find(1);
                    view.status = stat;
                }
                view.created = DateTime.Now;
            }else{
                view.updated = DateTime.Now;
            }

           /* foreach (authors author in authors){
                if (author.id > 0)
                    view.authors.Add(author);   
            }*/
            view.authors.Add(user); 
            if (HelperService.alias_exsits(view.alias, this.GetType().Name).Length > 1)
            {
                view.alias = view.alias + "1";
                ActiveRecordMediator<map_views>.Save(view);
                Flash["error"] = "The url you choose is in use.  Please choose a new one.  We have saved it as '" + view.alias + "1" + "' currently.";
                if (apply != " Save ")
                {
                    RedirectToUrl("~/view/_edit.castle?id=" + view.id);
                }
                else
                {
                    RedirectToReferrer();
                }
                return;
            }/*
            //map_views_options tmp = view.options;
            var jss = new JavaScriptSerializer();
            var json = jss.Serialize(tmp);
            view.options_obj = json;
*/

            Dictionary<string, string> urlparams = getPostParmasAsObj_obj("options");
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

            view.options_obj = Serialize(values);//jss.Serialize(usettings);




            ActiveRecordMediator<map_views>.Save(view);

            cleanUpview_media(view.id);

            Flash["view"] = null;
            Flash["tags"] = null;
            Flash["authors"] = null;


            if (apply != null)
            {
                if (apply != " Save ")
                {
                    RedirectToUrl("~/view/_edit.castle?id=" + view.id);
                }
                else
                {
                    RedirectToReferrer();
                }
            }
            else
            {
                view.checked_out_by = null;
                ActiveRecordMediator<map_views>.Save(view);
                RedirectToAction("list");
            }
        }

        public void delete(int id)
        {
            map_views view = ActiveRecordBase<map_views>.Find(id);
            Flash["message"] = "Article, <strong>Note:" + view.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<map_views>.Delete(view);
            CancelLayout();
            RedirectToAction("list");
        }
    }
}
