#region Directives
    using System;
    using System.Collections;
    using System.Collections.Specialized;
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
    using System.Text;
    using campusMap.Services;
    using log4net;
    using log4net.Config;
    using Goheer.EXIF;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Linq; 
#endregion

namespace campusMap.Controllers
{
    [Layout("default")]
    public class mediaController : SecureBaseController
    {
        ILog log = log4net.LogManager.GetLogger("mediaController");

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





        public void _list(int page, int type, int pagesize)
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
            PropertyBag["places"] = ActiveRecordBase<place>.FindAll();
            PropertyBag["geometrics"] = ActiveRecordBase<geometrics>.FindAll();
            RenderView("listings");
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



        public void uploadFiles(IRequest request)
        {
            int i = 0;
            string json = "[";
           
            String tmp_path = getUploadsPath("image", true);
            foreach (String key in HttpContext.Current.Request.Files.Keys)
            {
                HttpPostedFile file = HttpContext.Current.Request.Files[key];

                string tmp_File = tmp_path + file.FileName;
                file.SaveAs(tmp_File);

                json += createNewFile(file, tmp_File);
                i = i + 1;
            }
            json += "]";
            HttpContext.Current.Response.Write(json);
            HttpContext.Current.Response.End();
        }





        public string createNewFile(HttpPostedFile file, String tmp_File)
        {
            media_repo media = new media_repo();

            


            String Fname = System.IO.Path.GetFileName(file.FileName);
            String[] fileparts = Fname.Split('.');
            if (String.IsNullOrEmpty(media.file_name))
            {
                media.file_name = fileparts[0];
            }

            int type = 3;
            int tmp = int.Parse(HttpContext.Current.Request.Form["mediatype[" + Fname + "]"]);
            if(tmp>0){
                type = tmp;
            }

            String caption = HttpContext.Current.Request.Form["caption[" + Fname + "]"];
            if (!String.IsNullOrEmpty(caption))
                media.caption = caption;
            String credit = HttpContext.Current.Request.Form["credit[" + Fname + "]"];
            if (!String.IsNullOrEmpty(credit))
                media.credit = credit;


            media.type = ActiveRecordBase<media_types>.Find(type);
            ActiveRecordMediator<media_repo>.Save(media);

            String newFile_path = getUploadsPath("image", true);
            String url = getUploadsURL("image", true);
            string newFilePath = newFile_path + media.id + ".ext";
            string FileName = media.id + ".ext";
            media.ext = fileparts[1];
            media.orientation = setOrientation(tmp_File);
            media = pushXMPdb(media,tmp_File);
            ActiveRecordMediator<media_repo>.Save(media);
            saveMedia(media, file , tmp_File);

            String pool = HttpContext.Current.Request.Form["pool[" + Fname + "]"];

            int item = 0;
                tmp = int.Parse(HttpContext.Current.Request.Form["pool_" + pool + "[" + Fname + "]"]);
            if (tmp > 0)
            {
                item = tmp;
            }

            if(item>0){
                applyMediaToObject(media, item, pool);
            }

           
            string mediaurl = "/media/download.castle?id=" + media.id + "&m=crop&w=148&h=100";
            String json = "{\"name\":\"" + file.FileName + 
                        "\",\"size\":" + file.ContentLength + 
                        ",\"url\":\"/media/download.castle?id=" + media.id + 
                        "\",\"thumbnail_url\":\"" + mediaurl + "\"}";


            return json;

            //logService.Log("Uploaded a file named " + file.FileName + " at " + uf.FullPath, "INFO", uf.Site);
        }
        public void saveMedia(media_repo media, HttpPostedFile file , string tmp_File)
        {
            if (file.ContentLength != 0)
            {
                // Make a copy of the stream to stop the destrustion of the gif animation per
                // http://stackoverflow.com/questions/8763630/c-sharp-gif-image-to-memorystream-and-back-lose-animation
                Stream stream = file.InputStream;
                MemoryStream memoryStream = new MemoryStream();
                CopyStream(stream, memoryStream);
                memoryStream.Position = 0;
                stream = memoryStream;

                //set up the image up from the stream
                //System.Drawing.Image processed_image = System.Drawing.Image.FromStream(newimage.InputStream);

                System.Drawing.Image processed_image = null;
                if (media.ext == "gif")
                {
                    //set up the image up from the stream
                    processed_image = System.Drawing.Image.FromStream(stream);//newimage.InputStream);
                }else{
                    processed_image = System.Drawing.Image.FromStream(file.InputStream);

                    if (imageService.isFileACMYKJpeg(processed_image) || imageService.isByteACMYK(stream))
                    {
                        Flash["error"] = "You have uploaded a CMYK image.  Please conver to RGB first.";
                        RedirectToReferrer();
                        return;
                    }
                }
                String path = getUploadsPath("image", true);
                string newFile = path + media.id + ".ext";


                String relavtivePath = getUploadsRelavtivePath("image", true);
                string newFileRelavtivePath = relavtivePath + media.id + ".ext";
                media.path = newFileRelavtivePath;
                //helperService.ResizeImage(newimage, uploadPath + image.id + ".ext", 1000, 1000, true);           
                imageService.process(media.id, processed_image, newFile, ImageService.imageMethod.Constrain, 0, 0, 1000, ImageService.Dimensions.Width, true, "", media.ext);
            }
            ActiveRecordMediator<media_repo>.Save(media);
            delete(tmp_File,false);
            //log.Info("Updating " + file.Filename + " at path " + fullpath);
        }
        public void applyMediaToObject(media_repo media, int id, string type)
        {
            switch (type)
            {
                case "place":
                    place place = ActiveRecordBase<place>.Find(id);
                    place.Images.Add(media);
                    place.Save();

                    /* add order here 
                    foreach (place_media si in place_media)
                    {
                        if (si.Media != null && si.Media.id > 0)
                        {
                            place_media find = ActiveRecordBase<place_media>.FindFirst(new ICriterion[] { Expression.Eq("media", si.Media), Expression.Eq("place", place) });
                            find.place_order = si.place_order;
                            ActiveRecordMediator<place_media>.Save(find);
                        }
                    }
                    */

                    // So this should be abstracted to the bottom where the place is a var and same with the id
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

                    break;
                case "geo":
                    geometrics geo = ActiveRecordBase<geometrics>.Find(id);
                    geo.Images.Add(media);
                    geo.Save();
                    break;
            }





        }
        /* START OF move to the service */
        /*
         * 
         * 
         * 
         */
        protected media_repo pushXMPdb(media_repo media, string pathToImageFile)
        {

           
            
            /*

            Bitmap bmp = new Bitmap(pathToImageFile);
            BitmapMetadata Mdata = (BitmapMetadata)bmp.Metadata;
            string date = md.DateTaken; 
            //object t = Mdata.GetQuery(@"/xmp/tiff:model");
            */


            return media;

        }






