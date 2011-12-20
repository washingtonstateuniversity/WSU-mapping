using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using NHibernate.Expression;
using Castle.ActiveRecord;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlTypes;
using campusMap.Services;

namespace campusMap.Models
{
    [ActiveRecord(Lazy=true, BatchSize=30)]
    public class map_views : ActiveRecordBase<map_views>
    {
        protected HelperService helperService = new HelperService();


        public map_views() {  }

        private int view_id;
        [PrimaryKey("view_id")]
        virtual public int id
        {
            get { return view_id; }
            set { view_id = value; }
        }

        private string Name;
        [Property]
        virtual public string name
        {
            get { return Name; }
            set { Name = value; }
        }

        private string Cache_Path;
        [Property("cache_path")]
        virtual public string cache
        {
            get { return Cache_Path; }
            set { Cache_Path = value; }
        }

        private bool Commentable;
        [Property]
        virtual public bool commentable
        {
            get { return Commentable; }
            set { Commentable = value; }
        }
        private bool Sharable;
        [Property]
        virtual public bool sharable
        {
            get { return Sharable; }
            set { Sharable = value; }
        }
        private int Width;
        [Property(SqlType = "tinyint")]
        virtual public int width
        {
            get { return Width; }
            set { Width = value; }
        }
        private int Height;
        [Property(SqlType = "tinyint")]
        virtual public int height
        {
            get { return Height; }
            set { Height = value; }
        }

        private IList<authors> Authors = new List<authors>();
        [HasAndBelongsToMany(typeof(authors), Lazy = true, BatchSize = 30, Table = "authors_to_view", ColumnKey = "view_id", ColumnRef = "authors_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<authors> authors
        {
            get { return Authors; }
            set { Authors = value; }
        }

        private Byte[] Center;
        [Property(SqlType = "geography")]
        virtual public Byte[] center
        {
            get { return Center; }
            set { Center = value; }
        }

        private DateTime? Publish_Time;
        [Property]
        virtual public DateTime? published
        {
            get { return Publish_Time; }
            set
            {
                //DateTime bla = DateTime.MinValue;
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue))
                {
                    // bla is a valid sql datetime
                    Publish_Time = value;

                }
            }
        }
        private DateTime? Creation_Date;
        [Property]
        virtual public DateTime? created
        {
            get { return Creation_Date; }
            set
            {
                //DateTime bla = DateTime.MinValue;
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue))
                {
                    // bla is a valid sql datetime
                    Creation_Date = value;

                }
            }
        }
        private DateTime? Updated_Date;
        [Property]
        virtual public DateTime? updated
        {
            get { return Updated_Date; }
            set
            {
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue))
                {
                    // bla is a valid sql datetime
                    Updated_Date = value;

                }
            }
        }





        private status Status;
        [BelongsTo("view_status")]
        virtual public status status
        {
            get { return Status; }
            set { Status = value; }
        }


        private IList<tags> Tags = new List<tags>();
        [HasAndBelongsToMany(typeof(tags), Lazy = true, Table = "view_to_tags", ColumnKey = "view_id", ColumnRef = "tag_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<tags> tags
        {
            get { return Tags; }
            set { Tags = value; }
        }

        private IList<usertags> usertags = new List<usertags>();
        [HasAndBelongsToMany(typeof(usertags), Lazy = true, Table = "view_to_usertags", ColumnKey = "view_id", ColumnRef = "usertag_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<usertags> Usertags
        {
            get { return usertags; }
            set { usertags = value; }
        }    
        private IList<comments> Comments = new List<comments>();
        [HasMany(typeof(comments), Lazy = true, Table = "view_to_comments", ColumnKey = "view_id", Cascade = ManyRelationCascadeEnum.AllDeleteOrphan, Inverse = true)]
        virtual public IList<comments> comments
        {
            get { return Comments; }
            set { Comments = value; }
        }

        private authors author_editing;
        [BelongsTo("authors_editing")]
        virtual public authors editing
        {
            get { return author_editing; }
            set { author_editing = value; }
        }

        private String checked_out;
        [Property]
        virtual public String checked_out_by
        {
            get { return checked_out; }
            set { checked_out = value; }
        }
        private IList<comments> Pub_comments = new List<comments>();
        [HasMany(typeof(comments), Lazy = true, Table = "view_to_comments", ColumnKey = "view_id", Where = "published=1", Cascade = ManyRelationCascadeEnum.None)]
        virtual public IList<comments> comments_pub
        {
            get { return Pub_comments; }
            set { Pub_comments = value; }
        }

        private IList<field_types> Types;
        [HasAndBelongsToMany(typeof(field_types), Lazy = true, Table = "view_to_field_types", ColumnKey = "field_type_id", ColumnRef = "view_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<field_types> field_types
        {
            get { return Types; }
            set { Types = value; }
        }

        private IList<fields> Fields;
        [HasAndBelongsToMany(typeof(fields), Lazy = true, Table = "view_to_fields", ColumnKey = "field_id", ColumnRef = "view_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<fields> field
        {
            get { return Fields; }
            set { Fields = value; }
        }     







        virtual public bool isPublished()
        {
            if (this.Status == ActiveRecordBase<status>.Find(3) && this.published != null && this.published.Value.CompareTo(DateTime.Now) <= 0)
            {
                return true;
            }
            return false;
        }

        virtual public bool isCheckedOutNull()
        {
            bool flag = false;
            if (checked_out_by == null)
                flag = true ;
          
            return flag; 
        }
    }
}

