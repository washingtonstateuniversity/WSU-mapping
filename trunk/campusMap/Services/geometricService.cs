#region Directives
    using System;
    using System.Data;
    using System.Configuration;
    using System.Collections.Generic;
    using System.Collections.Specialized;
    using System.Drawing;
    using System.Drawing.Imaging;
    using System.Drawing.Drawing2D;
    using System.IO;
    using System.Net;
    using System.Text;
    using System.Text.RegularExpressions;
    using System.Xml;
    using System.Web;
    using System.Web.Security;
    using System.Web.UI;
    using System.Web.UI.WebControls;
    using System.Web.UI.WebControls.WebParts;
    using System.Web.UI.HtmlControls;
    using System.Data.SqlTypes;

    using Microsoft.SqlServer.Types;

    using NHibernate.Expression;
    using Castle.ActiveRecord;
    using Castle.ActiveRecord.Queries;
    using MonoRailHelper;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Utilities;
    using Newtonsoft.Json.Linq;

    using log4net;
    using log4net.Config;

    using campusMap.Models;
    using campusMap.Services;
#endregion
namespace campusMap.Services
{
    public class geometricService
    {
        public string getShapeLatLng_json_str(int id, bool showOnlyEncoded)
        {
            if (showOnlyEncoded == null) showOnlyEncoded = true;
            string gem = "";
            geometrics geometric = ActiveRecordBase<geometrics>.Find(id);
            if (geometric.boundary != null)
            {
                SqlGeography spatial = geometrics.AsGeography(geometric.boundary);
                string sp_type = spatial.STGeometryType().ToString().ToUpper();
                switch (sp_type)
                {
                    case "POINT":
                        gem = outputRawPoint(spatial);
                        break;
                    case "LINESTRING":
                        gem = outputRawLineString(spatial);
                        break;
                    case "POLYGON":
                        gem = outputRawPolygon(spatial);
                        break;
                    case "MULTIPOINT":
                        break;
                    case "MULTILINESTRING":
                        break;
                    case "MULTIPOLYGON":
                        break;
                }
            }
            String shape = "";
            shape += @"
                {";
            String shapeOptions = "";

                shapeOptions += @"       ""name"":""" + geometric.name + @""",";
                shapeOptions += (showOnlyEncoded ? @"      ""latlng_str"":""" + gem + @"""," : "");
                shapeOptions += @"       ""encoded"":""" + geometric.encoded + @""",";
                shapeOptions += (geometric.style.Count>0?@"      ""style"":""" + geometric.style[0] + @""",":"");
                shapeOptions += @"      ""type"":""" + geometric.default_type.name + @"""";

            shape += shapeOptions;
            shape += @"
                }";
            return shape;
        }
        /*      public void ProcessRequest(HttpContext context)
               {
                   //Set the MIME type for KML
                   context.Response.ContentType = "application/vnd.google-earth.kml+xml";

                   XmlDocument kmlDoc = new XmlDocument();
                   XmlDeclaration xmlDeclaration = kmlDoc.CreateXmlDeclaration("1.0", "utf-8", null);
                   // Create the root element
                   XmlElement rootNode = kmlDoc.CreateElement("kml");
                   rootNode.SetAttribute("xmlns", @"http://www.opengis.net/kml/2.2");
                   kmlDoc.InsertBefore(xmlDeclaration, kmlDoc.DocumentElement);
                   kmlDoc.AppendChild(rootNode);
                   XmlElement documentNode = kmlDoc.CreateElement("Document");
                   rootNode.AppendChild(documentNode);

                   XmlElement styleNode = kmlDoc.CreateElement("Style");
                   styleNode.SetAttribute("id", @"examplePolyStyle");
                   documentNode.AppendChild(styleNode);

                   XmlElement polystyleNode = kmlDoc.CreateElement("PolyStyle");
                   styleNode.AppendChild(polystyleNode);

                   XmlElement colorNode = kmlDoc.CreateElement("color");
                   polystyleNode.AppendChild(colorNode);
                   colorNode.InnerText = "ff0000cc";

                   XmlElement colorModeNode = kmlDoc.CreateElement("colorMode");
                   polystyleNode.AppendChild(colorModeNode);
                   colorModeNode.InnerText = "random";

                   SqlConnection myConn = new SqlConnection("server=ENTERYOURSERVERNAMEHERE;Trusted_Connection=yes;database=Spatial");
                   //Open the connection
                   myConn.Open();
                   //Define the stored procedure to execute
                   String myQuery = "dbo.uspEcoFootprint";
                   SqlCommand myCMD = new SqlCommand(myQuery, myConn);
                   myCMD.CommandType = System.Data.CommandType.StoredProcedure;
                   //Create a reader for the resultset
                   SqlDataReader myReader = myCMD.ExecuteReader();

                   while (myReader.Read())
                   {
                       SqlGeography shape = new SqlGeography();
                       shape = (SqlGeography)myReader["Shape"];

                       XmlElement placeMarkNode = kmlDoc.CreateElement("Placemark");
                       documentNode.AppendChild(placeMarkNode);

                       // Create the required nodes
                       XmlElement nameNode = kmlDoc.CreateElement("name");
                       XmlText nameText = kmlDoc.CreateTextNode(myReader["Title"].ToString());
                       placeMarkNode.AppendChild(nameNode);
                       nameNode.AppendChild(nameText);

                       XmlElement descNode = kmlDoc.CreateElement("description");
                       XmlText descriptionText = kmlDoc.CreateTextNode(myReader["Description"].ToString());
                       placeMarkNode.AppendChild(descNode);
                       descNode.AppendChild(descriptionText);

                       XmlElement styleUrlNode = kmlDoc.CreateElement("styleUrl");
                       XmlText styleUrlText = kmlDoc.CreateTextNode("#examplePolyStyle");
                       placeMarkNode.AppendChild(styleUrlNode);
                       styleUrlNode.AppendChild(styleUrlText);

                       switch (shape.STGeometryType().ToString())
                       {
                           case "Point":
                               placeMarkNode.AppendChild(createPoint(kmlDoc, shape, myReader["FootPrint"].ToString()));
                               break;
                           case "LineString":
                               placeMarkNode.AppendChild(createLineString(kmlDoc, shape, myReader["FootPrint"].ToString()));
                               break;
                           case "Polygon":
                               placeMarkNode.AppendChild(createPolygon(kmlDoc, shape, myReader["FootPrint"].ToString()));
                               break;
                           case "MultiPoint":

                           case "MultiLineString":
                           case "MultiPolygon":
                           case "GeometryCollection":
                               XmlElement multiGeom = kmlDoc.CreateElement("MultiGeometry");
                               placeMarkNode.AppendChild(multiGeom);
                               for (int g = 1; g <= shape.STNumGeometries(); g++)
                               {
                                   switch (shape.STGeometryN(g).STGeometryType().ToString())
                                   {
                                       case "Point":
                                           multiGeom.AppendChild(createPoint(kmlDoc, shape.STGeometryN(g), myReader["FootPrint"].ToString()));
                                           break;
                                       case "LineString":
                                           multiGeom.AppendChild(createLineString(kmlDoc, shape.STGeometryN(g), myReader["FootPrint"].ToString()));
                                           break;
                                       case "Polygon":
                                           multiGeom.AppendChild(createPolygon(kmlDoc, shape.STGeometryN(g), myReader["FootPrint"].ToString()));
                                           break;
                                   }
                               }
                               break;
                       }
                   }
                   //Close the reader
                   myReader.Close();
                   //Close the connection
                   myConn.Close();

                   XmlTextWriter writer = new XmlTextWriter(context.Response.OutputStream, null);
                   kmlDoc.WriteTo(writer);
                   writer.Flush();

               }*/

        public XmlElement createPoint(XmlDocument kmlDoc, SqlGeography shape, String Z)
        {
            XmlElement pointNode = kmlDoc.CreateElement("Point");
            XmlElement coordsNode = kmlDoc.CreateElement("coordinates");
            coordsNode.InnerText = string.Format("{0},{1},{2}", shape.Lat.ToString(), shape.Long.ToString(), Z);
            pointNode.AppendChild(coordsNode);
            return pointNode;
        }
        public XmlElement createLineString(XmlDocument kmlDoc, SqlGeography shape, String Z)
        {
            XmlElement lineStringNode = kmlDoc.CreateElement("LineString");
            XmlElement coordsNode = kmlDoc.CreateElement("coordinates");
            StringBuilder coordsString = new StringBuilder("");
            for (int i = 1; i <= shape.STNumPoints(); i++)
            {
                coordsString.Append(string.Format("{0},{1},{2}", shape.STPointN(i).Long.ToString(), shape.STPointN(i).Lat.ToString(), Z));
                coordsString.Append(Environment.NewLine);
            }
            coordsNode.InnerText = coordsString.ToString();
            lineStringNode.AppendChild(coordsNode);
            return lineStringNode;
        }
        public XmlElement createPolygon(XmlDocument kmlDoc, SqlGeography shape, String Z)
        {
            XmlElement polygonNode = kmlDoc.CreateElement("Polygon");

            XmlElement extrudeNode = kmlDoc.CreateElement("extrude");
            XmlText extrudeText = kmlDoc.CreateTextNode("1");
            extrudeNode.AppendChild(extrudeText);
            polygonNode.AppendChild(extrudeNode);

            XmlElement altitudeNode = kmlDoc.CreateElement("altitudeMode");
            XmlText altitudeText = kmlDoc.CreateTextNode("relativeToGround");
            altitudeNode.AppendChild(altitudeText);
            polygonNode.AppendChild(altitudeNode);

            XmlElement outerboundaryNode = kmlDoc.CreateElement("outerBoundaryIs");
            polygonNode.AppendChild(outerboundaryNode);

            XmlElement linearRingNode = kmlDoc.CreateElement("LinearRing");
            outerboundaryNode.AppendChild(linearRingNode);

            XmlElement coordsNode = kmlDoc.CreateElement("coordinates");
            StringBuilder coordsString = new StringBuilder("");
            for (int k = 1; k <= shape.RingN(1).STNumPoints(); k++)
            {
                coordsString.Append(string.Format("{0},{1},{2}", shape.RingN(1).STPointN(k).Long.ToString(), shape.RingN(1).STPointN(k).Lat.ToString(), Z));
                coordsString.Append(Environment.NewLine);
            }
            coordsNode.InnerText = coordsString.ToString();
            linearRingNode.AppendChild(coordsNode);
            return polygonNode;
        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
        public string outputRawPolygon(SqlGeography shape)
        {
            StringBuilder coordsString = new StringBuilder("");
            for (int k = 1; k <= shape.RingN(1).STNumPoints(); k++)
            {
                coordsString.Append(string.Format("{0},{1},{2}", shape.RingN(1).STPointN(k).Long.ToString(), shape.RingN(1).STPointN(k).Lat.ToString(), 0));
                coordsString.Append(Environment.NewLine);
            }
            return coordsString.ToString();
        }
        public string outputRawPoint(SqlGeography shape)
        {
            StringBuilder coordsString = new StringBuilder("");
            coordsString.Append(string.Format("{0},{1},{2}", shape.Lat.ToString(), shape.Long.ToString(), 0));
            return coordsString.ToString();
        }
        public string outputRawLineString(SqlGeography shape)
        {
            StringBuilder coordsString = new StringBuilder("");
            for (int i = 1; i <= shape.STNumPoints(); i++)
            {
                coordsString.Append(string.Format("{0},{1},{2}", shape.STPointN(i).Long.ToString(), shape.STPointN(i).Lat.ToString(), 0));
                coordsString.Append(Environment.NewLine);
            }
            return coordsString.ToString();
        }
    }
}
