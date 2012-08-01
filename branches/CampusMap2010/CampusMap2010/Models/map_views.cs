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
        private string _alias;
        [Property]
        virtual public string alias
        {
            get { return _alias; }
            set { _alias = value; }
        }
        private string _key;
        [Property("idkey")]
        virtual public string key
        {
            get { return _key; }
            set { _key = value; }
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
        [Property]
        virtual public int width
        {
            get { return Width; }
            set { Width = value; }
        }
        private int Height;
        [Property]
        virtual public int height
        {
            get { return Height; }
            set { Height = value; }
        }

        private IList<authors> Authors = new List<authors>();
        [HasAndBelongsToMany(typeof(authors), Lazy = true, BatchSize = 30, Table = "authors_to_view", ColumnKey = "view_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
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
            SqlGeography spatial = map_views.AsGeography(this.center);
            return spatial.Lat.ToString();
        }

        virtual public string getLong()
        {
            SqlGeography spatial = map_views.AsGeography(this.center);
            return spatial.Long.ToString();
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
        private bool Tmp;
        virtual public bool tmp
        {
            get { return Tmp; }
            set { Tmp = value; }
        }
        private bool _isPublic;
        [Property]
        virtual public bool isPublic
        {
            get { return _isPublic; }
            set { _isPublic = value; }
        }
        private status Status;
        [BelongsTo("view_status")]
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
        private string _staticMap;
        [Property]
        virtual public string staticMap
        {
            get { return _staticMap; }
            set { _staticMap = value; }
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

        private authors checked_out;
        [BelongsTo]
        virtual public authors checked_out_by
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


        private IList<fields> Fields;
        [HasAndBelongsToMany(typeof(fields), Lazy = true, Table = "view_to_fields", ColumnKey = "field_id", ColumnRef = "view_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<fields> field
        {
            get { return Fields; }
            set { Fields = value; }
        }

        private IList<place> _places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_view", ColumnKey = "view_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> places
        {
            get { return _places; }
            set { _places = value; }
        }

        private map_views_options _options;
        [BelongsTo]
        virtual public map_views_options options
        {
            get { return _options; }
            set { _options = value; }
        }


        private String _options_obj;
        [Property("optionObj")]
        virtual public String options_obj
        {
            get { return _options_obj; }
            set { _options_obj = value; }
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





    /* 
     * this is tmp for now since we can have an easy json to deal with the
     * complext and dynamic nature of the google model in our own model.
     */
    [ActiveRecord(Lazy = true, BatchSize = 30)]
    public class map_views_options : ActiveRecordBase<map_views_options>
    {
        protected HelperService helperService = new HelperService();
        public map_views_options() { }

        private int option_id;
        [PrimaryKey("option_id")]
        virtual public int id
        {
            get { return option_id; }
            set { option_id = value; }
        }
        private string _backgroundColor;
        [Property]
        virtual public string backgroundColor
        {
            get { return _backgroundColor; }
            set { _backgroundColor = value; }
        }
        private bool _disableDefaultUI;
        [Property]
        virtual public bool disableDefaultUI
        {
            get { return _disableDefaultUI; }
            set { _disableDefaultUI = value; }
        }
        private bool _disableDoubleClickZoom;
        [Property]
        virtual public bool disableDoubleClickZoom
        {
            get { return _disableDoubleClickZoom; }
            set { _disableDoubleClickZoom = value; }
        }
        private bool _draggable;
        [Property]
        virtual public bool draggable
        {
            get { return _draggable; }
            set { _draggable = value; }
        }
        private string _draggableCursor;
        [Property]
        virtual public string draggableCursor
        {
            get { return _draggableCursor; }
            set { _draggableCursor = value; }
        }
        private string _draggingCursor;
        [Property]
        virtual public string draggingCursor
        {
            get { return _draggingCursor; }
            set { _draggingCursor = value; }
        }
        private int _heading;
        [Property]
        virtual public int heading
        {
            get { return _heading; }
            set { _heading = value; }
        }
        private bool _keyboardShortcuts;
        [Property]
        virtual public bool keyboardShortcuts
        {
            get { return _keyboardShortcuts; }
            set { _keyboardShortcuts = value; }
        }
        private bool _mapMaker;
        [Property]
        virtual public bool mapMaker
        {
            get { return _mapMaker; }
            set { _mapMaker = value; }
        }
        private bool _mapTypeControl;
        [Property]
        virtual public bool mapTypeControl
        {
            get { return _mapTypeControl; }
            set { _mapTypeControl = value; }
        }
        private string _mapTypeControlOptions;
        [Property]
        virtual public string mapTypeControlOptions
        {
            get { return _mapTypeControlOptions; }
            set { _mapTypeControlOptions = value; }
        }
        private string _mapTypeId;
        [Property]
        virtual public string mapTypeId
        {
            get { return _mapTypeId; }
            set { _mapTypeId = value; }
        }
        private int _maxZoom;
        [Property]
        virtual public int maxZoom
        {
            get { return _maxZoom; }
            set { _maxZoom = value; }
        }
        private int _minZoom;
        [Property]
        virtual public int minZoom
        {
            get { return _minZoom; }
            set { _minZoom = value; }
        }
        private bool _noClear;
        [Property]
        virtual public bool noClear
        {
            get { return _noClear; }
            set { _noClear = value; }
        }
        private bool _overviewMapControl;
        [Property]
        virtual public bool overviewMapControl
        {
            get { return _overviewMapControl; }
            set { _overviewMapControl = value; }
        }
        private string _overviewMapControlOptions;
        [Property]
        virtual public string overviewMapControlOptions
        {
            get { return _overviewMapControlOptions; }
            set { _overviewMapControlOptions = value; }
        }
        private bool _panControl;
        [Property]
        virtual public bool panControl
        {
            get { return _panControl; }
            set { _panControl = value; }
        }
        private string _panControlOptions;
        [Property]
        virtual public string panControlOptions
        {
            get { return _panControlOptions; }
            set { _panControlOptions = value; }
        }
        private bool _rotateControl;
        [Property]
        virtual public bool rotateControl
        {
            get { return _rotateControl; }
            set { _rotateControl = value; }
        }
        private string _rotateControlOptions;
        [Property]
        virtual public string rotateControlOptions
        {
            get { return _rotateControlOptions; }
            set { _rotateControlOptions = value; }
        }
        private bool _scaleControl;
        [Property]
        virtual public bool scaleControl
        {
            get { return _scaleControl; }
            set { _scaleControl = value; }
        }
        private string _scaleControlOptions;
        [Property]
        virtual public string scaleControlOptions
        {
            get { return _scaleControlOptions; }
            set { _scaleControlOptions = value; }
        }
        private bool _scrollwheel;
        [Property]
        virtual public bool scrollwheel
        {
            get { return _scrollwheel; }
            set { _scrollwheel = value; }
        }
        private string _streetView;
        [Property]
        virtual public string streetView
        {
            get { return _streetView; }
            set { _streetView = value; }
        }
        private bool _streetViewControl;
        [Property]
        virtual public bool streetViewControl
        {
            get { return _streetViewControl; }
            set { _streetViewControl = value; }
        }
        private string _styles;
        [Property]
        virtual public string styles
        {
            get { return _styles; }
            set { _styles = value; }
        }
        private int _tilt;
        [Property]
        virtual public int tilt
        {
            get { return _tilt; }
            set { _tilt = value; }
        }
        private int _zoom;
        [Property]
        virtual public int zoom
        {
            get { return _zoom; }
            set { _zoom = value; }
        }
        private bool _zoomControl;
        [Property]
        virtual public bool zoomControl
        {
            get { return _zoomControl; }
            set { _zoomControl = value; }
        }
        private string _zoomControlOptions;
        [Property]
        virtual public string zoomControlOptions
        {
            get { return _zoomControlOptions; }
            set { _zoomControlOptions = value; }
        }



    }
}

