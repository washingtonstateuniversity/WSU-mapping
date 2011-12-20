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
        using NHibernate.Expression;
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
    #endregion

    [Layout("default")]
    public class viewController : SecureBaseController
    {


        public void editor(int id, int page)
        {
            CancelView();
            CancelLayout();
            //Edit_view(id, page);
            RenderView("editor_view");
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

        public void List(int page, int searchId, string status)
        {
            authors user = getUser();
            PropertyBag["authorname"] = getUserName();
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["loginUser"] = user;
            PropertyBag["logedin"] = userService.getLogedIn();
            //user.Sections.Contains(view.view_types);

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
                PropertyBag["publishedViews"] = PaginationHelper.CreatePagination(items, pagesize, paging);

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
                PropertyBag["reviewViews"] = PaginationHelper.CreatePagination(items, pagesize, paging);


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
                PropertyBag["draftViews"] = PaginationHelper.CreatePagination(items, pagesize, paging);


            //SETUP SEARCHID and parts
                if (searchId.Equals(0)){
                    PropertyBag["searchId"] = 0;
                }else{
                    PropertyBag["searchId"] = searchId;
                    map_views firstview = new map_views();
                    map_views lastview = new map_views();
                    PropertyBag["firstview"] = firstview;
                    PropertyBag["lastview"] = lastview; 
                }
            RenderView("list");
        }
        public bool canEdit(map_views view, authors user)
        {
            bool flag = false;
           /* switch (user.Accesslevel.Title)
            {
                case "Author":
                    {
                        foreach (view_types item in view.view_types)
                        {
                            if (view.Authors.Contains(user) && user.Sections.Contains(item))
                                flag = true; break;
                        }
                    }
                case "Contributer":
                    {
                        foreach (view_types item in view.view_types)
                        {
                            if (view.Authors.Contains(user) && user.Sections.Contains(item))
                                flag = true; break;
                        }
                    }
                case "Editor":
                    {
                        foreach (view_types item in view.view_types)
                        {
                            if (user.Sections.Contains(item))
                                flag = true; break;
                        }
                    }
             }*/

            return flag;        
        }
        public bool canPublish(authors user)
        {
            bool flag = false;
            /*switch (user.Accesslevel.Title)
            {
                case "Author": flag = true; break;
                               
                case "Editor": flag = true; break;

                case "Contributor": flag = false; break;
            }*/
            return flag;        
        }




        public void setStatus(int id, int status, bool ajax)
        {
            map_views view = ActiveRecordBase<map_views>.Find(id);
            PropertyBag["view"] = view;
            status published = ActiveRecordBase<status>.Find(status);
            //view.Status = published;
            view.Save();

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
     

        public String GetCredit()
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
        public void Edit_view(int id, int page)
        {
            campusMap.Services.LogService.writelog("Editing view " + id);
            PropertyBag["credits"] = "";
            PropertyBag["imagetypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["images_inline"] = ActiveRecordBase<media_repo>.FindAll();

            map_views view = ActiveRecordBase<map_views>.Find(id);
            String username = getUserName();
            PropertyBag["authorname"] = username;
            view.checked_out_by = username;
            view.Save();
            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"

            PropertyBag["loginUser"] = getUser();


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
            //ImageType imgtype = ActiveRecordBase<ImageType>.Find(1);
            //PropertyBag["images"] = imgtype.Images; //Flash["images"] != null ? Flash["images"] : 
            //PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll();
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();//Flash["authors"] != null ? Flash["authors"] : ActiveRecordBase<author>.FindAll();

            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["statuslists"] = ActiveRecordBase<status>.FindAll();

            if (page == 0)
                page = 1;
            int pagesize = 10;
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("View", view));

            IList<comments> items;

            items = ActiveRecordBase<comments>.FindAll(Order.Desc("CreateTime"), baseEx.ToArray());
            PropertyBag["comments"] = PaginationHelper.CreatePagination(items, pagesize, page);

            String CreditList = GetCredit();
            PropertyBag["credits"] = CreditList; 

            List<tags> tags = new List<tags>();
            tags.AddRange(view.tags);
            for (int i = 0; i < 2; i++)
                tags.Add(new tags());
            PropertyBag["viewtags"] = tags;

            List<authors> authors = new List<authors>();
            authors.AddRange(view.authors);
            for (int i = 0; i < 2; i++)
                authors.Add(new authors());

            PropertyBag["viewauthors"] = authors; 
            RenderView("new");
       
        }
        public void New()
        {


            map_views view = new map_views();
   
            PropertyBag["loginUser"] = getUser();
            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"

            

            PropertyBag["view"] = Flash["view"] != null ? Flash["view"] : view;
            PropertyBag["tags"] = Flash["tags"] != null ? Flash["tags"] : ActiveRecordBase<tags>.FindAll();
            PropertyBag["authors"] = Flash["authors"] != null ? Flash["authors"] : ActiveRecordBase<authors>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["statuslists"] = ActiveRecordBase<status>.FindAll();
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
        public void GetAddtags(int count)
        {
            PropertyBag["count"] = count;
            PropertyBag["tags"] = ActiveRecordBase<tags>.FindAll();
            List<tags> tags = new List<tags>();
            tags.Add(new tags());
            tags.Add(new tags());
            PropertyBag["viewtags"] = tags;
            RenderView("addtag", true);
        }

        public void Deletetags(int id, int imageid)
        {
            tags tag = ActiveRecordBase<tags>.Find(imageid);
            map_views view = ActiveRecordBase<map_views>.Find(id);
            view.tags.Remove(tag);
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
            view.checked_out_by = "";
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
        public void Update([ARDataBind("view", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] map_views view,
            [ARDataBind("tags", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]tags[] tags, String[] newtag,
            [ARDataBind("authors", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]authors[] authors,
            string apply, string cancel)     
        {
            Flash["view"] = view;
            Flash["tags"] = view;
            Flash["authors"] = view;

            if (cancel != null)
            {
                view.checked_out_by = "";
                ActiveRecordMediator<map_views>.Save(view);
                RedirectToAction("list");
                return;
            }
            if (view.name == null || view.name.Length == 0)
            {
                Flash["error"] = "You are missing the basic parts of a view";
                RedirectToReferrer();
                return;
            }

            
            authors user = getUser();
            /*if (!canPublish(user))
            {
                ViewStatus stat= ActiveRecordBase<ViewStatus>.Find(1);
                view.Status = stat;
            }*/

            view.tags.Clear(); 
            //view.Images.Clear();
            view.authors.Clear();
            if (apply != null)
            {

            }
            else
            {
                view.checked_out_by = "";
            }


            if (view.id == 0)
            {
                //ViewStatus stat = ActiveRecordBase<ViewStatus>.Find(1);
                //view.Status = stat;
                view.created = DateTime.Now;
            }
            else
            {
                view.updated = DateTime.Now;
            }

            if (newtag != null)
            {
                foreach (String onetags in newtag)
                {
                    if (onetags != "")
                    {
                        tags t = new tags();
                        t.name = onetags;
                        tags[] temp = ActiveRecordBase<tags>.FindAllByProperty("Name", onetags);
                        if (temp.Length == 0)
                        {
                            ActiveRecordMediator<tags>.Save(t);
                            view.tags.Add(t);                                                                                  
                        }
                    }                        
                }               
                     
            }
            foreach (tags tag in tags)
            {
                if (tag.id > 0)
                   view.tags.Add(tag);        
            }

            
            foreach (authors author in authors)
            {
                if (author.id > 0)
                    view.authors.Add(author);   
            }

            /*string requested_url = view.CustomUrl;
            if (viewService.viewByURL(view.CustomUrl).Length > 1)
            {
                view.CustomUrl = requested_url + "1";
                ActiveRecordMediator<view>.Save(view);
                Flash["error"] = "The url you choose is in use.  Please choose a new one.  We have saved it as '" + requested_url + "1" + "' currently.";
                RedirectToReferrer();
                return;
            }*/


            ActiveRecordMediator<map_views>.Save(view);

            cleanUpview_media(view.id);

            Flash["view"] = null;
            Flash["tags"] = null;
            Flash["authors"] = null;


            if (apply != null)
            {
                if (apply != " Save ")
                {
                    Redirect("Edit_view.castle?id=" + view.id);
                }
                else
                {
                    RedirectToReferrer();
                }
            }
            else
            {
                RedirectToAction("list");
            }
        }

        public void delete(int id)
        {
            map_views view = ActiveRecordBase<map_views>.Find(id);
            Flash["massage"] = "Article, <strong>Note:" + view.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<map_views>.Delete(view);
            CancelLayout();
            RedirectToAction("list");
        }
    }
}
