#region using
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using Castle.ActiveRecord;
    using Castle.ActiveRecord.Queries;
    using Castle.MonoRail.Framework;
    using Castle.MonoRail.ActiveRecordSupport;
    using campusMap.Models;
    using MonoRailHelper;
    using System.IO;
    using System.Net;
    using System.Web;
    using NHibernate.Expression;
    using System.Xml;
    using System.Xml.XPath;
    using System.Text.RegularExpressions;
    using System.Text;
    using System.Net.Sockets;
    using System.Web.Mail;
    using campusMap.Services;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Utilities;
    using Newtonsoft.Json.Linq;




#endregion
namespace campusMap.Controllers
{


    [Layout("default")]
    public class adminController : SecureBaseController
    {
        #region JSON OUTPUT
        public void get_pace_type()
        {
            CancelView();
            CancelLayout();
            place_types[] types = ActiveRecordBase<place_types>.FindAll();

            List<JsonAutoComplete> type_list = new List<JsonAutoComplete>();
            foreach (place_types place_type in types)
            {
                JsonAutoComplete obj = new JsonAutoComplete();
                obj.id = place_type.id;
                obj.label = place_type.name;
                obj.value = place_type.name;
                type_list.Add(obj);
            }
            string json = JsonConvert.SerializeObject(type_list);
            RenderText(json);
        }
        /*public void get_place_tags(string type)
        {
            CancelView();
            CancelLayout();
            t[] all_tag = ActiveRecordBase<t>.FindAll();

            List<JsonAutoComplete> tag_list = new List<JsonAutoComplete>();
            foreach (t tag in all_tag)
            {
                JsonAutoComplete obj = new JsonAutoComplete();
                obj.id = tag.id;
                obj.label = tag.name;
                obj.value = tag.name;
                tag_list.Add(obj);
            }
            string json = JsonConvert.SerializeObject(tag_list);
            RenderText(json);
        }*/
        #endregion


        #region URL rendering
        public void render()
        {
            String everUrl = Context.Request.RawUrl;
            // URL comes in like http://sitename/edit/dispatch/handle404.castle?404;http://sitename/pagetorender.html
            // So strip it all out except http://sitename/pagetorender.html
            everUrl = Regex.Replace(everUrl, "(.*:80)(.*)", "$2");
            everUrl = Regex.Replace(everUrl, "(.*:443)(.*)", "$2");
            String urlwithnoparams = Regex.Replace(everUrl, @"(.*?)(\?.*)", "$1");
            String querystring = Regex.Replace(everUrl, @"(.*?)(\?.*)", "$2");
            /* CancelView();
            if (everUrl == "/default.aspx")
            {
                //Redirect(HttpContext.Request.ApplicationPath + "/Admin/editByUrl.castle?editurl=" + Context.Server.UrlEncode(everUrl));
                Index();
                RenderView("index");
                return;
            }
            if (urlwithnoparams.EndsWith("index.castle"))
            {
                LayoutName = "secondary-tabs";
                string url = Regex.Replace(urlwithnoparams, @"/read/(.*)", "$1");
                readmore(placeService.placeByURL_id(url));
                RenderView("readmore");
                return;
            }
            if (urlwithnoparams.EndsWith("sitemap.xml"))
            {
                seoSitemap();
                RenderView("seoSitemap");
                return;
            }
            if (urlwithnoparams.EndsWith("/home"))
            {
                Index();
                RenderView("index");
                return;
            }
            if (urlwithnoparams.EndsWith("readmore.castle"))
            {
                LayoutName = "secondary-tabs";
                string id = Regex.Replace(querystring, @"\?id=(.*)", "$1");
                readmore(Convert.ToInt32(id));
                RenderView("readmore");
                return;
            }
            if (urlwithnoparams.ToString().IndexOf("read/") == 1)
            {
                LayoutName="secondary-tabs";
                string url = Regex.Replace(urlwithnoparams, @"/read/(.*)", "$1");
                readmore(placeService.placeByURL_id(url));
                RenderView("readmore");
                return;
            }*/
        }
        #endregion



