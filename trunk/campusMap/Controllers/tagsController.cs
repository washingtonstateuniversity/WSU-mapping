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
        public void index(int page)
        {
            IList<tags> items;
            IList<usertags> usertags_items;
            int pagesize = 15;
            int paging = 1;

            //this needs to be fixes some how to set them speperatly.  
            paging = page;

            items = ActiveRecordBase<tags>.FindAll();
            PropertyBag["tags"] = PaginationHelper.CreatePagination(items, pagesize, paging);
            
            usertags_items = ActiveRecordBase<usertags>.FindAll();
            PropertyBag["usertags"] = PaginationHelper.CreatePagination(usertags_items, pagesize, paging);
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
