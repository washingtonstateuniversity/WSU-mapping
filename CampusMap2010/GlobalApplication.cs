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
        public void Application_OnStart()
        {
            container = new WindsorContainer(new XmlInterpreter());
            // ActiveRecordStarter.CreateSchema();
            try {
                if (Context.Request.IsLocal)
                    ActiveRecordStarter.GenerateCreationScripts(Context.Server.MapPath("/config/export.sql"));
            }
            catch
            {
                // I'm eating this error because it's just handy, not necessary
            }
        }

        protected void Session_Start(object sender, EventArgs e)
        {
            if (Authentication.logged_in() && Services.UserService.loginUser())
            {
                Services.HelperService.writelog("User loged in");
            }
        }

        protected void Session_OnEnd(Object sender, EventArgs e)
        {
            try{
                if (HttpContext.Current.Session["username"] != null)
                {
                    if (Services.UserService.logoutUser())
                    {
                        Services.HelperService.writelog("User was loged out");
                    }
                }
            }
            catch{ }
        }

        public void Application_OnEnd()
        {
            container.Dispose();
        }
	}
}