        private string setOrientation(string pathToImageFile)
        {
            
            //http://dotmac.rationalmind.net/2009/08/correct-photo-orientation-using-exif/
            // Rotate the image according to EXIF data
            Bitmap bmp = new Bitmap(pathToImageFile);
            EXIFextractor exif = new EXIFextractor(ref bmp, "\n"); // get source from http://www.codeproject.com/KB/graphics/exifextractor.aspx?fid=207371
            string values = "";
            foreach (System.Web.UI.Pair s in exif)
            {
                // Remember the data is returned 
                // in a Key,Value Pair object
                values += "  -  " + s.First + "  " + s.Second;
            }
            log.Info("setOrientation at path " + pathToImageFile + " with" + values);
            if (exif["Orientation"] != null)
            {
                RotateFlipType flip = OrientationToFlipType(int.Parse(exif["Orientation"].ToString()));
                if (flip != RotateFlipType.RotateNoneFlipNone) // don't flip of orientation is correct
                {
                    bmp.RotateFlip(flip);
                    exif.setTag(0x112, "1"); // Optional: reset orientation tag
                    bmp.Save(pathToImageFile, ImageFormat.Jpeg);
                }
            }
            String or = null;
            if (exif["Image Width"] != null && exif["Image Height"] != null)
            {
                or = int.Parse(exif["Image Width"].ToString()) > int.Parse(exif["Image Height"].ToString()) ? "h" : "v";
            }
            if (String.IsNullOrEmpty(or))
            {
                System.Drawing.Image img = System.Drawing.Image.FromFile(pathToImageFile);
                int width = img.Width;
                int height = img.Height;
                or = width > height ? "h" : "v";
                log.Info("exif was null so W:" + width + " & H:" + height + "  --- producing:" + or);
            }
            return or;
        }
        private static RotateFlipType OrientationToFlipType(int orientation)
        {
            switch (orientation)
            {
                case 1:
                    return RotateFlipType.RotateNoneFlipNone;
                    break;
                case 2:
                    return RotateFlipType.RotateNoneFlipX;
                    break;
                case 3:
                    return RotateFlipType.Rotate180FlipNone;
                    break;
                case 4:
                    return RotateFlipType.Rotate180FlipX;
                    break;
                case 5:
                    return RotateFlipType.Rotate90FlipX;
                    break;
                case 6:
                    return RotateFlipType.Rotate90FlipNone;
                    break;
                case 7:
                    return RotateFlipType.Rotate270FlipX;
                    break;
                case 8:
                    return RotateFlipType.Rotate270FlipNone;
                    break;
                default:
                    return RotateFlipType.RotateNoneFlipNone;
            }
        }
        /* END OF move to the service */




/* note : below is the start of a php conversion from php THIS IS PROBABLY THE WAY TO GO BUT WE ARE GOING TO CHEAT AND USE THE SIMPLE VERSION ATM */
        public void massUpload(
            [ARDataBind("image", Validate = true, AutoLoad = AutoLoadBehavior.NewRootInstanceIfInvalidKey)] media_repo image,
            HttpPostedFile newimage,
            int place_id,
            bool ajax
            ){

                switch (Request.HttpMethod) {
                    case "OPTIONS":
                        break;
                    case "HEAD":
                    case "GET":
                        get_files();
                        break;
                    case "POST":
                        if (Request.HttpMethod != null && Request.HttpMethod == "DELETE") {
                           // $upload_handler->delete();
                        } else {
                            //$upload_handler->post();
                        }
                        break;
                    case "DELETE":
                        //$upload_handler->delete();
                        break;
                    default:
                        Response.StatusCode = 405;
                        //Response.ContentType = "application/json; charset=UTF-8";
                        //header('HTTP/1.1 405 Method Not Allowed');
                        break;
                }

        }
        
