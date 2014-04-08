module.exports = function(grunt) {
	//Configuration Goes here
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Configure the copy task to move files from the development to production folders
		copy: {
			main: {
				files: [{expand: true, cwd: 'client', src: ['**'], dest: 'grunt-client/'}]
			}
		},
		// Lint the javascript
		lint: {
			files: [
				'grunt-client/js/**.js'
			]
		},
		// Some typical JSHint options and globals
		jshint: {
			src: ['Gruntfile.js', 'grunt-client/js/*.js', 'grunt-client/js/modules/**/*.js'],
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,
				globals: {
					module: true,
					require: true,
					define: true,
					requirejs: true,
					jQuery: true,
					$: true,
					console: true,
					_: true,
					Backbone: true,
					Marionette: true,
					google: true,
					alert: true,
					jsSHA: true,
					Indeed: true,
					IndeedKey: true,
					states: true
				}
			}
		},
		uglify: {
			options: {
				mangle: false,
				compress: {
					drop_console: true
				}
			},
			my_target: {
				files: [{
					expand: true,
					cwd: 'client/js',
					src: '**/**.js',
					dest: 'grunt-client/js'
				}]
			}
		}
	});

	// Load plugins here
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Define your tasks here
	grunt.registerTask('default', ['copy', 'jshint', 'uglify']);
};