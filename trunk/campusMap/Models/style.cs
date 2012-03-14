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
    public class styles : ActiveRecordBase<styles>
    {
       // protected HelperService helperService = new HelperService();
        public styles() { }

        private int _id;
        [PrimaryKey("style_id")]
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
        private geometrics_types _of;
        [BelongsTo]
        virtual public geometrics_types type
        {
            get { return _of; }
            set { _of = value; }
        }
        private IList<style_options> _value;
        [HasAndBelongsToMany(typeof(style_options), Lazy = true, Table = "style_to_style_options", ColumnKey = "style_id", ColumnRef = "style_option_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]//[Property]
        virtual public IList<style_options> value
        {
            get { return _value; }
            set { _value = value; }
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
        private style_events _event;
        [BelongsTo]
        virtual public style_events user_event
        {
            get { return _event; }
            set { _event = value; }
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
    public class style_events : ActiveRecordBase<style_events>
    {
        private int _id;
        [PrimaryKey("style_event_id")]
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
        private string _f_name;
        [Property]
        virtual public string friendly_name
        {
            get { return _f_name; }
            set { _f_name = value; }
        }

        private geometrics_types _of;
        [BelongsTo]
        virtual public geometrics_types type
        {
            get { return _of; }
            set { _of = value; }
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
        private IList<geometrics_types> _types;
        [HasAndBelongsToMany(typeof(geometrics_types), Lazy = true, Table = "style_option_types_to_geometrics_to_types", ColumnKey = "geometrics_type_id", ColumnRef = "style_option_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics_types> style_type
        {
            get { return _types; }
            set { _types = value; }
        }
    }
}

