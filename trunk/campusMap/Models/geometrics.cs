using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using NHibernate.Expression;
using Castle.ActiveRecord;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlTypes;
using campusMap.Services;
using Microsoft.SqlServer.Types;
using System.IO;

namespace campusMap.Models
{

    [ActiveRecord(Lazy=true, BatchSize=30)]
    public class geometrics : ActiveRecordBase<geometrics>
    {
        protected HelperService helperService = new HelperService();


        public geometrics() { }


        private int geometric_id;
        [PrimaryKey("geometric_id")]
        virtual public int id
        {
            get { return geometric_id; }
            set { geometric_id = value; }
        }
        /* private string Coordinate;
        [Property]
        virtual public string coordinate
        {
            get { return Coordinate; }
            set { Coordinate = value; }
        }*/

        private byte[] Boundary;
        [Property(SqlType = "geography", ColumnType = "BinaryBlob")]
        //[Property]
        virtual public byte[] boundary
        {
            get { return Boundary; }
            set { Boundary = value; }
        }

        public static SqlGeography AsGeography( byte[] bytes)
        {
            SqlGeography geo = new SqlGeography();
            using (MemoryStream stream = new System.IO.MemoryStream(bytes))
            {
                using (BinaryReader rdr = new System.IO.BinaryReader(stream))
                {
                    geo.Read(rdr);
                }
            }

            return geo;
        }


        public static byte[] AsByteArray(SqlGeography geography)
        {
            if (geography == null)
                return null;

            using (MemoryStream stream = new System.IO.MemoryStream())
            {
                using (BinaryWriter writer = new System.IO.BinaryWriter(stream))
                {
                    geography.Write(writer);
                    return stream.ToArray();
                }
            }
        }



