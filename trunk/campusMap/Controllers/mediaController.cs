#region Directives
    using System;
    using System.Collections.Generic;
    using Castle.ActiveRecord;
    using Castle.MonoRail.Framework;
    using Castle.MonoRail.Framework.Helpers;
    using Castle.MonoRail.ActiveRecordSupport;
    using campusMap.Models;
    using MonoRailHelper;
    using System.IO;
    using System.Web;
    using Castle.ActiveRecord.Queries;
    using System.Data;
    using System.Configuration;
    using System.Web.Security;
    using System.Web.UI;
    using System.Web.UI.WebControls;
    using System.Web.UI.WebControls.WebParts;
    using System.Web.UI.HtmlControls;
    using System.Text.RegularExpressions;
    using campusMap.Services;
    using log4net;
    using log4net.Config;
#endregion

namespace campusMap.Controllers
{
    [Layout("default")]
    public class mediaController : SecureBaseController
    {
        ILog log = log4net.LogManager.GetLogger("ImageController");

        public void Index()
        {
            //ActiveRecordBase<Block>.FindAll();
            PropertyBag["AccessDate"] = DateTime.Now;
        }

        /**/public void New()
        {
            String CreditList = GetCredit();
            PropertyBag["credits"] = CreditList;
            PropertyBag["imagetypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll();
        }

        public void inlineupload()
        {
            String CreditList = GetCredit();
            PropertyBag["credits"] = CreditList;
            PropertyBag["imagetypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll();
            CancelLayout();
        }





        public void index(int page, int type, int pagesize)
        {
            if (page == 0)
                page = 1;
            IList<media_repo> items;
            
            if (pagesize == 0)
                pagesize = 15;

            if (type != 0)
            {
                media_types imgtype = ActiveRecordBase<media_types>.Find(type);
                items = imgtype.media_typed;
            }
            else
            {
                items = ActiveRecordBase<media_repo>.FindAll();
            }

            PropertyBag["pagesize"] = pagesize;
            PropertyBag["selected"] = type;
            PropertyBag["mediatypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["media"] = PaginationHelper.CreatePagination(items, pagesize, page);
        }
        public void delete(int id)
        {
            media_repo image = ActiveRecordBase<media_repo>.Find(id);
            ActiveRecordMediator<media_repo>.Delete(image);
            RedirectToAction("list");
        }
       /**/ public void Edit(int id)
        {

            String CreditList = GetCredit();
            PropertyBag["credits"] = CreditList; // string should be "location1","location2","location3"

            PropertyBag["imagetypes"] = ActiveRecordBase<media_types>.FindAll();
            PropertyBag["image"] = ActiveRecordBase<media_repo>.Find(id);
            PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll();
            RenderView("new");
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

        public void makeImageCopies(int id,string imageByPath)
        {
            System.Drawing.Image processed_image = System.Drawing.Image.FromFile(imageByPath);
            String[] fileparts = imageByPath.Split('.');
            string Ext = fileparts[fileparts.Length-1];
            string nameNpath = Regex.Replace(imageByPath, "."+Ext, "", RegexOptions.IgnoreCase);

            string newFile = nameNpath + "_500." + Ext;
            imageService.process(id, processed_image, newFile, ImageService.imageMethod.Constrain, 0, 0, 500, ImageService.Dimensions.Width, true, "", Ext);
            newFile = nameNpath + "_350." + Ext;
            imageService.process(id, processed_image, newFile, ImageService.imageMethod.Constrain, 0, 0, 350, ImageService.Dimensions.Width, true, "", Ext);
            newFile = nameNpath + "_250." + Ext;
            imageService.process(id, processed_image, newFile, ImageService.imageMethod.Constrain, 0, 0, 250, ImageService.Dimensions.Width, true, "", Ext);
        }

       /**/ public void removeImage(int image_id, int place_id, bool ajax)
        {
            media_repo image = ActiveRecordBase<media_repo>.Find(image_id);
            // a var for uploads will start here
            String uploadPath = Context.ApplicationPhysicalPath + @"\uploads\";
            if (place_id != 0)
            {
                uploadPath += @"place\" + place_id + @"\";
            }

            string newFile = uploadPath + image.id + ".ext";

            ActiveRecordMediator<media_repo>.Delete(image);
            if (place_id != 0)
            {
                place place = ActiveRecordBase<place>.Find(place_id);
                place.Images.Remove(image);
                FileInfo ImgFile = new FileInfo(newFile);
                ImgFile.Delete();
                ActiveRecordMediator<place>.Save(place);
            }

            if (ajax)
            {
                CancelView();
                CancelLayout();
                RenderText("true");
                return;
            }
            Flash["message"] = "Image Added";
            RedirectToAction("list");
        }

        public static void CopyStream(Stream input, Stream output)
        {
            byte[] buffer = new byte[32768];
            int read;
            while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
            {
                output.Write(buffer, 0, read);
            }
        } 


        public void Update(
            [ARDataBind("image", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] media_repo image,
            HttpPostedFile newimage,
            int place_id,
            bool ajax
            ){
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

                    Stream stream = newimage.InputStream;
                    MemoryStream memoryStream = new MemoryStream();
                    CopyStream(stream, memoryStream);
                    memoryStream.Position = 0;
                    stream = memoryStream;


                //set up the image up from the stream
                System.Drawing.Image processed_image = System.Drawing.Image.FromStream(newimage.InputStream);

                if (imageService.isFileACMYKJpeg(processed_image) || imageService.isByteACMYK(stream))
                {
                    if (ajax)
                    {
                        CancelView();
                        CancelLayout();
                        RenderText("You have uploaded a CMYK image.  Please conver to RGB first.");
                        return;
                    }
                    Flash["error"] = "You have uploaded a CMYK image.  Please conver to RGB first.";
                    RedirectToReferrer();
                    return;
                }


                // a var for uploads will start here
                String uploadPath = Context.ApplicationPhysicalPath + @"uploads\";

                if (place_id != 0)
                {
                    uploadPath += @"place\" + place_id + @"\";
                }
                if (!HelperService.DirExists(uploadPath))
                {
                    System.IO.Directory.CreateDirectory(uploadPath);
                }
                string newFile = uploadPath + image.id + ".ext";

                campusMap.Services.LogService.writelog(" in Update " + newFile);

                //helperService.ResizeImage(newimage, uploadPath + image.id + ".ext", 1000, 1000, true);           
                imageService.process(image.id, processed_image, newFile, ImageService.imageMethod.Constrain, 0, 0, 1000, ImageService.Dimensions.Width, true, "", image.ext);
            }
            ActiveRecordMediator<media_repo>.Save(image);
            if (place_id != 0)
            {
                place place = ActiveRecordBase<place>.Find(place_id);
                place.Images.Add(image);
                ActiveRecordMediator<place>.Save(place);
            }

            if (ajax) {
                CancelView();
                CancelLayout();
                RenderText(image.id.ToString());
                return;
            }
            Flash["message"] = "Image Added";
            RedirectToAction("list");
        }
        public void UpdatePool([ARDataBind("image", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] media_repo image, HttpPostedFile newimage)
        {
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

                // Make a copy of the stream to stop the destrustion of the gif animation per
                // http://stackoverflow.com/questions/8763630/c-sharp-gif-image-to-memorystream-and-back-lose-animation
                Stream stream = newimage.InputStream;
                MemoryStream memoryStream = new MemoryStream();
                CopyStream(stream, memoryStream);
                memoryStream.Position = 0;
                stream = memoryStream;

                //set up the image up from the stream
                //System.Drawing.Image processed_image = System.Drawing.Image.FromStream(newimage.InputStream);

                System.Drawing.Image processed_image = null;

                if (image.ext == "gif")
                {
                    //set up the image up from the stream
                    processed_image = System.Drawing.Image.FromStream(stream);//newimage.InputStream);
                }
                else
                {
                    processed_image = System.Drawing.Image.FromStream(newimage.InputStream);

                    if (imageService.isFileACMYKJpeg(processed_image) || imageService.isByteACMYK(stream))
                    {
                        Flash["error"] = "You have uploaded a CMYK image.  Please conver to RGB first.";
                        RedirectToReferrer();
                        return;
                    }
                }



                // a var for uploads will start here
                String uploadPath = Context.ApplicationPhysicalPath + @"\uploads\";

                if (!HelperService.DirExists(uploadPath))
                {
                    System.IO.Directory.CreateDirectory(uploadPath);
                }
                string newFile = uploadPath + image.id + ".ext";
                //helperService.ResizeImage(newimage, uploadPath + image.id + ".ext", 1000, 1000, true);           
                imageService.process(image.id, processed_image, newFile, ImageService.imageMethod.Constrain, 0, 0, 1000, ImageService.Dimensions.Width, true, "", image.ext);
            }
            ActiveRecordMediator<media_repo>.Save(image);
            RedirectToAction("list");
        }
        



        // h = height , w = width , p = percent, m = method , protect= stop sizing up of image, pre = prefix to image name 
        [SkipFilter]
        public void Download(int id, int placeid, int w, int h, int p, string m, bool protect, string pre, string mark, int maxage, bool nocache, bool mug)
        {
            log.Info("Starting download for image id " + id);
            media_repo image = ActiveRecordBase<media_repo>.Find(id);

            // build the path for the new image
            string uploadPath = Context.ApplicationPath + @"\uploads\";
            if (mug)
            {
                uploadPath += @"mugshots\";
            }

            /**/
            if(placeid!=0){
                place place = ActiveRecordBase<place>.Find(placeid);
                uploadPath += @"place\" + place.id + @"\";

                //check for place level image existence
                string orgFile = HttpContext.Server.MapPath(uploadPath + id + ".ext");
                if (!File.Exists(orgFile))
                {
                    //it didn't so lets take a look at the pool for the image
                    string newuploadPath = Context.ApplicationPath + @"\uploads\";
                    string neworgFile = HttpContext.Server.MapPath(newuploadPath + id + ".ext");
                    if (File.Exists(neworgFile))
                    {
                        uploadPath = Context.ApplicationPath + @"\uploads\";
                    }
                }
            }


            string arg  = (!String.IsNullOrEmpty(pre)? "_" + pre + "_" : "");
                   arg += (w != 0 ? "w_" + w + "_" : "");
                   arg += (h!=0?"h_" + h + "_":"");
                   arg += (p!=0?"p_" + p + "_":"");
                   arg += (protect != false ? "pro_true_" : "");
                   arg += (!String.IsNullOrEmpty(m)?"m_" + m + "_":"");
                   arg += (!String.IsNullOrEmpty(mark) ? "mark_" + mark + "_" : "");

            
            string newFile = HttpContext.Server.MapPath(uploadPath + id + arg + ".ext");

            // if the process image doesn't Exist yet create it
            if (!File.Exists(newFile))
            {
                System.Drawing.Image processed_image = System.Drawing.Image.FromFile(HttpContext.Server.MapPath(uploadPath + id + ".ext" ));
                //set some defaults
                ImageService.imageMethod methodChoice = ImageService.imageMethod.Percent;
                ImageService.Dimensions dimensional = ImageService.Dimensions.Width;

                //choose medth of sizing and set their defaults
                switch (m)
                {
                    case "percent":
                        methodChoice = ImageService.imageMethod.Percent;
                        break;
                    case "constrain": 
                        methodChoice = ImageService.imageMethod.Constrain;
                        dimensional = w != 0 ? ImageService.Dimensions.Width : ImageService.Dimensions.Height;
                        break;
                    case "fixed": 
                        methodChoice = ImageService.imageMethod.Fixed;
                        break;
                    case "crop":  
                        methodChoice=ImageService.imageMethod.Crop;
                        break;
                }
                imageService.process(id, processed_image, newFile, methodChoice, p, h, w, dimensional, protect, mark, image.ext);
            }

            // Read in the file into a byte array
            byte[] contents = null;
            try
            {
                contents = File.ReadAllBytes(HttpContext.Server.MapPath(uploadPath + id + arg + ".ext"));
            }
            catch (Exception ex)
            {
                log.Error("Error uploading file", ex);
            }

            Response.ClearContent();
            HttpContext.Response.ClearHeaders();
            String contentDisposition = "inline; filename=\"" + image.file_name + arg + "." + image.ext + "\"";

            Response.Clear();
            String contentType = "applicaton/image";
            switch (image.ext.ToLower())
            {
                case "gif":
                    contentType = "image/gif";
                    break;
                case "png":
                    contentType = "image/png";
                    break;
                case "jpg":
                case "jpe":
                case "jpeg":
                    contentType = "image/jpeg";
                    break;
                case "bmp":
                    contentType = "image/bmp";
                    break;
                case "tif":
                case "tiff":
                    contentType = "image/tiff";
                    break;
                case "eps":
                    contentType = "application/postscript";
                    break;
                default:
                    contentDisposition = "attachment; filename=\"" + image.file_name + arg + "." + image.ext + "\"";
                    contentType = "application/" + image.ext.ToLower();
                    break;
            }

            // Setup the response
            HttpContext.Response.Buffer = true;
            HttpContext.Response.AddHeader("Content-Length", contents.Length.ToString());
            DateTime dt = DateTime.Now.AddYears(1);
            HttpContext.Response.Cache.SetExpires(dt);
            HttpContext.Response.Cache.SetMaxAge(new TimeSpan(dt.ToFileTime()));
            HttpContext.Response.Cache.SetValidUntilExpires(true);
            HttpContext.Response.Cache.SetCacheability(HttpCacheability.Public);
            //HttpContext.Response.Expires = 0;
            Response.ContentType = contentType;
            //HttpContext.Response.AddHeader("Content-Disposition", "inline; filename=\"" + image.FileName + arg + "." + image.Ext + "\"");

            //set for cache controll
            if (maxage == 0){
                /*if (nocache)
                {*/

                //Context.Response.CacheControlHeader = "max-age=7257600";
                //Context.Response.AppendHeader("Cache-Control", "Max-age=7257600");
                
                    //Context.Response.AppendHeader("Cache-Control", "max-age=7257600");
                /*}
                else
                {
                    Context.Response.CacheControlHeader = "max-age = 7257600";
                }*/
            }else{
                Context.Response.CacheControlHeader = "max-age=" + maxage;
            }
            

            // Write the file to the response
            Response.BinaryWrite(contents);
            log.Info("Finished download for image id " + id + ", length: " + contents.Length.ToString() + " bytes");
            HttpContext.Response.End();
        }
        //private string GetFileName(HttpPostedFile file)
        //{
        //    int i = 0, j = 0;
        //    string filename;
        //    filename = file.FileName;
        //    do
        //    {
        //        i = filename.IndexOf(@"\", j + 1);
        //        if (i >= 0) j = i;
        //    } while (i >= 0);
        //    filename = filename.Substring(j + 1, filename.Length - j - 1);
        //    return filename;
        //}

        [Layout("browser")]
        public void Browser(string type)
        {
            PropertyBag["images"] = ActiveRecordBase<media_repo>.FindAll();
        }
    }
}
