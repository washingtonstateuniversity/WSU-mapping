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
using System.Collections;

namespace campusMap.Models
{
    [ActiveRecord(Lazy=true,BatchSize=10)]
    public class geometrics_media : ActiveRecordBase<geometrics_media>
    {
        private int id;
        [PrimaryKey]
       virtual public int Id
        {
            get { return id; }
            set { id = value; }
        }

        private geometrics Geometric;
        [BelongsTo("geometric_id")]
        virtual public geometrics geometric
        {
            get { return Geometric; }
            set { Geometric = value; }
        }
        private media_repo media;
        [BelongsTo("media_id")]
        virtual public media_repo Media
        {
            get { return media; }
            set { media = value; }
        }
        private int order;
        [Property]
        virtual public int geometric_order
        {
            get { return order; }
            set { order = value; }
        }
    }
}
