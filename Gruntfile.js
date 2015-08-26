module.exports = function(grunt) {  //assigning a function which takes a parameter

	var 
		path = require("path"), //path library to construct paths which work  with any environment which can use different type of separators
		wwwFolder = path.join ("app","www"),
		sassFolder = path.join("assets","sass")
		cssFolder = path.join (wwwFolder,"css"),


		libsFolder = path.join(wwwFolder, "libs"),
		jsFolder = path.join(wwwFolder,"js"),
		appJsFolder = path.join(jsFolder,"app"),

		cssMinFiles = {},
		cssCompressFiles = {},
		sassFiles ={},

		jsFiles = {},
		jsMinifyFiles ={},
		jsCompressFiles = {};

		sassFiles[path.join(cssFolder,"site.css")] = 
								path.join(sassFolder,"site.scss");

		cssMinFiles[path.join(cssFolder,"site.min.css")] = 
								path.join(cssFolder,"site.css");

		// the above lines mean - cssMinFiles = {"site.min.css","site.css" } key is "site.min.css" and value is  site.css,
		// object notation to specify which files we are minifying

		cssCompressFiles[path.join(cssFolder,"site.min.gz.css")] = 
								path.join(cssFolder,"site.min.css");

		jsFiles[path.join(jsFolder,"site.js")] = [
			path.join(libsFolder,"jquery","dist","jquery.js"),
			path.join(appJsFolder, "init.js"),
			path.join(appJsFolder, "app.js")
		];

		jsMinifyFiles[path.join(jsFolder,"site.min.js")] =
			path.join(jsFolder,"site.js");

		jsCompressFiles[path.join(jsFolder,"site.min.gz.js")] =
			path.join(jsFolder, "site.min.js");

	//Configure the webserver
	grunt.initConfig({  //invoking a function on the grunt param value, 
		webServer: {  // webserver is a object and its using a object literal, Object literal is inherited from base javascript object (prototype)
			port: 8080,
			//rootFolder: "app/www"
			rootFolder: wwwFolder
		},
		sass: {
			main: {
				options: {
					sourcemap: "none"
				},
				files: sassFiles
			}
		},

		cssmin: {
			main: {
				options: {
					keepSpecialComments: 0,
					sourceMap: false //map a minified file back to original source file ..so when minified file breaks we know where in source it breaks
				},
				files: cssMinFiles //files shows what files to be minified
			}
		},

		// Add this...
		uglify: {
			combine: {
        		options: {
          			compress: false,
          			beautify: {
            			beautify: true,
            			indent_level: 2,
            			comments: true
          			},
          			mangle: false,
        		},
				files: jsFiles
			},
      		minify: {
        		options: {
          			compress: {
            			drop_debugger: true,
            			unsafe: true,
            			drop_console: false
          			},
          			beautify: false,
          			mangle: {},
          			screwIE8: true
        		},
        	files: jsMinifyFiles
      		}
		},

		compress: {
			css: {
				options: {
					mode: 'gzip' 
				},
				files: cssCompressFiles
			},

			js: {
        		options: {
          			mode: 'gzip'
        		},
        		files: jsCompressFiles
      		}	
		},
		watch: {
			css: {
				//files: path.join(cssFolder, "**", "*.css"),  //** means include all the subfolders in the folder
				//tasks: ["cssmin","compress:css"]
				files: path.join(sassFolder, "**", "*.scss"),  //** means include all the subfolders in the folder
				tasks: ["sass","cssmin","compress:css"]
			},

			js: {
				files: [path.join(jsFolder, "**", "*.js"), "!" + path.join(jsFolder, "*.min.js")],
				tasks: ["uglify:combine","compress:js"]
			}
		}
	}); 


	grunt.loadNpmTasks("grunt-contrib-watch"); //watch for changess in css
	grunt.loadNpmTasks("grunt-contrib-sass"); // minimify css files
	grunt.loadNpmTasks("grunt-contrib-cssmin"); // minimify css files
	grunt.loadNpmTasks("grunt-contrib-compress"); // compress the minified css to gzip
	grunt.loadNpmTasks("grunt-contrib-uglify");

	grunt.registerTask("web-server", "start webserver", function(){

		var
			http = require("http"),
			express = require("express"),
			app = express(),
			multer = require("multer"),
			webserverConfig = grunt.config("webServer");


			app.use("/api",multer({ //this sets up node to use the multer lib to read the multipart form data, 
									//it is now setup to listen to the requests
									//on /api pathand puts them in a destination and renames them to the given name
									//multer is node lib for multipart and bodyparser is the lib for url encoded and json encoded data
				dest: "./app/uploads",
				rename: function(fieldName,fileName){
					return fileName;
				}
			}));
			
			app.use("/api/upload",function(req,res){
				res.json([ {message:"upload successfull"}]);
			});

			

			//this.async(); 
			//commenting this since with grunt we can only have one async task ..since watch is async , this needs to be synchronous
			app.use("/api/widgets", function (req,res){
				res.json([
					{id:1, name:"widget1" },
					{id:2, name:"widget2" },
					{id:3, name:"widget3" },
					{id:4, name:"widget4" }
					]);
				
			});

			//if url has /css then use this route
			app.use("/css", express.static(path.join(webserverConfig.rootFolder, "css"),{ // static content with 2 params -1. path to css, and 2. function which sets header
				setHeaders: function(res,filePath){
					res.setHeader("Content-Type", "text/css");
					if(/.gz.css$/.test(filePath)) {				//if the content downloading name follows pattern of .gz.css set the header
						res.setHeader("content-Encoding","gzip");
					}
				}
			}));

			// Add this...
			app.use("/js", express.static(jsFolder, {
				setHeaders: function(res, filePath) {
					res.setHeader("Content-Type", "text/javascript");
					if (/.gz.js$/.test(filePath)) {
						res.setHeader("Content-Encoding", "gzip");
					}
				}
			}));
			
		//---
			app.use(express.static(webserverConfig.rootFolder)); // this is setting the location of the static content for app

			http.createServer(app).listen(webserverConfig.port,function(){
				console.log("webServer running on port: " + webserverConfig.port)
			});

	});

	grunt.registerTask("default", "start development environment",
		[ "sass", "cssmin", "uglify", "compress", "web-server", "watch"]); //ordering of the things starting matter ..this is the order tasks are started
	

};

// Three things happenning here
// 1. assignment of whole code to module.export
// 2. initconfig,register task are run and functions are registered
// 3. the actual functions are executed

//Common js way of loading modules uses require. require is not a js keyword
//express allows to setup routing, handling url params. require("express") returns function object and then we are executing it and giving it to app variable
// grunt.config("webServer") is refering to initconfig's webserver property and now webserverConfig.port gives 8080
