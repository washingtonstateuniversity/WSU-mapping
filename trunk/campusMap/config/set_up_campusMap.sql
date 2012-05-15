USE [campusMap]
GO

/****** Object:  Table [dbo].[place_names]    Script Date: 11/15/2011 14:00:04 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

/* lets reset the DB start by removing tables and indexes */

/* clear functions */
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CalculateDistance]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
DROP FUNCTION [dbo].[CalculateDistance]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[LatitudePlusDistance]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
DROP FUNCTION [dbo].[LatitudePlusDistance]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[LongitudePlusDistance]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
DROP FUNCTION [dbo].[LongitudePlusDistance]
GO

IF  EXISTS (SELECT * FROM sys.indexes  WHERE name  = N'[SIndx_place_geography_coordinate]')
DROP INDEX [SIndx_place_geography_coordinate] ON [dbo].[place]
GO
IF  EXISTS (SELECT * FROM sys.indexes  WHERE name  = N'[SIndx_place_geography_coordinate2]')
DROP INDEX [SIndx_place_geography_coordinate2] ON [dbo].[place]
GO
IF  EXISTS (SELECT * FROM sys.indexes  WHERE name  = N'[SIndx_place_geography_coordinate3]')
DROP INDEX [SIndx_place_geography_coordinate3] ON [dbo].[place]
GO

/* */
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[google_types_to_place_types]') AND type in (N'U'))
DROP TABLE [dbo].[google_types_to_place_types]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[google_types]') AND type in (N'U'))
DROP TABLE [dbo].[google_types]


/* delete ties the are using Fkeys first */
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_media]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_media]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_campus]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_campus]

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_place_types]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_place_types]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_place_models]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_place_models]


IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_categories]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_categories]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_tags]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_tags]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_departments]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_departments]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_colleges]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_colleges]	
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_schools]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_schools]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_programs]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_programs]	
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_geometrics]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_geometrics]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_usertags]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_usertags]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_place_names]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_place_names]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_fields]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_fields]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_comments]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_comments]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_to_infotabs]') AND type in (N'U'))
DROP TABLE [dbo].[place_to_infotabs]


IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_names]') AND type in (N'U'))
DROP TABLE [dbo].[place_names]





IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[geometrics_to_styles]') AND type in (N'U'))
DROP TABLE [dbo].[geometrics_to_styles]

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[style_to_style_options]') AND type in (N'U'))
DROP TABLE [dbo].[style_to_style_options]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[geometric_events_to_geometrics_types]') AND type in (N'U'))
DROP TABLE [dbo].[geometric_events_to_geometrics_types]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[style_option_types_to_geometrics_types]') AND type in (N'U'))
DROP TABLE [dbo].[style_option_types_to_geometrics_types]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[style_option_types_to_geometrics_to_types]') AND type in (N'U'))
DROP TABLE [dbo].[style_option_types_to_geometrics_to_types]

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[geometric_events_to_style_options]') AND type in (N'U'))
DROP TABLE [dbo].[geometric_events_to_style_options]



IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[geometrics_to_types]') AND type in (N'U'))
DROP TABLE [dbo].[geometrics_to_types]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[geometrics_to_fields]') AND type in (N'U'))
DROP TABLE [dbo].[geometrics_to_fields]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[geometric_to_tags]') AND type in (N'U'))
DROP TABLE [dbo].[geometric_to_tags]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[geometric_to_usertags]') AND type in (N'U'))
DROP TABLE [dbo].[geometric_to_usertags]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[geometric_to_media]') AND type in (N'U'))
DROP TABLE [dbo].[geometric_to_media]



IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[advertisement_to_media]') AND type in (N'U'))
DROP TABLE [dbo].[advertisement_to_media]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[advertisement_to_tag]') AND type in (N'U'))
DROP TABLE [dbo].[advertisement_to_tag]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ad_to_field_types]') AND type in (N'U'))
DROP TABLE [dbo].[ad_to_field_types]



IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[authors_to_programs]') AND type in (N'U'))
DROP TABLE [dbo].[authors_to_programs]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[authors_to_campus]') AND type in (N'U'))
DROP TABLE [dbo].[authors_to_campus]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[authors_to_place_type]') AND type in (N'U'))
DROP TABLE [dbo].[authors_to_place_type]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[authors_to_colleges]') AND type in (N'U'))
DROP TABLE [dbo].[authors_to_colleges]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[authors_to_place]') AND type in (N'U'))
DROP TABLE [dbo].[authors_to_place]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[authors_to_view]') AND type in (N'U'))
DROP TABLE [dbo].[authors_to_view]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[authors_to_media]') AND type in (N'U'))
DROP TABLE [dbo].[authors_to_media]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[authors_to_geometrics]') AND type in (N'U'))
DROP TABLE [dbo].[authors_to_geometrics]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[authors_to_categories]') AND type in (N'U'))
DROP TABLE [dbo].[authors_to_categories]


IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[view_to_usertags]') AND type in (N'U'))
DROP TABLE [dbo].[view_to_usertags]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[view_to_tags]') AND type in (N'U'))
DROP TABLE [dbo].[view_to_tags]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[view_to_fields]') AND type in (N'U'))
DROP TABLE [dbo].[view_to_fields]
/* IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[view_to_field_types]') AND type in (N'U'))
DROP TABLE [dbo].[view_to_field_types] */



/* IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[category_to_field_types]') AND type in (N'U'))
DROP TABLE [dbo].[category_to_field_types]*/




IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[style_to_events_set]') AND type in (N'U'))
DROP TABLE [dbo].[style_to_events_set]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[geometric_events_to_events_set]') AND type in (N'U'))
DROP TABLE [dbo].[geometric_events_to_events_set]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[events_set]') AND type in (N'U'))
DROP TABLE [dbo].[events_set]



IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[geometric_events_to_zoom]') AND type in (N'U'))
DROP TABLE [dbo].[geometric_events_to_zoom]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[style_to_zoom]') AND type in (N'U'))
DROP TABLE [dbo].[style_to_zoom]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[zoom_levels]') AND type in (N'U'))
DROP TABLE [dbo].[zoom_levels]
	
	
	

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[media_to_media_types]') AND type in (N'U'))
DROP TABLE [dbo].[media_to_media_types]
/* IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[media_to_field_types]') AND type in (N'U'))
DROP TABLE [dbo].[media_to_field_types] */
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[media_to_fields]') AND type in (N'U'))
DROP TABLE [dbo].[media_to_fields]
GO



IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[logs]') AND type in (N'U'))
DROP TABLE [dbo].[logs]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[status]') AND type in (N'U'))
DROP TABLE [dbo].[status]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[access_levels]') AND type in (N'U'))
DROP TABLE [dbo].[access_levels]

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[authors]') AND type in (N'U'))
DROP TABLE [dbo].[authors]


IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[media_types]') AND type in (N'U'))
DROP TABLE [dbo].[media_types]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[media_repo]') AND type in (N'U'))
DROP TABLE [dbo].[media_repo]


IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[categories]') AND type in (N'U'))
DROP TABLE [dbo].[categories]



IF  EXISTS (SELECT * FROM sys.check_constraints WHERE object_id = OBJECT_ID(N'[dbo].[CK_campus_zipcode_check]') AND parent_object_id = OBJECT_ID(N'[dbo].[campus]'))
ALTER TABLE [dbo].[campus] DROP CONSTRAINT [CK_campus_zipcode_check]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[campus]') AND type in (N'U'))
DROP TABLE [dbo].[campus]

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[departments]') AND type in (N'U'))
DROP TABLE [dbo].[departments]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[colleges]') AND type in (N'U'))
DROP TABLE [dbo].[colleges]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[schools]') AND type in (N'U'))
DROP TABLE [dbo].[schools]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[programs]') AND type in (N'U'))
DROP TABLE [dbo].[programs]




IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usertags]') AND type in (N'U'))
DROP TABLE [dbo].[usertags]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tags]') AND type in (N'U'))
DROP TABLE [dbo].[tags]


IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[map_views]') AND type in (N'U'))
DROP TABLE [dbo].[map_views]

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[advertisement_media]') AND type in (N'U'))
DROP TABLE [dbo].[advertisement_media]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[advertisement]') AND type in (N'U'))
DROP TABLE [dbo].[advertisement]

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[comments]') AND type in (N'U'))
DROP TABLE [dbo].[comments]

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[infotabs]') AND type in (N'U'))
DROP TABLE [dbo].[infotabs]


IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[person_types]') AND type in (N'U'))
DROP TABLE [dbo].[person_types]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[person]') AND type in (N'U'))
DROP TABLE [dbo].[person]



IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[field_to_field_types]') AND type in (N'U'))
DROP TABLE [dbo].[field_to_field_types]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[field_types]') AND type in (N'U'))
DROP TABLE [dbo].[field_types]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[fields]') AND type in (N'U'))
DROP TABLE [dbo].[fields]


IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[style_option_types]') AND type in (N'U'))
DROP TABLE [dbo].[style_option_types]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[style_options]') AND type in (N'U'))
DROP TABLE [dbo].[style_options]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[styles]') AND type in (N'U'))
DROP TABLE [dbo].[styles]

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[geometric_events]') AND type in (N'U'))
DROP TABLE [dbo].[geometric_events]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[geometrics_media]') AND type in (N'U'))
DROP TABLE [dbo].[geometrics_media]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[geometrics_types]') AND type in (N'U'))
DROP TABLE [dbo].[geometrics_types]



IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_models]') AND type in (N'U'))
DROP TABLE [dbo].[place_models]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_types]') AND type in (N'U'))
DROP TABLE [dbo].[place_types]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_media]') AND type in (N'U'))
DROP TABLE [dbo].[place_media]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_names]') AND type in (N'U'))
DROP TABLE [dbo].[place_names]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place_name_types]') AND type in (N'U'))
DROP TABLE [dbo].[place_name_types]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PlaceByUser]') AND type in (N'U'))
DROP TABLE [dbo].[PlaceByUser]


