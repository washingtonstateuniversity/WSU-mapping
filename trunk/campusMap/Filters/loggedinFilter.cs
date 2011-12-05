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
    using Castle.MonoRail.Framework.Controllers;
    using Castle.MonoRail.ActiveRecordSupport;
    using Castle.ActiveRecord;
    using campusMap.Models;
    using System.Security.Principal;
    using MonoRailHelper;
#endregion

namespace campusMap.Filters
{
    public class loggedinFilter : IFilter
    {
        public bool Perform(ExecuteEnum exec, IRailsEngineContext context, Controller controller)
        {
            if (Authentication.logged_in())
            {
                String username = Authentication.authenticate();
                // save user in database
                authors[] authUser_list = ActiveRecordBase<authors>.FindAll();
                authors temp = null;
                foreach (authors authUser in authUser_list)
                {
                    if (!string.IsNullOrEmpty(authUser.Nid) && authUser.Nid.ToUpper() == username.ToUpper())
                    { temp = authUser; }
                }
                if (temp != null)
                {
                    temp.logedin = true;
                    temp.LastActive = DateTime.Now;
                    temp.Save();
                }
            }
            return true;
        }
    }
}
