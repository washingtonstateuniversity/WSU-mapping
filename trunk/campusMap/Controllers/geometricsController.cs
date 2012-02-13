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
        using Microsoft.SqlServer.Types;
    using System.Data.SqlTypes;


    #endregion

    [Layout("default")]
    public class geometricsController : SecureBaseController
    {


        public void editor(int id, int page, bool ajax)
        {
            if (id == 0){
                New();
            }else{
                Edit_geometric(id, page, ajax);
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
            authors user = getUser();
            PropertyBag["authorname"] = getUserName();
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();
            PropertyBag["geometricstype"] = ActiveRecordBase<geometrics_types>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["loginUser"] = user;
            PropertyBag["logedin"] = userService.getLogedIn();
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
                    items = ActiveRecordBase<geometrics>.FindAll(Order.Desc("order"), pubEx.ToArray());
                }
                else
                {
                    items = ActiveRecordBase<geometrics>.FindAll(Order.Desc("publish_time"), pubEx.ToArray());
                }
                PropertyBag["publishedGeometrics"] = PaginationHelper.CreatePagination(items, pagesize, paging);

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
                PropertyBag["reviewGeometrics"] = PaginationHelper.CreatePagination(items, pagesize, paging);


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
                PropertyBag["draftGeometrics"] = PaginationHelper.CreatePagination(items, pagesize, paging);


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
            RenderView("list");
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
        public bool canPublish(authors user)
        {
            bool flag = false;
            /*switch (user.Accesslevel.Title)
            {
                case "Author": flag = true; break;
                               
                case "Editor": flag = true; break;

                case "Contributor": flag = false; break;
            }*/
            return flag;        
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

        public void Edit_geometric(int id, int page, bool ajax)
        {
            CancelView();


            PropertyBag["ajaxed"] = ajax;

            campusMap.Services.LogService.writelog("Editing geometric " + id);
            PropertyBag["credits"] = "";
            PropertyBag["imagetypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["images_inline"] = ActiveRecordBase<media_repo>.FindAll();

            geometrics geometric = ActiveRecordBase<geometrics>.Find(id);
            authors user = getUser();
            PropertyBag["authorname"] = user;
            geometric.editing = user;
            ActiveRecordMediator<geometrics>.Save(geometric);
            //String locationList = Getlocation();
            //PropertyBag["locations"] = locationList; // string should be "location1","location2","location3"

            PropertyBag["loginUser"] = getUser();
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

            if (page == 0)
                page = 1;
            int pagesize = 10;
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("Place", geometric));

            IList<comments> items;

            items = ActiveRecordBase<comments>.FindAll(Order.Desc("CreateTime"), baseEx.ToArray());
            PropertyBag["comments"] = PaginationHelper.CreatePagination(items, pagesize, page);


            List<tags> tags = new List<tags>();
            tags.AddRange(geometric.tags);
            for (int i = 0; i < 2; i++)
                tags.Add(new tags());
            PropertyBag["geometrictags"] = tags;

            List<authors> authors = new List<authors>();
            authors.AddRange(geometric.Authors);
            for (int i = 0; i < 2; i++)
                authors.Add(new authors());

            List<media_repo> images = new List<media_repo>();
            images.AddRange(geometric.Images);
            if (images.Count == 0)
            {
               images.Add(new media_repo());
               PropertyBag["geometricimages"] = images;   
            }
              

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
            PropertyBag["loginUser"] = getUser();
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



        public void GetAddAuthor(int count)
        {
            PropertyBag["count"] = count;
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();
            List<authors> authors = new List<authors>();
            authors.Add(new authors());
            authors.Add(new authors());
            PropertyBag["geometricauthors"] = authors;
            RenderView("addauthor", true);
        }
        public void DeleteAuthor(int id, int geometricId)
        {
            authors author = ActiveRecordBase<authors>.Find(id);
            geometrics geometric = ActiveRecordBase<geometrics>.Find(geometricId);
            geometric.Authors.Remove(author);
            ActiveRecordMediator<geometrics>.Save(geometric);
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
            PropertyBag["geometrictags"] = tags;
            RenderView("addtag", true);
        }

        public void Deletetags(int id, int imageid)
        {
            tags tag = ActiveRecordBase<tags>.Find(imageid);
            geometrics geometric = ActiveRecordBase<geometrics>.Find(id);
            geometric.tags.Remove(tag);
            ActiveRecordMediator<geometrics>.Save(geometric);
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

        public void readmore(int id)
        {
            PropertyBag["geometric"] = id == 0 ? null : ActiveRecordBase<geometrics>.Find(id);   
        }
        public void view(int id)
        {
            PropertyBag["geometric"] = ActiveRecordBase<geometrics>.Find(id);
        }
        public void clearLock(int id, bool ajax)
        {
            geometrics geometric = ActiveRecordBase<geometrics>.Find(id);
            geometric.editing = null;
            ActiveRecordMediator<geometrics>.Save(geometric);
            CancelLayout();
            RenderText("true");
        }
        string NVchecktitle(string title, bool id)
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
        public void cleanUpgeometric_media(int id)
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
        public void Update([ARDataBind("geometric", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] geometrics geometric,
            [ARDataBind("tags", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]tags[] tags, String[] newtag,
            [ARDataBind("images", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]media_repo[] images,
            [ARDataBind("authors", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)]authors[] authors,
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
            

            authors user = getUser();
            /*if (!canPublish(user))
            {
                PlaceStatus stat= ActiveRecordBase<PlaceStatus>.Find(1);
                place.Status = stat;
            }*/

            geometric.tags.Clear(); 
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

            foreach (geometrics_media si in media)
            {
                if (si.Media != null && si.Media.id > 0)
                {
                    geometrics_media find = ActiveRecordBase<geometrics_media>.FindFirst(new ICriterion[] { Expression.Eq("media", si.Media), Expression.Eq("geometric_id", geometric) });
                    find.geometric_order = si.geometric_order;
                    ActiveRecordMediator<geometrics_media>.Save(find);
                }
            }

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


            string wkt = "POLYGON ((-145 -45, -55 -45, -55 45, -145 45, -145 -45))";
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
                    Redirect("Edit_geometric.castle?id=" + geometric.id);
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

        public void test()
        {
            geometrics geo = ActiveRecordBase<geometrics>.Find(10);
            SqlGeography spatial = geometrics.AsGeography(geo.boundary);
            CancelView();
        }

        public void delete(int id)
        {
            geometrics geometric = ActiveRecordBase<geometrics>.Find(id);
            Flash["massage"] = "Article, <strong>Note:" + geometric.id + "</strong>, has been <strong>deleted</strong>.";
            ActiveRecordMediator<geometrics>.Delete(geometric);
            CancelLayout();
            RedirectToAction("list");
        }


    }
}
