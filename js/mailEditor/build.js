({
    baseUrl: './src',
    dir: "./dist",
    optimize: "uglify",
    optimizeCss: "standard",
    skipDirOptimize: true,
    fileExclusionRegExp: "^text.js|i18n.js|build.js$",
    removeCombined: true,
    /*generateSourceMaps:true,//需要optimize:"uglify2"*/
    preserveLicenseComments: false,
    paths: {
        "app": "./",
        "jquery": "empty:",
        "jquery-ui": "empty:",
        "underscore": "empty:",
        "text": "../lib/text",
        "i18n": "empty:",
        "domReady": "empty:",
        "tinyMCE": "empty:",
        "Jcrop": "empty:"
    },
    shim: {
        "jquery-ui": {
            deps: ["jquery"],
            exports: "jQuery"
        },
        "tinyMCE": {
            exports: "tinyMCE",
            init: function () {
                this.tinyMCE.DOM.events.domLoaded = true;
                return this.tinyMCE;
            }
        }
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
})