        protected string getUploadsURL(string mediaType,bool usetemp){
            if(String.IsNullOrEmpty(mediaType))mediaType="image";
            String Url = getRootUrl();
                if (!Url.EndsWith("\\"))
                    Url += "\\";
                    Url += @"uploads\media\"+mediaType+@"\";
                    if(usetemp)Url += @"tmp\";
            return Url;
        }
        protected string getUploadsPath(string mediaType,bool usetemp){

            if(String.IsNullOrEmpty(mediaType))mediaType="image";

            String path = Context.ApplicationPhysicalPath;
                if (!path.EndsWith("\\"))
                    path += "\\";
                    path += @"uploads\media\"+mediaType+@"\";
                    if(usetemp)path += @"tmp\";

                if (!HelperService.DirExists(path)){
                    System.IO.Directory.CreateDirectory(path);
                }
            return path;
        }
        protected string getUploadsRelavtivePath(string mediaType,bool usetemp){
            String path = getUploadsPath(mediaType,usetemp);
            String directory = Context.ApplicationPhysicalPath;
            path = path.Replace(directory, "");
                if (!path.StartsWith("\\"))
                    path = "\\" + path;
                if (!HelperService.DirExists(path)){
                    System.IO.Directory.CreateDirectory(path);
                }
            return path;
        }

