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
    [ActiveRecord(Lazy=true, BatchSize=5)]
    public class categories : ActiveRecordBase<categories>
    {
        private int category_id;
        [PrimaryKey("category_id")]
        virtual public int id
        {
            get { return category_id; }
            set { category_id = value; }
        }
        private string _name;
        [Property]
        virtual public string name
        {
            get { return _name; }
            set { _name = value; }
        }
        private int _level;
        [Property]
        virtual public int level
        {
            get { return _level; }
            set { _level = value; }
        }
        private int _position;
        [Property]
        virtual public int position
        {
            get { return _position; }
            set { _position = value; }
        }
        private string _url;
        [Property]
        virtual public string url
        {
            get { return _url; }
            set { _url = value; }
        }
        private bool _asLink;
        [Property]
        virtual public bool asLink
        {
            get { return _asLink; }
            set { _asLink = value; }
        }
        private bool _active;
        [Property]
        virtual public bool active
        {
            get { return _active; }
            set { _active = value; }
        }
        private string _friendly_name;
        [Property]
        virtual public string friendly_name
        {
            get { return _friendly_name; }
            set { _friendly_name = value; }
        }
        private IList<place> _places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_categories", ColumnKey = "category_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return _places; }
            set { _places = value; }
        }

     }
}
