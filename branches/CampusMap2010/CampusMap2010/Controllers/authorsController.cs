namespace campusMap.Controllers
{
    using System.Collections.Generic;
    using Castle.ActiveRecord;
    using Castle.MonoRail.Framework;
    using Castle.MonoRail.ActiveRecordSupport;
    using MonoRailHelper;
    using NHibernate.Criterion;
    using System.IO;
    using System.Web;
    using System;
    using campusMap.Models;
    using campusMap.Services;
    
    
    [Layout("default")]
    public class authorsController : SecureBaseController
    {

        public void Index()
        {
            //ActiveRecordBase<Block>.FindAll();
            PropertyBag["AccessDate"] = DateTime.Now;
        }

        public void BlowItAway()
        {
            throw new Exception("Exception thrown from a MonoRail action");
        }

        public void List()
        {
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();    
        }

        public void Edit(int id)
        {
            authors author = ActiveRecordBase<authors>.Find(id);
            if (!canControl(UserService.getUser()) && author != UserService.getUser())
            {
                Flash["error"] = "Sorry you are not able to edit this user.";
                RedirectToAction("list");
                return;
            }

            media_types imgtype = ActiveRecordBase<media_types>.Find(1);
            PropertyBag["images"] = imgtype.media_typed; //Flash["images"] != null ? Flash["images"] : 
            PropertyBag["authorimages"] = author.media;
            PropertyBag["currentUser"] = UserService.getUser();
            PropertyBag["author"] = author;
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
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
/*          
            adminService.setPDefaults();
*/

            PropertyBag["field_types"] = ActiveRecordBase<field_types>.FindAll();

            RenderView("new");
        }


        public void New()
        {
            authors author = new authors();
            List<media_repo> images = new List<media_repo>();
            images.AddRange(author.media);
            if (images.Count == 0)
            {
                images.Add(new media_repo());
            }
            PropertyBag["authorimages"] = images;
            media_types imgtype = ActiveRecordBase<media_types>.Find(1);
            PropertyBag["images"] = imgtype.media_typed;
            PropertyBag["currentUser"] = UserService.getUser();
            PropertyBag["authors"] = ActiveRecordBase<authors>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();



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


        }
        
        public bool canControl(authors user)
        {
            bool flag = false;
            switch (user.access_levels.name)
            {
                case "Admin": flag = true; break;

                case "Editor": flag = true; break;

            }
            return flag;
        }
        public bool canChangeLevel(authors user)
        {
            bool flag = false;
            switch (user.access_levels.name)
            {
                case "Admin": flag = true; break;

                case "Editor": flag = true; break;

            }
            return flag;
        }
        public void Update([ARDataBind("author", Validate = true, AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)] authors author,
                           [ARDataBind("image", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] media_repo image,
                           HttpPostedFile newimage,
                           int[] Sections, string apply, string cancel) 
        {

            if (cancel != null)
            {
                RedirectToAction("list");
                return;
            }


            if (cancel != null)
            {
                RedirectToAction("list");
                return;
            }
            if (author.access_levels.id == 0)
            {
                List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
                baseEx.Add(Expression.Eq("default", true));
                author.access_levels.id = ActiveRecordBase<access_levels>.FindFirst(baseEx.ToArray()).id;
               
                //List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
 /*
                author.access_levels.id = ActiveRecordBase<access_levels>.FindFirst(new List<AbstractCriterion>(){ Expression.Eq("default", false) }).id;
 */
                
            }

            /*author.place_types.Clear();
            foreach (int section in Sections)
            {
                place_types tmp=ActiveRecordBase<place_types>.Find(section);
                if (!author.place_types.Contains(tmp) && tmp.id > 0)
                {
                    author.place_types.Add(tmp);
                }
            }*/
            author.media.Clear();

            try
            {
                ActiveRecordMediator<authors>.Save(author);
            }
            catch (Exception ex)
            {
                Flash["error"] = ex.Message;
                Flash["author"] = author;
            }
            /*
                ActiveRecordMediator<media_repo>.Save(image);
                if (newimage.ContentLength != 0)
                {
                    String Fname = System.IO.Path.GetFileName(newimage.FileName);
                    String[] fileparts = Fname.Split('.');
                    if (String.IsNullOrEmpty(image.file_name))
                    {
                        image.file_name = fileparts[0];
                    }
                    image.ext = fileparts[1];

                    //set up the image up from the stream
                    System.Drawing.Image processed_image = System.Drawing.Image.FromStream(newimage.InputStream);

                    // a var for uploads will start here
                    String uploadPath = Context.ApplicationPhysicalPath + @"\uploads\mugshots\";

                    if (!HelperService.DirExists(uploadPath))
                    {
                        System.IO.Directory.CreateDirectory(uploadPath);
                    }
                    string newFile = uploadPath + image.id + ".ext";
                    //helperService.ResizeImage(newimage, uploadPath + image.id + ".ext", 1000, 1000, true);           
                    imageService.process(image.id, processed_image, newFile, ImageService.imageMethod.Constrain, 0, 0, 1000, ImageService.Dimensions.Width, true, "", image.ext);

                    ActiveRecordMediator<media_repo>.Save(image);
                    author.media.Add(image);
                }
            */
            RedirectToAction("list");
        }

        public void delete(int id)
        {

           authors auth = ActiveRecordBase<authors>.Find(id);
           ActiveRecordMediator<authors>.Delete(auth);
           RedirectToReferrer(); 
        }

    }
}
                                                      