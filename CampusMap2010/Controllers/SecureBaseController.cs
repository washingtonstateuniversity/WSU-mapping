using Castle.MonoRail.Framework;
using campusMap.Services;
using System.Text.RegularExpressions;
using System;
using campusMap.Models;
using Castle.ActiveRecord;
using campusMap.Filters;
using MonoRailHelper;
namespace campusMap.Controllers {
    [Filter(ExecuteWhen.BeforeAction, typeof(AuthUserAuthenticationFilter))]
    //[Rescue(typeof(SecureRescueController))]
    public abstract class SecureBaseController : BaseController {
       
        public void logout() {
            String username = Authentication.authenticate();
            Authentication.logout();
            // save user in database
            users[] author_list = ActiveRecordBase<users>.FindAll();
            users temp = null;
            foreach (users author in author_list) {
                if (!string.IsNullOrEmpty(author.nid) && author.nid.ToUpper() == username.ToUpper()) { temp = author; }
            }
            temp.loggedin = false;
            temp.Save();
            HttpContext.Session.Abandon();
            HttpContext.Response.Redirect("~/admin", false);
            HttpContext.ApplicationInstance.CompleteRequest();
            return;
        }
    }
}
