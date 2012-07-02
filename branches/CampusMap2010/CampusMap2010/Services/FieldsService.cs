#region Directives
    using System;
    using System.Data;
    using System.Configuration;
    using campusMap.Models;
    using NHibernate.Criterion;
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

    using System.Collections.ObjectModel;
    using System.Dynamic;
    using System.Linq;
    using System.Web.Script.Serialization;

#endregion

namespace campusMap.Services{


    public class elementSet
    {
        private string Type;
        [JsonProperty]
        public string type { get { return Type; } set { Type = value; } }

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

        /* dynamic based */
        public static string getfieldmodel_dynamic(string ele)
        {
            string _ele = "";
            _ele = getfieldmodel_dynamic(ele, null);
            return _ele;
        }
        public static string getfieldmodel_dynamic(string ele, string select_val)
        {

            var jss = new JavaScriptSerializer();
            var dyn_ele = jss.Deserialize<Dictionary<string, dynamic>>(ele);
            var dyn_select_val = new Dictionary<string, dynamic>();
                dyn_select_val = String.IsNullOrWhiteSpace(select_val) ? dyn_select_val : jss.Deserialize<Dictionary<string, dynamic>>(select_val);


            // lets set up the attrs for the element
            SortedDictionary<string, string> attrs = new SortedDictionary<string, string>();

            dynamic value;
            if (dyn_ele.TryGetValue("attr", out value)) attrs = attrbase_dynamic(attrs, dyn_ele);
            if (dyn_ele.TryGetValue("events", out value)) attrs = eventbase_dynamic(attrs, dyn_ele);
            if (dyn_select_val.TryGetValue("selections", out value)) dyn_ele = selectedVal_dynamic(dyn_select_val, dyn_ele);

            string _ele = String.Empty;
            string type = dyn_ele["type"];
            switch (type)
            {
                case "dropdown":
                    {
                        _ele = FieldsService.renderSelect_dynamic(dyn_ele, attrs); break;
                    }
                case "textinput":
                    {
                        _ele = FieldsService.renderTextInput_dynamic(dyn_ele, attrs); break;
                    }
                case "textarea":
                    {
                        _ele = FieldsService.renderTextarera_dynamic(dyn_ele, attrs); break;
                    }
                case "checkbox":
                    {
                        _ele = FieldsService.renderCheckbox_dynamic(dyn_ele, attrs); break;
                    }
                case "slider":
                    {
                        _ele = ""; break;// FieldsService.renderSlider_dynamic(dyn_ele, attrs); break;
                    }
            }

            // Return the result.
            return _ele;
        }
        public static SortedDictionary<string, string> attrbase_dynamic(SortedDictionary<string, string> attrs, dynamic ele)
        {
            dynamic value;
            if (ele.TryGetValue("attr", out value) && ele["attr"] !=null)
            {
                if (ele["attr"].TryGetValue("placeholder", out value)) attrs.Add("Placeholder", ele["attr"]["placeholder"]);
                if (ele["attr"].TryGetValue("accesskey", out value)) attrs.Add("Accesskey", ele["attr"]["accesskey"]);
                if (ele["attr"].TryGetValue("dir", out value)) attrs.Add("Dir", ele["attr"]["dir"]);
                if (ele["attr"].TryGetValue("ele_class", out value)) attrs.Add("Class", ele["attr"]["ele_class"]);
                if (ele["attr"].TryGetValue("id", out value)) attrs.Add("Id", ele["attr"]["id"]);
                if (ele["attr"].TryGetValue("style", out value)) attrs.Add("Style", ele["attr"]["style"]);
                if (ele["attr"].TryGetValue("tabindex", out value)) attrs.Add("Tabindex", ele["attr"]["tabindex"]);
                if (ele["attr"].TryGetValue("title", out value)) attrs.Add("Title", ele["attr"]["title"]);
                if (ele["attr"].TryGetValue("name", out value)) attrs.Add("Name", ele["attr"]["name"]);
            }
            return attrs;
        }
        public static SortedDictionary<string, string> eventbase_dynamic(SortedDictionary<string, string> attrs, dynamic ele)
        {
            dynamic value;
            if (ele.TryGetValue("events", out value) && ele["events"] !=null)
            {
                if (ele["events"].TryGetValue("onclick", out value)) attrs.Add("Onclick", ele["events"]["onclick"]);
                if (ele["events"].TryGetValue("onchange", out value)) attrs.Add("Onchange", ele["events"]["onchange"]);
            }
            return attrs;
        }
        public static dynamic selectedVal_dynamic(dynamic select_val, dynamic ele)
        {
            SortedDictionary<string, string> sel_val = new SortedDictionary<string, string>();

            if (select_val["selections"] != null && ele["type"] == "dropdown")
            {
                foreach (dynamic _option in ele["options"])
                {
                    _option["selected"] = "";
                    foreach (dynamic _val in select_val["selections"])
                    {

                        if (!String.IsNullOrEmpty(_val["val"]) && _option["val"] == _val["val"]) _option["selected"] = _val["val"];
                    }
                }
            }
            else if (select_val["selections"][0]["val"] != null)
            {
                foreach (dynamic _option in ele["options"])
                {
                    _option["selected"] = "";
                    if (select_val["selections"][0]["val"] != "")
                    {
                        _option["selected"] = select_val["selections"][0]["val"];
                    }
                }
            }
            return ele;
        }

