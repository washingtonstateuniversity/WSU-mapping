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
using NHibernate.Expression;
using System.Collections.Generic;

namespace campusMap.Models
{   
    
    [ActiveRecord(Lazy=true, BatchSize=5)]
    public class campus : ActiveRecordBase<campus>
    {
        private int campus_id;
        [PrimaryKey("campus_id")]
        virtual public int id
        {
            get { return campus_id; }
            set { campus_id = value; }
        }
        private string City;
        [Property]
        virtual public string city
        {
            get { return City; }
            set { City = value; }
        }
        private string State;
        [Property]
        virtual public string state
        {
            get { return State; }
            set { State = value; }
        }
        private string State_Abbrev;
        [Property]
        virtual public string state_abbrev
        {
            get { return State_Abbrev; }
            set { State_Abbrev = value; }
        }
        private int Zipcode;
        [Property]
        virtual public int zipcode
        {
            get { return Zipcode; }
            set { Zipcode = value; }
        }




        private decimal Latitude;
        [Property]
        virtual public decimal latitude
        {
            get { return Latitude; }
            set { Latitude = value; }
        }
        private decimal Longitude;
        [Property]
        virtual public decimal longitude
        {
            get { return Longitude; }
            set { Longitude = value; }
        }

        private IList<place> places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_campus", ColumnKey = "campus_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }
     }
}
