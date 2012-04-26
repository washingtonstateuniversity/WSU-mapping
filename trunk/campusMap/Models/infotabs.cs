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
        private IList<place> _places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_infotabs", ColumnKey = "infotab_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> places
        {
            get { return _places; }
            set { _places = value; }
        }



    }
}