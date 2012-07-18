namespace campusMap
{
    using System;
    using System.Web;
    using Castle.Windsor;
    using Castle.Windsor.Configuration.Interpreters;
    using Castle.ActiveRecord;
    using MonoRailHelper;
    using campusMap.Models;
    using System.Net.Mail;
    using Rejuicer;


	public class GlobalApplication : HttpApplication, IContainerAccessor
	{
		private static IWindsorContainer container;

		public GlobalApplication()
		{
		}

		#region IContainerAccessor

		public IWindsorContainer Container
		{
			get { return container; }
		}

		#endregion
        protected void Application_Start()
        {
            // ... everything else

            // SquishIt
           // Application_Bundle();
        }
/*
        protected void Application_Bundle()
        {
            //SquishIt
            Bundle.Css()
            .AsCached("min", "~/Content/css/min");
            
        }
*/
        public void Application_OnStart()
        {







            container = new WindsorContainer(new XmlInterpreter());
            //
            
            // ActiveRecordStarter.CreateSchema();
            try
            {
                if (Context.Request.IsLocal)
                    ActiveRecordStarter.GenerateCreationScripts(Context.Server.MapPath("/config/export.sql"));
            }
            catch
            {
                // I'm eating this error because it's just handy, not necessary
            }

            if (Context.Request.Headers["User-Agent"] != null)
            {
                if (Context.Request.Browser["IsMobileDevice"] != null && Context.Request.Browser["IsMobileDevice"] == "true")
                    Context.Response.Redirect("http://goo.gl/maps/4P71");
                if (Context.Request.Browser["BlackBerry"] != null && Context.Request.Browser["BlackBerry"] == "true")
                    Context.Response.Redirect("http://goo.gl/maps/4P71");
                if (Context.Request.UserAgent.ToLower().Contains("iphone"))
                    Context.Response.Redirect("http://goo.gl/maps/4P71");
                if (Context.Request.UserAgent.ToUpper().Contains("MIDP") || Context.Request.UserAgent.ToUpper().Contains("CLDC"))
                    Context.Response.Redirect("http://goo.gl/maps/4P71");
            }
            //OnRequest.ForCss("~/Content/css/min/Combined.css");

        }

        protected void Session_Start(object sender, EventArgs e)
        {

            if (Authentication.logged_in())
            {
                String username = Authentication.authenticate();
                Session["username"] = username;
                // save user in database
                authors[] author_list = ActiveRecordBase<authors>.FindAll();
                authors temp = null;
                foreach (authors author in author_list)
                {
                    if (!string.IsNullOrEmpty(author.Nid) && author.Nid.ToUpper() == username.ToUpper())
                    { temp = author; }
                }
                if (temp != null)
                {
                    temp.logedin = true;
                    temp.Save();
                }
            }
            
        }

        protected void Session_OnEnd(Object sender, EventArgs e)
        {
            String username = Session["username"] != null ? Session["username"].ToString() : null;
            if (username != null)
            {
                // save user in database
                authors[] author_list = ActiveRecordBase<authors>.FindAll();
                authors temp = null;
                foreach (authors author in author_list)
                {
                    if (!string.IsNullOrEmpty(author.Nid) && author.Nid.ToUpper() == username.ToUpper())
                    { temp = author; }
                }
                temp.logedin = false;
                temp.Save();
            }
        }

        public void Application_OnEnd()
        {
            container.Dispose();
        }
	}
}
