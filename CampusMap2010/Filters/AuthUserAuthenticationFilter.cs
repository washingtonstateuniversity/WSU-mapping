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
using System.IO;


namespace campusMap.Filters
{
    public class AuthUserAuthenticationFilter : IFilter
    {
        protected UserService userService = new UserService();
        protected HelperService helperService = new HelperService();

        public bool Perform(ExecuteWhen exec, IEngineContext context, IController controller, IControllerContext controllerContext)
        {
            if (context.Request.IsLocal)
            {


                users currentUser = UserService.getUserFull();
                if (currentUser != null) {
                    users you = ActiveRecordBase<users>.Find(currentUser.id);
                    you.loggedin = true;
                    you.LastActive = DateTime.Now;
                    ActiveRecordMediator<users>.Update(you);
                    ActiveRecordMediator<users>.Save(you);
                }

                return true;
            }
            // Read previous authenticated principal from session 
            // (could be from cookie although with more work)
            User user = (User)context.Session["user"];
            // Sets the principal as the current user
            context.CurrentUser = user;
            
            // Checks if it is OK
           // if (!Authentication.logged_in())
            {
                // Not authenticated, redirect to login
                String username = Authentication.authenticate();

                context.Response.Write("username:" + username);
                
                users[] authors = ActiveRecordBase<users>.FindAllByProperty("nid", username);

                if (authors.Length == 0)
                {
                    context.Response.RedirectToUrl("~/", false);
                    return false;
                }
                context.Session["manager"] = true;
                context.Session["username"] = username;
                user = new User(username, new String[0]);
                context.CurrentUser = user;
                System.Threading.Thread.CurrentPrincipal = user;
            }

            if (!UserService.isLoggedIn())
            {
                users currentUser = UserService.getUserFull();

                context.Response.Write("UserService.getUserFull()");

                if (currentUser != null)
                {
                    users you = ActiveRecordBase<users>.Find(currentUser.id);
                    you.loggedin = true;
                    you.LastActive = DateTime.Now;
                    ActiveRecordMediator<users>.Update(you);
                    ActiveRecordMediator<users>.Save(you);
                }
            }

            HttpContext.Current.Response.End();

            controllerContext.PropertyBag["categories"] = ActiveRecordBase<categories>.FindAll();

            controllerContext.PropertyBag["campuses"] = ActiveRecordBase<campus>.FindAll();
            controllerContext.PropertyBag["colleges"] = ActiveRecordBase<colleges>.FindAll();
            controllerContext.PropertyBag["departments"] = ActiveRecordBase<departments>.FindAll();
            controllerContext.PropertyBag["admindepartments"] = ActiveRecordBase<admindepartments>.FindAll();
            controllerContext.PropertyBag["programs"] = ActiveRecordBase<programs>.FindAll();
            controllerContext.PropertyBag["schools"] = ActiveRecordBase<schools>.FindAll();

            controllerContext.PropertyBag["userService"] = userService;
            controllerContext.PropertyBag["helperService"] = helperService;
            controllerContext.PropertyBag["helper"] = helperService;
            controllerContext.PropertyBag["campus"] = UserService.getUserCoreCampus();

            // Everything is ok
            return true;
        }
    }
}
