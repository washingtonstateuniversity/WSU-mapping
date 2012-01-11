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
    public class geometrics : ActiveRecordBase<place>
    {
        protected HelperService helperService = new HelperService();


        public geometrics() { }


        private int geometric_id;
        [PrimaryKey("geometric_id")]
        virtual public int id
        {
            get { return geometric_id; }
            set { geometric_id = value; }
        }
        /* private string Coordinate;
        [Property]
        virtual public string coordinate
        {
            get { return Coordinate; }
            set { Coordinate = value; }
        }*/

        private Byte[] Boundary;
        [Property(SqlType = "geography")]
        virtual public Byte[] boundary
        {
            get { return Boundary; }
            set { Boundary = value; }
        }
        private int Default_Type;
        [Property]
        virtual public int default_type
        {
            get { return Default_Type; }
            set { Default_Type = value; }
        }
        private DateTime? Publish_Time;
        [Property]
        virtual public DateTime? publish_time
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
        virtual public DateTime? creation_date
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
        virtual public DateTime? updated_date
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
        [BelongsTo("geometrics_status")]
        virtual public status status
        {
            get { return Status; }
            set { Status = value; }
        }


        private media_repo Media;
        [BelongsTo]
        virtual public media_repo media
        {
            get { return Media; }
            set { Media = value; }
        }





        private IList<tags> Tags = new List<tags>();
        [HasAndBelongsToMany(typeof(tags), Lazy = true, Table = "geometric_to_tags", ColumnKey = "geometric_id", ColumnRef = "tag_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<tags> tags
        {
            get { return Tags; }
            set { Tags = value; }
        }

        private IList<usertags> usertags = new List<usertags>();
        [HasAndBelongsToMany(typeof(usertags), Lazy = true, Table = "geometric_to_usertags", ColumnKey = "geometric_id", ColumnRef = "usertag_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<usertags> Usertags
        {
            get { return usertags; }
            set { usertags = value; }
        }
        private IList<geometrics_types> Geometric_Types = new List<geometrics_types>();
        [HasAndBelongsToMany(typeof(geometrics_types), Lazy = true, Table = "geometrics_to_types", ColumnKey = "geometric_id", ColumnRef = "geometrics_type_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics_types> geometric_types
        {
            get { return Geometric_Types; }
            set { Geometric_Types = value; }
        }
        private IList<place> places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_geometrics", ColumnKey = "place_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }

        private IList<field_types> Types;
        [HasAndBelongsToMany(typeof(field_types), Lazy = true, Table = "geometrics_to_field_types", ColumnKey = "field_type_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<field_types> field_types
        {
            get { return Types; }
            set { Types = value; }
        }

        private IList<fields> Fields;
        [HasAndBelongsToMany(typeof(fields), Lazy = true, Table = "geometrics_to_fields", ColumnKey = "field_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<fields> field
        {
            get { return Fields; }
            set { Fields = value; }
        }
        private IList<media_repo> images = new List<media_repo>();
        [HasAndBelongsToMany(typeof(media_repo), Lazy = true, BatchSize = 30, Table = "geometric_to_media", ColumnKey = "geometric_id", ColumnRef = "media_id", OrderBy = "geometric_order", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<media_repo> Images
        {
            get { return images; }
            set { images = value; }
        }


        private IList<authors> authors = new List<authors>();
        [HasAndBelongsToMany(typeof(authors), Lazy = true, BatchSize = 30, Table = "authors_to_geometrics", ColumnKey = "geometric_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<authors> Authors
        {
            get { return authors; }
            set { authors = value; }
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
        virtual public bool isPublished()
        {
            if (this.Status == ActiveRecordBase<status>.Find(3) && this.publish_time != null && this.publish_time.Value.CompareTo(DateTime.Now) <= 0)
            {
                return true;
            }
            return false;
        }

        virtual public bool isCheckedOutNull()
        {
            bool flag = false;
            if (checked_out_by == null)
                flag = true;

            return flag;
        }




    }
}

