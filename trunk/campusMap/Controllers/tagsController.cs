namespace campusMap.Controllers
{
    using System.Collections.Generic;
    using Castle.ActiveRecord;
    using Castle.MonoRail.Framework;
    using Castle.MonoRail.ActiveRecordSupport;
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
    using Castle.MonoRail.Framework.Helpers;

    [Layout("default")]
    public class tagsController : SecureBaseController
    {
        public void index(int page, string target)
        {
            IList<tags> items;
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

            items = ActiveRecordBase<tags>.FindAll(Order.Asc("name"));
            PropertyBag["tags"] = PaginationHelper.CreatePagination(items, pagesize, paging);

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


    }
}
