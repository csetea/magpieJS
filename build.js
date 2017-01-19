var _requirejs = require('requirejs');
var fs = require('fs-extra');
var ncp = require('ncp');


function mixIn(target, objects){
    var i = 1,
        key, cur;
    while(cur = arguments[i++]){
        for(key in cur){
            if(Object.prototype.hasOwnProperty.call(cur, key)){
                target[key] = cur[key];
            }
        }
    }
    return target;
}

function rjs(opts, callback){
    var buildConfig = mixIn( opts, BASE_JS_SETTINGS);
    console.info('buildConfig:',buildConfig.out)
    _requirejs.optimize( buildConfig, function(){
        console.info('build completed for:',buildConfig.out)
        _nOptimizedModules += 1;
        if (typeof callback === 'function') {
            callback.apply(null, Array.prototype.slice.call(arguments));
        }
    });
}

var libDir =  '';
if (fs.existsSync('node_modules')) {
    libDir += 'node_modules/';
}

var BASE_JS_SETTINGS = {
	logLevel: 0,
	baseUrl: './',

	paths:{
		knockout : require.resolve('knockout').replace(/\.js/,''),

        css :	    require.resolve('require-css/css.min.js').replace(/\.js/,''),
		'css-builder' :	    require.resolve('require-css/css-builder.js').replace(/\.js/,''),
        normalize :	    require.resolve('require-css/normalize.js').replace(/\.js/,''),

        page: require.resolve('page/page.js').replace(/\.js/,''),
        'page/query': require.resolve('qs/dist/qs.js').replace(/\.js/,''),

        'HTML5-History-API': require.resolve('html5-history-api/history').replace(/\.js/,''),

		less : 		'magpie/dom/less'
	},


    // fileExclusionRegExp:	/(^\.|lib|build.js|server|page|.*\.md)/,

	findNestedDependencies: true,

	mainConfigFile: 'magpie/config.js',


    // optimize: "none",
	optimize: "uglify2",
	generateSourceMaps: true,

	preserveLicenseComments: false,

    uglify2: {
		// outSourceMap: 'dist/magpie.js.map',
        output: {
			// indent_start  : 0,     // start indentation on every line (only when `beautify`)
			// indent_level  : 4,     // indentation level (only when `beautify`)
			// quote_keys    : false, // quote all keys in object literals?
			// space_colon   : true,  // add a space after colon signs?
			// ascii_only    : false, // output ASCII-safe? (encodes Unicode characters as ASCII)
			// inline_script : false, // escape "</script"?
			// width         : 80,    // informative maximum line width (for beautified output)
			// max_line_len  : 32000, // maximum line length (for non-beautified output)
			// ie_proof      : true,  // output IE-safe code?
			// beautify      : true, // beautify output?
			// source_map    : null,  // output a source map
			// bracketize    : false, // use brackets every time?
			// comments      : false, // output comments?
			// semicolons    : true,  // use semicolons to separate statements? (otherwise, newlines)
        },
		compress:{
			// sequences     : true,  // join consecutive statemets with the “comma operator”
			// properties    : true,  // optimize property access: a["foo"] → a.foo
			// dead_code     : true,  // discard unreachable code
			// drop_debugger : true,  // discard “debugger” statements
			// unsafe        : false, // some unsafe optimizations (see below)
			// conditionals  : true,  // optimize if-s and conditional expressions
			// comparisons   : true,  // optimize comparisons
			// evaluate      : true,  // evaluate constant expressions
			// booleans      : true,  // optimize boolean expressions
			// loops         : true,  // optimize loops
			// unused        : true,  // drop unused variables/functions
			// hoist_funs    : true,  // hoist function declarations
			// hoist_vars    : false, // hoist variable declarations
			// if_return     : true,  // optimize if-s followed by return/continue
			// join_vars     : true,  // join var declarations
			// cascade       : true,  // try to cascade `right` into `left` in sequences
			// side_effects  : true,  // drop side-effect-free statements
			// warnings      : true,  // warn about potentially dangerous optimizations/code
			//
			// This is a feature you can use in order to conditionally drop code. For example if you pass:
			// global_defs: {
			//     DEBUG: false
			// }
			// the compressor will assume that's a constant defintion and will discard code like this as being unreachable:
			//
			// if (DEBUG) {
			//     ...
			// }
			// This is useful in order to discard stuff that you need only in the development version from production builds.
		}
        // warnings: true,
        // mangle: false  //reduce names of local variables and functions usually to single-letters
    },
}

// BASE_JS_SETTINGS.paths

var MagpieModules = {
        Core: [
            'magpie',
            'magpie/crypt/base64',
            'magpie/dom/grid',
            'magpie/dom/inject',
            'magpie/dom/less',
            'magpie/dom/mediaQueries',
            "magpie/html5/customElement",
            'magpie/html5/widget/select',
            "magpie/html5/router",
            'magpie/log',
            'magpie/resource/properties',
            "magpie/util/config",
            "magpie/util/idgenerator"
        ],
        Extend: [
            //
            // bundles that extends 3th party library functions:
            //
            'magpie/extend/knockout',
        ],

        VendorMap:{
            'magpie/extend/knockout':[
                'knockout'
            ],
            "magpie/html5/router":[
                'page',
                'page/query',
                'HTML5-History-API'
            ]
        }

}
MagpieModules.vendors = [];

for (var module in MagpieModules.VendorMap){
    MagpieModules.vendors = MagpieModules.vendors.concat(MagpieModules.VendorMap[module]);
}


fs.removeSync('dist');

rjs({
    out: "dist/magpie.min.js",
	include: MagpieModules.Core,
	exclude: MagpieModules.vendors
});

rjs({
    out: "dist/magpie.full.min.js",
	include: MagpieModules.Core.concat(MagpieModules.Extend),
	exclude: MagpieModules.vendors
});

rjs({
    out: "dist/magpie.full.vendors.min.js",
	include: MagpieModules.vendors
});

rjs({
    out: "dist/magpie.full.include.vendors.min.js",
	include: MagpieModules.Core.concat(MagpieModules.Extend)
});

for (var module in MagpieModules.VendorMap){
    rjs({
        out: "dist/" + module.replace(/\//g,'.') +".vendor.min.js",
    	include: MagpieModules.VendorMap[module]
    });
}

console.log('put requirejs in lib folder')
if (!fs.existsSync('lib/requirejs')) {
    fs.removeSync('lib/requirejs');
}
fs.mkdirsSync('lib/requirejs');
ncp(''+require.resolve('requirejs/require.js'), 'lib/requirejs/require.js', function(err){

})
