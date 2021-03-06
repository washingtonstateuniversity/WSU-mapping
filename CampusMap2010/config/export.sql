
    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK675D342C9EB7DF69]') AND parent_obj = OBJECT_ID('place_media'))
alter table place_media  drop constraint FK675D342C9EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK675D342C2E12554A]') AND parent_obj = OBJECT_ID('place_media'))
alter table place_media  drop constraint FK675D342C2E12554A


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK8682B43A3B3B2D33]') AND parent_obj = OBJECT_ID('authors_to_field_type'))
alter table authors_to_field_type  drop constraint FK8682B43A3B3B2D33


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK8682B43A278C8B55]') AND parent_obj = OBJECT_ID('authors_to_field_type'))
alter table authors_to_field_type  drop constraint FK8682B43A278C8B55


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK3420CED23B3B2D33]') AND parent_obj = OBJECT_ID('access_levels_to_field_type'))
alter table access_levels_to_field_type  drop constraint FK3420CED23B3B2D33


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK3420CED2AD2B96A1]') AND parent_obj = OBJECT_ID('access_levels_to_field_type'))
alter table access_levels_to_field_type  drop constraint FK3420CED2AD2B96A1


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK676BA7231736309E]') AND parent_obj = OBJECT_ID('place_comments'))
alter table place_comments  drop constraint FK676BA7231736309E


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKAEABE8A7338B5168]') AND parent_obj = OBJECT_ID('style_options'))
alter table style_options  drop constraint FKAEABE8A7338B5168


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKAEABE8A7BE642297]') AND parent_obj = OBJECT_ID('style_options'))
alter table style_options  drop constraint FKAEABE8A7BE642297


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKAEABE8A7A160664F]') AND parent_obj = OBJECT_ID('style_options'))
alter table style_options  drop constraint FKAEABE8A7A160664F


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK8C55D4CB76976B0D]') AND parent_obj = OBJECT_ID('person'))
alter table person  drop constraint FK8C55D4CB76976B0D


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK8C55D4CB50888406]') AND parent_obj = OBJECT_ID('person'))
alter table person  drop constraint FK8C55D4CB50888406


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKB0BAEAC140E8EC9]') AND parent_obj = OBJECT_ID('place_to_place_types'))
alter table place_to_place_types  drop constraint FKB0BAEAC140E8EC9


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKB0BAEAC19EB7DF69]') AND parent_obj = OBJECT_ID('place_to_place_types'))
alter table place_to_place_types  drop constraint FKB0BAEAC19EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK7BF82739D43A3512]') AND parent_obj = OBJECT_ID('google_types_to_place_types'))
alter table google_types_to_place_types  drop constraint FK7BF82739D43A3512


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK6B6F5B636056F906]') AND parent_obj = OBJECT_ID('infotabs_templates'))
alter table infotabs_templates  drop constraint FK6B6F5B636056F906


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK6B6F5B639E2633FA]') AND parent_obj = OBJECT_ID('infotabs_templates'))
alter table infotabs_templates  drop constraint FK6B6F5B639E2633FA


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK6B6F5B63BD7EE7C4]') AND parent_obj = OBJECT_ID('infotabs_templates'))
alter table infotabs_templates  drop constraint FK6B6F5B63BD7EE7C4


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK75B01FA9FC406C67]') AND parent_obj = OBJECT_ID('infotabs_to_infotabs_templates'))
alter table infotabs_to_infotabs_templates  drop constraint FK75B01FA9FC406C67


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKEEB16F1474CB4188]') AND parent_obj = OBJECT_ID('place_names'))
alter table place_names  drop constraint FKEEB16F1474CB4188


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKDC41D6C2FA9C865D]') AND parent_obj = OBJECT_ID('place_to_colleges'))
alter table place_to_colleges  drop constraint FKDC41D6C2FA9C865D


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKDC41D6C29EB7DF69]') AND parent_obj = OBJECT_ID('place_to_colleges'))
alter table place_to_colleges  drop constraint FKDC41D6C29EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK9E2305358F92EEF8]') AND parent_obj = OBJECT_ID('media_repo'))
alter table media_repo  drop constraint FK9E2305358F92EEF8


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKBFD8318A2E12554A]') AND parent_obj = OBJECT_ID('advertisement_to_media'))
alter table advertisement_to_media  drop constraint FKBFD8318A2E12554A


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKBFD8318AA260EF8]') AND parent_obj = OBJECT_ID('advertisement_to_media'))
alter table advertisement_to_media  drop constraint FKBFD8318AA260EF8


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK94E3929A6366E633]') AND parent_obj = OBJECT_ID('media_to_fields'))
alter table media_to_fields  drop constraint FK94E3929A6366E633


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK780375186056F906]') AND parent_obj = OBJECT_ID('map_views'))
alter table map_views  drop constraint FK780375186056F906


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK780375189E2633FA]') AND parent_obj = OBJECT_ID('map_views'))
alter table map_views  drop constraint FK780375189E2633FA


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK78037518BD7EE7C4]') AND parent_obj = OBJECT_ID('map_views'))
alter table map_views  drop constraint FK78037518BD7EE7C4


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK78037518AA7F828B]') AND parent_obj = OBJECT_ID('map_views'))
alter table map_views  drop constraint FK78037518AA7F828B


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK780375185783610F]') AND parent_obj = OBJECT_ID('map_views'))
alter table map_views  drop constraint FK780375185783610F


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK78037518ABCC6B0]') AND parent_obj = OBJECT_ID('map_views'))
alter table map_views  drop constraint FK78037518ABCC6B0


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK78037518E1C1DFBB]') AND parent_obj = OBJECT_ID('map_views'))
alter table map_views  drop constraint FK78037518E1C1DFBB


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK3FDBF52C3B3DB5B7]') AND parent_obj = OBJECT_ID('authors_to_view'))
alter table authors_to_view  drop constraint FK3FDBF52C3B3DB5B7


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK3FDBF52C278C8B55]') AND parent_obj = OBJECT_ID('authors_to_view'))
alter table authors_to_view  drop constraint FK3FDBF52C278C8B55


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK87615F39DD7AB51B]') AND parent_obj = OBJECT_ID('view_to_fields'))
alter table view_to_fields  drop constraint FK87615F39DD7AB51B


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK95CCCA8F3B3DB5B7]') AND parent_obj = OBJECT_ID('place_to_view'))
alter table place_to_view  drop constraint FK95CCCA8F3B3DB5B7


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK95CCCA8F9EB7DF69]') AND parent_obj = OBJECT_ID('place_to_view'))
alter table place_to_view  drop constraint FK95CCCA8F9EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK545627773B3DB5B7]') AND parent_obj = OBJECT_ID('view_to_geometrics'))
alter table view_to_geometrics  drop constraint FK545627773B3DB5B7


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK54562777C032D61F]') AND parent_obj = OBJECT_ID('view_to_geometrics'))
alter table view_to_geometrics  drop constraint FK54562777C032D61F


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK176926FEC286DD5B]') AND parent_obj = OBJECT_ID('place_to_place_models'))
alter table place_to_place_models  drop constraint FK176926FEC286DD5B


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK84A60889D2A30196]') AND parent_obj = OBJECT_ID('place_to_usertags'))
alter table place_to_usertags  drop constraint FK84A60889D2A30196


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK84A608899EB7DF69]') AND parent_obj = OBJECT_ID('place_to_usertags'))
alter table place_to_usertags  drop constraint FK84A608899EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK909B63231736309E]') AND parent_obj = OBJECT_ID('comments'))
alter table comments  drop constraint FK909B63231736309E


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK909B63233B3DB5B7]') AND parent_obj = OBJECT_ID('comments'))
alter table comments  drop constraint FK909B63233B3DB5B7


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK909B63239EB7DF69]') AND parent_obj = OBJECT_ID('comments'))
alter table comments  drop constraint FK909B63239EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKA9E89150F1DC46D1]') AND parent_obj = OBJECT_ID('access_levels_to_privilege'))
alter table access_levels_to_privilege  drop constraint FKA9E89150F1DC46D1


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKA9E89150AD2B96A1]') AND parent_obj = OBJECT_ID('access_levels_to_privilege'))
alter table access_levels_to_privilege  drop constraint FKA9E89150AD2B96A1


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK94806F6B6493923B]') AND parent_obj = OBJECT_ID('place_to_tags'))
alter table place_to_tags  drop constraint FK94806F6B6493923B


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK94806F6B9EB7DF69]') AND parent_obj = OBJECT_ID('place_to_tags'))
alter table place_to_tags  drop constraint FK94806F6B9EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK9AD8F75638A81337]') AND parent_obj = OBJECT_ID('categories'))
alter table categories  drop constraint FK9AD8F75638A81337


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKA7B4C45DD003AECA]') AND parent_obj = OBJECT_ID('place_to_categories'))
alter table place_to_categories  drop constraint FKA7B4C45DD003AECA


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKA7B4C45D9EB7DF69]') AND parent_obj = OBJECT_ID('place_to_categories'))
alter table place_to_categories  drop constraint FKA7B4C45D9EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK19BF01191736309E]') AND parent_obj = OBJECT_ID('place_data'))
alter table place_data  drop constraint FK19BF01191736309E


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK3817A65AB74703D2]') AND parent_obj = OBJECT_ID('place_to_departments'))
alter table place_to_departments  drop constraint FK3817A65AB74703D2


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK3817A65A9EB7DF69]') AND parent_obj = OBJECT_ID('place_to_departments'))
alter table place_to_departments  drop constraint FK3817A65A9EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK3C482F67433F8477]') AND parent_obj = OBJECT_ID('advertisement'))
alter table advertisement  drop constraint FK3C482F67433F8477


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKB5C89604A260EF8]') AND parent_obj = OBJECT_ID('advertisement_to_tag'))
alter table advertisement_to_tag  drop constraint FKB5C89604A260EF8


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKAA44A29F6056F906]') AND parent_obj = OBJECT_ID('geometrics'))
alter table geometrics  drop constraint FKAA44A29F6056F906


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKAA44A29F9E2633FA]') AND parent_obj = OBJECT_ID('geometrics'))
alter table geometrics  drop constraint FKAA44A29F9E2633FA


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKAA44A29FBD7EE7C4]') AND parent_obj = OBJECT_ID('geometrics'))
alter table geometrics  drop constraint FKAA44A29FBD7EE7C4


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKAA44A29FF8E0A580]') AND parent_obj = OBJECT_ID('geometrics'))
alter table geometrics  drop constraint FKAA44A29FF8E0A580


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKAA44A29FEA53B1C0]') AND parent_obj = OBJECT_ID('geometrics'))
alter table geometrics  drop constraint FKAA44A29FEA53B1C0


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKAA44A29FAA7F828B]') AND parent_obj = OBJECT_ID('geometrics'))
alter table geometrics  drop constraint FKAA44A29FAA7F828B


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK36ED1C56214520DC]') AND parent_obj = OBJECT_ID('geometrics_to_geoparents'))
alter table geometrics_to_geoparents  drop constraint FK36ED1C56214520DC


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKA745E41BC032D61F]') AND parent_obj = OBJECT_ID('geometric_to_tags'))
alter table geometric_to_tags  drop constraint FKA745E41BC032D61F


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKFFB888DDC032D61F]') AND parent_obj = OBJECT_ID('geometrics_to_types'))
alter table geometrics_to_types  drop constraint FKFFB888DDC032D61F


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKDFB7D70F82DF231D]') AND parent_obj = OBJECT_ID('place_to_geometrics'))
alter table place_to_geometrics  drop constraint FKDFB7D70F82DF231D


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK476A14392B8707E4]') AND parent_obj = OBJECT_ID('geometrics_to_fields'))
alter table geometrics_to_fields  drop constraint FK476A14392B8707E4


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKB1C522AFC032D61F]') AND parent_obj = OBJECT_ID('geometrics_to_styles'))
alter table geometrics_to_styles  drop constraint FKB1C522AFC032D61F


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKA4F31195C032D61F]') AND parent_obj = OBJECT_ID('geometric_to_media'))
alter table geometric_to_media  drop constraint FKA4F31195C032D61F


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK82124028C032D61F]') AND parent_obj = OBJECT_ID('authors_to_geometrics'))
alter table authors_to_geometrics  drop constraint FK82124028C032D61F


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK82124028278C8B55]') AND parent_obj = OBJECT_ID('authors_to_geometrics'))
alter table authors_to_geometrics  drop constraint FK82124028278C8B55


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKB995793DF7C61B42]') AND parent_obj = OBJECT_ID('fields'))
alter table fields  drop constraint FKB995793DF7C61B42


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKBAE237C262FD36CC]') AND parent_obj = OBJECT_ID('geometric_events_to_style_options'))
alter table geometric_events_to_style_options  drop constraint FKBAE237C262FD36CC


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK2C1C7C05FA2E2CD]') AND parent_obj = OBJECT_ID('users'))
alter table users  drop constraint FK2C1C7C05FA2E2CD


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK2C1C7C05E2C531D7]') AND parent_obj = OBJECT_ID('users'))
alter table users  drop constraint FK2C1C7C05E2C531D7


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK765FB0C2278C8B55]') AND parent_obj = OBJECT_ID('authors_to_media'))
alter table authors_to_media  drop constraint FK765FB0C2278C8B55


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK7A486C6B278C8B55]') AND parent_obj = OBJECT_ID('authors_to_place'))
alter table authors_to_place  drop constraint FK7A486C6B278C8B55


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK7A486C6B9EB7DF69]') AND parent_obj = OBJECT_ID('authors_to_place'))
alter table authors_to_place  drop constraint FK7A486C6B9EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK457B0CD5278C8B55]') AND parent_obj = OBJECT_ID('authors_to_place_type'))
alter table authors_to_place_type  drop constraint FK457B0CD5278C8B55


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKA2EED20F782521DF]') AND parent_obj = OBJECT_ID('authors_to_colleges'))
alter table authors_to_colleges  drop constraint FKA2EED20F782521DF


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK5D9478D4278C8B55]') AND parent_obj = OBJECT_ID('authors_to_campus'))
alter table authors_to_campus  drop constraint FK5D9478D4278C8B55


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK485F6042278C8B55]') AND parent_obj = OBJECT_ID('authors_to_programs'))
alter table authors_to_programs  drop constraint FK485F6042278C8B55


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK670442CF278C8B55]') AND parent_obj = OBJECT_ID('authors_to_categories'))
alter table authors_to_categories  drop constraint FK670442CF278C8B55


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKD757204BE7CFC9A4]') AND parent_obj = OBJECT_ID('place_to_schools'))
alter table place_to_schools  drop constraint FKD757204BE7CFC9A4


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKD757204B9EB7DF69]') AND parent_obj = OBJECT_ID('place_to_schools'))
alter table place_to_schools  drop constraint FKD757204B9EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK3031FF59B060F593]') AND parent_obj = OBJECT_ID('infotabs'))
alter table infotabs  drop constraint FK3031FF59B060F593


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK5829AFC9F5BBC15]') AND parent_obj = OBJECT_ID('place_to_infotabs'))
alter table place_to_infotabs  drop constraint FK5829AFC9F5BBC15


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK5829AFC9EB7DF69]') AND parent_obj = OBJECT_ID('place_to_infotabs'))
alter table place_to_infotabs  drop constraint FK5829AFC9EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK81190F62B56886E1]') AND parent_obj = OBJECT_ID('events_set'))
alter table events_set  drop constraint FK81190F62B56886E1


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK81190F62BE51E8A4]') AND parent_obj = OBJECT_ID('events_set'))
alter table events_set  drop constraint FK81190F62BE51E8A4


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK16453F87EAAE27E7]') AND parent_obj = OBJECT_ID('geometric_events_to_events_set'))
alter table geometric_events_to_events_set  drop constraint FK16453F87EAAE27E7


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK879AC587C032D61F]') AND parent_obj = OBJECT_ID('geometrics_media'))
alter table geometrics_media  drop constraint FK879AC587C032D61F


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK879AC5872E12554A]') AND parent_obj = OBJECT_ID('geometrics_media'))
alter table geometrics_media  drop constraint FK879AC5872E12554A


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKE85A6DA7A9B8BAF]') AND parent_obj = OBJECT_ID('user_groups'))
alter table user_groups  drop constraint FKE85A6DA7A9B8BAF


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK6D16AA6AD2B96A1]') AND parent_obj = OBJECT_ID('groups_to_colleges'))
alter table groups_to_colleges  drop constraint FK6D16AA6AD2B96A1


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK2A94F026AD2B96A1]') AND parent_obj = OBJECT_ID('groups_to_campus'))
alter table groups_to_campus  drop constraint FK2A94F026AD2B96A1


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKE154D047AD2B96A1]') AND parent_obj = OBJECT_ID('groups_to_programs'))
alter table groups_to_programs  drop constraint FKE154D047AD2B96A1


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKF573053EAD2B96A1]') AND parent_obj = OBJECT_ID('groups_to_schools'))
alter table groups_to_schools  drop constraint FKF573053EAD2B96A1


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK251A097AD2B96A1]') AND parent_obj = OBJECT_ID('groups_to_categories'))
alter table groups_to_categories  drop constraint FK251A097AD2B96A1


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK29CFEF08D8CD01DB]') AND parent_obj = OBJECT_ID('place_to_admindepartments'))
alter table place_to_admindepartments  drop constraint FK29CFEF08D8CD01DB


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK29CFEF089EB7DF69]') AND parent_obj = OBJECT_ID('place_to_admindepartments'))
alter table place_to_admindepartments  drop constraint FK29CFEF089EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK3040346B62DEADB4]') AND parent_obj = OBJECT_ID('media_types'))
alter table media_types  drop constraint FK3040346B62DEADB4


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK20E47DAA54CA26B0]') AND parent_obj = OBJECT_ID('media_to_media_types'))
alter table media_to_media_types  drop constraint FK20E47DAA54CA26B0


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK5EA0A9E66056F906]') AND parent_obj = OBJECT_ID('place'))
alter table place  drop constraint FK5EA0A9E66056F906


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK5EA0A9E69E2633FA]') AND parent_obj = OBJECT_ID('place'))
alter table place  drop constraint FK5EA0A9E69E2633FA


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK5EA0A9E6BD7EE7C4]') AND parent_obj = OBJECT_ID('place'))
alter table place  drop constraint FK5EA0A9E6BD7EE7C4


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK5EA0A9E6C4608D0C]') AND parent_obj = OBJECT_ID('place'))
alter table place  drop constraint FK5EA0A9E6C4608D0C


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK5EA0A9E6AA7F828B]') AND parent_obj = OBJECT_ID('place'))
alter table place  drop constraint FK5EA0A9E6AA7F828B


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK5EA0A9E6E1C1DFBB]') AND parent_obj = OBJECT_ID('place'))
alter table place  drop constraint FK5EA0A9E6E1C1DFBB


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK5973EAB99EB7DF69]') AND parent_obj = OBJECT_ID('place_to_place_names'))
alter table place_to_place_names  drop constraint FK5973EAB99EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK252312D79EB7DF69]') AND parent_obj = OBJECT_ID('place_to_programs'))
alter table place_to_programs  drop constraint FK252312D79EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK252312D7A75037B7]') AND parent_obj = OBJECT_ID('place_to_programs'))
alter table place_to_programs  drop constraint FK252312D7A75037B7


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKA8D27D4D9EB7DF69]') AND parent_obj = OBJECT_ID('place_to_fields'))
alter table place_to_fields  drop constraint FKA8D27D4D9EB7DF69


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKCAAC26DF537B78C4]') AND parent_obj = OBJECT_ID('style_option_types_to_geometrics_types'))
alter table style_option_types_to_geometrics_types  drop constraint FKCAAC26DF537B78C4


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKEFA7BAC5808E7E4B]') AND parent_obj = OBJECT_ID('styles'))
alter table styles  drop constraint FKEFA7BAC5808E7E4B


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKED6D9EFFB56886E1]') AND parent_obj = OBJECT_ID('style_to_style_options'))
alter table style_to_style_options  drop constraint FKED6D9EFFB56886E1


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK29F697C8B56886E1]') AND parent_obj = OBJECT_ID('style_to_events_set'))
alter table style_to_events_set  drop constraint FK29F697C8B56886E1


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK2E164947B56886E1]') AND parent_obj = OBJECT_ID('style_to_zoom'))
alter table style_to_zoom  drop constraint FK2E164947B56886E1


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FK42EF0C8341C4EC1E]') AND parent_obj = OBJECT_ID('media_types_to_media_format'))
alter table media_types_to_media_format  drop constraint FK42EF0C8341C4EC1E


    if exists (select 1 from sysobjects where id = OBJECT_ID(N'[FKF6191103BE51E8A4]') AND parent_obj = OBJECT_ID('geometric_events_to_zoom'))
