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
		watch: {
			files: [
				'src/**/*'
			],
			tasks: [ 'concat', 'jshint', 'env:dev', 'autoprefixer', 'cssmin', 'uglify' ]
		},
		concat: {
			front_styles: {
				src: [
					'src/css/central_main.css',
					'src/css/map_admin.css',
					'src/css/share_link.css',
					'src/css/reactive.css'
				],
				dest: 'build/css/front.styles.css',
			},
			admin_styles: {
				src: [
					'src/css/jSelect.min.css',
					'src/css/jSelect.filter.min.css',
					'src/css/central_main.css',
					'src/css/map_admin.css',
					'src/css/admin_styles.css',
				],
				dest: 'build/css/admin.styles.css',
			},
			front_scripts: {
				src: [
					'src/js/modernizr-2.0.6/modernizr.min.js',
					'src/js/jquery.defaultvalue.js',
					'src/js/infobox-1.1.12.js',
					'src/js/jquery.ui.map.js',
					'src/js/jquery.ui.map.extensions.js',
					'src/js/jquery.ui.map.services.js',
					'src/js/jquery.ui.map.overlays.js',
					'src/js/jquery.colorbox-min.js',
					'src/js/jquery.cycle.all.js',
					'src/js/scrollbar/jquery.mousewheel.js',
					'src/js/scrollbar/jquery.jscrollpane.min.js',
					'src/js/zeroclipboard/ZeroClipboard.js',
					'src/js/jPrint.js',
					'src/js/wsu_maps.js',
					'src/js/init_test.js',
					'src/js/map_editor_vars.js',
					'src/js/wsu_maps.util.js',
					'src/js/wsu_maps.general.js',
					'src/js/wsu_maps.nav.js',
					'src/js/wsu_maps.search.js',
					'src/js/wsu_maps.infobox.js',
					'src/js/wsu_maps.frontend.js',
					
					'src/js/addthis_ini.js'
				],
				dest: 'build/js/maps.wsu.edu.js',
			},
			admin_scripts: {
				src: [
					'src/js/modernizr-2.0.6/modernizr.min.js',
					'src/js/jquery.defaultvalue.js',
					'src/js/jquery.mjs.nestedSortable.js',
					'src/js/colorpicker/jpicker-1.1.6.min.js',
					'src/js/scrollbar/jquery.mousewheel.js',
					'src/js/scrollbar/jquery.jscrollpane.min.js',
					'src/js/jquery.colorbox-min.js',
					'src/js/zeroclipboard/ZeroClipboard.js',
					'src/js/jSelect.js',
					'src/js/jSelect.filter.js',
					'src/js/utilities_general.js',

					
					'src/js/jquery.ui.map.js',
					'src/js/jquery.ui.map.drawingmanager.js',
					'src/js/jquery.ui.map.extensions.js',
					'src/js/jquery.ui.map.services.js',
					'src/js/jquery.ui.map.overlays.js',
					

					'src/js/wsu_maps.js',
					'src/js/init_test.js',
					'src/js/wsu_maps.util.js',
					'src/js/wsu_maps.general.js',
					'src/js/infobox-1.1.12.js',
					'src/js/map_editor_vars.js',
					'src/js/admin_ui__map_functions.js',
					'src/js/wsu_maps.infobox.js',
					'src/js/wsu_maps.admin.js',
					'src/js/wsu_maps.admin.ui.js',
					'src/js/admin_ui__media.js',
					'src/js/wsu_maps.admin.ui.tinymce.js',
					
					'src/js/admin_ui__editors.js',
					'src/js/wsu_maps.admin.editors.place.js',
					'src/js/wsu_maps.admin.editors.geometrics.js',
					'src/js/wsu_maps.admin.editors.media.js',
					'src/js/wsu_maps.admin.editors.view.js',
					'src/js/wsu_maps.admin.editors.style.js',
					
					
					'src/js/admin_ini.js',
					'src/js/admin_init.js'
				],
				dest: 'build/js/admin.maps.wsu.edu.js',
			},
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n' +
					'/*   */\n'
			},
			front_build: {
				src: 'build/js/maps.wsu.edu.js',
				dest: 'dis/js/maps.wsu.edu.js'
			},
			admin_build: {
				src: 'build/js/admin.maps.wsu.edu.js',
				dest: 'dis/js/admin.maps.wsu.edu.js'
			}
		},
		autoprefixer: {
			options: {
				browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'ie 8', 'ie 9','ie 10']
			},
			front_styles: {
				src: 'build/css/front.styles.css',
				dest: 'build/_precss/front.styles.css'
			},
			admin_styles: {
				src: 'build/css/admin.styles.css',
				dest: 'build/_precss/admin.styles.css'
			},
		},
		cssmin: {
			combine: {
				files: {
					// Hmmm, in reverse order
					'dis/css/admin.styles.css': ['build/_precss/admin.styles.css'],
					'dis/css/front.styles.css': ['build/_precss/front.styles.css'],
				}
			}
		},
		jshint: {
			files: [

					//'src/js/modernizr-2.0.6/modernizr.min.js',
					//'src/js/jquery.defaultvalue.js',
					//'src/js/modernizr-2.0.6/modernizr.min.js',

					//'src/js/jquery.mjs.nestedSortable.js',
					//'src/js/colorpicker/jpicker-1.1.6.min.js',
					//'src/js/infobox.js',
					'src/js/jquery.ui.map.js',
					'src/js/jquery.ui.map.drawingmanager.js',
					'src/js/jquery.ui.map.extensions.js',
					'src/js/jquery.ui.map.services.js',
					'src/js/jquery.ui.map.overlays.js',
				
					'src/js/utilities_general.js',
					'src/js/wsu_maps.js',
					'src/js/wsu_maps.util.js',
					'src/js/wsu_maps.general.js',
					'src/js/wsu_maps.nav.js',
					'src/js/wsu_maps.search.js',
				
					//'src/js/jquery.defaultvalue.js',
					//'src/js/jquery.colorbox-min.js',
					'src/js/map_editor_vars.js',
					'src/js/admin_ui__map_functions.js',
					'src/js/wsu_maps.infobox.js',
					//'src/js/scrollbar/jquery.mousewheel.js',
					//'src/js/scrollbar/jquery.jscrollpane.min.js',
					'src/js/wsu_maps.admin.js',
					'src/js/wsu_maps.admin.ui.js',
					'src/js/admin_ui__media.js',
					'src/js/wsu_maps.admin.ui.tinymce.js',
					'src/js/admin_ui__editors.js',
					'src/js/wsu_maps.admin.editors.place.js',
					'src/js/wsu_maps.admin.editors.geometrics.js',
					'src/js/wsu_maps.admin.editors.media.js',
					'src/js/wsu_maps.admin.editors.view.js',
					'src/js/wsu_maps.admin.editors.style.js',
					
					'src/js/wsu_maps.frontend.js',
					//'src/js/zeroclipboard/ZeroClipboard.js',
					'src/js/init_test.js',
					'src/js/admin_ini.js',
					'src/js/admin_init.js'
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
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-autoprefixer');
	// Default task(s).
	grunt.registerTask('start', ['watch']);
	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('prod', ['env:prod', 'concat','preprocess:js','autoprefixer','cssmin','uglify','copy','includereplace','preprocess:html']);

	grunt.registerTask('dev', [ 'concat', 'jshint', 'env:dev','autoprefixer', 'cssmin', 'uglify', ]);

};