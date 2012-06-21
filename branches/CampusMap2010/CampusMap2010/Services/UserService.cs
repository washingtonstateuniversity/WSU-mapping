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
#endregion

namespace campusMap.Services
{
    public class UserService
	{
        public static authors[] getLogedIn()
        {
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("logedin", true));
            authors[] users = ActiveRecordBase<authors>.FindAll(baseEx.ToArray());
            return users;
        }
        public static bool isLogedIn()
        {
            return isLogedIn(null);
        }

        public static bool isLogedIn(string Nid)
        {
            authors[] author_list = getLogedIn();
            bool temp = false;
            if (String.IsNullOrWhiteSpace(Nid)) Nid = getUser().Nid;
            foreach (authors author in author_list)
            {
                if (!string.IsNullOrEmpty(author.Nid) && author.Nid.ToUpper() == Nid.ToUpper())
                { temp = true; }
            }
            return temp;
        }
        public static String getNid()
        {
            String username = "";
            if (HttpContext.Current.Request.IsLocal)
            {
                username = "jeremy.bass";
            }
            else
            {
                username = HttpContext.Current.Session["username"] == null ? "" : HttpContext.Current.Session["username"].ToString();
            }
            return username;
        }
        public static authors getUser()
        {
            try
            {
                authors[] author = ActiveRecordBase<authors>.FindAllByProperty( "Nid", getNid() );
                authors temp = null;
                if (author[0] != null) { temp = author[0]; }
                return temp;
            }
            catch (Exception)
            {
            }
            return null;
        }
        public static bool isActive(authors user)
        {
            int timeThreshold = -2; //TODO Set as site perference
            bool active = false;
            if (user != null && (!user.active || user.LastActive < DateTime.Today.AddHours(timeThreshold)))
            {
                active = true;
            }
            return active;
        }
    }
}
