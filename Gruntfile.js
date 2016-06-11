var banner = "/*\n * watchUI 2.0\n * © 2015-2016 Sniper_GER, FESTIVAL\n * All Rights reserved\n */\n"

module.exports = function(grunt) {
	grunt.initConfig({
		browserify: {
			js: {
				src: 'src/modules/main.js',
				dest: 'build/js/watchUI-2.0.js',
				options: {
					banner: banner
				}
			},
			dist: {
				src: 'src/modules/main.js',
				dest: 'dist/js/watchUI-2.0.js',
				options: {
					banner: banner
				}
			}
		},
		jshint: {
			all: {
				src: 'src/modules/*',
				options: {
					shadow: true,
					loopfunc: true,
					elision: true,
					laxcomma: true,
					asi: true,
				}
			}
		},
		uglify: {
			all: {
				files: {
					'build/js/watchUI-2.0.min.js': '/build/js/watchUI-2.0.js'
				},
				options: {
					banner: banner+"\n"
				}
			},
			dist: {
				files: {
					'dist/js/watchUI-2.0.min.js': 'dist/js/watchUI-2.0.js',
				},
				options: {
					banner: banner+"\n"
				}
			}
		},
		less: {
			all: {
				src: 'src/less/style.less',
				dest: 'build/css/watchUI-2.0.css'
			},
			dist: {
				src: 'src/less/style.less',
				dest: 'dist/css/watchUI-2.0.css'
			}
		}
	})

	grunt.loadNpmTasks('grunt-contrib-jshint');	
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-newer');
	grunt.registerTask('default', ['browserify', 'uglify', 'less']);
	grunt.registerTask('dist', ['browserify:dist', 'uglify:dist', 'less:dist']);
	grunt.registerTask('js',['browserify']);
}