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
    public class comments : ActiveRecordBase<comments>
    {
        [PrimaryKey("comment_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string comment { get; set; }

        [Property]
        virtual public string censored { get; set; }

        [Property]
        virtual public bool published { get; set; }

        [Property]
        virtual public bool Flagged { get; set; }

        [Property]
        virtual public int FlagNumber { get; set; }

        [Property]
        virtual public bool adminRead { get; set; }

        [Property]
        virtual public DateTime CreateTime { get; set; }

        [Property]
        virtual public DateTime UpdateTime { get; set; }

        [Property]
        virtual public bool Deleted { get; set; }

        [Property]
        virtual public string Nid { get; set; }

        [Property]
        virtual public string commentorName { get; set; }

        [Property]
        virtual public string Email { get; set; }

        [BelongsTo]
        virtual public place place { get; set; }
    }
}
