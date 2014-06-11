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
using NHibernate.Criterion;
using System.Collections.Generic;

namespace campusMap.Models
{
    [ActiveRecord(Lazy=true)]
    public class small_url : ActiveRecordBase<small_url>
    {
        private int _id;
        [PrimaryKey("small_url_id")]
        virtual public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private String _small_url;
        [Property("small_url")]
        virtual public String sm_url
        {
            get { return _small_url; }
            set { _small_url = value; }
        }
        private String _original;
        [Property("original")]
        virtual public String or_url
        {
            get { return _original; }
            set { _original = value; }
        }
     }
}
