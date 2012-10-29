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


            //OnRequest.ForCss("~/Content/css/min/Combined.css");

        }

        protected void Session_Start(object sender, EventArgs e)
        {
            if (Authentication.logged_in() && Services.UserService.loginUser())
            {
                Services.LogService.writelog("User loged in");
            }
        }

        protected void Session_OnEnd(Object sender, EventArgs e)
        {

            if (HttpContext.Current.Session["username"] != null)
            {
                if (Services.UserService.logoutUser())
                {
                    Services.LogService.writelog("User was loged out");
                }
            }
        }

        public void Application_OnEnd()
        {
            container.Dispose();
        }
	}
}
