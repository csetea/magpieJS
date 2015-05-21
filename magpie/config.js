require.config({

	paths : {

		magpie : '/dist/magpie',

		// shortening the path of magpie modules
		template : 'magpie/resource/template',
		idgenerator : 'magpie/util/idgenerator',

		examples : 'magpie-examples',

		customElement : 'magpie/html5/customElement'

	},

	packages : [ {
		location : '/dist/magpie',
		name : 'magpie'
	}, {
		name : 'log',
		location : '/dist/magpie/log',
		main : 'log'
	}, {
		name : 'magpie/widget/grid',
		location : '/dist/magpie/widget/grid',
		main : 'main'
	}, {
		name : 'magpie/resource/properties',
		location : '/dist/magpie/resource/properties',
		main : 'main'
	}, {
		name : 'magpie/html5/customElement',
		location : '/dist/magpie/html5/customElement',
		main : 'main'
	}
	],

	config : {

		template : {
			preProcessing : function(text, callbackWithTextParamter) {
				require([ 'resource', 'mark' ], function(r, Mark) {
					callbackWithTextParamter(Mark.up(text, r))
				});
			}
		},

		'magpie/util/idgenerator' : {
		// pattern: 'xxxxx'
		},
		'magpie/resource/properties' : {
			defaultLocale : 'en',
			supportedLocales : [ 'en', 'de', 'hu' ],
			resourceDir : 'resources',
			resources : {
				msg : 'messages_{{langCode}}.properties',
				img : 'images.properties'
			}
		},
		
		
		'magpie/html5/customElement/main':{
			templateLoaderPlugin: 'text',
			strictDefinition: false,
		},
		'magpie/html5/customElement/_registerElement':{
//			provider: '/dist/polymer/webcomponentsjs-0.5.1-1/webcomponents.min.js'
			provider: '/dist/document-register-element/document-register-element.js'
		}

	},
	
	shim:{
		'/dist/document-register-element/document-register-element.js':{
			deps:['/dist/document-register-element/dom4.js'],
			init: function{
				
			}
		}
	},

	callback : function() {

	},

	deps : [ 'magpie/config.log' ]

});