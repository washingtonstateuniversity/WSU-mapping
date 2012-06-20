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
#endregion

namespace campusMap.Services{
    /*
    <!--
    Marker/Polyline/Polygon/Rectangle/Circle
    -----------------------------
    visible		bool
    zIndex		int
	
	
	
    Polyline/Polygon/Rectangle/Circle
    -----------------------------
    strokeColor	#hex
    strokeOpacity	float
    strokeWeight	int
	
	
	
    Polygon/Rectangle/Circle
    -----------------------------
    fillColor	#hex
    fillOpacity	float
	
    Polyline/Polygon
    -----------------------------
    geodesic	bool
	
	
	
    Marker
    -----------------------------
    flat		bool
    cursor		String
    clickable	bool
    animation - 
            BOUNCE
            DROP
    icon	  - 
            anchor 	Point(x:number, y:number)
            origin  	(0, 0)  Point(x:number, y:number)
            scaledSize 	Size(width:number, height:number, widthUnit?:string, heightUnit?:string)
            size	Size(width:number, height:number, widthUnit?:string, heightUnit?:string)
            url		string
    raiseOnDrag	bool
    shadow	  - 
            anchor 	Point(x:number, y:number)
            origin  	(0, 0)  Point(x:number, y:number)
            scaledSize 	Size(width:number, height:number, widthUnit?:string, heightUnit?:string)
            size	Size(width:number, height:number, widthUnit?:string, heightUnit?:string)
            url		string
    title		String
    shape	  -
            coords	Array.<number>
            type	string //circle, poly or rect.
			
    -->

    enum BOUNDARY_TYPES     { MARKER, POLYLINE, POLYGON, RECTANGLE, CIRCLE };


    enum all_OPTIONS { visible, zIndex, strokeColor, strokeOpacity, strokeWeight, fillColor, fillOpacity, geodesic, flat, cursor, clickable, animation, icon, raiseOnDrag, shadow, title, shape, anchor, origin, scaledSize, size, url, coords, type };

    enum POLYLINE_OPTIONS   { visible, zIndex, strokeColor, strokeOpacity, strokeWeight, geodesic };
    enum POLYGON_OPTIONS    { visible, zIndex, strokeColor, strokeOpacity, strokeWeight, fillColor, fillOpacity, geodesic };
    enum RECTANGLE_OPTIONS  { visible, zIndex, strokeColor, strokeOpacity, strokeWeight, fillColor, fillOpacity };
    enum CIRCLE_OPTIONS     { visible, zIndex, strokeColor, strokeOpacity, strokeWeight, fillColor, fillOpacity };
    enum MARKER_OPTIONS     { visible, zIndex, flat, cursor, clickable, animation, icon, raiseOnDrag, shadow, title, shape };
                            enum ICON_OPTIONS       { anchor, origin, scaledSize, size, url };
                            enum SHADOW_OPTIONS     { anchor, origin, scaledSize, size, url };
                            enum SHAPE_OPTIONS      { coords, type };

    public class boundary
    {
        private boundary_type _type;
        [JsonProperty]
        public boundary_type type { get { return _type; } set { _type = value; } }

        private IList<boundary_option> _options;
        [JsonProperty]
        public IList<boundary_option> options { get { return _options; } set { _options = value; } }

    }
    public class boundary_type
    {
        private string _name;
        [JsonProperty]
        public string type { get { return _type; } set { _type = value; } }

        private string _options;
        [JsonProperty]
        public IList<boundary_option> options { get { return _options; } set { _options = value; } }

    }
    public class boundary_option
    {
        private string _op;
        [JsonProperty]
        public string op { get { return _op; } set { _op = value; } }
        private string Val;
        [JsonProperty]
        public string val { get { return Val; } set { Val = value; } }
        private string Val;
        [JsonProperty]
        public string val { get { return Val; } set { Val = value; } }
    }
    */


    public class StylesService
    {
        private static ILog log = log4net.LogManager.GetLogger("StylesService");


 

    }
}
