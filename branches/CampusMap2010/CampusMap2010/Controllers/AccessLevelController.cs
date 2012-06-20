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
     

    [Layout("default")]
    public class AccessLevelController : SecureBaseController
    {
        public void Index()
        {
            //ActiveRecordBase<Block>.FindAll();
            PropertyBag["AccessDate"] = DateTime.Now;
        }

        public void List()
        {
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
        }

        public void Edit(int id)
        {
            access_levels accesslevel = ActiveRecordBase<access_levels>.Find(id);
            PropertyBag["accesslevel"] = accesslevel; 
            RenderView("new");
        }


        public void New()
        {
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
        }
        public void Update([ARDataBind("accesslevel", Validate = true, AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)] access_levels accesslevel)
        {
            try
            {
                ActiveRecordMediator<access_levels>.Save(accesslevel);
            }
                     
            catch (Exception ex)
            {
                Flash["error"] = ex.Message;
                Flash["accesslevel"] = accesslevel;
            }
            RedirectToAction("list");
        }

        

    }
}
                                                      