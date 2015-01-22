require.config({
	
	paths : {
		
		magpie:'/dist/magpie',

		// shortening the path of magpie modules
		resource : 'magpie/resource',
		template : 'magpie/template',
		idgenerator : 'magpie/idgenerator',
		
		examples: 'magpie-examples',
		
		viewProxy : 'magpie/view/viewProxy',
		customElement: 'magpie/view/customElement',

		polyfillWebComponentsBaseDir: '/dist/polymer/webcomponentsjs-0.5.1-1',

			
	},

	packages : [ {
		location : '/dist/magpie',
		name : 'magpie'
	}, {
		name : 'log',
		location : '/dist/magpie/log',
		main : 'log'
	}, 
//	{
//		name : 'view',
//		location : 'magpie/view',
//		main : 'viewProxy'
//	} 
	],

	config : {

		template : {
			preProcessing : function(text, callbackWithTextParamter) {
				require([ 'resource', 'mark' ], function(r, Mark) {
					callbackWithTextParamter(Mark.up(text, r))
				});
			}
		},

		idgenerator : {
		// pattern: 'xxxxx'
		},
		resource : {
			defaultLocale : 'en',
			supportedLocales : [ 'en', 'de', 'hu' ],
			resourceDir : 'resources',
			resources : {
				msg : 'messages_{{langCode}}.properties',
				img : 'images.properties'
			}
		/*
		 * Customize locale resolve logic resolveLocale : function(callback) {
		 * callback('en'); }
		 */
		// alwaysLoadDefault: true
		},

		viewProxy : {
			el : '#viewContainer',
			/**
			 * redirect to view <br>
			 * viewNotFound : 'view/beach/404'
			 */
			/**
			 * redirect with function <br>
			 * viewNotFound : function(){}
			 */
//			viewNotFound : 'viewProxy!app/view/beach/404'
			viewNotFound : 'viewProxy!magpie/view/view_X/404'
		},

		'log/log4javascriptLogger' : {
			appender : undefined,
			setupLogger : function(logName, logger, log4javascript,
					defaultLayout) {
				// log.removeAllAppenders();
				if (!this.appender) {
					log4javascript.setDocumentReady();
					this.appender = new log4javascript.InPageAppender();
					this.appender.setLayout(defaultLayout);

				}
				logger.addAppender(this.appender);
			}
		},

		'log/log' : {
			 'log' : {
			 level : 'error'
			 },

			root : {
				level: 'info'
//				logger: './log4javascriptLogger'
			},

			
			viewProxy : {
				// level: ['DEBUG', 'INFO']
				level : 'trace'
			},
			
			'm-view' : {
				level: 'trace'
			},

			inject : {
				level: 'debug'
			},

			customElement : {
				level: 'trace'
			}
			
		}

	},

	callback : function() {
		//
		// Setup Mark.up
		//
//		require([ 'mark' ], function(Mark) {
//			Mark.undefinedResult = function(tag) {
//				for (p in r) {
//					var index = tag.indexOf(p + '.')
//					if (index == 2) {
//						var porpertyInResourceProperty = tag.substring(index,
//								tag.length - 2);
//						var value = r[p][porpertyInResourceProperty];
//						if (typeof value === "string") {
//							return value;
//						}
//					}
//				}
//				return tag;
//			}
//		});

		//
		// Start router
		//
//		require([ 'router', 'log!router', 'viewProxy' ], function(router, log) {
//			router.registerRoutes({
//				b : {
//					path : "/404",
//					moduleId : 'viewProxy!app/view/beach/404'
//				},
////				mview : {
////					path : "/m-view",
////					moduleId : 'viewProxy!customElement!magpie/view/m-view'
////				},
//				//
//				// beach : {
//				// path : '/beach',
//				// moduleId : 'view/beach/beach'
//				// }
//				// ,
//				dynamicViewResolvationLoopback : {
//					path : '*',
//					moduleId : undefined
//				}
//			});
//			router.init();
//			log.trace('inited')
//
//		});
	},

//	deps : [ 'app/config.app' ]
	
});