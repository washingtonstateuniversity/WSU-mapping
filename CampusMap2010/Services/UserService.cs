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

namespace campusMap.Services {
    public class UserService {
        public Boolean loginUser() {
            String username = getNid();
            // save user in database
            users[] author_list = ActiveRecordBase<users>.FindAll();
            users foundUser = null;
            foreach (users author in author_list) {
                if (!string.IsNullOrEmpty(author.nid) && author.nid.ToUpper() == username.ToUpper()) { foundUser = author; }
            }
            if (foundUser != null) {
                foundUser.loggedin = true;
                foundUser.Save();
                return foundUser.loggedin;
            }
            return false;
        }
        public Boolean logoutUser() {
            String username = getNid();
            if (username != null) {
                // save user in database
                users[] author_list = ActiveRecordBase<users>.FindAll();
                users temp = null;
                foreach (users author in author_list) {
                    if (!string.IsNullOrEmpty(author.nid) && author.nid.ToUpper() == username.ToUpper()) { temp = author; }
                }
                if (temp != null) {
                    temp.loggedin = false;
                    temp.Save();
                    return temp.loggedin;
                }
                return true;
            }
            return false;
        }

        public users[] getLoggedInUserList() {
            users[] users = ActiveRecordBase<users>.FindAllByProperty("loggedin", true);
            return users;
        }

        public Boolean isLoggedIn() {
            return isLoggedInByNID(null);
        }

        public Boolean isLoggedInByNID(string Nid) {
            if (!String.IsNullOrWhiteSpace(getNid()))
                return true;
            else
                return false;
            /*
            users[] author_list = getLoggedIn();
            bool temp = false;
            if (String.IsNullOrWhiteSpace(Nid)) Nid = getNid();
            
            if (!String.IsNullOrWhiteSpace(Nid)) {
                foreach (users author in author_list) {
                    if (!string.IsNullOrEmpty(author.nid) && author.nid.ToUpper() == Nid.ToUpper()) { temp = true; }
                }
            }
            return temp;*/
        }

        public String getNid() {
            String username = "";
            if (HttpContext.Current.Request.IsLocal)
            {
                username = "jeremy.bass";
            }
            else
            {
                if (HttpContext.Current.Session["username"] != null)
                    return HttpContext.Current.Session["username"].ToString();
                username = Authentication.authenticate();
                HttpContext.Current.Session["username"] = username;
            }
           
            HttpContext.Current.Response.Write("getNid():"+username);
            return username;
        }
        public users setUser() {
            HttpContext.Current.Response.Write("setUser()");
            List<AbstractCriterion> userEx = new List<AbstractCriterion>();
            userEx.Add(Expression.Eq("nid", getNid()));
            users user = ActiveRecordBase<users>.FindFirst(userEx.ToArray());
            HttpContext.Current.Session["you"] = user;
            HttpContext.Current.Response.Write(user.id);
            return user;
        }
        public users getUser() {
            HttpContext.Current.Response.Write("getUser()"+ HttpContext.Current.Session["you"] == null);
            end();
            if (HttpContext.Current.Session["you"] == null)
                HttpContext.Current.Session["you"] = setUser();
            end();
            return (users)HttpContext.Current.Session["you"];
        }
        public users getUserFull() {
            HttpContext.Current.Response.Write("getUserFull()");
            users user = ActiveRecordBase<users>.Find(getUser().id);
            return user;
        }
        public void end()
        {
            HttpContext.Current.Response.Flush();
            HttpContext.Current.Response.End();
        }
        public string getUserIp() {
            return GetIPAddress();
        }
        protected string GetIPAddress() {
            System.Web.HttpContext context = System.Web.HttpContext.Current;

            string ipAddress = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (!string.IsNullOrEmpty(ipAddress)) {
                string[] addresses = ipAddress.Split(',');
                if (addresses.Length != 0) {
                    return addresses[0];
                }
            }

            return context.Request.ServerVariables["REMOTE_ADDR"];
        }

        public campus getUserCoreCampus(bool defaultCampus) {
            return defaultCampus ? ActiveRecordBase<campus>.FindAllByProperty("name", "Pullman")[0] : getUserCoreCampus();
        }

        public campus getUserCoreCampus() {
            return getUserCoreCampus(getUserFull());
        }

        public campus getUserCoreCampus(users author) {
            campus campus = author.campus.Count() > 0 ? author.campus[0] : ActiveRecordBase<campus>.FindAllByProperty("name", "Pullman")[0];
            return campus;
        }


        public Boolean hasGroup(String group) {
            return hasGroup(group, getUserFull());
        }
        public Boolean hasGroup(String group, users user){
            return group == user.groups.name;
        }


        public  Boolean isActive(users user) {
            int timeThreshold = -2; //TODO Set as site perference
            bool active = false;
            if (user != null && (!user.active || user.LastActive < DateTime.Today.AddHours(timeThreshold))) {
                active = true;
            }
            return active;
        }



        public  bool setSessionPrivleage(users user, string privilege) {
            bool flag = user.groups.privileges.Any(item => item.alias == privilege);
            HttpContext.Current.Session[privilege] = flag;
            return flag;
        }
        public  bool checkPrivleage(string privilege) {
            return checkPrivleage(getUserFull(), privilege);
        }
        public  bool checkPrivleage(users user, string privilege) {
            bool flag = (HttpContext.Current.Session[privilege] == null || String.IsNullOrWhiteSpace(HttpContext.Current.Session[privilege].ToString())) ? setSessionPrivleage(user, privilege) : (bool)HttpContext.Current.Session[privilege];
            return flag;
        }


        /* remove */
        public  Boolean canPublish(users user) {
            bool flag = false;
            switch (user.groups.name) {
                case "Admin": flag = true; break;
                case "Editor": flag = true; break;
            }
            return flag;
        }

        //This is a generic set of methods that will first check the object has a property
        //then if it does set it to null if the user is not actively editing it
        public  Boolean clearConnections<t>() {
            t[] items = ActiveRecordBase<t>.FindAll();
            bool result = false;
            foreach (dynamic item in items) {
                if (item.GetType().GetProperty("editing") != null) {
                    if (isActive(item.editing)) {
                        HelperService.writelog("Releasing editor from item ", item.editing, item.id);
                        item.editing = null;
                        ActiveRecordMediator<dynamic>.Save(item);
                        result = true;
                    }
                }
            }
            return result;
        }
        public  Boolean clearLocked<t>(int id, bool ajax) {
            dynamic item = ActiveRecordBase<t>.Find(id);
            bool result = false;
            if (item.GetType().GetMethod("editing") != null) {
                HelperService.writelog("Releasing editor from item ", item.editing.nid, item.id);
                item.editing = null;
                ActiveRecordMediator<dynamic>.Save(item);
                result = true;
            }
            return result;
        }

    }
}
