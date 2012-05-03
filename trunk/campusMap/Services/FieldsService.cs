#region Directives
    using System;
    using System.Data;
    using System.Configuration;
    using campusMap.Models;
    using NHibernate.Expression;
    using System.Collections.Generic;
    using Castle.ActiveRecord;
    using System.Net;
    using System.Text.RegularExpressions;
    using System.IO;
    using System.Web;
    using System.Web.UI;
    using MonoRailHelper;
    using System.Xml;
    using System.Drawing;
    using System.Drawing.Imaging;
    using System.Drawing.Drawing2D;
    using System.Collections.Specialized;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Utilities;
    using Newtonsoft.Json.Linq;
    using campusMap.Services;
    using log4net;
    using log4net.Config;
#endregion

namespace campusMap.Services{

    public class elementSet
    {
        private string Type;
        [JsonProperty]
        public string type  { get{return Type;} set{ Type = value; }}

        private string Label;
        [JsonProperty]
        public string label { get { return Label; } set { Label = value; } }

        private Attr Attrs;
        [JsonProperty]
        public Attr attr { get { return Attrs; } set { Attrs = value; } }

        private IList<Option> Options;
        [JsonProperty]
        public IList<Option> options { get { return Options; } set { Options = value; } }

        private Events _events;
        [JsonProperty]
        public Events events { get { return _events; } set { _events = value; } }
    }
    public class selectionSet
    {
        private IList<Selection> Selections;
        [JsonProperty]
        public IList<Selection> selections { get { return Selections; } set { Selections = value; } }
    }
    public class Selection
    {
        private string Val;
        [JsonProperty]
        public string val { get { return Val; } set { Val = value; } }
    }
    public class Option
    {
        private string Label;
        [JsonProperty]
        public string label { get { return Label; } set { Label = value; } }

        private string Val;
        [JsonProperty]
        public string val { get { return Val; } set { Val = value; } }

        private string Selected;
        [JsonProperty]
        public string selected { get { return Selected; } set { Selected = value; } }
    }
    public class Attr
    {
        private string Ele_class;
        [JsonProperty]
        public string ele_class { get { return Ele_class; } set { Ele_class = value; } }

        private string Name;
        [JsonProperty]
        public string name { get { return Name; } set { Name = value; } }

        private string Title;
        [JsonProperty]
        public string title { get { return Title; } set { Title = value; } }

        private string Dir;
        [JsonProperty]
        public string dir { get { return Dir; } set { Dir = value; } }

        private string Accesskey;
        [JsonProperty]
        public string accesskey { get { return Accesskey; } set { Accesskey = value; } }

        private string Placeholder;
        [JsonProperty]
        public string placeholder { get { return Placeholder; } set { Placeholder = value; } }

        private string Tabindex;
        [JsonProperty]
        public string tabindex { get { return Tabindex; } set { Tabindex = value; } }

        private string Id;
        [JsonProperty]
        public string id { get { return Id; } set { Id = value; } }

        private string Style;
        [JsonProperty]
        public string style { get { return Style; } set { Style = value; } }

        private string Multiple;
        [JsonProperty]
        public string multiple { get { return Multiple; } set { Multiple = value; } }
    }
    public class Events
    {
        private string onClick;
        [JsonProperty]
        public string onclick { get { return onClick; } set { onClick = value; } }

        private string onChange;
        [JsonProperty]
        public string onchange { get { return onChange; } set { onChange = value; } }

    } 

    public class FieldsService{
        private static ILog log = log4net.LogManager.GetLogger("FieldsService");


        public static string getfieldmodel(elementSet ele)
        {
            string _ele = "";
            _ele = getfieldmodel(ele,null);
            return _ele;
        }

