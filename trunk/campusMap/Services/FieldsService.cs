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

        private string Lable;
        [JsonProperty]
        public string lable { get { return Lable; } set { Lable = value; } }

        private Attr Attrs;
        [JsonProperty]
        public Attr attr { get { return Attrs; } set { Attrs = value; } }

        private IList<Option> Options;
        [JsonProperty]
        public IList<Option> options
        {
            get { return Options; } 
            set {
                //Options = (IList<Option>)value;
                IList<Option> Options = JsonConvert.DeserializeObject<IList<Option>>(JsonConvert.SerializeObject(value)); 
            }
        }
        private Events _events;
        [JsonProperty]
        public Events events { get { return _events; } set { _events = value; } }
    }
    public class Option
    {
        private string Lable;
        [JsonProperty]
        public string lable { get { return Lable; } set { Lable = value; } }

        private string Val;
        [JsonProperty]
        public string val { get { return Val; } set { Val = value; } }
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

        private string Tabindex;
        [JsonProperty]
        public string tabindex { get { return Tabindex; } set { Tabindex = value; } }

        private string Id;
        [JsonProperty]
        public string id { get { return Id; } set { Id = value; } }

        private string Style;
        [JsonProperty]
        public string style { get { return Style; } set { Style = value; } }
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
            switch (ele.type)
            {
                case "dropdown":
                    {
                        _ele = FieldsService.makeSelect(ele); break;
                    }
                case "textinput":
                    {
                        _ele = FieldsService.makeTextInput(ele); break;
                    }
                case "textarea":
                    {
                        _ele = FieldsService.makeTextarera(ele); break;
                    }
            }
            return _ele;
        }
        public static bool HasMethod( object objectToCheck, string methodName) 
        { 
            Type type = objectToCheck.GetType(); 
            return type.GetMethod(methodName) != null; 
        }


        public static string makeSelect(elementSet ele)
        {
            
            // Initialize StringWriter instance.
            StringWriter stringWriter = new StringWriter();

            // Put HtmlTextWriter in using block because it needs to call Dispose.
            using (HtmlTextWriter writer = new HtmlTextWriter(stringWriter))
            {

                    writer.Write(ele.lable);

                    // The important part:

                    if (!String.IsNullOrEmpty(ele.attr.accesskey)) writer.AddAttribute(HtmlTextWriterAttribute.Accesskey, ele.attr.accesskey);
                    if (!String.IsNullOrEmpty(ele.attr.dir)) writer.AddAttribute(HtmlTextWriterAttribute.Dir, ele.attr.dir);
                    if (!String.IsNullOrEmpty(ele.attr.ele_class)) writer.AddAttribute(HtmlTextWriterAttribute.Class, ele.attr.ele_class);
                    if (!String.IsNullOrEmpty(ele.attr.id)) writer.AddAttribute(HtmlTextWriterAttribute.Id, ele.attr.id);
                    if (!String.IsNullOrEmpty(ele.attr.style)) writer.AddAttribute(HtmlTextWriterAttribute.Style, ele.attr.style);
                    if (!String.IsNullOrEmpty(ele.attr.tabindex)) writer.AddAttribute(HtmlTextWriterAttribute.Tabindex, ele.attr.tabindex);
                    if (!String.IsNullOrEmpty(ele.attr.title)) writer.AddAttribute(HtmlTextWriterAttribute.Title, ele.attr.title);
                    if (!String.IsNullOrEmpty(ele.attr.name)) writer.AddAttribute(HtmlTextWriterAttribute.Name, ele.attr.name);

                    writer.RenderBeginTag(HtmlTextWriterTag.Select); // Begin select

                    foreach (Option _option in ele.options)
                        {
                            writer.AddAttribute(HtmlTextWriterAttribute.Value, _option.val);
                            writer.RenderBeginTag(HtmlTextWriterTag.Option); // Begin Option
                                writer.Write(_option.lable);
                            writer.RenderEndTag();
                        }
                    writer.RenderEndTag(); // End #1
            }
            // Return the result.
            return stringWriter.ToString();
        }
        public static string makeTextInput(object ele_op)
        {
            string tmp = "<input type='text' value='' name='' />";
            return tmp;
        }
        public static string makeTextarera(object ele_op)
        {
            string tmp = "<textarea>All</textarea>";
            return tmp;
        }


    }
}
