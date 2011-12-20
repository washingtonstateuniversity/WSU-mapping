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

        private IList<field_types> Types;
        [HasAndBelongsToMany(typeof(field_types), Lazy = true, Table = "media_to_field_types", ColumnKey = "field_type_id", ColumnRef = "media_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<field_types> field_types
        {
            get { return Types; }
            set { Types = value; }
        }

        private IList<fields> Fields;
        [HasAndBelongsToMany(typeof(fields), Lazy = true, Table = "media_to_fields", ColumnKey = "field_id", ColumnRef = "media_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<fields> field
        {
            get { return Fields; }
            set { Fields = value; }
        }     
        
 
    }
}
