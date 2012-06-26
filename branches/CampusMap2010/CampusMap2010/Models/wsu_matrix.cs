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
using NHibernate.Criterion;
using System.Collections.Generic;




/** <summary>All models that discribe the location the is under WSU</summary>
 *  <remarks>Models that occur here are of items that are not 
 *           abstract but are of the nature of being related to a 
 *           education based location.
 * </remarks> 
 **/
namespace campusMap.Models
{
    /** <summary>A summary of the model programs.</summary>
    *  <param name="id">int as obj id</param>
     * <param name="name">string of ununiformity</param>
     * <param name="attr">a json string of the settings of entry</param>
     * <param name="places">a HasMany of the place obj</param>
    *  <remarks>Remarks about the method.</remarks> 
    **/
    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class programs : ActiveRecordBase<programs>
    {
        private int program_id;
        [PrimaryKey("program_id")]
        virtual public int id
        {
            get { return program_id; }
            set { program_id = value; }
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
        private IList<place> places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_programs", ColumnKey = "program_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }
    }

    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class schools : ActiveRecordBase<schools>
    {
        private int school_id;
        [PrimaryKey("school_id")]
        virtual public int id
        {
            get { return school_id; }
            set { school_id = value; }
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
        /*private IList<place> places;
        [HasMany(typeof(place), Lazy = true, Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }*/


        private IList<place> places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_schools", ColumnKey = "school_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }



    }

    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class departments : ActiveRecordBase<departments>
    {
        private int department_id;
        [PrimaryKey("department_id")]
        virtual public int id
        {
            get { return department_id; }
            set { department_id = value; }
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
        /*private IList<place> places;
        [HasMany(typeof(place), Lazy = true, Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }*/


        private IList<place> places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_departments", ColumnKey = "department_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }




    }

    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class colleges : ActiveRecordBase<colleges>
    {
        private int college_id;
        [PrimaryKey("college_id")]
        virtual public int id
        {
            get { return college_id; }
            set { college_id = value; }
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
       /* private IList<place> places;
        [HasMany(typeof(place), Lazy = true, Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }*/

        private IList<place> places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_colleges", ColumnKey = "college_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }


    }

    [ActiveRecord(Lazy = true, BatchSize = 5)]
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
        private string Name;
        [Property]
        virtual public string name
        {
            get { return Name; }
            set { Name = value; }
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
        [HasMany(typeof(place), Lazy = true, Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }

/*
        private IList<place> places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_campus", ColumnKey = "campus_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }*/


    }

}