        public static string getfieldmodel(elementSet ele,selectionSet select_val)
        {
            // lets set up the attrs for the element
            SortedDictionary<string, string> attrs = new SortedDictionary<string, string>();
            if ( !object.ReferenceEquals(ele.attr, null) )    attrs = attrbase(attrs, ele);
            if ( !object.ReferenceEquals(ele.events, null) )  attrs = eventbase(attrs, ele);

            if (!object.ReferenceEquals(select_val, null)) ele = selectedVal(select_val, ele);
            
                string _ele = String.Empty;
                switch (ele.type)
                {
                    case "dropdown":
                        {
                            _ele = FieldsService.renderSelect(ele, attrs); break;
                        }
                    case "textinput":
                        {
                            _ele = FieldsService.renderTextInput(ele, attrs); break;
                        }
                    case "textarea":
                        {
                            _ele = FieldsService.renderTextarera(ele, attrs); break;
                        }
                    case "checkbox":
                        {
                            _ele = FieldsService.renderCheckbox(ele, attrs); break;
                        }
                    case "slider":
                        {
                            _ele = FieldsService.renderSlider(ele, attrs); break;
                        }
                }

                // Return the result.
                return _ele;
            
        }


        


        public static SortedDictionary<string, string> attrbase(SortedDictionary<string, string> attrs, elementSet ele)
        {
            if (!String.IsNullOrEmpty(ele.attr.placeholder)) attrs.Add("Placeholder", ele.attr.placeholder);
            if (!String.IsNullOrEmpty(ele.attr.accesskey))  attrs.Add("Accesskey", ele.attr.accesskey);
            if (!String.IsNullOrEmpty(ele.attr.dir))        attrs.Add("Dir", ele.attr.dir);
            if (!String.IsNullOrEmpty(ele.attr.ele_class))  attrs.Add("Class", ele.attr.ele_class);
            if (!String.IsNullOrEmpty(ele.attr.id))         attrs.Add("Id", ele.attr.id);
            if (!String.IsNullOrEmpty(ele.attr.style))      attrs.Add("Style", ele.attr.style);
            if (!String.IsNullOrEmpty(ele.attr.tabindex))   attrs.Add("Tabindex", ele.attr.tabindex);
            if (!String.IsNullOrEmpty(ele.attr.title))      attrs.Add("Title", ele.attr.title);
            if (!String.IsNullOrEmpty(ele.attr.name))       attrs.Add("Name", ele.attr.name);

            return attrs;
        }

        public static SortedDictionary<string, string> eventbase(SortedDictionary<string, string> attrs, elementSet ele)
        {
            if (!String.IsNullOrEmpty(ele.events.onclick))  attrs.Add("Onclick", ele.events.onclick);
            if (!String.IsNullOrEmpty(ele.events.onchange)) attrs.Add("Onchange", ele.events.onchange);

            return attrs;
        }
        public static elementSet selectedVal(selectionSet select_val, elementSet ele)
        {
            SortedDictionary<string, string> sel_val = new SortedDictionary<string, string>();

            if (select_val.selections != null && ele.type=="dropdown")
            {
                foreach (Option _option in ele.options)
                {
                    _option.selected = "";
                    foreach (Selection _val in select_val.selections)
                    {
                        if (!String.IsNullOrEmpty(_val.val) && _option.val == _val.val) _option.selected = _val.val;
                    }
                }
            }else if (select_val.selections[0].val != null){
                 foreach (Option _option in ele.options){
                     _option.selected = "";
                     if (select_val.selections[0].val!="")
                     {
                         _option.selected = select_val.selections[0].val;
                     }
                 }
            }
            return ele;
        }




