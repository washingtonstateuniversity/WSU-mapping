namespace campusMap.Controllers
{
    #region Directives
        using System.Collections.Generic;
        using System.Collections.Specialized;
        using Castle.ActiveRecord;
        using Castle.MonoRail.Framework;
        using Castle.MonoRail.ActiveRecordSupport;
        using Castle.MonoRail.Framework.Helpers;
        using MonoRailHelper;
        using NHibernate.Criterion;
        using System.IO;
        using System.Web;
        using System;
        using campusMap.Models;
        using System.Net.Mail;
        using Castle.Components.Common.EmailSender;   
        using Castle.Components.Common.EmailSender.Smtp;
        using Castle.ActiveRecord.Queries;
        using System.Text.RegularExpressions;
        using System.Collections;
        using campusMap.Services;
        using Microsoft.SqlServer.Types;
    using System.Data.SqlTypes;
    using System.Xml;
    using System.Text;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Utilities;
    using Newtonsoft.Json.Linq;

    using System.Collections.ObjectModel;
    using System.Dynamic;
    using System.Linq;
    using System.Web.Script.Serialization;



    #endregion

    [Layout("default")]
    public class geometricsController : SecureBaseController
    {

        enum GEOM_TYPE {POINT, LINESTRING, POLYGON, MULTIPOINT, MULTILINESTRING, MULTIPOLYGON, GEOMETRYCOLLECTION  };



        public void editor(int id, int page, bool ajax)
        {
            if (id == 0){
                New();
            }else{
                _edit(id, page, ajax);
            }
            CancelView();
            CancelLayout();
            RenderView("editor");
            return;
        }

        public void Index()
        {
            //ActiveRecordBase<Block>.FindAll();
            PropertyBag["AccessDate"] = DateTime.Now;           
        }

        public void List(int page, int searchId, string status)
        {
            authors user = UserService.getUser();
            PropertyBag["authorname"] = user.name;
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();
            PropertyBag["listtypes"] = ActiveRecordBase<place_types>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["user"] = user;
            PropertyBag["logedin"] = UserService.getLogedIn();
            PropertyBag["statuses"] = ActiveRecordBase<status>.FindAll();

            //user.Sections.Contains(place.place_types);

            IList<geometrics> items;
                int pagesize = 15;
                int paging = 1;
                List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
               /* if (searchId > 0)
                {
                    baseEx.Add(Expression.Eq("place_types", ActiveRecordBase<place_types>.Find(searchId)));
                }
                else if (!searchId.Equals(-1))
                {
                    place_types[] array1 = new place_types[user.Sections.Count];
                    user.Sections.CopyTo(array1, 0);
                    baseEx.Add(Expression.In("place_types", array1));
                }*/

                if (searchId.Equals(-2))
                {
                    IList<geometrics> usergeometrics = user.geometric;
                    object[] obj = new object[usergeometrics.Count];
                    int i = 0;
                    foreach (geometrics geometric in usergeometrics)
                    {
                        obj[i] = geometric.id;
                        i++;
                    }
                    baseEx.Add(Expression.In("geometric_id", obj));
                }

            //PUBLISHED
                if (status == "published"){
                    paging = page;
                }else{
                    paging = 1;
                }
                List<AbstractCriterion> pubEx = new List<AbstractCriterion>();
                pubEx.AddRange(baseEx);
                pubEx.Add(Expression.Eq("status", ActiveRecordBase<status>.Find(3)));

                if (searchId > 0)
                {
                    items = ActiveRecordBase<geometrics>.FindAll(Order.Desc("creation_date"), pubEx.ToArray());
                }
                else
                {
                    items = ActiveRecordBase<geometrics>.FindAll(Order.Desc("publish_time"), pubEx.ToArray());
                }
                PropertyBag["published_list"] = PaginationHelper.CreatePagination(items, pagesize, paging);
                IList<string> buttons = new List<string>();
                buttons.Add("edit");
                //buttons.Add("delete");
                buttons.Add("publish");
                //buttons.Add("broadcast");
                //buttons.Add("view");
                //buttons.Add("order");
                PropertyBag["publishedButtonSet"] = buttons;  




            //REVIEW
                if (status == "review"){
                    paging = page;
                }else{
                    paging = 1;
                }
                List<AbstractCriterion> revEx = new List<AbstractCriterion>();
                revEx.AddRange(baseEx);
                revEx.Add(Expression.Eq("status", ActiveRecordBase<status>.Find(2)));

                items = ActiveRecordBase<geometrics>.FindAll(Order.Desc("creation_date"), revEx.ToArray());
                PropertyBag["review_list"] = PaginationHelper.CreatePagination(items, pagesize, paging);

                buttons = new List<string>();
                buttons.Add("edit");
                buttons.Add("delete");
                buttons.Add("publish");
                //buttons.Add("view");
                PropertyBag["reviewButtonSet"] = buttons;  

 

            //DRAFT
                if (status == "draft"){
                    paging = page;
                }else{
                    paging = 1;
                }
                List<AbstractCriterion> draftEx = new List<AbstractCriterion>();
                draftEx.AddRange(baseEx);
                draftEx.Add(Expression.Eq("status", ActiveRecordBase<status>.Find(1)));
                items = ActiveRecordBase<geometrics>.FindAll(Order.Desc("creation_date"), draftEx.ToArray());
                PropertyBag["draft_list"] = PaginationHelper.CreatePagination(items, pagesize, paging);

                buttons = new List<string>();
                buttons.Add("edit");
                buttons.Add("delete");
                buttons.Add("publish");
                //buttons.Add("view");
                PropertyBag["draftButtonSet"] = buttons;  

            //SETUP SEARCHID and parts
                if (searchId.Equals(0)){
                    PropertyBag["searchId"] = 0;
                }else{
                    geometrics_types type = new geometrics_types();
                    PropertyBag["searchId"] = searchId;
                    geometrics firstgeometric = new geometrics();
                    geometrics lastgeometric = new geometrics();
                    /*if (type.Places.Count.Equals(0)){
                        firstplace = null;
                        lastplace = null;
                    }else{
                        firstplace = type.Places[0];
                        lastplace = type.Places[type.Places.Count - 1];
                    }*/
                    PropertyBag["firstgeometric"] = firstgeometric;
                    PropertyBag["lastgeometric"] = lastgeometric; 
                }

                pagesize = 50;
                IList<geometrics_types> geometrics_types_items;
                geometrics_types_items = ActiveRecordBase<geometrics_types>.FindAll();
                PropertyBag["types"] = PaginationHelper.CreatePagination(geometrics_types_items, pagesize, paging);

                pagesize = 15;
                IList<field_types> geometrics_fields_items;
                List<AbstractCriterion> fieldsEx = new List<AbstractCriterion>();
                fieldsEx.AddRange(baseEx);
                fieldsEx.Add(Expression.Eq("model", this.GetType().Name));
                geometrics_fields_items = ActiveRecordBase<field_types>.FindAll(fieldsEx.ToArray());
                PropertyBag["fields"] = PaginationHelper.CreatePagination(geometrics_fields_items, pagesize, paging);

                pagesize = 15;
                IList<styles> geometrics_styles_items;
                geometrics_styles_items = ActiveRecordBase<styles>.FindAll();
                PropertyBag["styles"] = PaginationHelper.CreatePagination(geometrics_styles_items, pagesize, paging);
            
                RenderView("../admin/listings/list");
        }
        public bool canEdit(geometrics geometric, authors user)
        {
            bool flag = false;
           /* switch (user.Accesslevel.Title)
            {
                case "Author":
                    {
                        foreach (place_types item in place.place_types)
                        {
                            if (place.Authors.Contains(user) && user.Sections.Contains(item))
                                flag = true; break;
                        }
                    }
                case "Contributer":
                    {
                        foreach (place_types item in place.place_types)
                        {
                            if (place.Authors.Contains(user) && user.Sections.Contains(item))
                                flag = true; break;
                        }
                    }
                case "Editor":
                    {
                        foreach (place_types item in place.place_types)
                        {
                            if (user.Sections.Contains(item))
                                flag = true; break;
                        }
                    }
             }*/

            return flag;        
        }
           /* public bool canPublish(authors user)
            {
                bool flag = false;
                switch (user.Accesslevel.Title)
                {
                    case "Author": flag = true; break;
                               
                    case "Editor": flag = true; break;

                    case "Contributor": flag = false; break;
                }
                return flag;        
            }*/


        public void new_field()
        {
            field_types field = new field_types();
            PropertyBag["field"] = field;
            place_models[] p_models = ActiveRecordBase<place_models>.FindAll();
            PropertyBag["p_models"] = p_models;


            RenderView("../admin/fields/new");
        }
        public void edit_field(int id)
        {
            field_types field = ActiveRecordBase<field_types>.Find(id);
            PropertyBag["field"] = field;

            geometrics_types[] p_models = ActiveRecordBase<geometrics_types>.FindAll();
            PropertyBag["p_models"] = p_models;

            string ele_str = FieldsService.getfieldmodel_dynamic(field.attr.ToString());

            var jss = new JavaScriptSerializer();
            var ele = jss.Deserialize<Dictionary<string, dynamic>>(field.attr.ToString());

            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();

            PropertyBag["html_ele"] = ele_str;
            PropertyBag["ele"] = ele;

            RenderView("../admin/fields/new");
        }

        public void new_type()
        {
            place_types type = new place_types();
            PropertyBag["type"] = type;
            RenderView("../admin/types/new");
        }
        public void edit_type(int id)
        {
            geometrics_types type = ActiveRecordBase<geometrics_types>.Find(id);
            PropertyBag["type"] = type;
            RenderView("../admin/types/new");
        }

        public void new_style()
        {
            styles STYLE = new styles();
            zoom_levels level = ActiveRecordBase<zoom_levels>.Find(1);
            List<zoom_levels> levels = new List<zoom_levels>();
            levels.Add(level);
            STYLE._zoom = levels; // priming the levels with the all zoom level

            PropertyBag["style"] = STYLE;
            PropertyBag["style_types"]  = ActiveRecordBase<geometrics_types>.FindAll();
            PropertyBag["style_events"] = ActiveRecordBase<geometric_events>.FindAll();
            PropertyBag["zoom_levels"]  = ActiveRecordBase<zoom_levels>.FindAll();
            RenderView("../admin/maps/styles/new");
        }
        public void edit_style(int id)
        {
            styles STYLE = ActiveRecordBase<styles>.Find(id);
            PropertyBag["style"] = STYLE;
            PropertyBag["style_types"] = ActiveRecordBase<geometrics_types>.FindAll();
            geometric_events[] events = ActiveRecordBase<geometric_events>.FindAll();
            PropertyBag["style_events"] = events;
            PropertyBag["zoom_levels"] = ActiveRecordBase<zoom_levels>.FindAll();
            RenderView("../admin/maps/styles/new");
        }

        public void setStatus(int id, int status, bool ajax)
        {
            geometrics geometric = ActiveRecordBase<geometrics>.Find(id);
            PropertyBag["geometric"] = geometric;
            status published = ActiveRecordBase<status>.Find(status);
            //place.Status = published;
            ActiveRecordMediator<geometrics>.Save(geometric);

            //if(!ajax)
            //RedirectToReferrer();
            string myTime = DateTime.Now.ToString("yyyy.MM.dd HH:mm:ss:ffff");
            NameValueCollection myCol = new NameValueCollection();
            myCol.Add("time", myTime);

            Redirect("place", "list", myCol);
            //}
        }

        public geometrics[] getDrafts()
        {
            geometrics draft = ActiveRecordBase<geometrics>.Find(1);
           ICriterion expression = Expression.Eq("Status", draft);
           geometrics[] geometricArray = ActiveRecordBase<geometrics>.FindAll(expression);
           return geometricArray;        
        }
        public geometrics[] getReview()
        {
            geometrics review = ActiveRecordBase<geometrics>.Find(2);
            ICriterion expression = Expression.Eq("Status", review);
            geometrics[] geometricArray = ActiveRecordBase<geometrics>.FindAll(expression);
            return geometricArray;
        }
        public geometrics[] getPublished()
        {
            geometrics published = ActiveRecordBase<geometrics>.Find(3);
            ICriterion expression = Expression.Eq("Status", published);
            geometrics[] geometricArray = ActiveRecordBase<geometrics>.FindAll(expression);
            return geometricArray;        
        }
 



        public void _edit(int id, int page, bool ajax)
        {
            CancelView();
            PropertyBag["ajaxed"] = ajax;
            LogService.writelog("Editing geometric " + id);
            
            PropertyBag["credits"] = "";
            PropertyBag["imagetypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["images_inline"] = ActiveRecordBase<media_repo>.FindAll();

            string gem = "";
            geometrics geometric = ActiveRecordBase<geometrics>.Find(id);
            if (geometric.boundary != null)
            {
                SqlGeography spatial = geometrics.AsGeography(geometric.boundary);
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
                        break;
                }
            }
            PropertyBag["sp_type"] = geometric.default_type;
            PropertyBag["_types"] = ActiveRecordBase<geometrics_types>.FindAll();
            IList<styles> items;

            List<AbstractCriterion> pubEx = new List<AbstractCriterion>();
            pubEx.Add(Expression.Eq("type", ActiveRecordBase<geometrics_types>.FindAllByProperty("id", geometric.default_type.id)));
            //items = ActiveRecordBase<styles>.FindAll(Order.Desc("name"), pubEx.ToArray());
            PropertyBag["_styles"] = "";//items;

           PropertyBag["spatial"] = gem;

            PropertyBag["spatial_types"] = Enum.GetValues(typeof(GEOM_TYPE)); //Enum.GetValues(typeof(GEOM_TYPE)).Cast<GEOM_TYPE>().ToList(); //Enum.GetValues(typeof(GEOM_TYPE)).Cast<GEOM_TYPE>(); 


            authors user = UserService.getUser();
            PropertyBag["authorname"] = user;
            geometric.editing = user;
            
            ActiveRecordMediator<geometrics>.Save(geometric);
            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"

            PropertyBag["loginUser"] = user;
            PropertyBag["geometricimages"] = geometric.Images;

            PropertyBag["tags"] = ActiveRecordBase<tags>.FindAll();
            if (Flash["geometric"] != null)
            {
                geometrics flashgeometric = Flash["geometric"] as geometrics;
                flashgeometric.Refresh();
                PropertyBag["geometric"] = flashgeometric;
            }
            else
            {
                PropertyBag["geometric"] = geometric;
            }
            
            //ImageType imgtype = ActiveRecordBase<ImageType>.Find(1);
            //PropertyBag["images"] = imgtype.Images; //Flash["images"] != null ? Flash["images"] : 
            //PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll();
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();//Flash["authors"] != null ? Flash["authors"] : ActiveRecordBase<author>.FindAll();
            PropertyBag["geometrictype"] = ActiveRecordBase<geometrics_types>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["statuslists"] = ActiveRecordBase<status>.FindAll();

            //if (page == 0)
            //    page = 1;
            //int pagesize = 10;
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("Place", geometric));

            


            /*List<tags> tags = new List<tags>();
            tags.AddRange(geometric.tags);
            for (int i = 0; i < 2; i++)
                tags.Add(new tags());
            PropertyBag["geometrictags"] = tags;*/

            List<authors> authors = new List<authors>();
            authors.AddRange(geometric.Authors);
            for (int i = 0; i < 2; i++)
                authors.Add(new authors());

            /*List<media_repo> images = new List<media_repo>();
            images.AddRange(geometric.Images);
            if (images.Count == 0)
            {
               images.Add(new media_repo());
               PropertyBag["geometricimages"] = images;   
            }*/
              

            PropertyBag["placeauthors"] = authors;

            RenderView("editor");
       
        }
        public void New()
        {
            CancelView();
            PropertyBag["credits"] = ""; 
            PropertyBag["imagetypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["images_inline"] = ActiveRecordBase<media_repo>.FindAll();

            geometrics geometric = new geometrics();
            List<media_repo> images = new List<media_repo>();
            images.AddRange(geometric.Images);
            if (images.Count == 0)
            {
                images.Add(new media_repo());
            }
            PropertyBag["geometricimages"] = images;
            PropertyBag["loginUser"] = UserService.getUser();
            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"

            String availableImagesList = "";
            PropertyBag["availableImages"] = availableImagesList; // string should be "location1","location2","location3"
            

            PropertyBag["images"] = Flash["images"] != null ? Flash["images"] : ActiveRecordBase<media_repo>.FindAll();
            PropertyBag["geometric"] = Flash["geometric"] != null ? Flash["geometric"] : geometric;
            PropertyBag["tags"] = Flash["tags"] != null ? Flash["tags"] : ActiveRecordBase<tags>.FindAll();
            PropertyBag["authors"] = Flash["authors"] != null ? Flash["authors"] : ActiveRecordBase<authors>.FindAll();
            PropertyBag["geometrictype"] = ActiveRecordBase<geometrics_types>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["statuslists"] = ActiveRecordBase<status>.FindAll();
            RenderView("editor");
        }

        /*public String Getlocation()  // this is to be replaced with get cord logic
        {
            String sql = "SELECT DISTINCT s.Location FROM Place AS s WHERE NOT s.Location = 'NULL'";
            SimpleQuery<String> q = new SimpleQuery<String>(typeof(place), sql);
            Array locations = q.Execute();
            String locationsList ="";
            foreach (String s in locations)
            {
                locationsList += '"'+s.ToString()+'"' + ',';
            }
            return locationsList.TrimEnd(',');
        }*/


        public void GetAddImage(int count)
        {
            PropertyBag["count"] = count;

            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("type", ActiveRecordBase<media_types>.Find(1)));
            PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll(baseEx.ToArray());

            List<media_repo> images = new List<media_repo>();
            images.Add(new media_repo());
            PropertyBag["geometricimages"] = images;
            RenderView("addimage", true);
        }
        public void DeleteImage(int id, int imageid)
        {
            if (id.Equals(0) || imageid.Equals(0))
            {
                CancelLayout();
                RenderText("false");
                return;
            }
            media_repo media = ActiveRecordBase<media_repo>.Find(imageid);
            geometrics geometric = ActiveRecordBase<geometrics>.Find(id);
            geometrics_media geometricmedia = ActiveRecordBase<geometrics_media>.FindFirst(new ICriterion[] { Expression.Eq("geometrics", geometric), Expression.Eq("media", media) });
            ActiveRecordMediator<geometrics_media>.Delete(geometricmedia);
            //place.Images.Remove(image);
            //ActiveRecordMediator<place>.Save(place);
            CancelLayout();
            RenderText("true");
        }


        public void clearLock(int id, bool ajax)
        {
            geometrics geometric = ActiveRecordBase<geometrics>.Find(id);
            geometric.editing = null;
            ActiveRecordMediator<geometrics>.Save(geometric);
            CancelLayout();
            RenderText("true");
        }

        public string normaliz_latsLongs(string latLong, string type)
        {

            latLong = latLong.Trim();

            bool longFirst = true;
            if (!latLong.StartsWith("-")) { longFirst = false; }

            latLong = latLong.Replace(",", "|");
            latLong = latLong.Replace("|\r\n", ",");
            latLong = latLong.Replace("|", " ");
            latLong = latLong.Replace("\r\n", "");

            if (!longFirst)
            {
                string pattern = @"(\d+\.\d+)\s?(-?\d+\.\d+),?";
                string replacement = "$2 $1,";
                Regex rgx = new Regex(pattern);
                latLong = rgx.Replace(latLong, replacement);
            }
            if (type == "polygon"){ /* this is to avoid an error where the ring needs to be closed in MS SQL */
                string[] tmp = latLong.Split(','); 
                if(tmp[0] != tmp[tmp.Length-1]){
                    latLong = latLong.TrimEnd(',') + "," + tmp[0];
                }
            }

            return latLong.TrimEnd(',');
        }

        public void Update([ARDataBind("geometric", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] geometrics geometric,
            [ARDataBind("tags", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]tags[] tags, String[] newtag,
            [ARDataBind("images", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]media_repo[] images,
            [ARDataBind("authors", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]authors[] authors,
            string boundary,
            string geom_type,
        [ARDataBind("geometric_media", Validate = true, AutoLoad = AutoLoadBehavior.OnlyNested)]geometrics_media[] media, string apply, string cancel)     
        {
            Flash["geometric"] = geometric;
            Flash["tags"] = geometric;
            Flash["images"] = geometric;
            Flash["authors"] = geometric;

            if (cancel != null)
            {
                geometric.editing = null;
                ActiveRecordMediator<geometrics>.Save(geometric);
                RedirectToAction("list");
                return;
            }
            /*if (place.prime_name == null || geometric.prime_name.Length == 0)
            {
                Flash["error"] = "You are missing the basic parts of a place";
                RedirectToReferrer();
                return;
            }

             * 
             * 
             * COME BACK TO ?? AND IN PLACE TOO yoyo
             * 
             * 
            if (geometric.geometric_types == null || geometric.geometric_types.geometrics_type_id == 0)
            {
                Flash["error"] = "You must choose a Place type.";
                RedirectToReferrer();
                return;
            }
*/


            authors user = UserService.getUser();
            geometric.editing = user;
            geometric.status = !UserService.checkPrivleage("can_publish") ? ActiveRecordBase<status>.Find(1) : geometric.status;


            if (String.IsNullOrEmpty(geometric.name))
            {
                geometric.name = "Untitled";
            }



           // geometric.tags.Clear(); 
            //place.Images.Clear();
            geometric.Authors.Clear();
            if (apply != null)
            {

            }
            else
            {
                geometric.editing = null;
            }


            if (geometric.id == 0)
            {
                //PlaceStatus stat = ActiveRecordBase<PlaceStatus>.Find(1);
                //place.Status = stat;
                geometric.creation_date = DateTime.Now;
            }
            else
            {
                geometric.updated_date = DateTime.Now;
            }
            /*
            if (newtag != null)
            {
                foreach (String onetags in newtag)
                {
                    if (onetags != "")
                    {
                        tags t = new tags();
                        t.name = onetags;
                        tags[] temp = ActiveRecordBase<tags>.FindAllByProperty("Name", onetags);
                        if (temp.Length == 0)
                        {
                            ActiveRecordMediator<tags>.Save(t);
                            geometric.tags.Add(t);                                                                                  
                        }
                    }                        
                }               
                     
            }
            */
            foreach (geometrics_media si in media)
            {
                if (si.Media != null && si.Media.id > 0)
                {
                    geometrics_media find = ActiveRecordBase<geometrics_media>.FindFirst(new ICriterion[] { Expression.Eq("media", si.Media), Expression.Eq("geometric_id", geometric) });
                    find.geometric_order = si.geometric_order;
                    ActiveRecordMediator<geometrics_media>.Save(find);
                }
            }
/*
            foreach (tags tag in tags)
            {
                if (tag.id > 0)
                    geometric.tags.Add(tag);        
            }
            foreach (media_repo _media in images)
            {
                if (_media.id > 0 && !geometric.Images.Contains(_media))
                {
                    geometric.Images.Add(_media);
                }
            }
            */
            foreach (authors author in authors)
            {
                if (author.id > 0)
                    geometric.Authors.Add(author);   
            }

            /*string requested_url = place.CustomUrl;
            if (placeService.placeByURL(place.CustomUrl).Length > 1)
            {
                place.CustomUrl = requested_url + "1";
                ActiveRecordMediator<place>.Save(place);
                Flash["error"] = "The url you choose is in use.  Please choose a new one.  We have saved it as '" + requested_url + "1" + "' currently.";
                RedirectToReferrer();
                return;
            }*/


            
            string gemSql = "";
            string gemtype = "";
            switch (geom_type)
            {
                case "marker": //case "POINT":
                    if (boundary != null)
                    {
                        gemSql = "POINT (" + normaliz_latsLongs(boundary, geom_type) + ")";
                    }
                    gemtype = "Marker";
                    break;
                case "polyline": //case "LINESTRING":
                    if (boundary != null)
                    {gemSql = "LINESTRING (" + normaliz_latsLongs(boundary, geom_type) + ")";
                    }
                    gemtype = "Line";
                    break;
                case "polygon": //case "POLYGON":
                    if (boundary != null)
                    {gemSql = "POLYGON ((" + normaliz_latsLongs(boundary, geom_type) + "))";
                    }
                    gemtype = "Shape";
                    break;
                case "rectangle":
                    if (boundary != null)
                    {gemSql = "POLYGON ((" + normaliz_latsLongs(boundary, geom_type) + "))";
                    }
                    gemtype = "Shape";
                    break;
                case "circle":
                    if (boundary != null)
                    {gemSql = "POLYGON ((" + normaliz_latsLongs(boundary, geom_type) + "))";
                    }
                    gemtype = "Shape";
                    break;
                case "MULTIPOINT":

                case "MULTILINESTRING":
                case "MULTIPOLYGON":
                case "GEOMETRYCOLLECTION":
                    break;
            }
            
            geometric.default_type = ActiveRecordBase<geometrics_types>.FindFirst(new ICriterion[] { Expression.Eq("name", geom_type) });
            //geometric.geometric_types = geom_type;
            if (boundary != null)
            {
                string wkt = gemSql;

               // string wkt = "POLYGON ((-117.170966 46.741963,-117.174914 46.736375,-117.181094 46.730551,-117.182382 46.729080,-117.178176 46.728786,-117.176459 46.729492,-117.173627 46.729316,-117.170966 46.728139,-117.166160 46.725374,-117.164958 46.723197,-117.163070 46.721549,-117.153800 46.721902,-117.137492 46.729080,-117.138694 46.748609,-117.145560 46.751197,-117.158435 46.748727,-117.165988 46.744492 ,-117.170966 46.741963))";
                SqlChars udtText = new SqlChars(wkt);
                SqlGeography sqlGeometry1 = SqlGeography.STGeomFromText(udtText, 4326);

                MemoryStream ms = new MemoryStream();
                BinaryWriter bw = new BinaryWriter(ms);
                byte[] WKB = sqlGeometry1.STAsBinary().Buffer;
                /*bw.Write(WKB);

                byte[] b2 = ms.ToArray();
                SqlBytes udtBinary2 = new SqlBytes(b2);
                SqlGeography sqlGeometry2 = SqlGeography.STGeomFromWKB(udtBinary2, 4326);
                */
                geometric.boundary = geometrics.AsByteArray(sqlGeometry1);//WKB;//
            }


            ActiveRecordMediator<geometrics>.Save(geometric);

            //cleanUpgeometric_media(geometric.id);

            Flash["geometric"] = null;
            Flash["tags"] = null;
            Flash["images"] = null;
            Flash["authors"] = null;


            if (apply != null)
            {
                if (apply != " Save ")
                {
                    RedirectToUrl("_edit.castle?id=" + geometric.id);
                }
                else
                {
                    RedirectToReferrer();
                }
            }
            else
            {
                RedirectToAction("list");
            }
        }

        public void update_field(
                   [ARDataBind("field", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] field_types field,
                   [DataBind("ele", Validate = true)] dynamic ele,
                   string ele_type,
                   int placemodel,
                  bool ajaxed_update,
                  string apply,
                  string cancel
                       )
        {
            if (cancel != null)
            {
                RedirectToAction("list");
                return;
            }
            char[] startC = { '{' };
            char[] endC = { '}' };



            ActiveRecordMediator<fields>.Save(field);

            field.model = this.GetType().Name;
            field.set = ActiveRecordBase<place_models>.Find(placemodel).id;  // NOTE THIS IS THE ONLY REASON WE CAN ABSTRACT YET... FIX?

            ele.attr.name = "fields[" + field.id + "]";//+ (ele.type == "dropdown"?"[]":"");

            string ele_attr = JsonConvert.SerializeObject(ele.attr);
            ele_attr = ele_attr.TrimEnd(endC);
            ele_attr = ele_attr.TrimStart(startC);
            // ele_attr Should match
            //{\"class\":null,\"id\":null,\"ETC ;)\":null}
            ele.options.RemoveAt(ele.options.Count - 1); //to remove ele.options[9999] at the end
            string ele_ops = JsonConvert.SerializeObject(ele.options);
            ele_ops = ele_ops.TrimEnd(endC);
            ele_ops = ele_ops.TrimStart(startC);
            // ele_ops Should match
            //[{\"label\":\"bar\",\"val\":\"bars\"},{\"label\":\"fooed\",\"val\":\"baring\"}]

            field.attr = "{ \"type\": \"" + ele.type + "\", \"label\": \"" + ((ele.label == "") ? field.name : ele.label) + "\", \"attr\":{" + ele_attr + "}, \"options\":" + ele_ops + " }";


            ActiveRecordMediator<fields>.Save(field);
            if (apply != null || ajaxed_update)
            {
                if (field.id > 0)
                {
                    RedirectToUrl("edit_field.castle?id=" + field.id);
                    return;
                }
                else
                {
                    RedirectToReferrer();
                }
            }
            else
            {
                RedirectToAction("list");
            }
        }

        public void update_style(
                [ARDataBind("style", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] styles style,
                bool ajaxed_update,
                string apply,
                string cancel
                )
            {
                if (cancel != null)
                {
                    RedirectToAction("list");
                    return;
                }
                char[] startC = { '{' };
                char[] endC = { '}' };



            /* first add zoom levels */
                foreach (zoom_levels zoom in style._zoom)
                {
                    List<AbstractCriterion> revEx = new List<AbstractCriterion>();
                    revEx.Add(Expression.Eq("start", zoom.start));
                    revEx.Add(Expression.Eq("end", zoom.end));
                    zoom_levels zoomed = ActiveRecordBase<zoom_levels>.FindFirst(Order.Desc("creation_date"), revEx.ToArray());
                    if (zoomed.id <= 0)
                    {
                        ActiveRecordMediator<zoom_levels>.Save(zoom);
                        style._zoom.Add(zoom);
                    }
                }

                /* 
                 * everthing from here should be inherently saved with the 
                 * ActiveRecordMediator<styles>.Save(style);
                 * 
                 * 
                 * FORM INPUT NAME for an option on
                 * 'fillColor' under the 'rest' event under Zoom 0,14
                 * EXMAPLE: 
                 *   so:
                 * style._zoom[1]        id:1  -  '0,14'
                 * style._event[6]       id:2  -  'hover'
                 * style._value[6]       id:6  -  'fillColor'
                 * <input type="hidden" value="$!{opt.value}" name="style._zoom[${zoom.id}].events[${event.id}]._value[${opt.id}]" />
                 * 
                 * */
                /* finish up by finalizing the style */
                ActiveRecordMediator<styles>.Save(style);

                if (apply != null || ajaxed_update){
                    if (style.id > 0){
                        RedirectToUrl("edit_style.castle?id=" + style.id);
                        return;
                    }else{
                        RedirectToReferrer();
                    }
                }else{
                    RedirectToAction("list");
                }
            }

        public void test()
        {
            geometrics geo = ActiveRecordBase<geometrics>.Find(10);
            SqlGeography spatial = geometrics.AsGeography(geo.boundary);

            CancelView();
        }

        public void delete(int id)
        {
            geometrics geometric = ActiveRecordBase<geometrics>.Find(id);
            Flash["message"] = "Article, <strong>Note:" + geometric.id + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<geometrics>.Delete(geometric);
            CancelLayout();
            RedirectToAction("list");
        }


    }
}
