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
    public class access_levels  
    {
        private int access_level_id;
        [PrimaryKey("access_level_id")]
        virtual public int id
        {
            get { return access_level_id; }
            set { access_level_id = value; }
        }
        private String Title;
        [Property]
        virtual public String title
        {
            get { return Title; }
            set { Title = value; }
        }
    }
}
