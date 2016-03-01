var fs = require('fs');
var ssi = require('ssi');
var url = require("url");
var parser = new ssi("/", "/output", "");

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            domop: {
                /*src: ['src/moduleA.js', 'src/moduleB.js'],
                 dest: 'src/modules.js'*/
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                /*src : 'src/modules.js',
                 dest : 'src/modules.min.js'*/
            }
        },
        connect: {
            server: {
                options: {
                    port: 8713,
                    open: true,
                    base: ['../'],
                    hostname: '127.0.0.1',
                    middleware: function (connect, options, middlewares) {
                        middlewares.unshift(function (req, res, next) {
                            var p = url.parse(req.url),
                                rootPath = __dirname + "/../",
                                filename = rootPath + '/' + p.path;
                            if (p.path == '/') {
                                filename = rootPath + '/mail-editor.shtml';
                            }
                            if (filename.substr(-6) == '.shtml') {
                                var contents = fs.readFileSync(filename, {encoding: "utf8"});
                                var results = parser.parse(filename, contents);
                                var buffer = new Buffer(results.contents);
                                res.setHeader('Content-Type', 'text/html');
                                res.setHeader('Content-Length', buffer.length);
                                res.end(buffer);
                            } else {
                                return next();
                            }
                        });

                        return middlewares;
                    },
                    livereload: 35730
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: './src',
                    dir: "./dist",
                    optimize: "uglify",
                    optimizeCss: "standard",
                    skipDirOptimize: true,
                    fileExclusionRegExp: "^lib|build.js$",
                    removeCombined: true,
                    preserveLicenseComments: false,
                    paths: {
                        "app": "./",
                        "jquery": "../lib/jquery.min",
                        "jquery-ui": "../lib/jquery-ui/jquery-ui.min",
                        "underscore": "../lib/underscore-min",
                        "text": "../lib/text",
                        "i18n": "../lib/i18n",
                        "domReady": "../lib/domReady",
                        "tinyMCE": "../lib/tinymce/tinymce.min",
                        "Jcrop": "../lib/jquery-crop/jquery.Jcrop.min"
                    },
                    shim: {
                        "jquery-ui": {
                            deps: ["jquery"],
                            exports: "jQuery"
                        },
                        "tinyMCE": {
                            exports: "tinyMCE"
                        }
                    },
                    pragmasOnSave: {
                        excludeRequireCss: true
                    },
                    modules: [
                        {
                            name: "app/box",
                            exclude: [
                                "tinyMCE",
                                "jquery",
                                "jquery-ui",
                                "underscore",
                                "Jcrop"
                            ]
                        },
                        {
                            name: "app/workspace",
                            exclude: [
                                "tinyMCE",
                                "jquery",
                                "jquery-ui",
                                "underscore",
                                "Jcrop"
                            ]
                        }
                    ]
                }
            }},
        watch: {
            options: {
                livereload: 35730
            },
            tasks: ["requirejs"],
            files: './src/**/*.*'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'uglify', 'connect', 'requirejs', 'watch']);
};