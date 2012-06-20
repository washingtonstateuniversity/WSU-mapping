using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using NHibernate.Criterion;
using Castle.ActiveRecord;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlTypes;
using campusMap.Services;

namespace campusMap.Models
{
    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class logs : ActiveRecordBase<logs>
    {
        private int id;
        [PrimaryKey]
        virtual public int Id
        {
            get { return id; }
            set { id = value; }
        }
        private string LOG;
        [Property]
        virtual public string logentry
        {
            get { return LOG; }
            set { LOG = value; }
        }

        private DateTime? LOGDATE;
        [Property]
        virtual public DateTime? dtOfLog
        {
            get { return LOGDATE; }
            set
            {
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue))
                {
                    // bla is a valid sql datetime
                    LOGDATE = value;

                }
            }
        }



    }
}
