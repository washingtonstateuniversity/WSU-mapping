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
using NHibernate.Criterion;
using System.Collections.Generic;
using Castle.ActiveRecord;
using Castle.ActiveRecord.Queries;

namespace campusMap.Services
{
    public class PlaceService
    {
        public place[] getPublishedPlaces(Order order, place_types type)
        {
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("Status", ActiveRecordBase<status>.Find(3)));
            baseEx.Add(Expression.Lt("PublishTime", DateTime.Now));
            if (type!=null)
                baseEx.Add(Expression.Eq("place_types", type));
            place[] places = ActiveRecordBase<place>.FindAll(order, baseEx.ToArray());
            return places;
        }
        public place[] getPublishedPlaces(Order order)
        {
            return getPublishedPlaces(order, null);
        }
        public bool placesExistByType(string type)
        {
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("Status", ActiveRecordBase<status>.Find(3)));
            baseEx.Add(Expression.Gt("placeType", ActiveRecordBase<place_types>.FindAllByProperty("Name",type) ) );
            place[] places = ActiveRecordBase<place>.FindAll(baseEx.ToArray());
            if (places.Length > 0)return true;
            return false;
        }


        public place[] getRelatedPlacesByPlacetags(place place)
        {
            List<place> list = new List<place>(); 
            
            foreach(tags tag in place.tags){
                tags taged = ActiveRecordBase<tags>.Find(tag.id);
                list.AddRange(taged.places);
            }
            place[] places = list.ToArray(); 
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
        public int placeByURL_id(string url)
        {
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("CustomUrl", url));
            place place = ActiveRecordBase<place>.FindFirst(baseEx.ToArray());
            if (place != null)
            {
                return place.id;
            }
            else
            {
                return 0;
            }
        }

        public place[] placeByURL(string url)
        {
            return ActiveRecordBase<place>.FindAllByProperty("CustomUrl", url);
        }

        public int placeIdByURL(string url)
        {
            String sql = "SELECT s.id FROM Place AS s WHERE s.CustomUrl = '" + url + "'";
            ScalarQuery<int> q = new ScalarQuery<int>(typeof(place), sql);
            int id = q.Execute();
            return id;
        }

        public IList<place> AddList(place[] places, IList<place> allPlaces)
        {
            foreach (place place in places)
            {
                if (!placeExist(place.id, allPlaces))
                { allPlaces.Add(place); }
            }
            return allPlaces;
        }

        public IList<place> searchPlaces(String str)
        {
            // Container IList, all searched places will be saved
            IList<place> allPlaces = new List<place>();

            ICriterion expression = Expression.Like("Title", str, MatchMode.Anywhere);
            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("Status", ActiveRecordBase<status>.Find(3)));
            baseEx.Add(Expression.Lt("PublishTime", DateTime.Now));


            // Search by Title
            List<AbstractCriterion> titleEx = new List<AbstractCriterion>();
            titleEx.AddRange(baseEx);
            titleEx.Add(Expression.Like("Title", str, MatchMode.Anywhere));
            place[] places = ActiveRecordBase<place>.FindAll(Order.Asc("Order"), titleEx.ToArray());
            allPlaces = AddList(places, allPlaces);

            // Search by BodyText 
            List<AbstractCriterion> BodyTextEx = new List<AbstractCriterion>();
            BodyTextEx.AddRange(baseEx);
            BodyTextEx.Add(Expression.Like("BodyText", str, MatchMode.Anywhere));
            places = ActiveRecordBase<place>.FindAll(Order.Asc("Order"), BodyTextEx.ToArray());
            allPlaces = AddList(places, allPlaces);

            //Search By HotTopics
            List<AbstractCriterion> HotTopicsEx = new List<AbstractCriterion>();
            HotTopicsEx.AddRange(baseEx);
            HotTopicsEx.Add(Expression.Like("HotTopics", str, MatchMode.Anywhere));
            places = ActiveRecordBase<place>.FindAll(Order.Asc("Order"), HotTopicsEx.ToArray());
            allPlaces = AddList(places, allPlaces);

            // Search By Teaser
            List<AbstractCriterion> TeaserEx = new List<AbstractCriterion>();
            TeaserEx.AddRange(baseEx);
            TeaserEx.Add(Expression.Like("Teaser", str, MatchMode.Anywhere));
            places = ActiveRecordBase<place>.FindAll(Order.Asc("Order"), TeaserEx.ToArray());
            allPlaces = AddList(places, allPlaces);

            // Search By subHead
            List<AbstractCriterion> subHeadEx = new List<AbstractCriterion>();
            subHeadEx.AddRange(baseEx);
            subHeadEx.Add(Expression.Like("subHead", str, MatchMode.Anywhere));
            places = ActiveRecordBase<place>.FindAll(Order.Asc("Order"), subHeadEx.ToArray());
            allPlaces = AddList(places, allPlaces);

            return allPlaces;
        }


       /* public IList<place> getBreakingNews()
        {
            IList<place> breakingplaces = new List<place>();
            foreach (place tempplace in getPublishedPlaces(Order.Desc("Order")))
            {
                if (tempplace.BreakingNews == true)
                {
                    breakingplaces.Add(tempplace);
                }
            }
            return breakingplaces;
        }*/

        /*public IList<place> getFeaturedNews()
        {
            IList<place> featuredplaces = new List<place>();
            foreach (place tempplace in getPublishedPlaces(Order.Desc("Order")))
            {
                if (tempplace.FeaturedNews == true)
                {
                    featuredplaces.Add(tempplace);
                }
            }
            return featuredplaces;
        }*/

        public IList<advertisement> getAdvertisements(IList<place> places)
        {
            List<advertisement> advertisements = new List<advertisement>();

            foreach (advertisement ad in ActiveRecordBase<advertisement>.FindAll())
            {
                if (!ad.isExpired())
                    advertisements.Add(ad);
            }

            advertisements.Sort(advertisement.OrderComparison);
            return advertisements;

        }


        public place[] getPlacesByKeyword(string str)
        {
            String sql = "from place p where ";
            int id = 1;
            {
                string cats = HttpUtility.UrlDecode(str);
                IList<tags> c = ActiveRecordBase<tags>.FindAllByProperty("name", cats);
                if (c.Count > 0)
                {
                    sql += " :p" + id + " in elements(p.tags) ";
                    id = id + 1;
                    sql += " or ";
                }
            }
            sql += " 1=0 ";
            sql += " ORDER BY p.prime_name ASC ";
            SimpleQuery<place> q = new SimpleQuery<place>(typeof(place), sql);
            id = 1;
            {
                string cats = HttpUtility.UrlDecode(str);
                IList<tags> c = ActiveRecordBase<tags>.FindAllByProperty("name", cats);
                if (c.Count > 0)
                {
                    q.SetParameter("p" + id, c[0]);
                    id = id + 1;
                }
            }
            place[] items = q.Execute();
            return items;
        }




    }

}
