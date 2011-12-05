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
    public class place_comments : ActiveRecordBase<place_comments>
    {
        private int comment_id;
        [PrimaryKey("comment_id")]
        virtual public int id
        {
            get { return comment_id; }
            set { comment_id = value; }
        }
        private string comments;
        [Property]
        virtual public string Comments
        {
            get { return comments; }
            set { comments = value; }
        }
        private bool publish;
        [Property]
        virtual public bool published
        {
            get { return publish; }
            set { publish = value; }
        }

        private bool flagged;
        [Property]
        virtual public bool Flagged
        {
            get { return flagged; }
            set { flagged = value; }
        }
        private int flagnumber;
        [Property]
        virtual public int FlagNumber
        {
            get { return flagnumber; }
            set { flagnumber = value; }
        }
        private bool adminread;
        [Property]
        virtual public bool adminRead
        {
            get { return adminread; }
            set { adminread = value; }
        }
        private DateTime createTime;
        [Property]
        virtual public DateTime CreateTime
        {
            get { return createTime; }
            set { createTime = value; }
        }
        private DateTime updateTime;
        [Property]
        virtual public DateTime UpdateTime
        {
            get { return updateTime; }
            set { updateTime = value; }
        }
        private bool deleted;
        [Property]
        virtual public bool Deleted
        {
            get { return deleted; }
            set { deleted = value; }
        }
        private string nid;
        [Property]
        virtual public string Nid
        {
            get { return nid; }
            set { nid = value; }
        }

        private string commentorname;
        [Property]
        virtual public string commentorName
        {
            get { return commentorname; }
            set { commentorname = value; }
        }
        private string email;
        [Property]
        virtual public string Email
        {
            get { return email; }
            set { email = value; }
        }
        private place Place;
        [BelongsTo]
        virtual public place place
        {
            get { return Place; }
            set { Place = value; }
        }
    }
}
