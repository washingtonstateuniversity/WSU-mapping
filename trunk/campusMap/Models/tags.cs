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
    public class tags : ActiveRecordBase<tags>
    {
        private int tag_id;
        [PrimaryKey("tag_id")]
        virtual public int id
        {
            get { return tag_id; }
            set { tag_id = value; }
        }

        private string Name;
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
        private IList<place>  places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_tags", ColumnKey = "tag_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }
     }
}
