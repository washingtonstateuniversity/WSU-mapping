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
        protected UserService userService = new UserService();
        protected HelperService helperService = new HelperService();
        public bool Perform(ExecuteWhen exec, IEngineContext context, IController controller, IControllerContext controllerContext)
        {
            if (UserService.isLogedIn())// || Authentication.logged_in()) /* not 100% we can't just strip off the Authentication.*/
            {
                authors user = UserService.getUser();
                if (user != null)
                {
                    user.logedin = true;
                    user.LastActive = DateTime.Now;
                    ActiveRecordMediator<authors>.Save(user);
                }
                controllerContext.PropertyBag["campus"] = UserService.getUserCoreCampus();
                controllerContext.PropertyBag["userService"] = userService;
            }
           controllerContext.PropertyBag["helperService"] = helperService;
           return true;
        }
    }
}
