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
    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class infotabs : ActiveRecordBase<infotabs>
    {
        private int infotab_id;
        [PrimaryKey("infotab_id")]
        virtual public int id
        {
            get { return infotab_id; }
            set { infotab_id = value; }
        }
        private string _content;
        [Property]
        virtual public string content
        {
            get { return _content; }
            set { _content = value; }
        }
        private string _title;
        [Property]
        virtual public string title
        {
            get { return _title; }
            set { _title = value; }
        }
        private int _sort;
        [Property]
        virtual public int sort
        {
            get { return _sort; }
            set { _sort = value; }
        }
        private infotabs_templates _template;
        [BelongsTo]
        virtual public infotabs_templates template
        {
            get { return _template; }
            set { _template = value; }
        }
        private IList<place> _places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_infotabs", ColumnKey = "infotab_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> places
        {
            get { return _places; }
            set { _places = value; }
        }
    }
    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class infotabs_templates : ActiveRecordBase<infotabs_templates>
    {
        private int template_id;
        [PrimaryKey("template_id")]
        virtual public int id
        {
            get { return template_id; }
            set { template_id = value; }
        }
        private string _name;
        [Property]
        virtual public string name
        {
            get { return _name; }
            set { _name = value; }
        }
        private string _alias;
        [Property]
        virtual public string alias
        {
            get { return _alias; }
            set { _alias = value; }
        }
        private string _content;
        [Property]
        virtual public string content
        {
            get { return _content; }
            set { _content = value; }
        }
        private bool _process;
        [Property]
        virtual public bool process
        {
            get { return _process; }
            set { _process = value; }
        }
        private IList<infotabs> _infotabs;
        [HasAndBelongsToMany(typeof(infotabs), Lazy = true, Table = "infotabs_to_infotabs_templates", ColumnKey = "infotab_id", ColumnRef = "template_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<infotabs> infotabs
        {
            get { return _infotabs; }
            set { _infotabs = value; }
        }
    }
}
