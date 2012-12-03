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

namespace campusMap.Models {
    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class infotabs : ActiveRecordBase<infotabs> {
        private int infotab_id;
        [PrimaryKey("infotab_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string content { get; set; }

        [Property]
        virtual public string title { get; set; }

        [Property]
        virtual public int sort { get; set; }

        [BelongsTo]
        virtual public infotabs_templates template { get; set; }


        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_infotabs", ColumnKey = "infotab_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> places { get; set; }

    }
    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class infotabs_templates : publish_base {
        private int template_id;
        [PrimaryKey("template_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public string alias { get; set; }

        [Property]
        virtual public string content { get; set; }

        [Property]
        virtual public bool process { get; set; }

        [HasAndBelongsToMany(typeof(infotabs), Lazy = true, Table = "infotabs_to_infotabs_templates", ColumnKey = "infotab_id", ColumnRef = "template_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<infotabs> infotabs { get; set; }

    }
}
