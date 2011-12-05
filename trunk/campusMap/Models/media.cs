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
        private string credit;
        [Property]
        virtual public string Credit
        {
            get { return credit; }
            set { credit = value; }
        }
        private string caption;
        [Property]
        virtual public string Caption
        {
            get { return caption; }
            set { caption = value; }
        }

        private DateTime? created;
        [Property]
        virtual public DateTime? creation_date
        {
            get { return created; }
            set { created = value; }
        }
        private DateTime? updated;
        [Property]
        virtual public DateTime? updated_date
        {
            get { return updated; }
            set { updated = value; }
        }
             
        private String fileName;
        [Property]
        virtual public String FileName
        {
          get { return fileName; }
          set { fileName = value; }
        }
        private String ext;
        [Property]
        virtual public String Ext
        {
            get { return ext; }
            set { ext = value; }
        }
        private media_types types;
        [BelongsTo]
        virtual public media_types media_types
        {
            get { return types; }
            set { types = value; }
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
        [HasAndBelongsToMany(typeof(advertisement), Lazy = true, Table = "advertisement_media", ColumnKey = "media_id", ColumnRef = "advertisement_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<advertisement> Advertisements
        {
            get { return advertisements; }
            set { advertisements = value; }
        }
       
       
        
 
    }
}
