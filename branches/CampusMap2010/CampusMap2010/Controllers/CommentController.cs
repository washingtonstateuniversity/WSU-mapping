namespace campusMap.Controllers
{
	using Castle.MonoRail.Framework;
    using System.Collections.Generic;
    using Castle.ActiveRecord;
    using Castle.MonoRail.ActiveRecordSupport;
    using Castle.MonoRail.Framework.Helpers;
    using MonoRailHelper;
    using NHibernate.Criterion;
    using System.IO;
    using System.Web;
    using System;
    using campusMap.Models;
    [Layout("default")]
    public class CommentController : SecureBaseController
	{

        [AccessibleThrough(Verb.Post)]
		public void Authenticate(string username, string password, bool autoLogin)
		{
			// In a real situation, you would like to authenticate the user here. 
			// As a matter of example, we're just getting the parameters sent 
			// and displaying it back to the user
			PropertyBag["username"] = username;
			PropertyBag["password"] = password;
			PropertyBag["autoLogin"] = autoLogin;
		}
        public void adminViewed(int id)
        {   
            comments comment = ActiveRecordBase<comments>.Find(id);
            comment.adminRead = true;
            ActiveRecordMediator<comments>.Save(comment);
        }
        public void delete(int id)
        {
            comments comment = ActiveRecordBase<comments>.Find(id);
            /*if(comment.Place != null)
                comment.Place.Comments.Remove(comment);*/
            ActiveRecordMediator<comments>.Delete(comment);
            RedirectToAction("list");

        }
        public void Update([ARDataBind("comment", AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)] comments comment)
        {   //comment.CreateTime = DateTime.Now;
            //comment.UpdateTime = DateTime.Now;
            if (comment.Flagged == false) {
                comment.FlagNumber = 0;
            }
            ActiveRecordMediator<comments>.Save(comment);
            RedirectToAction("list");
        }
        public void New()
        {            
            PropertyBag["comments"] = ActiveRecordBase<comments>.FindAll();
        }
        public void index(int page)
        {
            if (page == 0)
                page = 1;
            IList<comments> items;
            int pagesize = 30;
            items = ActiveRecordBase<comments>.FindAll(Order.Desc("CreateTime"));
            PropertyBag["comments"] = PaginationHelper.CreatePagination(items, pagesize, page);
           //PropertyBag["comments"] = ActiveRecordBase<Comment>.FindAll();         
        }
        public void Edit(int id)
        {   
            comments comment = ActiveRecordBase<comments>.Find(id);
            PropertyBag["comment"] = comment;
            RenderView("new");
        }
      
	}
}
