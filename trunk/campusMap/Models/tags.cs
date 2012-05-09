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
    [ActiveRecord(Lazy=true, BatchSize=30)]
    public class tags : json_autocomplete<tags>, campusMap.Models.Ijson_autocomplete
    {
        private int tag_id;
        [PrimaryKey("tag_id")]
        virtual public int id
        {
            get { return tag_id; }
            set { tag_id = value; }
        }
        private string _name;
        [Property]
        virtual public string name
        {
            get { return _name; }
            set { _name = value; }
        }

        private string _attr;
        [Property]
        virtual public string attr
        {
            get { return _attr; }
            set { _attr = value; }
        }
        private IList<place>  _places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_tags", ColumnKey = "tag_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> places
        {
            get { return _places; }
            set { _places = value; }
        }
     }

    [ActiveRecord(Lazy = true, BatchSize =30)]
    public class usertags : ActiveRecordBase<usertags>
    {
        private int usertag_id;
        [PrimaryKey("usertag_id")]
        virtual public int id
        {
            get { return usertag_id; }
            set { usertag_id = value; }
        }
        private string Name;
        [Property]
        virtual public string name
        {
            get { return Name; }
            set { Name = value; }
        }

        private string Attr;
        [Property]
        virtual public string attr
        {
            get { return Attr; }
            set { Attr = value; }
        }
        private IList<place> places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_usertags", ColumnKey = "usertag_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }
    }

}
