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
    public class status : ActiveRecordBase<status>
        
    {
        public status() { }
        private int Id;
        [PrimaryKey("status_id")]
        virtual public int id
        {
            get { return Id; }
            set { Id = value; }
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
