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
    [Filter(ExecuteWhen.BeforeAction, typeof(AuthUserAuthenticationFilter))]
	public abstract class SecureBaseController : BaseController
	{
        public void logout()
        {
            
            String username = Authentication.authenticate();
            Authentication.logout();
            // save user in database
            authors[] author_list = ActiveRecordBase<authors>.FindAll();
            authors temp = null;
            foreach (authors author in author_list)
            {
                if (!string.IsNullOrEmpty(author.Nid) && author.Nid.ToUpper() == username.ToUpper())
                { temp = author; }
            }
            temp.logedin = false;
            temp.Save();/**/
            HttpContext.Session.Abandon();
            RedirectToUrl("/admin");
            return;
        }
	}
}
