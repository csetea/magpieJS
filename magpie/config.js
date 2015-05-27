require._magpieUlrPathPrefix = '/';
require.config({

	paths : {

		magpie : require._magpieUlrPathPrefix + 'magpie',

		domReady : require._magpieUlrPathPrefix + 'lib/require/domReady',
		text : require._magpieUlrPathPrefix + 'lib/require/text',
		css : require._magpieUlrPathPrefix + 'lib/require/require-css/css',
		less : require._magpieUlrPathPrefix + 'magpie/dom/less',

	},

	packages : [ {
		location : require._magpieUlrPathPrefix + 'magpie',
		name : 'magpie'
	}, {
		name : 'magpie/log',
		location : require._magpieUlrPathPrefix + 'magpie/log',
	}, {
		name : 'magpie/html5/widget/grid',
		location : require._magpieUlrPathPrefix + 'magpie/html5/widget/grid',
		main : 'main'
	}, {
		name : 'magpie/resource/properties',
		location : require._magpieUlrPathPrefix + 'magpie/resource/properties',
		main : 'main'
	}, {
		name : 'magpie/html5/customElement',
		location : require._magpieUlrPathPrefix + 'magpie/html5/customElement',
		main : 'main'
	}
	],

	config : {
		
		'magpie/html5/customElement/provider/WebReflection/document-register-element':{
			path:{
				ie8:	require._magpieUlrPathPrefix  + "lib/WebReflection/ie8.js",
				dom4:	require._magpieUlrPathPrefix + "lib/WebReflection/dom4.js",
				'dre-ie8-upfront-fix': 		require._magpieUlrPathPrefix + "lib/WebReflection/dre-ie8-upfront-fix.js",
				'document-register-element': require._magpieUlrPathPrefix + "lib/WebReflection/document-register-element.js",
				'es5-shim': 	require._magpieUlrPathPrefix + "lib/WebReflection/es5-shim.min.js",
				'es5-sham':  	require._magpieUlrPathPrefix + "lib/WebReflection/es5-sham.min.js"
			}
		},
		
		'magpie/html5/customElement/_registerElement':{
//			provider: require._magpieUlrPathPrefix + 'lib/polymer/webcomponentsjs-0.5.1-1/webcomponents-lite.min.js'
			provider: 'magpie/html5/customElement/provider/WebReflection/document-register-element'
		},
		
		'magpie/html5/customElement/main':{
			templateLoaderPlugin: 'text',
			strictDefinition: false,
		},
		'magpie/dom/less':{
			lessJsPath:require._magpieUlrPathPrefix + 'lib/less/less.min.js'
		}

	},
	
	

	callback : function() {

	},

	deps : [ 'magpie/config.log' ]

});