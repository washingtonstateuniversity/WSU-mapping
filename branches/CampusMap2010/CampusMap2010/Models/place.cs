    using System;
    using System.Data;
    using System.Configuration;
    using System.Web;
    using System.Web.Security;
    using System.Web.UI;
    using System.Web.UI.WebControls;
    using System.Web.UI.WebControls.WebParts;
    using System.Web.UI.HtmlControls;
    using NHibernate.Criterion;
    using Castle.ActiveRecord;
    using System.Collections;
    using System.Collections.Generic;
    using System.Data.SqlTypes;
    using campusMap.Services;
    using Microsoft.SqlServer.Types;
    using System.Xml;
    using System.Text;
    using System.IO;


namespace campusMap.Models
{
    [ActiveRecord(Lazy = true, BatchSize=30)]
    public class place : ActiveRecordBase<place>
    {
        protected HelperService helperService = new HelperService();
        protected UserService userService = new UserService();
        public place() {  }

        private int place_id;
        [PrimaryKey("place_id")]
        virtual public int id
        {
            get { return place_id; }
            set { place_id = value; }
        }
        private string _infoTitle;
        [Property]
        virtual public string infoTitle
        {
            get { return _infoTitle; }
            set { _infoTitle = value; }
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


        public static SqlGeography AsGeography(byte[] bytes)
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
        virtual public string getLat()
        {
            SqlGeography spatial = place.AsGeography(this.coordinate);
            return spatial.Lat.ToString();
        }

        virtual public string getLong()
        {
            SqlGeography spatial = place.AsGeography(this.coordinate);
            return spatial.Long.ToString();
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

        private bool _outputError;
        [Property]
        virtual public bool outputError
        {
            get { return _outputError; }
            set { _outputError = value; }
        }
        private bool _isPublic;
        [Property]
        virtual public bool isPublic
        {
            get { return _isPublic; }
            set { _isPublic = value; }
        }
        private bool _hideTitles;
        [Property]
        virtual public bool hideTitles
        {
            get { return _hideTitles; }
            set { _hideTitles = value; }
        }
        private bool _autoAccessibility;
        [Property]
        virtual public bool autoAccessibility
        {
            get { return _autoAccessibility; }
            set { _autoAccessibility = value; }
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
        private string _staticMap;
        [Property]
        virtual public string staticMap
        {
            get { return _staticMap; }
            set { _staticMap = value; }
        }


        private campus _campus;
        [BelongsTo]
        virtual public campus campus
        {
            get { return _campus; }
            set { _campus = value; }
        }


        /*
                 private programs _program;
                [BelongsTo]
                virtual public programs program
                {
                    get { return _program; }
                    set { _program = value; }
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


               private departments _department;
                [BelongsTo]
                virtual public departments department
                {
                    get { return _department; }
                    set { _department = value; }
                }*/

        /**/
        private IList<schools> _school = new List<schools>();
        [HasAndBelongsToMany(typeof(schools), Lazy = true, Table = "place_to_schools", ColumnKey = "place_id", ColumnRef = "school_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<schools> schools
        {
            get { return _school; }
            set { _school = value; }
        }
        private IList<colleges> _college = new List<colleges>();
        [HasAndBelongsToMany(typeof(colleges), Lazy = true, Table = "place_to_colleges", ColumnKey = "place_id", ColumnRef = "college_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<colleges> colleges
        {
            get { return _college; }
            set { _college = value; }
        }
       /* private IList<campus> _campus = new List<campus>();
        [HasAndBelongsToMany(typeof(campus), Lazy = true, Table = "place_to_campus", ColumnKey = "place_id", ColumnRef = "campus_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<campus> campus
        {
            get { return _campus; }
            set { _campus = value; }
        }*/

        private IList<departments> _department = new List<departments>();
        [HasAndBelongsToMany(typeof(departments), Lazy = true, Table = "place_to_departments", ColumnKey = "place_id", ColumnRef = "department_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<departments> departments
        {
            get { return _department; }
            set { _department = value; }
        }
        private IList<admindepartments> _admindepartment = new List<admindepartments>();
        [HasAndBelongsToMany(typeof(admindepartments), Lazy = true, Table = "place_to_admindepartments", ColumnKey = "place_id", ColumnRef = "admindepartment_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<admindepartments> admindepartments
        {
            get { return _admindepartment; }
            set { _admindepartment = value; }
        }
        private IList<categories> _categories = new List<categories>();
        [HasAndBelongsToMany(typeof(categories), Lazy = true, Table = "place_to_categories", ColumnKey = "place_id", ColumnRef = "category_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<categories> categories
        {
            get { return _categories; }
            set { _categories = value; }
        }

        private IList<programs> _program = new List<programs>();
        [HasAndBelongsToMany(typeof(programs), Lazy = true, Table = "place_to_programs", ColumnKey = "place_id", ColumnRef = "program_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<programs> programs
        {
            get { return _program; }
            set { _program = value; }
        }
        private IList<map_views> _views;
        [HasAndBelongsToMany(typeof(map_views), Lazy = true, Table = "place_to_view", ColumnKey = "place_id", ColumnRef = "view_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<map_views> views
        {
            get { return _views; }
            set { _views = value; }
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

        private IList<infotabs> _infotabs = new List<infotabs>();
        [HasAndBelongsToMany(typeof(infotabs), Lazy = true, BatchSize = 5, Table = "place_to_infotabs", ColumnKey = "place_id", ColumnRef = "infotab_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<infotabs> infotabs
        {
            get { return _infotabs; }
            set { _infotabs = value; }
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

        private IList<geometrics> _geometrics;
        [HasAndBelongsToMany(typeof(geometrics), Lazy = true, Table = "place_to_geometrics", ColumnKey = "place_id", ColumnRef = "geometric_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics> geometrics
        {
            get { return _geometrics; }
            set { _geometrics = value; }
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

    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class place_types : json_autocomplete<place_types>, campusMap.Models.Ijson_autocomplete
    {
        private int place_type_id;
        [PrimaryKey("place_type_id")]
        virtual public int id
        {
            get { return place_type_id; }
            set { place_type_id = value; }
        }
        private string _name;
        [Property]
        virtual public string name
        {
            get { return _name; }
            set { _name = value; }
        }
        private string _friendly;
        [Property("friendly_name")]
        virtual public string friendly
        {
            get { return _friendly; }
            set { _friendly = value; }
        }
        private IList<place> _places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_place_types", ColumnKey = "place_type_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> places
        {
            get { return _places; }
            set { _places = value; }
        }
        private IList<google_types> _type;
        [HasAndBelongsToMany(typeof(google_types), Lazy = true, Table = "google_types_to_place_types", ColumnKey = "google_type_id", ColumnRef = "place_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<google_types> google_type
        {
            get { return _type; }
            set { _type = value; }
        }
    }

    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class google_types : json_autocomplete<google_types>, campusMap.Models.Ijson_autocomplete
    {
        private int google_type_id;
        [PrimaryKey("google_type_id")]
        virtual public int id
        {
            get { return google_type_id; }
            set { google_type_id = value; }
        }

        private string Name;
        [Property]
        virtual public string name
        {
            get { return Name; }
            set { Name = value; }
        }
        private IList<place_types> _type;
        [HasAndBelongsToMany(typeof(place_types), Lazy = true, Table = "google_types_to_place_types", ColumnKey = "google_type_id", ColumnRef = "place_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place_types> place_type
        {
            get { return _type; }
            set { _type = value; }
        }

    }

    [ActiveRecord(Lazy = true, BatchSize = 3)]
    public class place_status
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

    [ActiveRecord(Lazy = true)]
    public class place_names
    {
        private int name_id;
        [PrimaryKey("name_id")]
        virtual public int id
        {
            get { return name_id; }
            set { name_id = value; }
        }
        private int Place_Id;
        [Property]
        virtual public int place_id
        {
            get { return Place_Id; }
            set { Place_Id = value; }
        }
        private String Name;
        [Property]
        virtual public String name
        {
            get { return Name; }
            set { Name = value; }
        }
        private place_name_types _label;
        [BelongsTo]
        virtual public place_name_types label
        {
            get { return _label; }
            set { _label = value; }
        }
    }

    [ActiveRecord(Lazy = true)]
    public class place_name_types
    {
        private int type_id;
        [PrimaryKey("type_id")]
        virtual public int id
        {
            get { return type_id; }
            set { type_id = value; }
        }
        private string _type;
        [Property]
        virtual public string type
        {
            get { return _type; }
            set { _type = value; }
        }
    }

    [ActiveRecord(Lazy = true)]
    public class place_models : json_autocomplete<place_models>, campusMap.Models.Ijson_autocomplete
    {
        private int place_model_id;
        [PrimaryKey("place_model_id")]
        virtual public int id
        {
            get { return place_model_id; }
            set { place_model_id = value; }
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
        private IList<place> places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_place_models", ColumnKey = "place_model_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }

    }

    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class place_media : ActiveRecordBase<place_media>
    {
        private int id;
        [PrimaryKey]
        virtual public int Id
        {
            get { return id; }
            set { id = value; }
        }

        private place place;
        [BelongsTo("place_id")]
        virtual public place Place
        {
            get { return place; }
            set { place = value; }
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
        virtual public int place_order
        {
            get { return order; }
            set { order = value; }
        }
    }

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

