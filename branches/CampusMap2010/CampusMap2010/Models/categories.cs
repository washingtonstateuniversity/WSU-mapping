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
        [PrimaryKey("category_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public int level { get; set; }

        [Property]
        virtual public int position { get; set; }

        [Property]
        virtual public string url { get; set; }

        [Property]
        virtual public bool asLink { get; set; }

        [Property]
        virtual public bool active { get; set; }

        [Property]
        virtual public string friendly_name { get; set; }

        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_categories", ColumnKey = "category_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places { get; set; }
     }
}
