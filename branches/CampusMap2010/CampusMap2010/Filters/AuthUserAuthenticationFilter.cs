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



namespace campusMap.Filters
{
    public class AuthUserAuthenticationFilter : IFilter
    {
        protected UserService userService = new UserService();
        protected HelperService helperService = new HelperService();
        public bool Perform(ExecuteWhen exec, IEngineContext context, IController controller, IControllerContext controllerContext)
        {



            controllerContext.PropertyBag["categories"] = ActiveRecordBase<categories>.FindAll();

            controllerContext.PropertyBag["campuses"] = ActiveRecordBase<campus>.FindAll();
            controllerContext.PropertyBag["colleges"] = ActiveRecordBase<colleges>.FindAll();
            controllerContext.PropertyBag["departments"] = ActiveRecordBase<departments>.FindAll();
            controllerContext.PropertyBag["admindepartments"] = ActiveRecordBase<admindepartments>.FindAll();
            controllerContext.PropertyBag["programs"] = ActiveRecordBase<programs>.FindAll();
            controllerContext.PropertyBag["schools"] = ActiveRecordBase<schools>.FindAll();

            controllerContext.PropertyBag["userService"] = userService;
            controllerContext.PropertyBag["helperService"] = helperService;

            if (context.Request.IsLocal)
            {
                return true;
            }
            // Read previous authenticated principal from session 
            // (could be from cookie although with more work)
            User user = (User)context.Session["user"];
            
            // Redirect to dailycampusMap.wsu.edu because dailycampusMap.com can't catch the cookie
            //if (context.Request.Uri.ToString().ToLower().Contains("dailycampusMap.com"))
            //{
            //     context.Response.Redirect("http://dev.campusmap.wsu.edu/admin");
            //     return false;
            //}
            // Sets the principal as the current user
            context.CurrentUser = user;
            
            // Checks if it is OK
            if (context.CurrentUser == null ||
                !context.CurrentUser.Identity.IsAuthenticated ||
                !Authentication.logged_in())
            {
                // Not authenticated, redirect to login
                String username = Authentication.authenticate();

                users[] authors = ActiveRecordBase<users>.FindAllByProperty("nid", username);

                if (authors.Length == 0)
                {
                    context.Response.RedirectToUrl("~/admin", false);
                    return false;
                }
                context.Session["manager"] = true;
                context.Session["username"] = username;
                user = new User(username, new String[0]);
                context.CurrentUser = user;
                System.Threading.Thread.CurrentPrincipal = user;
            }

            if (UserService.isLogedIn())// || Authentication.logged_in()) /* not 100% we can't just strip off the Authentication.*/
            {
                users currentUser = UserService.getUser();
                if (currentUser != null)
                {
                    currentUser.logedin = true;
                    currentUser.LastActive = DateTime.Now;
                    currentUser.SaveAndFlush();
                    //ActiveRecordMediator<users>.Save(currentUser);
                }
            }

            controllerContext.PropertyBag["categories"] = ActiveRecordBase<categories>.FindAll();

            controllerContext.PropertyBag["campuses"] = ActiveRecordBase<campus>.FindAll();
            controllerContext.PropertyBag["colleges"] = ActiveRecordBase<colleges>.FindAll();
            controllerContext.PropertyBag["departments"] = ActiveRecordBase<departments>.FindAll();
            controllerContext.PropertyBag["programs"] = ActiveRecordBase<programs>.FindAll();
            controllerContext.PropertyBag["schools"] = ActiveRecordBase<schools>.FindAll();

            controllerContext.PropertyBag["userService"] = userService;
            controllerContext.PropertyBag["helperService"] = helperService;

            // Everything is ok
            return true;
        }
    }
}
