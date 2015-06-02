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
using System.IO;
using System.Linq;

namespace campusMap.Models {

    [ActiveRecord(Lazy = true, BatchSize = 30)]
    public class geometrics : publish_base {
        protected HelperService helperService = new HelperService();
        protected geometricService geometricService = new geometricService();

        public geometrics() { }

        [PrimaryKey("geometric_id")]
        virtual public int id { get; set; }

        [Property(SqlType = "geography", ColumnType = "BinaryBlob")]
        virtual public byte[] boundary { get; set; }

        virtual public dynamic latlongs {
            get
            {
                var gem = "";
                if (this.boundary != null)
                {
                    SqlGeography spatial = geometrics.AsGeography(this.boundary);
                    string sp_type = spatial.STGeometryType().ToString().ToUpper();
                    switch (sp_type)
                    {
                        case "POINT":
                            gem = geometricService.outputRawPoint(spatial);
                            break;
                        case "LINESTRING":
                            gem = geometricService.outputRawLineString(spatial);
                            break;
                        case "POLYGON":
                            gem = geometricService.outputRawPolygon(spatial);
                            break;
                        case "MULTIPOINT":
                            break;
                        case "MULTILINESTRING":
                            break;
                        case "MULTIPOLYGON":
                            gem = geometricService.outputRawPolygon(spatial);
                            String[] lines = gem.Split(new string[] { "SPLIT" }, StringSplitOptions.None);
                            return lines;

                            break;
                    }
                }
                return gem;
            }
            set{}
        }





        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public string encoded { get; set; }

        [Property]
        virtual public string staticMap { get; set; }

        public static SqlGeography AsGeography(byte[] bytes) {
            SqlGeography geo = new SqlGeography();
            using (MemoryStream stream = new System.IO.MemoryStream(bytes)) {
                using (BinaryReader rdr = new System.IO.BinaryReader(stream)) {
                    geo.Read(rdr);
                }
            }

            return geo;
        }

        public static byte[] AsByteArray(SqlGeography geography) {
            if (geography == null)
                return null;

            using (MemoryStream stream = new System.IO.MemoryStream()) {
                using (BinaryWriter writer = new System.IO.BinaryWriter(stream)) {
                    geography.Write(writer);
                    return stream.ToArray();
                }
            }
        }

        [BelongsTo("default_type")]
        virtual public geometrics_types default_type { get; set; }

        [BelongsTo("parent")]
        virtual public geometrics parent { get; set; }

        //[HasAndBelongsToMany(typeof(geometrics), Lazy = true, Table = "geometrics_to_geoparents", ColumnKey = "parent_geometric_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        [HasMany(typeof(geometrics), Lazy = false, Cascade = ManyRelationCascadeEnum.AllDeleteOrphan)]
        virtual public IList<geometrics> children { get; set; }



        [BelongsTo]
        virtual public media_repo media { get; set; }

