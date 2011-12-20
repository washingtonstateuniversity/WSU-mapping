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
    public class geometrics : ActiveRecordBase<place>
    {
        protected HelperService helperService = new HelperService();


        public geometrics() { }


        private int geometric_id;
        [PrimaryKey("geometric_id")]
        virtual public int id
        {
            get { return geometric_id; }
            set { geometric_id = value; }
        }
        /* private string Coordinate;
        [Property]
        virtual public string coordinate
        {
            get { return Coordinate; }
            set { Coordinate = value; }
        }*/

        private Byte[] Boundary;
        [Property(SqlType = "geography")]
        virtual public Byte[] boundary
        {
            get { return Boundary; }
            set { Boundary = value; }
        }
        private int Default_Type;
        [Property]
        virtual public int default_type
        {
            get { return Default_Type; }
            set { Default_Type = value; }
        }

        private IList<geometrics_types> Place_Types = new List<geometrics_types>();
        [HasAndBelongsToMany(typeof(geometrics_types), Lazy = true, Table = "geometrics_to_types", ColumnKey = "geometric_id", ColumnRef = "geometrics_type_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics_types> place_types
        {
            get { return Place_Types; }
            set { Place_Types = value; }
        }
        private IList<place> places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_geometrics", ColumnKey = "place_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }

        private IList<field_types> Types;
        [HasAndBelongsToMany(typeof(field_types), Lazy = true, Table = "geometrics_to_field_types", ColumnKey = "field_type_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<field_types> field_types
        {
            get { return Types; }
            set { Types = value; }
        }

        private IList<fields> Fields;
        [HasAndBelongsToMany(typeof(fields), Lazy = true, Table = "geometrics_to_fields", ColumnKey = "field_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<fields> field
        {
            get { return Fields; }
            set { Fields = value; }
        }    

    }
}

