namespace campusMap.Controllers
{
    using System.Collections.Generic;
    using Castle.ActiveRecord;
    using Castle.MonoRail.Framework;
    using Castle.MonoRail.ActiveRecordSupport;
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
    using Castle.MonoRail.Framework.Helpers;

    [Layout("default")]
    public class tagsController : SecureBaseController
    {
        public void index(int page, string filter, string target)
        {
            IList<usertags> usertags_items;
            int pagesize = 100;
            int paging = 1;
            int uPaging = 1;

            //this needs to be fixes some how to set them speperatly.  
            if (target=="tag"){
                paging = page;
            }else{
                uPaging = page;
            }

            if(String.IsNullOrEmpty(filter))filter="all";
            String by = String.Empty;
            switch (filter)
            {
                case "unassigned":
                    {
                        by = "NOT exists"; break;
                    }
                case "assigned":
                    {
                        by = "exists"; break;
                    }
                case "all":
                    {
                        by = String.Empty; break;
                    }
            }
            String sql = "from tags t " + (String.IsNullOrEmpty(by) ? "" : " where " + by + " elements(t.places)") + " Order BY name Asc";
            SimpleQuery<tags> q = new SimpleQuery<tags>(typeof(tags), sql);
            IList<tags> items = q.Execute();
            PropertyBag["tags"] = PaginationHelper.CreatePagination(items, pagesize, paging);

            sql = "from tags t where NOT exists elements(t.places)";
            q = new SimpleQuery<tags>(typeof(tags), sql);
            items = q.Execute();
            PropertyBag["unassignedCount"] = items.Count;

            sql = "SELECT t.name FROM tags t GROUP BY t.name HAVING ( COUNT(t.name) > 1 )";
            SimpleQuery<String> dub = new SimpleQuery<String>(typeof(tags), sql);
            String[] dubItems = dub.Execute();
            PropertyBag["doubledCount"] = dubItems.Length;

            PropertyBag["selected"] = filter;

            usertags_items = ActiveRecordBase<usertags>.FindAll(Order.Asc("name"));
            PropertyBag["usertags"] = PaginationHelper.CreatePagination(usertags_items, pagesize, uPaging);
        }
        public void Edit(int id)
        {
            PropertyBag["tag"] = ActiveRecordBase<tags>.Find(id);
            RenderView("new");
        }
        public void New()
        {
            PropertyBag["tags"] = ActiveRecordBase<tags>.FindAll();
        }

        public void Update(int id, [DataBind("tag")] tags tag)
        {
            try
            {
                ActiveRecordMediator<tags>.Save(tag);
            }
            catch (Exception ex)
            {
                Flash["error"] = ex.Message;
                Flash["tag"] = tag;

            }
            RedirectToAction("index");
        }

        public void delete(int id)
        {
            tags tag = ActiveRecordBase<tags>.Find(id);
            ActiveRecordMediator<tags>.Delete(tag);
            RedirectToReferrer();
        }
        public void merge(int[] ids, string newname)
        {
            if (!String.IsNullOrEmpty(Request.Params["deleteTags"])) massDeleteTags(ids); return;
            List<place> places = new List<place>();
            string name = "";
            foreach(int id in ids){
                tags tag = ActiveRecordBase<tags>.Find(id);
                name = tag.name;
                places.AddRange(tag.places);
                foreach (place p in tag.places)
                {
                    p.tags.Remove(tag);
                    ActiveRecordMediator<place>.Save(p);
                }     
                ActiveRecordMediator<tags>.Delete(tag);
            }

            tags t = new tags();
            t.name = String.IsNullOrEmpty(newname) ? name : newname;
            ActiveRecordMediator<tags>.Save(t);

            foreach(place p in places){
                p.tags.Add(t);
                ActiveRecordMediator<place>.Save(p);
            }             
            
            RedirectToReferrer();
        }



        public void edit_usertags(int id)
        {
            PropertyBag["usertag"] = ActiveRecordBase<usertags>.Find(id);
            RenderView("new");
        }
        public void new_usertags()
        {
            PropertyBag["usertags"] = ActiveRecordBase<usertags>.FindAll();
            RenderView("usertags/new");
        }

        public void update_usertags(int id, [DataBind("tag")] usertags tag)
        {
            try
            {
                //ActiveRecordMediator<tags>.Save(tag);
                ActiveRecordMediator<usertags>.Save(tag);
            }
            catch (Exception ex)
            {
                Flash["error"] = ex.Message;
                Flash["tag"] = tag;

            }
            RedirectToAction("index");
        }

        public void delete_usertags(int id)
        {
            usertags tag = ActiveRecordBase<usertags>.Find(id);
            ActiveRecordMediator<usertags>.Delete(tag);
            RedirectToReferrer();
        }

        public void massDeleteTags(int[] ids)
        {
            foreach (int id in ids)
            {
                tags tag = ActiveRecordBase<tags>.Find(id);
                ActiveRecordMediator<tags>.Delete(tag);
            }
            RedirectToReferrer();
        }
        public void massDeleteUserTags(int[] ids)
        {
            foreach (int id in ids)
            {
                usertags tag = ActiveRecordBase<usertags>.Find(id);
                ActiveRecordMediator<usertags>.Delete(tag);
            }
            RedirectToReferrer();
        }
    }
}