        [HasAndBelongsToMany(typeof(tags), Lazy = true, Table = "geometric_to_tags", ColumnKey = "geometric_id", ColumnRef = "tag_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<tags> tags { get; set; }

        [HasAndBelongsToMany(typeof(geometrics_types), Lazy = true, Table = "geometrics_to_types", ColumnKey = "geometric_id", ColumnRef = "geometrics_type_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics_types> geometric_types { get; set; }

        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_geometrics", ColumnKey = "place_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places { get; set; }

        [HasAndBelongsToMany(typeof(map_views), Lazy = true, Table = "view_to_geometrics", ColumnKey = "geometric_id", ColumnRef = "view_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<map_views> views { get; set; }

        [HasAndBelongsToMany(typeof(fields), Lazy = true, Table = "geometrics_to_fields", ColumnKey = "field_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<fields> field { get; set; }

        [HasAndBelongsToMany(typeof(styles), Lazy = true, Table = "geometrics_to_styles", ColumnKey = "geometric_id", ColumnRef = "style_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<styles> style { get; set; }

        [HasAndBelongsToMany(typeof(media_repo), Lazy = true, BatchSize = 30, Table = "geometric_to_media", ColumnKey = "geometric_id", ColumnRef = "media_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<media_repo> Images { get; set; }

        [HasAndBelongsToMany(typeof(users), Lazy = true, BatchSize = 30, Table = "authors_to_geometrics", ColumnKey = "geometric_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<users> Authors { get; set; }



    }


    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class geometrics_types : ActiveRecordBase<geometrics_types> {
        [PrimaryKey("geometrics_type_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public string attr { get; set; }

        [HasAndBelongsToMany(typeof(geometrics), Lazy = true, Table = "geometrics_to_types", ColumnKey = "geometric_id", ColumnRef = "geometrics_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics> Geometrics { get; set; }

        [HasAndBelongsToMany(typeof(style_option_types), Lazy = true, Table = "style_option_types_to_geometrics_types", ColumnKey = "geometrics_type_id", ColumnRef = "style_option_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<style_option_types> ops { get; set; }
    }

    [ActiveRecord(Lazy = true, BatchSize = 10)]
    public class geometrics_media : ActiveRecordBase<geometrics_media> {

        [PrimaryKey]
        virtual public int Id { get; set; }

        [BelongsTo("geometric_id")]
        virtual public geometrics geometric { get; set; }

        [BelongsTo("media_id")]
        virtual public media_repo Media { get; set; }

        [Property]
        virtual public int geometric_order { get; set; }
    }

    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class geometrics_status {

        [PrimaryKey]
        virtual public int Id { get; set; }

        [Property]
        virtual public String Title { get; set; }
    }


    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class events_set : ActiveRecordBase<events_set> {
        [PrimaryKey("events_set_id")]
        virtual public int id { get; set; }

        [BelongsTo("style_id")]
        virtual public styles style { get; set; }

        [BelongsTo("zoom_id")]
        virtual public zoom_levels zoom { get; set; }

        [HasAndBelongsToMany(typeof(geometric_events), Lazy = true, Table = "geometric_events_to_events_set", ColumnKey = "geometric_event_id", ColumnRef = "events_set_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]//[Property]
        virtual public IList<geometric_events> events { get; set; }
    }


    [ActiveRecord(Lazy = true)]
    public class geometric_events : ActiveRecordBase<geometric_events> {
        protected HelperService helperService = new HelperService();

        [PrimaryKey("geometric_event_id")]
        virtual public int id { get; set; }

        [Property]
        virtual public string name { get; set; }

        [Property]
        virtual public string friendly_name { get; set; }

        /* not sure on these ties  */
        private IList<style_options> _options;
        [HasAndBelongsToMany(typeof(style_options), Lazy = true, Table = "geometric_events_to_style_options", ColumnKey = "geometric_event_id", ColumnRef = "style_option_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]//[Property]
        virtual public IList<style_options> options {
            get { return _options; }
            set { _options = value; }
        }
        /* EOF not sure on these ties  */


        /* this is to let us just add or remove a file to add
         * an option to the styles.  Goal here is that if we
         * have a file it'll get pulled in and put to the json
         * this is an extension of the "virtual" model idea
         */
        virtual public String[] getOptions(string gType) {
            String filePath = HelperService.getRootPath() + "Views/admin/maps/styles/options/" + gType + "/";
            String[] used = Directory.GetFiles(filePath, "*.vm").Select(fileName => Path.GetFileNameWithoutExtension(fileName)).ToArray();
            return used;
        }




        virtual public IList<style_options> getUsed(styles style, geometric_events events) {
            IList<style_options> used = new List<style_options>();
            if (style.id > 0) {
                style_option_types[] all_op = ActiveRecordBase<style_option_types>.FindAll();
                foreach (style_option_types ops in all_op) {
                    if (style._option != null && ops.style_type.Contains(style.type) && style._option.Count > 0) {
                        foreach (style_options op in style._option) {
                            if (this.id == op.user_event.id) {
                                if (op.value != "") {
                                    used.Add(op);
                                }
                            }
                        }
                    }
                }
            }
            return used;
        }

        virtual public IList<style_option_types> getUnUsed(styles style, geometric_events events) {
            IList<style_option_types> unUsed = new List<style_option_types>();
            //IList<style_options> used = getUsed();
            if (style.id > 0) {
                style_option_types[] all_op = ActiveRecordBase<style_option_types>.FindAll();
                foreach (style_option_types ops in all_op) {
                    if (ops.style_type.Contains(style.type)) {
                        if (style._option != null && style._option.Count > 0) {
                            foreach (style_options op in style._option) {
                                if (this.id == op.user_event.id) {
                                    if (op.value == "") {
                                        unUsed.Add(ops);
                                    }
                                }
                            }
                        } else {
                            unUsed.Add(ops);
                        }
                    }
                }
            }
            return unUsed;
        }

        virtual public IList<style_option_types> getRemaining(styles style, geometric_events events) {
            IList<style_option_types> remaining = new List<style_option_types>();

            style_option_types[] all_op = ActiveRecordBase<style_option_types>.FindAll();
            if (style.id > 0) {
                IList<style_options> used = getUsed(style, events);
                IList<style_option_types> unUsed = getUnUsed(style, events);
                foreach (style_option_types ops in all_op) {
                    bool op_added = false;
                    if (used != null) {
                        foreach (style_options op in used) {
                            if (op.type != ops) {
                                remaining.Add(ops);
                                op_added = true;
                            }
                        }
                        if (!op_added && (unUsed == null || !unUsed.Contains(ops))) {
                            remaining.Add(ops);
                        }
                    } else if (unUsed == null || !unUsed.Contains(ops)) {
                        remaining.Add(ops);
                    }
                }
            } else {
                foreach (style_option_types ops in all_op) {
                    remaining.Add(ops);
                }
            }
            return remaining;
        }

    }
}

