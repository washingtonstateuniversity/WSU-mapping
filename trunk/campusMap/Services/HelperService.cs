#region Directives
    using System;
    using System.Data;
    using System.Configuration;
    using System.Web;
    using System.Web.Security;
    using System.Web.UI;
    using System.Web.UI.WebControls;
    using System.Web.UI.WebControls.WebParts;
    using System.Web.UI.HtmlControls;
    using campusMap.Models;
    using NVelocity;
    using NVelocity.App;
    using NVelocity.Context;
    using NVelocity.Runtime;
    using NHibernate.Expression;
    using System.Collections.Generic;
    using Castle.ActiveRecord;
    using System.Net;
    using System.Text.RegularExpressions;
    using System.IO;
    using MonoRailHelper;
    using System.Xml;
    using HtmlAgilityPack;
    using Mark.Tidy;
    using Commons.Collections;
    using System.Collections;
    using log4net;
    using log4net.Config;
#endregion

namespace campusMap.Services
{
    public class HelperService
    {
        ILog log = log4net.LogManager.GetLogger("HelperService");
      /*  public place[] getPublishedPlaces(Order order)
        {
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("Status", ActiveRecordBase<PlaceStatus>.Find(3)));
            baseEx.Add(Expression.Lt("PublishTime", DateTime.Now));
            place[] places = ActiveRecordBase<place>.FindAll(order, baseEx.ToArray());
            return places;
        }

        public bool placeExist(int id, IList<place> allPlaces)
        {
            foreach (place place in allPlaces)
            {
                if (place.id == id)

                    return true;
            }
            return false;

        }
        */
        public static string GetPageAsString(Uri address)
        {
            string result = "";

            // Create the web request   
            HttpWebRequest request = WebRequest.Create(address) as HttpWebRequest;

            // Get response   
            using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
            {
                // Get the response stream   
                StreamReader reader = new StreamReader(response.GetResponseStream());

                // Read the whole contents and return as a string   
                result = reader.ReadToEnd();
            }

            return result;
        }

        public bool isEmail(string inputEmail)
        {
            string pattern = @"^(?!\.)(""([^""\r\\]|\\[""\r\\])*""|"
              + @"([-a-z0-9!#$%&'*+/=?^_`{|}~]|(?<!\.)\.)*)(?<!\.)"
              + @"@[a-z0-9][\w\.-]*[a-z0-9]\.[a-z][a-z\.]*[a-z]$";
            Regex regex = new Regex(pattern, RegexOptions.IgnoreCase);
            if (regex.IsMatch(inputEmail))
            {
                return (true);
            }
            else
            {
                return (false);
            }
        }

        public DateTime date_return(int i)
        {
            return DateTime.Now.AddDays(i);
        }

