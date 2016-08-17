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
                if (Context.Request.IsLocal) { 
                    ActiveRecordStarter.GenerateCreationScripts(Context.Server.MapPath("/config/export.sql"));
                }
            }
            catch
            {
                // I'm eating this error because it's just handy, not necessary
            }
        }

        protected void Session_Start(object sender, EventArgs e)
        {
            Services.UserService userService = new Services.UserService();
            if (Authentication.logged_in() && userService.loginUser())
            {
                Services.HelperService.writelog("User logged in");
            }
        }

        protected void Session_OnEnd(Object sender, EventArgs e)
        {
            Services.UserService userService = new Services.UserService();
            try{
                if (HttpContext.Current.Session["username"] != null)
                {
                    if (userService.logoutUser())
                    {
                        Services.HelperService.writelog("User was logged out");
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
