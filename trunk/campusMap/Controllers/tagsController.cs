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

    [Layout("default")]
    public class tagsController : SecureBaseController
    {
        public void Index()
        {
            //ActiveRecordBase<Block>.FindAll();
            PropertyBag["AccessDate"] = DateTime.Now;
        }

        public void List()
        {
            PropertyBag["tags"] = ActiveRecordBase<tags>.FindAll();
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

       /* public void Update(int id, [DataBind("tag")] tags tag)
        {
            try
            {
                tag.Save();
            }
            catch (Exception ex)
            {
                Flash["error"] = ex.Message;
                Flash["tag"] = tag;

            }
            RedirectToAction("list");
        }*/

        public void delete(int id)
        {
            tags tag = ActiveRecordBase<tags>.Find(id);
            ActiveRecordMediator<tags>.Delete(tag);
            RedirectToReferrer();
        }


    }
}
