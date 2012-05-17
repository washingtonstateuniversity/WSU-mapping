alter table place_to_infotabs  drop constraint FK5829AFCD7214611
alter table view_to_usertags  drop constraint FK42F0059B983E6244
alter table authors_to_place_type  drop constraint FK457B0CD554A0A173
alter table authors_to_media  drop constraint FK765FB0C254A0A173
alter table map_views  drop constraint FK7803751867805983
alter table map_views  drop constraint FK780375186F90B8EB
alter table geometrics_to_types  drop constraint FKFFB888DD95CCB313
alter table geometrics  drop constraint FKAA44A29FB7600650
alter table geometrics  drop constraint FKAA44A29F8A82A95D
alter table geometrics  drop constraint FKAA44A29FB93AEB6D
alter table geometrics  drop constraint FKAA44A29FB6465BAD
alter table styles  drop constraint FKEFA7BAC5C15430A6
alter table fields  drop constraint FKB995793DC15430A6
alter table geometrics_media  drop constraint FK879AC58795CCB313
alter table geometrics_media  drop constraint FK879AC587330DD191
alter table place_comments  drop constraint FK676BA7235EA0A9E6
alter table authors_to_categories  drop constraint FK670442CF54A0A173
alter table authors_to_colleges  drop constraint FKA2EED20FB090BF9
alter table geometric_to_media  drop constraint FKA4F3119595CCB313
alter table place_media  drop constraint FK675D342CD72146119E230535
alter table place_media  drop constraint FK675D342CD7214611
alter table place_media  drop constraint FK675D342C330DD191
alter table authors  drop constraint FK99969F957CBA35BF
alter table authors_to_geometrics  drop constraint FK8212402895CCB313
alter table media_repo  drop constraint FK9E230535E85519D9
alter table style_options  drop constraint FKAEABE8A7C15430A6
alter table style_options  drop constraint FKAEABE8A7A43605C5
alter table style_options  drop constraint FKAEABE8A7A2FD7916
alter table comments  drop constraint FK909B63235EA0A9E6
alter table comments  drop constraint FK909B6323983E6244
alter table comments  drop constraint FK909B6323D7214611
alter table geometric_to_tags  drop constraint FKA745E41B95CCB313
alter table place_to_fields  drop constraint FKA8D27D4DD7214611
alter table person  drop constraint FK8C55D4CB5C8254F3
alter table person  drop constraint FK8C55D4CB8772812E
alter table authors_to_view  drop constraint FK3FDBF52C983E6244
alter table advertisement_to_media  drop constraint FKBFD8318AAD5E0F0
alter table advertisement_to_tag  drop constraint FKB5C89604AD5E0F0
alter table events_set  drop constraint FK81190F62421CC800
alter table events_set  drop constraint FK81190F62BB078B2E
alter table place_to_tags  drop constraint FK94806F6BD7214611
alter table advertisement  drop constraint FK3C482F677BBD9EE3
alter table place_names  drop constraint FKEEB16F14E9D91D06
alter table place_to_categories  drop constraint FKA7B4C45DD7214611
alter table authors_to_campus  drop constraint FK5D9478D454A0A173
alter table place_to_usertags  drop constraint FK84A60889D7214611
alter table authors_to_place  drop constraint FK7A486C6BD7214611
alter table place_to_place_types  drop constraint FKB0BAEAC1D7214611
alter table view_to_tags  drop constraint FKCF7A140983E6244
alter table authors_to_programs  drop constraint FK485F604254A0A173
alter table place  drop constraint FK5EA0A9E67FA0BB1E
alter table place  drop constraint FK5EA0A9E659B84033
alter table place  drop constraint FK5EA0A9E66BABF776
alter table place  drop constraint FK5EA0A9E62C2DD501
alter table place  drop constraint FK5EA0A9E62F6A065B
alter table place  drop constraint FK5EA0A9E6B6465BAD
alter table place  drop constraint FK5EA0A9E68A82A95D
alter table place  drop constraint FK5EA0A9E6D3468FD0
alter table place  drop constraint FK5EA0A9E6B7600650
alter table place_to_place_names  drop constraint FK5973EAB9D7214611
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_infotabs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_infotabs
if exists (select * from dbo.sysobjects where id = object_id(N'place_name_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_name_types
if exists (select * from dbo.sysobjects where id = object_id(N'view_to_usertags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table view_to_usertags
if exists (select * from dbo.sysobjects where id = object_id(N'tags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table tags
if exists (select * from dbo.sysobjects where id = object_id(N'google_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table google_types
if exists (select * from dbo.sysobjects where id = object_id(N'departments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table departments
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_place_type') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_place_type
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_media
if exists (select * from dbo.sysobjects where id = object_id(N'style_to_events_set') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table style_to_events_set
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_types
if exists (select * from dbo.sysobjects where id = object_id(N'map_views') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table map_views
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_to_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_to_types
if exists (select * from dbo.sysobjects where id = object_id(N'style_option_types_to_geometrics_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table style_option_types_to_geometrics_types
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics
if exists (select * from dbo.sysobjects where id = object_id(N'style_to_style_options') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table style_to_style_options
if exists (select * from dbo.sysobjects where id = object_id(N'styles') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table styles
if exists (select * from dbo.sysobjects where id = object_id(N'fields') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table fields
if exists (select * from dbo.sysobjects where id = object_id(N'zoom_levels') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table zoom_levels
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_media
if exists (select * from dbo.sysobjects where id = object_id(N'place_comments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_comments
if exists (select * from dbo.sysobjects where id = object_id(N'geometric_events_to_events_set') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometric_events_to_events_set
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_categories') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_categories
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_colleges') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_colleges
if exists (select * from dbo.sysobjects where id = object_id(N'geometric_to_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometric_to_media
if exists (select * from dbo.sysobjects where id = object_id(N'programs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table programs
if exists (select * from dbo.sysobjects where id = object_id(N'place_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_media
if exists (select * from dbo.sysobjects where id = object_id(N'media_to_fields') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_to_fields
if exists (select * from dbo.sysobjects where id = object_id(N'field_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table field_types
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_to_styles') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_to_styles
if exists (select * from dbo.sysobjects where id = object_id(N'authors') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_geometrics') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_geometrics
if exists (select * from dbo.sysobjects where id = object_id(N'media_repo') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_repo
if exists (select * from dbo.sysobjects where id = object_id(N'categories') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table categories
if exists (select * from dbo.sysobjects where id = object_id(N'usertags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table usertags
if exists (select * from dbo.sysobjects where id = object_id(N'style_options') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table style_options
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_place_models') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_place_models
if exists (select * from dbo.sysobjects where id = object_id(N'comments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table comments
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_status') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_status
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_geometrics') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_geometrics
if exists (select * from dbo.sysobjects where id = object_id(N'style_option_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table style_option_types
if exists (select * from dbo.sysobjects where id = object_id(N'access_levels') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table access_levels
if exists (select * from dbo.sysobjects where id = object_id(N'infotabs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table infotabs
if exists (select * from dbo.sysobjects where id = object_id(N'geometric_to_tags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometric_to_tags
if exists (select * from dbo.sysobjects where id = object_id(N'style_to_zoom') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table style_to_zoom
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_fields') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_fields
if exists (select * from dbo.sysobjects where id = object_id(N'person') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table person
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_view') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_view
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_to_fields') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_to_fields
if exists (select * from dbo.sysobjects where id = object_id(N'google_types_to_place_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table google_types_to_place_types
if exists (select * from dbo.sysobjects where id = object_id(N'schools') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table schools
if exists (select * from dbo.sysobjects where id = object_id(N'logs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table logs
if exists (select * from dbo.sysobjects where id = object_id(N'advertisement_to_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table advertisement_to_media
if exists (select * from dbo.sysobjects where id = object_id(N'geometric_events') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometric_events
if exists (select * from dbo.sysobjects where id = object_id(N'advertisement_to_tag') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table advertisement_to_tag
if exists (select * from dbo.sysobjects where id = object_id(N'geometric_events_to_style_options') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometric_events_to_style_options
if exists (select * from dbo.sysobjects where id = object_id(N'events_set') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table events_set
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_tags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_tags
if exists (select * from dbo.sysobjects where id = object_id(N'media_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_types
if exists (select * from dbo.sysobjects where id = object_id(N'advertisement') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table advertisement
if exists (select * from dbo.sysobjects where id = object_id(N'place_names') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_names
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_categories') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_categories
if exists (select * from dbo.sysobjects where id = object_id(N'view_to_fields') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table view_to_fields
if exists (select * from dbo.sysobjects where id = object_id(N'person_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table person_types
if exists (select * from dbo.sysobjects where id = object_id(N'place_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_types
if exists (select * from dbo.sysobjects where id = object_id(N'status') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table status
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_campus') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_campus
if exists (select * from dbo.sysobjects where id = object_id(N'geometric_events_to_zoom') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometric_events_to_zoom
if exists (select * from dbo.sysobjects where id = object_id(N'place_models') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_models
if exists (select * from dbo.sysobjects where id = object_id(N'media_to_media_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_to_media_types
if exists (select * from dbo.sysobjects where id = object_id(N'colleges') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table colleges
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_usertags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_usertags
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_place') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_place
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_place_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_place_types
if exists (select * from dbo.sysobjects where id = object_id(N'view_to_tags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table view_to_tags
if exists (select * from dbo.sysobjects where id = object_id(N'campus') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table campus
if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_programs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_programs
if exists (select * from dbo.sysobjects where id = object_id(N'place_status') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_status
if exists (select * from dbo.sysobjects where id = object_id(N'place') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place
if exists (select * from dbo.sysobjects where id = object_id(N'place_to_place_names') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_place_names
create table place_to_infotabs (
  infotab_id INT not null,
   place_id INT not null
)
create table place_name_types (
  type_id INT IDENTITY NOT NULL,
   type NVARCHAR(255) null,
   primary key (type_id)
)
create table view_to_usertags (
  view_id INT not null,
   usertag_id INT not null
)
create table tags (
  tag_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (tag_id)
)
create table google_types (
  google_type_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   primary key (google_type_id)
)
create table departments (
  department_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (department_id)
)
create table authors_to_place_type (
  author_id INT not null,
   place_type_id INT not null
)
create table authors_to_media (
  author_id INT not null,
   media_id INT not null
)
create table style_to_events_set (
  style_id INT not null,
   events_set_id INT not null
)
create table geometrics_types (
  geometrics_type_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (geometrics_type_id)
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
create table geometrics_to_types (
  geometric_id INT not null,
   geometrics_type_id INT not null
)
create table style_option_types_to_geometrics_types (
  geometrics_type_id INT not null,
   style_option_type_id INT not null
)
create table geometrics (
  geometric_id INT IDENTITY NOT NULL,
   boundary geography null,
   name NVARCHAR(255) null,
   encoded NVARCHAR(255) null,
   staticMap NVARCHAR(255) null,
   publish_time DATETIME null,
   creation_date DATETIME null,
   updated_date DATETIME null,
   default_type INT null,
   status INT null,
   media INT null,
   author_editing INT null,
   primary key (geometric_id)
)
create table style_to_style_options (
  style_id INT not null,
   style_option_id INT not null
)
create table styles (
  style_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   type INT null,
   primary key (style_id)
)
create table fields (
  field_id INT IDENTITY NOT NULL,
   value NVARCHAR(255) null,
   owner INT null,
   type INT null,
   primary key (field_id)
)
create table zoom_levels (
  zoom_id INT IDENTITY NOT NULL,
   zoom_start INT null,
   zoom_end INT null,
   primary key (zoom_id)
)
create table geometrics_media (
  Id INT IDENTITY NOT NULL,
   geometric_order INT null,
   geometric_id INT null,
   media_id INT null,
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
   primary key (comment_id)
)
create table geometric_events_to_events_set (
  geometric_event_id INT not null,
   events_set_id INT not null
)
create table authors_to_categories (
  author_id INT not null,
   category_id INT not null
)
create table authors_to_colleges (
  college_id INT not null,
   author_id INT not null
)
create table geometric_to_media (
  geometric_id INT not null,
   media_id INT not null
)
create table programs (
  program_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (program_id)
)
create table place_media (
  Id INT IDENTITY NOT NULL,
   place_order INT null,
   place_id INT null,
   media_id INT null,
   primary key (Id)
)
create table media_to_fields (
  field_id INT not null,
   media_id INT not null
)
create table field_types (
  field_type_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   alias NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   model NVARCHAR(255) null,
   fieldset INT null,
   primary key (field_type_id)
)
create table geometrics_to_styles (
  style_id INT not null,
   geometric_id INT not null
)
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
create table authors_to_geometrics (
  author_id INT not null,
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
   orientation NVARCHAR(255) null,
   media_type_id INT null,
   primary key (media_id)
)
create table categories (
  category_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   level INT null,
   friendly_name NVARCHAR(255) null,
   primary key (category_id)
)
create table usertags (
  usertag_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (usertag_id)
)
create table style_options (
  style_option_id INT IDENTITY NOT NULL,
   value NVARCHAR(255) null,
   type INT null,
   event INT null,
   zoom INT null,
   primary key (style_option_id)
)
create table place_to_place_models (
  place_model_id INT not null,
   place_id INT not null
)
create table comments (
  comment_id INT IDENTITY NOT NULL,
   comment NVARCHAR(255) null,
   censored NVARCHAR(255) null,
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
create table geometrics_status (
  Id INT IDENTITY NOT NULL,
   Title NVARCHAR(255) null,
   primary key (Id)
)
create table place_to_geometrics (
  place_id INT not null,
   geometric_id INT not null
)
create table style_option_types (
  style_option_type_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   primary key (style_option_type_id)
)
create table access_levels (
  access_level_id INT IDENTITY NOT NULL,
   title NVARCHAR(255) null,
   primary key (access_level_id)
)
create table infotabs (
  infotab_id INT IDENTITY NOT NULL,
   content NVARCHAR(255) null,
   title NVARCHAR(255) null,
   sort INT null,
   primary key (infotab_id)
)
create table geometric_to_tags (
  geometric_id INT not null,
   tag_id INT not null
)
create table style_to_zoom (
  style_id INT not null,
   zoom_id INT not null
)
create table place_to_fields (
  place_id INT not null,
   field_id INT not null
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
create table authors_to_view (
  author_id INT not null,
   view_id INT not null,
   authors_id INT not null
)
create table geometrics_to_fields (
  field_id INT not null,
   geometric_id INT not null
)
create table google_types_to_place_types (
  google_type_id INT not null,
   place_type_id INT not null
)
create table schools (
  school_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (school_id)
)
create table logs (
  Id INT IDENTITY NOT NULL,
   logentry NVARCHAR(255) null,
   dtOfLog DATETIME null,
   primary key (Id)
)
create table advertisement_to_media (
  media_id INT not null,
   ad_id INT not null
)
create table geometric_events (
  geometric_event_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   friendly_name NVARCHAR(255) null,
   primary key (geometric_event_id)
)
create table advertisement_to_tag (
  ad_id INT not null,
   tag_id INT not null
)
create table geometric_events_to_style_options (
  geometric_event_id INT not null,
   style_option_id INT not null
)
create table events_set (
  events_set_id INT IDENTITY NOT NULL,
   style_id INT null,
   zoom_id INT null,
   primary key (events_set_id)
)
create table place_to_tags (
  tag_id INT not null,
   place_id INT not null
)
create table media_types (
  media_type_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (media_type_id)
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
   label INT null,
   primary key (name_id)
)
create table place_to_categories (
  category_id INT not null,
   place_id INT not null
)
create table view_to_fields (
  field_id INT not null,
   view_id INT not null
)
create table person_types (
  Id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   Deleted BIT null,
   attr NVARCHAR(255) null,
   primary key (Id)
)
create table place_types (
  place_type_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   friendly_name NVARCHAR(255) null,
   primary key (place_type_id)
)
create table status (
  status_id INT IDENTITY NOT NULL,
   title NVARCHAR(255) null,
   primary key (status_id)
)
create table authors_to_campus (
  author_id INT not null,
   campus_id INT not null
)
create table geometric_events_to_zoom (
  zoom_id INT not null,
   geometric_event_id INT not null
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
create table colleges (
  college_id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   attr NVARCHAR(255) null,
   primary key (college_id)
)
create table place_to_usertags (
  usertag_id INT not null,
   place_id INT not null
)
create table authors_to_place (
  author_id INT not null,
   place_id INT not null
)
create table place_to_place_types (
  place_type_id INT not null,
   place_id INT not null
)
create table view_to_tags (
  view_id INT not null,
   tag_id INT not null
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
create table authors_to_programs (
  author_id INT not null,
   program_id INT not null
)
create table place_status (
  Id INT IDENTITY NOT NULL,
   Title NVARCHAR(255) null,
   primary key (Id)
)
create table place (
  place_id INT IDENTITY NOT NULL,
   infoTitle NVARCHAR(255) null,
   prime_name NVARCHAR(255) null,
   abbrev_name NVARCHAR(255) null,
   summary NVARCHAR(255) null,
   details NVARCHAR(255) null,
   address NVARCHAR(255) null,
   street NVARCHAR(255) null,
   coordinate geography null,
   publish_time DATETIME null,
   creation_date DATETIME null,
   updated_date DATETIME null,
   plus_four_code tinyint null,
   isPublic BIT null,
   hideTitles BIT null,
   autoAccessibility BIT null,
   staticMap NVARCHAR(255) null,
   model INT null,
   status INT null,
   media INT null,
   school INT null,
   college INT null,
   campus INT null,
   program INT null,
   department INT null,
   author_editing INT null,
   primary key (place_id)
)
create table place_to_place_names (
  place_id INT not null,
   name_id INT not null
)
alter table place_to_infotabs  add constraint FK5829AFCD7214611 foreign key (place_id) references place 
alter table view_to_usertags  add constraint FK42F0059B983E6244 foreign key (view_id) references map_views 
alter table authors_to_place_type  add constraint FK457B0CD554A0A173 foreign key (author_id) references authors 
alter table authors_to_media  add constraint FK765FB0C254A0A173 foreign key (author_id) references authors 
alter table map_views  add constraint FK7803751867805983 foreign key (view_status) references status 
alter table map_views  add constraint FK780375186F90B8EB foreign key (authors_editing) references authors 
alter table geometrics_to_types  add constraint FKFFB888DD95CCB313 foreign key (geometric_id) references geometrics 
alter table geometrics  add constraint FKAA44A29FB7600650 foreign key (media) references media_repo 
alter table geometrics  add constraint FKAA44A29F8A82A95D foreign key (status) references status 
alter table geometrics  add constraint FKAA44A29FB93AEB6D foreign key (default_type) references geometrics_types 
alter table geometrics  add constraint FKAA44A29FB6465BAD foreign key (author_editing) references authors 
alter table styles  add constraint FKEFA7BAC5C15430A6 foreign key (type) references geometrics_types 
alter table fields  add constraint FKB995793DC15430A6 foreign key (type) references field_types 
alter table geometrics_media  add constraint FK879AC58795CCB313 foreign key (geometric_id) references geometrics 
alter table geometrics_media  add constraint FK879AC587330DD191 foreign key (media_id) references media_repo 
alter table place_comments  add constraint FK676BA7235EA0A9E6 foreign key (place) references place 
alter table authors_to_categories  add constraint FK670442CF54A0A173 foreign key (author_id) references authors 
alter table authors_to_colleges  add constraint FKA2EED20FB090BF9 foreign key (college_id) references authors 
alter table geometric_to_media  add constraint FKA4F3119595CCB313 foreign key (geometric_id) references geometrics 
alter table place_media  add constraint FK675D342CD72146119E230535 foreign key (place_id) references media_repo 
alter table place_media  add constraint FK675D342CD7214611 foreign key (place_id) references place 
alter table place_media  add constraint FK675D342C330DD191 foreign key (media_id) references media_repo 
alter table authors  add constraint FK99969F957CBA35BF foreign key (access_levels) references access_levels 
alter table authors_to_geometrics  add constraint FK8212402895CCB313 foreign key (geometric_id) references geometrics 
alter table media_repo  add constraint FK9E230535E85519D9 foreign key (media_type_id) references media_types 
alter table style_options  add constraint FKAEABE8A7C15430A6 foreign key (type) references style_option_types 
alter table style_options  add constraint FKAEABE8A7A43605C5 foreign key (zoom) references zoom_levels 
alter table style_options  add constraint FKAEABE8A7A2FD7916 foreign key (event) references geometric_events 
alter table comments  add constraint FK909B63235EA0A9E6 foreign key (place) references place 
alter table comments  add constraint FK909B6323983E6244 foreign key (view_id) references map_views 
alter table comments  add constraint FK909B6323D7214611 foreign key (place_id) references place 
alter table geometric_to_tags  add constraint FKA745E41B95CCB313 foreign key (geometric_id) references geometrics 
alter table place_to_fields  add constraint FKA8D27D4DD7214611 foreign key (place_id) references place 
alter table person  add constraint FK8C55D4CB5C8254F3 foreign key (personTypeId) references person_types 
alter table person  add constraint FK8C55D4CB8772812E foreign key (AccessLevelStatus) references access_levels 
alter table authors_to_view  add constraint FK3FDBF52C983E6244 foreign key (view_id) references map_views 
alter table advertisement_to_media  add constraint FKBFD8318AAD5E0F0 foreign key (ad_id) references advertisement 
alter table advertisement_to_tag  add constraint FKB5C89604AD5E0F0 foreign key (ad_id) references advertisement 
alter table events_set  add constraint FK81190F62421CC800 foreign key (style_id) references styles 
alter table events_set  add constraint FK81190F62BB078B2E foreign key (zoom_id) references zoom_levels 
alter table place_to_tags  add constraint FK94806F6BD7214611 foreign key (place_id) references place 
alter table advertisement  add constraint FK3C482F677BBD9EE3 foreign key (place_types) references place_types 
alter table place_names  add constraint FKEEB16F14E9D91D06 foreign key (label) references place_name_types 
alter table place_to_categories  add constraint FKA7B4C45DD7214611 foreign key (place_id) references place 
alter table authors_to_campus  add constraint FK5D9478D454A0A173 foreign key (author_id) references authors 
alter table place_to_usertags  add constraint FK84A60889D7214611 foreign key (place_id) references place 
alter table authors_to_place  add constraint FK7A486C6BD7214611 foreign key (place_id) references place 
alter table place_to_place_types  add constraint FKB0BAEAC1D7214611 foreign key (place_id) references place 
alter table view_to_tags  add constraint FKCF7A140983E6244 foreign key (view_id) references map_views 
alter table authors_to_programs  add constraint FK485F604254A0A173 foreign key (author_id) references authors 
alter table place  add constraint FK5EA0A9E67FA0BB1E foreign key (program) references programs 
alter table place  add constraint FK5EA0A9E659B84033 foreign key (college) references colleges 
alter table place  add constraint FK5EA0A9E66BABF776 foreign key (department) references departments 
alter table place  add constraint FK5EA0A9E62C2DD501 foreign key (campus) references campus 
alter table place  add constraint FK5EA0A9E62F6A065B foreign key (model) references place_models 
alter table place  add constraint FK5EA0A9E6B6465BAD foreign key (author_editing) references authors 
alter table place  add constraint FK5EA0A9E68A82A95D foreign key (status) references status 
alter table place  add constraint FK5EA0A9E6D3468FD0 foreign key (school) references schools 
alter table place  add constraint FK5EA0A9E6B7600650 foreign key (media) references media_repo 
alter table place_to_place_names  add constraint FK5973EAB9D7214611 foreign key (place_id) references place 
