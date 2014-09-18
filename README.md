WSU-mapping
===========

This project is made to controll the mapping system that is using google maps to present places for WSU to users.  View it live here at [map.wsu.edu](http://map.wsu.edu)

![WSU Campus map preview](http://i.imgur.com/Gtyy86y.png "smaple image")

##How to run localy
This repo doesn't include the `config/properties.config` file which is what is used to set the database connection.  You'll have to create your own.  This will look like 

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
	<properties>
    <connectionString>Server=database.wsu.edu;Initial Catalog=campusMap;Persist Security Info=True;User ID=your_db_username;Password=your_password</connectionString>
  </properties>
</configuration>
```

**NOTE:** if you are deploying changes to the site in production, we use a different `<connectionString>` but the `export.sql` is the same as what you will run locally.