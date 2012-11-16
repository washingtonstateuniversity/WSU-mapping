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
        public static Boolean loginUser()
        {
            String username = Authentication.authenticate();
            HttpContext.Current.Session["username"] = username; //Maybe this should be md5'd?
            // save user in database
            users[] author_list = ActiveRecordBase<users>.FindAll();
            users temp = null;
            foreach (users author in author_list)
            {
                if (!string.IsNullOrEmpty(author.nid) && author.nid.ToUpper() == username.ToUpper())
                { temp = author; }
            }
            if (temp != null)
            {
                temp.logedin = true;
                temp.Save();
                return temp.logedin;
            }
            return false;            
        }
        public static Boolean logoutUser()
        {
            String username = HttpContext.Current.Session["username"] != null ? HttpContext.Current.Session["username"].ToString() : null;
            if (username != null)
            {
                // save user in database
                users[] author_list = ActiveRecordBase<users>.FindAll();
                users temp = null;
                foreach (users author in author_list)
                {
                    if (!string.IsNullOrEmpty(author.nid) && author.nid.ToUpper() == username.ToUpper())
                    { temp = author; }
                }
                if (temp != null)
                {
                    temp.logedin = false;
                    temp.Save();
                    return temp.logedin;
                }
                return true;
            }
            return false;
        }


        public static users[] getLogedIn()
        {
            users[] users = ActiveRecordBase<users>.FindAllByProperty("logedin", true);
            return users;
        }

        public static Boolean isLogedIn()
        {
            return isLogedIn(null);
        }

        public static Boolean isLogedIn(string Nid)
        {
            users[] author_list = getLogedIn();
            bool temp = false;
            if (String.IsNullOrWhiteSpace(Nid)) Nid = getNid();
            if (!String.IsNullOrWhiteSpace(Nid))
            {
                foreach (users author in author_list)
                {
                    if (!string.IsNullOrEmpty(author.nid) && author.nid.ToUpper() == Nid.ToUpper())
                    { temp = true; }
                }
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
        public static users setUser()
        {
            List<AbstractCriterion> userEx = new List<AbstractCriterion>();
            userEx.Add(Expression.Eq("nid", getNid()));
            users user = ActiveRecordBase<users>.FindFirst(userEx.ToArray());
            HttpContext.Current.Session["you"] = user;
            return user;
        }
        public static users getUser()
        {
            users user = HttpContext.Current.Session["you"] == null ? setUser() : (users)HttpContext.Current.Session["you"];
            return user;
        }
        public static users getUserFull() {
            users user = ActiveRecordBase<users>.Find(getUser().id);
            return user;
        }
        public static string getUserIp()
        {
            return GetIPAddress();
        }
        protected static string GetIPAddress()
        {
            System.Web.HttpContext context = System.Web.HttpContext.Current;

            string ipAddress = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (!string.IsNullOrEmpty(ipAddress))
            {
                string[] addresses = ipAddress.Split(',');
                if (addresses.Length != 0)
                {
                    return addresses[0];
                }
            }

            return context.Request.ServerVariables["REMOTE_ADDR"];
        }
        public static campus getUserCoreCampus()
        {
            return getUserCoreCampus(getUser());
        }

        public static campus getUserCoreCampus(users author)
        {
            campus campus = author.campus.Count() > 0 ? author.campus[0] : ActiveRecordBase<campus>.FindAllByProperty("name", "Pullman")[0]; 
            return campus;
        }

 



        public static Boolean isActive(users user)
        {
            int timeThreshold = -2; //TODO Set as site perference
            bool active = false;
            if (user != null && (!user.active || user.LastActive < DateTime.Today.AddHours(timeThreshold)))
            {
                active = true;
            }
            return active;
        }

        public static bool setSessionPrivleage(users user, string privilege)
        {
            bool flag = user.groups.privileges.Any(item => item.alias == privilege);
            HttpContext.Current.Session[privilege] = flag;
            return flag;
        }
        public static bool checkPrivleage(string privilege)
        {
            return checkPrivleage(getUserFull(), privilege);
        }
        public static bool checkPrivleage(users user, string privilege)
        {
            bool flag = (HttpContext.Current.Session[privilege] == null || String.IsNullOrWhiteSpace(HttpContext.Current.Session[privilege].ToString())) ? setSessionPrivleage(user, privilege) : (bool)HttpContext.Current.Session[privilege];
            return flag;
        }


        /* remove */
        public static Boolean canPublish(users user)
        {
            bool flag = false;
            switch (user.groups.name)
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
