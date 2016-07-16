var base64Img = require("base64-img");

module.exports = function (grunt) {
	"use strict";
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		concat: {
			js: {
				src: [
					"client/js/global.js",
					"common/engine.js",
					"client/js/display.js",
					"client/js/mouse.js",
					"client/js/satellite.js",
					"client/js/playerstate.js",
					"client/js/playerdisplay.js",
					"client/js/display.js",
					"client/js/mapgen.js",
					"client/js/utils.js",
					"client/js/space.js",
					"client/js/dot.js",
					"client/js/network.js",
					"client/js/star.js",
					"client/js/inputs.js",
					"client/js/game.js"
				],

				dest: "dist/dist.js"
			},
			css: {
				src: ["client/css/main.css"],
				dest: "dist/main.css"
			}
		},
		uglify : {
			main: {
				src: "dist/dist.js",
				dest: "dist/dist.js"
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					"dist/index.html": ["client/html/index.html"]
				}
			}
		},
		cssmin: {
			main: {
				src: "dist/main.css",
				dest: "dist/main.css"
			}
		},
		copy: {
			html: {
				expand: true,
				cwd: "client/html",
				src: "*.html",
				dest: "dist/"
			}
		},
		csslint : {
			options: {
				"ids": false,
				"bulletproof-font-face": false,
				"box-sizing": false
			},
			src: ["client/css/*.css"]
		},
		htmllint: {
			all: ["client/html/*.html"]
		},
		jshint: {
			all: ["gruntfile.js", "common/**/*.js", "server/*.js", "client/js/**/*.js"]
		},
		nodeunit: {
			all: ["test/test-*.js"]
		},
		replace: {
			dist: {
				options: {
					patterns: [{
						match: "URL_SERVER",
						replacement: process.env.SERVER || ""
					},
					{
						match: "FAVICON_BASE64",
						replacement: function () {return base64Img.base64Sync("dist/favicon.png");}
					}]
				},
				files: [{
					expand: true,
					flatten: true,
					src: ["dist/*.js", "dist/*.html"],
					dest: "dist"
				}]
			}
		},
		exec: {
			server: {
				command: "node server/app.js"
			}
		},
		inline: {
			desktop: {
				src: "dist/index.html",
				dest: "dist/index.html"
			}
		},
		clean: {
			dist: ["dist/*.css", "dist/*.js", "dist/*.png", "dist/*.woff", "dist/*.ttf"]
		},
		jscs: {
			main: ["gruntfile.js", "common/**/*.js", "server/*.js", "client/js/**/*.js"],
			fix: {
				options: {
					fix: true
				},
				files: {
					src: ["gruntfile.js", "common/**/*.js", "server/*.js", "client/js/**/*.js"]
				}
			}
		},
		watch: {
			options: {
				livereload: 13377,
				atBegin: true
			},
			client: {
				files: ["client/**/*", "common/**/*"],
				tasks: ["dev"]
			}
		},
		nodemon: {
			dev: {
				script: "server/app.js"
			}
		},
		concurrent: {
			server: ["watch", "nodemon"]
		},
		imageEmbed: {
			dist: {
				src: [ "dist/main.css" ],
				dest: "dist/main.css",
				options: {
					maxImageSize: 0
				}
			}
		},
		compress: {
			deflate: {
				options: {
					mode: "deflate",
					level: 9,
					pretty: true
				},
				expand: true,
				src: ["dist/index.html"],
				dest: ".",
				ext: ".html.zip"
			},
			gzip: {
				options: {
					mode: "gzip",
					level: 9,
					pretty: true
				},
				expand: true,
				src: ["dist/index.html"],
				dest: ".",
				ext: ".html.gz"
			}
		},
		imagemin: {
			favicon: {
				options: {
					optimizationLevel: 7
				},
				files: {
					"dist/favicon.png": "client/favicon.png"
				}
			}
		},
		removelogging: {
			src: "dist/dist.js",
			dest: "dist/dist.js"
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-htmlmin");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-csslint");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-contrib-imagemin");
	grunt.loadNpmTasks("grunt-concurrent");
	grunt.loadNpmTasks("grunt-nodemon");
	grunt.loadNpmTasks("grunt-html");
	grunt.loadNpmTasks("grunt-jscs");
	grunt.loadNpmTasks("grunt-replace");
	grunt.loadNpmTasks("grunt-exec");
	grunt.loadNpmTasks("grunt-inline");
	grunt.loadNpmTasks("grunt-image-embed");
	grunt.loadNpmTasks("grunt-remove-logging");

	grunt.registerTask("default", [	"concat", "removelogging", "imagemin", "uglify",
					"htmlmin",  "replace", "cssmin", "imageEmbed", "inline", "compress", "clean"]);

	grunt.registerTask("dev", ["hogan", "concat", "removelogging", "copy", "imagemin", "replace", "imageEmbed", "inline", "compress", "clean"]);
	grunt.registerTask("test", ["csslint", "jshint", "jscs:main", "htmllint", "default"]);
	grunt.registerTask("server", ["concurrent:server"]);
	grunt.registerTask("fix", ["jscs:fix"]);
};
