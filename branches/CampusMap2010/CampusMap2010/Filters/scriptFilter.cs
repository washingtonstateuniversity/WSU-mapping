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

    using SquishIt.Framework;
#endregion

namespace campusMap.Filters
{
    public class loggedinFilter : IFilter
    {
        public bool Perform(ExecuteWhen exec, IEngineContext context, IController controller, IControllerContext controllerContext)
        {
            PropertyBag["Bundle"] = Bundle;
        }
    }
}
