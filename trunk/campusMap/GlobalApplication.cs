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
            try
            {
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

            if (Authentication.logged_in())
            {
                String username = Authentication.authenticate();
                Session["username"] = username;
                // save user in database
                authors[] authUser_list = ActiveRecordBase<authors>.FindAll();
                authors temp = null;
                foreach (authors authUser in authUser_list)
                {
                    if (!string.IsNullOrEmpty(authUser.Nid) && authUser.Nid.ToUpper() == username.ToUpper())
                    { temp = authUser; }
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
                authors[] authUser_list = ActiveRecordBase<authors>.FindAll();
                authors temp = null;
                foreach (authors authUser in authUser_list)
                {
                    if (!string.IsNullOrEmpty(authUser.Nid) && authUser.Nid.ToUpper() == username.ToUpper())
                    { temp = authUser; }
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
