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

    

    public class StylesService
    {
        private static ILog log = log4net.LogManager.GetLogger("StylesService");


        public static string getstylemodel(elementSet ele)
        {
            string _ele = "";
            _ele = getstylemodel(ele, null);
            return _ele;
        }

        public static string getstylemodel(elementSet ele,selectionSet select_val)
        {
            // lets set up the attrs for the element
            SortedDictionary<string, string> attrs = new SortedDictionary<string, string>();
            //if ( !object.ReferenceEquals(ele.attr, null) )    attrs = attrbase(attrs, ele);
            //if ( !object.ReferenceEquals(ele.events, null) )  attrs = eventbase(attrs, ele);

            if (!object.ReferenceEquals(select_val, null)) ele = selectedVal(select_val, ele);
            
                string _ele = String.Empty;
                switch (ele.type)
                {
                    case "marker":
                        {
                            _ele = FieldsService.renderSelect(ele, attrs); break;
                        }
                    case "polyline":
                        {
                            _ele = FieldsService.renderSelect(ele, attrs); break;
                        }
                    case "polygon":
                        {
                            _ele = FieldsService.renderSelect(ele, attrs); break;
                        }
                    case "rectangle":
                        {
                            _ele = FieldsService.renderSelect(ele, attrs); break;
                        }
                    case "circle":
                        {
                            _ele = FieldsService.renderSelect(ele, attrs); break;
                        }
                    case "ground":
                        {
                            _ele = FieldsService.renderSelect(ele, attrs); break;
                        }
                    case "info":
                        {
                            _ele = FieldsService.renderSelect(ele, attrs); break;
                        }

                }

                // Return the result.
                return _ele;
            
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

    }
}
