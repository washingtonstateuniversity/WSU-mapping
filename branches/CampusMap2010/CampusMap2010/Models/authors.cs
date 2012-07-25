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
using NHibernate.Criterion;
using System.Collections;
using System.Data.SqlTypes;
using campusMap.Services;




namespace campusMap.Models
{
    [ActiveRecord(Lazy=true, BatchSize=30)]
    public class authors : ActiveRecordBase<authors>
    {
        protected UserService userService = new UserService();
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

        private user_settings _user_settings;
        [BelongsTo]
        virtual public user_settings settings
        {
            get { return _user_settings; }
            set { _user_settings = value; }
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
        private IList<field_types> _field_types = new List<field_types>();
        [HasAndBelongsToMany(typeof(field_types), Lazy = true, BatchSize = 30, Table = "authors_to_field_type", ColumnKey = "author_id", ColumnRef = "field_type_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<field_types> field_types
        {
            get { return _field_types; }
            set { _field_types = value; }
        }

        private IList<geometrics> Geometric = new List<geometrics>();
        [HasAndBelongsToMany(typeof(geometrics), Lazy = true, BatchSize = 60, Table = "authors_to_geometrics", ColumnKey = "author_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics> geometric
        {
            get { return Geometric; }
            set { Geometric = value; }
        }


        private IList<map_views> _views = new List<map_views>();
        [HasAndBelongsToMany(typeof(map_views), Lazy = true, BatchSize = 60, Table = "authors_to_view", ColumnKey = "author_id", ColumnRef = "view_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<map_views> views
        {
            get { return _views; }
            set { _views = value; }
        }
        private IList<place_types> _place_types = new List<place_types>();
        [HasAndBelongsToMany(typeof(place_types), Lazy = true, Table = "authors_to_place_type", ColumnKey = "author_id", ColumnRef = "place_type_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place_types> place_types
        {
            get { return _place_types; }
            set { _place_types = value; }
        }
        private IList<colleges> _colleges = new List<colleges>();
        [HasAndBelongsToMany(typeof(colleges), Lazy = true, Table = "authors_to_colleges", ColumnKey = "college_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<colleges> colleges
        {
            get { return _colleges; }
            set { _colleges = value; }
        }
        private IList<campus> _campus = new List<campus>();
        [HasAndBelongsToMany(typeof(campus), Lazy = true, Table = "authors_to_campus", ColumnKey = "author_id", ColumnRef = "campus_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<campus> campus
        {
            get { return _campus; }
            set { _campus = value; }
        }
        private IList<programs> _programs = new List<programs>();
        [HasAndBelongsToMany(typeof(programs), Lazy = true, Table = "authors_to_programs", ColumnKey = "author_id", ColumnRef = "program_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<programs> programs
        {
            get { return _programs; }
            set { _programs = value; }
        }
        private IList<categories> _categories = new List<categories>();
        [HasAndBelongsToMany(typeof(categories), Lazy = true, Table = "authors_to_categories", ColumnKey = "author_id", ColumnRef = "category_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<categories> categories
        {
            get { return _categories; }
            set { _categories = value; }
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



        virtual public IList<place> getUserPlaces(int statusId, int limit)
        {
            IList<place> temp = new List<place>();
            authors user = UserService.getUser();
            IList<place> userplaces = user.Places;
            if (statusId > 0)
            {
                object[] obj = new object[userplaces.Count];
                int i = 0;
                foreach (place p in userplaces)
                {
                    obj[i] = p.id;
                    i++;
                }
                List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
                baseEx.Add(Expression.In("id", obj));
                List<AbstractCriterion> statusEx = new List<AbstractCriterion>();
                statusEx.AddRange(baseEx);
                statusEx.Add(Expression.Eq("status", ActiveRecordBase<status>.Find(statusId)));
                if (limit == 0)limit=99999;
                Order[] ord= new Order[1];
                ord[0]=Order.Asc("prime_name");
                temp = ActiveRecordBase<place>.SlicedFindAll(0, limit, ord, statusEx.ToArray());
            }
            else
            {
                temp = userplaces;
            }
            return temp;
        }

    }


    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class access_levels
    {
        private int access_level_id;
        [PrimaryKey("access_level_id")]
        virtual public int id
        {
            get { return access_level_id; }
            set { access_level_id = value; }
        }
        private String _name;
        [Property("title")]
        virtual public String name
        {
            get { return _name; }
            set { _name = value; }
        }
        private String _alias;
        [Property]
        virtual public String alias
        {
            get { return _alias; }
            set { _alias = value; }
        }
        private Boolean _default;
        [Property]
        virtual public Boolean default_group
        {
            get { return _default; }
            set { _default = value; }
        }

        private IList<authors> _users;
        [HasMany(typeof(authors), Lazy = true, Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<authors> users
        {
            get { return _users; }
            set { _users = value; }
        }
        private IList<field_types> _field_types = new List<field_types>();
        [HasAndBelongsToMany(typeof(field_types), Lazy = true, BatchSize = 30, Table = "access_levels_to_field_type", ColumnKey = "access_level_id", ColumnRef = "field_type_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<field_types> field_types
        {
            get { return _field_types; }
            set { _field_types = value; }
        }
        private IList<privileges> _privileges = new List<privileges>();
        [HasAndBelongsToMany(typeof(privileges), Lazy = true, BatchSize = 30, Table = "access_levels_to_privilege", ColumnKey = "access_level_id", ColumnRef = "privilege_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<privileges> privileges
        {
            get { return _privileges; }
            set { _privileges = value; }
        }

        /* attach some base properties to the group level */
        private IList<colleges> _colleges = new List<colleges>();
        [HasAndBelongsToMany(typeof(colleges), Lazy = true, Table = "groups_to_colleges", ColumnKey = "access_level_id", ColumnRef = "college_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<colleges> colleges
        {
            get { return _colleges; }
            set { _colleges = value; }
        }
        private IList<campus> _campus = new List<campus>();
        [HasAndBelongsToMany(typeof(campus), Lazy = true, Table = "groups_to_campus", ColumnKey = "access_level_id", ColumnRef = "campus_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<campus> campus
        {
            get { return _campus; }
            set { _campus = value; }
        }
        private IList<programs> _programs = new List<programs>();
        [HasAndBelongsToMany(typeof(programs), Lazy = true, Table = "groups_to_programs", ColumnKey = "access_level_id", ColumnRef = "program_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<programs> programs
        {
            get { return _programs; }
            set { _programs = value; }
        }
        private IList<schools> _schools = new List<schools>();
        [HasAndBelongsToMany(typeof(schools), Lazy = true, Table = "groups_to_schools", ColumnKey = "access_level_id", ColumnRef = "school_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<schools> schools
        {
            get { return _schools; }
            set { _schools = value; }
        }
        private IList<categories> _categories = new List<categories>();
        [HasAndBelongsToMany(typeof(categories), Lazy = true, Table = "groups_to_categories", ColumnKey = "access_level_id", ColumnRef = "category_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<categories> categories
        {
            get { return _categories; }
            set { _categories = value; }
        }



    }


    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class privileges
    {
        private int privilege_id;
        [PrimaryKey("privilege_id")]
        virtual public int id
        {
            get { return privilege_id; }
            set { privilege_id = value; }
        }
        private String _name;
        [Property("title")]
        virtual public String name
        {
            get { return _name; }
            set { _name = value; }
        }
        private String _alias;
        [Property]
        virtual public String alias
        {
            get { return _alias; }
            set { _alias = value; }
        }
        private Boolean _editable;
        [Property]
        virtual public Boolean editable
        {
            get { return _editable; }
            set { _editable = value; }
        }
        private IList<access_levels> _access_levels = new List<access_levels>();
        [HasAndBelongsToMany(typeof(access_levels), Lazy = true, BatchSize = 30, Table = "access_levels_to_privilege", ColumnKey = "privilege_id", ColumnRef = "access_level_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<access_levels> access_levels
        {
            get { return _access_levels; }
            set { _access_levels = value; }
        }

    }




    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class user_settings
    {
        private int user_settings_id;
        [PrimaryKey("user_settings_id")]
        virtual public int id
        {
            get { return user_settings_id; }
            set { user_settings_id = value; }
        }
        private String _attr;
        [Property]
        virtual public String attr
        {
            get { return _attr; }
            set { _attr = value; }
        }
    }
}