        public void get_files() {
            String info = "";
            String file_name = !String.IsNullOrEmpty(Request.Params["file"]) ? Path.GetFileName(Request.Params["file"]) : null;
            if (String.IsNullOrEmpty(file_name)) {
                info = get_file_objects();
            } else {
                info = get_file_object(file_name);
            }
            Response.ContentType = "application/json; charset=UTF-8";
            RenderText(info);
        }


        protected String get_file_objects() {
            String path = getUploadsPath("image",true);
            String info = "";

           /* return array_values(array_filter(array_map(
                array($this, 'get_file_object'),
                scandir($this->options['upload_dir'])
            )));*/
            return info;
        }

        protected String get_file_object(String file_name) {

            String file = "";
            String path = getUploadsPath("image",true);

            String file_path = path+file_name;
            if (File.Exists(file_path) && file_path[0]!='.') {

                file = "{";
                file = @"""name"":"""+file_name+@""",";
                file = @"""size"":""" + new System.IO.FileInfo(file_path).Length + @""",";
                file = @"""url"":""" + "" + @"""";//$this->options['upload_url'].rawurlencode($file->name);
                /*foreach($this->options['image_versions'] as $version => $options) {
                    if (is_file($options['upload_dir'].$file_name)) {
                        $file->{$version.'_url'} = $options['upload_url']
                            .rawurlencode($file->name);
                    }
                }*/
                //$this->set_file_delete_url($file); // this is a deletion url

                file = "}";

                return file;
            }
            return file;
        }
        /*protected set_file_delete_url($file) {
            $file->delete_url = $this->options['script_url']
                .'?file='.rawurlencode($file->name);
            $file->delete_type = $this->options['delete_type'];
            if ($file->delete_type !== 'DELETE') {
                $file->delete_url .= '&_method=DELETE';
            }
        }*/





    public void post() {
        if (Request.Params["_method"] != null && Request.Params["_method"] == "DELETE") {
            delete(null,true);
        }

        HttpFileCollection upload = HttpContext.Current.Request.Files;
        //info = array();
        String info = "";
        if (upload != null) {

            foreach (HttpPostedFile file in Request.Files) {
                string extension = System.IO.Path.GetExtension(file.FileName);
            }
            // param_name is an array identifier like "files[]",
            // $_FILES is a multi-dimensional array:
            /*foreach ($upload['tmp_name'] as $index => $value) {
                $info[] = $this->handle_file_upload(
                    $upload['tmp_name'][$index],
                    isset($_SERVER['HTTP_X_FILE_NAME']) ? $_SERVER['HTTP_X_FILE_NAME'] : $upload['name'][$index],
                    isset($_SERVER['HTTP_X_FILE_SIZE']) ? $_SERVER['HTTP_X_FILE_SIZE'] : $upload['size'][$index],
                    isset($_SERVER['HTTP_X_FILE_TYPE']) ? $_SERVER['HTTP_X_FILE_TYPE'] : $upload['type'][$index],
                    $upload['error'][$index],
                    $index
                );
            }*/
        } else if (upload != null || HttpContext.Current.Request.ServerVariables["HTTP_X_FILE_NAME"]!=null) {
            // param_name is a single object identifier like "file",
            // $_FILES is a one-dimensional array:
            /*$info[] = handle_file_upload(
                isset($upload['tmp_name']) ? $upload['tmp_name'] : null,
                isset($_SERVER['HTTP_X_FILE_NAME']) ? $_SERVER['HTTP_X_FILE_NAME'] : (isset($upload['name']) ? $upload['name'] : null),
                isset($_SERVER['HTTP_X_FILE_SIZE']) ? $_SERVER['HTTP_X_FILE_SIZE'] : (isset($upload['size']) ? $upload['size'] : null),
                isset($_SERVER['HTTP_X_FILE_TYPE']) ? $_SERVER['HTTP_X_FILE_TYPE'] : (isset($upload['type']) ? $upload['type'] : null),
                isset($upload['error']) ? $upload['error'] : null
            );*/
        }
        Response.AppendHeader("Vary", "Accept");
        string json = "{"+info+"}";
        String _redirect = Request.Params["redirect"]!=null ? Request.Params["redirect"].TrimEnd('/') : null;
        if (!String.IsNullOrEmpty(_redirect)) {
            Dictionary<string, string> param = new Dictionary<string, string>();
            param.Add("json", json);
            Response.RedirectToUrl(_redirect,param);
        }
        String accept = HttpContext.Current.Request.ServerVariables["HTTP_ACCEPT"];
        if (!String.IsNullOrEmpty(accept) && (accept.Contains("application/json") != false)) {
            Response.ContentType = "application/json; charset=UTF-8";
        } else {
            Response.ContentType = "text/plain";
        }
        RenderText(json);
    }

    public void delete(string file_path, bool retrunJson) {
        if(String.IsNullOrEmpty(file_path)){
            String file_name = !String.IsNullOrEmpty(Request.Params["file"]) ? Path.GetFileName(Request.Params["file"]) : null;
            String path = getUploadsPath("image",true);
            file_path = path+file_name;
        }
        bool success = false;
        if (File.Exists(file_path) && file_path[0]!='.') {
            File.Delete(file_path);
            if (!File.Exists(file_path)) {
                success = true;
            }
        }
        if (success) {
            /*foreach($this->options['image_versions'] as $version => $options) {
                String file_path = path+file_name;
                if (File.Exists(file)) {
                    unlink($file);
                }
            }*/
        }
        string txt = "";
        if (retrunJson)
        {
            txt = "{" + success + "}";
            Response.ContentType = "application/json; charset=UTF-8";
        }
        RenderText(txt);
    }
/*
    protected function handle_file_upload($uploaded_file, $name, $size, $type, $error, $index) {
        $file = new stdClass();
        $file->name = $this->trim_file_name($name, $type, $index);
        $file->size = intval($size);
        $file->type = $type;
        if ($this->validate($uploaded_file, $file, $error, $index)) {
            $this->handle_form_data($file, $index);
            $file_path = $this->options['upload_dir'].$file->name;
            $append_file = !$this->options['discard_aborted_uploads'] &&
                is_file($file_path) && $file->size > filesize($file_path);
            clearstatcache();
            if ($uploaded_file && is_uploaded_file($uploaded_file)) {
                // multipart/formdata uploads (POST method uploads)
                if ($append_file) {
                    file_put_contents(
                        $file_path,
                        fopen($uploaded_file, 'r'),
                        FILE_APPEND
                    );
                } else {
                    move_uploaded_file($uploaded_file, $file_path);
                }
            } else {
                // Non-multipart uploads (PUT method support)
                file_put_contents(
                    $file_path,
                    fopen('php://input', 'r'),
                    $append_file ? FILE_APPEND : 0
                );
            }
            $file_size = filesize($file_path);
            if ($file_size === $file->size) {
            	if ($this->options['orient_image']) {
            		$this->orient_image($file_path);
            	}
                $file->url = $this->options['upload_url'].rawurlencode($file->name);
                foreach($this->options['image_versions'] as $version => $options) {
                    if ($this->create_scaled_image($file->name, $options)) {
                        if ($this->options['upload_dir'] !== $options['upload_dir']) {
                            $file->{$version.'_url'} = $options['upload_url']
                                .rawurlencode($file->name);
                        } else {
                            clearstatcache();
                            $file_size = filesize($file_path);
                        }
                    }
                }
            } else if ($this->options['discard_aborted_uploads']) {
                unlink($file_path);
                $file->error = 'abort';
            }
            $file->size = $file_size;
            $this->set_file_delete_url($file);
        }
        return $file;
    }



        */

/* end of the php conversion */



















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
                String uploadPath = Context.ApplicationPhysicalPath;
                if(!uploadPath.EndsWith("\\"))
                    uploadPath+="\\";
                uploadPath += @"uploads\";

                if (place_id != 0)
                {
                    uploadPath += @"place\" + place_id + @"\";
                }
                if (!HelperService.DirExists(uploadPath))
                {
                    System.IO.Directory.CreateDirectory(uploadPath);
                }
                string newFile = uploadPath + image.id + ".ext";
                log.Info("uploadfilename: " + newFile);
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

        public void getmap(string path)
        {
            // Read in the file into a byte array
            byte[] contents = null;

            String cachePath = Context.ApplicationPhysicalPath;
            if (!cachePath.EndsWith("\\"))
                cachePath += "\\";
                cachePath += path.TrimStart('\\');

            try
            {
                contents = File.ReadAllBytes(cachePath);
            }
            catch (Exception ex)
            {
                log.Error("Error uploading file", ex);
            }

            HttpContext.Response.ClearContent();
            HttpContext.Response.ClearHeaders();
            if (contents != null)
            {
                String contentDisposition = "inline; filename=\"" + path + "\"";

                Response.Clear();
                String contentType = "image/gif";

                // Setup the response
                HttpContext.Response.Buffer = true;
                HttpContext.Response.AddHeader("Content-Length", contents.Length.ToString());
                DateTime dt = DateTime.Now.AddYears(1);
                HttpContext.Response.Cache.SetExpires(dt);
                HttpContext.Response.Cache.SetMaxAge(new TimeSpan(dt.ToFileTime()));
                HttpContext.Response.Cache.SetValidUntilExpires(true);
                HttpContext.Response.Cache.SetCacheability(HttpCacheability.Public);
                //HttpContext.Response.Expires = 0;
                HttpContext.Response.ContentType = contentType;
                //HttpContext.Response.AddHeader("Content-Disposition", "inline; filename=\"" + path + "\"");

                int maxage = 0;

                //set for cache controll
                if (maxage == 0)
                {
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
                }
                else
                {
                    HttpContext.Response.Cache.SetMaxAge(new TimeSpan(84, 0, 0, 0, 0));
                }
                // Write the file to the response
                HttpContext.Response.BinaryWrite(contents);
                //log.Info("Finished download for image id " + id + ", length: " + contents.Length.ToString() + " bytes");
            }
            HttpContext.Response.End();
        }


        // h = height , w = width , p = percent, m = method , protect= stop sizing up of image, pre = prefix to image name 
        [SkipFilter]
        public void Download(int id, int placeid, int w, int h, int p, string m, bool protect, string pre, string mark, int maxage, bool nocache, bool mug)
        {
            log.Info("Starting download for image id " + id);
            media_repo image = ActiveRecordBase<media_repo>.Find(id);
            string uploadPath = "";

            if (image.path != null)
            {
                uploadPath = image.path;
                String fullpath = id + ".ext";
                uploadPath = Regex.Replace(uploadPath, "(.*)(\\\\.*?)(.*)", "$1");
                if (!uploadPath.EndsWith("\\"))
                    uploadPath += "\\";
            }else{
                // build the path for the new image
                uploadPath = Context.ApplicationPath + @"\uploads\";
                if (mug)
                {
                    uploadPath += @"mugshots\";
                }

                /**/
                if (placeid != 0)
                {
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

            HttpContext.Response.ClearContent();
            HttpContext.Response.ClearHeaders();
            String contentDisposition = "inline; filename=\"" + image.file_name + arg + "." + image.ext + "\"";

            HttpContext.Response.Clear();
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
            HttpContext.Response.ContentType = contentType;
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
                HttpContext.Response.Cache.SetMaxAge(new TimeSpan(84,0,0,0,0));
            }
            

            // Write the file to the response
            HttpContext.Response.BinaryWrite(contents);
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
