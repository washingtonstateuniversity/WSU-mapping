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

            try
            {
                HttpRequest httpRequest = HttpContext.Current.Request;
                if (httpRequest.Browser.IsMobileDevice)
                {
                    Response.Redirect("http://goo.gl/maps/4P71");
                }
                /*if (Request.Headers["User-Agent"] != null)
                {
                    if (Request.Browser["IsMobileDevice"] != null && Request.Browser["IsMobileDevice"] == "true")
                        Response.Redirect("http://goo.gl/maps/4P71");
                    if (Request.Browser["BlackBerry"] != null && Request.Browser["BlackBerry"] == "true")
                        Response.Redirect("http://goo.gl/maps/4P71");
                    if (Request.UserAgent.ToLower().Contains("iphone"))
                        Response.Redirect("http://goo.gl/maps/4P71");
                    if (Request.UserAgent.ToUpper().Contains("MIDP") || Request.UserAgent.ToUpper().Contains("CLDC"))
                        Response.Redirect("http://goo.gl/maps/4P71");
                }*/
            
            }
            catch
            {
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
