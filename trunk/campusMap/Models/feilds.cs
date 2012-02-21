using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using NHibernate.Expression;
using Castle.ActiveRecord;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlTypes;
using campusMap.Services;

namespace campusMap.Models
{
    [ActiveRecord(Lazy=true, BatchSize=30)]
    public class fields : ActiveRecordBase<fields>
    {
        protected HelperService helperService = new HelperService();
        public fields() { }

        private int _id;
        [PrimaryKey("field_id")]
        virtual public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private field_types _of;
        [BelongsTo]
        virtual public field_types type
        {
            get { return _of; }
            set { _of = value; }
        }
        private string _value;
        [Property]
        virtual public string value
        {
            get { return _value; }
            set { _value = value; }
        }
        private int _owner;
        [Property]
        virtual public int owner
        {
            get { return _owner; }
            set { _owner = value; }
        }
    }
}

