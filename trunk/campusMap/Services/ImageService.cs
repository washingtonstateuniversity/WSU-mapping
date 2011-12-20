#region Directives
    using System;
    using System.Data;
    using System.Configuration;
    using campusMap.Models;
    using NHibernate.Expression;
    using System.Collections.Generic;
    using Castle.ActiveRecord;
    using System.Net;
    using System.Text.RegularExpressions;
    using System.IO;
    using System.Web;
    using MonoRailHelper;
    using System.Xml;
    using System.Drawing;
    using System.Drawing.Imaging;
    using System.Drawing.Drawing2D;
    using System.Collections.Specialized;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Utilities;
    using Newtonsoft.Json.Linq;
    using campusMap.Services;
    using log4net;
    using log4net.Config;
#endregion

namespace campusMap.Services
{
    public class ImageService
	{
        private static ILog log = log4net.LogManager.GetLogger("ImageService");

		public enum Dimensions 
		{
			Width,
			Height
		}
        public enum AnchorPosition
		{
			Top,
			Center,
			Bottom,
			Left,
			Right
		}
        public enum imageMethod
        {
            Percent,
            Constrain,
            Fixed,
            Crop
        }

        public void saveIamge(int id, string NewFile, Image imgPhoto)
        {
            //log.Info("saving photo to filepath: " + NewFile);
            // create a writer and open the file
            campusMap.Services.LogService.writelog(" in saveIamge " + NewFile);


            imgPhoto.Save(NewFile);
            //compress the file
            smushit(id, NewFile, GetMimeType(imgPhoto));
            imgPhoto.Dispose();
        }
        public void deleteTmpIamges(string image_path)
        {
            //log.Info("saving photo to filepath: " + NewFile);
            // create a writer and open the file
            campusMap.Services.LogService.writelog("Deleting Images: " + image_path);
            File.Delete(image_path);
        }
        public void process(int id, Image OriginalFile, string NewFile, imageMethod method, int percent, int height, int width, Dimensions dimensions, bool protect, string mark)
		{
            /* example usage
            imgPhoto = ScaleByPercent(imgPhotoVert, 50);
            imgPhoto = ConstrainProportions(imgPhotoVert, 200, Dimensions.Width);
            imgPhoto = FixedSize(imgPhotoVert, 200, 200);
            imgPhoto = Crop(imgPhotoVert, 200, 200, AnchorPosition.Center);
            imgPhoto = Crop(imgPhotoHoriz, 200, 200, AnchorPosition.Center);
            */

            // Prevent using images internal thumbnail
            OriginalFile.RotateFlip(System.Drawing.RotateFlipType.Rotate180FlipNone);
            OriginalFile.RotateFlip(System.Drawing.RotateFlipType.Rotate180FlipNone);

			Image imgPhoto = null;
            ImageFormat type = get_image_type(OriginalFile);


            //check to see if the image need protection from sizing up
            if (protect && !protectSize(OriginalFile, width, height, true))
            {
                saveIamge(id, NewFile, OriginalFile); // save image
                return;
            }
            campusMap.Services.LogService.writelog(" in process pre size" + NewFile);
            switch (method)
            {
                case imageMethod.Percent: imgPhoto = ScaleByPercent(OriginalFile, percent); break;

                case imageMethod.Constrain: imgPhoto = ConstrainProportions(OriginalFile, width != 0 ? width : height, dimensions); break;

                case imageMethod.Fixed: imgPhoto = FixedSize(OriginalFile, width, height); break;

                case imageMethod.Crop: imgPhoto = Crop(OriginalFile, width, height, AnchorPosition.Center); break;
            }
            if(!String.IsNullOrEmpty(mark)){
                imgPhoto=watermakerIt(imgPhoto,id,mark);
            }
            
            campusMap.Services.LogService.writelog(" in process postsize" + NewFile);

            saveIamge(id, NewFile, imgPhoto); // save image
        }

