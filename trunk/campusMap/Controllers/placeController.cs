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
        using NHibernate.Expression;
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
    using Newtonsoft.Json;
    using Newtonsoft.Json.Utilities;
    using Newtonsoft.Json.Linq;



    #endregion

    [Layout("default")]
    public class placeController : SecureBaseController
    {

    /*
     * 
     * MAY BE A FIELDS HELPER SERVICES WOULD BE WISE ?
     * 
     */


        public void editor(int id, int page){
            if (id == 0){
                New();
            }else{
                Edit_place(id, page);
            }
            CancelView();
            CancelLayout();
            RenderView("editor_place");
            return;
        }



        public void Index()
        {
            //ActiveRecordBase<Block>.FindAll();
            PropertyBag["AccessDate"] = DateTime.Now;           
        }

        public void breakingNewsreadmore(int id)
        {
            place place = ActiveRecordBase<place>.Find(id);
            PropertyBag["BreakingNews"] = place;
        }

        public void List(int page, int searchId, string status)
        {
            authors user = getUser();
            PropertyBag["authorname"] = getUserName();
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();
            PropertyBag["placetype"] = ActiveRecordBase<place_types>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["loginUser"] = user;
            PropertyBag["logedin"] = userService.getLogedIn();
            //user.Sections.Contains(place.place_types);

                IList<place> items;
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
                    IList<place> userplaces = user.Places;
                    object[] obj = new object[userplaces.Count];
                    int i = 0;
                    foreach(place place in userplaces){
                        obj[i] = place.id;
                        i++;
                    }
                    baseEx.Add(Expression.In("place_id", obj));
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
                    items = ActiveRecordBase<place>.FindAll(Order.Desc("order"), pubEx.ToArray());
                }
                else
                {
                    items = ActiveRecordBase<place>.FindAll(Order.Desc("publish_time"), pubEx.ToArray());
                }
                PropertyBag["publishedPlaces"] = PaginationHelper.CreatePagination(items, pagesize, paging);

            //REVIEW
                if (status == "review"){
                    paging = page;
                }else{
                    paging = 1;
                }
                List<AbstractCriterion> revEx = new List<AbstractCriterion>();
                revEx.AddRange(baseEx);
                revEx.Add(Expression.Eq("status", ActiveRecordBase<status>.Find(2)));

                items = ActiveRecordBase<place>.FindAll(Order.Desc("creation_date"), revEx.ToArray());
                PropertyBag["reviewPlaces"] = PaginationHelper.CreatePagination(items, pagesize, paging);


            //DRAFT
                if (status == "draft"){
                    paging = page;
                }else{
                    paging = 1;
                }
                List<AbstractCriterion> draftEx = new List<AbstractCriterion>();
                draftEx.AddRange(baseEx);
                draftEx.Add(Expression.Eq("status", ActiveRecordBase<status>.Find(1)));
                items = ActiveRecordBase<place>.FindAll(Order.Desc("creation_date"), draftEx.ToArray());
                PropertyBag["draftPlaces"] = PaginationHelper.CreatePagination(items, pagesize, paging);


            //SETUP SEARCHID and parts
                if (searchId.Equals(0)){
                    PropertyBag["searchId"] = 0;
                }else{
                    place_types type = new place_types();
                    PropertyBag["searchId"] = searchId;
                    place firstplace = new place();
                    place lastplace = new place();
                    /*if (type.Places.Count.Equals(0)){
                        firstplace = null;
                        lastplace = null;
                    }else{
                        firstplace = type.Places[0];
                        lastplace = type.Places[type.Places.Count - 1];
                    }*/
                    PropertyBag["firstplace"] = firstplace;
                    PropertyBag["lastplace"] = lastplace; 
                }

                pagesize = 100;
                IList<place_types> place_types_items;
                place_types_items = ActiveRecordBase<place_types>.FindAll();
                PropertyBag["types"] = PaginationHelper.CreatePagination(place_types_items, pagesize, paging);



                pagesize = 15;
                IList<field_types> place_fields_items;
                List<AbstractCriterion> fieldsEx = new List<AbstractCriterion>();
                fieldsEx.AddRange(baseEx);
                fieldsEx.Add(Expression.Eq("model", this.GetType().Name));
                place_fields_items = ActiveRecordBase<field_types>.FindAll(fieldsEx.ToArray());
                PropertyBag["fields"] = PaginationHelper.CreatePagination(place_fields_items, pagesize, paging);

            RenderView("list");
        }
        public bool canEdit(place place, authors user)
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
        public bool canPublish(authors user)
        {
            bool flag = false;
            /*switch (user.Accesslevel.Title)
            {
                case "Author": flag = true;
                               
                case "Editor": flag = true; break;

                case "Contributor": flag = false; break;
            }*/
            return flag;        
        }

        public void new_type()
        {
            place_types type = new place_types();
            PropertyBag["type"] = type;
            RenderView("types/new");
        }
        public void new_field()
        {
            field_types field = new field_types();
            PropertyBag["field"] = field;
            place_models[] p_models = ActiveRecordBase<place_models>.FindAll();
            PropertyBag["p_models"] = p_models;


            RenderView("fields/new");
        }
        public void edit_type(int id)
        {
            place_types type = ActiveRecordBase<place_types>.Find(id);
            PropertyBag["type"] = type;
            RenderView("types/new");
        }

        public void edit_field(int id)
        {
            field_types field = ActiveRecordBase<field_types>.Find(id);
            PropertyBag["field"] = field;

            place_models[] p_models = ActiveRecordBase<place_models>.FindAll();
            PropertyBag["p_models"] = p_models;

            elementSet ele = (elementSet)JsonConvert.DeserializeObject(field.attr.ToString(), typeof(elementSet));
            string ele_str = FieldsService.getfieldmodel(ele);


            PropertyBag["html_ele"] = ele_str;
            PropertyBag["ele"] = ele;

            RenderView("fields/new");
        }


        public void get_field(int id)
        {
            fields field = ActiveRecordBase<fields>.Find(id);

            selectionSet sel = (selectionSet)JsonConvert.DeserializeObject(field.value.ToString(), typeof(selectionSet));
            elementSet ele = (elementSet)JsonConvert.DeserializeObject(field.type.attr.ToString(), typeof(elementSet));

            string ele_str = FieldsService.getfieldmodel(ele, sel);

            PropertyBag["field"] = field;
            PropertyBag["ele_type"] = ele.type;
            PropertyBag["html_ele"] = ele_str;

            RenderView("fields/new");
        }

        


        public void update_placeType([ARDataBind("type", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] place_types type)
        {
            ActiveRecordMediator<place_types>.Save(type);
            RedirectToAction("list");
        }
        public void update_placeField(
            [ARDataBind("field", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] field_types field,
       [DataBind("ele", Validate = true)] elementSet ele,
            string ele_type,
        int placemodel
                )
        {
            
            field.model = this.GetType().Name;
            field.set = ActiveRecordBase<place_models>.Find(placemodel).id;
            string ele_attr = JsonConvert.SerializeObject(ele.attr);

            char[] endC = {'{'};
            ele_attr = ele_attr.TrimEnd(endC);

            char[] startC = {'}'};
            ele_attr = ele_attr.TrimStart(startC);
            field.attr = "{ \"type\": \"" + ele_type + "\", \"label\": \"test_label\", \"attr\":" + ele_attr + ", \"options\":[{\"label\":\"bar\",\"val\":\"bars\"},{\"label\":\"fooed\",\"val\":\"baring\"}] }";
            ActiveRecordMediator<fields>.Save(field);
            RedirectToAction("list");
        }

        public void setStatus(int id, int status, bool ajax)
        {
            place one_place = ActiveRecordBase<place>.Find(id);
            PropertyBag["place"] = one_place;
            status published = ActiveRecordBase<status>.Find(status);
            //place.Status = published;
            ActiveRecordMediator<place>.Save(one_place);

            //if(!ajax)
            //RedirectToReferrer();
            string myTime = DateTime.Now.ToString("yyyy.MM.dd HH:mm:ss:ffff");
            NameValueCollection myCol = new NameValueCollection();
            myCol.Add("time", myTime);

            Redirect("place", "list", myCol);
            //}
        }

        public place[] getDrafts()
        {
           place draft = ActiveRecordBase<place>.Find(1);
           ICriterion expression = Expression.Eq("Status", draft);
           place[] places = ActiveRecordBase<place>.FindAll(expression);
           return places;        
        }
        public place[] getReview()
        {
            place review = ActiveRecordBase<place>.Find(2);
            ICriterion expression = Expression.Eq("Status", review);
            place[] places = ActiveRecordBase<place>.FindAll(expression);
            return places;
        }
        public place[] getPublished()
        {
            place published = ActiveRecordBase<place>.Find(3);
            ICriterion expression = Expression.Eq("Status", published);
            place[] places = ActiveRecordBase<place>.FindAll(expression);
            return places;        
        } 
     
 
        public void tinyimagelist(int id)
        {
            place place = ActiveRecordBase<place>.Find(id);
            PropertyBag["placeimages"] = place.Images;
            CancelLayout();
        }
        public String GetCredit()
        {
            String sql = "SELECT DISTINCT s.credit FROM media_repo AS s WHERE NOT s.credit = 'NULL'";
            SimpleQuery<String> q = new SimpleQuery<String>(typeof(place), sql);
            Array credits = q.Execute();
            String creditsList = "";
            foreach (String s in credits)
            {
                creditsList += '"' + s.ToString() + '"' + ',';
            }
            return creditsList.TrimEnd(',');
        }
        public void Edit_place(int id, int page)
        {
            campusMap.Services.LogService.writelog("Editing place " + id);
            PropertyBag["credits"] = "";
            PropertyBag["imagetypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["images_inline"] = ActiveRecordBase<media_repo>.FindAll();

            place one_place = ActiveRecordBase<place>.Find(id);
            String username = getUserName();
            PropertyBag["authorname"] = username;
            one_place.checked_out_by = username;
            ActiveRecordMediator<place>.Save(one_place);
            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"

            PropertyBag["loginUser"] = getUser();
            PropertyBag["placeimages"] = one_place.Images;

            PropertyBag["tags"] = ActiveRecordBase<tags>.FindAll();
            if(Flash["place"] !=null)
            {
                place flashplace = Flash["place"] as place;
                flashplace.Refresh();
                PropertyBag["place"] = flashplace;
            }
            else
            {
                PropertyBag["place"] = one_place;
            }


            List<AbstractCriterion> typeEx = new List<AbstractCriterion>();
            typeEx.Add(Expression.Eq("model", this.GetType().Name));
            typeEx.Add(Expression.Eq("fieldset", one_place.model));
            PropertyBag["fields"] = ActiveRecordBase<field_types>.FindAll(typeEx.ToArray());






            //ImageType imgtype = ActiveRecordBase<ImageType>.Find(1);
            //PropertyBag["images"] = imgtype.Images; //Flash["images"] != null ? Flash["images"] : 
            //PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll();
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();//Flash["authors"] != null ? Flash["authors"] : ActiveRecordBase<author>.FindAll();
            PropertyBag["models"] = ActiveRecordBase<place_models>.FindAll();
            PropertyBag["types"] = ActiveRecordBase<place_types>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["statuslists"] = ActiveRecordBase<status>.FindAll();

            if (page == 0)
                page = 1;
            int pagesize = 10;
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("Place", one_place));

            IList<comments> items;

            items = ActiveRecordBase<comments>.FindAll(Order.Desc("CreateTime"), baseEx.ToArray());
            PropertyBag["comments"] = PaginationHelper.CreatePagination(items, pagesize, page);

            String CreditList = GetCredit();
            PropertyBag["credits"] = CreditList; 

            List<tags> tags = new List<tags>();
            tags.AddRange(one_place.tags);
            for (int i = 0; i < 2; i++)
                tags.Add(new tags());
            PropertyBag["placetags"] = tags;

            List<authors> authors = new List<authors>();
            authors.AddRange(one_place.Authors);
            for (int i = 0; i < 2; i++)
                authors.Add(new authors());

            List<media_repo> images = new List<media_repo>();
            images.AddRange(one_place.Images);
            if (images.Count == 0)
            {
               images.Add(new media_repo());
                PropertyBag["placeimages"] = images;   
            }

            PropertyBag["placeauthors"] = authors; 
            RenderView("new");
       
        }
        public void New()
        {
            PropertyBag["credits"] = ""; 
            PropertyBag["imagetypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["images_inline"] = ActiveRecordBase<media_repo>.FindAll();

            String CreditList = GetCredit();
            PropertyBag["credits"] = CreditList; 

            place place = new place();
            List<media_repo> images = new List<media_repo>();
            images.AddRange(place.Images);
            if (images.Count == 0)
            {
                images.Add(new media_repo());
            }
            PropertyBag["placeimages"] = images;     
            PropertyBag["loginUser"] = getUser();
            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"

            String availableImagesList = "";
            PropertyBag["availableImages"] = availableImagesList; // string should be "location1","location2","location3"

            
            PropertyBag["images"] = Flash["images"] != null ? Flash["images"] : ActiveRecordBase<media_repo>.FindAll();
            PropertyBag["place"] = Flash["place"] != null ? Flash["place"] : place;
            PropertyBag["tags"] = Flash["tags"] != null ? Flash["tags"] : ActiveRecordBase<tags>.FindAll();
            PropertyBag["authors"] = Flash["authors"] != null ? Flash["authors"] : ActiveRecordBase<authors>.FindAll();
            PropertyBag["types"] = ActiveRecordBase<place_types>.FindAll();
            PropertyBag["models"] = ActiveRecordBase<place_models>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["statuslists"] = ActiveRecordBase<status>.FindAll();
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



        public void GetAddAuthor(int count)
        {
            PropertyBag["count"] = count;
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();
            List<authors> authors = new List<authors>();
            authors.Add(new authors());
            authors.Add(new authors());
            PropertyBag["placeauthors"] = authors;
            RenderView("addauthor", true);
        }
        public void DeleteAuthor(int id, int placeId)
        {
            authors author = ActiveRecordBase<authors>.Find(id);
            place place = ActiveRecordBase<place>.Find(placeId);
            place.Authors.Remove(author);
            ActiveRecordMediator<place>.Save(place);
            CancelLayout();
            RenderText("true");
        }
        public void GetAddtags(int count)
        {
            PropertyBag["count"] = count;
            PropertyBag["tags"] = ActiveRecordBase<tags>.FindAll();
            List<tags> tags = new List<tags>();
            tags.Add(new tags());
            tags.Add(new tags());
            PropertyBag["placetags"] = tags;
            RenderView("addtag", true);
        }

        public void Deletetags(int id, int imageid)
        {
            tags tag = ActiveRecordBase<tags>.Find(imageid);
            place place = ActiveRecordBase<place>.Find(id);
            place.tags.Remove(tag);
            ActiveRecordMediator<place>.Save(place);
            CancelLayout();
            RenderText("true");
        }



        public void GetAddImage(int count)
        {
            PropertyBag["count"] = count;

            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("type", ActiveRecordBase<media_types>.Find(1)));
            PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll(baseEx.ToArray());

            List<media_repo> images = new List<media_repo>();
            images.Add(new media_repo());
            PropertyBag["placeimages"] = images;
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
            place place = ActiveRecordBase<place>.Find(id);
            place_media placemedia = ActiveRecordBase<place_media>.FindFirst(new ICriterion[] { Expression.Eq("place", place), Expression.Eq("media", media) });
            ActiveRecordMediator<place_media>.Delete(placemedia);
            //place.Images.Remove(image);
            //ActiveRecordMediator<place>.Save(place);
            CancelLayout();
            RenderText("true");
        }

        public void readmore(int id)
        {
            PropertyBag["place"] = id==0? null : ActiveRecordBase<place>.Find(id);   
        }
        public void view(int id)
        {
            PropertyBag["place"] = ActiveRecordBase<place>.Find(id);
        }
        public void clearLock(int id, bool ajax)
        {
            place place = ActiveRecordBase<place>.Find(id);
            place.checked_out_by = "";
            ActiveRecordMediator<place>.Save(place);
            CancelLayout();
            RenderText("true");
        }
        public void checktitle(string title, bool id)
        {
            int SID = placeService.placeByURL_id(title);
            CancelLayout();
            if (SID == 0 )
            {
                RenderText("false");
            }
            else
            {
                if (id) { RenderText(SID.ToString()); } else { RenderText("true"); }
            }
        }
        public string NVchecktitle(string title, bool id)
        {
            int SID = placeService.placeByURL_id(title);
            if (SID == 0 )
            {
                return "false";
            }
            else
            {
                if (id) {
                    return SID.ToString();
                } else {
                    return "true";
                }
            }
        }
        public void cleanUpplace_media(int id)
        {
            string uploadPath = Context.ApplicationPath + @"\uploads\";
                   uploadPath += @"place\" + id + @"\";
            if (!HelperService.DirExists(uploadPath))
            {
                return;
            }

            //ok the place has image as the dir was created already to hold them
            string[] filePaths = Directory.GetFiles(uploadPath, "*_TMP_*");
            foreach(string file in filePaths){
                FileInfo ImgFile = new FileInfo(file);
                ImgFile.Delete();
            }
        }
        public void Update([ARDataBind("place", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] place place,
            [ARDataBind("tags", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]tags[] tags, String[] newtag,
            [ARDataBind("images", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]media_repo[] images,
            [ARDataBind("authors", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]authors[] authors,
           [ARDataBind("place_media", Validate = true, AutoLoad = AutoLoadBehavior.OnlyNested)]place_media[] place_media, string apply, string cancel)     
        {
            Flash["place"] = place;
            Flash["tags"] = place;
            Flash["images"] = place;
            Flash["authors"] = place;
            
            if (cancel != null){
                place.checked_out_by = "";
                ActiveRecordMediator<place>.Save(place);
                RedirectToAction("list");
                return;
            }
            if (place.prime_name == null || place.prime_name.Length == 0 ){
                Flash["error"] = "You are missing the basic parts of a place";
                RedirectToReferrer();
                return;
            }

            /*if (place.place_types == null || place.place_types.place_type_id == 0)
            {
                Flash["error"] = "You must choose a Place type.";
                RedirectToReferrer();
                return;
            }*/

            

            authors user = getUser();
            /*if (!canPublish(user))
            {
                PlaceStatus stat= ActiveRecordBase<PlaceStatus>.Find(1);
                place.Status = stat;
            }*/

            place.tags.Clear(); 
            //place.Images.Clear();
            place.Authors.Clear();
            if (apply != null){

            }else{
                place.checked_out_by = "";
            }


            if (place.id == 0){
                //PlaceStatus stat = ActiveRecordBase<PlaceStatus>.Find(1);
                //place.Status = stat;
                place.creation_date = DateTime.Now;
            }else{
                place.updated_date = DateTime.Now;
            }

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
                            place.tags.Add(t);                                                                                  
                        }
                    }                        
                }               
                     
            }

            foreach (place_media si in place_media)
            {
                if (si.Media != null && si.Media.id > 0)
                {
                    place_media find = ActiveRecordBase<place_media>.FindFirst(new ICriterion[] { Expression.Eq("media", si.Media), Expression.Eq("place", place) });
                    find.place_order = si.place_order;
                    ActiveRecordMediator<place_media>.Save(find);
                }
            }

            foreach (tags tag in tags)
            {
                if (tag.id > 0)
                   place.tags.Add(tag);        
            }
            foreach (media_repo media in images)
            {
                if (media.id > 0 && !place.Images.Contains(media))
                {
                    place.Images.Add(media);
                }
            }
            
            foreach (authors author in authors)
            {
                if (author.id > 0)
                    place.Authors.Add(author);   
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


            ActiveRecordMediator<place>.Save(place);

            cleanUpplace_media(place.id);

            Flash["place"] = null;
            Flash["tags"] = null;
            Flash["images"] = null;
            Flash["authors"] = null;


            if (apply != null)
            {
                if (apply != " Save ")
                {
                    Redirect("Edit_place.castle?id=" + place.id);
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

        public void delete(int id)
        {
            place place = ActiveRecordBase<place>.Find(id);
            Flash["massage"] = "Article, <strong>Note:" + place.prime_name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<place>.Delete(place);
            CancelLayout();
            RedirectToAction("list");
        }
        public void delete_type(int id)
        {
            place_types place_type = ActiveRecordBase<place_types>.Find(id);
            Flash["massage"] = "Article, <strong>Note:" + place_type.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<place_types>.Delete(place_type);
            CancelLayout();
            RedirectToAction("list");
        }
        public void delete_field(int id)
        {
            field_types place_fields = ActiveRecordBase<field_types>.Find(id);
            Flash["massage"] = "Article, <strong>Note:" + place_fields.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<field_types>.Delete(place_fields);
            CancelLayout();
            RedirectToAction("list");
        }
    }
}