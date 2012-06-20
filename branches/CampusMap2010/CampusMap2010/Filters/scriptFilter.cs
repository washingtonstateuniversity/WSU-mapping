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

    using System.Collections;
    using System.Collections.Generic;
    using Castle.ActiveRecord.Queries;
    using System.IO;
    using System.Net;
    using NHibernate.Criterion;
    using System.Xml;
    using System.Xml.XPath;
    using System.Text.RegularExpressions;
    using System.Text;
    using System.Net.Sockets;
    using System.Web.Mail;
    using campusMap.Services;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Utilities;
    using Newtonsoft.Json.Linq;

    using SquishIt.Framework;
#endregion

namespace campusMap.Filters
{
    public class scriptFilter : IFilter
    {
        public bool Perform(ExecuteWhen exec, IEngineContext context, IController controller, IControllerContext controllerContext)
        {
            PropertyBag["Bundle"] = Bundle;
        }
    }
}
