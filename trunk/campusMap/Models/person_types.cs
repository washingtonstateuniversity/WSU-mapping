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

namespace campusMap.Models
{
    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class person_types : ActiveRecordBase<person_types>
    {
        private int id;
        [PrimaryKey]
        virtual public int Id
        {
            get { return id; }
            set { id = value; }
        }
        private string Name;
        [Property]
        virtual public string name
        {
            get { return Name; }
            set { Name = value; }
        }
        private bool deleted;

        [Property]
        virtual public bool Deleted
        {
            get { return deleted; }
            set { deleted = value; }
        }
        private string Attr;
        [Property]
        virtual public string attr
        {
            get { return Attr; }
            set { Attr = value; }
        }
    }
}
