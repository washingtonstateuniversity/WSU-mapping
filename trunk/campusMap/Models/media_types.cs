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
{   [ActiveRecord(Lazy=true, BatchSize=10)]
    public class media_types : ActiveRecordBase<media_types>
    {
        public static int ad = 2;
        public static int place = 1;

        private int media_type_id;
        [PrimaryKey("media_type_id")]
        virtual public int id
        {
            get { return id; }
            set { media_type_id = value; }
        }
        private string Type;
        [Property]
        virtual public string type
        {
            get { return Type; }
            set { Type = value; }
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
        private IList<media_repo> Media;
        [HasMany(Lazy=true, BatchSize=30)]
        virtual public IList<media_repo> media
        {
            get { return Media; }
            set { Media = value; }
        }
        private IList<media_repo> Media_typed;
        [HasAndBelongsToMany(typeof(media_repo), Lazy = true, Table = "media_to_media_types", ColumnKey = "media_id", ColumnRef = "media_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<media_repo> media_typed
        {
            get { return Media_typed; }
            set { Media_typed = value; }
        }


    }
}
