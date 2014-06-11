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

namespace campusMap.Models {
    public class _base {
        private DateTime? Creation_Date;
        [Property(Default = "GETDATE()")]
        virtual public DateTime? creation_date {
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
        [Property(Default = "GETDATE()")]
        virtual public DateTime? updated_date {
            get { return Updated_Date; }
            set {
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue)) {
                    // bla is a valid sql datetime
                    Updated_Date = value;
                }
            }
        }
    }

    public class publish_base : _base {
        private DateTime? Publish_Time;
        [Property(Default = "GETDATE()")]
        virtual public DateTime? publish_time {
            get { return Publish_Time; }
            set {
                //DateTime bla = DateTime.MinValue;
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue)) {
                    // bla is a valid sql datetime
                    Publish_Time = value;
                }
            }
        }

        [Property(Default = "0")]
        virtual public Boolean tmp { get; set; }

        [Property(Default = "0")]
        virtual public Boolean outputError { get; set; }

        [Property(Default = "1")]
        virtual public Boolean isPublic { get; set; }

        [BelongsTo]
        virtual public users editing { get; set; }

        [BelongsTo]
        virtual public users onwer { get; set; }

        [BelongsTo]
        virtual public status status { get; set; }

        virtual public bool isCheckedOut() {
            bool flag = false;
            if (this.editing != null && this.editing != UserService.getUserFull())
                flag = true;
            return flag;
        }
        virtual public bool isPublished() {
            if (this.status == ActiveRecordBase<status>.Find(3) && this.publish_time != null && this.publish_time.Value.CompareTo(DateTime.Now) <= 0) {
                return true;
            }
            return false;
        }


    }

    public class site_base {
        [PrimaryKey]
        virtual public int id { get; set; }

        [Property]
        virtual public String settings { get; set; }
    }
}
