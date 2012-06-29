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



    #endregion

    [Layout("default")]
    public class placeController : SecureBaseController
    {

    /*
     * 
     * MAY BE A FIELDS HELPER SERVICES WOULD BE WISE ?
     * 
     */
        private void clearConnections()
        {
            place[] _places = ActiveRecordBase<place>.FindAll();
            foreach (place _place in _places)
            {
                if ( UserService.isActive( _place.editing ) )
                {
                    _place.editing = null;
                    ActiveRecordMediator<place>.Save(_place);
                }
            }
        }
        public void List(int page, int searchId, string target)
        {
            clearConnections();
            authors user = UserService.getUser();
            PropertyBag["authorname"] = user.name;
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();
            PropertyBag["listtypes"] = ActiveRecordBase<place_types>.FindAll();
            PropertyBag["listcats"] = ActiveRecordBase<categories>.FindAll();


            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();

            PropertyBag["statuses"] = ActiveRecordBase<status>.FindAll();

            PropertyBag["user"] = user;
            PropertyBag["logedin"] = UserService.getLogedIn();


            int typesPaging = 0;
            int fieldsPaging = 0;
            int draftPaging = 0;
            int reviewPaging = 0;
            int publishedPaging = 0;
            int name_typesPaging = 0;

            switch (target)
            {
                case "name_types":
                    {
                        name_typesPaging = page; break;
                    }
                case "types":
                    {
                        typesPaging = page; break;
                    }
                case "fields":
                    {
                        fieldsPaging = page; break;
                    }
                case "draft":
                    {
                        draftPaging = page; break;
                    }
                case "review":
                    {
                        reviewPaging = page; break;
                    }
                case "published":
                    {
                        publishedPaging = page; break;
                    }
            }
            //SETUP SEARCHID and parts
            if (searchId.Equals(0))
            {
                searchId = -3;
            }
            else
            {
                place_types type = new place_types();
            }
            PropertyBag["searchId"] = searchId;

            //user.categories.Contains(place.categories);

            IList<place> items;
            int pagesize = 15;
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            if (searchId > 0)
            {
                // find all places of cat
                IList<categories> cats = ActiveRecordBase<categories>.FindAll(new ICriterion[] { Expression.Eq("id", searchId) });
                IList<place> pitems = new List<place>();
                foreach (categories c in cats)
                {
                    foreach (place p in c.Places)
                    {
                        pitems.Add(p);
                    }
                }
                int[] obj = new int[pitems.Count];
                int i = 0;
                foreach (place p in pitems)
                {
                    obj[i] = p.id;
                    i++;
                }
                baseEx.Add(Expression.In("id", obj));
            }
            if (searchId.Equals(-3))
            {
                IList<place> pitems = new List<place>();
                foreach (categories ucats in user.categories)
                {
                    IList<categories> cats = ActiveRecordBase<categories>.FindAll(new ICriterion[] { Expression.Eq("id", ucats.id) });
                    foreach (categories c in cats)
                    {
                        foreach (place p in c.Places)
                        {
                            pitems.Add(p);
                        }
                    }
                }
                int[] obj = new int[pitems.Count];
                int i = 0;
                foreach (place p in pitems)
                {
                    obj[i] = p.id;
                    i++;
                }
                baseEx.Add(Expression.In("id", obj));
            }

            if (searchId.Equals(-2))
            {
                IList<place> userplaces = user.Places;
                object[] obj = new object[userplaces.Count];
                int i = 0;
                foreach (place p in userplaces)
                {
                    obj[i] = p.id;
                    i++;
                }
                baseEx.Add(Expression.In("id", obj));
            }


            //REVIEW
            IList<place> reviewItems;
            List<AbstractCriterion> revEx = new List<AbstractCriterion>();
            revEx.AddRange(baseEx);
            revEx.Add(Expression.Eq("status", ActiveRecordBase<status>.Find(2)));
            reviewItems = ActiveRecordBase<place>.FindAll(Order.Asc("prime_name"), revEx.ToArray());

            //PUBLISHED
            IList<place> publishedItems;
            List<AbstractCriterion> pubEx = new List<AbstractCriterion>();
            pubEx.AddRange(baseEx);
            pubEx.Add(Expression.Eq("status", ActiveRecordBase<status>.Find(3)));
            publishedItems = ActiveRecordBase<place>.FindAll(Order.Asc("prime_name"), pubEx.ToArray());

            //DRAFT
            IList<place> draftItems;
            List<AbstractCriterion> draftEx = new List<AbstractCriterion>();
            draftEx.AddRange(baseEx);
            draftEx.Add(Expression.Eq("status", ActiveRecordBase<status>.Find(1)));
            draftItems = ActiveRecordBase<place>.FindAll(Order.Asc("prime_name"), draftEx.ToArray());




            //PUBLISHED
            foreach (place item in publishedItems)
            {
                if (string.IsNullOrEmpty(item.staticMap) && item.coordinate != null)
                {
                    makePlaceStaticMap(item);
                }
            }
            var publist = PaginationHelper.CreatePagination(publishedItems, pagesize, publishedPaging);
            PropertyBag["published_list"] = publist;
            IList<string> buttons = new List<string>();
            buttons.Add("edit");
            buttons.Add("delete");
            buttons.Add("publish");
            //buttons.Add("broadcast");
            //buttons.Add("view"); //NOTE:coming so TODO
            //buttons.Add("order");
            PropertyBag["publishedButtonSet"] = buttons;


            //REVIEW
            foreach (place item in reviewItems)
            {
                if (string.IsNullOrEmpty(item.staticMap) && item.coordinate != null)
                {
                    makePlaceStaticMap(item);
                }
            }
            PropertyBag["review_list"] = PaginationHelper.CreatePagination(reviewItems, pagesize, reviewPaging);
            buttons = new List<string>();
            buttons.Add("edit");
            buttons.Add("delete");
            buttons.Add("publish");
            //buttons.Add("view");
            PropertyBag["reviewButtonSet"] = buttons;

            //DRAFT
            foreach (place item in draftItems)
            {
                if (string.IsNullOrEmpty(item.staticMap) && item.coordinate != null)
                {
                    makePlaceStaticMap(item);
                }
            }
            PropertyBag["draft_list"] = PaginationHelper.CreatePagination(draftItems, pagesize, draftPaging);

            buttons = new List<string>();
            buttons.Add("edit");
            buttons.Add("delete");
            buttons.Add("publish");
            //buttons.Add("view");
            PropertyBag["draftButtonSet"] = buttons;

            //place types
            pagesize = 100;
            IList<place_types> place_types_items;
            place_types_items = ActiveRecordBase<place_types>.FindAll();
            PropertyBag["types"] = PaginationHelper.CreatePagination(place_types_items, pagesize, typesPaging);

            //place name types
            pagesize = 15;
            IList<place_name_types> place_name_types_items;
            place_name_types_items = ActiveRecordBase<place_name_types>.FindAll();
            PropertyBag["place_name_types"] = PaginationHelper.CreatePagination(place_name_types_items, pagesize, name_typesPaging);

            //place feilds
            pagesize = 50;
            IList<field_types> place_fields_items;
            List<AbstractCriterion> fieldsEx = new List<AbstractCriterion>();
            //fieldsEx.AddRange(baseEx);
            fieldsEx.Add(Expression.Eq("model", this.GetType().Name));
            place_fields_items = ActiveRecordBase<field_types>.FindAll(fieldsEx.ToArray());
            PropertyBag["fields"] = PaginationHelper.CreatePagination(place_fields_items, pagesize, fieldsPaging);

            RenderView("../admin/listings/list");
        }

        #region WSU MATRIX
        public void wsu_matrix()
        {
            PropertyBag["campuses"] = ActiveRecordBase<campus>.FindAll(Order.Asc("name"));
            PropertyBag["colleges"] = ActiveRecordBase<colleges>.FindAll(Order.Asc("name"));
            PropertyBag["departments"] = ActiveRecordBase<departments>.FindAll(Order.Asc("name"));
            PropertyBag["admindepartments"] = ActiveRecordBase<admindepartments>.FindAll(Order.Asc("name"));
            PropertyBag["programs"] = ActiveRecordBase<programs>.FindAll(Order.Asc("name"));
            PropertyBag["schools"] = ActiveRecordBase<schools>.FindAll(Order.Asc("name"));

            RenderView("../admin/wsu_matrix/list");
        }
        /* campus */
        public void _new_campuses()
        {
            campus campuses = new campus();
            PropertyBag["itmes"] = campuses;
            PropertyBag["action"] = "campuses";
            RenderView("../admin/wsu_matrix/_editor");
        }
        public void _edit_campuses(int id)
        {
            campus campuses = ActiveRecordBase<campus>.Find(id);
            PropertyBag["itmes"] = campuses;
            PropertyBag["action"] = "campuses";
            RenderView("../admin/wsu_matrix/_editor");
        }
        public void _delete_campuses(int id)
        {
            campus campuses = ActiveRecordBase<campus>.Find(id);
            Flash["massage"] = "A campuse, <strong>" + campuses.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<campus>.Delete(campuses);
            CancelLayout();
            RedirectToAction("wsu_matrix");
        }
        public void _update_campuses([ARDataBind("campuses", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] campus campuses)
        {
            ActiveRecordMediator<campus>.Save(campuses);
            RedirectToAction("wsu_matrix");
        }
        /* colleges */
        public void _new_colleges()
        {
            colleges college = new colleges();
            PropertyBag["itmes"] = college;
            PropertyBag["action"] = "colleges";
            RenderView("../admin/wsu_matrix/_editor");
        }
        public void _edit_colleges(int id)
        {
            colleges college = ActiveRecordBase<colleges>.Find(id);
            PropertyBag["itmes"] = college;
            PropertyBag["action"] = "colleges";
            RenderView("../admin/wsu_matrix/_editor");
        }
        public void _delete_colleges(int id)
        {
            colleges college = ActiveRecordBase<colleges>.Find(id);
            Flash["massage"] = "A college, <strong>" + college.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<colleges>.Delete(college);
            CancelLayout();
            RedirectToAction("wsu_matrix");
        }
        public void _update_colleges([ARDataBind("colleges", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] colleges colleges)
        {
            ActiveRecordMediator<colleges>.Save(colleges);
            RedirectToAction("wsu_matrix");
        }
        /* departments */
        public void _new_departments()
        {
            departments department = new departments();
            PropertyBag["itmes"] = department;
            PropertyBag["action"] = "departments";
            RenderView("../admin/wsu_matrix/_editor");
        }
        public void _edit_departments(int id)
        {
            departments department = ActiveRecordBase<departments>.Find(id);
            PropertyBag["itmes"] = department;
            PropertyBag["action"] = "departments";
            RenderView("../admin/wsu_matrix/_editor");
        }
        public void _delete_departments(int id)
        {
            departments department = ActiveRecordBase<departments>.Find(id);
            Flash["massage"] = "A department, <strong>" + department.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<departments>.Delete(department);
            CancelLayout();
            RedirectToAction("wsu_matrix");
        }
        public void _update_departments([ARDataBind("departments", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] departments departments)
        {
            ActiveRecordMediator<departments>.Save(departments);
            RedirectToAction("wsu_matrix");
        }
        /* admin departments */
        public void _new_admindepartments()
        {
            admindepartments admindepartment = new admindepartments();
            PropertyBag["itmes"] = admindepartment;
            PropertyBag["action"] = "admindepartments";
            RenderView("../admin/wsu_matrix/_editor");
        }
        public void _edit_admindepartments(int id)
        {
            admindepartments admindepartment = ActiveRecordBase<admindepartments>.Find(id);
            PropertyBag["itmes"] = admindepartment;
            PropertyBag["action"] = "admindepartments";
            RenderView("../admin/wsu_matrix/_editor");
        }
        public void _delete_admindepartments(int id)
        {
            admindepartments admindepartment = ActiveRecordBase<admindepartments>.Find(id);
            Flash["massage"] = "A admin department, <strong>" + admindepartment.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<admindepartments>.Delete(admindepartment);
            CancelLayout();
            RedirectToAction("wsu_matrix");
        }
        public void _update_admindepartments([ARDataBind("admindepartments", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] admindepartments admindepartments)
        {
            ActiveRecordMediator<admindepartments>.Save(admindepartments);
            RedirectToAction("wsu_matrix");
        }
        /* programs */
        public void _new_programs()
        {
            programs program = new programs();
            PropertyBag["itmes"] = program;
            PropertyBag["action"] = "programs";
            RenderView("../admin/wsu_matrix/_editor");
        }
        public void _edit_programs(int id)
        {
            programs program = ActiveRecordBase<programs>.Find(id);
            PropertyBag["itmes"] = program;
            PropertyBag["action"] = "programs";
            RenderView("../admin/wsu_matrix/_editor");
        }
        public void _delete_programs(int id)
        {
            programs program = ActiveRecordBase<programs>.Find(id);
            Flash["massage"] = "A program, <strong>" + program.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<programs>.Delete(program);
            CancelLayout();
            RedirectToAction("wsu_matrix");
        }
        public void _update_programs([ARDataBind("programs", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] programs programs)
        {
            ActiveRecordMediator<programs>.Save(programs);
            RedirectToAction("wsu_matrix");
        }
        /* programs */
        public void _new_schools()
        {
            schools school = new schools();
            PropertyBag["itmes"] = school;
            PropertyBag["action"] = "schools";
            RenderView("../admin/wsu_matrix/_editor");
        }
        public void _edit_schools(int id)
        {
            schools school = ActiveRecordBase<schools>.Find(id);
            PropertyBag["itmes"] = school;
            PropertyBag["action"] = "schools";
            RenderView("../admin/wsu_matrix/_editor");
        }
        public void _delete_schools(int id)
        {
            schools school = ActiveRecordBase<schools>.Find(id);
            Flash["massage"] = "A school, <strong>" + school.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<schools>.Delete(school);
            CancelLayout();
            RedirectToAction("wsu_matrix");
        }
        public void _update_schools([ARDataBind("schools", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] schools schools)
        {
            ActiveRecordMediator<schools>.Save(schools);
            RedirectToAction("wsu_matrix");
        }
        #endregion

        /* place editing router */
        public void editor(int id, int page, bool ajax)
        {
            if (id == 0){
                New();
            }else{
                _edit(id, page, ajax);
            }
            CancelView();
            CancelLayout();
            RenderView("_editor");
            return;
        }
        public void _edit(int id, int page, bool ajax)
        {
            CancelView();

            PropertyBag["ajaxed"] = ajax;

            campusMap.Services.LogService.writelog("Editing place " + id);
            PropertyBag["credits"] = "";
            PropertyBag["geometrics"] = ActiveRecordBase<geometrics>.FindAll();
            PropertyBag["imagetypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["images_inline"] = ActiveRecordBase<media_repo>.FindAll();

            place one_place = ActiveRecordBase<place>.Find(id);
            authors user = UserService.getUser();



            PropertyBag["authorname"] = user.name;
            one_place.editing = user;
            ActiveRecordMediator<place>.Save(one_place);



            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"

            PropertyBag["loginUser"] = user;
            PropertyBag["placeimages"] = one_place.Images;
            //$one_place.campus.zipcode
            PropertyBag["tags"] = ActiveRecordBase<tags>.FindAll();
            if (Flash["place"] != null)
            {
                place flashplace = Flash["place"] as place;
                flashplace.Refresh();
                PropertyBag["place"] = flashplace;
            }
            else
            {
                PropertyBag["place"] = one_place;
            }
            if (one_place.coordinate != null)
            {
                PropertyBag["lat"] = one_place.getLat();
                PropertyBag["long"] = one_place.getLong();
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
            PropertyBag["types"] = ActiveRecordBase<place_types>.FindAll(Order.Asc("friendly"));
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["statuslists"] = ActiveRecordBase<status>.FindAll();
            PropertyBag["categories"] = ActiveRecordBase<categories>.FindAll();

            PropertyBag["campuses"] = ActiveRecordBase<campus>.FindAll(Order.Asc("name"));
            PropertyBag["colleges"] = ActiveRecordBase<colleges>.FindAll(Order.Asc("name"));
            PropertyBag["departments"] = ActiveRecordBase<departments>.FindAll(Order.Asc("name"));
            PropertyBag["admindepartments"] = ActiveRecordBase<admindepartments>.FindAll(Order.Asc("name"));
            PropertyBag["programs"] = ActiveRecordBase<programs>.FindAll(Order.Asc("name"));
            PropertyBag["schools"] = ActiveRecordBase<schools>.FindAll(Order.Asc("name"));

            PropertyBag["place_name_types"] = ActiveRecordBase<place_name_types>.FindAll();

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

            List<infotabs> tabs = new List<infotabs>();
            if (one_place.infotabs.Count > 0) tabs.AddRange(one_place.infotabs);
            PropertyBag["tabs"] = tabs;

            List<authors> authors = new List<authors>();
            if (!one_place.Authors.Contains(user)) authors.Add(user);
            authors.AddRange(one_place.Authors);
            // for (int i = 0; i < 2; i++)
            //     authors.Add(new authors());

            List<media_repo> images = new List<media_repo>();
            images.AddRange(one_place.Images);
            if (images.Count == 0)
            {
                images.Add(new media_repo());
                PropertyBag["placeimages"] = images;
            }
            PropertyBag["short_codes"] = get_feild_short_codes(one_place);
            PropertyBag["placeauthors"] = authors;
            //RenderView("new");
            RenderView("_editor");
            return;
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
            PropertyBag["loginUser"] = UserService.getUser();
            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"

            String availableImagesList = "";
            PropertyBag["availableImages"] = availableImagesList; // string should be "location1","location2","location3"


            PropertyBag["images"] = Flash["images"] != null ? Flash["images"] : ActiveRecordBase<media_repo>.FindAll();
            PropertyBag["place"] = Flash["place"] != null ? Flash["place"] : place;
            PropertyBag["tags"] = Flash["tags"] != null ? Flash["tags"] : ActiveRecordBase<tags>.FindAll();
            PropertyBag["authors"] = Flash["authors"] != null ? Flash["authors"] : ActiveRecordBase<authors>.FindAll();
            PropertyBag["models"] = ActiveRecordBase<place_models>.FindAll();
            PropertyBag["types"] = ActiveRecordBase<place_types>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["statuslists"] = ActiveRecordBase<status>.FindAll();
            PropertyBag["categories"] = ActiveRecordBase<categories>.FindAll();

            PropertyBag["campuses"] = ActiveRecordBase<campus>.FindAll();
            PropertyBag["colleges"] = ActiveRecordBase<colleges>.FindAll();
            PropertyBag["departments"] = ActiveRecordBase<departments>.FindAll();
            PropertyBag["programs"] = ActiveRecordBase<programs>.FindAll();
            PropertyBag["schools"] = ActiveRecordBase<schools>.FindAll();

            PropertyBag["place_name_types"] = ActiveRecordBase<place_name_types>.FindAll();

            RenderView("_editor");
            return;
        }


        /* move checks out */
        public bool canEdit(place place, authors user)
        {
            bool flag = false;
           switch (user.access_levels.title)
            {
                case "Admin":
                    {
                        foreach (place_types item in place.place_types)
                        {
                            if (place.Authors.Contains(user) && user.place_types.Contains(item))
                                flag = true; break;
                        } 
                        break;
                    }

                case "Editor":
                    {
                        foreach (place_types item in place.place_types)
                        {
                            if (user.place_types.Contains(item))
                                flag = true; break;
                        }
                        break;
                    }
             }

            return flag;        
        }
        /*public bool canPublish(authors user)
        {
            bool flag = false;
            switch (user.access_levels.title)
            {
                case "Admin": flag = true; break;        
                case "Editor": flag = true; break;
            }
            return flag;        
        }*/







        public void new_type()
        {
            place_types type = new place_types();
            PropertyBag["type"] = type;
            RenderView("../admin/types/new");
        }
        public void new_name_type()
        {
            place_name_types type = new place_name_types();
            PropertyBag["type"] = type;
            RenderView("../admin/place_name_type/new");
        }
        public void new_field()
        {
            field_types field = new field_types();
            PropertyBag["field"] = field;
            place_models[] p_models = ActiveRecordBase<place_models>.FindAll();
            PropertyBag["p_models"] = p_models;
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();

            RenderView("../admin/fields/new");
        }
        public void edit_type(int id)
        {
            place_types type = ActiveRecordBase<place_types>.Find(id);
            PropertyBag["type"] = type;
            RenderView("../admin/types/new");
        }
        public void edit_name_type(int id)
        {
            place_name_types type = ActiveRecordBase<place_name_types>.Find(id);
            PropertyBag["type"] = type;
            RenderView("../admin/place_name_type/new");
        }

        public void edit_field(int id)
        {
            field_types field = ActiveRecordBase<field_types>.Find(id);
            PropertyBag["field"] = field;

            place_models[] p_models = ActiveRecordBase<place_models>.FindAll();
            PropertyBag["p_models"] = p_models;

            elementSet ele = (elementSet)JsonConvert.DeserializeObject(field.attr.ToString(), typeof(elementSet));
            string ele_str = FieldsService.getfieldmodel(ele);
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();

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

        public void update_name_type([ARDataBind("type", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] place_name_types type)
        {
            ActiveRecordMediator<place_name_types>.Save(type);
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

        public string[] get_feild_short_codes(place place)
        {
            //log.Info("________________________________________________________________________________\nLoading feilds For:" + place.prime_name+"("+place.id+")\n");
            List<AbstractCriterion> typeEx = new List<AbstractCriterion>();
            typeEx.Add(Expression.Eq("model", "placeController"));
            typeEx.Add(Expression.Eq("set", place.model.id));

            field_types[] ft = ActiveRecordBase<field_types>.FindAll(typeEx.ToArray());
            List<string> fields = new List<string>();

            string[] codes = new string[ft.Length];
            int i = 0;
            if (ft != null)
            {
                foreach (field_types ft_ in ft)
                {
                    codes[i]="${"+ft_.alias+"}";
                    i++;
                }
            }
            return codes;
        }



        public void loadPlaceShape(int id,string callback)
        {
            CancelLayout();
            CancelView();
            String json = "";
                    json += @"  {
";
                    json += @"""shape"":";
                    // this vodo of the new line is wrong
                    json += geometricService.getShapeLatLng_json_str(id, true).Replace(@"
",String.Empty);
                json += @"
    }";
                
                if (!string.IsNullOrEmpty(callback))
                {
                    json = callback + "(" + json + ")";
                }
                Response.ContentType = "application/json; charset=UTF-8";
                RenderText(json);
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
            try
            {
                place_media placemedia = ActiveRecordBase<place_media>.FindFirst(new ICriterion[] { Expression.Eq("place", place), Expression.Eq("media", media) });
                ActiveRecordMediator<place_media>.Delete(placemedia);
            }
            catch { }
            place.Images.Remove(media);
            ActiveRecordMediator<place>.Save(place);
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


       /* public void massInfoTabIt()
        {
            place[] places = ActiveRecordBase<place>.FindAll();
            foreach (place item in places)
            {
                item.infotabs.Clear();
                infotabs t = new infotabs();
                t.title = "What's Here";
                t.content = "<img class=\"infotabTemplate\" src=\"../Content/images/tinyMCE/template_whats_inside.png\" alt=\"2\" width=\"150\" height=\"55\" />";
                t.sort = 1;
                t.template = ActiveRecordBase<infotabs_templates>.Find(1);
                ActiveRecordMediator<infotabs>.Save(t);
                item.infotabs.Add(t);

                t = new infotabs();
                t.title = "Views";
                t.content = "<img class=\"infotabTemplate\" src=\"../Content/images/gallery_placeholder.png\"  alt=\"2\" id='viewTab' width=\"297\" height=\"201\" />";
                t.sort = 2;
                t.template = null;
                ActiveRecordMediator<infotabs>.Save(t);
                item.infotabs.Add(t);
                
                t = new infotabs();
                t.title = "Access";
                t.content = "<img class=\"infotabTemplate\" src=\"../Content/images/tinyMCE/template_access.png\" alt=\"1\" width=\"150\" height=\"55\" />";
                t.sort = 3;
                t.template = ActiveRecordBase<infotabs_templates>.Find(2);
                ActiveRecordMediator<infotabs>.Save(t);
                item.infotabs.Add(t);

                ActiveRecordMediator<place>.Save(item);
            }

        }*/


        public void update(
            [ARDataBind("place", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] place place,
            [ARDataBind("tags", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]tags[] tags,
            [ARDataBind("tabs", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]infotabs[] tabs,
            int[] cats,
            String[] massTag,
            String[] newtab,
            [ARDataBind("images", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]media_repo[] images,
            [ARDataBind("authors", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]authors[] authors,
            [ARDataBind("place_media", Validate = true, AutoLoad = AutoLoadBehavior.OnlyNested)]place_media[] place_media,
            [ARDataBind("place_names", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]place_names[] place_names,
            String[][] fields,
            bool ajaxed_update,
            bool forced_tmp,
            string LongLength,
            string Length,
            string apply,
            string cancel
            )     
        {
            Flash["place"] = place;
            Flash["tags"] = place;
            Flash["tabs"] = place;
            Flash["cats"] = place;
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
            if (forced_tmp && place.id == 0)
            {
                place.tmp = true;
            }
            else
            {
                string gemSql = "POINT (" + LongLength + " " + Length + ")";
                string wkt = gemSql;
                SqlChars udtText = new SqlChars(wkt);
                SqlGeography sqlGeometry1 = SqlGeography.STGeomFromText(udtText, 4326);

                MemoryStream ms = new MemoryStream();
                BinaryWriter bw = new BinaryWriter(ms);
                byte[] WKB = sqlGeometry1.STAsBinary().Buffer;
                place.coordinate = geometrics.AsByteArray(sqlGeometry1);//WKB;//
            }

            


            //place.plus_four_code
            //'99164'

            authors user = UserService.getUser();
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
            int requestedStatus = UserService.canPublish(user) && place.status != null ? place.status.id : 1;
            place.status = ActiveRecordBase<status>.Find(requestedStatus);
            place.tags.Clear();
            //place.infotabs.Clear();
            //place.categories.Clear();
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

                        int F_key = Convert.ToInt32(key.Replace("fields[", "").Replace("]", ""));
                        f.type = ActiveRecordBase<field_types>.Find(F_key);

                        string vals = "";
                        if (f.type.attr.Contains(@"""type"": ""dropdown"""))
                        {
                            foreach (String val in Request.Form[key].Split(','))
                            {
                                vals = vals + @"{""val"":" + (!String.IsNullOrEmpty(val) ? ("\"" + val.Trim('"') + "\"") : "null") + "},";
                            }
                        }
                        else
                        {
                            vals = @"{""val"":" + (!String.IsNullOrEmpty(Request.Form[key]) ? ("\"" + Request.Form[key].Trim('"') + "\"") : "null") + "},";
                        }
                        char[] endC = { ',' };
                        vals = vals.TrimEnd(endC);
                        f.value = @"{""selections"":[" + vals + "]}";

                        f.owner = place.id;
                        ActiveRecordMediator<fields>.Save(f);
                        place.field.Add(f);
                    }
                }
            }


            if (!String.IsNullOrEmpty(place.abbrev_name)) place.abbrev_name = place.abbrev_name.Trim();
            if (!String.IsNullOrEmpty(place.prime_name)) place.prime_name = place.prime_name.Trim();
            place.names.Clear();
            foreach (place_names pn in place_names)
            {
                pn.place_id = place.id;
                if (pn.name != null && pn.id == 0)
                {
                    ActiveRecordMediator<place_names>.Save(pn);
                }
                place.names.Add(pn);
            }
            //if (place.hideTitles==0) place.hideTitles = false;





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
                        tags[] temp = ActiveRecordBase<tags>.FindAllByProperty("name", tag.name);
                        if (temp.Length == 0)
                        {
                            ActiveRecordMediator<tags>.Save(tag);
                            place.tags.Add(tag);
                        }
                        else
                        {
                            place.tags.Add(temp[0]);
                        }
                    }
                    else
                    {
                        place.tags.Add(tag);
                    }
                }
            }
            /*place.tags.Clear();
            foreach (tags tag in tags)
            {
                if (tag.name != null)
                {
                    if (tag.id == 0)
                    {
                        tag.name = tag.name.Trim();
                        ActiveRecordMediator<tags>.Save(tag);
                    }
                    place.tags.Add(tag);
                }
            }*/
            if (massTag != null)
            {
                foreach (String onetags in massTag)
                {
                    if (onetags != "")
                    {
                        tags t = new tags();
                        t.name = onetags.Trim();
                        tags[] temp = ActiveRecordBase<tags>.FindAllByProperty("name", onetags);
                        if (temp.Length == 0)
                        {
                            ActiveRecordMediator<tags>.Save(t);
                            place.tags.Add(t);
                        }
                    }
                }
            }
            place.infotabs.Clear();
            foreach (infotabs tab in tabs)
            {
                if (tab.title != null)
                {
                    if (tab.id == 0)
                    {
                        ActiveRecordMediator<infotabs>.Save(tab);
                    }
                    place.infotabs.Add(tab);
                }
            }


            /*place.categories.Clear();
            foreach (int cat in cats)
            {
                categories c = ActiveRecordBase<categories>.Find(cat);
                place.categories.Add(c);
            }*/

            foreach (media_repo media in images)
            {
                if (media.id > 0 && !place.Images.Contains(media))
                {
                    place.Images.Add(media);
                }
            }
            if (!place.Authors.Contains(user) && authors==null) place.Authors.Add(user); 
            foreach (authors author in authors)
            {
                if (author.id > 0 && !place.Authors.Contains(author))
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
            if (place.coordinate != null)
            {
                makePlaceStaticMap(place);
            }


            String cachePath = Context.ApplicationPhysicalPath;
            if (!cachePath.EndsWith("\\"))
                cachePath += "\\";
                cachePath += @"uploads\";
                cachePath += @"places\cache\";

            string file = place.id + "_centralplace" + ".ext";
            String file_path = cachePath + file;
            if (File.Exists(file_path))
            {
                File.Delete(file_path);
            }

            cleanUpplace_media(place.id);

            Flash["place"] = null;
            Flash["tags"] = null;
            Flash["tabs"] = null;
            Flash["cats"] = null;
            Flash["images"] = null;
            Flash["authors"] = null;

            if (apply != null || ajaxed_update)
            {
                if (place.id>0)
                {
                    if (ajaxed_update)
                    {
                        CancelLayout();
                        RenderText(place.id.ToString());
                    }
                    else
                    {
                        RedirectToUrl("~/place/_edit.castle?id=" + place.id);
                    }
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
                place.editing = null;
                ActiveRecordMediator<place>.Save(place);
                RedirectToAction("list");
                return;
            }
        }
        public void makePlaceStaticMap(place place)
        {
            string url = "http://maps.google.com/staticmap?center=" + place.getLat() + "," + place.getLong() + "&size=250x145&maptype=mobile&markers=" + place.getLat() + "," + place.getLong() + ",red&sensor=false";
            String uploadPath = Context.ApplicationPhysicalPath;
            if (!uploadPath.EndsWith("\\"))
                uploadPath += "\\";

            String imagePath = @"";
            imagePath += @"uploads\";
            imagePath += @"googleStaticMaps\places\";

            uploadPath += imagePath;

            if (!HelperService.DirExists(uploadPath))
            {
                System.IO.Directory.CreateDirectory(uploadPath);
            }
            string newFile = uploadPath + place.id.ToString() + ".ext";
            string finImagePath = @"\" + imagePath + place.id.ToString() + ".ext";

            googleService.createStaticPlaceMap(url, newFile);
            place.staticMap = finImagePath;
            ActiveRecordMediator<place>.Save(place);
        }
        public void delete(int id)
        {
            place place = ActiveRecordBase<place>.Find(id);
            Flash["massage"] = "A Place, <strong>" + place.prime_name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<place>.Delete(place);
            CancelLayout();
            RedirectToAction("list");
        }
        public void delete_type(int id)
        {
            place_types place_type = ActiveRecordBase<place_types>.Find(id);
            Flash["massage"] = "A Place type, <strong>" + place_type.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<place_types>.Delete(place_type);
            CancelLayout();
            RedirectToAction("list");
        }

        public void delete_name_type(int id)
        {
            place_name_types place_type = ActiveRecordBase<place_name_types>.Find(id);
            Flash["massage"] = "A Name Type for places, <strong>" + place_type.type + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<place_name_types>.Delete(place_type);
            CancelLayout();
            RedirectToAction("list");
        }
        public void delete_field(int id)
        {
            field_types place_fields = ActiveRecordBase<field_types>.Find(id);
            Flash["massage"] = "A field for places, <strong>" + place_fields.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<field_types>.Delete(place_fields);
            CancelLayout();
            RedirectToAction("list");
        }
    }
}