        #region GET MIME TYPEs as needed
        public static string GetMimeType(Image i)
        {
            Guid imgguid = i.RawFormat.Guid;
            foreach (ImageCodecInfo codec in ImageCodecInfo.GetImageDecoders())
            {
                if (codec.FormatID == imgguid)
                    return codec.MimeType;
            }
            return "image/unknown";
        }
        public static string mimeFinder(string ext)
        {
            String contentType = "applicaton/image";
            switch (ext.ToLower())
            {
                case "gif":
                    contentType = "image/gif";
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
                    contentType = "application/" + ext.ToLower();
                    break;
            }
            return contentType;
        }
        static ImageFormat get_image_type(Image imgPhoto)
        {
            ImageFormat imageFormat = imgPhoto.RawFormat;
            if (imgPhoto.RawFormat.Equals(System.Drawing.Imaging.ImageFormat.Jpeg))
            {
                return ImageFormat.Jpeg;
            }
            else if (imgPhoto.RawFormat.Equals(System.Drawing.Imaging.ImageFormat.Png))
            {
                return ImageFormat.Png;
            }
            else if (imgPhoto.RawFormat.Equals(System.Drawing.Imaging.ImageFormat.Gif))
            {
                return ImageFormat.Gif;
            }
            else if (imgPhoto.RawFormat.Equals(System.Drawing.Imaging.ImageFormat.Tiff))
            {
                return ImageFormat.Tiff;
            }
            else if (imgPhoto.RawFormat.Equals(System.Drawing.Imaging.ImageFormat.Bmp))
            {
                return ImageFormat.Bmp;
            }
            return null;
        }
        #endregion

