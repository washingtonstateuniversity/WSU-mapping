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
            PropertyBag["privileges"] = ActiveRecordBase<privileges>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
        }

        public void _edit_accesslevel(int id)
        {

            PropertyBag["categories"] = ActiveRecordBase<categories>.FindAll();

            PropertyBag["campuses"] = ActiveRecordBase<campus>.FindAll();
            PropertyBag["colleges"] = ActiveRecordBase<colleges>.FindAll();
            PropertyBag["departments"] = ActiveRecordBase<departments>.FindAll();
            PropertyBag["programs"] = ActiveRecordBase<programs>.FindAll();
            PropertyBag["schools"] = ActiveRecordBase<schools>.FindAll();

            PropertyBag["privileges"] = ActiveRecordBase<privileges>.FindAll();
            PropertyBag["accesslevel"] = ActiveRecordBase<access_levels>.Find(id);
            RenderView("new");
        }
        public void _new_accesslevel()
        {

            PropertyBag["categories"] = ActiveRecordBase<categories>.FindAll();

            PropertyBag["campuses"] = ActiveRecordBase<campus>.FindAll();
            PropertyBag["colleges"] = ActiveRecordBase<colleges>.FindAll();
            PropertyBag["departments"] = ActiveRecordBase<departments>.FindAll();
            PropertyBag["programs"] = ActiveRecordBase<programs>.FindAll();
            PropertyBag["schools"] = ActiveRecordBase<schools>.FindAll();

            PropertyBag["privileges"] = ActiveRecordBase<privileges>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            RenderView("new");
        }
        public void _update_accesslevel([ARDataBind("accesslevel", Validate = true, AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)] access_levels accesslevel)
        {
            try
            {
                ActiveRecordMediator<access_levels>.Save(accesslevel);
            }       
            catch (Exception ex)
            {
                Flash["error"] = ex.Message;
                Flash["accesslevel"] = accesslevel;
                if (accesslevel.id > 0)
                {
                    RedirectToAction("_edit_accesslevel", new string[] { "id", accesslevel.id.ToString() });
                }
                else
                {
                    RedirectToAction("_new_accesslevel");
                }
                return;
            }
            RedirectToAction("list");
        }
        public void _delete_accesslevel(int id)
        {
            access_levels level = ActiveRecordBase<access_levels>.Find(id);
            Flash["error"] = "At the moment no one has rights to delete a group but the system.";
            if (id == 999999)
            {
                try
                {
                    ActiveRecordMediator<access_levels>.Delete(level);
                }
                catch (Exception ex)
                {
                    Flash["error"] = ex.Message;
                }
            }
            RedirectToAction("list");
        }

        public void _edit_privilege(int id)
        {
            privileges privilege = ActiveRecordBase<privileges>.Find(id);
            PropertyBag["privilege"] = privilege;
            RenderView("_edit_privilege");
        }
        public void _new_privilege()
        {
            PropertyBag["privilege"] = new privileges();
            RenderView("_edit_privilege");
        }
        public void _update_privilege([ARDataBind("privilege", Validate = true, AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)] privileges privilege)
        {
            try
            {
                ActiveRecordMediator<privileges>.Save(privilege);
            }
            catch (Exception ex)
            {
                Flash["error"] = ex.Message;
                Flash["item"] = privilege;
                if (privilege.id > 0)
                {
                    RedirectToAction("_edit_privilege", new string[] { "id", privilege.id.ToString() });
                }
                else
                {
                    RedirectToAction("_new_privilege");
                }
                return;
            }
            RedirectToAction("list");
        }

        public void _delete_privilege(int id)
        {
            privileges privilege = ActiveRecordBase<privileges>.Find(id);
            try
            {
                ActiveRecordMediator<privileges>.Delete(privilege);
            }
            catch (Exception ex)
            {
                Flash["error"] = ex.Message;
            }
            RedirectToAction("list");
        }





        

















    }
}
                                                      