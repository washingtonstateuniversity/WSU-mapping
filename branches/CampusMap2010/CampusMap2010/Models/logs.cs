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
        private int _id;
        [PrimaryKey("Id")]
        virtual public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private string _log;
        [Property("logentry")]
        virtual public string entry
        {
            get { return _log; }
            set { _log = value; }
        }
        private string _nid;
        [Property]
        virtual public string nid
        {
            get { return _nid; }
            set { _nid = value; }
        }
        private string _ip;
        [Property]
        virtual public string ip
        {
            get { return _ip; }
            set { _ip = value; }
        }
        private DateTime? _logdate;
        [Property("dtOfLog")]
        virtual public DateTime? date
        {
            get { return _logdate; }
            set
            {
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue))
                {
                    // bla is a valid sql datetime
                    _logdate = value;

                }
            }
        }
    }
}
