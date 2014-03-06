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
using Castle.Components.Validator;
using Newtonsoft.Json;

namespace campusMap.Models
{
    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class categories : ActiveRecordBase<categories>
    {
        [PrimaryKey("category_id")]
        virtual public int id { get; set; }

        [ValidateNonEmpty("Event Category Name is required.")]
        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public int level { get; set; }

        [Property]
        virtual public int position { get; set; }

        [Property]
        virtual public string url { get; set; }

        [Property]
        virtual public bool asLink { get; set; }

        [Property]
        virtual public bool active { get; set; }

        [Property]
        virtual public string friendly_name { get; set; }

        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_categories", ColumnKey = "category_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        [JsonIgnore]
        virtual public IList<place> Places { get; set; }

        private categories parent;
        [BelongsTo]
        [JsonIgnore]
        virtual public categories Parent
        {
            get { return parent; }
            set { parent = value; }
        }
    }

    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class programs : ActiveRecordBase<programs>
    {
        [PrimaryKey("program_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public string url { get; set; }

        [Property]
        virtual public string attr { get; set; }

        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_programs", ColumnKey = "program_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places { get; set; }
    }

    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class schools : ActiveRecordBase<schools>
    {
        [PrimaryKey("school_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public string url { get; set; }

        [Property]
        virtual public string attr { get; set; }

        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_schools", ColumnKey = "school_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places { get; set; }

    }

    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class departments : ActiveRecordBase<departments>
    {
        [PrimaryKey("department_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public string url { get; set; }

        [Property]
        virtual public string attr { get; set; }

        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_departments", ColumnKey = "department_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places { get; set; }
    }

    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class admindepartments : ActiveRecordBase<admindepartments>
    {
        [PrimaryKey("admindepartment_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public string url { get; set; }

        [Property]
        virtual public string attr { get; set; }

        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_admindepartments", ColumnKey = "admindepartment_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places { get; set; }

    }
    
    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class colleges : ActiveRecordBase<colleges>
    {
        [PrimaryKey("college_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public string url { get; set; }

        [Property]
        virtual public string attr { get; set; }

        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_colleges", ColumnKey = "college_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places { get; set; }

    }

    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class campus : ActiveRecordBase<campus>
    {
        [PrimaryKey("campus_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string city { get; set; }

        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public string url { get; set; }

        [Property]
        virtual public string state { get; set; }

        [Property]
        virtual public string state_abbrev { get; set; }

        [Property]
        virtual public int zipcode { get; set; }

        [Property]
        virtual public decimal latitude { get; set; }

        [Property]
        virtual public decimal longitude { get; set; }

        [HasMany(typeof(place), Lazy = true, Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places { get; set; }

    }

}