        public String getCommentSpamResultMessage(comments comment)
        {
            string[] cusin = new string[] { "anal", "anus", "arse", "ass", "ballsack", "balls", "bastard", "bitch", "beoch", "biatch", "bloody", "blowjob", "bollock", "bollok", "boner", "boob", "butt", "buttplug", "clitoris", "cock", "coon", "crap", "cunt", "damn", "dick", "dildo", "dyke", "fag", "feck", "fellate", "fellatio", "felching", "fuck", "fudgepacker", "flange", "Goddamn", "hell", "homo", "jerk", "jizz", "knobend", "labia", "lmao", "lmfao", "muff", "nigger", "nigga", "omg", "penis", "piss", "poop", "prick", "pube", "pussy", "queer", "scrotum", "sex", "shit", "sh1t", "slut", "smegma", "spunk", "tit", "tosser", "turd", "twat", "vagina", "wank", "whore", "wtf" };

            string[] skipwords = new string[] { "bass", "class", "sexy", "assu", "asso", "assi", "assw", "assr", "assy", "assp", "assl", "assh", "assn", "assb", "butte", "cockt", "titl", "tita" };

            List<KeyValue> kvs = new List<KeyValue>();
            kvs.Add(new KeyValue("a", "@"));
            kvs.Add(new KeyValue("s", @"\$"));
            kvs.Add(new KeyValue("ss", @"\$\$"));
            kvs.Add(new KeyValue("ass", @"@\$\$"));
            kvs.Add(new KeyValue("k", @"\|<"));
            kvs.Add(new KeyValue("i", @"\|"));
            kvs.Add(new KeyValue("i", "1"));
            kvs.Add(new KeyValue("i", "!"));
            kvs.Add(new KeyValue("l", @"\|"));
            kvs.Add(new KeyValue("l", "1"));
            kvs.Add(new KeyValue("l", "!"));
            kvs.Add(new KeyValue("o", "0"));
            kvs.Add(new KeyValue("b", "i3"));
            kvs.Add(new KeyValue("f", "ph"));
            kvs.Add(new KeyValue("g", "6"));
            kvs.Add(new KeyValue("z", "2"));
            kvs.Add(new KeyValue("c", "k"));
            kvs.Add(new KeyValue("k", @"\|{"));

            //remove the spaces for an attempt at making F  u cK to pass thru
            string com = comment.comment.Replace(@" ", string.Empty);
            for (int i = 0; i < cusin.Length - 1; i++)
            {
                string s = cusin[i];
                Regex RgxUrl = new Regex(s, RegexOptions.IgnoreCase | RegexOptions.Multiline);
                bool flagable = RgxUrl.IsMatch(com); // check for ass
                int flaged_count = RgxUrl.Matches(com).Count; // what is the number it was found
                int skipflaged_count = 0;
                bool skipflag = false;
                if (flagable) // if check for ass check if it's apart of a vaild work if tit is a nono but title is ok
                {
                    for (int k = 0; k < skipwords.Length - 1; k++)
                    {
                        string skip = skipwords[k];
                        Regex skipRgx = new Regex(skip, RegexOptions.IgnoreCase | RegexOptions.Multiline);
                        skipflag = skipRgx.IsMatch(com);
                        skipflaged_count = skipRgx.Matches(com).Count; // what is the number it was found
                    }
                    if (flaged_count > skipflaged_count) //if the flaged number is great then the skiped number then it's flagable
                    {
                        comment.Flagged = true;
                        comment.published = false;
                        return "It appears you had cursed in your post and your post is awaiting approval. message:951 " + i + " for <div><em>" + comment.comment + " -- " + com + " for:" + s + "</em></div>";
                    }
                }
                if (flagable)
                {
                    break;
                }
                //checked for variations of the word ie: @$$ a$$ @ss a$s as$
                for (int j = 0; j < kvs.Count - 1; j++)
                {
                    string subed = Regex.Replace(s, kvs[j].Key, kvs[j].Value, RegexOptions.IgnoreCase);
                    Regex subRgxUrl = new Regex(subed, RegexOptions.IgnoreCase | RegexOptions.Multiline);
                    flagable = subRgxUrl.IsMatch(com);
                    if (flagable)
                    {
                        comment.Flagged = true;
                        comment.published = false;
                        return "It appears you had cursed in your post and your post is awaiting approval.";
                    }
                }
                if (flagable)
                {
                    break;
                }
            }
            return null;
        }

        public String stripHTMLElements(String str){
            List<KeyValue> htmlElments = new List<KeyValue>();
            htmlElments.Add(new KeyValue("<div(.*?)>", "</div>"));
            htmlElments.Add(new KeyValue("<hr>", "<hr(.*?)/>"));
            htmlElments.Add(new KeyValue("<span(.*?)>", "</span>"));
            htmlElments.Add(new KeyValue("<h1(.*?)>", "</h1>"));
            htmlElments.Add(new KeyValue("<h2(.*?)>", "</h2>"));
            htmlElments.Add(new KeyValue("<h3(.*?)>", "</h3>"));
            htmlElments.Add(new KeyValue("<h4(.*?)>", "</h4>"));
            htmlElments.Add(new KeyValue("<h5(.*?)>", "</h5>"));
            htmlElments.Add(new KeyValue("<h6(.*?)>", "</h6>"));
            htmlElments.Add(new KeyValue("<table(.*?)>", "</table>"));
            htmlElments.Add(new KeyValue("<tr(.*?)>", "</tr>"));
            htmlElments.Add(new KeyValue("<td(.*?)>", "</td>"));
            htmlElments.Add(new KeyValue("<thead(.*?)>", "</thead>"));
            htmlElments.Add(new KeyValue("<tbody(.*?)>", "</tbody>"));
            htmlElments.Add(new KeyValue("<input(.*?)>", "<input(.*?)>"));
            htmlElments.Add(new KeyValue("<img(.*?)>", "<img(.*?)>"));

            for (int j = 0; j < htmlElments.Count - 1; j++)
            {
                str = Regex.Replace(str, htmlElments[j].Key, string.Empty, RegexOptions.IgnoreCase);
                str = Regex.Replace(str, htmlElments[j].Value, string.Empty, RegexOptions.IgnoreCase);
            }
            return str;
        }

        public bool passedCaptcha(String Asirra_Ticket)
        {
            XmlDocument doc = new XmlDocument();
            doc.Load(@"http://challenge.asirra.com/cgi/Asirra?action=ValidateTicket&ticket=" + Asirra_Ticket);
            //String Result = doc.GetElementsBytagsName("Result")[0].Value;
            String Result = "";
            if (Result == "Fail")
            {
                return false;
            }
            return true;
        }

