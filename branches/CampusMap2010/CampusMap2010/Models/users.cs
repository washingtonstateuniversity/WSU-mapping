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
    public class users : ActiveRecordBase<users>
    {
        protected UserService userService = new UserService();

        [PrimaryKey("author_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public String nid { get; set; }

        [BelongsTo]
        virtual public user_groups groups { get; set; }

        [BelongsTo]
        virtual public user_settings settings { get; set; }

        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public string email { get; set; }

        [Property]
        virtual public string phone { get; set; }

        [Property]
        virtual public bool active { get; set; }

        [Property]
        virtual public bool logedin { get; set; }

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
        

        [HasAndBelongsToMany(typeof(media_repo), Lazy = true, BatchSize = 30, Table = "authors_to_media", ColumnKey = "author_id", ColumnRef = "media_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<media_repo> media { get; set; }

        [HasAndBelongsToMany(typeof(place), Lazy = true, BatchSize = 60, Table = "authors_to_place", ColumnKey = "author_id", ColumnRef = "place_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places { get; set; }

        [HasAndBelongsToMany(typeof(field_types), Lazy = true, BatchSize = 30, Table = "authors_to_field_type", ColumnKey = "author_id", ColumnRef = "field_type_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<field_types> field_types { get; set; }

        [HasAndBelongsToMany(typeof(geometrics), Lazy = true, BatchSize = 60, Table = "authors_to_geometrics", ColumnKey = "author_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics> geometric { get; set; }

        [HasAndBelongsToMany(typeof(map_views), Lazy = true, BatchSize = 60, Table = "authors_to_view", ColumnKey = "author_id", ColumnRef = "view_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<map_views> views { get; set; }

        [HasAndBelongsToMany(typeof(place_types), Lazy = true, Table = "authors_to_place_type", ColumnKey = "author_id", ColumnRef = "place_type_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place_types> place_types { get; set; }

        [HasAndBelongsToMany(typeof(colleges), Lazy = true, Table = "authors_to_colleges", ColumnKey = "college_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<colleges> colleges { get; set; }

        [HasAndBelongsToMany(typeof(campus), Lazy = true, Table = "authors_to_campus", ColumnKey = "author_id", ColumnRef = "campus_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<campus> campus { get; set; }

        [HasAndBelongsToMany(typeof(programs), Lazy = true, Table = "authors_to_programs", ColumnKey = "author_id", ColumnRef = "program_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<programs> programs { get; set; }

        [HasAndBelongsToMany(typeof(categories), Lazy = true, Table = "authors_to_categories", ColumnKey = "author_id", ColumnRef = "category_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<categories> categories { get; set; }


        [HasMany(typeof(place), Lazy = true, Cascade = ManyRelationCascadeEnum.AllDeleteOrphan)]
        virtual public IList<place> editing { get; set; }


        virtual public IList<place> getUserPlaces(int statusId, int limit)
        {
            IList<place> temp = new List<place>();
            users user = UserService.getUser();
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

    /* AKA GROUPS */
    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class user_groups
    {
        [PrimaryKey("access_level_id")]
        virtual public int id { get; set; }

        [BelongsTo]
        virtual public user_groups parent { get; set; }

        [Property]
        virtual public String name { get; set; }

        [Property]
        virtual public String alias { get; set; }

        [Property(Default = "0")]
        virtual public Boolean default_group { get; set; }

        [Property(Default = "0")]
        virtual public Boolean isAdmin { get; set; }

        [Property(Default = "0")]
        virtual public Boolean allow_signup { get; set; }

        [HasMany(typeof(users), Lazy = true, Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<users> users { get; set; }

        [HasMany(typeof(user_groups), Lazy = true, Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<user_groups> children { get; set; }


        [HasAndBelongsToMany(typeof(field_types), Lazy = true, BatchSize = 30, Table = "access_levels_to_field_type", ColumnKey = "access_level_id", ColumnRef = "field_type_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<field_types> field_types { get; set; }

        [HasAndBelongsToMany(typeof(privileges), Lazy = true, BatchSize = 30, Table = "access_levels_to_privilege", ColumnKey = "access_level_id", ColumnRef = "privilege_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<privileges> privileges { get; set; }

        [HasAndBelongsToMany(typeof(colleges), Lazy = true, Table = "groups_to_colleges", ColumnKey = "access_level_id", ColumnRef = "college_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<colleges> colleges { get; set; }

        [HasAndBelongsToMany(typeof(campus), Lazy = true, Table = "groups_to_campus", ColumnKey = "access_level_id", ColumnRef = "campus_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<campus> campus { get; set; }

        [HasAndBelongsToMany(typeof(programs), Lazy = true, Table = "groups_to_programs", ColumnKey = "access_level_id", ColumnRef = "program_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<programs> programs { get; set; }

        [HasAndBelongsToMany(typeof(schools), Lazy = true, Table = "groups_to_schools", ColumnKey = "access_level_id", ColumnRef = "school_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<schools> schools { get; set; }

        [HasAndBelongsToMany(typeof(categories), Lazy = true, Table = "groups_to_categories", ColumnKey = "access_level_id", ColumnRef = "category_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<categories> categories { get; set; }





    }

    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class privileges
    {
        [PrimaryKey("privilege_id")]
        virtual public int id { get; set; }

        [Property("title")]
        virtual public String name { get; set; }

        [Property]
        virtual public String alias { get; set; }

        [Property]
        virtual public Boolean editable { get; set; }

        [Property]
        virtual public String discription { get; set; }

        [HasAndBelongsToMany(typeof(user_groups), Lazy = true, BatchSize = 30, Table = "access_levels_to_privilege", ColumnKey = "privilege_id", ColumnRef = "access_level_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<user_groups> access_levels { get; set; }
    }

    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class user_settings
    {
        [PrimaryKey("user_settings_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public String attr { get; set; }
    }
}
