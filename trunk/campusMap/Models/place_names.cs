using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Castle.ActiveRecord;
using System.Collections.Generic;
using System.Data.SqlTypes;

namespace campusMap.Models
{
    [ActiveRecord(Lazy = true)]
    public class place_names  
    {
        private int name_id;
        [PrimaryKey("name_id")]
        virtual public int id
        {
            get { return name_id; }
            set { name_id = value; }
        }
        private int Place_Id;
        [Property]
        virtual public int place_id
        {
            get { return Place_Id; }
            set { Place_Id = value; }
        }
        private String Name;
        [Property]
        virtual public String name
        {
            get { return Name; }
            set { Name = value; }
        }
        private String Labeled;
        [Property]
        virtual public String label
        {
            get { return Labeled; }
            set { Labeled = value; }
        }
    }
}
