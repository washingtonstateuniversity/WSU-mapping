alter table authors  drop constraint FK99969F957CBA35BF
alter table geometric_to_media  drop constraint FKA4F3119595CCB313
alter table map_views  drop constraint FK7803751867805983
alter table map_views  drop constraint FK780375186F90B8EB
alter table authors_to_geometrics  drop constraint FK8212402895CCB313
alter table advertisement_to_tag  drop constraint FKB5C89604AD5E0F0
alter table place  drop constraint FK5EA0A9E6F21FADC1
alter table place  drop constraint FK5EA0A9E66F90B8EB
alter table place  drop constraint FK5EA0A9E6B7600650
alter table authors_to_place_type  drop constraint FK457B0CD53C8C945D
alter table media_repo  drop constraint FK9E230535E85519D9
alter table place_to_place_types  drop constraint FKB0BAEAC1D7214611
alter table place_to_place_models  drop constraint FK176926FED7214611
alter table view_to_tags  drop constraint FKCF7A140983E6244
alter table geometrics  drop constraint FKAA44A29FB7600650
alter table geometrics  drop constraint FKAA44A29F1A9F0CDD
alter table geometrics  drop constraint FKAA44A29F6F90B8EB
alter table place_to_usertags  drop constraint FK84A60889D7214611
alter table authors_to_view  drop constraint FK3FDBF52C983E6244
alter table place_to_media  drop constraint FKA6E941EDD7214611
alter table authors_to_media  drop constraint FK765FB0C254A0A173
alter table advertisement_to_media  drop constraint FKBFD8318AAD5E0F0
alter table place_media  drop constraint FK675D342CD72146119E230535
alter table place_media  drop constraint FK675D342C330DD191
alter table fields  drop constraint FKB995793DDA906D7
alter table geometrics_media  drop constraint FK879AC58795CCB313
alter table geometrics_media  drop constraint FK879AC587330DD191
alter table authors_place  drop constraint FKA474A663D7214611
alter table authors_to_campus  drop constraint FK5D9478D473EBBDD3
alter table geometric_to_usertags  drop constraint FKD8E7A66C95CCB313
alter table place_comments  drop constraint FK676BA7235EA0A9E6
alter table authors_to_colleges  drop constraint FKA2EED20FB090BF9
alter table view_to_usertags  drop constraint FK42F0059B983E6244
alter table comments  drop constraint FK909B63235EA0A9E6
alter table comments  drop constraint FK909B6323983E6244
alter table comments  drop constraint FK909B6323D7214611
alter table geometrics_to_types  drop constraint FKFFB888DD95CCB313
alter table geometric_to_tags  drop constraint FKA745E41B95CCB313
alter table authors_to_programs  drop constraint FK485F60429987D6E3
alter table place_to_place_names  drop constraint FK5973EAB9D7214611
alter table person  drop constraint FK8C55D4CB5C8254F3
alter table person  drop constraint FK8C55D4CB8772812E
alter table advertisement  drop constraint FK3C482F677BBD9EE3
alter table place_to_tags  drop constraint FK94806F6BD7214611
if exists (select * from dbo.sysobjects where id = object_id(N'authors') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors
if exists (select * from dbo.sysobjects where id = object_id(N'access_levels') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table access_levels
if exists (select * from dbo.sysobjects where id = object_id(N'geometric_to_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometric_to_media
if exists (select * from dbo.sysobjects where id = object_id(N'map_views') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table map_views
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_to_fields') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_to_fields
if exists (select * from dbo.sysobjects where id = object_id(N'tags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table tags
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_geometrics') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_geometrics
if exists (select * from dbo.sysobjects where id = object_id(N'advertisement_to_tag') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table advertisement_to_tag
if exists (select * from dbo.sysobjects where id = object_id(N'place') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place
if exists (select * from dbo.sysobjects where id = object_id(N'place_models') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_models
if exists (select * from dbo.sysobjects where id = object_id(N'media_to_media_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_to_media_types
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_place_type') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_place_type
if exists (select * from dbo.sysobjects where id = object_id(N'view_to_fields') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table view_to_fields
if exists (select * from dbo.sysobjects where id = object_id(N'logs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table logs
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_to_field_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_to_field_types
if exists (select * from dbo.sysobjects where id = object_id(N'media_repo') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_repo
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_place_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_place_types
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_place_models') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_place_models
if exists (select * from dbo.sysobjects where id = object_id(N'view_to_tags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table view_to_tags
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_usertags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_usertags
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_colleges') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_colleges
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_view') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_view
if exists (select * from dbo.sysobjects where id = object_id(N'place_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_types
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_types
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_status') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_status
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_fields') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_fields
if exists (select * from dbo.sysobjects where id = object_id(N'place_status') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_status
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_media
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_media
if exists (select * from dbo.sysobjects where id = object_id(N'campus') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table campus
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_field_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_field_types
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_place') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_place
if exists (select * from dbo.sysobjects where id = object_id(N'usertags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table usertags
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_geometrics') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_geometrics
if exists (select * from dbo.sysobjects where id = object_id(N'status') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table status
if exists (select * from dbo.sysobjects where id = object_id(N'departments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table departments
if exists (select * from dbo.sysobjects where id = object_id(N'colleges') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table colleges
if exists (select * from dbo.sysobjects where id = object_id(N'view_to_field_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table view_to_field_types
if exists (select * from dbo.sysobjects where id = object_id(N'advertisement_to_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table advertisement_to_media
if exists (select * from dbo.sysobjects where id = object_id(N'media_to_field_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_to_field_types
if exists (select * from dbo.sysobjects where id = object_id(N'place_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_media
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_campus') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_campus
if exists (select * from dbo.sysobjects where id = object_id(N'fields') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table fields
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_media
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_programs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_programs
if exists (select * from dbo.sysobjects where id = object_id(N'media_to_fields') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_to_fields
if exists (select * from dbo.sysobjects where id = object_id(N'authors_place') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_place
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_campus') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_campus
if exists (select * from dbo.sysobjects where id = object_id(N'geometric_to_usertags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometric_to_usertags
if exists (select * from dbo.sysobjects where id = object_id(N'place_comments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_comments
if exists (select * from dbo.sysobjects where id = object_id(N'programs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table programs
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_colleges') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_colleges
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_departments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_departments
if exists (select * from dbo.sysobjects where id = object_id(N'field_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table field_types
if exists (select * from dbo.sysobjects where id = object_id(N'view_to_usertags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table view_to_usertags
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_categories') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_categories
if exists (select * from dbo.sysobjects where id = object_id(N'person_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table person_types
if exists (select * from dbo.sysobjects where id = object_id(N'comments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table comments
if exists (select * from dbo.sysobjects where id = object_id(N'categories') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table categories
if exists (select * from dbo.sysobjects where id = object_id(N'media_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_types
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_to_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_to_types
if exists (select * from dbo.sysobjects where id = object_id(N'geometric_to_tags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometric_to_tags
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_programs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_programs
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_place_names') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_place_names
if exists (select * from dbo.sysobjects where id = object_id(N'person') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table person
if exists (select * from dbo.sysobjects where id = object_id(N'advertisement') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table advertisement
if exists (select * from dbo.sysobjects where id = object_id(N'place_names') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_names
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_tags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_tags
create table authors (
  author_id INT IDENTITY NOT NULL,
   Nid NVARCHAR(255) null,
   name NVARCHAR(255) null,
   email NVARCHAR(255) null,
   phone NVARCHAR(255) null,
   active BIT null,
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
create table geometric_to_media (
  geometric_id INT not null,
   media_id INT not null
)
create table map_views (
  view_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   cache_path NVARCHAR(255) null,
   commentable BIT null,
   sharable BIT null,
   width tinyint null,
   height tinyint null,
   center geography null,
   published DATETIME null,
   created DATETIME null,
   updated DATETIME null,
   checked_out_by NVARCHAR(255) null,
   view_status INT null,
   authors_editing INT null,
   primary key (view_id)
)
create table geometrics_to_fields (
  field_id INT not null,
   geometric_id INT not null
)
create table tags (
  tag_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (tag_id)
)
create table authors_to_geometrics (
  author_id INT not null,
   geometric_id INT not null
)
create table advertisement_to_tag (
  ad_id INT not null,
   tag_id INT not null
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
create table place_models (
  place_model_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (place_model_id)
)
create table media_to_media_types (
  media_id INT not null,
   media_type_id INT not null
)
create table authors_to_place_type (
  place_type_id INT not null,
   author_id INT not null
)
create table view_to_fields (
  field_id INT not null,
   view_id INT not null
)
create table logs (
  Id INT IDENTITY NOT NULL,
   logentry NVARCHAR(255) null,
   dtOfLog DATETIME null,
   primary key (Id)
)
create table geometrics_to_field_types (
  field_type_id INT not null,
   geometric_id INT not null
)
create table media_repo (
  media_id INT IDENTITY NOT NULL,
   credit NVARCHAR(255) null,
   caption NVARCHAR(255) null,
   created DATETIME null,
   updated DATETIME null,
   file_name NVARCHAR(255) null,
   ext NVARCHAR(255) null,
   path NVARCHAR(255) null,
   media_type_id INT null,
   primary key (media_id)
)
create table place_to_place_types (
  place_id INT not null,
   place_type_id INT not null
)
create table place_to_place_models (
  place_id INT not null,
   place_model_id INT not null
)
create table view_to_tags (
  view_id INT not null,
   tag_id INT not null
)
create table geometrics (
  geometric_id INT IDENTITY NOT NULL,
   boundary geography null,
   default_type INT null,
   publish_time DATETIME null,
   creation_date DATETIME null,
   updated_date DATETIME null,
   checked_out_by NVARCHAR(255) null,
   geometrics_status INT null,
   media INT null,
   authors_editing INT null,
   primary key (geometric_id)
)
create table place_to_usertags (
  place_id INT not null,
   usertag_id INT not null
)
create table place_to_colleges (
  college_id INT not null,
   place_id INT not null
)
create table authors_to_view (
  view_id INT not null,
   authors_id INT not null,
   author_id INT not null
)
create table place_types (
  place_type_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (place_type_id)
)
create table geometrics_types (
  geometrics_type_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (geometrics_type_id)
)
create table geometrics_status (
  Id INT IDENTITY NOT NULL,
   Title NVARCHAR(255) null,
   primary key (Id)
)
create table place_to_fields (
  field_id INT not null,
   place_id INT not null
)
create table place_status (
  Id INT IDENTITY NOT NULL,
   Title NVARCHAR(255) null,
   primary key (Id)
)
create table place_to_media (
  place_id INT not null,
   media_id INT not null
)
create table authors_to_media (
  author_id INT not null,
   media_id INT not null
)
create table campus (
  campus_id INT IDENTITY NOT NULL,
   city NVARCHAR(255) null,
   name NVARCHAR(255) null,
   state NVARCHAR(255) null,
   state_abbrev NVARCHAR(255) null,
   zipcode INT null,
   latitude DECIMAL(19,5) null,
   longitude DECIMAL(19,5) null,
   primary key (campus_id)
)
create table place_to_field_types (
  field_type_id INT not null,
   place_id INT not null
)
create table authors_to_place (
  author_id INT not null,
   place_id INT not null
)
create table usertags (
  usertag_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (usertag_id)
)
create table place_to_geometrics (
  place_id INT not null,
   geometric_id INT not null
)
create table status (
  status_id INT IDENTITY NOT NULL,
   title NVARCHAR(255) null,
   primary key (status_id)
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
create table view_to_field_types (
  field_type_id INT not null,
   view_id INT not null
)
create table advertisement_to_media (
  media_id INT not null,
   ad_id INT not null
)
create table media_to_field_types (
  field_type_id INT not null,
   media_id INT not null
)
create table place_media (
  Id INT IDENTITY NOT NULL,
   place_order INT null,
   place_id INT null,
   media_id INT null,
   primary key (Id)
)
create table place_to_campus (
  campus_id INT not null,
   place_id INT not null
)
create table fields (
  field_id INT IDENTITY NOT NULL,
   value NVARCHAR(255) null,
   field_type_id INT null,
   primary key (field_id)
)
create table geometrics_media (
  Id INT IDENTITY NOT NULL,
   geometric_order INT null,
   geometric_id INT null,
   media_id INT null,
   primary key (Id)
)
create table place_to_programs (
  program_id INT not null,
   place_id INT not null
)
create table media_to_fields (
  field_id INT not null,
   media_id INT not null
)
create table authors_place (
  place_id INT not null,
   author_id INT not null
)
create table authors_to_campus (
  campus_id INT not null,
   author_id INT not null
)
create table geometric_to_usertags (
  geometric_id INT not null,
   usertag_id INT not null
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
   primary key (comment_id)
)
create table programs (
  program_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (program_id)
)
create table authors_to_colleges (
  college_id INT not null,
   author_id INT not null
)
create table place_to_departments (
  department_id INT not null,
   place_id INT not null
)
create table field_types (
  field_type_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   model NVARCHAR(255) null,
   primary key (field_type_id)
)
create table view_to_usertags (
  view_id INT not null,
   usertag_id INT not null
)
create table place_to_categories (
  category_id INT not null,
   place_id INT not null
)
create table person_types (
  Id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   Deleted BIT null,
   attr NVARCHAR(255) null,
   primary key (Id)
)
create table comments (
  comment_id INT IDENTITY NOT NULL,
   comment NVARCHAR(255) null,
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
   view_id INT null,
   place_id INT null,
   primary key (comment_id)
)
create table categories (
  category_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (category_id)
)
create table media_types (
  media_type_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (media_type_id)
)
create table geometrics_to_types (
  geometric_id INT not null,
   geometrics_type_id INT not null
)
create table geometric_to_tags (
  geometric_id INT not null,
   tag_id INT not null
)
create table authors_to_programs (
  program_id INT not null,
   author_id INT not null
)
create table place_to_place_names (
  place_id INT not null,
   name_id INT not null
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
create table place_names (
  name_id INT IDENTITY NOT NULL,
   place_id INT null,
   name NVARCHAR(255) null,
   primary key (name_id)
)
create table place_to_tags (
  tag_id INT not null,
   place_id INT not null
)
alter table authors  add constraint FK99969F957CBA35BF foreign key (access_levels) references access_levels 
alter table geometric_to_media  add constraint FKA4F3119595CCB313 foreign key (geometric_id) references geometrics 
alter table map_views  add constraint FK7803751867805983 foreign key (view_status) references status 
alter table map_views  add constraint FK780375186F90B8EB foreign key (authors_editing) references authors 
alter table authors_to_geometrics  add constraint FK8212402895CCB313 foreign key (geometric_id) references geometrics 
alter table advertisement_to_tag  add constraint FKB5C89604AD5E0F0 foreign key (ad_id) references advertisement 
alter table place  add constraint FK5EA0A9E6F21FADC1 foreign key (place_status) references status 
alter table place  add constraint FK5EA0A9E66F90B8EB foreign key (authors_editing) references authors 
alter table place  add constraint FK5EA0A9E6B7600650 foreign key (media) references media_repo 
alter table authors_to_place_type  add constraint FK457B0CD53C8C945D foreign key (place_type_id) references authors 
alter table media_repo  add constraint FK9E230535E85519D9 foreign key (media_type_id) references media_types 
alter table place_to_place_types  add constraint FKB0BAEAC1D7214611 foreign key (place_id) references place 
alter table place_to_place_models  add constraint FK176926FED7214611 foreign key (place_id) references place 
alter table view_to_tags  add constraint FKCF7A140983E6244 foreign key (view_id) references map_views 
alter table geometrics  add constraint FKAA44A29FB7600650 foreign key (media) references media_repo 
alter table geometrics  add constraint FKAA44A29F1A9F0CDD foreign key (geometrics_status) references status 
alter table geometrics  add constraint FKAA44A29F6F90B8EB foreign key (authors_editing) references authors 
alter table place_to_usertags  add constraint FK84A60889D7214611 foreign key (place_id) references place 
alter table authors_to_view  add constraint FK3FDBF52C983E6244 foreign key (view_id) references map_views 
alter table place_to_media  add constraint FKA6E941EDD7214611 foreign key (place_id) references place 
alter table authors_to_media  add constraint FK765FB0C254A0A173 foreign key (author_id) references authors 
alter table advertisement_to_media  add constraint FKBFD8318AAD5E0F0 foreign key (ad_id) references advertisement 
alter table place_media  add constraint FK675D342CD72146119E230535 foreign key (place_id) references media_repo 
alter table place_media  add constraint FK675D342C330DD191 foreign key (media_id) references media_repo 
alter table fields  add constraint FKB995793DDA906D7 foreign key (field_type_id) references field_types 
alter table geometrics_media  add constraint FK879AC58795CCB313 foreign key (geometric_id) references geometrics 
alter table geometrics_media  add constraint FK879AC587330DD191 foreign key (media_id) references media_repo 
alter table authors_place  add constraint FKA474A663D7214611 foreign key (place_id) references place 
alter table authors_to_campus  add constraint FK5D9478D473EBBDD3 foreign key (campus_id) references authors 
alter table geometric_to_usertags  add constraint FKD8E7A66C95CCB313 foreign key (geometric_id) references geometrics 
alter table place_comments  add constraint FK676BA7235EA0A9E6 foreign key (place) references place 
alter table authors_to_colleges  add constraint FKA2EED20FB090BF9 foreign key (college_id) references authors 
alter table view_to_usertags  add constraint FK42F0059B983E6244 foreign key (view_id) references map_views 
alter table comments  add constraint FK909B63235EA0A9E6 foreign key (place) references place 
alter table comments  add constraint FK909B6323983E6244 foreign key (view_id) references map_views 
alter table comments  add constraint FK909B6323D7214611 foreign key (place_id) references place 
alter table geometrics_to_types  add constraint FKFFB888DD95CCB313 foreign key (geometric_id) references geometrics 
alter table geometric_to_tags  add constraint FKA745E41B95CCB313 foreign key (geometric_id) references geometrics 
alter table authors_to_programs  add constraint FK485F60429987D6E3 foreign key (program_id) references authors 
alter table place_to_place_names  add constraint FK5973EAB9D7214611 foreign key (place_id) references place 
alter table person  add constraint FK8C55D4CB5C8254F3 foreign key (personTypeId) references person_types 
alter table person  add constraint FK8C55D4CB8772812E foreign key (AccessLevelStatus) references access_levels 
alter table advertisement  add constraint FK3C482F677BBD9EE3 foreign key (place_types) references place_types 
alter table place_to_tags  add constraint FK94806F6BD7214611 foreign key (place_id) references place 
