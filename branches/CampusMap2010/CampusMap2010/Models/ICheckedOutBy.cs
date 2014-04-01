using System;
using Castle.ActiveRecord;
using campusMap.Models;

namespace CampusMap2010.Models
{
    public interface ICheckedOutBy
    {
        authors checked_out_by { get; set; }
        int id { get; set; }
    }
}
