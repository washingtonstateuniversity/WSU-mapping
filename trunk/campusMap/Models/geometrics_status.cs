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
    [ActiveRecord(Lazy=true, BatchSize=10)]
    public class geometrics_status
        
    {
        private int id;
        [PrimaryKey] 
        virtual public int Id
        {
            get { return id; }
            set { id = value; }
        }
        private String title;
        [Property]
        virtual public String Title
        {
            get { return title; }
            set { title = value; }
        }
    }
}
