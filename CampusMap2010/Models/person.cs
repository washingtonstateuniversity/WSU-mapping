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
using NHibernate.Exceptions;
using System.Collections.Generic;

namespace campusMap.Models
{
    [ActiveRecord(Lazy=true)]
    public class person : ActiveRecordBase<person>
    {
        private int id;
        [PrimaryKey] 
        virtual public int Id
        {
            get { return id; }
            set { id = value; }
        }
        private string name;
        [Property]
        virtual public string Name
        {
            get { return name; }
            set { name = value; }
        }
        private string email;
        [Property]
        virtual public string Email
        {
            get { return email; }
            set { email = value; }
        }
        private string phone;
        [Property]
        virtual public string Phone
        {
            get { return phone; }
            set { phone = value; }
        }
        private string position;
        [Property]
        virtual public string Position
        {
            get { return position; }
            set { position = value; }
        }
        private bool deleted;
        [Property]
        virtual public bool Deleted
        {
            get { return deleted; }
            set { deleted = value; }
        }

        private bool breakingnews;
        [Property]
        virtual public bool BreakingNews
        {
            get { return breakingnews; }
            set { breakingnews = value; }
        }
        private bool newsletter;
        [Property]
        virtual public bool Newsletter
        {
            get { return newsletter; }
            set { newsletter = value; }
        }

        private user_groups accesslevelStatus;
        [BelongsTo]
        virtual public user_groups AccessLevelStatus
        {
            get { return accesslevelStatus; }
            set { accesslevelStatus = value; }
        }
        private String nid;
        [Property]
        virtual public String Nid
        {
            get { return nid; }
            set { nid = value; }
        }

        private person_types personType;
        [BelongsTo("personTypeId")]
        virtual public person_types PersonType
        {
            get { return personType; }
            set { personType = value; }
        }
    }

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
