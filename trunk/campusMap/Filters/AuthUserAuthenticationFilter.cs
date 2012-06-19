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
using Castle.MonoRail.Framework.Controllers;
using Castle.MonoRail.ActiveRecordSupport;
using Castle.ActiveRecord;
using campusMap.Models;
using System.Security.Principal;
using MonoRailHelper;


namespace campusMap.Filters
{
    public class AuthUserAuthenticationFilter : IFilter
    {

        public bool Perform(ExecuteEnum exec, IRailsEngineContext context, Controller controller)
        {
            if (context.Request.IsLocal)
                return true;
            // Read previous authenticated principal from session 
            // (could be from cookie although with more work)
            User user = (User)context.Session["user"];
            
            // Redirect to dailycampusMap.wsu.edu because dailycampusMap.com can't catch the cookie
            if (context.Request.Uri.ToString().ToLower().Contains("dailycampusMap.com"))
            {
                context.Response.Redirect("http://dev.campusmap.wsu.edu/manager");
                return false;
            }

            // Sets the principal as the current user
            context.CurrentUser = user;

            // Checks if it is OK
            if (context.CurrentUser == null ||
                !context.CurrentUser.Identity.IsAuthenticated ||
                !Authentication.logged_in())
            {
                // Not authenticated, redirect to login
                String username = Authentication.authenticate();

                authors[] authors = ActiveRecordBase<authors>.FindAllByProperty("Nid", username);

                if (authors.Length == 0)
                {
                    controller.Redirect("~/public/notauthorized.castle");
                    return false;
                }
                context.Session["manager"] = true;
                context.Session["username"] = username;
                user = new User(username, new String[0]);
                context.CurrentUser = user;
                System.Threading.Thread.CurrentPrincipal = user;
            }

            // Everything is ok
            return true;
        }
    }
}
