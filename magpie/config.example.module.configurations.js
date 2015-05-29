var _magpieRootUrl = require.toUrl('magpie');
require.config({
	config : {
		
		'magpie/html5/customElement/provider/WebReflection/document-register-element':{
			path:{
				ie8:	"lib/WebReflection/ie8.js",
				dom4:	"lib/WebReflection/dom4.js",
				'dre-ie8-upfront-fix': 		"lib/WebReflection/dre-ie8-upfront-fix.js",
				'document-register-element': "lib/WebReflection/document-register-element.js",
				'es5-shim': 	"lib/WebReflection/es5-shim.min.js",
				'es5-sham':  	"lib/WebReflection/es5-sham.min.js"
			}
		},
		
		'magpie/html5/customElement/_registerElement':{
//			provider: 'lib/polymer/webcomponentsjs-0.5.1-1/webcomponents-lite.min.js'
			provider: 'magpie/html5/customElement/provider/WebReflection/document-register-element!'
		},
		
		'magpie/html5/customElement/main':{
			templateLoaderPlugin: 'text',
			strictDefinition: false,
		},
		'magpie/dom/less':{
			lessJsPath:'lib/less/less.min.js'
		}

	}
	
});