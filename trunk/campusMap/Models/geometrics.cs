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
using Microsoft.SqlServer.Types;
using System.IO;

namespace campusMap.Models
{

    [ActiveRecord(Lazy=true, BatchSize=30)]
    public class geometrics : ActiveRecordBase<geometrics>
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

        private byte[] Boundary;
        [Property(SqlType = "geography", ColumnType = "BinaryBlob")]
        //[Property]
        virtual public byte[] boundary
        {
            get { return Boundary; }
            set { Boundary = value; }
        }

        public static SqlGeography AsGeography( byte[] bytes)
        {
            SqlGeography geo = new SqlGeography();
            using (MemoryStream stream = new System.IO.MemoryStream(bytes))
            {
                using (BinaryReader rdr = new System.IO.BinaryReader(stream))
                {
                    geo.Read(rdr);
                }
            }

            return geo;
        }


        public static byte[] AsByteArray(SqlGeography geography)
        {
            if (geography == null)
                return null;

            using (MemoryStream stream = new System.IO.MemoryStream())
            {
                using (BinaryWriter writer = new System.IO.BinaryWriter(stream))
                {
                    geography.Write(writer);
                    return stream.ToArray();
                }
            }
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

        private status _status;
        [BelongsTo("status")]
        virtual public status status
        {
            get { return _status; }
            set { _status = value; }
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
        private IList<fields> Fields;
        [HasAndBelongsToMany(typeof(fields), Lazy = true, Table = "geometrics_to_fields", ColumnKey = "field_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<fields> field
        {
            get { return Fields; }
            set { Fields = value; }
        }



        private IList<styles> _style;
        [HasAndBelongsToMany(typeof(styles), Lazy = true, Table = "geometrics_to_style", ColumnKey = "style_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<styles> style
        {
            get { return _style; }
            set { _style = value; }
        }



        private IList<media_repo> images = new List<media_repo>();
        [HasAndBelongsToMany(typeof(media_repo), Lazy = true, BatchSize = 30, Table = "geometric_to_media", ColumnKey = "geometric_id", ColumnRef = "media_id", OrderBy = "geometric_order", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<media_repo> Images
        {
            get { return images; }
            set { images = value; }
        }


        private IList<authors> _authors = new List<authors>();
        [HasAndBelongsToMany(typeof(authors), Lazy = true, BatchSize = 30, Table = "authors_to_geometrics", ColumnKey = "geometric_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
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

        virtual public bool isPublished()
        {
            if (this.status == ActiveRecordBase<status>.Find(3) && this.publish_time != null && this.publish_time.Value.CompareTo(DateTime.Now) <= 0)
            {
                return true;
            }
            return false;
        }

        virtual public bool isCheckedOutNull()
        {
            bool flag = false;
            if (editing == null)
                flag = true;

            return flag;
        }




    }

    [ActiveRecord(Lazy = true, BatchSize = 5)]
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
        [HasAndBelongsToMany(typeof(geometrics), Lazy = true, Table = "geometrics_to_types", ColumnKey = "geometric_id", ColumnRef = "geometrics_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics> Geometrics
        {
            get { return geometrics; }
            set { geometrics = value; }
        }

        private IList<style_option_types> _ops;
        [HasAndBelongsToMany(typeof(style_option_types), Lazy = true, Table = "style_option_types_to_geometrics_to_types", ColumnKey = "geometrics_type_id", ColumnRef = "style_option_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<style_option_types> ops
        {
            get { return _ops; }
            set { _ops = value; }
        }


    }

    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class geometrics_media : ActiveRecordBase<geometrics_media>
    {
        private int id;
        [PrimaryKey]
        virtual public int Id
        {
            get { return id; }
            set { id = value; }
        }

        private geometrics Geometric;
        [BelongsTo("geometric_id")]
        virtual public geometrics geometric
        {
            get { return Geometric; }
            set { Geometric = value; }
        }
        private media_repo media;
        [BelongsTo("media_id")]
        virtual public media_repo Media
        {
            get { return media; }
            set { media = value; }
        }
        private int order;
        [Property]
        virtual public int geometric_order
        {
            get { return order; }
            set { order = value; }
        }
    }

    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class geometrics_status
    {
        private int id;
        [PrimaryKey]
        virtual public int Id
        {
            get { return id; }
            set { id = value; }
        }
        private String title;
        [Property]
        virtual public String Title
        {
            get { return title; }
            set { title = value; }
        }
    }

}