/* do this last as everything is keyed to it */
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[geometrics]') AND type in (N'U'))
DROP TABLE [dbo].[geometrics]
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[place]') AND type in (N'U'))
DROP TABLE [dbo].[place]
GO

/* dorp catalogs */
IF  EXISTS (SELECT * FROM sysfulltextcatalogs ftc WHERE ftc.name = N'ft_viewbyname')
DROP FULLTEXT CATALOG [ft_viewbyname]
IF  EXISTS (SELECT * FROM sysfulltextcatalogs ftc WHERE ftc.name = N'ft_placebyname')
DROP FULLTEXT CATALOG [ft_placebyname]
IF  EXISTS (SELECT * FROM sysfulltextcatalogs ftc WHERE ftc.name = N'ft_catbyname')
DROP FULLTEXT CATALOG [ft_catbyname]
IF  EXISTS (SELECT * FROM sysfulltextcatalogs ftc WHERE ftc.name = N'ft_tagbyname')
DROP FULLTEXT CATALOG [ft_tagbyname]
IF  EXISTS (SELECT * FROM sysfulltextcatalogs ftc WHERE ftc.name = N'ft_departmentbyname')
DROP FULLTEXT CATALOG [ft_departmentbyname]
IF  EXISTS (SELECT * FROM sysfulltextcatalogs ftc WHERE ftc.name = N'ft_collegebyname')
DROP FULLTEXT CATALOG [ft_collegebyname]
IF  EXISTS (SELECT * FROM sysfulltextcatalogs ftc WHERE ftc.name = N'ft_schoolbyname')
DROP FULLTEXT CATALOG [ft_schoolbyname]
IF  EXISTS (SELECT * FROM sysfulltextcatalogs ftc WHERE ftc.name = N'ft_programbyname')
DROP FULLTEXT CATALOG [ft_programbyname]
IF  EXISTS (SELECT * FROM sysfulltextcatalogs ftc WHERE ftc.name = N'ft_usertagbyname')
DROP FULLTEXT CATALOG [ft_usertagbyname]
IF  EXISTS (SELECT * FROM sysfulltextcatalogs ftc WHERE ftc.name = N'ft_media_typebyname')
DROP FULLTEXT CATALOG [ft_media_typebyname]
GO



	CREATE TABLE [dbo].[place](
		[place_id] [int] IDENTITY(1,1) NOT NULL,
		[infoTitle] [nvarchar](max) NULL,
		[prime_name] [nvarchar](max) NOT NULL,
		[abbrev_name] [nchar](10) NULL,
		[address] [nvarchar](max) NULL,
		[street] [nvarchar](max) NULL,
		[publish_time] [datetime] DEFAULT GETDATE(),
		[creation_date] [datetime] DEFAULT GETDATE(),
		[updated_date] [datetime] DEFAULT GETDATE(),
		[coordinate] [geography] NULL,
		[author_editing] [int] NULL,
		[status] [int] NULL,
		[media] [int] NULL,
		[model] [int] NULL,
		[geometrics] [int] NULL,
		[tmp] [bit] DEFAULT 1,
		[isPublic] [bit] DEFAULT 1,
		[hideTitles] [bit] DEFAULT 0,
		[autoAccessibility] [bit] DEFAULT 1,
		[college] [int] NULL,
		[school] [int] NULL,
		[summary] [nvarchar](max) NULL,		
		[details] [nvarchar](max) NULL,	
		[staticMap] [nvarchar](max) NULL,				
		[campus] [int] NULL,
		[program] [int] NULL,
		[department] [int] NULL,
		[plus_four_code] [int] NULL  DEFAULT '99164',
			/*CONSTRAINT [CK_plus_four_code_check] 
			CHECK ([plus_four_code] LIKE '[0-9][0-9][0-9][0-9]' AND [plus_four_code] NOT LIKE '0000'),*/
		/* COME BACK TO AND CHECK THIS */
		CONSTRAINT [PK_place] PRIMARY KEY CLUSTERED 
		(
			[place_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	/* create the indexing by long and lats (note this highlights the server's low resources) */
	CREATE SPATIAL INDEX SIndx_place_geography_coordinate
	   ON [place]([coordinate])
	   USING GEOGRAPHY_GRID
	   WITH (
		GRIDS =(LEVEL_1 = MEDIUM,LEVEL_2 = MEDIUM,LEVEL_3 = MEDIUM,LEVEL_4 = MEDIUM), 
		CELLS_PER_OBJECT = 64,
		PAD_INDEX  = ON,
		SORT_IN_TEMPDB = OFF,
		DROP_EXISTING = OFF,
		ALLOW_ROW_LOCKS  = ON,
		ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	GO  
	 
	/* create the indexing by primary name */
	CREATE UNIQUE INDEX ui_place_prime_name ON [place]([place_id]);
	CREATE FULLTEXT CATALOG ft_placebyname AS DEFAULT;
	CREATE FULLTEXT INDEX ON [place]([prime_name])
		KEY INDEX ui_place_prime_name 
		WITH STOPLIST = SYSTEM;
	GO

	/* create the indexing by long and lats 
	CREATE SPATIAL INDEX SIndx_SpatialTable_place_geography_coordinate
	   ON [place]([coordinate]);
	GO
	*/



	/* CREATE SPATIAL INDEX SIndx_place_geography_coordinate3
	   ON [place]([coordinate])
	   WITH ( GRIDS = ( LEVEL_3 = HIGH, LEVEL_2 = HIGH ) );
	GO */
	CREATE TABLE [dbo].[map_views](
		[view_id] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](max) NOT NULL,
		[cache_path] [nchar](10) NULL,
		[street_address] [nvarchar](max) NULL,
		[published] [datetime] DEFAULT GETDATE(),
		[created] [datetime] DEFAULT GETDATE(),
		[updated] [datetime] DEFAULT GETDATE(),
		[center] [geography] NULL,
		[checked_out_by] [nvarchar](max) NOT NULL,
		[width] [int] NULL,
		[height] [int] NULL,
		[view_status] [int] NULL,
		[authors_editing] [int] NULL,
		[commentable] [BIT] NULL,
		[sharable] [BIT] NULL,
		CONSTRAINT [PK_view] PRIMARY KEY CLUSTERED 
		(
			[view_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	/* create the indexing by long and lats (note this highlights the server's low resources) */
	CREATE SPATIAL INDEX SIndx_place_geography_coordinate2
	   ON [place]([coordinate])
	   USING GEOGRAPHY_GRID
	   WITH (
		GRIDS =(LEVEL_1 = MEDIUM,LEVEL_2 = MEDIUM,LEVEL_3 = MEDIUM,LEVEL_4 = MEDIUM), 
		CELLS_PER_OBJECT = 64,
		PAD_INDEX  = ON,
		SORT_IN_TEMPDB = OFF,
		DROP_EXISTING = OFF,
		ALLOW_ROW_LOCKS  = ON,
		ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	GO  
	
	/* create the indexing by primary name */
	CREATE UNIQUE INDEX ui_view_name ON [map_views]([view_id]);
	CREATE FULLTEXT CATALOG ft_viewbyname AS DEFAULT;
	CREATE FULLTEXT INDEX ON [map_views]([name])
		KEY INDEX ui_view_name 
		WITH STOPLIST = SYSTEM;
	GO

	/* create the indexing by long and lats */
	CREATE SPATIAL INDEX SIndx_SpatialTable_place_geography_coordinate
	   ON [place]([coordinate]);
	GO

	/* */
	CREATE SPATIAL INDEX SIndx_place_geography_coordinate3 
	   ON [place]([coordinate])
	   WITH ( GRIDS = ( LEVEL_3 = HIGH, LEVEL_2 = HIGH ) );
	GO 
	

	CREATE TABLE [dbo].[status](
		[status_id] [int] IDENTITY(1,1) NOT NULL,
		[title] [nvarchar](max) NOT NULL
   		CONSTRAINT [PK_status] PRIMARY KEY CLUSTERED 
		(
			[status_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[status]
			   (title)
		 VALUES
			   ('draft'),
			   ('review'),
			   ('published')
	GO


	CREATE TABLE [dbo].[place_names](
		[name_id] [int] IDENTITY(1,1) NOT NULL,
		[place_id] [int] NOT NULL DEFAULT 1
			CONSTRAINT [FK_place_to_names] FOREIGN KEY ([place_id])
			REFERENCES [place] ([place_id]),
		[name] [nvarchar](max)  NOT NULL,
		[label] [int] NOT NULL
		CONSTRAINT [PK_place_names] PRIMARY KEY CLUSTERED 
		(
			[name_id] ASC 
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
		CREATE UNIQUE INDEX ui_place_names ON [place_names]([name_id]);
	GO
	CREATE TABLE [dbo].[place_name_types](
		[type_id] [int] IDENTITY(1,1) NOT NULL,
		[type] [nvarchar](max)  NOT NULL
		CONSTRAINT [PK_place_name_types] PRIMARY KEY CLUSTERED 
		(
			[type_id] ASC 
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	INSERT INTO [campusMap].[dbo].[place_name_types]
			   ([type])
		 VALUES
			   ('Official Name'),
			   ('Local Name'),
			   ('Obscure or Historic Name')
	GO

	CREATE TABLE [dbo].[geometrics](
		[geometric_id] [int] IDENTITY(1,1) NOT NULL,
		[boundary] [geography] NULL,
		[name] [nvarchar](max) NULL,
		[encoded] [nvarchar](max) NULL,
		[staticMap] [nvarchar](max) NULL,	
		[default_type] [int] NULL,
		[publish_time] [datetime] DEFAULT GETDATE(),
		[creation_date] [datetime] DEFAULT GETDATE(),
		[updated_date] [datetime] DEFAULT GETDATE(),
		[author_editing] [int] NULL,
		[status] [int] NULL,
		[media] [int] NULL,
		CONSTRAINT [PK_geometrics] PRIMARY KEY CLUSTERED 
		(
			[geometric_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[geometrics]
			   ([name],[encoded],[default_type],[status])
		 VALUES
			   ('WSU vortex action','icg|Ghq`jUp\nc@fL}b@qSap@cPd_@vOza@|JqNqJ}ZaEbHhFpNqCgNdAmArE|PmC~EeHcWrE_JpOpYcI`ZeZoX',3,1),/*LINE*/
			   ('a long name for a long place','{cg|Glv`jUsNlP~Pa@wAhVfKuN|BdVbDcW`JbO}AmSrN?aJqKzKkDoKeI`JeLkMnBPyRkH`OwFkWUbWoIyQ|CxUsNyJvHfQkQ|A|OpFVqCx@qCdAkBhByAvAzCSbVwAhFZVjAmCdD}@LsGoB}@CwBHy@bBc@@{G{Cc@aAkB~ByAzBGjCPvBDrB|BbA|AZzC\~E]bGs@vE{AlDeBh@aC\gCb@iC?cDaA{BoC_AwEc@mG',3,1)/*Polygon*/
	GO


	CREATE TABLE [dbo].[geometrics_types](
		[geometrics_type_id] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](max) NOT NULL,
		[attr] [nvarchar](max) NULL,
		CONSTRAINT [PK_geometrics_type] PRIMARY KEY CLUSTERED 
		(
			[geometrics_type_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[geometrics_types]
			   ([name])
		 VALUES
			   ('marker'),('polyline'),('polygon'),('rectangle'),('circle')
	GO

	CREATE TABLE [dbo].[campus](
		[campus_id] [int] IDENTITY(1,1) NOT NULL,
		[name] [VARCHAR](200) NULL,
		[city] [VARCHAR](200) NULL,
		[state] [VARCHAR](50) NULL,
		[state_abbrev] [VARCHAR](2) NULL,
		[latitude] [DECIMAL](8,5) NULL,
		[longitude] [DECIMAL](8,5) NULL,
		[zipcode] [int] NULL
			CONSTRAINT [CK_campus_zipcode_check] 
			CHECK ([zipcode] LIKE '[0-9][0-9][0-9][0-9][0-9]' AND [zipcode] NOT LIKE '00000'),
		CONSTRAINT [PK_campus] PRIMARY KEY CLUSTERED
		(
			[campus_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	CREATE NONCLUSTERED INDEX IX_campus_longitude_latitude ON dbo.[campus]([longitude],[latitude], [zipcode])
	GO

/* Make functions to set up the searching but radius of a zip */
	CREATE FUNCTION [dbo].[CalculateDistance]
		(@Longitude1 DECIMAL(8,5), 
		@Latitude1   DECIMAL(8,5),
		@Longitude2  DECIMAL(8,5),
		@Latitude2   DECIMAL(8,5))
	RETURNS FLOAT
	AS
	BEGIN
	DECLARE @Temp FLOAT
	SET @Temp = SIN(@Latitude1/57.2957795130823) * SIN(@Latitude2/57.2957795130823) + COS(@Latitude1/57.2957795130823) * COS(@Latitude2/57.2957795130823) * COS(@Longitude2/57.2957795130823 - @Longitude1/57.2957795130823)
	IF @Temp > 1 
		SET @Temp = 1
	ELSE IF @Temp < -1
		SET @Temp = -1
	RETURN (3958.75586574 * ACOS(@Temp))
	END
	GO

	CREATE FUNCTION [dbo].[LatitudePlusDistance](@StartLatitude FLOAT, @Distance FLOAT) RETURNS FLOAT
	AS
	BEGIN
		RETURN (SELECT @StartLatitude + SQRT(@Distance * @Distance / 4766.8999155991))
		END
	GO

	CREATE FUNCTION [dbo].[LongitudePlusDistance]
		(@StartLongitude FLOAT,
		@StartLatitude FLOAT,
		@Distance FLOAT)
	RETURNS FLOAT
	AS
	BEGIN
		RETURN (SELECT @StartLongitude + SQRT(@Distance * @Distance / (4784.39411916406 * COS(2 * @StartLatitude / 114.591559026165) * COS(2 * @StartLatitude / 114.591559026165))))
		END
	GO
	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[campus]
			   ([name],[city],[state],[state_abbrev],[latitude],[longitude],[zipcode])
		 VALUES
			   ('Pullman','Pullman','Washington','WA',46.7320368670458,-117.15451240539551,'99163'),
			   ('Tri-Cities','Richland','Washington','WA',46.32994669896143,-119.26323562860489,'99354'),
			   ('Vancouver','Vancouver','Washington','WA',45.73226906648018,-122.63564944267273,'98686'),
			   ('Riverpoint','Spokane','Washington','WA',47.66110972448931,-117.40625381469726,'99210')
	GO

	CREATE TABLE [dbo].[place_models](
		[place_model_id] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](max) NOT NULL,
		[attr] [nvarchar](max) NULL,
		CONSTRAINT [PK_place_models] PRIMARY KEY CLUSTERED 
		(
			[place_model_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[place_models]
			   ([name])
		 VALUES
			   ('Place'),
			   ('Building'),
			   ('Route'),
			   ('Area')
	GO


	CREATE TABLE [dbo].[place_types](
		[place_type_id] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](max) NOT NULL,
		[friendly_name] [nvarchar](max) NULL,
		CONSTRAINT [PK_place_type] PRIMARY KEY CLUSTERED 
		(
			[place_type_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	/* add some defaults  --- this is google types now.. respect that..  */
	INSERT INTO [campusMap].[dbo].[place_types]
			   ([name],[friendly_name])
		 VALUES
('accounting','Accounting'),
('administrative_area_level_1','Administrative area level 1'),
('administrative_area_level_2','Administrative area level 2'),
('administrative_area_level_3','Administrative area level 3'),
('airport','Airport'),
('apartments','Apartments'),
('arenas','Arenas'),
('aquarium','Aquarium'),
('art_gallery','Art gallery'),
('athletic_facilities','Athletic Facilities'),
('athletic_field','Athletic Field'),
('atm','ATM'),
('auditorium','Auditorium'),
('bakery','Bakery'),
('ballrooms','Ballrooms'),
('bank','Bank'),
('bar','Bar'),
('basketball_court','Basketball Court'),
('beauty_salon','Beauty Salon'),
('bicycle_store','Bicycle Store'),
('bike_sharing_station','Bike Sharing Station'),
('book_store','Book Store'),
('bowling_alley','Bowling Alley'),
('building','Building'),
('bus_station','Bus Station'),
('cafe','Cafe'),
('campground','Campground'),
('car_dealer','Car dealer'),
('car_rental','Car rental'),
('car_repair','Car repair'),
('car_wash','Car wash'),
('casino','Casino'),
('cemetery','Cemetery'),
('cheese_shop','Cheese Shop'),
('childcare_services','Childcare services'),
('church','Church'),
('city_hall','City hall'),
('classrooms','Classrooms'),
('clothing_store','Clothing store'),
('coffee_shop','Coffee shop'),
('colloquial_area','Colloquial area'),
('convenience_store','Convenience store'),
('counselors','Counselors'),
('country','Country'),
('courthouse','Courthouse'),
('cultural_center','Cultural center'),
('dentist','Dentist'),
('department_store','Department store'),
('doctor','Doctor'),
('electrician','Electrician'),
('electronics_store','Electronics store'),
('embassy','Embassy'),
('entertainment','Entertainment'),
('espresso_bar','Espresso bar'),
('establishment','Establishment'),
('event_ticket_outlet','Event ticket outlet'),
('faculty','Faculty'),
('fast_food','Fast food'),
('finance','Finance'),
('fire_station','Fire station'),
('floor','Floor'),
('florist','Florist'),
('food','Food'),
('football_field','Football Field'),
('football_stadium','Football Stadium'),
('funeral_home','Funeral home'),
('furniture_store','Furniture store'),
('garden','Garden'),
('gas_station','Gas station'),
('general_contractor','General contractor'),
('geocode','Geocode'),
('gift_shop','Gift shop'),
('greenhouse','Greenhouse'),
('grocery','Grocery'),
('gym','Gym'),
('hair_care','Hair care'),
('hardware_store','Hardware store'),
('health','Health'),
('health_medical_services','Health & Medical Services'),
('hindu_temple','Hindu temple'),
('historical_landmark','Historical landmark'),
('home_goods_store','Home goods store'),
('hospital','Hospital'),
('ice_cream_shop','Ice Cream Shop'),
('instruction','Instruction'),
('insurance_agency','Insurance agency'),
('intersection','Intersection'),
('jewelry_store','Jewelry store'),
('laboratories','Laboratories'),
('laundry','Laundry'),
('lawyer','Lawyer'),
('library','Library'),
('liquor_store','Liquor store'),
('local_government_office','Local government office'),
('locality','Locality'),
('locksmith','Locksmith'),
('lodging','Lodging'),
('meal_delivery','Meal delivery'),
('meal_takeaway','Meal takeaway'),
('meeting_room','Meeting room'),
('monument','Monument'),
('mosque','Mosque'),
('movie_rental','Movie rental'),
('movie_theater','Movie theater'),
('moving_company','Moving company'),
('museum','Museum'),
('natural_feature','Natural feature'),
('neighborhood','Neighborhood'),
('night_club','Night club'),
('painter','Painter'),
('park','Park'),
('parking','Parking'),
('pedestrian_mall','Pedestrian Mall'),
('performing_arts_theaters','Performing arts theaters'),
('pet_store','Pet store'),
('pharmacy','Pharmacy'),
('physiotherapist','Physiotherapist'),
('place_of_worship','Place of worship'),
('playhouses','Playhouses'),
('plumber','Plumber'),
('point_of_interest','Point of interest'),
('police','Police'),
('political','Political'),
('post_box','Post_box'),
('post_office','Post_office'),
('postal_code','Postal_code'),
('postal_code_prefix','Postal code prefix'),
('postal_town','Postal town'),
('premise','Premise'),
('preschool','Preschool'),
('print_services','Print services'),
('printer','Printer'),
('printing_press','Printing press'),
('racquetball_courts','Racquetball Courts'),
('real_estate_agency','Real estate agency'),
('residence_hall','Residence hall'),
('restaurant','Restaurant'),
('roofing_contractor','Roofing contractor'),
('room','Room'),
('route','Route'),
('rv_park','Rv park'),
('school','School'),
('school_administrator','School administrator'),
('sculpture','Sculpture'),
('shoe_store','Shoe store'),
('shopping_destination','Shopping destination'),
('shopping_mall','Shopping mall'),
('snack_bar','Snack Bar'),
('spa','Spa'),
('soccer_field','Soccer Field'),
('stadium','Stadium'),
('statue','Statue'),
('storage','Storage'),
('store','Store'),
('street_address','Street address'),
('street_number','Street number'),
('student_housing_center','Student housing center'),
('sublocality','Sublocality'),
('sublocality_level_1','Sublocality level 1'),
('sublocality_level_2','Sublocality level 2'),
('sublocality_level_3','Sublocality level 3'),
('sublocality_level_4','Sublocality level 4'),
('sublocality_level_5','Sublocality level 5'),
('subpremise','Subpremise'),
('subway_station','Subway station'),
('supermarket','Supermarket'),
('synagogue','Synagogue'),
('taxi_stand','Taxi stand'),
('train_station','Train station'),
('transit_station','Transit station'),
('travel_agency','Travel agency'),
('tutoring_services','Tutoring services'),
('university','University'),
('veterinary_care','Veterinary care'),
('walk_in_clinic','Walk-in Clinic'),
('warehouse','Warehouse'),
('web_services','Web services'),
('zoo','Zoo')
	GO


	CREATE TABLE [dbo].[authors](
		[author_id] [int] IDENTITY(1,1) NOT NULL,
		[Nid] [nvarchar](max) NOT NULL,
		[name] [nvarchar](max) NOT NULL,
		[email] [nvarchar](max) NULL,
		[phone] [nvarchar](max) NULL,
		[active] [BIT] NULL,
		[logedin] [BIT] NULL,
		[LastActive] [datetime] DEFAULT GETDATE(),
		[access_levels] [INT] NULL,
   		CONSTRAINT [PK_author] PRIMARY KEY CLUSTERED 
		(
			[author_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	
	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[authors]
			   (Nid,name,email,access_levels)
		 VALUES
			   ('jeremy.bass','Jeremy Bass','jeremybass@cableone.net',1)
	GO
	
	
	
	CREATE TABLE [dbo].[access_levels](
		[access_level_id] [int] IDENTITY(1,1) NOT NULL,
		[title] [nvarchar](max) NOT NULL,
   		CONSTRAINT [PK_access_level] PRIMARY KEY CLUSTERED 
		(
			[access_level_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[access_levels]
			   ([title])
		 VALUES
			   ('Admin'),
			   ('Editor')
	GO
	


	CREATE TABLE [dbo].[categories](
		[category_id] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](max) NOT NULL,
		[level][int] NOT NULL,
		[friendly_name] [nvarchar](max) NULL,
		CONSTRAINT [PK_categories] PRIMARY KEY CLUSTERED 
		(
			[category_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO

	CREATE UNIQUE INDEX ui_cat_name ON [categories]([category_id]);
	CREATE FULLTEXT CATALOG ft_catbyname;
	CREATE FULLTEXT INDEX ON [categories]([name])
		KEY INDEX ui_cat_name 
		WITH STOPLIST = SYSTEM;
	GO
	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[categories]
			   ([name],[level],[friendly_name])
		 VALUES
			
			('Academics',1,'academics'),
				('Agriculture',2,'agriculture'),
				('Art, Music, Design',2,'art_music_design'),
				('Bio/Phys/Math Sci',2,'bio_phys_math_sci'),
				('Business & Econ',2,'business_econ'),
				('Communication',2,'communication'),
				('Education',2,'education'),
				('Engineering',2,'engineering'),
				('Health Sciences',2,'health_sciences'),
				('Hist/Lit/Lang/Philosophy',2,'hist_lit_lang_philosophy'),
				('Social Sciences',2,'social_sciences'),
				('Sport & Fitness',2,'sport_fitness'),
				('Veterinary Medicine',2,'veterinary_medicine'),
				('Libraries & Computer Labs',2,'libraries_computer_labs'),
				('Tutoring & Support',2,'tutoring_support'),
			('Arts & Culture',1,'arts_culture'),
				('Museums & Exhibits',2,'museums_exhibits'),
				('Performing Arts',2,'performing_arts'),
				('Outdoor Sculpture',2,'outdoor_sculpture'),
				('Monuments & Sculpture',2,'monuments_sculpture'),
			('Athletics & Recreation',1,'athletics_recreation'),
				('Sports Venues',2,'sports_venues'),
				('Recreation',2,'recreation'),
				('Athletic Training',2,'athletic_training'),
				('Entertainment Venues',2,'entertainment_venues'),
			('Food & Shopping',1,'food_shopping'),
				('Espresso & Snacks',2,'espresso_snacks'), 
				('Dining',2,'dining'),
				('Shopping',2,'shopping'),
				('Convenience',2,'convenience'),
			('Housing',1,'housing'),
				('Residence Halls',2,'residence_halls'),
					('Co-ed',3,'co_ed'),
					('Men-only',3,'men_only'),
					('Women-only',3,'women_only'),
					('Age-Specific',3,'age_specific'),
				('Apartments',2,'apartments'),
					('Single Student',3,'single_student'),
					('Family & Granduate',3,'family_granduate'),
			('Landmarks',1,'landmarks'),
			('Services & Admin',1,'services_admin'),
				('Student Services',2,'student_services'),
				('Staff Services',2,'staff_services'),
				('Central Admin',2,'central_admin'),
				('Utilities & Maint',2,'utilities_maint'),
			('Parking',1,'parking'),
			('Bus Routes',1,'bus_routes')
	GO







 



	
	
	CREATE TABLE [dbo].[tags](
		[tag_id] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](max) NOT NULL,
		[attr] [nvarchar](max) NULL,
		CONSTRAINT [PK_tags] PRIMARY KEY CLUSTERED 
		(
			[tag_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	CREATE UNIQUE INDEX ui_tag_name ON [tags]([tag_id]);
	CREATE FULLTEXT CATALOG ft_tagbyname;
	CREATE FULLTEXT INDEX ON [tags]([name])
		KEY INDEX ui_tag_name 
		WITH STOPLIST = SYSTEM;
	GO




	
	
	CREATE TABLE [dbo].[departments](
		[department_id] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](max) NOT NULL,
		[attr] [nvarchar](max) NULL,
		CONSTRAINT [PK_departments] PRIMARY KEY CLUSTERED 
		(
			[department_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	CREATE UNIQUE INDEX ui_department_name ON [departments]([department_id]);
	CREATE FULLTEXT CATALOG ft_departmentbyname;
	CREATE FULLTEXT INDEX ON [departments]([name])
		KEY INDEX ui_department_name 
		WITH STOPLIST = SYSTEM;
	GO
	/* add some defaults */
	BULK
	INSERT [departments]
	FROM  'C:\sql\departments_2011.csv' /* '\\UP-PROGRAMMER5\data_tar\departments_2011.csv' */
	WITH
	(
		FIELDTERMINATOR = ',',
		ROWTERMINATOR = '\n'
	)
	GO


	
	
	CREATE TABLE [dbo].[colleges](
		[college_id] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](max) NOT NULL,
		[attr] [nvarchar](max) NULL,
		CONSTRAINT [PK_colleges] PRIMARY KEY CLUSTERED 
		(
			[college_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	CREATE UNIQUE INDEX ui_college_name ON [colleges]([college_id]);
	CREATE FULLTEXT CATALOG ft_collegebyname;
	CREATE FULLTEXT INDEX ON [colleges]([name])
		KEY INDEX ui_college_name 
		WITH STOPLIST = SYSTEM;
	GO

	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[colleges]
			   ([name])
		 VALUES
			   ('College of Veterinary Medicine'),
			   ('College of Education'),
			   ('Murrow College Of Communication'),
			   ('University College'),
			   ('College of Engineering and Architecture'),
			   ('University Honors College'),
			   ('College of Agricultural, Human, and Natural Resource Sciences (CAHNRS) Academic Programs'),
			   ('College Of Sciences'),
			   ('College of Liberal Arts'),
			   ('College of Business'),
			   ('College of Pharmacy')
	GO	
	




	
	
	
	
	CREATE TABLE [dbo].[schools](
		[school_id] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](max) NOT NULL,
		[attr] [nvarchar](max) NULL,
		CONSTRAINT [PK_schools] PRIMARY KEY CLUSTERED 
		(
			[school_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	CREATE UNIQUE INDEX ui_school_name ON [schools]([school_id]);
	CREATE FULLTEXT CATALOG ft_schoolbyname;
	CREATE FULLTEXT INDEX ON [schools]([name])
		KEY INDEX ui_school_name 
		WITH STOPLIST = SYSTEM;
	GO

	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[schools]
			   ([name])
		 VALUES
			   ('School of Biological Sciences'),
			   ('School of Molecular Biosciences'),
			   ('School for Global Animal Health'),
			   ('School Of Architecture and Construction Management'),
			   ('School of Electrical Engineering and Computer Science'),
			   ('School of Food Science'),
			   ('Graduate School'),
			   ('School of Economic Sciences'),
			   ('School of Music'),
			   ('School of Mechanical and Materials Engineering'),
			   ('School of Hospitality Business Management'),
			   ('School of Earth and Environmental Science')
	GO



	CREATE TABLE [dbo].[programs](
		[program_id] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](max) NOT NULL,
		[attr] [nvarchar](max) NULL,
		CONSTRAINT [PK_programs] PRIMARY KEY CLUSTERED 
		(
			[program_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	CREATE UNIQUE INDEX ui_program_name ON [programs]([program_id]);
	CREATE FULLTEXT CATALOG ft_programbyname;
	CREATE FULLTEXT INDEX ON [programs]([name])
		KEY INDEX ui_program_name 
		WITH STOPLIST = SYSTEM;
	GO
		/* add some defaults */
	INSERT INTO [campusMap].[dbo].[programs]
			   ([name])
		 VALUES
			('Program in Genetics and Cell Biology'),
			('Program in Microbiology'),
			('International Programs'),
			('Education Abroad'),
			('Early Childhood Development'),
			('Department of Human Development'),
			('High School Equivalency Program'),
			('Eclipse Alternative High School Program'),
			('Program in Communication'),
			('Center for Assessment and Innovation in Teaching'),
			('General Education Program'),
			('University Writing Program'),
			('Liberal Arts General Studies Program'),
			('Engineering Management Graduate Program'),
			('MFA'),
			('Summer Session'),
			('Materials Science Program'),
			('Viticulture and Enology Program'),
			('WWAMI Medical Education Program')
		GO

	CREATE TABLE [dbo].[usertags](
		[usertag_id] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](max) NOT NULL,
		[attr] [nvarchar](max) NULL,
		CONSTRAINT [PK_usertags] PRIMARY KEY CLUSTERED 
		(
			[usertag_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	CREATE UNIQUE INDEX ui_usertag_name ON [usertags]([usertag_id]);
	CREATE FULLTEXT CATALOG ft_usertagbyname;
	CREATE FULLTEXT INDEX ON [usertags]([name])
		KEY INDEX ui_usertag_name 
		WITH STOPLIST = SYSTEM;
	GO
	
/* media tables */	
	CREATE TABLE [dbo].[media_repo](
		[media_id] [int] IDENTITY(1,1) NOT NULL,
		[media_type_id] [int] NOT NULL,
		[credit] [nvarchar](max) NULL,
		[caption] [nvarchar](max) NULL,
		[created] [datetime] DEFAULT GETDATE(),
		[updated] [datetime] DEFAULT GETDATE(),
		[file_name] [nvarchar](max) NULL,
		[orientation] [nvarchar](max) NULL,
		[ext] [nvarchar](max) NULL,
		[path] [nvarchar](max) NULL,
		CONSTRAINT [PK_media] PRIMARY KEY CLUSTERED 
		(
			[media_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
		CREATE NONCLUSTERED INDEX IX_media_by_type ON dbo.[media_repo]([media_type_id])
	GO

	CREATE TABLE [dbo].[media_types](
		[media_type_id] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](max) NOT NULL,
		[attr] [nvarchar](max) NULL,
		CONSTRAINT [PK_media_type] PRIMARY KEY CLUSTERED 
		(
			[media_type_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
	CREATE UNIQUE INDEX ui_media_type_name ON [media_types]([media_type_id]);
	CREATE FULLTEXT CATALOG ft_media_typebyname;
	CREATE FULLTEXT INDEX ON [media_types]([name])
		KEY INDEX ui_media_type_name 
		WITH STOPLIST = SYSTEM;
	GO
	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[media_types]
			   ([name],[attr])
		 VALUES
			   ('marker_icon',null),
			   ('user_image',null),
			   ('general_image',null),
			   ('general_video',null),
			   ('google_static_map',null)
	GO

	
/* needed but needs adjusments */
create table logs (
  Id INT IDENTITY NOT NULL,
   logentry NVARCHAR(255) null,
   dtOfLog DATETIME null,
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
	place_id INT null,
	view_id INT null,
	primary key (comment_id)
)

create table infotabs (
	infotab_id INT IDENTITY NOT NULL,
	content NVARCHAR(MAX) null,
	title NVARCHAR(MAX) null,
	sort INT null,
	place INT null,
	place_id INT null
	primary key (infotab_id)
)





create table styles (
	style_id INT IDENTITY NOT NULL,
	name NVARCHAR(255) null,
	[type] INT null,
	primary key (style_id)
)



	

create table geometric_events (
	geometric_event_id INT IDENTITY NOT NULL,
	name NVARCHAR(255) null,
	friendly_name NVARCHAR(255) null,
	primary key (geometric_event_id)
)
	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[geometric_events]
			   ([name],[friendly_name])
		 VALUES
			   ('rest','Base'),('mouseover','Hover'),('click','Clicked'),('dblclick','Double Clicked')
	GO
CREATE TABLE [dbo].[geometric_events_to_geometrics_types](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [geometric_event_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_geometric_events_to_geometrics_types_event] FOREIGN KEY ([geometric_event_id])
        REFERENCES [geometric_events] ([geometric_event_id]),
    [geometrics_type_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_geometric_events_to_geometrics_types_geometrics_type] FOREIGN KEY ([geometrics_type_id])
        REFERENCES [geometrics_types] ([geometrics_type_id]),
    CONSTRAINT [PK_geometric_events_to_geometrics_types] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO

	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[geometric_events_to_geometrics_types]
			   ([geometric_event_id],[geometrics_type_id])
		 VALUES
			   (1,1),(1,2),(1,3),(1,4),(1,5),
			   (2,1),(2,2),(2,3),(2,4),(2,5),
			   (3,1),(3,2),(3,3),(3,4),(3,5),
			   (4,1),(4,2),(4,3),(4,4),(4,5)
	GO
	



create table style_options (
	style_option_id INT IDENTITY NOT NULL,
	[type] INT null,
	[value] INT null,
	[event] INT null,
	[zoom] INT null,
	primary key (style_option_id)
)
create table style_option_types (
	style_option_type_id INT IDENTITY NOT NULL,
	name NVARCHAR(255) null,
	primary key (style_option_type_id)
)
	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[style_option_types]
			   ([name])
		 VALUES
			   ('visible'),('zIndex'),('strokeColor'),('strokeOpacity'),
			   ('strokeWeight'),('fillColor'),('fillOpacity'),('geodesic'),
			   ('flat'),('cursor'),('clickable'),('animation'),('icon'),
			   ('anchor'),('origin'),('scaledSize'),('size'),('url'),
			   ('raiseOnDrag'),('shadow'),('title'),('shape'),('coords'),
			   ('type')
	GO



CREATE TABLE [dbo].[style_option_types_to_geometrics_types](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [style_option_type_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_style_option_types_to_geometrics_types_style_option_type] FOREIGN KEY ([style_option_type_id])
        REFERENCES [style_option_types] ([style_option_type_id]),
    [geometrics_type_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_style_option_types_to_geometrics_types_geometrics_type] FOREIGN KEY ([geometrics_type_id])
        REFERENCES [geometrics_types] ([geometrics_type_id]),
    CONSTRAINT [PK_style_option_types_to_geometrics_types] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO
CREATE TABLE [dbo].[style_to_style_options](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [style_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_style_to_style_options_style] FOREIGN KEY ([style_id])
        REFERENCES [styles] ([style_id]),
    [style_option_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_style_to_style_options_style_options] FOREIGN KEY ([style_option_id])
        REFERENCES [style_options] ([style_option_id]),
    CONSTRAINT [PK_style_to_style_options] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO

	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[style_option_types_to_geometrics_types]
			   ([style_option_type_id],[geometrics_type_id])
		 VALUES
			   (1,1),(1,2),(1,3),(1,4),(1,5),
			   (2,1),(2,2),(2,3),(2,4),(2,5),
			   (3,2),(3,3),(3,4),(3,5),
			   (4,2),(4,3),(4,4),(4,5),
			   (5,2),(5,3),(5,4),(5,5),
			   (6,3),(6,4),(6,5),
			   (7,3),(7,4),(7,5),
			   (8,2),(8,3),
			   (9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(15,1),(16,1),(17,1),(18,1),(19,1),(20,1),(21,1),(22,1),(23,1),(24,1)
	GO

CREATE TABLE [dbo].[geometric_events_to_style_options](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [geometric_event_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_geometric_events_to_style_options_style_events] FOREIGN KEY ([geometric_event_id])
        REFERENCES [geometric_events] ([geometric_event_id]),
    [style_option_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_geometric_events_to_style_options_style_options] FOREIGN KEY ([style_option_id])
        REFERENCES [style_options] ([style_option_id]),
    CONSTRAINT [PK_geometric_events_to_style_options] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO




	create table [zoom_levels] (
		[zoom_id] INT IDENTITY NOT NULL,
		[zoom_start] INT null,
		[zoom_end] INT null,
		primary key (zoom_id)
	)
	/* add some defaults 
	*/
	
	/* Set up first */
	INSERT INTO [campusMap].[dbo].[zoom_levels]
			   ([zoom_start],[zoom_end])
		 VALUES
				('0','23')
	GO
	/* iterate over the to produce the rest */
	;WITH Numbers (Number) AS  
	( 
		SELECT 0  
		UNION ALL 
		SELECT 1 + Number FROM Numbers  
		WHERE 1 + Number <= 23 
	) 
	INSERT INTO [campusMap].[dbo].[zoom_levels] ([zoom_start],[zoom_end]) 
	SELECT n1.Number, n2.Number  
	FROM 
		Numbers n1 CROSS JOIN 
		Numbers n2 
	WHERE 
		NOT (n1.Number = 0 AND n2.Number = 23) 


 



	

	
CREATE TABLE [dbo].[style_to_zoom](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [zoom_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_style_to_zoom_zoom] FOREIGN KEY ([zoom_id])
        REFERENCES [zoom_levels] ([zoom_id]),
    [style_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_style_to_zoom_style] FOREIGN KEY ([style_id])
        REFERENCES [styles] ([style_id]),
    CONSTRAINT [PK_style_to_zoom] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO



/*
//DELETE?
//
//
//
*/
CREATE TABLE [dbo].[geometric_events_to_zoom](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [zoom_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_geometric_events_to_zoom_zoom] FOREIGN KEY ([zoom_id])
        REFERENCES [zoom_levels] ([zoom_id]),
    [geometric_event_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_geometric_events_to_zoom_event] FOREIGN KEY ([geometric_event_id])
        REFERENCES [geometric_events] ([geometric_event_id]),
    CONSTRAINT [PK_geometric_events_to_zoom] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO

	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[geometric_events_to_zoom]
			   ([zoom_id],[geometric_event_id])
		 VALUES
				(1,1),(1,2),(1,3),(1,4)
	GO
	


create table [events_set] (
	[events_set_id] INT IDENTITY NOT NULL,
	[style_id] INT null,
	[zoom_id] INT null,
	primary key (events_set_id)
)
CREATE TABLE [dbo].[geometric_events_to_events_set](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [geometric_event_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK__geometric_events_to_events_set___geometric_event] FOREIGN KEY ([geometric_event_id])
        REFERENCES [geometric_events] ([geometric_event_id]),
    [events_set_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK__geometric_events_to_events_set___event_set] FOREIGN KEY ([events_set_id])
        REFERENCES [events_set] ([events_set_id]),
    CONSTRAINT [PK__geometric_events_to_events_set] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO

CREATE TABLE [dbo].[style_to_events_set](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [style_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK__style_to_events_set___style] FOREIGN KEY ([style_id])
        REFERENCES [styles] ([style_id]),
    [events_set_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK__style_to_events_set___event_set] FOREIGN KEY ([events_set_id])
        REFERENCES [events_set] ([events_set_id]),
    CONSTRAINT [PK__style_to_events_set] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO












	create table fields (
		field_id INT IDENTITY NOT NULL,
	   value NVARCHAR(255) null,
	   type INT null,
	   owner INT null,
	   primary key (field_id)
	)
	create table field_types (
	  field_type_id INT IDENTITY NOT NULL,
	   name NVARCHAR(255) null,
	   alias NVARCHAR(255) null,
	   attr [nvarchar](max) null,
	   model NVARCHAR(255) null,
	   fieldset INT null,
	   primary key (field_type_id)
	)
	/* add some defaults */
	INSERT INTO [campusMap].[dbo].[field_types]
			   ([name],[alias],[attr],[model],[fieldset])
		 VALUES
('ADA Entrance', 'ada_entrance','{ "type": "textinput", "label": "ADA Entrance", "attr":{"ele_class":null,"placeholder":null,"name":"fields[1]","title":null,"dir":null,"accesskey":null,"tabindex":null,"id":null,"style":null,"multiple":null}, "options":[{"label":"bar","val":"bars"},{"label":"fooed","val":"baring"}] }',	'placeController',	'2'),
('ADA Parking', 'ada_parking','{ "type": "textinput", "label": "ADA Parking", "attr":{"ele_class":null,"placeholder":null,"name":"fields[2]","title":null,"dir":null,"accesskey":null,"tabindex":null,"id":null,"style":null,"multiple":null}, "options":[{"label":"bar","val":"bars"},{"label":"fooed","val":"baring"}] }',	'placeController',	'2'),
('ADA Other', 'ada_other','{ "type": "textinput", "label": "ADA Other", "attr":{"ele_class":null,"placeholder":null,"name":"fields[3]","title":null,"dir":null,"accesskey":null,"tabindex":null,"id":null,"style":null,"multiple":null}, "options":[{"label":"bar","val":"bars"},{"label":"fooed","val":"baring"}] }',	'placeController',	'2'),
('Amenities', 'amenities','{ "type": "textinput", "label": "Amenities", "attr":{"ele_class":null,"placeholder":null,"name":"fields[4]","title":null,"dir":null,"accesskey":null,"tabindex":null,"id":null,"style":null,"multiple":null}, "options":[{"label":"bar","val":"bars"},{"label":"fooed","val":"baring"}] }',	'placeController',	'2'),
('Classrooms', 'classroom','{ "type": "dropdown", "label": "Classrooms", "attr":{"ele_class":null,"name":"fields[5]","title":null,"dir":null,"accesskey":null,"placeholder":null,"tabindex":null,"id":null,"style":null,"multiple":null}, "options":[{"label":"Yes","val":"yes","selected":null},{"label":"No","val":"no","selected":"no"}] }',	'placeController',	'2'),
('Research Labs', 'research_labs','{ "type": "dropdown", "label": "Research Labs", "attr":{"ele_class":null,"name":"fields[6]","title":null,"dir":null,"accesskey":null,"placeholder":null,"tabindex":null,"id":null,"style":null,"multiple":null}, "options":[{"label":"Yes","val":"yes","selected":null},{"label":"No","val":"no","selected":"no"}] }',	'placeController',	'2'),
('Notes & Comments', 'notes_comments','{ "type": "textarea", "label": "Notes & Comments", "attr":{"ele_class":null,"placeholder":null,"name":"fields[7]","title":null,"dir":null,"accesskey":null,"tabindex":null,"id":null,"style":null,"multiple":null}, "options":[{"label":"bar","val":"bars"},{"label":"fooed","val":"baring"}] }',	'placeController',	'2'),
('Shopping, Dining, Etc.', 'shopping_dining_etc','{ "type": "textinput", "label": "Shopping, Dining, Etc.", "attr":{"ele_class":null,"placeholder":null,"name":"fields[8]","title":null,"dir":null,"accesskey":null,"tabindex":null,"id":null,"style":null,"multiple":null}, "options":[{"label":"bar","val":"bars"},{"label":"fooed","val":"baring"}] }',	'placeController',	'2'),
('Research Centers', 'research_centers','{ "type": "textinput", "label": "Research Centers", "attr":{"ele_class":null,"name":"fields[9]","title":null,"dir":null,"accesskey":null,"placeholder":"Names of Research Centers","tabindex":null,"id":null,"style":null,"multiple":null}, "options":[{"label":null,"val":null,"selected":null}] }','placeController','2'),
('Libraries', 'libraries','{ "type": "textinput", "label": "Libraries", "attr":{"ele_class":null,"name":"fields[10]","title":null,"dir":null,"accesskey":null,"placeholder":"Names of Libraries","tabindex":null,"id":null,"style":null,"multiple":null}, "options":[{"label":null,"val":null,"selected":null}] }','placeController','2'),
('Major Labs/Facilities', 'major_labs_facilities','{ "type": "textinput", "label": "Major Labs/Facilities", "attr":{"ele_class":null,"name":"fields[11]","title":null,"dir":null,"accesskey":null,"placeholder":"Names of Major Labs/Facilities","tabindex":null,"id":null,"style":null,"multiple":null}, "options":[{"label":null,"val":null,"selected":null}] }','placeController','2'),
('Student Services & Advising', 'student_services_advising','{ "type": "textinput", "label": "Student Services & Advising", "attr":{"ele_class":null,"name":"fields[12]","title":null,"dir":null,"accesskey":null,"placeholder":"Names of Student Services & Advising","tabindex":null,"id":null,"style":null,"multiple":null}, "options":[{"label":null,"val":null,"selected":null}] }','placeController','2'),
('University Administration & Non-Academic Units', 'university_administration_non_academic_units','{ "type": "textinput", "label": "University Administration & Non-Academic Units", "attr":{"ele_class":null,"name":"fields[13]","title":null,"dir":null,"accesskey":null,"placeholder":"Names of University Administration & Non-Academic Units","tabindex":null,"id":null,"style":null,"multiple":null}, "options":[{"label":null,"val":null,"selected":null}] }','placeController','2'),
('Special Facilities & Public Venues', 'special_facilities_public_venues','{ "type": "textinput", "label": "Special Facilities & Public Venues", "attr":{"ele_class":null,"name":"fields[14]","title":null,"dir":null,"accesskey":null,"placeholder":"Names of Special Facilities & Public Venues","tabindex":null,"id":null,"style":null,"multiple":null}, "options":[{"label":null,"val":null,"selected":null}] }','placeController','2')
	GO


CREATE TABLE [dbo].[field_to_field_types] (
    [id] [int] IDENTITY(1,1) NOT NULL,
	[field_type_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_field_to_field_types_field_type] FOREIGN KEY ([field_type_id])
        REFERENCES [field_types] ([field_type_id]),
	[field_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_field_to_field_types_field] FOREIGN KEY ([field_id])
        REFERENCES [fields] ([field_id]),
    CONSTRAINT [PK_field_to_field_types] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO



/* not 100% this is used or if it is, if it's needed.  Let remove this */
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
create table person_types (
  Id INT IDENTITY NOT NULL,
   name NVARCHAR(255) null,
   Deleted BIT null,
   attr NVARCHAR(255) null,
   primary key (Id)
)
create table place_media (
  Id INT IDENTITY NOT NULL,
   place_order INT null,
   place_id INT null,
   media_id INT null,
   primary key (Id)
)






/* from to */
CREATE TABLE [dbo].[place_to_geometrics](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [place_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_geometrics_place] FOREIGN KEY ([place_id])
        REFERENCES [place] ([place_id]),
    [geometric_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_geometrics_geo] FOREIGN KEY ([geometric_id])
        REFERENCES [geometrics] ([geometric_id]),
    CONSTRAINT [PK_place_to_gometrics] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO
CREATE TABLE [dbo].[geometrics_to_types](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [geometric_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_geometrics_to_types_geo] FOREIGN KEY ([geometric_id])
        REFERENCES [geometrics] ([geometric_id]),
    [geometrics_type_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_geometrics_to_types_type] FOREIGN KEY ([geometrics_type_id])
        REFERENCES [geometrics_types] ([geometrics_type_id]),
    CONSTRAINT [PK_geometrics_to_types] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO
CREATE TABLE [dbo].[place_to_place_types](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [place_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_place_types_place] FOREIGN KEY ([place_id])
        REFERENCES [place] ([place_id]),
    [place_type_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_place_types_type] FOREIGN KEY ([place_type_id])
        REFERENCES [place_types] ([place_type_id]),
    CONSTRAINT [PK_place_to_place_types] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO
CREATE TABLE [dbo].[place_to_place_models](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [place_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_place_models_place] FOREIGN KEY ([place_id])
        REFERENCES [place] ([place_id]),
    [place_model_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_place_models_model] FOREIGN KEY ([place_model_id])
        REFERENCES [place_models] ([place_model_id]),
    CONSTRAINT [PK_place_to_place_models] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO


	CREATE TABLE [dbo].[google_types](
		[google_type_id] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](max) NOT NULL,
		CONSTRAINT [PK_google_type] PRIMARY KEY CLUSTERED 
		(
			[google_type_id] ASC
		)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
		) ON [PRIMARY]
	GO
/* add some defaults */
	INSERT INTO [campusMap].[dbo].[google_types]
			   ([name])
		 VALUES
			   ('accounting'),('airport'),('aquarium'),('art_gallery'),('atm'),('bakery'),('bank'),('bar'),
			   ('beauty_salon'),('bicycle_store'),('book_store'),('bowling_alley'),('building'),
			   ('bus_station'),('cafe'),('campground'),('car_dealer'),('car_rental'),('car_repair'),
			   ('car_wash'),('casino'),('cemetery'),('church'),('city_hall'),('clothing_store'),
			   ('convenience_store'),('courthouse'),('dentist'),('department_store'),('doctor'),
			   ('electrician'),('electronics_store'),('embassy'),('establishment'),('finance'),('fire_station'),
			   ('florist'),('food'),('funeral_home'),('furniture_store'),('gas_station'),('general_contractor'),
			   ('geocode'),('grocery_or_supermarket'),('gym'),('hair_care'),('hardware_store'),('health'),
			   ('hindu_temple'),('home_goods_store'),('hospital'),('insurance_agency'),('jewelry_store'),
			   ('laundry'),('lawyer'),('library'),('liquor_store'),('local_government_office'),('locksmith'),
			   ('lodging'),('meal_delivery'),('meal_takeaway'),('mosque'),('movie_rental'),('movie_theater'),
			   ('moving_company'),('museum'),('night_club'),('painter'),('park'),('parking'),('pet_store'),
			   ('pharmacy'),('physiotherapist'),('place_of_worship'),('plumber'),('police'),('post_office'),
			   ('real_estate_agency'),('restaurant'),('roofing_contractor'),('rv_park'),('school'),('shoe_store'),
			   ('shopping_mall'),('spa'),('stadium'),('storage'),('store'),('subway_station'),('synagogue'),
			   ('taxi_stand'),('train_station'),('travel_agency'),('university'),('veterinary_care'),('zoo'),
			   ('administrative_area_level_1'),('administrative_area_level_2'),('administrative_area_level_3'),
			   ('colloquial_area'),('country'),('floor'),('intersection'),('locality'),('natural_feature'),
			   ('neighborhood'),('political'),('point_of_interest'),('post_box'),('postal_code'),
			   ('postal_code_prefix'),('postal_town'),('premise'),('room'),('route'),('street_address'),
			   ('street_number'),('sublocality'),('sublocality_level_4'),('sublocality_level_5'),
			   ('sublocality_level_3'),('sublocality_level_2'),('sublocality_level_1'),('subpremise'),('transit_station')

	GO

CREATE TABLE [dbo].[google_types_to_place_types](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [google_type_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_google_types_to_place_types_place] FOREIGN KEY ([google_type_id])
        REFERENCES [google_types] ([google_type_id]),
    [place_type_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_google_types_to_place_types_google] FOREIGN KEY ([place_type_id])
        REFERENCES [place_types] ([place_type_id]),
    CONSTRAINT [PK_google_types_to_place_types] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO




CREATE TABLE [dbo].[authors_to_media](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [author_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_authors_to_media_authors] FOREIGN KEY ([author_id])
        REFERENCES [authors] ([author_id]),
    [media_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_authors_to_media_media] FOREIGN KEY ([media_id])
        REFERENCES [media_repo] ([media_id]),
    CONSTRAINT [PK_authors_to_media] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO	
CREATE TABLE [dbo].[place_to_categories](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [place_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_categories_place] FOREIGN KEY ([place_id])
        REFERENCES [place] ([place_id]),
    [category_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_categories_cat] FOREIGN KEY ([category_id])
        REFERENCES [categories] ([category_id]),
    CONSTRAINT [PK_place_to_categories] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO
CREATE TABLE [dbo].[place_to_campus](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [place_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_campus_place] FOREIGN KEY ([place_id])
        REFERENCES [place] ([place_id]),
    [campus_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_campus_geo] FOREIGN KEY ([campus_id])
        REFERENCES [geometrics] ([geometric_id]),
    CONSTRAINT [PK_place_to_campus] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO
CREATE TABLE [dbo].[place_to_tags](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [place_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_tags_place] FOREIGN KEY ([place_id])
        REFERENCES [place] ([place_id]),
    [tag_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_tags_tag] FOREIGN KEY ([tag_id])
        REFERENCES [tags] ([tag_id]),
    CONSTRAINT [PK_place_to_tags] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO
CREATE TABLE [dbo].[place_to_departments](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [place_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_departments_place] FOREIGN KEY ([place_id])
        REFERENCES [place] ([place_id]),
    [department_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_departments_department] FOREIGN KEY ([department_id])
        REFERENCES [departments] ([department_id]),
    CONSTRAINT [PK_place_to_departments] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO	
CREATE TABLE [dbo].[place_to_colleges](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [place_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_colleges_place] FOREIGN KEY ([place_id])
        REFERENCES [place] ([place_id]),
    [college_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_colleges_college] FOREIGN KEY ([college_id])
        REFERENCES [colleges] ([college_id]),
    CONSTRAINT [PK_place_to_colleges] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO

CREATE TABLE [dbo].[place_to_schools](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [place_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_schools_place] FOREIGN KEY ([place_id])
        REFERENCES [place] ([place_id]),
    [school_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_schools_school] FOREIGN KEY ([school_id])
        REFERENCES [schools] ([school_id]),
    CONSTRAINT [PK_place_to_schools] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO



CREATE TABLE [dbo].[place_to_programs](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [place_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_programs_place] FOREIGN KEY ([place_id])
        REFERENCES [place] ([place_id]),
    [program_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_programs_program] FOREIGN KEY ([program_id])
        REFERENCES [programs] ([program_id]),
    CONSTRAINT [PK_place_to_programs] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO
CREATE TABLE [dbo].[place_to_usertags](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [place_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_usertags_place] FOREIGN KEY ([place_id])
        REFERENCES [place] ([place_id]),
    [usertag_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_usertags_usertag] FOREIGN KEY ([usertag_id])
        REFERENCES [usertags] ([usertag_id]),
    CONSTRAINT [PK_place_to_usertags] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO	
CREATE TABLE [dbo].[media_to_media_types](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [media_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_media_to_media_media] FOREIGN KEY ([media_id])
        REFERENCES [media_repo] ([media_id]),
    [media_type_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_media_to_media_types] FOREIGN KEY ([media_type_id])
        REFERENCES [media_types] ([media_type_id]),
    CONSTRAINT [PK_media_to_media_types] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO





CREATE TABLE [dbo].[geometric_to_media](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [geometric_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_geometric_to_media_geometric] FOREIGN KEY ([geometric_id])
        REFERENCES [geometrics] ([geometric_id]),
    [media_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_geometric_to_media_media] FOREIGN KEY ([media_id])
        REFERENCES [media_repo] ([media_id]),
    CONSTRAINT [PK_geometric_to_media] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO

CREATE TABLE [dbo].[place_to_media](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [place_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_media_place] FOREIGN KEY ([place_id])
        REFERENCES [place] ([place_id]),
    [media_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_place_to_media_media] FOREIGN KEY ([media_id])
        REFERENCES [media_repo] ([media_id]),
    CONSTRAINT [PK_place_to_media] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO
	
CREATE TABLE [dbo].[place_to_place_names](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[place_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_place_to_place_names_place] FOREIGN KEY ([place_id])
		REFERENCES [place] ([place_id]),
	[name_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_place_to_place_names_name] FOREIGN KEY ([name_id])
		REFERENCES [place_names] ([name_id]),
	CONSTRAINT [PK_place_to_place_names] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO
CREATE TABLE [dbo].[advertisement_to_tag] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ad_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_advertisement_to_tag_ad] FOREIGN KEY ([ad_id])
		REFERENCES [advertisement] ([ad_id]),
	[tag_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_advertisement_to_tag_tag] FOREIGN KEY ([tag_id])
		REFERENCES [tags] ([tag_id]),
	CONSTRAINT [PK_advertisement_to_tag] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO

CREATE TABLE [dbo].[advertisement_to_media] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ad_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_advertisement_to_media_ad] FOREIGN KEY ([ad_id])
		REFERENCES [advertisement] ([ad_id]),
	[media_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_advertisement_to_media_media] FOREIGN KEY ([media_id])
		REFERENCES [media_repo] ([media_id]),
	CONSTRAINT [PK_advertisement_to_media] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO


CREATE TABLE [dbo].[view_to_tags] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[view_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_view_to_tags_view] FOREIGN KEY ([view_id])
		REFERENCES [map_views] ([view_id]),
	[tag_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_view_to_tags_tag] FOREIGN KEY ([tag_id])
		REFERENCES [tags] ([tag_id]),
	CONSTRAINT [PK_view_to_tags] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO
CREATE TABLE [dbo].[view_to_usertags] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[view_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_view_to_usertags_place] FOREIGN KEY ([view_id])
		REFERENCES [map_views] ([view_id]),
	[usertag_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_view_to_usertags_usertag] FOREIGN KEY ([usertag_id])
		REFERENCES [usertags] ([usertag_id]),
	CONSTRAINT [PK_view_to_usertags] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO





CREATE TABLE [dbo].[authors_to_programs] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[program_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_programs_program] FOREIGN KEY ([program_id])
		REFERENCES [programs] ([program_id]),
	[author_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_programs_author] FOREIGN KEY ([author_id])
		REFERENCES [authors] ([author_id]),
	CONSTRAINT [PK_authors_to_programs] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO
CREATE TABLE [dbo].[authors_to_campus] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[campus_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_campus_campus] FOREIGN KEY ([campus_id])
		REFERENCES [campus] ([campus_id]),
	[author_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_campus_authors] FOREIGN KEY ([author_id])
		REFERENCES [authors] ([author_id]),
	CONSTRAINT [PK_authors_to_campus] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO
CREATE TABLE [dbo].[authors_to_place_type] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[place_type_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_place_type_place_type] FOREIGN KEY ([place_type_id])
		REFERENCES [place_types] ([place_type_id]),
	[author_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_place_type_authors] FOREIGN KEY ([author_id])
		REFERENCES [authors] ([author_id]),
	CONSTRAINT [PK_authors_to_place_type] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO
CREATE TABLE [dbo].[authors_to_colleges] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[college_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_colleges_college] FOREIGN KEY ([college_id])
		REFERENCES [colleges] ([college_id]),
	[author_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_colleges_authors] FOREIGN KEY ([author_id])
		REFERENCES [authors] ([author_id]),
	CONSTRAINT [PK_authors_to_colleges] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO
CREATE TABLE [dbo].[authors_to_view] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[author_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_view_authors] FOREIGN KEY ([author_id])
		REFERENCES [authors] ([author_id]),
	[view_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_view_view] FOREIGN KEY ([view_id])
		REFERENCES [map_views] ([view_id]),
	CONSTRAINT [PK_authors_to_view] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO
CREATE TABLE [dbo].[authors_to_geometrics] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[author_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_geometric_authors] FOREIGN KEY ([author_id])
		REFERENCES [authors] ([author_id]),
	[geometric_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_geometric_geometric] FOREIGN KEY ([geometric_id])
		REFERENCES [geometrics] ([geometric_id]),
	CONSTRAINT [PK_authors_to_geometric] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO
CREATE TABLE [dbo].[authors_to_place] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[author_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_place_authors] FOREIGN KEY ([author_id])
		REFERENCES [authors] ([author_id]),
	[place_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_place_place] FOREIGN KEY ([place_id])
		REFERENCES [place] ([place_id]),
	CONSTRAINT [PK_authors_to_place] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO
CREATE TABLE [dbo].[authors_to_categories] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[author_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_categories_authors] FOREIGN KEY ([author_id])
		REFERENCES [authors] ([author_id]),
	[category_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_authors_to_categories_categories] FOREIGN KEY ([category_id])
		REFERENCES [categories] ([category_id]),
	CONSTRAINT [PK_authors_to_categories] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO









CREATE TABLE [dbo].[view_to_fields] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[field_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_view_to_fields_field] FOREIGN KEY ([field_id])
		REFERENCES [fields] ([field_id]),
	[view_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_view_to_fields_view] FOREIGN KEY ([view_id])
		REFERENCES [map_views] ([view_id]),
	CONSTRAINT [PK_view_to_fields] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO

CREATE TABLE [dbo].[geometrics_to_fields] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[field_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_geometrics_to_fields_field] FOREIGN KEY ([field_id])
		REFERENCES [fields] ([field_id]),
	[geometric_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_geometrics_to_fields_geometrics] FOREIGN KEY ([geometric_id])
		REFERENCES [geometrics] ([geometric_id]),
	CONSTRAINT [PK_geometrics_to_fields] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO
CREATE TABLE [dbo].[place_to_fields] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[field_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_place_to_fields_field] FOREIGN KEY ([field_id])
		REFERENCES [fields] ([field_id]),
	[place_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_place_to_fields_place] FOREIGN KEY ([place_id])
		REFERENCES [place] ([place_id]),
	CONSTRAINT [PK_place_to_fields] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO

CREATE TABLE [dbo].[media_to_fields] (
    [id] [int] IDENTITY(1,1) NOT NULL,
	[field_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_media_to_fields_field] FOREIGN KEY ([field_id])
        REFERENCES [fields] ([field_id]),
	[media_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_media_to_fields_media] FOREIGN KEY ([media_id])
        REFERENCES [media_repo] ([media_id]),
    CONSTRAINT [PK_media_to_fields] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO




CREATE TABLE [dbo].[geometrics_to_styles] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[style_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_geometrics_to_styles_style] FOREIGN KEY ([style_id])
		REFERENCES [styles] ([style_id]),
	[geometric_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_geometrics_to_styles_geometrics] FOREIGN KEY ([geometric_id])
		REFERENCES [geometrics] ([geometric_id]),
	CONSTRAINT [PK_geometrics_to_styles] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO

CREATE TABLE [dbo].[geometric_to_tags] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tag_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_geometric_to_tags_style] FOREIGN KEY ([tag_id])
		REFERENCES [tags] ([tag_id]),
	[geometric_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_geometric_to_tags_geometrics] FOREIGN KEY ([geometric_id])
		REFERENCES [geometrics] ([geometric_id]),
	CONSTRAINT [PK_geometric_to_tags] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO







CREATE TABLE [dbo].[place_to_comments] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[place_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_place_to_comments_place] FOREIGN KEY ([place_id])
		REFERENCES [place] ([place_id]),
	[comment_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_place_to_comments_comment] FOREIGN KEY ([comment_id])
		REFERENCES [comments] ([comment_id]),
	CONSTRAINT [PK_place_to_comments] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO
CREATE TABLE [dbo].[place_to_infotabs] (
	[id] [int] IDENTITY(1,1) NOT NULL,
	[place_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_place_to_infotabs_place] FOREIGN KEY ([place_id])
		REFERENCES [place] ([place_id]),
	[infotab_id] [int] NOT NULL DEFAULT 1
		CONSTRAINT [FK_place_to_infotabs_infotab] FOREIGN KEY ([infotab_id])
		REFERENCES [infotabs] ([infotab_id]),
	CONSTRAINT [PK_place_to_infotabs] PRIMARY KEY CLUSTERED 
	(
		[id] ASC 
	)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	) ON [PRIMARY]
GO

















/*  I think I can get rid of this now...
CREATE TABLE [dbo].[category_to_field_types] (
    [id] [int] IDENTITY(1,1) NOT NULL,
	[field_type_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_category_to_field_types_field_type] FOREIGN KEY ([field_type_id])
        REFERENCES [field_types] ([field_type_id]),
	[category_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_category_to_field_types_category] FOREIGN KEY ([category_id])
        REFERENCES [categories] ([category_id]),
    CONSTRAINT [PK_category_to_field_types] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO
CREATE TABLE [dbo].[geometrics_to_field_types] (
    [id] [int] IDENTITY(1,1) NOT NULL,
	[field_type_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_geometrics_to_field_types_field_type] FOREIGN KEY ([field_type_id])
        REFERENCES [field_types] ([field_type_id]),
	[geometric_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_geometrics_to_field_types_geometric] FOREIGN KEY ([geometric_id])
        REFERENCES [geometrics] ([geometric_id]),
    CONSTRAINT [PK_geometrics_to_field_types] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO
CREATE TABLE [dbo].[view_to_field_types] (
    [id] [int] IDENTITY(1,1) NOT NULL,
	[field_type_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_view_to_field_types_field_type] FOREIGN KEY ([field_type_id])
        REFERENCES [field_types] ([field_type_id]),
	[view_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_view_to_field_types_view] FOREIGN KEY ([view_id])
        REFERENCES [map_views] ([view_id]),
    CONSTRAINT [PK_view_to_field_types] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO
CREATE TABLE [dbo].[media_to_field_types] (
    [id] [int] IDENTITY(1,1) NOT NULL,
	[field_type_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_media_to_field_types_field_type] FOREIGN KEY ([field_type_id])
        REFERENCES [field_types] ([field_type_id]),
	[media_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_media_to_field_types_media] FOREIGN KEY ([media_id])
        REFERENCES [media_repo] ([media_id]),
    CONSTRAINT [PK_media_to_field_types] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO
CREATE TABLE [dbo].[ad_to_field_types] (
    [id] [int] IDENTITY(1,1) NOT NULL,
	[field_type_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_ad_to_field_types_field_type] FOREIGN KEY ([field_type_id])
        REFERENCES [field_types] ([field_type_id]),
	[ad_id] [int] NOT NULL DEFAULT 1
        CONSTRAINT [FK_ad_to_field_types_ad] FOREIGN KEY ([ad_id])
        REFERENCES [advertisement] ([ad_id]),
    CONSTRAINT [PK_ad_to_field_types] PRIMARY KEY CLUSTERED 
    (
        [id] ASC 
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]
GO */
















