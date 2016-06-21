/// <binding AfterBuild='prod' Clean='clean' />
module.exports = function(grunt) {
	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		env : {
			options : {
				/* Shared Options Hash */
				//globalOption : 'foo'
			},
			dev: {
				NODE_ENV : 'DEVELOPMENT'
			},
			prod : {
				NODE_ENV : 'PRODUCTION'
			}
		},
		clean: ['Content/build/_pre_sass/','Content/build/_precss/', '.sass-cache/', 'Content/build/'],
		watch: {
			files: [
				'Content/src/**/*'
			],
			tasks: [ 'sass', 'concat', 'jshint', 'env:dev', 'autoprefixer', 'cssmin', 'uglify' , 'copy:maps' ]
		},
		sass: {	
			dev: {
				files: [
					{ src: "Content/src/scss/admin.scss", dest: "Content/build/_pre_sass/admin.styles.css" },
					{ src: "Content/src/scss/centrals.scss", dest: "Content/build/_pre_sass/front.styles.css" },
					{ src: "Content/src/scss/embeds.scss", dest: "Content/build/_pre_sass/map.view.styles.css" },
					{ src: "Content/src/scss/rescue.scss", dest: "Content/build/_pre_sass/map.rescue.styles.css" },
				]
			},
		},
		copy:{
			maps: {
				files: [ // This can be drastically simplified by putting this stuff in a `src` folder.
					{ expand: true, src: ["Content/build/_pre_sass/*.map"], dest: "Content/build/css/", flatten: true, },
					{ expand: true, src: ["Content/build/_pre_sass/*.map"], dest: "Content/dis/css/", flatten: true, },
				]
			}
		},
		concat: {
			front_styles: {
				src: [
					'Content/src/js/scrollbar/style/jquery.jscrollpane.css',
					'Content/src/js/scrollbar/style/jquery.jscrollpane.lozenge.css',
					//'Content/src/css/colorbox.css',
					'Content/src/css/share_link.css',
					//'Content/src/css/reactive.css',
					'Content/build/_pre_sass/front.styles.css'
				],
				dest: 'Content/build/css/front.styles.css',
			},
			map_view_styles: {
				src: [
					'Content/src/js/scrollbar/style/jquery.jscrollpane.css',
					'Content/src/js/scrollbar/style/jquery.jscrollpane.lozenge.css',
					//'Content/src/css/colorbox.css',
					'Content/src/css/share_link.css',
					//'Content/src/css/reactive.css',
					'Content/build/_pre_sass/map.view.styles.css'
				],
				dest: 'Content/build/css/map.view.styles.css',
			},
			rescue_styles: {
				src: [
					'Content/src/js/scrollbar/style/jquery.jscrollpane.css',
					'Content/src/js/scrollbar/style/jquery.jscrollpane.lozenge.css',
					'Content/build/_pre_sass/map.rescue.styles.css',
				],
				dest: 'Content/build/css/map.rescue.styles.css',
			},
			admin_styles: {
				src: [
					'Content/build/_pre_sass/admin.styles.css',
					'Content/src/css/admin/jSelect.min.css',
					'Content/src/css/admin/jSelect.filter.min.css',
					
				],
				dest: 'Content/build/css/admin.styles.css',
			},
			front_scripts: {
				src: [
					//'Content/src/js/modernizr-2.0.6/modernizr.min.js',
					'Content/src/js/jquery.defaultvalue.js',
					
					'Content/src/js/jquery.ui.map.js',
					'Content/src/js/jquery.ui.map.extensions.js',
					'Content/src/js/jquery.ui.map.services.js',
					'Content/src/js/jquery.ui.map.overlays.js',
					
					'Content/src/js/infobox-1.1.12.js',
					
					//'Content/src/js/jquery.colorbox-min.js',
					'Content/src/js/jquery.cycle.all.js',
					'Content/src/js/scrollbar/jquery.mousewheel.js',
					'Content/src/js/scrollbar/jquery.jscrollpane.min.js',
					'Content/src/js/zeroclipboard/ZeroClipboard.js',
					'Content/src/js/jPrint.js',

					'Content/src/js/wsu_maps.state.js',
					'Content/src/js/wsu_maps.defaults.js',
					'Content/src/js/wsu_maps.js',
					'Content/src/js/wsu_maps.lightbox.js',
					
					'Content/src/js/wsu_maps.util.js',
					'Content/src/js/wsu_maps.general.js',
					'Content/src/js/wsu_maps.errors.js',
					'Content/src/js/wsu_maps.views.js',
					'Content/src/js/wsu_maps.directions.js',
					'Content/src/js/wsu_maps.controlls.js',
					'Content/src/js/wsu_maps.nav.js',
					'Content/src/js/wsu_maps.listings.js',
					'Content/src/js/wsu_maps.markers.js',
					'Content/src/js/wsu_maps.places.js',
					'Content/src/js/wsu_maps.shapes.js',
					'Content/src/js/wsu_maps.search.js',
					'Content/src/js/wsu_maps.infobox.js',
					'Content/src/js/wsu_maps.responsive.js',
					'Content/src/js/wsu_maps.frontend.js',
					'Content/src/js/wsu_maps.starter.js',
					
					//'Content/src/js/addthis_ini.js'
				],
				dest: 'Content/build/js/maps.wsu.edu.js',
			},
			admin_scripts: {
				src: [
					//'Content/src/js/modernizr-2.0.6/modernizr.min.js',
					'Content/src/js/jquery.defaultvalue.js',
					'Content/src/js/jquery.mjs.nestedSortable.js',
					'Content/src/js/colorpicker/jpicker-1.1.6.min.js',
					'Content/src/js/scrollbar/jquery.mousewheel.js',
					'Content/src/js/scrollbar/jquery.jscrollpane.min.js',
					//'Content/src/js/jquery.colorbox-min.js',
					'Content/src/js/zeroclipboard/ZeroClipboard.js',
					'Content/src/js/admin/jSelect.js',
					'Content/src/js/admin/jSelect.filter.js',
					'Content/src/js/utilities_general.js',

					
					'Content/src/js/jquery.ui.map.js',
					'Content/src/js/jquery.ui.map.drawingmanager.js',
					'Content/src/js/jquery.ui.map.extensions.js',
					'Content/src/js/jquery.ui.map.services.js',
					'Content/src/js/jquery.ui.map.overlays.js',
					'Content/src/js/infobox-1.1.12.js',

					'Content/src/js/wsu_maps.state.js',
					'Content/src/js/wsu_maps.defaults.js',
					'Content/src/js/wsu_maps.js',
					'Content/src/js/wsu_maps.lightbox.js',
					'Content/src/js/wsu_maps.util.js',
					'Content/src/js/wsu_maps.general.js',
					'Content/src/js/wsu_maps.errors.js',
					'Content/src/js/wsu_maps.controlls.js',
					

					'Content/src/js/admin_ui__map_functions.js',
					'Content/src/js/wsu_maps.infobox.js',
					'Content/src/js/wsu_maps.markers.js',
					'Content/src/js/wsu_maps.places.js',
					'Content/src/js/wsu_maps.shapes.js',
					'Content/src/js/wsu_maps.views.js',
					'Content/src/js/wsu_maps.directions.js',
					'Content/src/js/wsu_maps.responsive.js',
					'Content/src/js/wsu_maps.admin.js',
					'Content/src/js/wsu_maps.admin.lists.js',
					'Content/src/js/wsu_maps.admin.ui.js',
					'Content/src/js/wsu_maps.admin.ui.fields.js',
					'Content/src/js/admin_ui__media.js',
					'Content/src/js/wsu_maps.admin.ui.tinymce.js',
					
					'Content/src/js/admin_ui__editors.js',
					'Content/src/js/wsu_maps.admin.editors.place.js',
					'Content/src/js/wsu_maps.admin.editors.geometrics.js',
					'Content/src/js/wsu_maps.admin.editors.media.js',
					'Content/src/js/wsu_maps.admin.editors.view.js',
					'Content/src/js/wsu_maps.admin.editors.style.js',
					'Content/src/js/wsu_maps.starter.js',

				],
				dest: 'Content/build/js/admin.maps.wsu.edu.js',
			},
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n' +
					'/*   */\n'
			},
			front_build: {
				src: 'Content/build/js/maps.wsu.edu.js',
				dest: 'Content/dis/js/maps.wsu.edu.js'
			},
			admin_build: {
				src: 'Content/build/js/admin.maps.wsu.edu.js',
				dest: 'Content/dis/js/admin.maps.wsu.edu.js'
			}
		},
		autoprefixer: {
			options: {
				browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'ie 8', 'ie 9','ie 10']
			},
			front_styles: {
				src: 'Content/build/css/front.styles.css',
				dest: 'Content/build/_precss/front.styles.css'
			},
			map_view_styles: {
				src: 'Content/build/css/map.view.styles.css',
				dest: 'Content/build/_precss/map.view.styles.css'
			},
			admin_styles: {
				src: 'Content/build/css/admin.styles.css',
				dest: 'Content/build/_precss/admin.styles.css'
			},
			rescue_styles: {
				src: 'Content/build/css/map.rescue.styles.css',
				dest: 'Content/build/_precss/map.rescue.styles.css'
			},
		},
		cssmin: {
			combine: {
				files: {
					// Hmmm, in reverse order
					'Content/dis/css/admin.styles.css': ['Content/build/_precss/admin.styles.css'],
					'Content/dis/css/map.rescue.styles.css': ['Content/build/_precss/map.rescue.styles.css'],
					'Content/dis/css/front.styles.css': ['Content/build/_precss/front.styles.css'],
					'Content/dis/css/map.view.styles.css': ['Content/build/_precss/map.view.styles.css'],
				}
			}
		},
		jshint: {
			files: [

					//'Content/src/js/modernizr-2.0.6/modernizr.min.js',
					//'Content/src/js/jquery.defaultvalue.js',
					//'Content/src/js/modernizr-2.0.6/modernizr.min.js',

					//'Content/src/js/jquery.mjs.nestedSortable.js',
					//'Content/src/js/colorpicker/jpicker-1.1.6.min.js',
					//'Content/src/js/infobox.js',
					'Content/src/js/jquery.ui.map.js',
					'Content/src/js/jquery.ui.map.drawingmanager.js',
					'Content/src/js/jquery.ui.map.extensions.js',
					'Content/src/js/jquery.ui.map.services.js',
					'Content/src/js/jquery.ui.map.overlays.js',
					'Content/src/js/infobox-1.1.12.js',
				
					'Content/src/js/utilities_general.js',
					'Content/src/js/wsu_maps.state.js',
					'Content/src/js/wsu_maps.defaults.js',
					
					'Content/src/js/wsu_maps.js',
					'Content/src/js/wsu_maps.lightbox.js',
					'Content/src/js/wsu_maps.util.js',
					'Content/src/js/wsu_maps.general.js',
					'Content/src/js/wsu_maps.errors.js',
					'Content/src/js/wsu_maps.views.js',
					'Content/src/js/wsu_maps.controlls.js',
					'Content/src/js/wsu_maps.nav.js',
					'Content/src/js/wsu_maps.listings.js',
					'Content/src/js/wsu_maps.search.js',
					'Content/src/js/wsu_maps.markers.js',
					'Content/src/js/wsu_maps.places.js',
					'Content/src/js/wsu_maps.shapes.js',
					'Content/src/js/wsu_maps.directions.js',
					'Content/src/js/wsu_maps.responsive.js',
				
					//'Content/src/js/jquery.defaultvalue.js',
					//'Content/src/js/jquery.colorbox-min.js',
					'Content/src/js/admin_ui__map_functions.js',
					'Content/src/js/wsu_maps.infobox.js',
					//'Content/src/js/scrollbar/jquery.mousewheel.js',
					//'Content/src/js/scrollbar/jquery.jscrollpane.min.js',
					'Content/src/js/wsu_maps.admin.js',
					'Content/src/js/wsu_maps.admin.lists.js',
					'Content/src/js/wsu_maps.admin.ui.js',
					'Content/src/js/wsu_maps.admin.ui.fields.js',
					'Content/src/js/admin_ui__media.js',
					'Content/src/js/wsu_maps.admin.ui.tinymce.js',
					'Content/src/js/admin_ui__editors.js',
					'Content/src/js/wsu_maps.admin.editors.place.js',
					'Content/src/js/wsu_maps.admin.editors.geometrics.js',
					'Content/src/js/wsu_maps.admin.editors.media.js',
					'Content/src/js/wsu_maps.admin.editors.view.js',
					'Content/src/js/wsu_maps.admin.editors.style.js',
					
					'Content/src/js/wsu_maps.frontend.js',
					'Content/src/js/wsu_maps.starter.js',
					//'Content/src/js/zeroclipboard/ZeroClipboard.js',

				],
			options: {
				// options here to override JSHint defaults
				boss: true,
				curly: true,
				eqeqeq: true,
				eqnull: true,
				expr: true,
				immed: true,
				noarg: true,
				//onevar: true,
				//quotmark: "double",
				smarttabs: true,
				//trailing: true,
				undef: true,
				unused: true,
				globals: {
					jQuery: true,
					$: true,
					console: true,
					module: true,
					document: true,
					window:true,
					define:true,
					alert:true,
					setTimeout:true,
					ZeroClipboard:true,
					MutationObserver:true,
					google:true,
					tinyMCE:true,
					tinymce:true,
					addthis:true,
				}
			}
		},
		
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-sass');
	// Default task(s).
	grunt.registerTask('start', ['watch']);
	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('prod', ['env:prod', 'sass', 'concat', 'env:dev', 'autoprefixer', 'cssmin', 'uglify', 'copy:maps', 'clean']);

	grunt.registerTask('dev', [ 'env:dev', 'sass', 'concat', 'jshint', 'env:dev', 'autoprefixer', 'cssmin', 'uglify' , 'copy:maps', 'clean'  ]);

};