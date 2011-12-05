namespace campusMap.Controllers
{
	using System.Collections.Generic;
	using Castle.MonoRail.Framework;
	using campusMap.Models;

	public class ContactController : BaseController
	{
		public void Index()
		{
			// Here you could, for example, query the database for some
			// information about your company, and make it available
			// to the template using the "PropertyBag" property. 
			AddCountriesToPropertyBag();

			// The following line is required to allow automatic validation
			PropertyBag["contacttype"] = typeof(ContactInfo);
		}

		[AccessibleThrough(Verb.Post)]
		public void SendContact([DataBind("contact")] ContactInfo info)
		{
			// We could save, send through email or something else. 
			// For now, we just show the data back

			PropertyBag["contact"] = info;

			RenderView("Confirmation");
		}

		private void AddCountriesToPropertyBag()
		{
			List<country> countries = new List<country>();

			countries.Add(new country(1, "Brazil"));
			countries.Add(new country(2, "Canada"));
			countries.Add(new country(3, "United States"));
			countries.Add(new country(4, "Russia"));

			PropertyBag["countries"] = countries;
		}
	}
}
