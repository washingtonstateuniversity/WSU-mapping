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
    public class place : ActiveRecordBase<place>
    {
        protected HelperService helperService = new HelperService();


        public place() {  }

        private int place_id;
        [PrimaryKey("place_id")]
        virtual public int id
        {
            get { return place_id; }
            set { place_id = value; }
        }

        private string Prime_Name;
        [Property]
        virtual public string prime_name
        {
            get { return Prime_Name; }
            set { Prime_Name = value; }
        }

        private string Abbrev_Name;
        [Property]
        virtual public string abbrev_name
        {
            get { return Abbrev_Name; }
            set { Abbrev_Name = value; }
        }

        private string _summary;
        [Property]
        virtual public string summary
        {
            get { return _summary; }
            set { _summary = value; }
        }

        private string _details;
        [Property]
        virtual public string details
        {
            get { return _details; }
            set { _details = value; }
        }
        

        private string _address;
        [Property]
        virtual public string address
        {
            get { return _address; }
            set { _address = value; }
        }
        private string _street;
        [Property]
        virtual public string street
        {
            get { return _street; }
            set { _street = value; }
        }


        private Byte[] Coordinate;
        [Property(SqlType = "geography")]
        virtual public Byte[] coordinate
        {
            get { return Coordinate; }
            set { Coordinate = value; }
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


        private int Plus_Four_Code;
        [Property(SqlType = "tinyint")]
        virtual public int plus_four_code
        {
            get { return Plus_Four_Code; }
            set { Plus_Four_Code = value; }
        }


        private bool Tmp;
        virtual public bool tmp
        {
            get { return Tmp; }
            set { Tmp = value; }
        }


        private IList<place_names> place_names = new List<place_names>();
        [HasAndBelongsToMany(typeof(place_names), Lazy = true, Table = "place_to_place_names", ColumnKey = "place_id", ColumnRef = "name_id", NotFoundBehaviour = NotFoundBehaviour.Ignore, Cascade = ManyRelationCascadeEnum.AllDeleteOrphan)]
        virtual public IList<place_names> names
        {
            get { return place_names; }
            set { place_names = value; }
        }



        private IList<place_types> Place_Types = new List<place_types>();
        [HasAndBelongsToMany(typeof(place_types), Lazy = true, Table = "place_to_place_types", ColumnKey = "place_id", ColumnRef = "place_type_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place_types> place_types
        {
            get { return Place_Types; }
            set { Place_Types = value; }
        }


        private place_models place_model;
        [BelongsTo]
        virtual public place_models model
        {
            get { return place_model; }
            set { place_model = value; }
        }

        private status _status;
        [BelongsTo("status")]
        virtual public status status
        {
            get { return _status; }
            set { _status = value; }
        }
        virtual public bool isPublished()
        {
            if (this.status == ActiveRecordBase<status>.Find(3) && this.publish_time != null && this.publish_time.Value.CompareTo(DateTime.Now) <= 0)
            {
                return true;
            }
            return false;
        }



        private media_repo Media;
        [BelongsTo]
        virtual public media_repo media
        {
            get { return Media; }
            set { Media = value; }
        }



        private schools _school;
        [BelongsTo]
        virtual public schools school
        {
            get { return _school; }
            set { _school = value; }
        }
        private colleges _college;
        [BelongsTo]
        virtual public colleges college
        {
            get { return _college; }
            set { _college = value; }
        }
        private campus _campus;
        [BelongsTo]
        virtual public campus campus
        {
            get { return _campus; }
            set { _campus = value; }
        }
        private programs _program;
        [BelongsTo]
        virtual public programs program
        {
            get { return _program; }
            set { _program = value; }
        }
        private departments _department;
        [BelongsTo]
        virtual public departments department
        {
            get { return _department; }
            set { _department = value; }
        }


        private IList<fields> Fields;
        [HasAndBelongsToMany(typeof(fields), Lazy = true, Table = "place_to_fields", ColumnKey = "place_id", ColumnRef = "field_id", NotFoundBehaviour = NotFoundBehaviour.Ignore, Cascade = ManyRelationCascadeEnum.AllDeleteOrphan)]
        virtual public IList<fields> field
        {
            get { return Fields; }
            set { Fields = value; }
        }


        private IList<tags> Tags = new List<tags>();
        [HasAndBelongsToMany(typeof(tags), Lazy = true, Table = "place_to_tags", ColumnKey = "place_id", ColumnRef = "tag_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<tags> tags
        {
            get { return Tags; }
            set { Tags = value; }
        }

        private IList<usertags> _usertags = new List<usertags>();
        [HasAndBelongsToMany(typeof(usertags), Lazy = true, Table = "place_to_usertags", ColumnKey = "place_id", ColumnRef = "usertag_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<usertags> usertags
        {
            get { return _usertags; }
            set { _usertags = value; }
        }


        private IList<media_repo> images = new List<media_repo>();
        [HasAndBelongsToMany(typeof(media_repo), Lazy = true, BatchSize = 30, Table = "place_media", ColumnKey = "place_id", ColumnRef = "media_id", OrderBy = "place_order", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<media_repo> Images
        {
            get { return images; }
            set { images = value; }
        }
        private IList<comments> Comments = new List<comments>();
        [HasMany(typeof(comments), Lazy = true, Table = "place_to_comments", ColumnKey = "place_id", Cascade = ManyRelationCascadeEnum.AllDeleteOrphan, Inverse = true)]
        virtual public IList<comments> comments
        {
            get { return Comments; }
            set { Comments = value; }
        }
        private IList<comments> Pub_comments = new List<comments>();
        [HasMany(typeof(comments), Lazy = true, Table = "place_to_comments", ColumnKey = "place_id", Where = "published=1", Cascade = ManyRelationCascadeEnum.None)]
        virtual public IList<comments> comments_pub
        {
            get { return Pub_comments; }
            set { Pub_comments = value; }
        }

        private IList<authors> _authors = new List<authors>();
        [HasAndBelongsToMany(typeof(authors), Lazy = true, BatchSize = 30, Table = "authors_to_place", ColumnKey = "place_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<authors> Authors
        {
            get { return _authors; }
            set { _authors = value; }
        }
        private authors _editing;
        [BelongsTo("author_editing")]
        virtual public authors editing
        {
            get { return _editing; }
            set { _editing = value; }
        }


        virtual public bool isCheckedOutNull()
        {
            bool flag = false;
            if (this.editing == null)
                flag = true ;
          
            return flag; 
        }
       
        virtual public IList<media_repo> getRestOfImages(media_repo currentimage)
        {
            IList<media_repo> tempImages = new List<media_repo>();

            for (int i = 0; i < this.images.Count; i++)
            {   
                if (this.images[i] != currentimage) 
                tempImages.Add(this.images[i]); 
            }
                       
           return tempImages ;
               
        }
    }
}