        public static string renderSelect(elementSet ele, SortedDictionary<string, string> attrs)
        {
             // Initialize StringWriter instance.
            StringWriter stringWriter = new StringWriter();
            // Put HtmlTextWriter in using block because it needs to call Dispose.
            using (HtmlTextWriter writer = new HtmlTextWriter(stringWriter))
            {
                if (!String.IsNullOrEmpty(ele.label))
                {
                    writer.RenderBeginTag(HtmlTextWriterTag.Label);
                    writer.Write(ele.label+"<br/>");
                    writer.RenderEndTag();
                }
                if (!String.IsNullOrEmpty(ele.attr.multiple)) attrs.Add("Multiple", "multiple");

                foreach (KeyValuePair<string, string> attr in attrs)
                {
                    writer.AddAttribute(attr.Key, attr.Value.ToString());
                }

                writer.RenderBeginTag(HtmlTextWriterTag.Select); // Begin select

                // need to add default and seleceted
                foreach (Option _option in ele.options)
                {
                    if (!String.IsNullOrEmpty(_option.label))
                    {
                        writer.AddAttribute(HtmlTextWriterAttribute.Value, _option.val);
                        if (!String.IsNullOrEmpty(_option.selected))
                        {
                            writer.AddAttribute(HtmlTextWriterAttribute.Selected, "selected");
                        }
                        writer.RenderBeginTag(HtmlTextWriterTag.Option); // Begin Option
                        writer.WriteEncodedText(_option.label);
                    }
                    else
                    {
                        if (!String.IsNullOrEmpty(_option.selected))
                        {
                            writer.AddAttribute(HtmlTextWriterAttribute.Selected, "selected");
                        }
                        writer.RenderBeginTag(HtmlTextWriterTag.Option); // Begin Option
                        writer.WriteEncodedText(_option.val == "True"?_option.val:String.Empty);
                    }
                    writer.RenderEndTag();
                }
                writer.RenderEndTag();
                writer.Write("<br/>");
            }
            return stringWriter.ToString();
        }
        public static string renderTextInput(elementSet ele, SortedDictionary<string, string> attrs)
        {

            StringWriter stringWriter = new StringWriter();
            using (HtmlTextWriter writer = new HtmlTextWriter(stringWriter))
            {
                if (!String.IsNullOrEmpty(ele.label))
                {
                    writer.RenderBeginTag(HtmlTextWriterTag.Label);
                    writer.Write(ele.label + "<br/>");
                    writer.RenderEndTag();
                }
                attrs.Add("Type", "text");
                attrs.Add("Value", ele.options != null && ele.options[0].selected != null ? ele.options[0].selected : String.Empty);

                foreach (KeyValuePair<string, string> attr in attrs)
                {
                    writer.AddAttribute(attr.Key, attr.Value.ToString());
                }
                writer.RenderBeginTag(HtmlTextWriterTag.Input); // Begin select
                writer.RenderEndTag();
                writer.Write("<br/>");
            }
            return stringWriter.ToString();
        }
        public static string renderTextarera(elementSet ele, SortedDictionary<string, string> attrs)
        {
            StringWriter stringWriter = new StringWriter();
            using (HtmlTextWriter writer = new HtmlTextWriter(stringWriter))
            {
                if (!String.IsNullOrEmpty(ele.label))
                {
                    writer.RenderBeginTag(HtmlTextWriterTag.Label);
                    writer.Write(ele.label + "<br/>");
                    writer.RenderEndTag();
                }
                foreach (KeyValuePair<string, string> attr in attrs)
                {
                    writer.AddAttribute(attr.Key, attr.Value.ToString());
                }
                writer.RenderBeginTag(HtmlTextWriterTag.Textarea); // Begin select
                writer.Write((ele.options != null && ele.options[0].selected != null ? ele.options[0].selected : String.Empty));
                writer.RenderEndTag();
                writer.Write("<br/>");
            }
           
            return stringWriter.ToString();
        }
        public static string renderCheckbox(elementSet ele, SortedDictionary<string, string> attrs)
        {
            StringWriter stringWriter = new StringWriter();
            using (HtmlTextWriter writer = new HtmlTextWriter(stringWriter))
            {
                if (!String.IsNullOrEmpty(ele.label))
                {
                    writer.RenderBeginTag(HtmlTextWriterTag.Label);
                    writer.Write(ele.label + "<br/>");
                    writer.RenderEndTag();
                }
                attrs.Add("Type", "checkbox");

                attrs.Add("Value", ele.options[0].val);
                if (!String.IsNullOrEmpty(ele.options[0].selected))
                {
                    attrs.Add("Selected", "selected");
                }
                foreach (KeyValuePair<string, string> attr in attrs)
                {
                    writer.AddAttribute(attr.Key, attr.Value.ToString());
                }
                writer.RenderBeginTag(HtmlTextWriterTag.Input); // Begin select
                
                writer.RenderEndTag();
                writer.Write("<br/>");
            }
            return stringWriter.ToString();
        }
        public static string renderSlider(elementSet ele, SortedDictionary<string, string> attrs)
        {
            string tmp = "<textarea>All</textarea>";

            return tmp;
        }
    }
}
