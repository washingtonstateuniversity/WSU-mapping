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
        private int ad_id;
        [PrimaryKey("ad_id")]
        virtual public int id
        {
            get { return ad_id; }
            set { ad_id = value; }
        }
        private int clicked;
        [Property]
        virtual public int Clicked
        {
            get { return clicked; }
            set { clicked = value; }
        }
        private String url;
        [Property]
        virtual public String Url
        {
            get { return url; }
            set { url = value; }
        }
       /* private bool breakingNews;
        [Property]
        virtual public bool BreakingNews
        {
            get { return breakingNews; }
            set { breakingNews = value; }
        }*/
        private IList<media_repo> images = new List<media_repo>();
        [HasAndBelongsToMany(typeof(media_repo), Lazy = true, Table = "AdvertisementImage", ColumnKey = "advertisementId", ColumnRef = "imageId", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<media_repo> Images
        {
            get { return images; }
            set { images = value; }
        }
        private IList<tags> tags = new List<tags>();
        [HasAndBelongsToMany(typeof(tags), Lazy = true, Table = "AdvertisementTag", ColumnKey = "advertisementId", ColumnRef = "tagId", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<tags> Tags
        {
            get { return tags; }
            set { tags = value; }
        }
        private int views = 0;
        [Property]
        virtual public int Views
        {
            get { return views; }
            set { views = value;}
        }

        private String htmltext;
        [Property]
        virtual public String HtmlText
        {
            get { return htmltext; }
            set { htmltext = value;}
        }
        private String name;
        [Property]
        virtual public String Name
        {
            get { return name; }
            set { name = value;}
        }
        private place_types Place_Types;
        [BelongsTo]
        virtual public place_types place_types
        {
            get { return Place_Types; }
            set { Place_Types = value; }
        }



        private String limitads;
        [Property]
        virtual public String limitAds
        {
            get { return limitads; }
            set { limitads = value; }
        }
        private int maxclicks = 0;
        [Property]
        virtual public int maxClicks
        {
            get { return maxclicks; }
            set { maxclicks = value;}
        }
        private int maximpressions = 0;
        [Property]
        virtual public int maxImpressions
        {
            get { return maximpressions; }
            set { maximpressions = value;}
        }
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
            if ((!expiration.HasValue || expiration.HasValue && expiration.Value.CompareTo(DateTime.Now) >= 0) && (maxClicks == 0 || Clicked < maxClicks) && (maxImpressions == 0 || Views < maximpressions))
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
