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


        public void editor(int id, int page, bool ajax)
        {
            if (id == 0){
                New();
            }else{
                _edit(id, page, ajax);
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
            PropertyBag["authorname"] = user.name;
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();
            PropertyBag["listtypes"] = ActiveRecordBase<place_types>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();

            PropertyBag["statuses"] = ActiveRecordBase<status>.FindAll();

            PropertyBag["user"] = user;
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
                PropertyBag["published_list"] = PaginationHelper.CreatePagination(items, pagesize, paging);
                IList<string> buttons = new List<string>();
                buttons.Add("edit");
                buttons.Add("delete");
                buttons.Add("publish");
                buttons.Add("broadcast");
                buttons.Add("view");
                buttons.Add("order");
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

                items = ActiveRecordBase<place>.FindAll(Order.Desc("creation_date"), revEx.ToArray());
                PropertyBag["review_list"] = PaginationHelper.CreatePagination(items, pagesize, paging);
                buttons = new List<string>();
                buttons.Add("edit");
                buttons.Add("delete");
                buttons.Add("publish");
                buttons.Add("view");
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
                items = ActiveRecordBase<place>.FindAll(Order.Desc("creation_date"), draftEx.ToArray());
                PropertyBag["draft_list"] = PaginationHelper.CreatePagination(items, pagesize, paging);

                buttons = new List<string>();
                buttons.Add("edit");
                buttons.Add("delete");
                buttons.Add("publish");
                buttons.Add("view");
                buttons.Add("ho");
                PropertyBag["draftButtonSet"] = buttons;  

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

                RenderView("../admin/listings/list");
        }
        public bool canEdit(place place, authors user)
        {
            bool flag = false;
           switch (user.access_levels.title)
            {
                case "Author":
                    {
                        foreach (place_types item in place.place_types)
                        {
                            if (place.Authors.Contains(user) && user.Sections.Contains(item))
                                flag = true; break;
                        } break;
                    }

                case "Editor":
                    {
                        foreach (place_types item in place.place_types)
                        {
                            if (user.Sections.Contains(item))
                                flag = true; break;
                        } break;
                    }
             }

            return flag;        
        }
        public bool canPublish(authors user)
        {
            bool flag = false;
            switch (user.access_levels.title)
            {
                case "Author": flag = true; break;
                               
                case "Editor": flag = true; break;
            }
            return flag;        
        }

        public void new_type()
        {
            place_types type = new place_types();
            PropertyBag["type"] = type;
            RenderView("../admin/types/new");
        }
        public void new_field()
        {
            field_types field = new field_types();
            PropertyBag["field"] = field;
            place_models[] p_models = ActiveRecordBase<place_models>.FindAll();
            PropertyBag["p_models"] = p_models;


            RenderView("../admin/fields/new");
        }
        public void edit_type(int id)
        {
            place_types type = ActiveRecordBase<place_types>.Find(id);
            PropertyBag["type"] = type;
            RenderView("../admin/fields/types/new");
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

            RenderView("../admin/fields/new");
        }

        public static string get_field(field_types field_type)
        {
            string _ele = "";
            _ele = get_field(field_type,null);
            return _ele;
        }
        public static string get_field(field_types field_type, place _place)
        {
            List<AbstractCriterion> typeEx = new List<AbstractCriterion>();
            typeEx.Add(Expression.Eq("type", field_type));
            if (!object.ReferenceEquals(_place, null)) typeEx.Add(Expression.Eq("owner", _place.id));
            fields field = ActiveRecordBase<fields>.FindFirst(typeEx.ToArray());

            selectionSet sel = null;
            if( field!=null  && !String.IsNullOrEmpty(field.value)){
                sel = (selectionSet)JsonConvert.DeserializeObject(field.value.ToString(), typeof(selectionSet));
            }
            elementSet ele = (elementSet)JsonConvert.DeserializeObject(field_type.attr.ToString(), typeof(elementSet));
            string ele_str = FieldsService.getfieldmodel(ele, sel);
            return ele_str;
        }

        


        public void update_type([ARDataBind("type", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] place_types type)
        {
            ActiveRecordMediator<place_types>.Save(type);
            RedirectToAction("list");
        }
        public void update_field(
            [ARDataBind("field", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] field_types field,
            [DataBind("ele", Validate = true)] elementSet ele,
            string ele_type,
            int placemodel,
           bool ajaxed_update,
           string apply,
           string cancel
                )
        {
            if (cancel != null){
                RedirectToAction("list");
                return;
            }
            char[] startC = { '{' };
            char[] endC = { '}' };



            ActiveRecordMediator<fields>.Save(field);
            
            field.model = this.GetType().Name;
            field.set = ActiveRecordBase<place_models>.Find(placemodel).id;  // NOTE THIS IS THE ONLY REASON WE CAN ABSTRACT YET... FIX?

            ele.attr.name = "fields[" + field.id + "]" ;//+ (ele.type == "dropdown"?"[]":"");

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

            field.attr = "{ \"type\": \"" + ele.type + "\", \"label\": \"test_label\", \"attr\":{" + ele_attr + "}, \"options\":"+ele_ops+" }";


            ActiveRecordMediator<fields>.Save(field);
            if (apply != null || ajaxed_update)
            {
                if (field.id > 0)
                {
                    Redirect("edit_field.castle?id=" + field.id);
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
        public void namelables(string term)
        {
            CancelView();
            CancelLayout();

            String sql = "SELECT DISTINCT s.label FROM place_names AS s WHERE NOT s.label = 'NULL'";
            if (String.IsNullOrEmpty(term))
            {
                sql += " AND s.label LIKE  '" + term + "%'";
            }

            SimpleQuery<String> q = new SimpleQuery<String>(typeof(place), sql);
            Array labels = q.Execute();
            String labelsList = "";
            foreach (String s in labels)
            {
                labelsList += @"{""label"":""" + s.ToString() + @""",";
                labelsList += @"""value"":""" + s.ToString() + @"""},";
            }
            RenderText("["+labelsList.TrimEnd(',')+"]");
        }

        public void get_placetags(string term)
        {
            CancelView();
            CancelLayout();

            String sql = "SELECT DISTINCT s.name FROM tags AS s WHERE NOT s.name = 'NULL'";
            if (String.IsNullOrEmpty(term))
            {
                sql += " AND s.name LIKE  '" + term + "%'";
            }

            SimpleQuery<String> q = new SimpleQuery<String>(typeof(place), sql);
            Array labels = q.Execute();
            String labelsList = "";
            foreach (String s in labels)
            {
                labelsList += @"{""label"":""" + s.ToString() + @""",";
                labelsList += @"""value"":""" + s.ToString() + @"""},";
            }
            RenderText("[" + labelsList.TrimEnd(',') + "]");
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
        public void _edit(int id, int page, bool ajax)
        {
            CancelView();


            PropertyBag["ajaxed"] = ajax;

            campusMap.Services.LogService.writelog("Editing place " + id);
            PropertyBag["credits"] = "";
            PropertyBag["imagetypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["images_inline"] = ActiveRecordBase<media_repo>.FindAll();

            place one_place = ActiveRecordBase<place>.Find(id);
            authors user = getUser();



            PropertyBag["authorname"] = user.name;
            one_place.editing = user;
            ActiveRecordMediator<place>.Save(one_place);

            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"

            PropertyBag["loginUser"] = user;
            PropertyBag["placeimages"] = one_place.Images;
            //$one_place.campus.zipcode
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
            typeEx.Add(Expression.Eq("set", one_place.model.id));

            field_types[] ft = ActiveRecordBase<field_types>.FindAll(typeEx.ToArray());
            List<string> fields = new List<string>();
            if (ft != null)
            {
                foreach (field_types ft_ in ft)
                {
                    fields.Add(get_field(ft_, one_place));
                }
            }
            PropertyBag["fields"] = fields;


            //ImageType imgtype = ActiveRecordBase<ImageType>.Find(1);
            //PropertyBag["images"] = imgtype.Images; //Flash["images"] != null ? Flash["images"] : 
            //PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll();
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();//Flash["authors"] != null ? Flash["authors"] : ActiveRecordBase<author>.FindAll();
            PropertyBag["models"] = ActiveRecordBase<place_models>.FindAll();
            PropertyBag["types"] = ActiveRecordBase<place_types>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["statuslists"] = ActiveRecordBase<status>.FindAll();


            PropertyBag["campuses"] = ActiveRecordBase<campus>.FindAll();
            PropertyBag["colleges"] = ActiveRecordBase<colleges>.FindAll();
            PropertyBag["departments"] = ActiveRecordBase<departments>.FindAll();
            PropertyBag["programs"] = ActiveRecordBase<programs>.FindAll();
            PropertyBag["schools"] = ActiveRecordBase<schools>.FindAll();

            

            PropertyBag["place_names"] = ActiveRecordBase<place_names>.FindAllByProperty("place_id", one_place.id);
            

            

            /*if (page == 0)
                page = 1;
            int pagesize = 10;
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("Place", one_place));

            IList<comments> items;

            items = ActiveRecordBase<comments>.FindAll(Order.Desc("CreateTime"), baseEx.ToArray());
            PropertyBag["comments"] = PaginationHelper.CreatePagination(items, pagesize, page);
            */

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
            //RenderView("new");
            RenderView("editor_place");
       
        }
        public void New()
        {
            CancelView();
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

            RenderView("editor_place");
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
            place.editing = null;
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
        public void update(
            [ARDataBind("place", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] place place,
            [ARDataBind("tags", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]tags[] tags,
            String[] newtag,
            [ARDataBind("images", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]media_repo[] images,
            [ARDataBind("authors", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]authors[] authors,
            [ARDataBind("place_media", Validate = true, AutoLoad = AutoLoadBehavior.OnlyNested)]place_media[] place_media,
            [ARDataBind("place_names", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]place_names[] place_names,
            String[][] fields,
            bool ajaxed_update,
            bool forced_tmp,
            string apply,
            string cancel
            )     
        {
            Flash["place"] = place;
            Flash["tags"] = place;
            Flash["images"] = place;
            Flash["authors"] = place;
            
            if (cancel != null){
                if (forced_tmp && place.id!=0)
                {
                    ActiveRecordMediator<place>.DeleteAndFlush(place);
                }
                else if (!forced_tmp)
                {
                    place.editing = null;
                    ActiveRecordMediator<place>.Save(place);
                }
                RedirectToAction("list");
                return;
            }
            if (forced_tmp && place.id==0)
            { 
                place.tmp = true;
            }
            //place.plus_four_code
            //'99164'

            authors user = getUser();
            place.editing = user;
            if ((place.prime_name == null || place.prime_name.Length == 0) )
            {
                if (!forced_tmp)
                {
                    Flash["error"] = "You are missing the basic parts of a place";
                    RedirectToReferrer();
                    return;
                }
                else
                {
                    place.prime_name = "TEMP NAME";
                }
            }

            /*if (place.place_types == null || place.place_types.Count == 0)
            {
                Flash["error"] = "You must choose a Place type.";
                RedirectToReferrer();
                return;
            }*/
            place.status = !canPublish(user) ? ActiveRecordBase<status>.Find(1) : place.status;
            place.tags.Clear(); 
            place.Images.Clear();
            place.Authors.Clear();
            if (apply != null){

            }else{
                place.editing = null;
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
            /**/
            if (place.field != null)
            {
                place.field.Clear();
            }
            if (fields != null)
            {
                foreach (String key in Request.Form.AllKeys)
                {
                    if (key.StartsWith("fields") )
                    {
                        fields f = new fields();
                        //f.value = "{ \"val\":\""++"\"}";
                        string vals = "";
                        foreach (String val in Request.Form[key].Split(',') )
                        {
                            vals = vals + @"{""val"":"+(!String.IsNullOrEmpty(val)?("\""+ val +"\""):"null")+"},";
                        }
                        char[] endC = { ',' };
                        vals = vals.TrimEnd(endC);
                        f.value = @"{""selections"":[" + vals + "]}";
                        int F_key = Convert.ToInt32(key.Replace("fields[","").Replace("]","")); 

                        f.type = ActiveRecordBase<field_types>.Find(F_key);
                        f.owner = place.id;
                        ActiveRecordMediator<fields>.Save(f);
                        place.field.Add(f);
                        
                    }
                }
            }
            
            place.names.Clear();
            foreach (place_names pn in place_names)
            {
                if (pn.label == null) pn.label = "Generic Name";
                pn.place_id = place.id;
                if (pn.name != null && pn.id == 0)
                {
                    ActiveRecordMediator<place_names>.Save(pn);
                }
                place.names.Add(pn);
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


            place.tags.Clear();
            foreach (tags tag in tags)
            {
                if (tag.name != null)
                {
                    if (tag.id == 0)
                    {
                        ActiveRecordMediator<tags>.Save(tag);
                    }
                    place.tags.Add(tag);
                }
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


            if (apply != null || ajaxed_update)
            {
                if (place.id>0)
                {
                    Redirect("~/place/_edit.castle?id=" + place.id);
                    return;
                }
                else
                {
                    RedirectToReferrer();
                    return;
                }
            }
            else
            {
                RedirectToAction("list");
                return;
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