        public String decodeString(String text)
        {
            StringWriter str = new StringWriter();
            HttpUtility.HtmlDecode(text, str);
            string decodedStr = str.ToString();
            return decodedStr;
        }

        public bool hasLink(String html)
        {
            Regex RgxUrl2 = new Regex(@"(http://)|(https://)", RegexOptions.IgnoreCase | RegexOptions.Multiline);
            return RgxUrl2.IsMatch(html);
        }

        public static bool DirExists(string sDirName)
        {
            try
            {
                return (System.IO.Directory.Exists(sDirName));    //Check for file
            }
            catch (Exception)
            {
                return (false);                                 //Exception occured, return False
            }
        }

        private static bool fileExists(string sFileName)
        {
            try
            {
                return (System.IO.File.Exists(sFileName));    //Check for file
            }
            catch (Exception)
            {
                return (false);//Exception occured, return False
            }
        }

        public string cleanTinyCode(string text){
            bool has = text.IndexOf("tinyImgHolder") >= 0;
            //<img class="tinyImgHolder fLeft" style="opacity: 1;" title="#Inline_Iamge(210 434 180 336 ' fLeft')" src="../image/download.castle?id=210&amp;placeid=434&amp;m=crop&amp;w=180&amp;h=336&amp;pre=TMP" alt="imagingIt|210" width="180" height="336" />
            string strRegex = @"<img(.*?)class=\""tinyImgHolder(.*?)title=\""(.*?)\""(.*?)\/\>";
            RegexOptions myRegexOptions = RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace;
            Regex myRegex = new Regex(strRegex, myRegexOptions);
            return myRegex.Replace(text, "${3}");
        }

        public ExtendedProperties setMacros(ExtendedProperties props)
        {
            ArrayList macroList = new ArrayList();
            macroList.Add("macros.vm");
            object libPropValue = props.GetProperty(RuntimeConstants.VM_LIBRARY);

            if (libPropValue is ICollection)
            {
                macroList.AddRange((ICollection)libPropValue);
            }
            else if (libPropValue is string)
            {
                macroList.Add(libPropValue);
            }
            props.AddProperty(RuntimeConstants.RESOURCE_LOADER, "file");
            props.AddProperty(RuntimeConstants.FILE_RESOURCE_LOADER_PATH, HttpContext.Current.Server.MapPath("~/Views/macros/"));

            props.AddProperty(RuntimeConstants.VM_LIBRARY, macroList);
            props.AddProperty(RuntimeConstants.VM_LIBRARY_AUTORELOAD, true);
            return props;
        }

        public String proccessText(Hashtable contextitems, String text, bool usetidy)
        {
            text = cleanTinyCode(text);
            // template = template.Replace("#", "${pound}");
            //  if (!template.Contains("#set($pound"))
            // template = "#set($pound = \"#\")" + System.Environment.NewLine + template;
            VelocityEngine engine = new VelocityEngine();
            ExtendedProperties props = setMacros(new ExtendedProperties());
            engine.Init(props);

            VelocityContext context = new VelocityContext();

            foreach (String key in contextitems.Keys)
            {
                if (contextitems[key] != null && (contextitems[key]).GetType() == typeof(String))
                {
                    String value = contextitems[key].ToString();
                    if (String.IsNullOrEmpty(value.Trim()))
                        value = null;
                    else
                        value = value.Trim();
                    //value = value.Replace("#", "${pound}");
                    context.Put(key, value);
                }
                else
                    context.Put(key, contextitems[key]);
            }
            StringWriter firstwriter = new StringWriter();
            StringWriter secondwriter = new StringWriter();

            // Merge the regions, render the nav, etc.
            engine.Evaluate(context, firstwriter, "logtag", text);
            String resultingtext = firstwriter.GetStringBuilder().ToString();
            //resultingtext = resultingtext.Replace("#", "${pound}");

            // 2nd time is to render ${siteroot} that may had been in one of the merged regions 
            try
            {
                engine.Evaluate(context, secondwriter, "logtag", resultingtext);
                resultingtext = secondwriter.GetStringBuilder().ToString();
            }
            catch (Exception ex)
            {
                // Choked on parsing the results of the first pass, so better show what we have rather then an error
                log.Error("Error uploading file", ex);
            }

           String parsedtext = resultingtext;
             /*if (usetidy)
            {
                using (Document doc = new Document(resultingtext))
                {
                    doc.ShowWarnings = false;
                    doc.Quiet = true;
                    doc.DocType = DocTypeMode.Loose;
                    //doc.OutputXhtml = true;
                    doc.CleanAndRepair();
                    parsedtext = doc.Save();
                }
            }
            if (String.IsNullOrEmpty(parsedtext.Trim()))
            {
                parsedtext = resultingtext;
            }*/
            return parsedtext;
        }

    }

}