        #region Image sizing routins
        static Boolean protectSize(Image OriginalFile, int MaxWidth, int MaxHeight, bool onBoth)
        {
            if ((OriginalFile.Height <= MaxWidth && OriginalFile.Width <= MaxWidth) && onBoth)
            {
                return false;
            }
            if (OriginalFile.Height <= MaxWidth)
            {
                return false;
            }
            if (OriginalFile.Width <= MaxWidth)
            {
                return false;
            }
            return true;
        }
        static Image ScaleByPercent(Image imgPhoto, int Percent)
		{
			float nPercent = ((float)Percent/100);

			int sourceWidth = imgPhoto.Width;
			int sourceHeight = imgPhoto.Height;
			int sourceX = 0;
			int sourceY = 0;

			int destX = 0;
			int destY = 0; 
			int destWidth  = (int)(sourceWidth * nPercent);
			int destHeight = (int)(sourceHeight * nPercent);

			Bitmap bmPhoto = new Bitmap(destWidth, destHeight, PixelFormat.Format24bppRgb);
			bmPhoto.SetResolution(imgPhoto.HorizontalResolution, imgPhoto.VerticalResolution);

			Graphics grPhoto = Graphics.FromImage(bmPhoto);
			grPhoto.InterpolationMode = InterpolationMode.HighQualityBicubic;

			grPhoto.DrawImage(imgPhoto, 
				new Rectangle(destX,destY,destWidth,destHeight),
				new Rectangle(sourceX,sourceY,sourceWidth,sourceHeight),
				GraphicsUnit.Pixel);

			grPhoto.Dispose();
			return bmPhoto;
		}
		static Image ConstrainProportions(Image imgPhoto, int Size, Dimensions Dimension)
		{
            campusMap.Services.LogService.writelog(" in ConstrainProportions ");
			int sourceWidth = imgPhoto.Width;
			int sourceHeight = imgPhoto.Height;
			int sourceX = 0;
			int sourceY = 0;
			int destX = 0;
			int destY = 0; 
			float nPercent = 0;

			switch(Dimension)
			{
				case Dimensions.Width:
					nPercent = ((float)Size/(float)sourceWidth);
					break;
				default:
					nPercent = ((float)Size/(float)sourceHeight);
					break;
			}
				
			int destWidth  = (int)(sourceWidth * nPercent);
			int destHeight = (int)(sourceHeight * nPercent);

			Bitmap bmPhoto = new Bitmap(destWidth, destHeight, PixelFormat.Format24bppRgb);
			bmPhoto.SetResolution(imgPhoto.HorizontalResolution, imgPhoto.VerticalResolution);

			Graphics grPhoto = Graphics.FromImage(bmPhoto);
			grPhoto.InterpolationMode = InterpolationMode.HighQualityBicubic;
            campusMap.Services.LogService.writelog(" in ConstrainProportions mid drawing:" );
			grPhoto.DrawImage(imgPhoto, new Rectangle(destX,destY,destWidth,destHeight),new Rectangle(sourceX,sourceY,sourceWidth,sourceHeight),GraphicsUnit.Pixel);
            campusMap.Services.LogService.writelog(" in ConstrainProportions before Dispose");
			//grPhoto.Dispose();
			return bmPhoto;
            
		}
		static Image FixedSize(Image imgPhoto, int Width, int Height)
		{
			int sourceWidth = imgPhoto.Width;
			int sourceHeight = imgPhoto.Height;
			int sourceX = 0;
			int sourceY = 0;
			int destX = 0;
			int destY = 0; 

			float nPercent = 0;
			float nPercentW = 0;
			float nPercentH = 0;

			nPercentW = ((float)Width/(float)sourceWidth);
			nPercentH = ((float)Height/(float)sourceHeight);

			//if we have to pad the height pad both the top and the bottom
			//with the difference between the scaled height and the desired height
			if(nPercentH < nPercentW)
			{
				nPercent = nPercentH;
				destX = (int)((Width - (sourceWidth * nPercent))/2);
			}
			else
			{
				nPercent = nPercentW;
				destY = (int)((Height - (sourceHeight * nPercent))/2);
			}
		
			int destWidth  = (int)(sourceWidth * nPercent);
			int destHeight = (int)(sourceHeight * nPercent);

			Bitmap bmPhoto = new Bitmap(Width, Height, PixelFormat.Format24bppRgb);
			bmPhoto.SetResolution(imgPhoto.HorizontalResolution, imgPhoto.VerticalResolution);

			Graphics grPhoto = Graphics.FromImage(bmPhoto);
			grPhoto.Clear(Color.Red);
			grPhoto.InterpolationMode = InterpolationMode.HighQualityBicubic;

			grPhoto.DrawImage(imgPhoto, 
				new Rectangle(destX,destY,destWidth,destHeight),
				new Rectangle(sourceX,sourceY,sourceWidth,sourceHeight),
				GraphicsUnit.Pixel);

			grPhoto.Dispose();
			return bmPhoto;
		}
		static Image Crop(Image imgPhoto, int Width, int Height, AnchorPosition Anchor)
		{
			int sourceWidth = imgPhoto.Width;
			int sourceHeight = imgPhoto.Height;
			int sourceX = 0;
			int sourceY = 0;
			int destX = 0;
			int destY = 0;

			float nPercent = 0;
			float nPercentW = 0;
			float nPercentH = 0;

			nPercentW = ((float)Width/(float)sourceWidth);
			nPercentH = ((float)Height/(float)sourceHeight);

			if(nPercentH < nPercentW)
			{
				nPercent = nPercentW;
				switch(Anchor)
				{
					case AnchorPosition.Top:
						destY = 0;
						break;
					case AnchorPosition.Bottom:
						destY = (int)(Height - (sourceHeight * nPercent));
						break;
					default:
						destY = (int)((Height - (sourceHeight * nPercent))/2);
						break;
				}				
			}
			else
			{
				nPercent = nPercentH;
				switch(Anchor)
				{
					case AnchorPosition.Left:
						destX = 0;
						break;
					case AnchorPosition.Right:
						destX = (int)(Width - (sourceWidth * nPercent));
						break;
					default:
						destX = (int)((Width - (sourceWidth * nPercent))/2);
						break;
				}			
			}

			int destWidth  = (int)(sourceWidth * nPercent);
			int destHeight = (int)(sourceHeight * nPercent);

			Bitmap bmPhoto = new Bitmap(Width, Height, PixelFormat.Format24bppRgb);
			bmPhoto.SetResolution(imgPhoto.HorizontalResolution, imgPhoto.VerticalResolution);

			Graphics grPhoto = Graphics.FromImage(bmPhoto);
			grPhoto.InterpolationMode = InterpolationMode.HighQualityBicubic;

			grPhoto.DrawImage(imgPhoto, 
				new Rectangle(destX,destY,destWidth,destHeight),
				new Rectangle(sourceX,sourceY,sourceWidth,sourceHeight),
				GraphicsUnit.Pixel);

			grPhoto.Dispose();
			return bmPhoto;
        }


