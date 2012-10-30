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
        [PrimaryKey("status_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public String name { get; set; }
    }
}