alter table geometric_events_to_zoom  drop constraint FKF6191103BE51E8A4


    if exists (select * from dbo.sysobjects where id = object_id(N'place_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_media

    if exists (select * from dbo.sysobjects where id = object_id(N'field_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table field_types

    if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_field_type') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_field_type

    if exists (select * from dbo.sysobjects where id = object_id(N'access_levels_to_field_type') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table access_levels_to_field_type

    if exists (select * from dbo.sysobjects where id = object_id(N'place_status') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_status

    if exists (select * from dbo.sysobjects where id = object_id(N'place_comments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_comments

    if exists (select * from dbo.sysobjects where id = object_id(N'style_options') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table style_options

    if exists (select * from dbo.sysobjects where id = object_id(N'person') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table person

    if exists (select * from dbo.sysobjects where id = object_id(N'place_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_types

    if exists (select * from dbo.sysobjects where id = object_id(N'place_to_place_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_place_types

    if exists (select * from dbo.sysobjects where id = object_id(N'google_types_to_place_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table google_types_to_place_types

    if exists (select * from dbo.sysobjects where id = object_id(N'infotabs_templates') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table infotabs_templates

    if exists (select * from dbo.sysobjects where id = object_id(N'infotabs_to_infotabs_templates') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table infotabs_to_infotabs_templates

    if exists (select * from dbo.sysobjects where id = object_id(N'place_names') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_names

    if exists (select * from dbo.sysobjects where id = object_id(N'colleges') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table colleges

    if exists (select * from dbo.sysobjects where id = object_id(N'place_to_colleges') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_colleges

    if exists (select * from dbo.sysobjects where id = object_id(N'media_repo') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_repo

    if exists (select * from dbo.sysobjects where id = object_id(N'advertisement_to_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table advertisement_to_media

    if exists (select * from dbo.sysobjects where id = object_id(N'media_to_fields') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_to_fields

    if exists (select * from dbo.sysobjects where id = object_id(N'map_views') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table map_views

    if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_view') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_view

    if exists (select * from dbo.sysobjects where id = object_id(N'view_to_fields') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table view_to_fields

    if exists (select * from dbo.sysobjects where id = object_id(N'place_to_view') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_view

    if exists (select * from dbo.sysobjects where id = object_id(N'view_to_geometrics') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table view_to_geometrics

    if exists (select * from dbo.sysobjects where id = object_id(N'place_models') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_models

    if exists (select * from dbo.sysobjects where id = object_id(N'place_to_place_models') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_place_models

    if exists (select * from dbo.sysobjects where id = object_id(N'usertags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table usertags

    if exists (select * from dbo.sysobjects where id = object_id(N'place_to_usertags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_usertags

    if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_status') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_status

    if exists (select * from dbo.sysobjects where id = object_id(N'comments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table comments

    if exists (select * from dbo.sysobjects where id = object_id(N'privileges') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table privileges

    if exists (select * from dbo.sysobjects where id = object_id(N'access_levels_to_privilege') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table access_levels_to_privilege

    if exists (select * from dbo.sysobjects where id = object_id(N'person_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table person_types

    if exists (select * from dbo.sysobjects where id = object_id(N'tags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table tags

    if exists (select * from dbo.sysobjects where id = object_id(N'place_to_tags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_tags

    if exists (select * from dbo.sysobjects where id = object_id(N'google_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table google_types

    if exists (select * from dbo.sysobjects where id = object_id(N'categories') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table categories

    if exists (select * from dbo.sysobjects where id = object_id(N'place_to_categories') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_categories

    if exists (select * from dbo.sysobjects where id = object_id(N'place_data') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_data

    if exists (select * from dbo.sysobjects where id = object_id(N'departments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table departments

    if exists (select * from dbo.sysobjects where id = object_id(N'place_to_departments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_departments

    if exists (select * from dbo.sysobjects where id = object_id(N'logs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table logs

    if exists (select * from dbo.sysobjects where id = object_id(N'advertisement') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table advertisement

    if exists (select * from dbo.sysobjects where id = object_id(N'advertisement_to_tag') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table advertisement_to_tag

    if exists (select * from dbo.sysobjects where id = object_id(N'geometrics') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics

    if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_to_geoparents') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_to_geoparents

    if exists (select * from dbo.sysobjects where id = object_id(N'geometric_to_tags') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometric_to_tags

    if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_to_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_to_types

    if exists (select * from dbo.sysobjects where id = object_id(N'place_to_geometrics') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_geometrics

    if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_to_fields') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_to_fields

    if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_to_styles') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_to_styles

    if exists (select * from dbo.sysobjects where id = object_id(N'geometric_to_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometric_to_media

    if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_geometrics') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_geometrics

    if exists (select * from dbo.sysobjects where id = object_id(N'fields') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table fields

    if exists (select * from dbo.sysobjects where id = object_id(N'geometric_events') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometric_events

    if exists (select * from dbo.sysobjects where id = object_id(N'geometric_events_to_style_options') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometric_events_to_style_options

    if exists (select * from dbo.sysobjects where id = object_id(N'users') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table users

    if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_media

    if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_place') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_place

    if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_place_type') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_place_type

    if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_colleges') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_colleges

    if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_campus') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_campus

    if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_programs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_programs

    if exists (select * from dbo.sysobjects where id = object_id(N'authors_to_categories') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table authors_to_categories

    if exists (select * from dbo.sysobjects where id = object_id(N'user_settings') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table user_settings

    if exists (select * from dbo.sysobjects where id = object_id(N'schools') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table schools

    if exists (select * from dbo.sysobjects where id = object_id(N'place_to_schools') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_schools

    if exists (select * from dbo.sysobjects where id = object_id(N'infotabs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table infotabs

    if exists (select * from dbo.sysobjects where id = object_id(N'place_to_infotabs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_infotabs

    if exists (select * from dbo.sysobjects where id = object_id(N'events_set') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table events_set

    if exists (select * from dbo.sysobjects where id = object_id(N'geometric_events_to_events_set') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometric_events_to_events_set

    if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_media') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_media

    if exists (select * from dbo.sysobjects where id = object_id(N'user_groups') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table user_groups

    if exists (select * from dbo.sysobjects where id = object_id(N'groups_to_colleges') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table groups_to_colleges

    if exists (select * from dbo.sysobjects where id = object_id(N'groups_to_campus') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table groups_to_campus

    if exists (select * from dbo.sysobjects where id = object_id(N'groups_to_programs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table groups_to_programs

    if exists (select * from dbo.sysobjects where id = object_id(N'groups_to_schools') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table groups_to_schools

    if exists (select * from dbo.sysobjects where id = object_id(N'groups_to_categories') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table groups_to_categories

    if exists (select * from dbo.sysobjects where id = object_id(N'admindepartments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table admindepartments

    if exists (select * from dbo.sysobjects where id = object_id(N'place_to_admindepartments') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_admindepartments

    if exists (select * from dbo.sysobjects where id = object_id(N'place_name_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_name_types

    if exists (select * from dbo.sysobjects where id = object_id(N'media_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_types

    if exists (select * from dbo.sysobjects where id = object_id(N'media_to_media_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_to_media_types

    if exists (select * from dbo.sysobjects where id = object_id(N'place') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place

    if exists (select * from dbo.sysobjects where id = object_id(N'place_to_place_names') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_place_names

    if exists (select * from dbo.sysobjects where id = object_id(N'place_to_programs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_programs

    if exists (select * from dbo.sysobjects where id = object_id(N'place_to_fields') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table place_to_fields

    if exists (select * from dbo.sysobjects where id = object_id(N'geometrics_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometrics_types

    if exists (select * from dbo.sysobjects where id = object_id(N'style_option_types_to_geometrics_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table style_option_types_to_geometrics_types

    if exists (select * from dbo.sysobjects where id = object_id(N'small_url') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table small_url

    if exists (select * from dbo.sysobjects where id = object_id(N'programs') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table programs

    if exists (select * from dbo.sysobjects where id = object_id(N'status') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table status

    if exists (select * from dbo.sysobjects where id = object_id(N'style_option_types') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table style_option_types

    if exists (select * from dbo.sysobjects where id = object_id(N'campus') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table campus

    if exists (select * from dbo.sysobjects where id = object_id(N'styles') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table styles

    if exists (select * from dbo.sysobjects where id = object_id(N'style_to_style_options') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table style_to_style_options

    if exists (select * from dbo.sysobjects where id = object_id(N'style_to_events_set') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table style_to_events_set

    if exists (select * from dbo.sysobjects where id = object_id(N'style_to_zoom') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table style_to_zoom

    if exists (select * from dbo.sysobjects where id = object_id(N'media_format') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_format

    if exists (select * from dbo.sysobjects where id = object_id(N'media_types_to_media_format') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table media_types_to_media_format

    if exists (select * from dbo.sysobjects where id = object_id(N'zoom_levels') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table zoom_levels

    if exists (select * from dbo.sysobjects where id = object_id(N'geometric_events_to_zoom') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table geometric_events_to_zoom

    create table place_media (
        Id INT IDENTITY NOT NULL,
       place_order INT null,
       place_id INT null,
       media_id INT null,
       primary key (Id)
    )

    create table field_types (
        field_type_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       alias NVARCHAR(255) null,
       attr NVARCHAR(255) null,
       model NVARCHAR(255) null,
       fieldset INT null,
       is_public BIT null,
       primary key (field_type_id)
    )

    create table authors_to_field_type (
        field_type_id INT not null,
       author_id INT not null
    )

    create table access_levels_to_field_type (
        field_type_id INT not null,
       access_level_id INT not null
    )

    create table place_status (
        Id INT IDENTITY NOT NULL,
       Title NVARCHAR(255) null,
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

    create table style_options (
        style_option_id INT IDENTITY NOT NULL,
       value NVARCHAR(255) null,
       type INT null,
       event INT null,
       zoom INT null,
       primary key (style_option_id)
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

    create table place_types (
        place_type_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       friendly_name NVARCHAR(255) null,
       primary key (place_type_id)
    )

    create table place_to_place_types (
        place_type_id INT not null,
       place_id INT not null
    )

    create table google_types_to_place_types (
        google_type_id INT not null,
       place_type_id INT not null
    )

    create table infotabs_templates (
        template_id INT IDENTITY NOT NULL,
       creation_date DATETIME default GETDATE()  null,
       updated_date DATETIME default GETDATE()  null,
       publish_time DATETIME default GETDATE()  null,
       tmp BIT default 0  null,
       outputError BIT default 0  null,
       isPublic BIT default 1  null,
       name NVARCHAR(255) null,
       alias NVARCHAR(255) null,
       content NVARCHAR(255) null,
       process BIT null,
       editing INT null,
       onwer INT null,
       status INT null,
       primary key (template_id)
    )

    create table infotabs_to_infotabs_templates (
        infotab_id INT not null,
       template_id INT not null
    )

    create table place_names (
        name_id INT IDENTITY NOT NULL,
       place_id INT null,
       name NVARCHAR(255) null,
       label INT null,
       primary key (name_id)
    )

    create table colleges (
        college_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       url NVARCHAR(255) null,
       attr NVARCHAR(255) null,
       primary key (college_id)
    )

    create table place_to_colleges (
        college_id INT not null,
       place_id INT not null
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

    create table advertisement_to_media (
        media_id INT not null,
       ad_id INT not null
    )

    create table media_to_fields (
        field_id INT not null,
       media_id INT not null
    )

    create table map_views (
        view_id INT IDENTITY NOT NULL,
       creation_date DATETIME default GETDATE()  null,
       updated_date DATETIME default GETDATE()  null,
       publish_time DATETIME default GETDATE()  null,
       tmp BIT default 0  null,
       outputError BIT default 0  null,
       isPublic BIT default 1  null,
       name NVARCHAR(255) null,
       alias NVARCHAR(255) null,
       idkey NVARCHAR(255) null,
       cache_path NVARCHAR(255) null,
       show_global_nav BIT null,
       commentable BIT null,
       sharable BIT null,
       width INT null,
       height INT null,
       fit_to_bound NVARCHAR(255) null,
       center geography null,
       staticMap NVARCHAR(255) null,
       optionObj NVARCHAR(255) null,
       editing INT null,
       onwer INT null,
       status INT null,
       media INT null,
       forced_shapes_style INT null,
       forced_marker_style INT null,
       campus INT null,
       primary key (view_id)
    )

    create table authors_to_view (
        view_id INT not null,
       author_id INT not null
    )

    create table view_to_fields (
        field_id INT not null,
       view_id INT not null
    )

    create table place_to_view (
        view_id INT not null,
       place_id INT not null
    )

    create table view_to_geometrics (
        view_id INT not null,
       geometric_id INT not null
    )

    create table place_models (
        place_model_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       attr NVARCHAR(255) null,
       primary key (place_model_id)
    )

    create table place_to_place_models (
        place_model_id INT not null,
       place_id INT not null
    )

    create table usertags (
        usertag_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       attr NVARCHAR(255) null,
       primary key (usertag_id)
    )

    create table place_to_usertags (
        usertag_id INT not null,
       place_id INT not null
    )

    create table geometrics_status (
        Id INT IDENTITY NOT NULL,
       Title NVARCHAR(255) null,
       primary key (Id)
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

    create table privileges (
        privilege_id INT IDENTITY NOT NULL,
       title NVARCHAR(255) null,
       alias NVARCHAR(255) null,
       editable BIT null,
       discription NVARCHAR(255) null,
       primary key (privilege_id)
    )

    create table access_levels_to_privilege (
        privilege_id INT not null,
       access_level_id INT not null
    )

    create table person_types (
        Id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       Deleted BIT null,
       attr NVARCHAR(255) null,
       primary key (Id)
    )

    create table tags (
        tag_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       attr NVARCHAR(255) null,
       primary key (tag_id)
    )

    create table place_to_tags (
        tag_id INT not null,
       place_id INT not null
    )

    create table google_types (
        google_type_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       primary key (google_type_id)
    )

    create table categories (
        category_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       level INT null,
       position INT null,
       url NVARCHAR(255) null,
       asLink BIT null,
       active BIT null,
       friendly_name NVARCHAR(255) null,
       Parent INT null,
       primary key (category_id)
    )

    create table place_to_categories (
        category_id INT not null,
       place_id INT not null
    )

    create table place_data (
        Id INT IDENTITY NOT NULL,
       [Key] NVARCHAR(255) null,
       Data NVARCHAR(255) null,
       Place INT null,
       primary key (Id)
    )

    create table departments (
        department_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       url NVARCHAR(255) null,
       attr NVARCHAR(255) null,
       primary key (department_id)
    )

    create table place_to_departments (
        department_id INT not null,
       place_id INT not null
    )

    create table logs (
        log_id INT IDENTITY NOT NULL,
       entry NVARCHAR(255) null,
       code NVARCHAR(255) null,
       obj_id INT null,
       action NVARCHAR(255) null,
       controller NVARCHAR(255) null,
       nid NVARCHAR(255) null,
       ip NVARCHAR(255) null,
       dtOfLog DATETIME null,
       primary key (log_id)
    )

    create table advertisement (
        ad_id INT IDENTITY NOT NULL,
       Clicked INT null,
       Url NVARCHAR(255) null,
       Views INT default 0  null,
       HtmlText NVARCHAR(255) null,
       Name NVARCHAR(255) null,
       limitAds NVARCHAR(255) default 0  null,
       maxClicks INT default 0  null,
       maxImpressions INT default 0  null,
       expiration DATETIME null,
       startdate DATETIME null,
       place_types INT null,
       primary key (ad_id)
    )

    create table advertisement_to_tag (
        ad_id INT not null,
       tag_id INT not null
    )

    create table geometrics (
        geometric_id INT IDENTITY NOT NULL,
       creation_date DATETIME default GETDATE()  null,
       updated_date DATETIME default GETDATE()  null,
       publish_time DATETIME default GETDATE()  null,
       tmp BIT default 0  null,
       outputError BIT default 0  null,
       isPublic BIT default 1  null,
       boundary geography null,
       name NVARCHAR(255) null,
       encoded NVARCHAR(255) null,
       staticMap NVARCHAR(255) null,
       editing INT null,
       onwer INT null,
       status INT null,
       default_type INT null,
       parent INT null,
       media INT null,
       primary key (geometric_id)
    )

    create table geometrics_to_geoparents (
        parent_geometric_id INT not null,
       geometric_id INT not null
    )

    create table geometric_to_tags (
        geometric_id INT not null,
       tag_id INT not null
    )

    create table geometrics_to_types (
        geometric_id INT not null,
       geometrics_type_id INT not null
    )

    create table place_to_geometrics (
        place_id INT not null,
       geometric_id INT not null
    )

    create table geometrics_to_fields (
        field_id INT not null,
       geometric_id INT not null
    )

    create table geometrics_to_styles (
        geometric_id INT not null,
       style_id INT not null
    )

    create table geometric_to_media (
        geometric_id INT not null,
       media_id INT not null
    )

    create table authors_to_geometrics (
        geometric_id INT not null,
       author_id INT not null
    )

    create table fields (
        field_id INT IDENTITY NOT NULL,
       value NVARCHAR(255) null,
       owner INT null,
       type INT null,
       primary key (field_id)
    )

    create table geometric_events (
        geometric_event_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       friendly_name NVARCHAR(255) null,
       primary key (geometric_event_id)
    )

    create table geometric_events_to_style_options (
        geometric_event_id INT not null,
       style_option_id INT not null
    )

    create table users (
        author_id INT IDENTITY NOT NULL,
       nid NVARCHAR(255) null,
       name NVARCHAR(255) null,
       email NVARCHAR(255) null,
       phone NVARCHAR(255) null,
       active BIT null,
       logedin BIT null,
       LastActive DATETIME null,
       groups INT null,
       settings INT null,
       primary key (author_id)
    )

    create table authors_to_media (
        author_id INT not null,
       media_id INT not null
    )

    create table authors_to_place (
        author_id INT not null,
       place_id INT not null
    )

    create table authors_to_place_type (
        author_id INT not null,
       place_type_id INT not null
    )

    create table authors_to_colleges (
        college_id INT not null,
       author_id INT not null
    )

    create table authors_to_campus (
        author_id INT not null,
       campus_id INT not null
    )

    create table authors_to_programs (
        author_id INT not null,
       program_id INT not null
    )

    create table authors_to_categories (
        author_id INT not null,
       category_id INT not null
    )

    create table user_settings (
        user_settings_id INT IDENTITY NOT NULL,
       attr NVARCHAR(255) null,
       primary key (user_settings_id)
    )

    create table schools (
        school_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       url NVARCHAR(255) null,
       attr NVARCHAR(255) null,
       primary key (school_id)
    )

    create table place_to_schools (
        school_id INT not null,
       place_id INT not null
    )

    create table infotabs (
        infotab_id INT IDENTITY NOT NULL,
       content NVARCHAR(255) null,
       title NVARCHAR(255) null,
       sort INT null,
       template INT null,
       primary key (infotab_id)
    )

    create table place_to_infotabs (
        infotab_id INT not null,
       place_id INT not null
    )

    create table events_set (
        events_set_id INT IDENTITY NOT NULL,
       style_id INT null,
       zoom_id INT null,
       primary key (events_set_id)
    )

    create table geometric_events_to_events_set (
        geometric_event_id INT not null,
       events_set_id INT not null
    )

    create table geometrics_media (
        Id INT IDENTITY NOT NULL,
       geometric_order INT null,
       geometric_id INT null,
       media_id INT null,
       primary key (Id)
    )

    create table user_groups (
        access_level_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       alias NVARCHAR(255) null,
       default_group BIT default 0  null,
       isAdmin BIT default 0  null,
       allow_signup BIT default 0  null,
       parent INT null,
       primary key (access_level_id)
    )

    create table groups_to_colleges (
        access_level_id INT not null,
       college_id INT not null
    )

    create table groups_to_campus (
        access_level_id INT not null,
       campus_id INT not null
    )

    create table groups_to_programs (
        access_level_id INT not null,
       program_id INT not null
    )

    create table groups_to_schools (
        access_level_id INT not null,
       school_id INT not null
    )

    create table groups_to_categories (
        access_level_id INT not null,
       category_id INT not null
    )

    create table admindepartments (
        admindepartment_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       url NVARCHAR(255) null,
       attr NVARCHAR(255) null,
       primary key (admindepartment_id)
    )

    create table place_to_admindepartments (
        admindepartment_id INT not null,
       place_id INT not null
    )

    create table place_name_types (
        type_id INT IDENTITY NOT NULL,
       type NVARCHAR(255) null,
       primary key (type_id)
    )

    create table media_types (
        media_type_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       attr NVARCHAR(255) null,
       media_format_id INT null,
       primary key (media_type_id)
    )

    create table media_to_media_types (
        media_id INT not null,
       media_type_id INT not null
    )

    create table place (
        place_id INT IDENTITY NOT NULL,
       creation_date DATETIME default GETDATE()  null,
       updated_date DATETIME default GETDATE()  null,
       publish_time DATETIME default GETDATE()  null,
       tmp BIT default 0  null,
       outputError BIT default 0  null,
       isPublic BIT default 1  null,
       infoTitle NVARCHAR(255) null,
       prime_name NVARCHAR(255) null,
       abbrev_name NVARCHAR(255) null,
       summary NVARCHAR(255) null,
       details NVARCHAR(255) null,
       address NVARCHAR(255) null,
       street NVARCHAR(255) null,
       coordinate geography null,
       plus_four_code tinyint null,
       hideTitles BIT null,
       autoAccessibility BIT null,
       staticMap NVARCHAR(255) null,
       pointImg NVARCHAR(255) null,
       percentfull NVARCHAR(255) null,
       editing INT null,
       onwer INT null,
       status INT null,
       model INT null,
       media INT null,
       campus INT null,
       primary key (place_id)
    )

    create table place_to_place_names (
        place_id INT not null,
       name_id INT not null
    )

    create table place_to_programs (
        place_id INT not null,
       program_id INT not null
    )

    create table place_to_fields (
        place_id INT not null,
       field_id INT not null
    )

    create table geometrics_types (
        geometrics_type_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       attr NVARCHAR(255) null,
       primary key (geometrics_type_id)
    )

    create table style_option_types_to_geometrics_types (
        geometrics_type_id INT not null,
       style_option_type_id INT not null
    )

    create table small_url (
        small_url_id INT IDENTITY NOT NULL,
       small_url NVARCHAR(255) null,
       original NVARCHAR(255) null,
       primary key (small_url_id)
    )

    create table programs (
        program_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       url NVARCHAR(255) null,
       attr NVARCHAR(255) null,
       primary key (program_id)
    )

    create table status (
        status_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       primary key (status_id)
    )

    create table style_option_types (
        style_option_type_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       primary key (style_option_type_id)
    )

    create table campus (
        campus_id INT IDENTITY NOT NULL,
       gameDayTourOn BIT null,
       city NVARCHAR(255) null,
       name NVARCHAR(255) null,
       url NVARCHAR(255) null,
       state NVARCHAR(255) null,
       state_abbrev NVARCHAR(255) null,
       zipcode INT null,
       latitude DECIMAL(19,5) null,
       longitude DECIMAL(19,5) null,
       primary key (campus_id)
    )

    create table styles (
        style_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       style_obj NVARCHAR(255) null,
       type INT null,
       primary key (style_id)
    )

    create table style_to_style_options (
        style_id INT not null,
       style_option_id INT not null
    )

    create table style_to_events_set (
        style_id INT not null,
       events_set_id INT not null
    )

    create table style_to_zoom (
        style_id INT not null,
       zoom_id INT not null
    )

    create table media_format (
        media_format_id INT IDENTITY NOT NULL,
       name NVARCHAR(255) null,
       attr NVARCHAR(255) null,
       primary key (media_format_id)
    )

    create table media_types_to_media_format (
        media_type_id INT not null,
       media_format_id INT not null
    )

    create table zoom_levels (
        zoom_id INT IDENTITY NOT NULL,
       zoom_start INT null,
       zoom_end INT null,
       primary key (zoom_id)
    )

    create table geometric_events_to_zoom (
        zoom_id INT not null,
       geometric_event_id INT not null
    )

    alter table place_media 
        add constraint FK675D342C9EB7DF69 
        foreign key (place_id) 
        references place

    alter table place_media 
        add constraint FK675D342C2E12554A 
        foreign key (media_id) 
        references media_repo

    alter table authors_to_field_type 
        add constraint FK8682B43A3B3B2D33 
        foreign key (field_type_id) 
        references field_types

    alter table authors_to_field_type 
        add constraint FK8682B43A278C8B55 
        foreign key (author_id) 
        references users

    alter table access_levels_to_field_type 
        add constraint FK3420CED23B3B2D33 
        foreign key (field_type_id) 
        references field_types

    alter table access_levels_to_field_type 
        add constraint FK3420CED2AD2B96A1 
        foreign key (access_level_id) 
        references user_groups

    alter table place_comments 
        add constraint FK676BA7231736309E 
        foreign key (place) 
        references place

    alter table style_options 
        add constraint FKAEABE8A7338B5168 
        foreign key (type) 
        references style_option_types

    alter table style_options 
        add constraint FKAEABE8A7BE642297 
        foreign key (event) 
        references geometric_events

    alter table style_options 
        add constraint FKAEABE8A7A160664F 
        foreign key (zoom) 
        references zoom_levels

    alter table person 
        add constraint FK8C55D4CB76976B0D 
        foreign key (AccessLevelStatus) 
        references user_groups

    alter table person 
        add constraint FK8C55D4CB50888406 
        foreign key (personTypeId) 
        references person_types

    alter table place_to_place_types 
        add constraint FKB0BAEAC140E8EC9 
        foreign key (place_type_id) 
        references place_types

    alter table place_to_place_types 
        add constraint FKB0BAEAC19EB7DF69 
        foreign key (place_id) 
        references place

    alter table google_types_to_place_types 
        add constraint FK7BF82739D43A3512 
        foreign key (google_type_id) 
        references place_types

    alter table infotabs_templates 
        add constraint FK6B6F5B636056F906 
        foreign key (editing) 
        references users

    alter table infotabs_templates 
        add constraint FK6B6F5B639E2633FA 
        foreign key (onwer) 
        references users

    alter table infotabs_templates 
        add constraint FK6B6F5B63BD7EE7C4 
        foreign key (status) 
        references status

    alter table infotabs_to_infotabs_templates 
        add constraint FK75B01FA9FC406C67 
        foreign key (infotab_id) 
        references infotabs_templates

    alter table place_names 
        add constraint FKEEB16F1474CB4188 
        foreign key (label) 
        references place_name_types

    alter table place_to_colleges 
        add constraint FKDC41D6C2FA9C865D 
        foreign key (college_id) 
        references colleges

    alter table place_to_colleges 
        add constraint FKDC41D6C29EB7DF69 
        foreign key (place_id) 
        references place

    alter table media_repo 
        add constraint FK9E2305358F92EEF8 
        foreign key (media_type_id) 
        references media_types

    alter table advertisement_to_media 
        add constraint FKBFD8318A2E12554A 
        foreign key (media_id) 
        references media_repo

    alter table advertisement_to_media 
        add constraint FKBFD8318AA260EF8 
        foreign key (ad_id) 
        references advertisement

    alter table media_to_fields 
        add constraint FK94E3929A6366E633 
        foreign key (field_id) 
        references media_repo

    alter table map_views 
        add constraint FK780375186056F906 
        foreign key (editing) 
        references users

    alter table map_views 
        add constraint FK780375189E2633FA 
        foreign key (onwer) 
        references users

    alter table map_views 
        add constraint FK78037518BD7EE7C4 
        foreign key (status) 
        references status

    alter table map_views 
        add constraint FK78037518AA7F828B 
        foreign key (media) 
        references media_repo

    alter table map_views 
        add constraint FK780375185783610F 
        foreign key (forced_shapes_style) 
        references styles

    alter table map_views 
        add constraint FK78037518ABCC6B0 
        foreign key (forced_marker_style) 
        references styles

    alter table map_views 
        add constraint FK78037518E1C1DFBB 
        foreign key (campus) 
        references campus

    alter table authors_to_view 
        add constraint FK3FDBF52C3B3DB5B7 
        foreign key (view_id) 
        references map_views

    alter table authors_to_view 
        add constraint FK3FDBF52C278C8B55 
        foreign key (author_id) 
        references users

    alter table view_to_fields 
        add constraint FK87615F39DD7AB51B 
        foreign key (field_id) 
        references map_views

    alter table place_to_view 
        add constraint FK95CCCA8F3B3DB5B7 
        foreign key (view_id) 
        references map_views

    alter table place_to_view 
        add constraint FK95CCCA8F9EB7DF69 
        foreign key (place_id) 
        references place

    alter table view_to_geometrics 
        add constraint FK545627773B3DB5B7 
        foreign key (view_id) 
        references map_views

    alter table view_to_geometrics 
        add constraint FK54562777C032D61F 
        foreign key (geometric_id) 
        references geometrics

    alter table place_to_place_models 
        add constraint FK176926FEC286DD5B 
        foreign key (place_model_id) 
        references place_models

    alter table place_to_usertags 
        add constraint FK84A60889D2A30196 
        foreign key (usertag_id) 
        references usertags

    alter table place_to_usertags 
        add constraint FK84A608899EB7DF69 
        foreign key (place_id) 
        references place

    alter table comments 
        add constraint FK909B63231736309E 
        foreign key (place) 
        references place

    alter table comments 
        add constraint FK909B63233B3DB5B7 
        foreign key (view_id) 
        references map_views

    alter table comments 
        add constraint FK909B63239EB7DF69 
        foreign key (place_id) 
        references place

    alter table access_levels_to_privilege 
        add constraint FKA9E89150F1DC46D1 
        foreign key (privilege_id) 
        references privileges

    alter table access_levels_to_privilege 
        add constraint FKA9E89150AD2B96A1 
        foreign key (access_level_id) 
        references user_groups

    alter table place_to_tags 
        add constraint FK94806F6B6493923B 
        foreign key (tag_id) 
        references tags

    alter table place_to_tags 
        add constraint FK94806F6B9EB7DF69 
        foreign key (place_id) 
        references place

    alter table categories 
        add constraint FK9AD8F75638A81337 
        foreign key (Parent) 
        references categories

    alter table place_to_categories 
        add constraint FKA7B4C45DD003AECA 
        foreign key (category_id) 
        references categories

    alter table place_to_categories 
        add constraint FKA7B4C45D9EB7DF69 
        foreign key (place_id) 
        references place

    alter table place_data 
        add constraint FK19BF01191736309E 
        foreign key (Place) 
        references place

    alter table place_to_departments 
        add constraint FK3817A65AB74703D2 
        foreign key (department_id) 
        references departments

    alter table place_to_departments 
        add constraint FK3817A65A9EB7DF69 
        foreign key (place_id) 
        references place

    alter table advertisement 
        add constraint FK3C482F67433F8477 
        foreign key (place_types) 
        references place_types

    alter table advertisement_to_tag 
        add constraint FKB5C89604A260EF8 
        foreign key (ad_id) 
        references advertisement

    alter table geometrics 
        add constraint FKAA44A29F6056F906 
        foreign key (editing) 
        references users

    alter table geometrics 
        add constraint FKAA44A29F9E2633FA 
        foreign key (onwer) 
        references users

    alter table geometrics 
        add constraint FKAA44A29FBD7EE7C4 
        foreign key (status) 
        references status

    alter table geometrics 
        add constraint FKAA44A29FF8E0A580 
        foreign key (default_type) 
        references geometrics_types

    alter table geometrics 
        add constraint FKAA44A29FEA53B1C0 
        foreign key (parent) 
        references geometrics

    alter table geometrics 
        add constraint FKAA44A29FAA7F828B 
        foreign key (media) 
        references media_repo

    alter table geometrics_to_geoparents 
        add constraint FK36ED1C56214520DC 
        foreign key (parent_geometric_id) 
        references geometrics

    alter table geometric_to_tags 
        add constraint FKA745E41BC032D61F 
        foreign key (geometric_id) 
        references geometrics

    alter table geometrics_to_types 
        add constraint FKFFB888DDC032D61F 
        foreign key (geometric_id) 
        references geometrics

    alter table place_to_geometrics 
        add constraint FKDFB7D70F82DF231D 
        foreign key (place_id) 
        references geometrics

    alter table geometrics_to_fields 
        add constraint FK476A14392B8707E4 
        foreign key (field_id) 
        references geometrics

    alter table geometrics_to_styles 
        add constraint FKB1C522AFC032D61F 
        foreign key (geometric_id) 
        references geometrics

    alter table geometric_to_media 
        add constraint FKA4F31195C032D61F 
        foreign key (geometric_id) 
        references geometrics

    alter table authors_to_geometrics 
        add constraint FK82124028C032D61F 
        foreign key (geometric_id) 
        references geometrics

    alter table authors_to_geometrics 
        add constraint FK82124028278C8B55 
        foreign key (author_id) 
        references users

    alter table fields 
        add constraint FKB995793DF7C61B42 
        foreign key (type) 
        references field_types

    alter table geometric_events_to_style_options 
        add constraint FKBAE237C262FD36CC 
        foreign key (geometric_event_id) 
        references geometric_events

    alter table users 
        add constraint FK2C1C7C05FA2E2CD 
        foreign key (groups) 
        references user_groups

    alter table users 
        add constraint FK2C1C7C05E2C531D7 
        foreign key (settings) 
        references user_settings

    alter table authors_to_media 
        add constraint FK765FB0C2278C8B55 
        foreign key (author_id) 
        references users

    alter table authors_to_place 
        add constraint FK7A486C6B278C8B55 
        foreign key (author_id) 
        references users

    alter table authors_to_place 
        add constraint FK7A486C6B9EB7DF69 
        foreign key (place_id) 
        references place

    alter table authors_to_place_type 
        add constraint FK457B0CD5278C8B55 
        foreign key (author_id) 
        references users

    alter table authors_to_colleges 
        add constraint FKA2EED20F782521DF 
        foreign key (college_id) 
        references users

    alter table authors_to_campus 
        add constraint FK5D9478D4278C8B55 
        foreign key (author_id) 
        references users

    alter table authors_to_programs 
        add constraint FK485F6042278C8B55 
        foreign key (author_id) 
        references users

    alter table authors_to_categories 
        add constraint FK670442CF278C8B55 
        foreign key (author_id) 
        references users

    alter table place_to_schools 
        add constraint FKD757204BE7CFC9A4 
        foreign key (school_id) 
        references schools

    alter table place_to_schools 
        add constraint FKD757204B9EB7DF69 
        foreign key (place_id) 
        references place

    alter table infotabs 
        add constraint FK3031FF59B060F593 
        foreign key (template) 
        references infotabs_templates

    alter table place_to_infotabs 
        add constraint FK5829AFC9F5BBC15 
        foreign key (infotab_id) 
        references infotabs

    alter table place_to_infotabs 
        add constraint FK5829AFC9EB7DF69 
        foreign key (place_id) 
        references place

    alter table events_set 
        add constraint FK81190F62B56886E1 
        foreign key (style_id) 
        references styles

    alter table events_set 
        add constraint FK81190F62BE51E8A4 
        foreign key (zoom_id) 
        references zoom_levels

    alter table geometric_events_to_events_set 
        add constraint FK16453F87EAAE27E7 
        foreign key (geometric_event_id) 
        references events_set

    alter table geometrics_media 
        add constraint FK879AC587C032D61F 
        foreign key (geometric_id) 
        references geometrics

    alter table geometrics_media 
        add constraint FK879AC5872E12554A 
        foreign key (media_id) 
        references media_repo

    alter table user_groups 
        add constraint FKE85A6DA7A9B8BAF 
        foreign key (parent) 
        references user_groups

    alter table groups_to_colleges 
        add constraint FK6D16AA6AD2B96A1 
        foreign key (access_level_id) 
        references user_groups

    alter table groups_to_campus 
        add constraint FK2A94F026AD2B96A1 
        foreign key (access_level_id) 
        references user_groups

    alter table groups_to_programs 
        add constraint FKE154D047AD2B96A1 
        foreign key (access_level_id) 
        references user_groups

    alter table groups_to_schools 
        add constraint FKF573053EAD2B96A1 
        foreign key (access_level_id) 
        references user_groups

    alter table groups_to_categories 
        add constraint FK251A097AD2B96A1 
        foreign key (access_level_id) 
        references user_groups

    alter table place_to_admindepartments 
        add constraint FK29CFEF08D8CD01DB 
        foreign key (admindepartment_id) 
        references admindepartments

    alter table place_to_admindepartments 
        add constraint FK29CFEF089EB7DF69 
        foreign key (place_id) 
        references place

    alter table media_types 
        add constraint FK3040346B62DEADB4 
        foreign key (media_format_id) 
        references media_format

    alter table media_to_media_types 
        add constraint FK20E47DAA54CA26B0 
        foreign key (media_id) 
        references media_types

    alter table place 
        add constraint FK5EA0A9E66056F906 
        foreign key (editing) 
        references users

    alter table place 
        add constraint FK5EA0A9E69E2633FA 
        foreign key (onwer) 
        references users

    alter table place 
        add constraint FK5EA0A9E6BD7EE7C4 
        foreign key (status) 
        references status

    alter table place 
        add constraint FK5EA0A9E6C4608D0C 
        foreign key (model) 
        references place_models

    alter table place 
        add constraint FK5EA0A9E6AA7F828B 
        foreign key (media) 
        references media_repo

    alter table place 
        add constraint FK5EA0A9E6E1C1DFBB 
        foreign key (campus) 
        references campus

    alter table place_to_place_names 
        add constraint FK5973EAB99EB7DF69 
        foreign key (place_id) 
        references place

    alter table place_to_programs 
        add constraint FK252312D79EB7DF69 
        foreign key (place_id) 
        references place

    alter table place_to_programs 
        add constraint FK252312D7A75037B7 
        foreign key (program_id) 
        references programs

    alter table place_to_fields 
        add constraint FKA8D27D4D9EB7DF69 
        foreign key (place_id) 
        references place

    alter table style_option_types_to_geometrics_types 
        add constraint FKCAAC26DF537B78C4 
        foreign key (geometrics_type_id) 
        references geometrics_types

    alter table styles 
        add constraint FKEFA7BAC5808E7E4B 
        foreign key (type) 
        references geometrics_types

    alter table style_to_style_options 
        add constraint FKED6D9EFFB56886E1 
        foreign key (style_id) 
        references styles

    alter table style_to_events_set 
        add constraint FK29F697C8B56886E1 
        foreign key (style_id) 
        references styles

    alter table style_to_zoom 
        add constraint FK2E164947B56886E1 
        foreign key (style_id) 
        references styles

    alter table media_types_to_media_format 
        add constraint FK42EF0C8341C4EC1E 
        foreign key (media_type_id) 
        references media_format

    alter table geometric_events_to_zoom 
        add constraint FKF6191103BE51E8A4 
        foreign key (zoom_id) 
        references zoom_levels