        static Image watermakerIt(Image imgPhoto, int img_id, string mark)
        {

            //create a image object containing the photograph to watermark
            int phWidth = imgPhoto.Width;
            int phHeight = imgPhoto.Height;

            //create a Bitmap the Size of the original photograph
            Bitmap bmPhoto = new Bitmap(phWidth, phHeight, PixelFormat.Format24bppRgb);

            bmPhoto.SetResolution(imgPhoto.HorizontalResolution, imgPhoto.VerticalResolution);

            //load the Bitmap into a Graphics object 
            Graphics grPhoto = Graphics.FromImage(bmPhoto);

            /*//create a image object containing the watermark
            String tmpPath = AppDomain.CurrentDomain.BaseDirectory + @"tmp_images\";

            if (!HelperService.DirExists(tmpPath))
            {
                System.IO.Directory.CreateDirectory(tmpPath);
            }
            string tmpImg = tmpPath + img_id + "watermark.bmp";

            Image imgWatermark = new Bitmap(tmpImg,);
            int wmWidth = imgWatermark.Width;
            int wmHeight = imgWatermark.Height;*/

            //------------------------------------------------------------
            //Step #1 - Insert Copyright message
            //------------------------------------------------------------

            //Set the rendering quality for this Graphics object
            grPhoto.SmoothingMode = SmoothingMode.AntiAlias;

            //Draws the photo Image object at original size to the graphics object.
            grPhoto.DrawImage(
                imgPhoto,                               // Photo Image object
                new Rectangle(0, 0, phWidth, phHeight), // Rectangle structure
                0,                                      // x-coordinate of the portion of the source image to draw. 
                0,                                      // y-coordinate of the portion of the source image to draw. 
                phWidth,                                // Width of the portion of the source image to draw. 
                phHeight,                               // Height of the portion of the source image to draw. 
                GraphicsUnit.Pixel);                    // Units of measure 

            //-------------------------------------------------------
            //to maximize the size of the Copyright message we will 
            //test multiple Font sizes to determine the largest posible 
            //font we can use for the width of the Photograph
            //define an array of point sizes you would like to consider as possiblities
            //-------------------------------------------------------
            int[] sizes = new int[] { 16, 14, 12, 10, 8, 6, 4 };

            Font crFont = null;
            SizeF crSize = new SizeF();

            //Loop through the defined sizes checking the length of the Copyright string
            //If its length in pixles is less then the image width choose this Font size.
            for (int i = 0; i < 7; i++)
            {
                //set a Font object to Arial (i)pt, Bold
                crFont = new Font("arial", sizes[i], FontStyle.Bold);
                //Measure the Copyright string in this Font
                crSize = grPhoto.MeasureString(mark, crFont);

                if ((ushort)crSize.Width < (ushort)phWidth)
                    break;
            }

            //Since all photographs will have varying heights, determine a 
            //position 5% from the bottom of the image
            int yPixlesFromBottom = (int)(phHeight * .05);

            //Now that we have a point size use the Copyrights string height 
            //to determine a y-coordinate to draw the string of the photograph
            float yPosFromBottom = (phHeight / 2);//ok I want it in the middle for now ((phHeight - yPixlesFromBottom) - (crSize.Height / 2));

            //Determine its x-coordinate by calculating the center of the width of the image
            float xCenterOfImg = (phWidth / 2);

            //Define the text layout by setting the text alignment to centered
            StringFormat StrFormat = new StringFormat();
            StrFormat.Alignment = StringAlignment.Center;

            //define a Brush which is semi trasparent black (Alpha set to 153)
            SolidBrush semiTransBrush2 = new SolidBrush(Color.FromArgb(225, 0, 0, 0));

            //Draw the Copyright string
            grPhoto.DrawString(mark,                 //string of text
                crFont,                                   //font
                semiTransBrush2,                           //Brush
                new PointF(xCenterOfImg + 1, yPosFromBottom + 1),  //Position
                StrFormat);

            //define a Brush which is semi trasparent white (Alpha set to 153)
            SolidBrush semiTransBrush = new SolidBrush(Color.FromArgb(225, 255, 255, 255));

            //Draw the Copyright string a second time to create a shadow effect
            //Make sure to move this text 1 pixel to the right and down 1 pixel
            grPhoto.DrawString(mark,                 //string of text
                crFont,                                   //font
                semiTransBrush,                           //Brush
                new PointF(xCenterOfImg, yPosFromBottom),  //Position
                StrFormat);                               //Text alignment



            /*//------------------------------------------------------------
            //Step #2 - Insert Watermark image
            //------------------------------------------------------------

            //Create a Bitmap based on the previously modified photograph Bitmap
            Bitmap bmWatermark = new Bitmap(bmPhoto);
            bmWatermark.SetResolution(imgPhoto.HorizontalResolution, imgPhoto.VerticalResolution);
            //Load this Bitmap into a new Graphic Object
            Graphics grWatermark = Graphics.FromImage(bmWatermark);

            //To achieve a transulcent watermark we will apply (2) color 
            //manipulations by defineing a ImageAttributes object and 
            //seting (2) of its properties.
            ImageAttributes imageAttributes = new ImageAttributes();

            //The first step in manipulating the watermark image is to replace 
            //the background color with one that is trasparent (Alpha=0, R=0, G=0, B=0)
            //to do this we will use a Colormap and use this to define a RemapTable
            ColorMap colorMap = new ColorMap();

            //My watermark was defined with a background of 100% Green this will
            //be the color we search for and replace with transparency
            colorMap.OldColor = Color.FromArgb(255, 0, 255, 0);
            colorMap.NewColor = Color.FromArgb(0, 0, 0, 0);

            ColorMap[] remapTable = { colorMap };

            imageAttributes.SetRemapTable(remapTable, ColorAdjustType.Bitmap);

            //The second color manipulation is used to change the opacity of the 
            //watermark.  This is done by applying a 5x5 matrix that contains the 
            //coordinates for the RGBA space.  By setting the 3rd row and 3rd column 
            //to 0.3f we achive a level of opacity
            float[][] colorMatrixElements = { 
												new float[] {1.0f,  0.0f,  0.0f,  0.0f, 0.0f},       
												new float[] {0.0f,  1.0f,  0.0f,  0.0f, 0.0f},        
												new float[] {0.0f,  0.0f,  1.0f,  0.0f, 0.0f},        
												new float[] {0.0f,  0.0f,  0.0f,  0.3f, 0.0f},        
												new float[] {0.0f,  0.0f,  0.0f,  0.0f, 1.0f}};
            ColorMatrix wmColorMatrix = new ColorMatrix(colorMatrixElements);

            imageAttributes.SetColorMatrix(wmColorMatrix, ColorMatrixFlag.Default,
                ColorAdjustType.Bitmap);

            //For this example we will place the watermark in the upper right
            //hand corner of the photograph. offset down 10 pixels and to the 
            //left 10 pixles

            int xPosOfWm = ((phWidth - wmWidth) - 10);
            int yPosOfWm = 10;

            grWatermark.DrawImage(imgWatermark,
                new Rectangle(xPosOfWm, yPosOfWm, wmWidth, wmHeight),  //Set the detination Position
                0,                  // x-coordinate of the portion of the source image to draw. 
                0,                  // y-coordinate of the portion of the source image to draw. 
                wmWidth,            // Watermark Width
                wmHeight,		    // Watermark Height
                GraphicsUnit.Pixel, // Unit of measurment
                imageAttributes);   //ImageAttributes Object

            //Replace the original photgraphs bitmap with the new Bitmap*/
            imgPhoto = bmPhoto;
            grPhoto.Dispose();
            //grWatermark.Dispose();

            //save new image to file system.
            //imgPhoto.Save(WorkingDirectory + "\\watermark_final.jpg", ImageFormat.Jpeg);
            //imgPhoto.Dispose();

            return imgPhoto;
            /*imgWatermark.Dispose();*/


        }



