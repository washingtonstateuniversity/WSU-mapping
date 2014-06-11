namespace campusMap.Controllers
{
    #region Directives
        using System.Collections.Generic;
        using System.Collections.Specialized;
        using Castle.ActiveRecord;
        using Castle.MonoRail.Framework;
        using Castle.MonoRail.ActiveRecordSupport;
        using Castle.MonoRail.Framework.Helpers;
        using MonoRailHelper;
        using NHibernate.Criterion;
        using System.IO;
        using System.Web;
        using System;
        using campusMap.Models;
        using System.Net.Mail;
        using Castle.Components.Common.EmailSender;   
        using Castle.Components.Common.EmailSender.Smtp;
        using Castle.ActiveRecord.Queries;
        using System.Text.RegularExpressions;
        using System.Collections;
        using campusMap.Services;
    using Microsoft.SqlServer.Types;
    using System.Data.SqlTypes;
    using System.Xml;
    using System.Text;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Utilities;
    using Newtonsoft.Json.Linq;


    using System.Collections.ObjectModel;
    using System.Dynamic;
    using System.Linq;
    using System.Web.Script.Serialization;
    using AutoMapper;
    using System.Net;

    #endregion

    [Layout("error")]
    public class RescueController : BaseController, IRescueController
    {
        public void Rescue(Exception exception, IController controller, IControllerContext controllerContext)
        {
            
           // if (exception.GetType() == typeof(WebException) && exception.Message == "Unable to connect to the remote server") SetRescueView("webexception_cannot_connect");
           // if (exception.GetType() == typeof(WebException) && exception.Message == "The operation has timed out") SetRescueView("webexception_portal_timeout");
            PropertyBag["exception"] = exception;



            if (HttpContext.Response.StatusCode == 404)
            {
                SetRescueView("general404");
            }else{
                SetRescueView("error");
            }
        }


        private void SetRescueView(string viewname)
        {
            RenderView("../public/errors/" + viewname);
        }

    }
}
