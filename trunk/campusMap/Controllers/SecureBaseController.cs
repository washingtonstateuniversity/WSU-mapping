using Castle.MonoRail.Framework;
using campusMap.Services;
using System.Text.RegularExpressions;
using System;
using campusMap.Models;
using Castle.ActiveRecord;
using campusMap.Filters;
using MonoRailHelper;
namespace campusMap.Controllers
{
    [Filter(ExecuteEnum.BeforeAction, typeof(AuthUserAuthenticationFilter))]
	public abstract class SecureBaseController : BaseController
	{
        public void logout()
        {
            
            String username = Authentication.authenticate();
            Authentication.logout();
            // save user in database
            authors[] authUser_list = ActiveRecordBase<authors>.FindAll();
            authors temp = null;
            foreach (authors authUser in authUser_list)
            {
                if (!string.IsNullOrEmpty(authUser.Nid) && authUser.Nid.ToUpper() == username.ToUpper())
                { temp = authUser; }
            }
            temp.logedin = false;
            temp.Save();/**/
            HttpContext.Session.Abandon();
            Redirect("/home");
            return;
        }
	}
}
