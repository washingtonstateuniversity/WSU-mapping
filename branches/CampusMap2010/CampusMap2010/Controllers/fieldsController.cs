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
    #endregion

    [Layout("default")]
    public class fieldsController : SecureBaseController
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
            users user = UserService.getUser();
            PropertyBag["authorname"] = user.name;
            PropertyBag["authors"] = ActiveRecordBase<users>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<user_groups>.FindAll();
            PropertyBag["loginUser"] = user;
            PropertyBag["logedin"] = UserService.getLogedIn();
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
        public bool canEdit(map_views view, users user)
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
        public bool canPublish(users user)
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

        public void New()
        {


            map_views view = new map_views();

            PropertyBag["loginUser"] = UserService.getUser();
            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"

            

            PropertyBag["view"] = Flash["view"] != null ? Flash["view"] : view;
            PropertyBag["tags"] = Flash["tags"] != null ? Flash["tags"] : ActiveRecordBase<tags>.FindAll();
            PropertyBag["authors"] = Flash["authors"] != null ? Flash["authors"] : ActiveRecordBase<users>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<user_groups>.FindAll();
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
            PropertyBag["authors"] = ActiveRecordBase<users>.FindAll();
            List<users> authors = new List<users>();
            authors.Add(new users());
            authors.Add(new users());
            PropertyBag["viewauthors"] = authors;
            RenderView("addauthor", true);
        }
        public void DeleteAuthor(int id, int viewId)
        {
            users author = ActiveRecordBase<users>.Find(id);
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

    }
}
