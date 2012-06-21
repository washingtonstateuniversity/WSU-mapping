#region using
    using System;
    using System.Data;
    using System.Configuration;
    using System.Web;
    using System.Web.Security;
    using System.Web.UI;
    using System.Web.UI.WebControls;
    using System.Web.UI.WebControls.WebParts;
    using System.Web.UI.HtmlControls;
    using Castle.MonoRail.Framework;
    using Castle.MonoRail.ActiveRecordSupport;
    using Castle.ActiveRecord;
    using campusMap.Models;
    using System.Security.Principal;
    using MonoRailHelper;
    using campusMap.Services;
#endregion

namespace campusMap.Filters
{
    public class loggedinFilter : IFilter
    {
        public bool Perform(ExecuteWhen exec, IEngineContext context, IController controller, IControllerContext controllerContext)
        {
            if (Authentication.logged_in())
            {
                authors user = UserService.getUser();
                if (user != null)
                {
                    user.logedin = true;
                    user.LastActive = DateTime.Now;
                    ActiveRecordMediator<authors>.Save(user);
                }
            }
            return true;
        }
    }
}
