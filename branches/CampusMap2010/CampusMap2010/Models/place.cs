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


namespace campusMap.Models {
    [ActiveRecord(Lazy = true, BatchSize = 30)]
    public class place : publish_base {
        protected HelperService helperService = new HelperService();
        protected UserService userService = new UserService();
        public place() { }

        [PrimaryKey("place_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string infoTitle { get; set; }

        [Property]
        virtual public string prime_name { get; set; }

        [Property]
        virtual public string abbrev_name { get; set; }

        [Property]
        virtual public string summary { get; set; }

        [Property]
        virtual public string details { get; set; }

        [Property]
        virtual public string address { get; set; }

        [Property]
        virtual public string street { get; set; }

        [Property(SqlType = "geography")]
        virtual public Byte[] coordinate { get; set; }

        public static SqlGeography AsGeography(byte[] bytes) {
            SqlGeography geo = new SqlGeography();
            using (MemoryStream stream = new System.IO.MemoryStream(bytes)) {
                using (BinaryReader rdr = new System.IO.BinaryReader(stream)) {
                    geo.Read(rdr);
                }
            }

            return geo;
        }
        virtual public string getLat() {
            SqlGeography spatial = place.AsGeography(this.coordinate);
            return spatial.Lat.ToString();
        }

        virtual public string getLong() {
            SqlGeography spatial = place.AsGeography(this.coordinate);
            return spatial.Long.ToString();
        }


        [Property(SqlType = "tinyint")]
        virtual public int plus_four_code { get; set; }

        [Property]
        virtual public bool hideTitles { get; set; }

        [Property]
        virtual public bool autoAccessibility { get; set; }

        private IList<place_names> place_names = new List<place_names>();
        [HasAndBelongsToMany(typeof(place_names), Lazy = true, Table = "place_to_place_names", ColumnKey = "place_id", ColumnRef = "name_id", NotFoundBehaviour = NotFoundBehaviour.Ignore, Cascade = ManyRelationCascadeEnum.AllDeleteOrphan)]
        virtual public IList<place_names> names {
            get { return place_names; }
            set { place_names = value; }
        }
        private IList<place_types> Place_Types = new List<place_types>();
        [HasAndBelongsToMany(typeof(place_types), Lazy = true, Table = "place_to_place_types", ColumnKey = "place_id", ColumnRef = "place_type_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place_types> place_types {
            get { return Place_Types; }
            set { Place_Types = value; }
        }

        [BelongsTo]
        virtual public place_models model { get; set; }


        [BelongsTo]
        virtual public media_repo media { get; set; }

        [Property]
        virtual public string staticMap { get; set; }

        [BelongsTo]
        virtual public campus campus { get; set; }

        private IList<schools> _school = new List<schools>();
        [HasAndBelongsToMany(typeof(schools), Lazy = true, Table = "place_to_schools", ColumnKey = "place_id", ColumnRef = "school_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<schools> schools {
            get { return _school; }
            set { _school = value; }
        }
        private IList<colleges> _college = new List<colleges>();
        [HasAndBelongsToMany(typeof(colleges), Lazy = true, Table = "place_to_colleges", ColumnKey = "place_id", ColumnRef = "college_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<colleges> colleges {
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
        virtual public IList<departments> departments {
            get { return _department; }
            set { _department = value; }
        }
        private IList<admindepartments> _admindepartment = new List<admindepartments>();
        [HasAndBelongsToMany(typeof(admindepartments), Lazy = true, Table = "place_to_admindepartments", ColumnKey = "place_id", ColumnRef = "admindepartment_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<admindepartments> admindepartments {
            get { return _admindepartment; }
            set { _admindepartment = value; }
        }
        private IList<categories> _categories = new List<categories>();
        [HasAndBelongsToMany(typeof(categories), Lazy = true, Table = "place_to_categories", ColumnKey = "place_id", ColumnRef = "category_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<categories> categories {
            get { return _categories; }
            set { _categories = value; }
        }

        private IList<programs> _program = new List<programs>();
        [HasAndBelongsToMany(typeof(programs), Lazy = true, Table = "place_to_programs", ColumnKey = "place_id", ColumnRef = "program_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<programs> programs {
            get { return _program; }
            set { _program = value; }
        }
        private IList<map_views> _views;
        [HasAndBelongsToMany(typeof(map_views), Lazy = true, Table = "place_to_view", ColumnKey = "place_id", ColumnRef = "view_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<map_views> views {
            get { return _views; }
            set { _views = value; }
        }





        private IList<fields> Fields;
        [HasAndBelongsToMany(typeof(fields), Lazy = true, Table = "place_to_fields", ColumnKey = "place_id", ColumnRef = "field_id", NotFoundBehaviour = NotFoundBehaviour.Ignore, Cascade = ManyRelationCascadeEnum.AllDeleteOrphan)]
        virtual public IList<fields> field {
            get { return Fields; }
            set { Fields = value; }
        }


        private IList<tags> Tags = new List<tags>();
        [HasAndBelongsToMany(typeof(tags), Lazy = true, Table = "place_to_tags", ColumnKey = "place_id", ColumnRef = "tag_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<tags> tags {
            get { return Tags; }
            set { Tags = value; }
        }

        private IList<usertags> _usertags = new List<usertags>();
        [HasAndBelongsToMany(typeof(usertags), Lazy = true, Table = "place_to_usertags", ColumnKey = "place_id", ColumnRef = "usertag_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<usertags> usertags {
            get { return _usertags; }
            set { _usertags = value; }
        }


        private IList<media_repo> images = new List<media_repo>();
        [HasAndBelongsToMany(typeof(media_repo), Lazy = true, BatchSize = 30, Table = "place_media", ColumnKey = "place_id", ColumnRef = "media_id", OrderBy = "place_order", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<media_repo> Images {
            get { return images; }
            set { images = value; }
        }
        private IList<comments> Comments = new List<comments>();
        [HasMany(typeof(comments), Lazy = true, Table = "place_to_comments", ColumnKey = "place_id", Cascade = ManyRelationCascadeEnum.AllDeleteOrphan, Inverse = true)]
        virtual public IList<comments> comments {
            get { return Comments; }
            set { Comments = value; }
        }
        private IList<comments> Pub_comments = new List<comments>();
        [HasMany(typeof(comments), Lazy = true, Table = "place_to_comments", ColumnKey = "place_id", Where = "published=1", Cascade = ManyRelationCascadeEnum.None)]
        virtual public IList<comments> comments_pub {
            get { return Pub_comments; }
            set { Pub_comments = value; }
        }

        private IList<infotabs> _infotabs = new List<infotabs>();
        [HasAndBelongsToMany(typeof(infotabs), Lazy = true, BatchSize = 5, Table = "place_to_infotabs", ColumnKey = "place_id", ColumnRef = "infotab_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<infotabs> infotabs {
            get { return _infotabs; }
            set { _infotabs = value; }
        }

        private IList<users> _authors = new List<users>();
        [HasAndBelongsToMany(typeof(users), Lazy = true, BatchSize = 30, Table = "authors_to_place", ColumnKey = "place_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<users> authors {
            get { return _authors; }
            set { _authors = value; }
        }

        private IList<geometrics> _geometrics;
        [HasAndBelongsToMany(typeof(geometrics), Lazy = true, Table = "place_to_geometrics", ColumnKey = "place_id", ColumnRef = "geometric_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics> geometrics {
            get { return _geometrics; }
            set { _geometrics = value; }
        }
        virtual public IList<media_repo> getRestOfImages(media_repo currentimage) {
            IList<media_repo> tempImages = new List<media_repo>();

            for (int i = 0; i < this.images.Count; i++) {
                if (this.images[i] != currentimage)
                    tempImages.Add(this.images[i]);
            }

            return tempImages;

        }
    }

    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class place_types : json_autocomplete<place_types>, campusMap.Models.Ijson_autocomplete {

        [PrimaryKey("place_type_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string name { get; set; }

        [Property("friendly_name")]
        virtual public string friendly { get; set; }

        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_place_types", ColumnKey = "place_type_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> places { get; set; }

        [HasAndBelongsToMany(typeof(google_types), Lazy = true, Table = "google_types_to_place_types", ColumnKey = "google_type_id", ColumnRef = "place_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<google_types> google_type { get; set; }

    }

    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class google_types : json_autocomplete<google_types>, campusMap.Models.Ijson_autocomplete {

        [PrimaryKey("google_type_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string name { get; set; }

        [HasAndBelongsToMany(typeof(place_types), Lazy = true, Table = "google_types_to_place_types", ColumnKey = "google_type_id", ColumnRef = "place_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place_types> place_type { get; set; }

    }

    [ActiveRecord(Lazy = true, BatchSize = 3)]
    public class place_status {

        [PrimaryKey]
        virtual public int Id { get; set; }

        [Property]
        virtual public String Title { get; set; }

    }

    [ActiveRecord(Lazy = true)]
    public class place_names {

        [PrimaryKey("name_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public int place_id { get; set; }

        [Property]
        virtual public String name { get; set; }

        [BelongsTo]
        virtual public place_name_types label { get; set; }

    }

    [ActiveRecord(Lazy = true)]
    public class place_name_types {

        [PrimaryKey("type_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string type { get; set; }

    }

    [ActiveRecord(Lazy = true)]
    public class place_models : json_autocomplete<place_models>, campusMap.Models.Ijson_autocomplete {

        [PrimaryKey("place_model_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public string attr { get; set; }

        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_place_models", ColumnKey = "place_model_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places { get; set; }

    }

    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class place_media : ActiveRecordBase<place_media> {
        private int id;
        [PrimaryKey]
        virtual public int Id { get; set; }

        [BelongsTo("place_id")]
        virtual public place Place { get; set; }

        [BelongsTo("media_id")]
        virtual public media_repo Media { get; set; }

        [Property]
        virtual public int place_order { get; set; }

    }

    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class place_comments : ActiveRecordBase<place_comments> {

        [PrimaryKey("comment_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string Comments { get; set; }

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

