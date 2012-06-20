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
		

        public authors[] getLogedIn()
        {
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("logedin", true));
            authors[] users = ActiveRecordBase<authors>.FindAll(baseEx.ToArray());
            return users;
        }

        public bool isLogedIn(string username)
        {
            authors[] author_list = getLogedIn();
            bool temp = false;
            foreach (authors author in author_list)
            {
                if (!string.IsNullOrEmpty(author.Nid) && author.Nid.ToUpper() == username.ToUpper())
                { temp = true; }
            }
            return temp;
        }
        public String getUserName()
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
        public authors getUser()
        {
            try
            {
                String login_username = getUserName();
                authors[] author_list = ActiveRecordBase<authors>.FindAll();
                authors temp = null;
                foreach (authors author in author_list)
                {
                    if (!string.IsNullOrEmpty(author.Nid) && author.Nid.ToUpper() == login_username.ToUpper())
                    { temp = author; }
                }
                return temp;
            }
            catch (Exception)
            {
            }
            return null;
        }

    }
}
