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
    public class map_views : ActiveRecordBase<map_views> {
        protected HelperService helperService = new HelperService();
        public map_views() { }

        private int view_id;
        [PrimaryKey("view_id")]
        virtual public int id {
            get { return view_id; }
            set { view_id = value; }
        }
        private string Name;
        [Property]
        virtual public string name {
            get { return Name; }
            set { Name = value; }
        }
        private string _alias;
        [Property]
        virtual public string alias {
            get { return _alias; }
            set { _alias = value; }
        }
        private string _key;
        [Property("idkey")]
        virtual public string key {
            get { return _key; }
            set { _key = value; }
        }
        private string Cache_Path;
        [Property("cache_path")]
        virtual public string cache {
            get { return Cache_Path; }
            set { Cache_Path = value; }
        }


        private bool _show_global_nav;
        [Property]
        virtual public bool show_global_nav {
            get { return _show_global_nav; }
            set { _show_global_nav = value; }
        }

        private bool _commentable;
        [Property]
        virtual public bool commentable {
            get { return _commentable; }
            set { _commentable = value; }
        }
        private bool _sharable;
        [Property]
        virtual public bool sharable {
            get { return _sharable; }
            set { _sharable = value; }
        }
        private int _width;
        [Property]
        virtual public int width {
            get { return _width; }
            set { _width = value; }
        }
        private int _height;
        [Property]
        virtual public int height {
            get { return _height; }
            set { _height = value; }
        }

        private IList<users> _authors = new List<users>();
        [HasAndBelongsToMany(typeof(users), Lazy = true, BatchSize = 30, Table = "authors_to_view", ColumnKey = "view_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<users> authors {
            get { return _authors; }
            set { _authors = value; }
        }

        private Byte[] _center;
        [Property(SqlType = "geography")]
        virtual public Byte[] center {
            get { return _center; }
            set { _center = value; }
        }
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
            // the point of these ifs are to make 100% sure that even if all the 
            // other checks failed we still have something to pass over less null
            if (this.center != null) {
                SqlGeography spatial = map_views.AsGeography(this.center);
                return spatial.Lat.ToString();
            } else {
                return UserService.getUserCoreCampus(true).latitude.ToString();
            }
        }

        virtual public string getLong() {
            if (this.center != null) {
                SqlGeography spatial = map_views.AsGeography(this.center);
                return spatial.Long.ToString();
            } else {
                return UserService.getUserCoreCampus(true).longitude.ToString();
            }


        }
        private DateTime? Publish_Time;
        [Property]
        virtual public DateTime? published {
            get { return Publish_Time; }
            set {
                //DateTime bla = DateTime.MinValue;
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue)) {
                    // bla is a valid sql datetime
                    Publish_Time = value;

                }
            }
        }
        private DateTime? Creation_Date;
        [Property]
        virtual public DateTime? created {
            get { return Creation_Date; }
            set {
                //DateTime bla = DateTime.MinValue;
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue)) {
                    // bla is a valid sql datetime
                    Creation_Date = value;
                }
            }
        }
        private DateTime? Updated_Date;
        [Property]
        virtual public DateTime? updated {
            get { return Updated_Date; }
            set {
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue)) {
                    // bla is a valid sql datetime
                    Updated_Date = value;
                }
            }
        }
        private bool _tmp;
        virtual public bool tmp {
            get { return _tmp; }
            set { _tmp = value; }
        }
        private bool _isPublic;
        [Property]
        virtual public bool isPublic {
            get { return _isPublic; }
            set { _isPublic = value; }
        }
        private status _status;
        [BelongsTo("view_status")]
        virtual public status status {
            get { return _status; }
            set { _status = value; }
        }
        private media_repo _media;
        [BelongsTo]
        virtual public media_repo media {
            get { return _media; }
            set { _media = value; }
        }
        private string _staticMap;
        [Property]
        virtual public string staticMap {
            get { return _staticMap; }
            set { _staticMap = value; }
        }
        private IList<comments> Comments = new List<comments>();
        [HasMany(typeof(comments), Lazy = true, Table = "view_to_comments", ColumnKey = "view_id", Cascade = ManyRelationCascadeEnum.AllDeleteOrphan, Inverse = true)]
        virtual public IList<comments> comments {
            get { return Comments; }
            set { Comments = value; }
        }

        private users author_editing;
        [BelongsTo("authors_editing")]
        virtual public users editing {
            get { return author_editing; }
            set { author_editing = value; }
        }

        private users checked_out;
        [BelongsTo]
        virtual public users checked_out_by {
            get { return checked_out; }
            set { checked_out = value; }
        }
        private IList<comments> Pub_comments = new List<comments>();
        [HasMany(typeof(comments), Lazy = true, Table = "view_to_comments", ColumnKey = "view_id", Where = "published=1", Cascade = ManyRelationCascadeEnum.None)]
        virtual public IList<comments> comments_pub {
            get { return Pub_comments; }
            set { Pub_comments = value; }
        }


        private IList<fields> Fields;
        [HasAndBelongsToMany(typeof(fields), Lazy = true, Table = "view_to_fields", ColumnKey = "field_id", ColumnRef = "view_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<fields> field {
            get { return Fields; }
            set { Fields = value; }
        }

        private IList<place> _places;
        [HasAndBelongsToMany(typeof(place), Table = "place_to_view", ColumnKey = "view_id", ColumnRef = "place_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> places {
            get { return _places; }
            set { _places = value; }
        }
        private IList<geometrics> _geometrics;
        [HasAndBelongsToMany(typeof(geometrics), Lazy = true, Table = "view_to_geometrics", ColumnKey = "view_id", ColumnRef = "geometric_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics> geometrics {
            get { return _geometrics; }
            set { _geometrics = value; }
        }


        private styles _forced_shapes_style;
        [BelongsTo]
        virtual public styles forced_shapes_style {
            get { return _forced_shapes_style; }
            set { _forced_shapes_style = value; }
        }
        private styles _forced_marker_style;
        [BelongsTo]
        virtual public styles forced_marker_style {
            get { return _forced_marker_style; }
            set { _forced_marker_style = value; }
        }
        private campus _campus;
        [BelongsTo]
        virtual public campus campus {
            get { return _campus; }
            set { _campus = value; }
        }
        /* replaced by the virtural model
        private map_views_options _options;
        [BelongsTo]
        virtual public map_views_options options
        {
            get { return _options; }
            set { _options = value; }
        }
        */
        /* the virtural model in json */
        private String _options_obj;
        [Property("optionObj")]
        virtual public String options_obj {
            get { return _options_obj; }
            set { _options_obj = value; }
        }

        virtual public bool isPublished() {
            if (this.status == ActiveRecordBase<status>.Find(3) && this.published != null && this.published.Value.CompareTo(DateTime.Now) <= 0) {
                return true;
            }
            return false;
        }

        virtual public bool isCheckedOutNull() {
            bool flag = false;
            if (checked_out_by == null)
                flag = true;

            return flag;
        }
    }
}