        public void getInfoTemplates(string callback)
        {
            CancelView();
            CancelLayout();
            IList<infotabs_templates> tempList = ActiveRecordBase<infotabs_templates>.FindAll();
            String jsonStr = "";
            foreach (infotabs_templates temp in tempList)
            {
                jsonStr += @"{";
                jsonStr += @"""alias"":""" + temp.alias + @""",";
                jsonStr += @"""id"":""" + temp.id + @""",";
                jsonStr += @"""name"":""" + temp.name + @""",";
                jsonStr += @"""process"":""" + temp.process + @"""";
                jsonStr += @"},";
            }

            String json = "[" + jsonStr.TrimEnd(',') + "]";

            if (!string.IsNullOrEmpty(callback))
            {
                json = callback + "(" + json + ")";
            }
            Response.ContentType = "application/json; charset=UTF-8";
            RenderText(json);
        }

        public void help()
        {
            RenderView("../admin/help");
        }
        public void admin()
        {
            authors user = userService.getUser();
            IList<place> places = user.getUserPlaces(1,5);
            PropertyBag["places"] = places;
            PropertyBag["user"] = user;
            IList<authors> activeUser = new List<authors>();
            authors[] _authors = ActiveRecordBase<authors>.FindAll();
            foreach (authors _author in _authors)
            {
                if (_author != null && _author.logedin && _author.LastActive > DateTime.Today.AddHours(-1) )
                {
                   activeUser.Add(_author);
                }
            }
            PropertyBag["activeUsers"] = activeUser;
            RenderView("../admin/splash");
        }



        private void getPlaces()
        {
            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
        }

        [Layout("secondary")]
        public void thankyou()
        {
            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(places);
            RenderView("thankyou");       
        }
        [Layout("secondary")]
        public void usefullinks()
        {
            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(places);
            RenderView("usefullinks"); 
        }
        [Layout("secondary")]
        public void blogs()
        {

            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(places);
            RenderView("blogs"); 
        }
        [Layout("secondary")] 
        public void studentadvertisingfund()
        {
            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(places);
            RenderView("studentadvertisingfund");        
        }
        [Layout("secondary")]
        public void advertisewithus()
        {
            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(places);
            RenderView("advertisewithus");
        }
        [Layout("secondary")]
        public void newsletter()
        {
            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(places);
            RenderView("newsletter");
        }
        [Layout("secondary")]
        public void newsletter_unsubscribe()
        {
            place[] places = placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(places);
            RenderView("newsletter_unsubscribe");
        }
       /* [Layout("secondary")]
        public void newsletter_add([ARDataBind("person", AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] Person person, string Asirra_Ticket)
        {

            // Check the kitties
            if (!helperService.passedCaptcha(Asirra_Ticket))
            {
                Flash["message"] = "Please try again.";
                RedirectToReferrer();
                return;
            }
            //check if valid email
            if (String.IsNullOrEmpty(person.Email) || !helperService.isEmail(person.Email))
            {
                Flash["message"] = "You must provide a vaild email.<br/><strong>Note:</strong>This is not published or shared with third parties.";
                RedirectToReferrer();
                return;
            }
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("Email", person.Email));
            Person existingemail = ActiveRecordBase<Person>.FindOne(baseEx.ToArray());
            if (existingemail !=null && existingemail.Email != "")
            {
                existingemail.Newsletter = true;
                existingemail.Save();
            }else{
                person.Newsletter = true;
                person.Save();
            }
            Flash["message"] = "You have been added form the newletter.";
            RedirectToReferrer();
        }
        [Layout("secondary")]
        public void newsletter_remove([ARDataBind("person", AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] Person person, string Asirra_Ticket)
        {
            // Check the kitties
            if (!helperService.passedCaptcha(Asirra_Ticket))
            {
                Flash["message"] = "Please try again.";
                RedirectToReferrer();
                return;
            }
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("Email", person.Email));
            Person existingemail = ActiveRecordBase<Person>.FindOne(baseEx.ToArray());
            if (existingemail != null && existingemail.Email != "")
            {
                existingemail.Newsletter = false;
                existingemail.Save();
            }
            Flash["message"] = "You have been removed form the newletter.";
            RedirectToReferrer();
        }
        
        

        [Layout("secondary")] 
        public void application(int id)
        {
            PropertyBag["applicant"] = ActiveRecordBase<Applicants>.Find(id);

            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(places);

            RenderView("application");
        }*/

        [Layout("secondary")]
        public void upload()
        {
            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(places);
            RenderView("upload"); 
        }


