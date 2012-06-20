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
using System.Collections.Generic;

namespace campusMap.Models
{
    [ActiveRecord(Lazy=true, BatchSize=10)]
    public class media_repo : ActiveRecordBase<media_repo>
    {
        private int media_id;
        [PrimaryKey("media_id")]
        virtual public int id
        {
            get { return media_id; }
            set { media_id = value; }
        }
        private string media_credit;
        [Property]
        virtual public string credit
        {
            get { return media_credit; }
            set { media_credit = value; }
        }
        private string media_caption;
        [Property]
        virtual public string caption
        {
            get { return media_caption; }
            set { media_caption = value; }
        }

        private DateTime? media_created;
        [Property]
        virtual public DateTime? created
        {
            get { return media_created; }
            set { media_created = value; }
        }
        private DateTime? media_updated;
        [Property]
        virtual public DateTime? updated
        {
            get { return media_updated; }
            set { media_updated = value; }
        }

        private String media_fileName;
        [Property]
        virtual public String file_name
        {
            get { return media_fileName; }
            set { media_fileName = value; }
        }
        private String media_file_ext;
        [Property]
        virtual public String ext
        {
            get { return media_file_ext; }
            set { media_file_ext = value; }
        }
        private String media_file_path;
        [Property]
        virtual public String path
        {
            get { return media_file_path; }
            set { media_file_path = value; }
        }
        private String _orientation;
        [Property]
        virtual public String orientation 
        {
            get { return _orientation; }
            set { _orientation = value; }
        }
        private media_types media_type;
        [BelongsTo("media_type_id")]
        virtual public media_types type
        {
            get { return media_type; }
            set { media_type = value; }
        }

        private IList<place_media> Place_Media = new List<place_media>();
        [HasMany(Lazy = true, ColumnKey = "media_id")]
        virtual public IList<place_media> place_media
        {
            get { return Place_Media; }
            set { Place_Media = value; }
        }
        private IList<place_media> ordering = new List<place_media>();
        [HasAndBelongsToMany(typeof(place_media), Lazy = true, BatchSize = 30, Table = "place_media", ColumnKey = "place_id", ColumnRef = "media_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place_media> Ordering
        {
            get { return ordering; }
            set { ordering = value; }
        }
        private IList<place_media> places = new List<place_media>();
        [HasAndBelongsToMany(typeof(place_media), Lazy = true, BatchSize = 30, Table = "place_media", ColumnKey = "media_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place_media> Places
        {
            get { return places; }
            set { places = value; }
        }

        private IList<advertisement> advertisements = new List<advertisement>();
        [HasAndBelongsToMany(typeof(advertisement), Lazy = true, Table = "advertisement_to_media", ColumnKey = "media_id", ColumnRef = "ad_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<advertisement> Advertisements
        {
            get { return advertisements; }
            set { advertisements = value; }
        }
        private IList<fields> Fields;
        [HasAndBelongsToMany(typeof(fields), Lazy = true, Table = "media_to_fields", ColumnKey = "field_id", ColumnRef = "media_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<fields> field
        {
            get { return Fields; }
            set { Fields = value; }
        }     
        
 
    }


    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class media_types : json_autocomplete<media_types>, campusMap.Models.Ijson_autocomplete
    {
        public static int ad = 2;
        public static int place = 1;

        private int media_type_id;
        [PrimaryKey("media_type_id")]
        virtual public int id
        {
            get { return media_type_id; }
            set { media_type_id = value; }
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


        private media_format media_format;
        [BelongsTo("media_format_id")]
        virtual public media_format format
        {
            get { return media_format; }
            set { media_format = value; }
        }


        /*private IList<media_repo> Media;
        [HasMany(Lazy=true, BatchSize=30)]
        virtual public IList<media_repo> media
        {
            get { return Media; }
            set { Media = value; }
        }*/
        private IList<media_repo> Media_typed;
        [HasAndBelongsToMany(typeof(media_repo), Lazy = true, BatchSize = 30, Table = "media_to_media_types", ColumnKey = "media_id", ColumnRef = "media_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<media_repo> media_typed
        {
            get { return Media_typed; }
            set { Media_typed = value; }
        }
    }
    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class media_format : json_autocomplete<media_format>, campusMap.Models.Ijson_autocomplete
    {

        private int media_format_id;
        [PrimaryKey("media_format_id")]
        virtual public int id
        {
            get { return media_format_id; }
            set { media_format_id = value; }
        }
        private string _name;
        [Property]
        virtual public string name
        {
            get { return _name; }
            set { _name = value; }
        }
        private string _attr;
        [Property]
        virtual public string attr
        {
            get { return _attr; }
            set { _attr = value; }
        }
        private IList<media_types> _media_types;
        [HasAndBelongsToMany(typeof(media_types), Lazy = true, BatchSize = 30, Table = "media_types_to_media_format", ColumnKey = "media_type_id", ColumnRef = "media_format_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<media_types> media_types
        {
            get { return _media_types; }
            set { _media_types = value; }
        }
    }
}
