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
using Microsoft.SqlServer.Types;
using System.Xml;
using System.Text;
using System.IO;
namespace campusMap.Models {
    [ActiveRecord(Lazy = true, BatchSize = 30)]
    public class map_views : publish_base {
        protected HelperService helperService = new HelperService();
        //public map_views() { }

        [PrimaryKey("view_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public string alias { get; set; }

        [Property("idkey")]
        virtual public string key { get; set; }

        [Property("cache_path")]
        virtual public string cache { get; set; }

        [Property]
        virtual public bool show_global_nav { get; set; }

        [Property]
        virtual public bool commentable { get; set; }

        [Property]
        virtual public bool sharable { get; set; }

        [Property]
        virtual public int width { get; set; }

        [Property]
        virtual public int height { get; set; }

        [Property]
        virtual public string fit_to_bound { get; set; }

        [Property]
        virtual public string json_style_override { get; set; }

        private IList<users> _authors = new List<users>();
        [HasAndBelongsToMany(typeof(users), Lazy = true, BatchSize = 30, Table = "authors_to_view", ColumnKey = "view_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<users> authors {
            get { return _authors; }
            set { _authors = value; }
        }

        private Byte[] _center;
        [Property(SqlType = "geography")]
        virtual public Byte[] center {
            get { return _center; }
            set { _center = value; }
        }
        public static SqlGeography AsGeography(byte[] bytes) {
            SqlGeography geo = new SqlGeography();
            using (MemoryStream stream = new System.IO.MemoryStream(bytes)) {
                using (BinaryReader rdr = new System.IO.BinaryReader(stream)) {
                    geo.Read(rdr);
                }
            }

            return geo;
        }
        virtual public string getLat() {
            // the point of these ifs are to make 100% sure that even if all the 
            // other checks failed we still have something to pass over less null
            if (this.center != null) {
                SqlGeography spatial = map_views.AsGeography(this.center);
                return spatial.Lat.ToString();
            } else {
                return UserService.getUserCoreCampus(true).latitude.ToString();
            }
        }

        virtual public string getLong() {
            if (this.center != null) {
                SqlGeography spatial = map_views.AsGeography(this.center);
                return spatial.Long.ToString();
            } else {
                return UserService.getUserCoreCampus(true).longitude.ToString();
            }


        }

        [BelongsTo]
        virtual public media_repo media { get; set; }

        [Property]
        virtual public string staticMap { get; set; }

        private IList<comments> Comments = new List<comments>();
        [HasMany(typeof(comments), Lazy = true, Table = "view_to_comments", ColumnKey = "view_id", Cascade = ManyRelationCascadeEnum.AllDeleteOrphan, Inverse = true)]
        virtual public IList<comments> comments {
            get { return Comments; }
            set { Comments = value; }
        }

        private IList<comments> Pub_comments = new List<comments>();
        [HasMany(typeof(comments), Lazy = true, Table = "view_to_comments", ColumnKey = "view_id", Where = "published=1", Cascade = ManyRelationCascadeEnum.None)]
        virtual public IList<comments> comments_pub {
            get { return Pub_comments; }
            set { Pub_comments = value; }
        }


        private IList<fields> Fields;
        [HasAndBelongsToMany(typeof(fields), Lazy = true, Table = "view_to_fields", ColumnKey = "field_id", ColumnRef = "view_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<fields> field {
            get { return Fields; }
            set { Fields = value; }
        }

        private IList<place> _places;
        [HasAndBelongsToMany(typeof(place), Table = "place_to_view", ColumnKey = "view_id", ColumnRef = "place_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> places {
            get { return _places; }
            set { _places = value; }
        }
        private IList<geometrics> _geometrics;
        [HasAndBelongsToMany(typeof(geometrics), Lazy = true, Table = "view_to_geometrics", ColumnKey = "view_id", ColumnRef = "geometric_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics> geometrics {
            get { return _geometrics; }
            set { _geometrics = value; }
        }


        [BelongsTo]
        virtual public styles forced_shapes_style { get; set; }

        [BelongsTo]
        virtual public styles forced_marker_style { get; set; }

        [BelongsTo]
        virtual public campus campus { get; set; }

        /* the virtural model in json */
        private String _options_obj;
        [Property("optionObj")]
        virtual public String options_obj {
            get { return _options_obj; }
            set { _options_obj = value; }
        }
    }
}

