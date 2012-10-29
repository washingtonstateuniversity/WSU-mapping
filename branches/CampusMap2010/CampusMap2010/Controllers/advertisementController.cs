namespace campusMap.Controllers
{
    using System.Collections.Generic;
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
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    [Layout("default")]
    public class advertisementController : SecureBaseController
    {
        public void Index()
        {
            //ActiveRecordBase<Block>.FindAll();
            PropertyBag["AccessDate"] = DateTime.Now;
        }
        public void List(int page)
        {
            if (page == 0)
                page = 1;
            IList<advertisement> items;
            int pagesize = 15;
            items = ActiveRecordBase<advertisement>.FindAll(Order.Asc("expiration"));
            PropertyBag["advertisement"] = PaginationHelper.CreatePagination(items, pagesize, page);
            //PropertyBag["advertisement"] = ActiveRecordBase<Advertisement>.FindAll();

            PropertyBag["authors"] = ActiveRecordBase<users>.FindAll();
            PropertyBag["now"] = DateTime.Now;
            PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll();
            PropertyBag["tags"] = ActiveRecordBase<tags>.FindAll();
            //PropertyBag["classifiedtype"] = ActiveRecordBase<ClassifiedType>.FindAll();
            //PropertyBag["location"] = ActiveRecordBase<LocationType>.FindAll();    
        }
        public void Edit(int id)
        {
            advertisement advertisement = ActiveRecordBase<advertisement>.Find(id) ;
            PropertyBag["advertisementimages"] = advertisement.Images;
            PropertyBag["tags"] = ActiveRecordBase<tags>.FindAll();
            PropertyBag["advertisement"] = ActiveRecordBase<advertisement>.Find(id);
            media_types imgtype = ActiveRecordBase<media_types>.Find(2);
            PropertyBag["images"] = imgtype.media_typed;
            //PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll();
            PropertyBag["authors"] = ActiveRecordBase<users>.FindAll();
            //PropertyBag["classifiedtype"] = ActiveRecordBase<ClassifiedType>.FindAll();
            //PropertyBag["location"] = ActiveRecordBase<LocationType>.FindAll();    
            List<tags> tags = new List<tags>();
            tags.AddRange(ActiveRecordBase<advertisement>.Find(id).Tags);
            int tagscounts = 0;
            if (ActiveRecordBase<advertisement>.Find(id).Tags != null)
                tagscounts = ActiveRecordBase<advertisement>.Find(id).Tags.Count;

            for (int i = tagscounts; i < 2; i++)
                tags.Add(new tags());
            PropertyBag["advertisementtags"] = tags;
            RenderView("new");
        }
        public void New()
        {
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("type", ActiveRecordBase<media_types>.Find(2)));
            PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll(baseEx.ToArray());
            PropertyBag["advertisement"] = ActiveRecordBase<advertisement>.FindAll();
            PropertyBag["tags"] = ActiveRecordBase<tags>.FindAll();
            PropertyBag["authors"] = ActiveRecordBase<users>.FindAll();
            //PropertyBag["location"] = ActiveRecordBase<LocationType>.FindAll();    
        }
        public void GetAddImage(int count)
        {
            PropertyBag["count"] = count;

            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("type", ActiveRecordBase<media_types>.Find(2)));
            PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll(baseEx.ToArray());

            List<media_repo> images = new List<media_repo>();
            images.Add(new media_repo());
            PropertyBag["advertisementimages"] = images;
            RenderView("addimage", true);
        }
        public void DeleteImage(int id, int imageid)
        {
            media_repo image = ActiveRecordBase<media_repo>.Find(imageid);
            advertisement advertisement = ActiveRecordBase<advertisement>.Find(id);
            advertisement.Images.Remove(image);
            ActiveRecordMediator<advertisement>.Save(advertisement);
            CancelLayout();
            RenderText("true");
         }
        public void GetAddTag(int count)
        {
            PropertyBag["count"] = count;
            PropertyBag["tags"] = ActiveRecordBase<tags>.FindAll();
            
            List<tags> tags = new List<tags>();
            tags.Add(new tags());
            tags.Add(new tags());

            PropertyBag["advertisementtags"] = tags;
            RenderView("addtag", true);
        }
        public void DeleteTag(int id, int advertisementId)
        {
            tags tag = ActiveRecordBase<tags>.Find(id);
            advertisement advertisement = ActiveRecordBase<advertisement>.Find(advertisementId);
            advertisement.Tags.Remove(tag);
            ActiveRecordMediator<advertisement>.Save(advertisement);
         }
        

        public void view(int id)
        {
            PropertyBag["advertisement"] = ActiveRecordBase<advertisement>.Find(id);
        }



        public void Update([ARDataBind("advertisement", Validate = true, AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)] advertisement  advertisement,
        [ARDataBind("tags", Validate = true, AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)]tags[] tags, String[] newtag,
       [ARDataBind("images", Validate = true, AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)]media_repo[] images)
        {

            if (advertisement.HtmlText == null && (advertisement.Url == null && images.Length == 0))
            {
                Flash["error"] = "You may not set a empty advertisment";
                RedirectToReferrer();
                return;
            }
            //string output = JsonConvert.SerializeObject(advertisement.limitAds);

            advertisement.Tags.Clear();
            advertisement.Images.Clear();     
            try
            {
                if (newtag != null)
                {
                    foreach (String oneTag in newtag)
                    {
                        if (oneTag != "")
                        {
                            tags t = new tags();
                            t.name = oneTag;
                            tags[] temp = ActiveRecordBase<tags>.FindAllByProperty("Name", oneTag);
                            if (temp.Length == 0)
                            {
                                ActiveRecordMediator<tags>.Save(t);
                                advertisement.Tags.Add(t);
                            }

                        }

                    }

                }

                                          
                  
                foreach (tags tag in tags)
                {
                    if (tag.id > 0)
                        advertisement.Tags.Add(tag);                                
                }

                foreach (media_repo image in images)
                {
                    if (image.id > 0)
                        advertisement.Images.Add(image);
                }
                /*if (advertisement.Location.id == 0)
                {
                    advertisement.Location.id = 2;
                }*/
               
                ActiveRecordMediator<advertisement>.Save(advertisement);
              
            }

                
            catch (Exception ex)
            {
                Flash["error"] = ex.Message;
                Flash["advertisement"] = advertisement ;

            }
            RedirectToAction("list");
        }

        public void delete(int id)
        {
            advertisement advertisement = ActiveRecordBase<advertisement>.Find(id);
            ActiveRecordMediator<advertisement>.Delete(advertisement);
            RedirectToReferrer();
            CancelLayout();
            RedirectToAction("list");
        }

      
        


    }
}
                                                      