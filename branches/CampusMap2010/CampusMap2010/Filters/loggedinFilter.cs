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
#endregion

namespace campusMap.Filters
{
    public class loggedinFilter : IFilter
    {
        public bool Perform(ExecuteWhen exec, IEngineContext context, IController controller, IControllerContext controllerContext)
        {
            if (Authentication.logged_in())
            {
                String username = Authentication.getNID();
                // save user in database
                authors[] author_list = ActiveRecordBase<authors>.FindAll();
                authors temp = null;
                foreach (authors author in author_list)
                {
                    if (!string.IsNullOrEmpty(author.Nid) && author.Nid.ToUpper() == username.ToUpper())
                    { temp = author; }
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
