#region using
    using System;
    using Castle.MonoRail.Framework;
    using campusMap.Models;
    using MonoRailHelper;
    using Rejuicer;
#endregion

namespace campusMap.Filters
{
    public class scriptFilter : IFilter
    {
        public bool Perform(ExecuteWhen exec, IEngineContext context, IController controller, IControllerContext controllerContext)
        {
            controllerContext.PropertyBag["adminRejuicer_css"] = OnRequest.ForCss("~/Content/css/min/Combined.css").Compact;
            controllerContext.PropertyBag["adminRejuicer_js"] = OnRequest.ForJs("~/Content/js/min/Combined.js");
            //controllerContext.PropertyBag["JavaScriptBundle"] = new JavaScriptBundle();
            return true;
        }
    }
}
