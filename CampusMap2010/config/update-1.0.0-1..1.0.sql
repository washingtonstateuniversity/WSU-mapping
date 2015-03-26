    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKAA44A29FEA53B1C0]') AND parent_obj = OBJECT_ID('geometrics_to_geoparents'))
ALTER TABLE geometrics_to_geoparents  drop constraint FKAA44A29FEA53B1C0
    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK36ED1C56214520DC]') AND parent_obj = OBJECT_ID('geometrics_to_geoparents'))
ALTER TABLE geometrics_to_geoparents  drop constraint FK36ED1C56214520DC
if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_to_geoparents') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_to_geoparents


    CREATE TABLE geometrics_to_geoparents (
        parent_geometric_id INT not null,
       geometric_id INT not null
    )

	ALTER TABLE geometrics
		ADD parent INT null

    ALTER TABLE geometrics 
        add constraint FKAA44A29FEA53B1C0 
        foreign key (parent) 
        references geometrics

    ALTER TABLE geometrics_to_geoparents 
        add constraint FK36ED1C56214520DC 
        foreign key (parent_geometric_id) 
        references geometrics


	ALTER TABLE map_views
		ADD fit_to_bound NVARCHAR(255) null

	ALTER TABLE map_views
		ADD json_style_override NVARCHAR(MAX) null		