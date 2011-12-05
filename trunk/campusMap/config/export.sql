alter table authors  drop constraint FK99969F957CBA35BF
alter table authors_media  drop constraint FKFF4403092427626A
alter table place  drop constraint FK5EA0A9E6F21FADC1
alter table place  drop constraint FK5EA0A9E66F90B8EB
alter table place  drop constraint FK5EA0A9E6B7600650
alter table authors_to_programs  drop constraint FK485F60429987D6E3
alter table place_comments  drop constraint FK676BA7235EA0A9E6
alter table place_comments  drop constraint FK676BA723D7214611
alter table geometrics_to_types  drop constraint FKFFB888DDE68FD94C
alter table media_repo  drop constraint FK9E2305353040346B
alter table place_to_place_types  drop constraint FKB0BAEAC1D7214611
alter table AdvertisementTag  drop constraint FK32E86D45BEE0636
alter table place_to_usertags  drop constraint FK84A60889D7214611
alter table authors_to_campus  drop constraint FK5D9478D473EBBDD3
alter table place_media  drop constraint FK675D342C4E6DE759
alter table place_media  drop constraint FK675D342CD72146119E230535
alter table place_media  drop constraint FK675D342C330DD191
alter table person  drop constraint FK8C55D4CB5C8254F3
alter table person  drop constraint FK8C55D4CB8772812E
alter table authors_to_place_type  drop constraint FK457B0CD53C8C945D
alter table authors_place  drop constraint FKA474A663D7214611
alter table authors_to_colleges  drop constraint FKA2EED20FB090BF9
alter table PlaceImage  drop constraint FK89C7B1872E24E840
alter table advertisement  drop constraint FK3C482F677BBD9EE3
alter table place_to_place_names  drop constraint FK5973EAB9D7214611
alter table AdvertisementImage  drop constraint FK6DA634A6BEE0636
alter table place_to_tags  drop constraint FK94806F6BD7214611
if exists (select * from dbo.sysobjects where id = object_id(N'authors') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors
if exists (select * from dbo.sysobjects where id = object_id(N'access_levels') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table access_levels
if exists (select * from dbo.sysobjects where id = object_id(N'authors_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_media
if exists (select * from dbo.sysobjects where id = object_id(N'tags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table tags
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_campus') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_campus
if exists (select * from dbo.sysobjects where id = object_id(N'place') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_programs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_programs
if exists (select * from dbo.sysobjects where id = object_id(N'PlaceByUser') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table PlaceByUser
if exists (select * from dbo.sysobjects where id = object_id(N'place_comments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_comments
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_to_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_to_types
if exists (select * from dbo.sysobjects where id = object_id(N'media_repo') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_repo
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_place_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_place_types
if exists (select * from dbo.sysobjects where id = object_id(N'AdvertisementTag') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table AdvertisementTag
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_types
if exists (select * from dbo.sysobjects where id = object_id(N'place_status') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_status
if exists (select * from dbo.sysobjects where id = object_id(N'media_to_media_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_to_media_types
if exists (select * from dbo.sysobjects where id = object_id(N'campus') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table campus
if exists (select * from dbo.sysobjects where id = object_id(N'place_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_types
if exists (select * from dbo.sysobjects where id = object_id(N'usertags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table usertags
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_geometrics') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_geometrics
if exists (select * from dbo.sysobjects where id = object_id(N'departments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table departments
if exists (select * from dbo.sysobjects where id = object_id(N'colleges') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table colleges
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_usertags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_usertags
if exists (select * from dbo.sysobjects where id = object_id(N'categories') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table categories
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_campus') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_campus
if exists (select * from dbo.sysobjects where id = object_id(N'place_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_media
if exists (select * from dbo.sysobjects where id = object_id(N'person') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table person
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_place_type') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_place_type
if exists (select * from dbo.sysobjects where id = object_id(N'logs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table logs
if exists (select * from dbo.sysobjects where id = object_id(N'advertisement_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table advertisement_media
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_programs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_programs
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_categories') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_categories
if exists (select * from dbo.sysobjects where id = object_id(N'authors_place') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_place
if exists (select * from dbo.sysobjects where id = object_id(N'media_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_types
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_colleges') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_colleges
if exists (select * from dbo.sysobjects where id = object_id(N'programs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table programs
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_colleges') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_colleges
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_departments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_departments
if exists (select * from dbo.sysobjects where id = object_id(N'PlaceImage') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table PlaceImage
if exists (select * from dbo.sysobjects where id = object_id(N'place_authors') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_authors
if exists (select * from dbo.sysobjects where id = object_id(N'person_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table person_types
if exists (select * from dbo.sysobjects where id = object_id(N'advertisement') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table advertisement
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_place_names') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_place_names
if exists (select * from dbo.sysobjects where id = object_id(N'AdvertisementImage') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table AdvertisementImage
if exists (select * from dbo.sysobjects where id = object_id(N'place_names') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_names
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_tags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_tags
create table authors (
  author_id INT IDENTITY NOT NULL,
   Nid NVARCHAR(255) null,
   Name NVARCHAR(255) null,
   Email NVARCHAR(255) null,
   Phone NVARCHAR(255) null,
   Active BIT null,
   logedin BIT null,
   LastActive DATETIME null,
   access_levels INT null,
   primary key (author_id)
)
create table access_levels (
  access_level_id INT IDENTITY NOT NULL,
   title NVARCHAR(255) null,
   primary key (access_level_id)
)
create table authors_media (
  authors_id INT not null,
   imageId INT not null
)
create table tags (
  tag_id INT IDENTITY NOT NULL,
   attr NVARCHAR(255) null,
   primary key (tag_id)
)
create table place_to_campus (
  campus_id INT not null,
   place_id INT not null
)
create table place (
  place_id INT IDENTITY NOT NULL,
   prime_name NVARCHAR(255) null,
   abbrev_name NVARCHAR(255) null,
   street_address NVARCHAR(255) null,
   coordinate geography null,
   publish_time DATETIME null,
   creation_date DATETIME null,
   updated_date DATETIME null,
   plus_four_code tinyint null,
   checked_out_by NVARCHAR(255) null,
   place_status INT null,
   media INT null,
   authors_editing INT null,
   primary key (place_id)
)
create table authors_to_programs (
  program_id INT not null,
   authors_id INT not null
)
create table PlaceByUser (
  Id INT IDENTITY NOT NULL,
   First NVARCHAR(255) null,
   Last NVARCHAR(255) null,
   Email NVARCHAR(255) null,
   Placetext NVARCHAR(255) null,
   CreateTime DATETIME null,
   primary key (Id)
)
create table place_comments (
  comment_id INT IDENTITY NOT NULL,
   Comments NVARCHAR(255) null,
   published BIT null,
   Flagged BIT null,
   FlagNumber INT null,
   adminRead BIT null,
   CreateTime DATETIME null,
   UpdateTime DATETIME null,
   Deleted BIT null,
   Nid NVARCHAR(255) null,
   commentorName NVARCHAR(255) null,
   Email NVARCHAR(255) null,
   place INT null,
   place_id INT null,
   primary key (comment_id)
)
create table geometrics_to_types (
  geometrics_id INT not null,
   geometrics_type_id INT not null
)
create table media_repo (
  media_id INT IDENTITY NOT NULL,
   Credit NVARCHAR(255) null,
   Caption NVARCHAR(255) null,
   creation_date DATETIME null,
   updated_date DATETIME null,
   FileName NVARCHAR(255) null,
   Ext NVARCHAR(255) null,
   media_types INT null,
   primary key (media_id)
)
create table place_to_place_types (
  place_type_id INT not null,
   place_id INT not null
)
create table AdvertisementTag (
  advertisementId INT not null,
   tagId INT not null
)
create table geometrics_types (
  geometrics_type_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (geometrics_type_id)
)
create table place_status (
  Id INT IDENTITY NOT NULL,
   Title NVARCHAR(255) null,
   primary key (Id)
)
create table media_to_media_types (
  media_id INT not null,
   media_type_id INT not null
)
create table campus (
  campus_id INT IDENTITY NOT NULL,
   city NVARCHAR(255) null,
   state NVARCHAR(255) null,
   state_abbrev NVARCHAR(255) null,
   zipcode INT null,
   latitude DECIMAL(19,5) null,
   longitude DECIMAL(19,5) null,
   primary key (campus_id)
)
create table place_types (
  place_type_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (place_type_id)
)
create table usertags (
  usertag_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (usertag_id)
)
create table place_to_geometrics (
  place_id INT not null,
   geometrics_id INT not null
)
create table departments (
  department_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (department_id)
)
create table colleges (
  college_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (college_id)
)
create table place_to_usertags (
  place_id INT not null,
   usertag_id INT not null
)
create table categories (
  category_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (category_id)
)
create table geometrics (
  geometrics_id INT IDENTITY NOT NULL,
   boundary geography null,
   default_type INT null,
   primary key (geometrics_id)
)
create table authors_to_campus (
  campus_id INT not null,
   authors_id INT not null
)
create table place_media (
  Id INT IDENTITY NOT NULL,
   place_order INT null,
   place_id INT null,
   imageId INT null,
   media_id INT null,
   primary key (Id)
)
create table person (
  Id INT IDENTITY NOT NULL,
   Name NVARCHAR(255) null,
   Email NVARCHAR(255) null,
   Phone NVARCHAR(255) null,
   Position NVARCHAR(255) null,
   Deleted BIT null,
   BreakingNews BIT null,
   Newsletter BIT null,
   Nid NVARCHAR(255) null,
   AccessLevelStatus INT null,
   personTypeId INT null,
   primary key (Id)
)
create table authors_to_place_type (
  place_type_id INT not null,
   authors_id INT not null
)
create table logs (
  Id INT IDENTITY NOT NULL,
   logentry NVARCHAR(255) null,
   dtOfLog DATETIME null,
   primary key (Id)
)
create table advertisement_media (
  media_id INT not null,
   advertisement_id INT not null
)
create table place_to_programs (
  program_id INT not null,
   place_id INT not null
)
create table place_to_categories (
  category_id INT not null,
   place_id INT not null
)
create table authors_place (
  place_id INT not null,
   authors_id INT not null
)
create table media_types (
  media_type_id INT IDENTITY NOT NULL,
   type NVARCHAR(255) null,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (media_type_id)
)
create table place_to_colleges (
  college_id INT not null,
   place_id INT not null
)
create table programs (
  program_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (program_id)
)
create table authors_to_colleges (
  college_id INT not null,
   authors_id INT not null
)
create table place_to_departments (
  department_id INT not null,
   place_id INT not null
)
create table PlaceImage (
  placeId INT not null,
   imageId INT not null
)
create table place_authors (
  authors_id INT not null,
   place_id INT not null
)
create table person_types (
  Id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   Deleted BIT null,
   attr NVARCHAR(255) null,
   primary key (Id)
)
create table advertisement (
  ad_id INT IDENTITY NOT NULL,
   Clicked INT null,
   Url NVARCHAR(255) null,
   Views INT null,
   HtmlText NVARCHAR(255) null,
   Name NVARCHAR(255) null,
   limitAds NVARCHAR(255) null,
   maxClicks INT null,
   maxImpressions INT null,
   expiration DATETIME null,
   startdate DATETIME null,
   place_types INT null,
   primary key (ad_id)
)
create table place_to_place_names (
  place_id INT not null,
   name_id INT not null
)
create table AdvertisementImage (
  advertisementId INT not null,
   imageId INT not null
)
create table place_names (
  name_id INT IDENTITY NOT NULL,
   place_id INT null,
   name NVARCHAR(255) null,
   primary key (name_id)
)
create table place_to_tags (
  place_id INT not null,
   tag_id INT not null
)
alter table authors  add constraint FK99969F957CBA35BF foreign key (access_levels) references access_levels 
alter table authors_media  add constraint FKFF4403092427626A foreign key (authors_id) references authors 
alter table place  add constraint FK5EA0A9E6F21FADC1 foreign key (place_status) references place_status 
alter table place  add constraint FK5EA0A9E66F90B8EB foreign key (authors_editing) references authors 
alter table place  add constraint FK5EA0A9E6B7600650 foreign key (media) references media_repo 
alter table authors_to_programs  add constraint FK485F60429987D6E3 foreign key (program_id) references authors 
alter table place_comments  add constraint FK676BA7235EA0A9E6 foreign key (place) references place 
alter table place_comments  add constraint FK676BA723D7214611 foreign key (place_id) references place 
alter table geometrics_to_types  add constraint FKFFB888DDE68FD94C foreign key (geometrics_id) references geometrics 
alter table media_repo  add constraint FK9E2305353040346B foreign key (media_types) references media_types 
alter table place_to_place_types  add constraint FKB0BAEAC1D7214611 foreign key (place_id) references place 
alter table AdvertisementTag  add constraint FK32E86D45BEE0636 foreign key (advertisementId) references advertisement 
alter table place_to_usertags  add constraint FK84A60889D7214611 foreign key (place_id) references place 
alter table authors_to_campus  add constraint FK5D9478D473EBBDD3 foreign key (campus_id) references authors 
alter table place_media  add constraint FK675D342C4E6DE759 foreign key (imageId) references media_repo 
alter table place_media  add constraint FK675D342CD72146119E230535 foreign key (place_id) references media_repo 
alter table place_media  add constraint FK675D342C330DD191 foreign key (media_id) references media_repo 
alter table person  add constraint FK8C55D4CB5C8254F3 foreign key (personTypeId) references person_types 
alter table person  add constraint FK8C55D4CB8772812E foreign key (AccessLevelStatus) references access_levels 
alter table authors_to_place_type  add constraint FK457B0CD53C8C945D foreign key (place_type_id) references authors 
alter table authors_place  add constraint FKA474A663D7214611 foreign key (place_id) references place 
alter table authors_to_colleges  add constraint FKA2EED20FB090BF9 foreign key (college_id) references authors 
alter table PlaceImage  add constraint FK89C7B1872E24E840 foreign key (placeId) references place 
alter table advertisement  add constraint FK3C482F677BBD9EE3 foreign key (place_types) references place_types 
alter table place_to_place_names  add constraint FK5973EAB9D7214611 foreign key (place_id) references place 
alter table AdvertisementImage  add constraint FK6DA634A6BEE0636 foreign key (advertisementId) references advertisement 
alter table place_to_tags  add constraint FK94806F6BD7214611 foreign key (place_id) references place 
