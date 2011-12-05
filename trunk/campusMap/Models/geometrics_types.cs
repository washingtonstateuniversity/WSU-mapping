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
using System.Collections.Generic;
using System.Collections;

namespace campusMap.Models
{
    [ActiveRecord(Lazy=true)]
    public class geometrics_types : ActiveRecordBase<geometrics_types>
    {
        private int geometrics_type_id;
        [PrimaryKey("geometrics_type_id")]
        virtual public int id
        {
            get { return geometrics_type_id; }
            set { geometrics_type_id = value; }
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
        private IList<geometrics> geometrics;
        [HasAndBelongsToMany(typeof(geometrics), Lazy = true, Table = "geometrics_to_types", ColumnKey = "geometrics_id", ColumnRef = "geometrics_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics> Geometrics
        {
            get { return geometrics; }
            set { geometrics = value; }
        }

    }
}
