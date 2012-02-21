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
    [ActiveRecord(Lazy=true)]
    public class styles : json_autocomplete<styles>, campusMap.Models.Ijson_autocomplete
    {
        private int _id;
        [PrimaryKey("styles_id")]
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

        private string _attr;
        [Property]
        virtual public string attr
        {
            get { return _attr; }
            set { _attr = value; }
        }
        private string _model;
        [Property]
        virtual public string model
        {
            get { return _model; }
            set { _model = value; }
        }

        private int _set;
        [Property("fieldset")]
        virtual public int set
        {
            get { return _set; }
            set { _set = value; }
        }





        /*

        private IList<view> Views;
        [HasAndBelongsToMany(typeof(view), Lazy = true, Table = "view_to_field_types", ColumnKey = "field_type_id", ColumnRef = "view_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<view> views
        {
            get { return Views; }
            set { Views = value; }
        }
        private IList<media_repo> Media;
        [HasAndBelongsToMany(typeof(media_repo), Lazy = true, Table = "media_to_field_types", ColumnKey = "field_type_id", ColumnRef = "media_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<media_repo> media
        {
            get { return Media; }
            set { Media = value; }
        }

        private IList<advertisement> Ads;
        [HasAndBelongsToMany(typeof(advertisement), Lazy = true, Table = "ad_to_field_types", ColumnKey = "field_type_id", ColumnRef = "ad_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<advertisement> ads
        {
            get { return Ads; }
            set { Ads = value; }
        }

        private IList<categories> Category;
        [HasAndBelongsToMany(typeof(categories), Lazy = true, Table = "category_to_field_types", ColumnKey = "field_type_id", ColumnRef = "category_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<categories> category
        {
            get { return Category; }
            set { Category = value; }
        }

        private IList<geometrics> Geometric;
        [HasAndBelongsToMany(typeof(geometrics), Lazy = true, Table = "geometric_to_field_types", ColumnKey = "field_type_id", ColumnRef = "geometric_id", Inverse = true, NotFoundBehaviour = NotFoundBehaviour.Ignore)]
        virtual public IList<geometrics> geometric
        {
            get { return Geometric; }
            set { Geometric = value; }
        }        
        */
        





    }
}
