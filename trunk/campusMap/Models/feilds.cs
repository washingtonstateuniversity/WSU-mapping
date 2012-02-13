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

        private int field_id;
        [PrimaryKey("field_id")]
        virtual public int id
        {
            get { return field_id; }
            set { field_id = value; }
        }
        private field_types type_of;
        [BelongsTo]
        virtual public field_types type
        {
            get { return type_of; }
            set { type_of = value; }
        }
        private string field_value;
        [Property]
        virtual public string value
        {
            get { return field_value; }
            set { field_value = value; }
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

