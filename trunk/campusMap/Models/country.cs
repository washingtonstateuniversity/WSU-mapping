namespace campusMap.Models
{
	public class country
	{
		private int id;
		private string name;

		public country(int id, string name)
		{
			this.id = id;
			this.name = name;
		}

		public country()
		{
		}

		public int Id
		{
			get { return id; }
			set { id = value; }
		}

		public string Name
		{
			get { return name; }
			set { name = value; }
		}
	}
}
