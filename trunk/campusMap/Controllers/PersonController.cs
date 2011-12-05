#region Directives
    using System.Collections.Generic;
    using Castle.ActiveRecord;
    using Castle.ActiveRecord.Queries;
    using Castle.MonoRail.Framework;
    using Castle.MonoRail.ActiveRecordSupport;
    using Castle.MonoRail.Framework.Helpers;
    using MonoRailHelper;
    using NHibernate.Expression;
    using System.IO;
    using System.Web;
    using System;
    using campusMap.Models;
#endregion



namespace campusMap.Controllers
{


    [Layout("default")]
    public class PersonController : SecureBaseController
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
            IList<person> items;
            int pagesize = 30;
            items = ActiveRecordBase<person>.FindAll(Order.Desc("Email"));
            PropertyBag["persons"] = PaginationHelper.CreatePagination(items, pagesize, page);
        }

        public void Edit_person(int id,int page)
        {

            if (page == 0)
                page = 1;
            int pagesize = 10;

            person person = ActiveRecordBase<person>.Find(id) ;
            PropertyBag["person"] = person;
            String PositionList = GetPosition();
            PropertyBag["positions"] = PositionList; // string should be "location1","location2","location3"
            PropertyBag["personTypes"] = ActiveRecordBase<person_types>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();

            List<AbstractCriterion> baseEx = new List<AbstractCriterion>();
            baseEx.Add(Expression.Eq("Email", person.Email));

            IList<place_comments> items;

            items = ActiveRecordBase<place_comments>.FindAll(Order.Desc("CreateTime"), baseEx.ToArray());
            PropertyBag["comments"] = PaginationHelper.CreatePagination(items, pagesize, page);


            List<AbstractCriterion> sbaseEx = new List<AbstractCriterion>();
            sbaseEx.Add(Expression.Eq("Email", person.Email));
            //IList<StoryByUser> sitems;
            //sitems = ActiveRecordBase<StoryByUser>.FindAll(Order.Desc("CreateTime"), sbaseEx.ToArray());
            //PropertyBag["storybyuser"] = PaginationHelper.CreatePagination(sitems, pagesize, page);

            RenderView("new");
            
           
        }
        public void New()
        {
            String PositionList = GetPosition();
            PropertyBag["positions"] = PositionList; // string should be "location1","location2","location3"
            PropertyBag["person"] = ActiveRecordBase<person>.FindAll();
            PropertyBag["personTypes"] = ActiveRecordBase<person_types>.FindAll();
            PropertyBag["accesslevels"] = ActiveRecordBase<access_levels>.FindAll();  
        }

        public String GetPosition()
        {
            String sql = "SELECT DISTINCT s.Position FROM Person AS s WHERE NOT s.Position = 'NULL'";
            SimpleQuery<String> q = new SimpleQuery<String>(typeof(place), sql);
            Array positions = q.Execute();
            String positionsList = "";
            foreach (String s in positions)
            {
                positionsList += '"' + s.ToString() + '"' + ',';
            }
            return positionsList.TrimEnd(',');
        }
        public void Update([ARDataBind("person", Validate = true, AutoLoad = AutoLoadBehavior.NewInstanceIfInvalidKey)] person person)
                  
        {
          
            try{               
                ActiveRecordMediator<person>.Save(person);               
               }
            catch (Exception ex)
            {
                Flash["error"] = ex.Message;
                Flash["person"] = person;
            }
            RedirectToAction("list");
        }

        public void delete(int id)
        {
            person person = ActiveRecordBase<person>.Find(id);
            ActiveRecordMediator<person>.Delete(person);
            RedirectToAction("list");
        }


    }
}
