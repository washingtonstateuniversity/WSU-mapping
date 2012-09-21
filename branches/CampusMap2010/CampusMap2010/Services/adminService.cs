#region Directives
using System;
using System.Data;
using System.Configuration;
using campusMap.Models;
using NHibernate.Criterion;
using System.Collections.Generic;
using Castle.ActiveRecord;
using System.Net;
using System.Text.RegularExpressions;
using System.IO;
using System.Web;
using MonoRailHelper;
using System.Xml;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Collections.Specialized;
using Newtonsoft.Json;
using Newtonsoft.Json.Utilities;
using Newtonsoft.Json.Linq;
using campusMap.Services;
using Castle.MonoRail.Framework;
using campusMap.Filters;
using log4net;
using log4net.Config;
using System.Text;

using SquishIt.Framework;
using SquishIt.Framework.Css;
using SquishIt.Framework.JavaScript;
using System.Security.Cryptography;

#endregion

namespace campusMap.Services
{
    public class adminService
    {
        private static IControllerContext _controllerContext;
        public static void setPDefaults()
        {
/*
            _controllerContext.PropertyBag["campuses"] = ActiveRecordBase<campus>.FindAll(Order.Asc("name"));
            _controllerContext.PropertyBag["colleges"] = ActiveRecordBase<colleges>.FindAll(Order.Asc("name"));
            _controllerContext.PropertyBag["departments"] = ActiveRecordBase<departments>.FindAll(Order.Asc("name"));
            _controllerContext.PropertyBag["admindepartments"] = ActiveRecordBase<admindepartments>.FindAll(Order.Asc("name"));
            _controllerContext.PropertyBag["programs"] = ActiveRecordBase<programs>.FindAll(Order.Asc("name"));
            _controllerContext.PropertyBag["schools"] = ActiveRecordBase<schools>.FindAll(Order.Asc("name"));
 */
        }
    }
}