        private int Default_Type;
        [Property]
        virtual public int default_type
        {
            get { return Default_Type; }
            set { Default_Type = value; }
        }
        private DateTime? Publish_Time;
        [Property]
        virtual public DateTime? publish_time
        {
            get { return Publish_Time; }
            set
            {
                //DateTime bla = DateTime.MinValue;
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue))
                {
                    // bla is a valid sql datetime
                    Publish_Time = value;

                }
            }
        }
        private DateTime? Creation_Date;
        [Property]
        virtual public DateTime? creation_date
        {
            get { return Creation_Date; }
            set
            {
                //DateTime bla = DateTime.MinValue;
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue))
                {
                    // bla is a valid sql datetime
                    Creation_Date = value;

                }
            }
        }
        private DateTime? Updated_Date;
        [Property]
        virtual public DateTime? updated_date
        {
            get { return Updated_Date; }
            set
            {
                if ((value >= (DateTime)SqlDateTime.MinValue) && (value <= (DateTime)SqlDateTime.MaxValue))
                {
                    // bla is a valid sql datetime
                    Updated_Date = value;

                }
            }
        }

        private status _status;
        [BelongsTo("status")]
        virtual public status status
        {
            get { return _status; }
            set { _status = value; }
        }


        private media_repo Media;
        [BelongsTo]
        virtual public media_repo media
        {
            get { return Media; }
            set { Media = value; }
        }





        private IList<tags> Tags = new List<tags>();
        [HasAndBelongsToMany(typeof(tags), Lazy = true, Table = "geometric_to_tags", ColumnKey = "geometric_id", ColumnRef = "tag_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<tags> tags
        {
            get { return Tags; }
            set { Tags = value; }
        }

        private IList<usertags> usertags = new List<usertags>();
        [HasAndBelongsToMany(typeof(usertags), Lazy = true, Table = "geometric_to_usertags", ColumnKey = "geometric_id", ColumnRef = "usertag_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<usertags> Usertags
        {
            get { return usertags; }
            set { usertags = value; }
        }
        private IList<geometrics_types> Geometric_Types = new List<geometrics_types>();
        [HasAndBelongsToMany(typeof(geometrics_types), Lazy = true, Table = "geometrics_to_types", ColumnKey = "geometric_id", ColumnRef = "geometrics_type_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics_types> geometric_types
        {
            get { return Geometric_Types; }
            set { Geometric_Types = value; }
        }
        private IList<place> places;
        [HasAndBelongsToMany(typeof(place), Lazy = true, Table = "place_to_geometrics", ColumnKey = "place_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<place> Places
        {
            get { return places; }
            set { places = value; }
        }
        private IList<fields> Fields;
        [HasAndBelongsToMany(typeof(fields), Lazy = true, Table = "geometrics_to_fields", ColumnKey = "field_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<fields> field
        {
            get { return Fields; }
            set { Fields = value; }
        }



        private IList<styles> _style;
        [HasAndBelongsToMany(typeof(styles), Lazy = true, Table = "geometrics_to_styles", ColumnKey = "style_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<styles> style
        {
            get { return _style; }
            set { _style = value; }
        }



        private IList<media_repo> images = new List<media_repo>();
        [HasAndBelongsToMany(typeof(media_repo), Lazy = true, BatchSize = 30, Table = "geometric_to_media", ColumnKey = "geometric_id", ColumnRef = "media_id", OrderBy = "geometric_order", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<media_repo> Images
        {
            get { return images; }
            set { images = value; }
        }


        private IList<authors> _authors = new List<authors>();
        [HasAndBelongsToMany(typeof(authors), Lazy = true, BatchSize = 30, Table = "authors_to_geometrics", ColumnKey = "geometric_id", ColumnRef = "author_id", NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<authors> Authors
        {
            get { return _authors; }
            set { _authors = value; }
        }
        private authors _editing;
        [BelongsTo("author_editing")]
        virtual public authors editing
        {
            get { return _editing; }
            set { _editing = value; }
        }

        virtual public bool isPublished()
        {
            if (this.status == ActiveRecordBase<status>.Find(3) && this.publish_time != null && this.publish_time.Value.CompareTo(DateTime.Now) <= 0)
            {
                return true;
            }
            return false;
        }

        virtual public bool isCheckedOutNull()
        {
            bool flag = false;
            if (editing == null)
                flag = true;

            return flag;
        }




    }

    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class geometrics_types : ActiveRecordBase<geometrics_types>
    {
        private int geometrics_type_id;
        [PrimaryKey("geometrics_type_id")]
        virtual public int id
        {
            get { return geometrics_type_id; }
            set { geometrics_type_id = value; }
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
        private IList<geometrics> geometrics;
        [HasAndBelongsToMany(typeof(geometrics), Lazy = true, Table = "geometrics_to_types", ColumnKey = "geometric_id", ColumnRef = "geometrics_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics> Geometrics
        {
            get { return geometrics; }
            set { geometrics = value; }
        }

        private IList<style_option_types> _ops;
        [HasAndBelongsToMany(typeof(style_option_types), Lazy = true, Table = "style_option_types_to_geometrics_types", ColumnKey = "geometrics_type_id", ColumnRef = "style_option_type_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<style_option_types> ops
        {
            get { return _ops; }
            set { _ops = value; }
        }
    }



    [ActiveRecord(Lazy = true, BatchSize = 10)]
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

    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class geometrics_status
    {
        private int id;
        [PrimaryKey]
        virtual public int Id
        {
            get { return id; }
            set { id = value; }
        }
        private String title;
        [Property]
        virtual public String Title
        {
            get { return title; }
            set { title = value; }
        }
    }


    [ActiveRecord(Lazy = true, BatchSize = 5)]
    public class events_set : ActiveRecordBase<events_set>
    {
        private int events_set_id;
        [PrimaryKey("events_set_id")]
        virtual public int id
        {
            get { return events_set_id; }
            set { events_set_id = value; }
        }
        private styles _style;
        [BelongsTo("style_id")]
        virtual public styles style
        {
            get { return _style; }
            set { _style = value; }
        }
        private zoom_levels _zoom;
        [BelongsTo("zoom_id")]
        virtual public zoom_levels zoom
        {
            get { return _zoom; }
            set { _zoom = value; }
        }
        private IList<geometric_events> _events;
        [HasAndBelongsToMany(typeof(geometric_events), Lazy = true, Table = "geometric_events_to_events_set", ColumnKey = "geometric_event_id", ColumnRef = "events_set_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]//[Property]
        virtual public IList<geometric_events> events
        {
            get { return _events; }
            set { _events = value; }
        }
    }


    [ActiveRecord(Lazy = true)]
    public class geometric_events : ActiveRecordBase<geometric_events>
    {
        private int _id;
        [PrimaryKey("geometric_event_id")]
        virtual public int id
        {
            get { return _id; }
            set { _id = value; }
        }

        private string _name;
        [Property]
        virtual public string name
        {
            get { return _name; }
            set { _name = value; }
        }

        private string _f_name;
        [Property]
        virtual public string friendly_name
        {
            get { return _f_name; }
            set { _f_name = value; }
        }




        /* not sure on these ties  */
        private IList<style_options> _options;
        [HasAndBelongsToMany(typeof(style_options), Lazy = true, Table = "geometric_events_to_style_options", ColumnKey = "geometric_event_id", ColumnRef = "style_option_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]//[Property]
        virtual public IList<style_options> options
        {
            get { return _options; }
            set { _options = value; }
        }
        private IList<zoom_levels> _zoom;
        [HasAndBelongsToMany(typeof(zoom_levels), Lazy = true, Table = "geometric_events_to_zoom", ColumnKey = "zoom_id", ColumnRef = "geometric_event_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]//[Property]
        virtual public IList<zoom_levels> zoom
        {
            get { return _zoom; }
            set { _zoom = value; }
        }
        /* EOF not sure on these ties  */





        virtual public IList<style_options> getUsed(styles style, zoom_levels zoom)
        {
            IList<style_options> used = new List<style_options>();
            if (style.id > 0)
            {
                style_option_types[] all_op = ActiveRecordBase<style_option_types>.FindAll();
                foreach (style_option_types ops in all_op)
                {
                    if (style._option != null && ops.style_type.Contains(style.type) && style._option.Count > 0)
                    {
                        foreach (style_options op in style._option)
                        {
                            if (this._id == op.user_event.id)
                            {
                                if (op.value != "")
                                {
                                    used.Add(op);
                                }
                            }
                        }
                    }
                }
            }
            return used;
        }

        virtual public IList<style_option_types> getUnUsed(styles style,zoom_levels zoom){
            IList<style_option_types> unUsed = new List<style_option_types>();
            //IList<style_options> used = getUsed();
            if (style.id > 0)
            {
                style_option_types[] all_op = ActiveRecordBase<style_option_types>.FindAll();
                foreach (style_option_types ops in all_op)
                {
                    if (ops.style_type.Contains(style.type))
                    {
                        if (style._option != null && style._option.Count > 0)
                        {
                            foreach (style_options op in style._option)
                            {
                                if (this._id == op.user_event.id)
                                {
                                    if (op.value == "")
                                    {
                                        unUsed.Add(ops);
                                    }
                                }
                            }
                        }
                        else
                        {
                            unUsed.Add(ops);
                        }
                    }
                }
            }
            return unUsed;
        }

        virtual public IList<style_option_types> getRemaining(styles style, zoom_levels zoom)
        {
            IList<style_option_types> remaining = new List<style_option_types>();

            style_option_types[] all_op = ActiveRecordBase<style_option_types>.FindAll();
            if (style.id > 0)
            {
                IList<style_options> used = getUsed(style,zoom);
                IList<style_option_types> unUsed = getUnUsed(style,zoom);
                foreach (style_option_types ops in all_op)
                {
                    bool op_added = false;
                    if (used != null)
                    {
                        foreach (style_options op in used)
                        {
                            if (op.type != ops)
                            {
                                remaining.Add(ops);
                                op_added = true;
                            }
                        }
                        if (!op_added && (unUsed == null || !unUsed.Contains(ops)))
                        {
                            remaining.Add(ops);
                        }
                    }
                    else if (unUsed == null || !unUsed.Contains(ops))
                    {
                        remaining.Add(ops);
                    }
                }
            }
            else
            {
                 foreach (style_option_types ops in all_op)
                {
                    remaining.Add(ops);
                }
            }
            return remaining;
        }

    }
}

