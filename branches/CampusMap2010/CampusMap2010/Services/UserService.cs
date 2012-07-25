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
    using System.Linq;
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
            authors[] users = ActiveRecordBase<authors>.FindAllByProperty("logedin", true);
            return users;
        }

        public static Boolean isLogedIn()
        {
            return isLogedIn(null);
        }

        public static Boolean isLogedIn(string Nid)
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
            List<AbstractCriterion> userEx = new List<AbstractCriterion>();
            userEx.Add(Expression.Eq("Nid", getNid()));
            authors author = ActiveRecordBase<authors>.FindFirst(userEx.ToArray());
            return author;
        }

        public static Boolean isActive(authors user)
        {
            int timeThreshold = -2; //TODO Set as site perference
            bool active = false;
            if (user != null && (!user.active || user.LastActive < DateTime.Today.AddHours(timeThreshold)))
            {
                active = true;
            }
            return active;
        }

        public bool setSessionPrivleage(authors user, string privilege)
        {
            bool flag = user.access_levels.privileges.Any(item => item.alias == privilege);
            HttpContext.Current.Session[privilege] = flag;
            return flag;
        }
        public bool checkPrivleage(string privilege){
            return checkPrivleage(getUser(),privilege);
        }
        public bool checkPrivleage(authors user, string privilege)
        {
            bool flag = HttpContext.Current.Session[privilege] == null ? setSessionPrivleage(user, privilege) : (bool)HttpContext.Current.Session[privilege];
            return flag;
        }


        /* remove */
        public static Boolean canPublish(authors user)
        {
            bool flag = false;
            switch (user.access_levels.name)
            {
                case "Admin": flag = true; break;
                case "Editor": flag = true; break;
            }
            return flag;
        }

        public static Boolean clearLock(Object obj)
        {
            bool result = false;
           /*
            authors author = getUser();
            if(author.checked_out.Contains(obj)){
                author.checked_out.Remove(obj);
                ActiveRecordMediator<authors>.Save(author);
                result = true;
            }*/
            /*t item = ActiveRecordBase<t>.Find(id);
            if (item != null)
            {
                item.checked_out_by = null;
                ActiveRecordMediator<t>.Save(item);
                result = true;
            }
             */
            return result;
        }


    }
}
