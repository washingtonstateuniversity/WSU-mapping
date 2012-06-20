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
    using System.Text.RegularExpressions;
    using System.Xml;
    using System.Web;
    using System.Web.Security;
    using System.Web.UI;
    using System.Web.UI.WebControls;
    using System.Web.UI.WebControls.WebParts;
    using System.Web.UI.HtmlControls;


    using NHibernate.Criterion;
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
    public class googleService
    {
        public static string createStaticPlaceMap(string url, string newFile)
        {
            /*
             * #if($item.coordinate)
             *   http://maps.google.com/staticmap?center=${item.getLat()},${item.getLong()}&amp;size=250x145&amp;maptype=mobile&amp;markers=${item.getLat()},${item.getLong()},red&amp;sensor=false
             * #else
             *      #if($item.default_type.name == 'polygon' || $item.default_type.name == 'rectangle')
             *        http://maps.googleapis.com/maps/api/staticmap?size=250x145&amp;path=weight:0%7Cfillcolor:0xAA000033%7Cenc:${item.encoded}&amp;sensor=false
             *      #elseif($item.default_type.name == 'polyline')
             *        http://maps.googleapis.com/maps/api/staticmap?size=250x145&amp;path=weight:3%7Ccolor:0xAA000033%7Cenc:${item.encoded}&amp;sensor=false
             *      #end
             * #end
             * 
             */
            byte[] imagebytes = ImageService.DownloadBinary(url);
            ImageService.ByteArrayToFile(newFile, imagebytes);

            return newFile;
        }
    }
}
