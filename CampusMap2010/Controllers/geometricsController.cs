namespace campusMap.Controllers {
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

    using AutoMapper;

    #endregion

    [Layout("default")]
    public class geometricsController : SecureBaseController {

        enum GEOM_TYPE { POINT, LINESTRING, POLYGON, MULTIPOINT, MULTILINESTRING, MULTIPOLYGON, GEOMETRYCOLLECTION };



        public void editor(int id, int page, bool ajax, int type) {
            if (id == 0) {
                New(type);
            } else {
                _edit(id, page, ajax);
            }
            CancelView();
            CancelLayout();
            RenderView("editor");
            return;
        }

        public void Index() {
            //ActiveRecordBase<Block>.FindAll();
            PropertyBag["AccessDate"] = DateTime.Now;
        }



        public void clearPlaceStaticMap(geometrics item) {
            String uploadPath = getRootPath();

            String imagePath = @"";
            imagePath += @"uploads\";
            imagePath += @"googleStaticMaps\geometrics\";

            uploadPath += imagePath;

            string newFile = uploadPath + item.id.ToString() + ".ext";
            if (File.Exists(newFile)) {
                File.Delete(newFile);
            }
        }


        public void makePlaceStaticMap(geometrics item) {

            String url = "";
            String fill = "";
            if (item.default_type == null) {
                return;
            }
            if (item.default_type.name == "polygon" || item.default_type.name == "rectangle" || item.children.Count() > 0) {
                    
				if(item.style.Count()>0){
					fill = item.style[0].getoptionValue("rest","fillColor").Replace("#","");
				}
				if(fill==""){
                    fill="981F32";
                }

                String sfill = "";
				if(item.style.Count()>0){
					sfill = item.style[0].getoptionValue("rest","strokeColor").Replace("#","");
                }
                String stroke = "";
				if(sfill==""){
					stroke = "weight:0";
				}else{
                    stroke = "weight:3%7Ccolor:0x" + sfill + "";
				}
                if(item.children.Count()>0){
                    String path = "";
                    foreach(geometrics child in item.children){
                        path += "&path=" + stroke + "%7Cfillcolor:0x" + fill + "%7Cenc:" + child.encoded + "";
                    }
                    url = "http://maps.googleapis.com/maps/api/staticmap?size=250x145" + path;    
                }else{
                    url = "http://maps.googleapis.com/maps/api/staticmap?size=250x145&path="+stroke+"%7Cfillcolor:0x"+fill+"%7Cenc:"+item.encoded;    
                }
				
            }else if(item.default_type.name == "polyline"){
				if(item.style.Count()>0){
					fill = item.style[0].getoptionValue("rest","strokeColor").Replace("#","");
				}
				if(fill==""){
                    fill = "981F32";
                }
				url = "http://maps.googleapis.com/maps/api/staticmap?size=250x145&path=weight:3%7Ccolor:0x"+fill+"%7Cenc:"+item.encoded;
            }

            String uploadPath = getRootPath();

            String imagePath = @"";
            imagePath += @"uploads\";
            imagePath += @"googleStaticMaps\geometrics\";

            uploadPath += imagePath;

            if (!HelperService.DirExists(uploadPath)) {
                System.IO.Directory.CreateDirectory(uploadPath);
            }
            string newFile = uploadPath + item.id.ToString() + ".ext";
            string finImagePath = @"\" + imagePath + item.id.ToString() + ".ext";
            if (!HelperService.fileExists(newFile)){
                googleService.createStaticPlaceMap(url, newFile);
            }
            item.staticMap = finImagePath;
            ActiveRecordMediator<geometrics>.Save(item);
        }
        public void List(int page, int searchId, string target, string filter, Boolean ajax) {
            users user = UserService.getUserFull();
            PropertyBag["authorname"] = user.name;
            PropertyBag["authors"] = ActiveRecordBase<users>.FindAll();
            PropertyBag["listtypes"] = ActiveRecordBase<place_types>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<user_groups>.FindAll();
            PropertyBag["user"] = user;
            PropertyBag["logedin"] = UserService.getLogedIn();
            PropertyBag["statuses"] = ActiveRecordBase<status>.FindAll();
            PropertyBag["ajax"] = ajax;
            //user.Sections.Contains(place.place_types);

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

            if (searchId.Equals(-2)) {
                IList<geometrics> usergeometrics = user.geometric;
                object[] obj = new object[usergeometrics.Count];
                int i = 0;
                foreach (geometrics geometric in usergeometrics) {
                    obj[i] = geometric.id;
                    i++;
                }
                baseEx.Add(Expression.In("geometric_id", obj));
            }
            
            //PUBLISHED

            var pageing = new Dictionary<string, int>();

            switch (target) {
                case "templates": {
                        pageing.Add("templatePaging", page); break;
                    }
                case "name_types": {
                        pageing.Add("name_typesPaging", page); break;
                    }
                case "types": {
                        pageing.Add("typesPaging", page); break;
                    }
                case "fields": {
                        pageing.Add("fieldsPaging", page); break;
                    }
                case "draft": {
                        pageing.Add("draftPaging", page); break;
                    }
                case "review": {
                        pageing.Add("reviewPaging", page); break;
                    }
                case "published": {
                        pageing.Add("publishedPaging", page); break;
                    }
                case "filteredResults": {
                        pageing.Add("filterPaging", page); break;
                    }
            }

            String cachePath = getRootPath();
            IList<string> buttons = new List<string>();
            int pag = 0;

            status[] states = ActiveRecordBase<status>.FindAll();
            foreach (status stat in states) {
                string name = stat.name;

                IList<geometrics> listtems;
                List<AbstractCriterion> revEx = new List<AbstractCriterion>();
                revEx.AddRange(baseEx);
                revEx.Add(Expression.Eq("status", stat));
                revEx.Add(Expression.IsNull("parent"));
                listtems = ActiveRecordBase<geometrics>.FindAll(Order.Desc("creation_date"), revEx.ToArray());
                foreach (geometrics item in listtems) {
                    makePlaceStaticMap(item);
                }
                PropertyBag[name + "_list"] = PaginationHelper.CreatePagination(listtems, pagesize, (pageing.TryGetValue(name + "Paging", out pag) ? pag : 0));
                buttons = new List<string>();
                buttons.Add("edit");
                buttons.Add("delete");
                buttons.Add("publish");
                buttons.Add("copy");
                //buttons.Add("view");
                PropertyBag[name + "ButtonSet"] = buttons;
            }

            PropertyBag["ajax"] = ajax;

            //SETUP SEARCHID and parts
            if (searchId.Equals(0)) {
                PropertyBag["searchId"] = 0;
            } else {
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
            PropertyBag["styles"] = geometrics_styles_items; // PaginationHelper.CreatePagination(geometrics_styles_items, pagesize, paging);

            RenderView("../admin/listings/list");
        }
        public bool canEdit(geometrics geometric, users user) {
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


        public void new_field() {
            field_types field = new field_types();
            PropertyBag["field"] = field;
            place_models[] p_models = ActiveRecordBase<place_models>.FindAll();
            PropertyBag["p_models"] = p_models;


            RenderView("../admin/fields/new");
        }
        public void edit_field(int id) {
            field_types field = ActiveRecordBase<field_types>.Find(id);
            PropertyBag["field"] = field;

            geometrics_types[] p_models = ActiveRecordBase<geometrics_types>.FindAll();
            PropertyBag["p_models"] = p_models;

            string ele_str = FieldsService.getfieldmodel_dynamic(field.attr.ToString());

            var jss = new JavaScriptSerializer();
            var ele = jss.Deserialize<Dictionary<string, dynamic>>(field.attr.ToString());

            PropertyBag["accesslevels"] = ActiveRecordBase<user_groups>.FindAll();
            PropertyBag["authors"] = ActiveRecordBase<users>.FindAll();

            PropertyBag["html_ele"] = ele_str;
            PropertyBag["ele"] = ele;

            RenderView("../admin/fields/new");
        }

        public void new_type() {
            place_types type = new place_types();
            PropertyBag["type"] = type;
            RenderView("../admin/types/new");
        }
        public void edit_type(int id) {
            geometrics_types type = ActiveRecordBase<geometrics_types>.Find(id);
            PropertyBag["type"] = type;
            RenderView("../admin/types/new");
        }

        public void new_style(int type) {
            styles STYLE = new styles();
            zoom_levels level = ActiveRecordBase<zoom_levels>.Find(1);
            List<zoom_levels> levels = new List<zoom_levels>();
            levels.Add(level);
            STYLE._zoom = levels; // priming the levels with the all zoom level

            PropertyBag["selectedType"] = ActiveRecordBase<geometrics_types>.Find(type > 0 ? type : 3);

            PropertyBag["style"] = STYLE;
            PropertyBag["style_types"] = ActiveRecordBase<geometrics_types>.FindAll();
            PropertyBag["style_events"] = ActiveRecordBase<geometric_events>.FindAll();
            PropertyBag["zoom_levels"] = ActiveRecordBase<zoom_levels>.FindAll();
            RenderView("../admin/maps/styles/new");
        }
        public void edit_style(int id) {
            styles STYLE = ActiveRecordBase<styles>.Find(id);
            PropertyBag["style"] = STYLE;


            var values = new Dictionary<string, object>();
            if (!String.IsNullOrWhiteSpace(STYLE.style_obj) && STYLE.style_obj != "{}") {
                var jss = new JavaScriptSerializer();
                var options = jss.Deserialize<Dictionary<string, dynamic>>(STYLE.style_obj);
                options.ToList<KeyValuePair<string, dynamic>>();
                foreach (KeyValuePair<string, dynamic> option in options) {
                    values.Add(option.Key, option.Value);
                }
            }
            PropertyBag["events"] = values["events"];


            PropertyBag["style_types"] = ActiveRecordBase<geometrics_types>.FindAll();
            geometric_events[] events = ActiveRecordBase<geometric_events>.FindAll();
            PropertyBag["style_events"] = events;
            PropertyBag["selectedType"] = STYLE.type;
            PropertyBag["zoom_levels"] = ActiveRecordBase<zoom_levels>.FindAll();
            RenderView("../admin/maps/styles/new");
        }

        public void setStatus(int id, int status, bool ajax) {
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

        public geometrics[] getDrafts() {
            geometrics draft = ActiveRecordBase<geometrics>.Find(1);
            ICriterion expression = Expression.Eq("Status", draft);
            geometrics[] geometricArray = ActiveRecordBase<geometrics>.FindAll(expression);
            return geometricArray;
        }
        public geometrics[] getReview() {
            geometrics review = ActiveRecordBase<geometrics>.Find(2);
            ICriterion expression = Expression.Eq("Status", review);
            geometrics[] geometricArray = ActiveRecordBase<geometrics>.FindAll(expression);
            return geometricArray;
        }
        public geometrics[] getPublished() {
            geometrics published = ActiveRecordBase<geometrics>.Find(3);
            ICriterion expression = Expression.Eq("Status", published);
            geometrics[] geometricArray = ActiveRecordBase<geometrics>.FindAll(expression);
            return geometricArray;
        }




        public void _edit(int id, int page, bool ajax) {
            CancelView();
            PropertyBag["ajaxed"] = ajax;
            HelperService.writelog("Editing geometric", id);

            PropertyBag["credits"] = "";
            PropertyBag["imagetypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["images_inline"] = ActiveRecordBase<media_repo>.FindAll();


            geometrics geometric = ActiveRecordBase<geometrics>.Find(id);
            //PropertyBag["spatial"] = geometric.latlongs();
            
            PropertyBag["sp_type"] = geometric.default_type;
            PropertyBag["_types"] = ActiveRecordBase<geometrics_types>.FindAll();
            IList<styles> items;

            //List<AbstractCriterion> pubEx = new List<AbstractCriterion>();
           // pubEx.Add(Expression.Eq("type", ActiveRecordBase<geometrics_types>.FindAllByProperty("id", geometric.default_type.id)));
            //items = ActiveRecordBase<styles>.FindAll(Order.Desc("name"), pubEx.ToArray());
            PropertyBag["_styles"] = "";//items;

            

            PropertyBag["spatial_types"] = Enum.GetValues(typeof(GEOM_TYPE)); //Enum.GetValues(typeof(GEOM_TYPE)).Cast<GEOM_TYPE>().ToList(); //Enum.GetValues(typeof(GEOM_TYPE)).Cast<GEOM_TYPE>(); 


            users user = UserService.getUserFull();
            PropertyBag["authorname"] = user;
            geometric.editing = user;

            ActiveRecordMediator<geometrics>.Save(geometric);
            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"


            PropertyBag["styles"] = ActiveRecordBase<styles>.FindAll();

            PropertyBag["loginUser"] = user;
            PropertyBag["geometricimages"] = geometric.Images;

            PropertyBag["tags"] = ActiveRecordBase<tags>.FindAll();
            if (Flash["geometric"] != null) {
                geometrics flashgeometric = Flash["geometric"] as geometrics;
                ActiveRecordMediator<geometrics>.Refresh(flashgeometric);
                PropertyBag["geometric"] = flashgeometric;
            } else {
                PropertyBag["geometric"] = geometric;
            }

            //ImageType imgtype = ActiveRecordBase<ImageType>.Find(1);
            //PropertyBag["images"] = imgtype.Images; //Flash["images"] != null ? Flash["images"] : 
            //PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll();
            PropertyBag["authors"] = ActiveRecordBase<users>.FindAll();//Flash["authors"] != null ? Flash["authors"] : ActiveRecordBase<author>.FindAll();
            PropertyBag["geometrictype"] = ActiveRecordBase<geometrics_types>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<user_groups>.FindAll();
            PropertyBag["statuslists"] = ActiveRecordBase<status>.FindAll();

            //if (page == 0)
            //    page = 1;
            //int pagesize = 10;
            //List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            //baseEx.Add(Expression.Eq("Place", geometric));




            /*List<tags> tags = new List<tags>();
            tags.AddRange(geometric.tags);
            for (int i = 0; i < 2; i++)
                tags.Add(new tags());
            PropertyBag["geometrictags"] = tags;*/

            List<users> authors = new List<users>();
            authors.AddRange(geometric.Authors);
            for (int i = 0; i < 2; i++)
                authors.Add(new users());

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
        public void New(int type) {
            CancelView();
            PropertyBag["credits"] = "";
            PropertyBag["imagetypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["images_inline"] = ActiveRecordBase<media_repo>.FindAll();

            geometrics geometric = new geometrics();
            List<media_repo> images = new List<media_repo>();
            /*images.AddRange(geometric.Images);
            if (images.Count == 0)
            {
                images.Add(new media_repo());
            }*/
            PropertyBag["geometricimages"] = images;
            PropertyBag["loginUser"] = UserService.getUserFull();
            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"

            String availableImagesList = "";
            PropertyBag["availableImages"] = availableImagesList; // string should be "location1","location2","location3"

            PropertyBag["selectedType"] = type>0?type:3;

            PropertyBag["styles"] = ActiveRecordBase<styles>.FindAll();
            PropertyBag["images"] = Flash["images"] != null ? Flash["images"] : ActiveRecordBase<media_repo>.FindAll();
            PropertyBag["geometric"] = Flash["geometric"] != null ? Flash["geometric"] : geometric;
            PropertyBag["tags"] = Flash["tags"] != null ? Flash["tags"] : ActiveRecordBase<tags>.FindAll();
            PropertyBag["authors"] = Flash["authors"] != null ? Flash["authors"] : ActiveRecordBase<users>.FindAll();
            PropertyBag["geometrictype"] = ActiveRecordBase<geometrics_types>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<user_groups>.FindAll();
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


        public void GetAddImage(int count) {
            PropertyBag["count"] = count;

            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("type", ActiveRecordBase<media_types>.Find(1)));
            PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll(baseEx.ToArray());

            List<media_repo> images = new List<media_repo>();
            images.Add(new media_repo());
            PropertyBag["geometricimages"] = images;
            RenderView("addimage", true);
        }
        public void DeleteImage(int id, int imageid) {
            if (id.Equals(0) || imageid.Equals(0)) {
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


        public void clearLock(int id, bool ajax) {
            geometrics geometric = ActiveRecordBase<geometrics>.Find(id);
            geometric.editing = null;
            ActiveRecordMediator<geometrics>.Save(geometric);
            CancelLayout();
            RenderText("true");
        }

        public string normaliz_latsLongs(string latLong, string type) {

            latLong = latLong.Trim();

            bool longFirst = true;
            if (!latLong.StartsWith("-")) { longFirst = false; }
            latLong = latLong.Replace(",0", ",");
            latLong = latLong.Replace(",", "|");
            latLong = latLong.Replace("|\r\n", ",");
            latLong = latLong.Replace("|", " ");
            latLong = latLong.Replace("\r\n", "");

            if (!longFirst) {
                string pattern = @"(\d+\.\d+)\s?(-?\d+\.\d+),?";
                string replacement = "$2 $1,";
                Regex rgx = new Regex(pattern);
                latLong = rgx.Replace(latLong, replacement);
            }
            if (type == "polygon") { /* this is to avoid an error where the ring needs to be closed in MS SQL */
                string[] tmp = latLong.Split(',');
                if (tmp[0] != tmp[tmp.Length - 1]) {
                    latLong = latLong.TrimEnd(',') + "," + tmp[0];
                }
            }

            return latLong.TrimEnd(',');
        }

        public void Update([ARDataBind("geometric", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] geometrics geometric,
            [ARDataBind("tags", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]tags[] tags, String[] newtag,
            [ARDataBind("images", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]media_repo[] images,
            [ARDataBind("authors", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]users[] authors,
            [ARDataBind("child_geos", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] geometrics[] child_geos, // 
            string[] boundary,
            string[] boundary_parts,
            string geom_type,
            [ARDataBind("geometric_media", Validate = true, AutoLoad = AutoLoadBehavior.OnlyNested)]geometrics_media[] media, string apply, string cancel) {
            Flash["geometric"] = geometric;
            Flash["tags"] = geometric;
            Flash["images"] = geometric;
            Flash["authors"] = geometric;

            if (cancel != null) {
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
            //IList<styles> styled = geometric.style;
            //geometric.style.Clear();


            users user = UserService.getUserFull();
            geometric.editing = user;

            int requestedStatus = UserService.checkPrivleage("can_publish") && geometric.status != null ? geometric.status.id : 1;
            geometric.status = ActiveRecordBase<status>.Find(requestedStatus);

            if (String.IsNullOrEmpty(geometric.name)) {
                geometric.name = "Untitled";
            }



            // geometric.tags.Clear(); 
            //place.Images.Clear();
            
            if (apply != null) {

            } else {
                geometric.editing = null;
            }


            if (geometric.id == 0) {
                //PlaceStatus stat = ActiveRecordBase<PlaceStatus>.Find(1);
                //place.Status = stat;
                geometric.creation_date = DateTime.Now;
            } else {
                geometric.updated_date = DateTime.Now;
            }

            if (geometric.Authors != null && geometric.Authors.Count() > 0) geometric.Authors.Clear();
            foreach (users author in authors) {
                if (author.id > 0)
                    geometric.Authors.Add(author);
            }
            ActiveRecordMediator<geometrics>.Save(geometric);
            if (geometric.children != null) {
               // geometric.children.Clear();
            }
            if (geometric.children == null) geometric.children = new List<geometrics>();
            geometrics_types geo_type = ActiveRecordBase<geometrics_types>.FindFirst(new ICriterion[] { Expression.Eq("name", geom_type) });
            int i = 0;
            foreach (geometrics geom in child_geos) {
                //geom.id = 0;
                //geometrics item = make_gem(geom_type, geom, boundary_parts, geometric);

                //users user = UserService.getUserFull();
                geom.editing = user;
                geom.status = ActiveRecordBase<status>.Find(requestedStatus);

                if (String.IsNullOrEmpty(geom.name)) {
                    geom.name = "Untitled";
                }

                //geometric.parent = parent;

                // geometric.tags.Clear(); 
                //place.Images.Clear();

                /*if (apply != null) {

                } else {
                    geometric.editing = null;
                }*/


                if (geom.id == 0) {
                    //PlaceStatus stat = ActiveRecordBase<PlaceStatus>.Find(1);
                    //place.Status = stat;
                    geom.creation_date = DateTime.Now;
                } else {
                    geom.updated_date = DateTime.Now;
                }

                /*if (geometric.Authors != null && geometric.Authors.Count() > 0) geometric.Authors.Clear();
                foreach (users author in authors) {
                    if (author.id > 0)
                        geometric.Authors.Add(author);
                }*/





                string gemSql = "";
                string gemtype = "";
                switch (geom_type) {
                    case "marker": //case "POINT":
                        if (boundary_parts.Length > 0) {
                            gemSql = "POINT (" + normaliz_latsLongs(boundary_parts[i], geom_type) + ")";
                        }
                        gemtype = "Marker";
                        break;
                    case "polyline": //case "LINESTRING":
                        if (boundary_parts.Length > 0) {
                            gemSql = "LINESTRING (" + normaliz_latsLongs(boundary_parts[i], geom_type) + ")";
                        }
                        gemtype = "Line";
                        break;
                    case "polygon": //case "POLYGON":
                        if (boundary_parts.Length > 0) {
                            gemSql = "POLYGON ((" + normaliz_latsLongs(boundary_parts[i], geom_type) + "))";
                        }
                        
                        /*


                        if (boundary_parts.Length == 1) {
                            gemSql = "POLYGON ((" + normaliz_latsLongs(boundary_parts[i], geom_type) + "))";
                        }
                        if (boundary_parts.Length > 1) {
                            String WKT_OBJ_STR = "";
                            foreach (String bound in boundary_parts) {
                                WKT_OBJ_STR += (String.IsNullOrWhiteSpace(WKT_OBJ_STR) ? "" : ",") + "((" + normaliz_latsLongs(bound, geom_type) + "))";
                            }
                            gemSql = "MULTIPOLYGON (" + WKT_OBJ_STR + ")";
                        }*/
                        gemtype = "Shape";
                        break;
                    case "rectangle":
                        if (boundary_parts.Length > 0) {
                            gemSql = "POLYGON ((" + normaliz_latsLongs(boundary_parts[i], geom_type) + "))";
                        }
                        gemtype = "Shape";
                        break;
                    case "circle":
                        if (boundary_parts.Length > 0) {
                            gemSql = "POLYGON ((" + normaliz_latsLongs(boundary_parts[i], geom_type) + "))";
                        }
                        gemtype = "Shape";
                        break;
                    case "MULTIPOINT":

                    case "MULTILINESTRING":
                    case "MULTIPOLYGON":
                    case "GEOMETRYCOLLECTION":
                        break;
                }

                geom.default_type = geo_type;
                //geometric.geometric_types = geom_type;
                if (boundary_parts[i] != null) {
                    string wkt = gemSql;

                    // string wkt = "POLYGON ((-117.170966 46.741963,-117.174914 46.736375,-117.181094 46.730551,-117.182382 46.729080,-117.178176 46.728786,-117.176459 46.729492,-117.173627 46.729316,-117.170966 46.728139,-117.166160 46.725374,-117.164958 46.723197,-117.163070 46.721549,-117.153800 46.721902,-117.137492 46.729080,-117.138694 46.748609,-117.145560 46.751197,-117.158435 46.748727,-117.165988 46.744492 ,-117.170966 46.741963))";
                    SqlChars udtText = new SqlChars(wkt);


                    // a helper SqlGeometry, which isn't picky about ring orientation
                    var geometryHelper =
                        SqlGeometry.STGeomFromText(udtText, 4326).MakeValid();

                    // STUnion will automagically correct any bad ring orientation
                    var validGeom =
                        geometryHelper.STUnion(geometryHelper.STStartPoint());

                    // use the validGeom with correct ring orientation to 
                    // create a SqlGeography.
                    var sqlGeometry1 =
                        SqlGeography.STGeomFromText(validGeom.STAsText(), 4326);



                    //SqlGeometry sqlGeometry1 = SqlGeometry.STGeomFromText(udtText, 4326).MakeValid();
                    //SqlGeometry.STGeomFromText(udtText, 4326).MakeValid();

                    MemoryStream ms = new MemoryStream();
                    BinaryWriter bw = new BinaryWriter(ms);
                    byte[] WKB = sqlGeometry1.STAsBinary().Buffer;
                    //bw.Write(WKB);

                    //byte[] b2 = ms.ToArray();
                    //SqlBytes udtBinary2 = new SqlBytes(b2);
                    //SqlGeography sqlGeometry2 = SqlGeography.STGeomFromWKB(udtBinary2, 4326);

                    geom.boundary = geometrics.AsByteArray(sqlGeometry1);//WKB;//
                }


                //ActiveRecordMediator<geometrics>.Update(geom);
                geometric.children.Add(geom);
                i++;
            }
            

            /*

            string gemSql = "";
            string gemtype = "";
            switch (geom_type) {
                case "marker": //case "POINT":
                    if (boundary.Length>0) {
                        gemSql = "POINT (" + normaliz_latsLongs(boundary[0], geom_type) + ")";
                    }
                    gemtype = "Marker";
                    break;
                case "polyline": //case "LINESTRING":
                    if (boundary.Length > 0) {
                        gemSql = "LINESTRING (" + normaliz_latsLongs(boundary[0], geom_type) + ")";
                    }
                    gemtype = "Line";
                    break;
                case "polygon": //case "POLYGON":
                    if (boundary.Length == 1) {
                        gemSql = "POLYGON ((" + normaliz_latsLongs(boundary[0], geom_type) + "))";
                    }
                    if (boundary.Length > 1) {
                        String WKT_OBJ_STR = "";
                        foreach (String bound in boundary) {
                            WKT_OBJ_STR += (String.IsNullOrWhiteSpace(WKT_OBJ_STR)?"":",") + "((" + normaliz_latsLongs(bound, geom_type) + "))";
                        }
                        gemSql = "MULTIPOLYGON (" + WKT_OBJ_STR + ")";
                    }
                    gemtype = "Shape";
                    break;
                case "rectangle":
                    if (boundary.Length > 0) {
                        gemSql = "POLYGON ((" + normaliz_latsLongs(boundary[0], geom_type) + "))";
                    }
                    gemtype = "Shape";
                    break;
                case "circle":
                    if (boundary.Length > 0) {
                        gemSql = "POLYGON ((" + normaliz_latsLongs(boundary[0], geom_type) + "))";
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
            if (boundary != null) {
                string wkt = gemSql;

                // string wkt = "POLYGON ((-117.170966 46.741963,-117.174914 46.736375,-117.181094 46.730551,-117.182382 46.729080,-117.178176 46.728786,-117.176459 46.729492,-117.173627 46.729316,-117.170966 46.728139,-117.166160 46.725374,-117.164958 46.723197,-117.163070 46.721549,-117.153800 46.721902,-117.137492 46.729080,-117.138694 46.748609,-117.145560 46.751197,-117.158435 46.748727,-117.165988 46.744492 ,-117.170966 46.741963))";
                SqlChars udtText = new SqlChars(wkt);


                // a helper SqlGeometry, which isn't picky about ring orientation
                var geometryHelper =
                    SqlGeometry.STGeomFromText(udtText, 4326).MakeValid();

                // STUnion will automagically correct any bad ring orientation
                var validGeom =
                    geometryHelper.STUnion(geometryHelper.STStartPoint());

                // use the validGeom with correct ring orientation to 
                // create a SqlGeography.
                var sqlGeometry1 =
                    SqlGeography.STGeomFromText(validGeom.STAsText(), 4326);



                //SqlGeometry sqlGeometry1 = SqlGeometry.STGeomFromText(udtText, 4326).MakeValid();
                //SqlGeometry.STGeomFromText(udtText, 4326).MakeValid();

                MemoryStream ms = new MemoryStream();
                BinaryWriter bw = new BinaryWriter(ms);
                byte[] WKB = sqlGeometry1.STAsBinary().Buffer;
                //bw.Write(WKB);

                //byte[] b2 = ms.ToArray();
                //SqlBytes udtBinary2 = new SqlBytes(b2);
                //SqlGeography sqlGeometry2 = SqlGeography.STGeomFromWKB(udtBinary2, 4326);

                geometric.boundary = geometrics.AsByteArray(sqlGeometry1);//WKB;//
            }*/


            ActiveRecordMediator<geometrics>.SaveAndFlush(geometric);
            clearPlaceStaticMap(geometric);
            makePlaceStaticMap(geometric);
            


            //cleanUpgeometric_media(geometric.id);

            Flash["geometric"] = null;
            Flash["tags"] = null;
            Flash["images"] = null;
            Flash["authors"] = null;


            if (apply != null) {
                if (apply != " Save ") {
                    RedirectToUrl("~/geometrics/_edit.castle?id=" + geometric.id);
                } else {
                    RedirectToReferrer();
                }
            } else {
                RedirectToAction("list");
            }
        }
        public geometrics make_gem(String geom_type, geometrics geometric, string[] boundary_parts, geometrics parent) {
            users user = UserService.getUserFull();
            geometric.editing = user;

            int requestedStatus = UserService.checkPrivleage("can_publish") && geometric.status != null ? geometric.status.id : 1;
            geometric.status = ActiveRecordBase<status>.Find(requestedStatus);

            if (String.IsNullOrEmpty(geometric.name)) {
                geometric.name = "Untitled";
            }

            //geometric.parent = parent;

            // geometric.tags.Clear(); 
            //place.Images.Clear();

            /*if (apply != null) {

            } else {
                geometric.editing = null;
            }*/


            if (geometric.id == 0) {
                //PlaceStatus stat = ActiveRecordBase<PlaceStatus>.Find(1);
                //place.Status = stat;
                geometric.creation_date = DateTime.Now;
            } else {
                geometric.updated_date = DateTime.Now;
            }

            /*if (geometric.Authors != null && geometric.Authors.Count() > 0) geometric.Authors.Clear();
            foreach (users author in authors) {
                if (author.id > 0)
                    geometric.Authors.Add(author);
            }*/


            


            string gemSql = "";
            string gemtype = "";
            switch (geom_type) {
                case "marker": //case "POINT":
                    if (boundary_parts.Length > 0) {
                        gemSql = "POINT (" + normaliz_latsLongs(boundary_parts[0], geom_type) + ")";
                    }
                    gemtype = "Marker";
                    break;
                case "polyline": //case "LINESTRING":
                    if (boundary_parts.Length > 0) {
                        gemSql = "LINESTRING (" + normaliz_latsLongs(boundary_parts[0], geom_type) + ")";
                    }
                    gemtype = "Line";
                    break;
                case "polygon": //case "POLYGON":
                    if (boundary_parts.Length == 1) {
                        gemSql = "POLYGON ((" + normaliz_latsLongs(boundary_parts[0], geom_type) + "))";
                    }
                    if (boundary_parts.Length > 1) {
                        String WKT_OBJ_STR = "";
                        foreach (String bound in boundary_parts) {
                            WKT_OBJ_STR += (String.IsNullOrWhiteSpace(WKT_OBJ_STR) ? "" : ",") + "((" + normaliz_latsLongs(bound, geom_type) + "))";
                        }
                        gemSql = "MULTIPOLYGON (" + WKT_OBJ_STR + ")";
                    }
                    gemtype = "Shape";
                    break;
                case "rectangle":
                    if (boundary_parts.Length > 0) {
                        gemSql = "POLYGON ((" + normaliz_latsLongs(boundary_parts[0], geom_type) + "))";
                    }
                    gemtype = "Shape";
                    break;
                case "circle":
                    if (boundary_parts.Length > 0) {
                        gemSql = "POLYGON ((" + normaliz_latsLongs(boundary_parts[0], geom_type) + "))";
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
            if (boundary_parts != null) {
                string wkt = gemSql;

                // string wkt = "POLYGON ((-117.170966 46.741963,-117.174914 46.736375,-117.181094 46.730551,-117.182382 46.729080,-117.178176 46.728786,-117.176459 46.729492,-117.173627 46.729316,-117.170966 46.728139,-117.166160 46.725374,-117.164958 46.723197,-117.163070 46.721549,-117.153800 46.721902,-117.137492 46.729080,-117.138694 46.748609,-117.145560 46.751197,-117.158435 46.748727,-117.165988 46.744492 ,-117.170966 46.741963))";
                SqlChars udtText = new SqlChars(wkt);


                // a helper SqlGeometry, which isn't picky about ring orientation
                var geometryHelper =
                    SqlGeometry.STGeomFromText(udtText, 4326).MakeValid();

                // STUnion will automagically correct any bad ring orientation
                var validGeom =
                    geometryHelper.STUnion(geometryHelper.STStartPoint());

                // use the validGeom with correct ring orientation to 
                // create a SqlGeography.
                var sqlGeometry1 =
                    SqlGeography.STGeomFromText(validGeom.STAsText(), 4326);



                //SqlGeometry sqlGeometry1 = SqlGeometry.STGeomFromText(udtText, 4326).MakeValid();
                //SqlGeometry.STGeomFromText(udtText, 4326).MakeValid();

                MemoryStream ms = new MemoryStream();
                BinaryWriter bw = new BinaryWriter(ms);
                byte[] WKB = sqlGeometry1.STAsBinary().Buffer;
                //bw.Write(WKB);

                //byte[] b2 = ms.ToArray();
                //SqlBytes udtBinary2 = new SqlBytes(b2);
                //SqlGeography sqlGeometry2 = SqlGeography.STGeomFromWKB(udtBinary2, 4326);

                geometric.boundary = geometrics.AsByteArray(sqlGeometry1);//WKB;//
            }


            ActiveRecordMediator<geometrics>.Save(geometric);
            return geometric;
        }
        public void _copy(int id, String name) {
            CancelLayout();
            CancelView();
            geometrics org = ActiveRecordBase<geometrics>.Find(id);

            Mapper.Reset();
            Mapper.CreateMap<geometrics, geometrics>().ForMember(dest => dest.id, o => o.Ignore());
            geometrics copy = new geometrics();
            Mapper.Map(org, copy);
            ActiveRecordMediator<geometrics>.SaveAndFlush(copy);


            Flash["message"] = "New copy saved to the system.  You may now edit " + name;
            RedirectToUrl("~/geometrics/_edit.castle?id=" + copy.id);
        }
        public void update_field(
                   [ARDataBind("field", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] field_types field,
                   [DataBind("ele", Validate = true)] dynamic ele,
                   string ele_type,
                   int placemodel,
                  bool ajaxed_update,
                  string apply,
                  string cancel
                       ) {
            if (cancel != null) {
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
            if (apply != null || ajaxed_update) {
                if (field.id > 0) {
                    RedirectToUrl("edit_field.castle?id=" + field.id);
                    return;
                } else {
                    RedirectToReferrer();
                }
            } else {
                RedirectToAction("list");
            }
        }

        public void update_style(
                [ARDataBind("style", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] styles style,
                bool ajaxed_update,
                string apply,
                string cancel
                ) {
            if (cancel != null) {
                RedirectToAction("list");
                return;
            }
            char[] startC = { '{' };
            char[] endC = { '}' };

            var jss = new JavaScriptSerializer();

            /*
                Dictionary<string, string> urlparams = getPostParmasAsObj_obj("options");
                
                //jss.RegisterConverters(new JavaScriptConverter[] { new DynamicJsonConverter() });

                //var values = new Dictionary<string, object>();
                MyJsonDictionary<String, Object> values = new MyJsonDictionary<String, Object>();

                foreach (KeyValuePair<string, string> _urlparams in urlparams)
                {
                    values.Add(_urlparams.Key, _urlparams.Value);
                }
            */
            /*
                values.Add("Title", "Hello World!");
                values.Add("Text", "My first post");
                values.Add("Tags", new[] { "hello", "world" });
            */
            //var usettings = new DynamicEntity(values);


            Dictionary<string, string> urlparams = getPostParmasAsObj_obj("rest");
            MyJsonDictionary<String, Object> rest = new MyJsonDictionary<String, Object>();
            foreach (KeyValuePair<string, string> _urlparams in urlparams) {
                if (!String.IsNullOrWhiteSpace(_urlparams.Value)) rest.Add(_urlparams.Key, _urlparams.Value);
            }

            urlparams = getPostParmasAsObj_obj("mouseover");
            MyJsonDictionary<String, Object> mouseover = new MyJsonDictionary<String, Object>();
            foreach (KeyValuePair<string, string> _urlparams in urlparams) {
                if (!String.IsNullOrWhiteSpace(_urlparams.Value)) mouseover.Add(_urlparams.Key, _urlparams.Value);
            }

            urlparams = getPostParmasAsObj_obj("click");
            MyJsonDictionary<String, Object> click = new MyJsonDictionary<String, Object>();
            foreach (KeyValuePair<string, string> _urlparams in urlparams) {
                if (!String.IsNullOrWhiteSpace(_urlparams.Value)) click.Add(_urlparams.Key, _urlparams.Value);
            }

            urlparams = getPostParmasAsObj_obj("dblclick");
            MyJsonDictionary<String, Object> dblclick = new MyJsonDictionary<String, Object>();
            foreach (KeyValuePair<string, string> _urlparams in urlparams) {
                if (!String.IsNullOrWhiteSpace(_urlparams.Value)) dblclick.Add(_urlparams.Key, _urlparams.Value);
            }


            dynamic jsonstr = new {
                events = new {
                    rest = jss.Deserialize<Dictionary<string, dynamic>>(Serialize(rest)),
                    mouseover = jss.Deserialize<Dictionary<string, dynamic>>(Serialize(mouseover)),
                    click = jss.Deserialize<Dictionary<string, dynamic>>(Serialize(click)),
                    dblclick = jss.Deserialize<Dictionary<string, dynamic>>(Serialize(dblclick))
                }
            };
            /* var json = jss.Serialize(jsonstr);
             field.attr = json;

             geometric_events[] events = ActiveRecordBase<geometric_events>.FindAll();
         */

            style.style_obj = jss.Serialize(jsonstr);// Serialize(style._zoom);//jss.Serialize(usettings);


            /* first add zoom levels 
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
                }*/

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

            if (apply != null || ajaxed_update) {
                if (style.id > 0) {
                    RedirectToUrl("edit_style.castle?id=" + style.id);
                    return;
                } else {
                    RedirectToReferrer();
                }
            } else {
                RedirectToAction("list");
            }
        }

        public void test() {
            geometrics geo = ActiveRecordBase<geometrics>.Find(10);
            SqlGeography spatial = geometrics.AsGeography(geo.boundary);

            CancelView();
        }

        public void delete(int id) {
            geometrics geometric = ActiveRecordBase<geometrics>.Find(id);
            Flash["message"] = "Article, <strong>Note:" + geometric.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<geometrics>.Delete(geometric);
            CancelLayout();
            RedirectToAction("list");
        }
        public void delete_style(int id) {
            styles styles = ActiveRecordBase<styles>.Find(id);
            Flash["message"] = "Article, <strong>Note:" + styles.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<styles>.Delete(styles);
            CancelLayout();
            RedirectToAction("list");
        }

    }
}