        #endregion

        public bool smushit(int id, string image_name, String mimeType){
            // sent file to yahoo
            string url = "http://www.smushit.com/ysmush.it/ws.php?";// "http://www.smushit.com/ysmush.it/ws.php?";

            //reset the .ext file name
            media_repo image = ActiveRecordBase<media_repo>.Find(id);

            string orgFile=image_name;
            image_name = Regex.Replace(image_name, ".ext", "."+image.ext, RegexOptions.IgnoreCase);

            File.Copy(orgFile,image_name, true);

            NameValueCollection nvc = new NameValueCollection();
            //nvc.Add("id", "TTR");
            //nvc.Add("btn-submit-photo", "Upload");
            String responseData = HttpUploadFile(url, image_name, "files", mimeFinder(image.ext), nvc);
           
            JObject obj = JObject.Parse(responseData);
            string yurl = (string)obj["dest"]; // what is the path?
            if (!String.IsNullOrEmpty(yurl))
            {
                byte[] imagebytes = DownloadBinary(yurl);
                ByteArrayToFile(image_name, imagebytes);
                File.Copy(image_name, orgFile, true);// overwirte the .ext with the new file.
                //File.Delete(image_name);
                deleteTmpIamges(image_name);
                return true;
            }
            else
            {
                return false;
            }
        }

