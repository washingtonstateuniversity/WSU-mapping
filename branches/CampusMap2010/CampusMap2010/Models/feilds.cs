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
    [ActiveRecord(Lazy=true, BatchSize=30)]
    public class fields : ActiveRecordBase<fields>
    {
        protected HelperService helperService = new HelperService();
        public fields() { }

        [PrimaryKey("field_id")]
        virtual public int id { get; set; } 

        [BelongsTo]
        virtual public field_types type { get; set; }

        [Property]
        virtual public string value { get; set; }

        [Property]
        virtual public int owner { get; set; }
    }


    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class field_types : json_autocomplete<field_types>, campusMap.Models.Ijson_autocomplete
    {

        [PrimaryKey("field_type_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public string alias { get; set; }

        [Property]
        virtual public string attr { get; set; }

        [Property]
        virtual public string model { get; set; }

        [Property("fieldset")]
        virtual public int set { get; set; }

        [Property]
        virtual public bool is_public { get; set; }

        [HasAndBelongsToMany(typeof(users), Lazy = true, BatchSize = 5, Table = "authors_to_field_type", ColumnKey = "field_type_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<users> authors { get; set; }

        [HasAndBelongsToMany(typeof(user_groups), Lazy = true, BatchSize = 5, Table = "access_levels_to_field_type", ColumnKey = "field_type_id", ColumnRef = "access_level_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<user_groups> access_levels { get; set; }

    }

}

