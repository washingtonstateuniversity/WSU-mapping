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
    [ActiveRecord(Lazy=true)]
    public class zoom_levels : ActiveRecordBase<zoom_levels>
    {
        private int _id;
        [PrimaryKey("zoom_id")]
        virtual public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _start;
        [Property("zoom_start")]
        virtual public int start
        {
            get { return _start; }
            set { _start = value; }
        }
        private int _end;
        [Property("zoom_end")]
        virtual public int end
        {
            get { return _end; }
            set { _end = value; }
        }
        private IList<geometric_events> _events;
        [HasAndBelongsToMany(typeof(geometric_events), Lazy = true, Table = "geometric_events_to_zoom", ColumnKey = "zoom_id", ColumnRef = "geometric_event_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]//[Property]
        virtual public IList<geometric_events> events
        {
            get { return _events; }
            set { _events = value; }
        }
     }
}
