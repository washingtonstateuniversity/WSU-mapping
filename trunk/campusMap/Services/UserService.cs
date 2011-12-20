#region Directives
    using System;
    using System.Data;
    using System.Configuration;
    using campusMap.Models;
    using NHibernate.Expression;
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


    }
}