        public static string getFieldVal(field_types field_type,fields field)
        {
            dynamic value;
            string output = "";
            var jss = new JavaScriptSerializer();

            dynamic sel = null;
            if (field != null && !String.IsNullOrEmpty(field.value))
            {
                sel = jss.Deserialize<Dictionary<string, dynamic>>(field.value.ToString());
            }

            var ele = jss.Deserialize<Dictionary<string, dynamic>>(field_type.attr.ToString());
            if (ele != null && sel != null && sel.TryGetValue("selections", out value) && ele["type"] == "dropdown")
            {
                foreach (dynamic _option in ele["options"])
                {
                    foreach (dynamic _val in sel["selections"])
                    {
                        if (_val.TryGetValue("val", out value) && _option["val"] == _val["val"]) output = _val["val"];
                    }
                }
            }
            else if (sel != null && sel["selections"][0].TryGetValue("val", out value))
            {
                foreach (dynamic _option in ele["options"])
                {
                    _option["selected"] = "";
                    if (sel["selections"][0]["val"] != "")
                    {
                        output = sel["selections"][0]["val"];
                    }
                }
            }
            return output;
        }

        public static string renderSelect_dynamic(dynamic ele, SortedDictionary<string, string> attrs)
        {
            dynamic value;
            // Initialize StringWriter instance.
            StringWriter stringWriter = new StringWriter();
            // Put HtmlTextWriter in using block because it needs to call Dispose.
            using (HtmlTextWriter writer = new HtmlTextWriter(stringWriter))
            {
                if (ele.TryGetValue("label", out value))
                {
                    writer.RenderBeginTag(HtmlTextWriterTag.Label);
                    writer.Write(ele["label"] + "<br/>");
                    writer.RenderEndTag();
                }
                if (ele["attr"].TryGetValue("multiple", out value) && ele["attr"]["multiple"]!=null) attrs.Add("Multiple", "multiple");

                foreach (KeyValuePair<string, string> attr in attrs)
                {
                    if (!object.ReferenceEquals(attr.Key, null) && !object.ReferenceEquals(attr.Value, null)) writer.AddAttribute(attr.Key, attr.Value.ToString());
                }

                writer.RenderBeginTag(HtmlTextWriterTag.Select); // Begin select

                // need to add default and seleceted
                foreach (dynamic _option in ele["options"])
                {
                    if (_option.TryGetValue("label", out value))
                    {
                        writer.AddAttribute(HtmlTextWriterAttribute.Value, _option["val"]);
                        if (_option.TryGetValue("selected", out value))
                        {
                            writer.AddAttribute(HtmlTextWriterAttribute.Selected, "selected");
                        }
                        writer.RenderBeginTag(HtmlTextWriterTag.Option); // Begin Option
                        writer.WriteEncodedText(_option["label"]!=null?_option["label"]:String.Empty);
                    }
                    else
                    {
                        if (_option.TryGetValue("selected", out value))
                        {
                            writer.AddAttribute(HtmlTextWriterAttribute.Selected, "selected");
                        }
                        writer.RenderBeginTag(HtmlTextWriterTag.Option); // Begin Option
                        writer.WriteEncodedText(_option["val"] == "True" ? _option["val"] : String.Empty);
                    }
                    writer.RenderEndTag();
                }
                writer.RenderEndTag();
                writer.Write("<br/>");
            }
            return stringWriter.ToString();
        }
        public static string renderTextInput_dynamic(dynamic ele, SortedDictionary<string, string> attrs)
        {
            dynamic value;
            StringWriter stringWriter = new StringWriter();
            using (HtmlTextWriter writer = new HtmlTextWriter(stringWriter))
            {
                if (ele.TryGetValue("label", out value))
                {
                    writer.RenderBeginTag(HtmlTextWriterTag.Label);
                    writer.Write(ele["label"] + "<br/>");
                    writer.RenderEndTag();
                }
                attrs.Add("Type", "text");
                attrs.Add("Value", (ele.TryGetValue("options", out value)) && (ele["options"][0].TryGetValue("selected", out value)) ? ele["options"][0]["selected"] : String.Empty);

                foreach (KeyValuePair<string, string> attr in attrs)
                {
                    if (!object.ReferenceEquals(attr.Key, null) && !object.ReferenceEquals(attr.Value, null)) writer.AddAttribute(attr.Key, attr.Value.ToString());
                }
                writer.RenderBeginTag(HtmlTextWriterTag.Input); // Begin select
                writer.RenderEndTag();
                writer.Write("<br/>");
            }
            return stringWriter.ToString();
        }
        public static string renderTextarera_dynamic(dynamic ele, SortedDictionary<string, string> attrs)
        {
            dynamic value;
            StringWriter stringWriter = new StringWriter();
            using (HtmlTextWriter writer = new HtmlTextWriter(stringWriter))
            {
                if (ele.TryGetValue("label", out value))
                {
                    writer.RenderBeginTag(HtmlTextWriterTag.Label);
                    writer.Write(ele["label"] + "<br/>");
                    writer.RenderEndTag();
                }
                foreach (KeyValuePair<string, string> attr in attrs)
                {
                    if (!object.ReferenceEquals(attr.Key, null) && !object.ReferenceEquals(attr.Value, null)) writer.AddAttribute(attr.Key, attr.Value.ToString());
                }
                writer.RenderBeginTag(HtmlTextWriterTag.Textarea); // Begin select
                String val=(ele.TryGetValue("options", out value)) && (ele["options"][0].TryGetValue("selected", out value)) ? ele["options"][0]["selected"] : String.Empty;
                writer.Write(val);
                writer.RenderEndTag();
                writer.Write("<br/>");
            }

            return stringWriter.ToString();
        }
        public static string renderCheckbox_dynamic(dynamic ele, SortedDictionary<string, string> attrs)
        {
            dynamic value;
            StringWriter stringWriter = new StringWriter();
            using (HtmlTextWriter writer = new HtmlTextWriter(stringWriter))
            {
                if (ele.TryGetValue("label", out value))
                {
                    writer.RenderBeginTag(HtmlTextWriterTag.Label);
                    writer.Write(ele["label"] + "<br/>");
                    writer.RenderEndTag();
                }
                attrs.Add("Type", "checkbox");

                attrs.Add("Value", ele["options"][0]["val"]);
                if (ele["options"] != null && ele["options"][0]["selected"] != null)
                {
                    attrs.Add("Selected", "selected");
                }
                foreach (KeyValuePair<string, string> attr in attrs)
                {
                    if (!object.ReferenceEquals(attr.Key, null) && !object.ReferenceEquals(attr.Value, null)) writer.AddAttribute(attr.Key, attr.Value.ToString());
                }
                writer.RenderBeginTag(HtmlTextWriterTag.Input); // Begin select

                writer.RenderEndTag();
                writer.Write("<br/>");
            }
            return stringWriter.ToString();
        }


    }
}