        [Layout("home")] 
        public void Index()
        {
            PropertyBag["AccessDate"] = DateTime.Now;
            //PropertyBag["blocks"] = getBlocksWithContent();

            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));

            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(places);
            //PropertyBag["FeaturedNews"] = placeService.getFeaturedNews();
            //PropertyBag["BreakingNews"] = placeService.getBreakingNews();
        }
        /*
        public IList<Block> getBlocksWithContent()
        {
            IList<Block> blockstokeep = new List<Block>();
            Block[] blocks = ActiveRecordBase<Block>.FindAll(Order.Asc("Order"));
            foreach (Block block in blocks)
            {
                if (block.Placetype.PublishedPlaces.Count > 0)
                    blockstokeep.Add(block);
            }
            return blockstokeep;
        }
        */

        #region Comments and helpers

        [Layout("secondary-tabs")]
        public void discussion(int id)
        {
            place place = ActiveRecordBase<place>.Find(id);
            canView(place);
            PropertyBag["Place"] = place;
            PropertyBag["comments"] = ActiveRecordBase<comments>.FindAll();
            place[] places = placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(places);

            /*
            IList<place> breakingplaces = new List<place>();
            foreach (place tempplace in places)
            {
                if (tempplace.BreakingNews == true)
                {
                    breakingplaces.Add(tempplace);
                }
            }
            PropertyBag["BreakingNews"] = breakingplaces;
             */
        }

        public void userFlag(string flagged, [ARDataBind("place_comments", AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)] comments comment)
        {
            if ( String.IsNullOrEmpty(flagged) )
            {
                RedirectToReferrer();
                return;
            }
            if (flagged == "yes")
            {
                comment.Flagged = true;
                comment.adminRead = false;
                comment.FlagNumber = comment.FlagNumber + 1;
                ActiveRecordMediator<comments>.Save(comment);
                RedirectToReferrer();
                return;
            }
        }

        public void submitComment([ARDataBind("place_comments", AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)] comments comment, string Asirra_Ticket)
        {
            // Check if they filled out spam blocker
            if (String.IsNullOrEmpty(Asirra_Ticket))
            {
                Flash["message"] = "You may not try to by pass the spam protection.  Please fill out the form and choose the species and directed.";
                RedirectToReferrer();
                return;
            }
            
            // Check the kitties
            if (!helperService.passedCaptcha(Asirra_Ticket))
            {
                Flash["message"] = "Please try again.";
                RedirectToReferrer();
                return;
            }

            //check if valid email
            if (String.IsNullOrEmpty(comment.Email) || !helperService.isEmail(comment.Email))
            {
                Flash["message"] = "You must provide a vaild email.<br/><strong>Note:</strong>This is not published or shared with third parties.";
                RedirectToReferrer();
                return;
            }

            //check if blank
            if (String.IsNullOrEmpty(comment.comment))
            {
                Flash["message"] = "You must post something to post something.";
                RedirectToReferrer();
                return;
            }

            //Setup the decode version to check
            comment.comment = helperService.decodeString(comment.comment);

            //Check if just spaces
            if (comment.comment != null && String.IsNullOrEmpty(comment.comment.Trim()))
            {
                Flash["message"] = "You must post something to post something.";
                RedirectToReferrer();
                return;
            }

            // Strip html elements
            comment.comment = helperService.stripHTMLElements(comment.comment);
            //ReSetup the decode version to check
            comment.comment = helperService.decodeString(comment.comment);
            
            // Check for links
            if (helperService.hasLink(comment.comment))
            {
                comment.Flagged = true;
                comment.published = false;
                Flash["message"] = "Please try again. you may not add links.";
                RedirectToReferrer();
                return;
            }

            //Start chack for cursing
            String spamresults = helperService.getCommentSpamResultMessage(comment);
            if (!String.IsNullOrEmpty(spamresults))
            {
                Flash["message"] = spamresults;
                comment.Flagged = true;
                comment.published = false;
            }
            else
            {
                //Everything is ok so set up the db entry
                comment.published = true;
                comment.adminRead = false;
            }
            comment.CreateTime = DateTime.Now;
            comment.UpdateTime = DateTime.Now;
            ActiveRecordMediator<comments>.Save(comment);
            if (((String)Flash["message"]) == "")
            {
                Flash["message"] = "Your comment has been added.  It will show up when it's been approved.";
            }
            RedirectToReferrer();
        }
        #endregion



        [Layout("secondary")] 
        public void contactus()
        {
            place[] places = ActiveRecordBase<place>.FindAll();
            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(places);  
            RenderView("contactus");         
        }
        [Layout("secondary")]
        public void mallcam()
        {
            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            
            PropertyBag["now"] = DateTime.Now;
            PropertyBag["nowdate"] = DateTime.Now.DayOfWeek;
            DateTime [] week = new DateTime[]{ new DateTime(),
                new DateTime(), new DateTime(), new DateTime(), new DateTime(), new DateTime(), new DateTime() };
            
            //DayOfWeek[] dayofweek = new DayOfWeek[] { new DayOfWeek(),new DayOfWeek(),
            //    new DayOfWeek(),new DayOfWeek(),new DayOfWeek(),new DayOfWeek(), new DayOfWeek()}; 
            for (int i = 0; i < 7; i++)
            {
                week[i] = helperService.date_return(i);                       
            }              
            PropertyBag["week"] = week;                  
            RenderView("mallcam"); 
        }

        [Layout("secondary")]
        public void advancedsearch()
        {
            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["Places"] = placeService.getAdvertisements(places);
            
            tags[] tags = ActiveRecordBase<tags>.FindAll();
            PropertyBag["tags"] = tags;

            person[] person = ActiveRecordBase<person>.FindAll();
            PropertyBag["Person"] = person; 
        }

        public void notauthorized()
        {

        }

        [Layout("secondary")] 
        public void searchByPlaces(string str)
        {
            // Container IList, all searched places will be saved
            IList<place> allPlaces = placeService.searchPlaces(str);
            PropertyBag["Ads"] = placeService.getAdvertisements(allPlaces);
            PropertyBag["byPlaces"] = allPlaces;
        }       

        public void viewPlace(int id)
        {
            PropertyBag["place"] = ActiveRecordBase<place>.Find(id);
            RenderView("viewPlace");

            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
           /* IList<place> breakingplaces = new List<place>();
            foreach (place tempplace in places)
            {
                if (tempplace.BreakingNews == true)
                {
                    breakingplaces.Add(tempplace);
                }
            }
            PropertyBag["BreakingNews"] = breakingplaces;*/
        }

        public void breakingNewsView(){
            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
           /* IList<place> breakingplaces = new List<place>();
            foreach (place tempplace in places)
            {
                if (tempplace.BreakingNews == true)
                {
                    breakingplaces.Add(tempplace);
                }
            }
            PropertyBag["BreakingNews"] = breakingplaces;
            RenderView("breakingNewsView");     */       
        }

        public void canView(place place)
        {
            if (place != null && place.status != null &&place.status.id != 3)
            {
                authors user = getUser();
                bool able = false;
                if (user != null && user.access_levels != null)
                    switch (user.access_levels.title)
                    {
                        case "Author": able = true; break;
                        case "Editor": able = true; break;
                        case "Contributor": able = true; break;
                    }
                if (!able) Redirect("/home");
            }
        }


        public string Gettags(int id) {
            place place = id != 0 ? ActiveRecordBase<place>.Find(id) : null;
            String tags = "";
            foreach (tags t in place.tags)
            {
                tags += t.name +  ',';
            }
            return tags.TrimEnd(',');
        }


        [Layout("secondary-tabs")]
        public void readmore(int id)
        {

            place place = id!=0?ActiveRecordBase<place>.Find(id):null;
            canView(place);
            PropertyBag["place"] = place;
            
            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["Ads"] = placeService.getAdvertisements(places);
            PropertyBag["places"] = places; 
            if (place.Authors.Count > 1)
            {
                PropertyBag["flag"] = true;
            }
            else
            {
                PropertyBag["flag"] = false; 
            }
            PropertyBag["comment"] = new comments();         
            /*IList<place> breakingplaces = new List<place>();
            foreach (place tempplace in places)
            {
                if (tempplace.BreakingNews == true)
                {
                    breakingplaces.Add(tempplace);
                }
            }
            PropertyBag["BreakingNews"] = breakingplaces;*/
            media_repo mainimage = new media_repo(); 
            if (place.Images.Count != 0 )
            {
                mainimage = place.Images[0];
            }
            else
            {
                PropertyBag["mainImage"] = null; 
            }
            PropertyBag["mainImage"] = mainimage;

            //place_types type = ActiveRecordBase<place_types>.Find(place.place_types.id);
            //PropertyBag["placeType"] = type;

            //place[] relatedBytype = placeService.getPublishedPlaces(Order.Desc("Order"), type);
            //PropertyBag["relatedBytype"] = relatedBytype;

            place[] relatedPlacesByPlacetags = placeService.getRelatedPlacesByPlacetags(place);
            PropertyBag["relatedPlacesByPlacetags"] = relatedPlacesByPlacetags;

        }        
        public void breakingNewsreadmore(int id)
        {
            place place = ActiveRecordBase<place>.Find(id);
            PropertyBag["BreakingNew"] = place ;
        }
        public void breakingNewFromHeaderView(int id)
        {
            place place = ActiveRecordBase<place>.Find(id);
            PropertyBag["BreakingNew"] = place;
        }
        [Layout("secondary")] 
        public void list(int id)
        {
            //Block[] blocks = ActiveRecordBase<Block>.FindAll();
            //PropertyBag["blocks"] = blocks;

            place[] placeByType = placeService.getPublishedPlaces(Order.Desc("Order"), ActiveRecordBase<place_types>.Find(id));
            PropertyBag["placeByType"] = placeByType;
            PropertyBag["person"] = ActiveRecordBase<person>.Find(id);
            place[] places = placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(placeByType);
        
            //PropertyBag["BreakingNews"] = placeService.getBreakingNews();
        }
        
      [Layout("threecols")] 

        #region sitemap xml
        public void seoSitemap()
        {
            Response.ContentType = "text/xml";
            getPlaces();
            CancelLayout(); 
        }
        #endregion


        #region RSS feeds (note some need to be set up for each type)
        [Layout("secondary")] 
        public void rssfeeds() 
        {
            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["Ads"] = placeService.getAdvertisements(places);
            PropertyBag["places"] = places; 
            RenderView("rssfeeds");             
        }

        
        public void rss()
        {
            Response.ContentType = "text/xml";
            getPlaces();
            CancelLayout();             
        }
        public void news()
        {
            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places; 
            Context.Response.ContentType = "text/xml";
            CancelLayout();     
        
        }
        public void sports()
        {
            Response.ContentType = "text/xml";
            getPlaces();
            CancelLayout(); 
        }
        public void life()
        {
            Response.ContentType = "text/xml";
            getPlaces();
            CancelLayout();
        }
        public void opinion()
        {
            Response.ContentType = "text/xml";
            getPlaces();
            CancelLayout();
        }
        #endregion
        /*
        #region Application and helpers (needs work)
        public void UpdateApplicant([ARDataBind("applicant", Validate = true, AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)] Applicants applicant)
        {
            try
            {
                ActiveRecordMediator<Applicants>.Save(applicant);
            }
            catch (Exception ex)
            {
                Flash["error"] = ex.Message;
                Flash["applicant"] = applicant;
            }
            Redirect("../public/application.castle?id="+applicant.id);
        }
        public void Download(int id)
        {
            Applicants applicant = ActiveRecordBase<Applicants>.Find(id);
            // the path it was uploaded to
            string uploadPath = Context.ApplicationPath + "\\resumeupload\\";
            // Read in the file into a byte array
            byte[] contents = File.ReadAllBytes(HttpContext.Server.MapPath(uploadPath + id + ".ext"));
            // Setup the response
            Response.ContentType = "applicaton/x-download";
            Context.Response.AppendHeader("Content-Disposition", "attachment; filename=\"" + applicant.Resume + "\"");
            Context.Response.AppendHeader("Content-Disposition", "attachment; filename=\"" + applicant.Sample1 + "\"");
            Context.Response.AppendHeader("Content-Disposition", "attachment; filename=\"" + applicant.Sample2 + "\"");
            Context.Response.AppendHeader("Content-Disposition", "attachment; filename=\"" + applicant.Sample3 + "\"");
            Context.Response.CacheControlHeader = "no-cache";
            // Write the file to the response
            Response.BinaryWrite(contents);
            HttpContext.Response.End();
        }
        public void resumesave([ARDataBind("applicant", Validate = true, AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)] Applicants applicant, HttpPostedFile resume,HttpPostedFile sample1,HttpPostedFile sample2,HttpPostedFile sample3)
        {
         
                ActiveRecordMediator<Applicants>.Save(applicant);
                if (resume.ContentLength != 0 || sample1.ContentLength !=0 ||sample2.ContentLength !=0 ||sample3.ContentLength !=0)
                {
                    if (String.IsNullOrEmpty(applicant.Resume) || String.IsNullOrEmpty(applicant.Sample1) || String.IsNullOrEmpty(applicant.Sample2) ||
                        String.IsNullOrEmpty(applicant.Sample3))
                    { 
                      applicant.Resume = System.IO.Path.GetFileName(resume.FileName);
                      applicant.Sample1 = System.IO.Path.GetFileName(sample1.FileName);
                      applicant.Sample2 = System.IO.Path.GetFileName(sample2.FileName);
                      applicant.Sample3 = System.IO.Path.GetFileName(sample3.FileName);                  
                    
                    }
                    String uploadPath = Context.ApplicationPhysicalPath + "\\resumeupload\\";
                    resume.SaveAs(uploadPath + applicant.id + "resume.ext");
                    sample1.SaveAs(uploadPath + applicant.id + "sample1.ext");
                    sample2.SaveAs(uploadPath + applicant.id + "sample2.ext");
                    sample3.SaveAs(uploadPath + applicant.id + "sample3.ext");   
  
                }

            ActiveRecordMediator<Applicants>.Save(applicant);
            RedirectToAction("upload");
        }
        #endregion
        */
        [Layout("secondary")]
        public void placelist(int id)
        {
            PropertyBag["tag"] = ActiveRecordBase<tags>.Find(id);

            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(places);
            //PropertyBag["BreakingNews"] = placeService.getBreakingNews();
        }
        /*
        [Layout("secondary")]
        public void breakingnews()
        {
            place[] places = placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(places);
            IList<place> breakingplaces = new List<place>();
            foreach (place tempplace in places)
            {
                if (tempplace.BreakingNews == true)
                {
                    breakingplaces.Add(tempplace);
                }
            }
            PropertyBag["BreakingNews"] = breakingplaces;
            RenderView("breakingnews");
        }

        public void subscribe_breakingNews([ARDataBind("person", AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] Person person, string Asirra_Ticket)
        {
            // Check the kitties
            if (!helperService.passedCaptcha(Asirra_Ticket))
            {
                Flash["message"] = "Please try again.";
                RedirectToReferrer();
                return;
            }
            //check if valid email
            if (String.IsNullOrEmpty(person.Email) || !helperService.isEmail(person.Email))
            {
                Flash["message"] = "You must provide a vaild email.<br/><strong>Note:</strong>This is not published or shared with third parties.";
                RedirectToReferrer();
                return;
            }

            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("Email", person.Email));
            Person existingemail = ActiveRecordBase<Person>.FindOne(baseEx.ToArray());
            if (existingemail != null && existingemail.Email != "")
            {
                existingemail.BreakingNews = false;
                existingemail.Save();
            }
            else
            {
                person.BreakingNews = false;
                person.Save();
            }
            Flash["message"] = "You have been signed up for breaking news updates.";
            RedirectToReferrer();
        }

        [Layout("secondary-tabs")]
        public void image(int id, int photo)
        {
            
            Place place = ActiveRecordBase<place>.Find(id);
            canView(place);
            PropertyBag["Place"] = place;
            int restCount = place.getCountRestOfImages();
            PropertyBag["restCount"] = restCount;

            media_repo mainimage = place.Images[photo];
            PropertyBag["mainImage"] = mainimage;
            int count = place.getImageCounts();

            if (photo < count || photo < restCount || photo > 1)
            {
                PropertyBag["nextPhoto"] = photo + 1;
                PropertyBag["photo"] = photo;
                PropertyBag["previousPhoto"] = photo - 1;
            }
            PropertyBag["allImages"] = place.Images;

            place[] places =placeService.getPublishedPlaces(Order.Desc("Order"));
            PropertyBag["places"] = places;
            PropertyBag["Ads"] = placeService.getAdvertisements(places);

            IList<place> breakingplaces = new List<place>();
            foreach (place tempplace in places)
            {
                if (tempplace.BreakingNews == true)
                {
                    breakingplaces.Add(tempplace);
                }
            }
            PropertyBag["BreakingNews"] = breakingplaces;
        }
         */

        #region Advertisement  NOTE: needs work
        public void IncClicked(int id)
        {
            advertisement adv = ActiveRecordBase<advertisement>.Find(id);
            adv.Clicked = adv.Clicked + 1;
            ActiveRecordMediator<advertisement>.Save(adv);
            Redirect(adv.Url);
        }
        public void IncView(advertisement adv)
        {
            adv.Views = adv.Views + 1;
            ActiveRecordMediator<advertisement>.Save(adv);
        }
       #endregion

 




























    }
}