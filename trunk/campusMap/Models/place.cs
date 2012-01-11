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
        private string Street_Address;
        [Property]
        virtual public string street_address
        {
            get { return Street_Address; }
            set { Street_Address = value; }
        }

        private IList<authors> authors = new List<authors>();
        [HasAndBelongsToMany(typeof(authors), Lazy = true, BatchSize = 30, Table = "authors_place", ColumnKey = "place_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<authors> Authors
        {
            get { return authors; }
            set { authors = value; }
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


        private IList<place_names> place_names = new List<place_names>();
        [HasAndBelongsToMany(typeof(place_names), Lazy = true, Table = "place_to_place_names", ColumnKey = "place_id", ColumnRef = "name_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
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

        private IList<place_models> Place_models = new List<place_models>();
        [HasAndBelongsToMany(typeof(place_models), Lazy = true, Table = "place_to_place_models", ColumnKey = "place_id", ColumnRef = "place_model_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place_models> place_models
        {
            get { return Place_models; }
            set { Place_models = value; }
        }

        
        private status Status;
        [BelongsTo("place_status")]
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

        private IList<field_types> Types;
        [HasAndBelongsToMany(typeof(field_types), Lazy = true, Table = "place_to_field_types", ColumnKey = "field_type_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<field_types> field_types
        {
            get { return Types; }
            set { Types = value; }
        }



        private IList<fields> Fields;
        [HasAndBelongsToMany(typeof(fields), Lazy = true, Table = "place_to_fields", ColumnKey = "field_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
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

        private IList<usertags> usertags = new List<usertags>();
        [HasAndBelongsToMany(typeof(usertags), Lazy = true, Table = "place_to_usertags", ColumnKey = "place_id", ColumnRef = "usertag_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<usertags> Usertags
        {
            get { return usertags; }
            set { usertags = value; }
        }


        private IList<media_repo> images = new List<media_repo>();
        [HasAndBelongsToMany(typeof(media_repo), Lazy = true, BatchSize = 30, Table = "place_to_media", ColumnKey = "place_id", ColumnRef = "media_id", OrderBy = "placeOrder", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
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
        [HasMany(typeof(comments), Lazy = true, Table = "place_to_comments", ColumnKey = "place_id", Where = "published=1", Cascade = ManyRelationCascadeEnum.None)]
        virtual public IList<comments> comments_pub
        {
            get { return Pub_comments; }
            set { Pub_comments = value; }
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

