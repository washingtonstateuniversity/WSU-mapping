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
using NHibernate.Exceptions;
using System.Collections.Generic;
using NHibernate.Expression;
using System.Collections;
using System.Data.SqlTypes;
using campusMap.Services;




namespace campusMap.Models
{
    [ActiveRecord(Lazy=true, BatchSize=30)]
    public class authors : ActiveRecordBase<authors>
    {

        private int author_id;
        [PrimaryKey("author_id")]
        virtual public int id
        {
            get { return author_id; }
            set { author_id = value; }
        }

        private String nid;
        [Property]
        virtual public String Nid
        {
            get { return nid; }
            set { nid = value; }
        }

        private access_levels access_level;
        [BelongsTo]
        virtual public access_levels access_levels
        {
            get { return access_level; }
            set { access_level = value; }
        }

        private string Name;
        [Property]
        virtual public string name
        {
            get { return Name; }
            set { Name = value; }
        }

        private string Email;
        [Property]
        virtual public string email
        {
            get { return Email; }
            set { Email = value; }
        }

        private string Phone;
        [Property]
        virtual public string phone
        {
            get { return Phone; }
            set { Phone = value; }
        }

        private bool Active;
        [Property]
        virtual public bool active
        {
            get { return Active; }
            set { Active = value; }
        }

        private bool Logedin;
        [Property]
        virtual public bool logedin
        {
            get { return Logedin; }
            set { Logedin = value; }
        }

        private DateTime? lastActive;
        [Property]
        virtual public DateTime? LastActive
        {
            get { return lastActive; }
            set
            {
                //DateTime bla = DateTime.MinValue;
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue))
                {
                    // bla is a valid sql datetime
                    lastActive = value;

                }
            }
        }
        
        private IList<media_repo> Media = new List<media_repo>();
        [HasAndBelongsToMany(typeof(media_repo), Lazy = true, BatchSize = 30, Table = "authors_to_media", ColumnKey = "author_id", ColumnRef = "media_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<media_repo> media
        {
            get { return Media; }
            set { Media = value; }
        }
        private IList<place> places = new List<place>();
        [HasAndBelongsToMany(typeof(place), Lazy = true, BatchSize = 60, Table = "authors_to_place", ColumnKey = "author_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }

        private IList<geometrics> Geometric = new List<geometrics>();
        [HasAndBelongsToMany(typeof(geometrics), Lazy = true, BatchSize = 60, Table = "authors_to_geometrics", ColumnKey = "author_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics> geometric
        {
            get { return Geometric; }
            set { Geometric = value; }
        }


        private IList<map_views> Views = new List<map_views>();
        [HasAndBelongsToMany(typeof(map_views), Lazy = true, BatchSize = 60, Table = "authors_to_view", ColumnKey = "author_id", ColumnRef = "view_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<map_views> views
        {
            get { return Views; }
            set { Views = value; }
        }
        private IList<place_types> sections = new List<place_types>();
        [HasAndBelongsToMany(typeof(place_types), Lazy = true, Table = "authors_to_place_type", ColumnKey = "place_type_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place_types> Sections
        {
            get { return sections; }
            set { sections = value; }
        }
        private IList<colleges> colleges = new List<colleges>();
        [HasAndBelongsToMany(typeof(colleges), Lazy = true, Table = "authors_to_colleges", ColumnKey = "college_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<colleges> Colleges
        {
            get { return colleges; }
            set { colleges = value; }
        }
        private IList<campus> campus = new List<campus>();
        [HasAndBelongsToMany(typeof(campus), Lazy = true, Table = "authors_to_campus", ColumnKey = "campus_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<campus> Campus
        {
            get { return campus; }
            set { campus = value; }
        }
        private IList<programs> programs = new List<programs>();
        [HasAndBelongsToMany(typeof(programs), Lazy = true, Table = "authors_to_programs", ColumnKey = "program_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<programs> Programs
        {
            get { return programs; }
            set { programs = value; }
        }
       /* private Positions position;
        [BelongsTo]
        virtual public Positions Position
        {
            get { return position; }
            set { position = value; }
        }*/

/*Table = "authors_editing", ColumnKey = "place_id", ColumnRef = "author_id",*/
        private IList<place> author_editing = new List<place>();
        [HasMany(typeof(place), Lazy = true, Cascade = ManyRelationCascadeEnum.AllDeleteOrphan)]
        virtual public IList<place> editing
        {
            get { return author_editing; }
            set { author_editing = value; }
        }


    }
}
