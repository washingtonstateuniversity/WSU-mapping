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
    [ActiveRecord] 
    public class PlaceByUser : ActiveRecordBase<PlaceByUser>  
    {
        private int id;
        [PrimaryKey] 
        public int Id
        {
            get { return id; }
            set { id = value; }
        }
        private String first;
        [Property]
        public String First
        {
            get { return first; }
            set { first = value; }
        }
        private String last;
        [Property] 
        public String Last
        {
            get { return last; }
            set { last = value; }
        }
        private String email;
        [Property] 
        public String Email
        {
            get { return email; }
            set { email = value; }
        }
        private String placetext;
        [Property] 
        public String Placetext
        {
            get { return placetext; }
            set { placetext = value; }
        }
        private DateTime? createTime;
        [Property]
        public DateTime? CreateTime
        {
            get { return createTime; }
            set
            {
                //DateTime bla = DateTime.MinValue;
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue))
                {
                    // bla is a valid sql datetime
                    createTime = value;

                }
            }
        }
    }
}
