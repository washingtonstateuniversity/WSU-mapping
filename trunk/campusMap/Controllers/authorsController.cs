namespace campusMap.Controllers
{
    using System.Collections.Generic;
    using Castle.ActiveRecord;
    using Castle.MonoRail.Framework;
    using Castle.MonoRail.ActiveRecordSupport;
    using MonoRailHelper;
    using NHibernate.Expression;
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
            PropertyBag["authusers"] = ActiveRecordBase<authors>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();    
        }

        public void Edit(int id)
        {
            authors authuser = ActiveRecordBase<authors>.Find(id);
            if (!canControl(getUser()) && authuser.id != getUser().id)
            {
                Flash["error"] = "Sorry you are not able to edit this user.";
                RedirectToAction("list");
                return;
            }

            media_types imgtype = ActiveRecordBase<media_types>.Find(3);
            PropertyBag["images"] = imgtype.media; //Flash["images"] != null ? Flash["images"] : 
            PropertyBag["authuserimages"] = authuser.media;
            PropertyBag["currentUser"] = getUser();
            PropertyBag["authuser"] = authuser;
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();
            PropertyBag["sections"] = ActiveRecordBase<place_types>.FindAll();
            RenderView("new");
        }


        public void New()
        {
            authors authuser = new authors();
            List<media_repo> images = new List<media_repo>();
            images.AddRange(authuser.media);
            if (images.Count == 0)
            {
                images.Add(new media_repo());
            }
            PropertyBag["authuserimages"] = images;
            media_types imgtype = ActiveRecordBase<media_types>.Find(3);
            PropertyBag["images"] = imgtype.media;
            PropertyBag["currentUser"] = getUser();
            PropertyBag["sections"] = ActiveRecordBase<place_types>.FindAll();
            PropertyBag["authusers"] = ActiveRecordBase<authors>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();  
        }

        public bool canControl(authors user)
        {
            bool flag = false;
            switch (user.access_levels.title)
            {
                case "Author": flag = false; break;

                case "Editor": flag = true; break;

                case "Contributor": flag = false; break;
            }
            return flag;
        }
        public bool canChangeLevel(authors user)
        {
            bool flag = false;
            switch (user.access_levels.title)
            {
                case "Author": flag = false; break;

                case "Editor": flag = true; break;

                case "Contributor": flag = false; break;
            }
            return flag;
        }
        public void Update([ARDataBind("authuser", Validate = true, AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)] authors authuser,
                           [ARDataBind("image", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] media_repo image,
                           HttpPostedFile newimage,
                           int[] Sections, string apply, string cancel) 
        {

            if (cancel != null)
            {
                RedirectToAction("list");
                return;
            }

            authuser.Sections.Clear();
            foreach (int section in Sections)
            {
                place_types tmp=ActiveRecordBase<place_types>.Find(section);
                if (!authuser.Sections.Contains(tmp) && tmp.id > 0)
                {
                    authuser.Sections.Add(tmp);
                }
            }
            authuser.media.Clear();


            try
            {
                ActiveRecordMediator<authors>.Save(authuser);
               
            }
            catch (Exception ex)
            {
                Flash["error"] = ex.Message;
                Flash["authuser"] = authuser;

            }
            ActiveRecordMediator<media_repo>.Save(image);
            if (newimage.ContentLength != 0)
            {
                String Fname = System.IO.Path.GetFileName(newimage.FileName);
                String[] fileparts = Fname.Split('.');
                if (String.IsNullOrEmpty(image.FileName))
                {
                    image.FileName = fileparts[0];
                }
                image.Ext = fileparts[1];

                //set up the image up from the stream
                System.Drawing.Image processed_image = System.Drawing.Image.FromStream(newimage.InputStream);

                // a var for uploads will start here
                String uploadPath = Context.ApplicationPhysicalPath + @"\uploads\mugshots\";

                if (!HelperService.DirExists(uploadPath))
                {
                    System.IO.Directory.CreateDirectory(uploadPath);
                }
                string newFile = uploadPath + image.id + ".ext";
                //helperService.ResizeImage(newimage, uploadPath + image.Id + ".ext", 1000, 1000, true);           
                imageService.process(image.id, processed_image, newFile, ImageService.imageMethod.Constrain, 0, 0, 1000, ImageService.Dimensions.Width, true, "");

                ActiveRecordMediator<media_repo>.Save(image);
                authuser.media.Add(image);
            }

            
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
                                                      