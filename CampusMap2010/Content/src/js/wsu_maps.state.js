(function($,window,WSU_MAP) {
	$.extend( WSU_MAP, {
		state:{
			debug:false,
			map_jObj:null,
			map_inst:null,
			view_id:'centralmap',
			
			running_options:false,
			fit_to_bound:false,
			embeded_place_ids:false,
			json_style_override:false,
			
			active:{
				marker:null,
				iw:null,
			},
			
			ib:[],
			ibh:[],
			ibHover:false,
			ibOpen:false,
			reopen:false,
				
			markerLog:[],
			markerbyid:[],
			mid:[],
			shapes:[],
			listOffset:0,
			
			currentControl:"ROADMAP",
		
			siteroot: "",
			view: "",
			mcv_action: "",
			campus: "",
			campus_latlng_str: "",
			
			in_pano:false,
			hold_bounds:true,
			hold_center:true,
			
			center:null,
			
			cTo:"",
			cFrom:"",
			hasDirection:false,
			mapview:"central",
			
			cur_nav:"",
			cur_mid:0,
			hasListing:false,
			hasDirections:false,
		
			
			api:[],
			apiL:null,
			apiD:null,
			api_nav:null,
		
			//sensor:false,
			//lang:'',
			//vbtimer:null,
			
		},
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));