        #region HTTP handlers
        /// <summary>
        /// Function to save byte array to a file
        /// </summary>
        /// <param name="_FileName">File name to save byte array</param>
        /// <param name="_ByteArray">Byte array to save to external file</param>
        /// <returns>Return true if byte array save successfully, if not return false</returns>
        public bool ByteArrayToFile(string _FileName, byte[] _ByteArray)
        {
            try
            {
                // Open file for reading
                System.IO.FileStream _FileStream = new System.IO.FileStream(_FileName, System.IO.FileMode.Create, System.IO.FileAccess.Write);

                // Writes a block of bytes to this stream using data from a byte array.
                _FileStream.Write(_ByteArray, 0, _ByteArray.Length);

                // close file stream
                _FileStream.Close();

                return true;
            }
            catch (Exception _Exception)
            {
                // Error
                Console.WriteLine("Exception caught in process: {0}", _Exception.ToString());
            }

            // error occured, return false
            return false;
        }

        public static String HttpUploadFile(string url, string file, string paramName, string contentType, NameValueCollection nvc)
        {
            //log.Debug(string.Format("Uploading {0} to {1}", file, url));
            string boundary = "---------------------------" + DateTime.Now.Ticks.ToString("x");
            byte[] boundarybytes = System.Text.Encoding.ASCII.GetBytes("\r\n--" + boundary + "\r\n");

            HttpWebRequest wr = (HttpWebRequest)WebRequest.Create(url);
            wr.ContentType = "multipart/form-data; boundary=" + boundary;
            wr.Method = "POST";
            wr.KeepAlive = true;
            wr.Credentials = System.Net.CredentialCache.DefaultCredentials;

            Stream rs = wr.GetRequestStream();

            string formdataTemplate = "Content-Disposition: form-data; name=\"{0}\"\r\n\r\n{1}";
            foreach (string key in nvc.Keys)
            {
                rs.Write(boundarybytes, 0, boundarybytes.Length);
                string formitem = string.Format(formdataTemplate, key, nvc[key]);
                byte[] formitembytes = System.Text.Encoding.UTF8.GetBytes(formitem);
                rs.Write(formitembytes, 0, formitembytes.Length);
            }
            rs.Write(boundarybytes, 0, boundarybytes.Length);

            string headerTemplate = "Content-Disposition: form-data; name=\"{0}\"; filename=\"{1}\"\r\nContent-Type: {2}\r\n\r\n";
            string header = string.Format(headerTemplate, paramName, file, contentType);
            byte[] headerbytes = System.Text.Encoding.UTF8.GetBytes(header);
            rs.Write(headerbytes, 0, headerbytes.Length);

            FileStream fileStream = new FileStream(file, FileMode.Open, FileAccess.Read);
            byte[] buffer = new byte[4096];
            int bytesRead = 0;
            while ((bytesRead = fileStream.Read(buffer, 0, buffer.Length)) != 0)
            {
                rs.Write(buffer, 0, bytesRead);
            }
            fileStream.Close();

            byte[] trailer = System.Text.Encoding.ASCII.GetBytes("\r\n--" + boundary + "--\r\n");
            rs.Write(trailer, 0, trailer.Length);
            rs.Close();

            WebResponse wresp = null;
            try
            {
                wresp = wr.GetResponse();
                Stream stream2 = wresp.GetResponseStream();
                StreamReader reader2 = new StreamReader(stream2);
                String wantedData = reader2.ReadToEnd().ToString();
                return wantedData;

                //log.Debug(string.Format("File uploaded, server response is: {0}", reader2.ReadToEnd()));

            }
            catch (Exception ex)
            {
                log.Error("Error uploading file", ex);
                if (wresp != null)
                {
                    wresp.Close();
                    wresp = null;
                }
                return "false";

            }
            finally
            {
                wr = null;
            }
            //return "false";
        }

