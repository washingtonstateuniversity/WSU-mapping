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
    public class style : ActiveRecordBase<style>
    {
        protected HelperService helperService = new HelperService();
        public style() { }

        private int _id;
        [PrimaryKey("style_id")]
        virtual public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private style_types _of;
        [BelongsTo]
        virtual public style_types type
        {
            get { return _of; }
            set { _of = value; }
        }
        private IList<style_options> _value;
        [Property]
        virtual public IList<style_options> value
        {
            get { return _value; }
            set { _value = value; }
        }
    }
    [ActiveRecord(Lazy = true)]
    public class style_types : ActiveRecordBase<style_types>
    {
        private int _id;
        [PrimaryKey("style_type_id")]
        virtual public int id
        {
            get { return _id; }
            set { _id = value; }
        }

        private string _name;
        [Property]
        virtual public string name
        {
            get { return _name; }
            set { _name = value; }
        }

        private IList<style_option_types> _ops;
        [HasAndBelongsToMany(typeof(style_option_types), Lazy = true, Table = "style_option_types_to_style_types", ColumnKey = "style_type_id", ColumnRef = "style_option_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<style_option_types> ops
        {
            get { return _ops; }
            set { _ops = value; }
        }
    }

    [ActiveRecord(Lazy = true)]
    public class style_options : ActiveRecordBase<style_options>
    {
        private int _id;
        [PrimaryKey("style_option_id")]
        virtual public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private style_option_types _of;
        [BelongsTo]
        virtual public style_option_types type
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
    }

    [ActiveRecord(Lazy = true)]
    public class style_option_types : ActiveRecordBase<style_option_types>
    {
        private int _id;
        [PrimaryKey("style_option_type_id")]
        virtual public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private string _name;
        [Property]
        virtual public string name
        {
            get { return _name; }
            set { _name = value; }
        }
        private IList<style_types> _types;
        [HasAndBelongsToMany(typeof(style_types), Lazy = true, Table = "style_option_types_to_style_types", ColumnKey = "style_type_id", ColumnRef = "style_option_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<style_types> style_type
        {
            get { return _types; }
            set { _types = value; }
        }
    }





}

