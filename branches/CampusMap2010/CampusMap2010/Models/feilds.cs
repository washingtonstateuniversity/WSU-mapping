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


    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class field_types : json_autocomplete<field_types>, campusMap.Models.Ijson_autocomplete
    {
        private int field_type_id;
        [PrimaryKey("field_type_id")]
        virtual public int id
        {
            get { return field_type_id; }
            set { field_type_id = value; }
        }

        private string Name;
        [Property]
        virtual public string name
        {
            get { return Name; }
            set { Name = value; }
        }
        private string _alias;
        [Property]
        virtual public string alias
        {
            get { return _alias; }
            set { _alias = value; }
        }
        private string Attr;
        [Property]
        virtual public string attr
        {
            get { return Attr; }
            set { Attr = value; }
        }
        private string field_model;
        [Property]
        virtual public string model
        {
            get { return field_model; }
            set { field_model = value; }
        }
        private int field_set;
        [Property("fieldset")]
        virtual public int set
        {
            get { return field_set; }
            set { field_set = value; }
        }
        private bool _is_public;
        [Property]
        virtual public bool is_public
        {
            get { return _is_public; }
            set { _is_public = value; }
        }
        private IList<authors> _authors = new List<authors>();
        [HasAndBelongsToMany(typeof(authors), Lazy = true, BatchSize = 5, Table = "authors_to_field_type", ColumnKey = "field_type_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<authors> authors
        {
            get { return _authors; }
            set { _authors = value; }
        }
        private IList<access_levels> _access_levels = new List<access_levels>();
        [HasAndBelongsToMany(typeof(access_levels), Lazy = true, BatchSize = 5, Table = "access_levels_to_field_type", ColumnKey = "field_type_id", ColumnRef = "access_level_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<access_levels> access_levels
        {
            get { return _access_levels; }
            set { _access_levels = value; }
        }
        /*

        private IList<view> Views;
        [HasAndBelongsToMany(typeof(view), Lazy = true, Table = "view_to_field_types", ColumnKey = "field_type_id", ColumnRef = "view_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<view> views
        {
            get { return Views; }
            set { Views = value; }
        }
        private IList<media_repo> Media;
        [HasAndBelongsToMany(typeof(media_repo), Lazy = true, Table = "media_to_field_types", ColumnKey = "field_type_id", ColumnRef = "media_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<media_repo> media
        {
            get { return Media; }
            set { Media = value; }
        }

        private IList<advertisement> Ads;
        [HasAndBelongsToMany(typeof(advertisement), Lazy = true, Table = "ad_to_field_types", ColumnKey = "field_type_id", ColumnRef = "ad_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<advertisement> ads
        {
            get { return Ads; }
            set { Ads = value; }
        }

        private IList<categories> Category;
        [HasAndBelongsToMany(typeof(categories), Lazy = true, Table = "category_to_field_types", ColumnKey = "field_type_id", ColumnRef = "category_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<categories> category
        {
            get { return Category; }
            set { Category = value; }
        }

        private IList<geometrics> Geometric;
        [HasAndBelongsToMany(typeof(geometrics), Lazy = true, Table = "geometric_to_field_types", ColumnKey = "field_type_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics> geometric
        {
            get { return Geometric; }
            set { Geometric = value; }
        }        
        */






    }

}