        public byte[] DownloadBinary(string url)
        {
            byte[] image;
            using (WebClient wc = new WebClient())
            {
                wc.Headers.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)");
                image = wc.DownloadData(url);
            }

            //webRequest.UserAgent = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)";
            return image;
        }

        public static Image DownloadImage(string _URL)
            {
                Image _tmpImage = null;

                try
                {
                    // Open a connection
                    System.Net.HttpWebRequest _HttpWebRequest = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(_URL);

                    _HttpWebRequest.AllowWriteStreamBuffering = true;

                    // You can also specify additional header values like the user agent or the referer: (Optional)
                    _HttpWebRequest.UserAgent = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)";
                    _HttpWebRequest.Referer = "http://www.google.com/";

                    // set timeout for 20 seconds (Optional)
                    _HttpWebRequest.Timeout = 20000;

                    // Request response:
                    System.Net.WebResponse _WebResponse = _HttpWebRequest.GetResponse();

                    // Open data stream:
                    System.IO.Stream _WebStream = _WebResponse.GetResponseStream();

                    // convert webstream to image
                    _tmpImage = Image.FromStream(_WebStream);

                    // Cleanup
                    _WebResponse.Close();
                    _WebResponse.Close();
                }
                catch (Exception _Exception)
                {
                    // Error
                    Console.WriteLine("Exception caught in process: {0}", _Exception.ToString());
                    return null;
                }

            return _tmpImage;
        }
        #endregion

    }
}
