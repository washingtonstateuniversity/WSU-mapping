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
using NHibernate.Expression;
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
        private string Name;
        [Property]
        virtual public string name
        {
            get { return Name; }
            set { Name = value; }
        }
        private int Level;
        [Property]
        virtual public int level
        {
            get { return Level; }
            set { Level = value; }
        }
        private string _friendly_name;
        [Property]
        virtual public string friendly_name
        {
            get { return _friendly_name; }
            set { _friendly_name = value; }
        }
        private IList<place> places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_categories", ColumnKey = "category_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }
     }
}
