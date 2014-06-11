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
using System.Data.SqlTypes;

namespace campusMap.Models
{
    [ActiveRecord(Lazy=true)]
    public class advertisement : ActiveRecordBase<advertisement>
    {
        [PrimaryKey("ad_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public int Clicked { get; set; }

        [Property]
        virtual public String Url { get; set; }

        [HasAndBelongsToMany(typeof(media_repo), Lazy = true, Table = "advertisement_to_media", ColumnKey = "ad_id", ColumnRef = "media_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<media_repo> Images { get; set; }

        [HasAndBelongsToMany(typeof(tags), Lazy = true, Table = "advertisement_to_tag", ColumnKey = "ad_id", ColumnRef = "tag_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<tags> Tags { get; set; }

        [HasAndBelongsToMany(typeof(fields), Lazy = true, Table = "view_to_fields", ColumnKey = "field_id", ColumnRef = "view_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<fields> field { get; set; }

        [Property(Default = "0")]
        virtual public int Views { get; set; }

        [Property]
        virtual public String HtmlText { get; set; }

        [Property]
        virtual public String Name { get; set; }

        [BelongsTo]
        virtual public place_types place_types { get; set; }

        [Property(Default = "0")]
        virtual public String limitAds { get; set; }

        [Property(Default = "0")]
        virtual public int maxClicks { get; set; }

        [Property(Default = "0")]
        virtual public int maxImpressions { get; set; }

        private DateTime? Expiration;
        [Property]
        virtual public DateTime? expiration
        {
            get { return Expiration; }
            set
            {
                //DateTime bla = DateTime.MinValue;
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue))
                {
                    // bla is a valid sql datetime
                    Expiration = value;

                }
            }
        }
        private DateTime? StartDate;
        [Property]
        virtual public DateTime? startdate
        {
            get { return StartDate; }
            set
            {
                //DateTime bla = DateTime.MinValue;
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue))
                {
                    // bla is a valid sql datetime
                    StartDate = value;

                }
            }
        }

        virtual public bool isExpired()
        {
            if ((!expiration.HasValue || expiration.HasValue && expiration.Value.CompareTo(DateTime.Now) >= 0) && (maxClicks == 0 || Clicked < maxClicks) && (maxImpressions == 0 || Views < maxImpressions))
                return false;
            return true;
        }

        public static Comparison<advertisement> OrderComparison = delegate(advertisement p1, advertisement p2)
        {
            DateTime t1datetime, t2datetime;
            if (!DateTime.TryParse(p1.expiration.ToString(), out t1datetime))
                t1datetime = DateTime.MaxValue;
            if (!DateTime.TryParse(p2.expiration.ToString(), out t2datetime))
                t2datetime = DateTime.MaxValue;

            if (p1.expiration == p2.expiration && p1.Clicked == p2.Clicked){
                      return p1.Views.CompareTo(p2.Views);
            }else if (p1.expiration == p2.expiration){
                return p1.Clicked.CompareTo(p2.Clicked);
            }
            return t1datetime.CompareTo(t2datetime);
        };
        public static List<T> ConvertToListOf<T>(IList<T> iList)
        {
            List<T> result = new List<T>();

            foreach (T value in iList)
                result.Add(value);

            return result;
        }
    }
}
