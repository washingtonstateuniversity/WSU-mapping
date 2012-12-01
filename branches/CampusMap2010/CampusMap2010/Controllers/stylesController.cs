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
    #endregion

    [Layout("default")]
    public class stylesController : SecureBaseController {

/*
        public void editor(int id, int page) {
            CancelView();
            CancelLayout();
            //Edit_view(id, page);
            RenderView("editor_view");
            return;
        }

        public void Index() {
            //ActiveRecordBase<Block>.FindAll();
            PropertyBag["AccessDate"] = DateTime.Now;
        }

        public void breakingNewsreadmore(int id) {
            map_views view = ActiveRecordBase<map_views>.Find(id);
            PropertyBag["BreakingNews"] = view;
        }

        public void List(int page, int searchId, string status) {
            users user = UserService.getUser();
            PropertyBag["authorname"] = user.nid;
            PropertyBag["authors"] = ActiveRecordBase<users>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<user_groups>.FindAll();
            PropertyBag["loginUser"] = user;
            PropertyBag["logedin"] = UserService.getLogedIn();
            //user.Sections.Contains(view.view_types);

            IList<map_views> items;
            int pagesize = 15;
            int paging = 1;
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();

            if (searchId.Equals(-2)) {
                IList<map_views> userviews = user.views;
                object[] obj = new object[userviews.Count];
                int i = 0;
                foreach (map_views view in userviews) {
                    obj[i] = view.id;
                    i++;
                }
                baseEx.Add(Expression.In("view_id", obj));
            }

            //PUBLISHED
            if (status == "published") {
                paging = page;
            } else {
                paging = 1;
            }
            List<AbstractCriterion> pubEx = new List<AbstractCriterion>();
            pubEx.AddRange(baseEx);
            pubEx.Add(Expression.Eq("status", ActiveRecordBase<status>.Find(3)));

            if (searchId > 0) {
                items = ActiveRecordBase<map_views>.FindAll(Order.Desc("order"), pubEx.ToArray());
            } else {
                items = ActiveRecordBase<map_views>.FindAll(Order.Desc("published"), pubEx.ToArray());
            }
            PropertyBag["publishedViews"] = PaginationHelper.CreatePagination(items, pagesize, paging);

            //REVIEW
            if (status == "review") {
                paging = page;
            } else {
                paging = 1;
            }
            List<AbstractCriterion> revEx = new List<AbstractCriterion>();
            revEx.AddRange(baseEx);
            revEx.Add(Expression.Eq("status", ActiveRecordBase<status>.Find(2)));

            items = ActiveRecordBase<map_views>.FindAll(Order.Desc("created"), revEx.ToArray());
            PropertyBag["reviewViews"] = PaginationHelper.CreatePagination(items, pagesize, paging);


            //DRAFT
            if (status == "draft") {
                paging = page;
            } else {
                paging = 1;
            }
            List<AbstractCriterion> draftEx = new List<AbstractCriterion>();
            draftEx.AddRange(baseEx);
            draftEx.Add(Expression.Eq("status", ActiveRecordBase<status>.Find(1)));
            items = ActiveRecordBase<map_views>.FindAll(Order.Desc("created"), draftEx.ToArray());
            PropertyBag["draftViews"] = PaginationHelper.CreatePagination(items, pagesize, paging);


            //SETUP SEARCHID and parts
            if (searchId.Equals(0)) {
                PropertyBag["searchId"] = 0;
            } else {
                PropertyBag["searchId"] = searchId;
                map_views firstview = new map_views();
                map_views lastview = new map_views();
                PropertyBag["firstview"] = firstview;
                PropertyBag["lastview"] = lastview;
            }
            RenderView("list");
        }
       
        public void Edit_view(int id, int page) {
            HelperService.writelog("Editing map view", id);
            PropertyBag["credits"] = "";
            PropertyBag["imagetypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["images_inline"] = ActiveRecordBase<media_repo>.FindAll();

            map_views view = ActiveRecordBase<map_views>.Find(id);
            users user = UserService.getUser();
            String username = user.name;
            PropertyBag["authorname"] = user.name;
            view.editing = user;
            ActiveRecordMediator<map_views>.Save(view);
            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"

            PropertyBag["loginUser"] = user;


            PropertyBag["tags"] = ActiveRecordBase<tags>.FindAll();
            if (Flash["view"] != null) {
                map_views flashview = Flash["view"] as map_views;
                ActiveRecordMediator<map_views>.Refresh(flashview);
                PropertyBag["view"] = flashview;
            } else {
                PropertyBag["view"] = view;
            }
            //ImageType imgtype = ActiveRecordBase<ImageType>.Find(1);
            //PropertyBag["images"] = imgtype.Images; //Flash["images"] != null ? Flash["images"] : 
            //PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll();
            PropertyBag["authors"] = ActiveRecordBase<users>.FindAll();//Flash["authors"] != null ? Flash["authors"] : ActiveRecordBase<author>.FindAll();

            PropertyBag["accesslevels"] = ActiveRecordBase<user_groups>.FindAll();
            PropertyBag["statuslists"] = ActiveRecordBase<status>.FindAll();

            if (page == 0)
                page = 1;
            int pagesize = 10;
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("View", view));

            IList<comments> items;

            items = ActiveRecordBase<comments>.FindAll(Order.Desc("CreateTime"), baseEx.ToArray());
            PropertyBag["comments"] = PaginationHelper.CreatePagination(items, pagesize, page);

            String CreditList = GetCredit();
            PropertyBag["credits"] = CreditList;

            List<users> authors = new List<users>();
            authors.AddRange(view.authors);
            for (int i = 0; i < 2; i++)
                authors.Add(new users());

            PropertyBag["viewauthors"] = authors;
            RenderView("new");

        }
        public void New() {


            map_views view = new map_views();

            PropertyBag["loginUser"] = UserService.getUser();
            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"



            PropertyBag["view"] = Flash["view"] != null ? Flash["view"] : view;
            PropertyBag["tags"] = Flash["tags"] != null ? Flash["tags"] : ActiveRecordBase<tags>.FindAll();
            PropertyBag["authors"] = Flash["authors"] != null ? Flash["authors"] : ActiveRecordBase<users>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<user_groups>.FindAll();
            PropertyBag["statuslists"] = ActiveRecordBase<status>.FindAll();
        }

        public void Update([ARDataBind("view", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] map_views view,
            [ARDataBind("tags", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]tags[] tags, String[] newtag,
            [ARDataBind("authors", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]users[] authors,
            string apply, string cancel) {
            Flash["view"] = view;
            Flash["tags"] = view;
            Flash["authors"] = view;

            if (cancel != null) {
                view.editing = null;
                ActiveRecordMediator<map_views>.Save(view);
                RedirectToAction("list");
                return;
            }
            if (view.name == null || view.name.Length == 0) {
                Flash["error"] = "You are missing the basic parts of a view";
                RedirectToReferrer();
                return;
            }


            users user = UserService.getUser();


            //view.tags.Clear(); 
            //view.Images.Clear();
            view.authors.Clear();
            if (apply != null) {

            } else {
                view.editing = null;
            }


            if (view.id == 0) {
                //ViewStatus stat = ActiveRecordBase<ViewStatus>.Find(1);
                //view.Status = stat;
                view.creationg_time = DateTime.Now;
            } else {
                view.update = DateTime.Now;
            }




            foreach (users author in authors) {
                if (author.id > 0)
                    view.authors.Add(author);
            }


            ActiveRecordMediator<map_views>.Save(view);



            Flash["view"] = null;
            Flash["tags"] = null;
            Flash["authors"] = null;


            if (apply != null) {
                if (apply != " Save ") {
                    RedirectToUrl("Edit_view.castle?id=" + view.id);
                } else {
                    RedirectToReferrer();
                }
            } else {
                RedirectToAction("list");
            }
        }

        public void delete(int id) {
            map_views view = ActiveRecordBase<map_views>.Find(id);
            Flash["message"] = "Article, <strong>Note:" + view.name + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<map_views>.Delete(view);
            CancelLayout();
            RedirectToAction("list");
        }*/
    }
}
