require.config({
	
	urlArgs: "bust=" + (new Date()).getTime(),

	baseUrl : 'magpie/app',

	// all reference is based on baseUrl
	paths : {
		// web bundle root - referenced back from baseUrl
		www : '../../../..',

		// magpie root directory reference
		magpie : '../',

		// shortening the path of libs:
		text : '../lib/requireJS/text',
		mark : '../lib/markup/markup.min',
		jquery : '../lib/jquery/jquery-1.11.1.min',
		router : '../lib/requirejs-router/router',
		jqueryBrowserLanguage : '../lib/jquery/jquery.browserLanguage',
		jqueryPlax : '../lib/jquery/plax',
		ckeditor : '../lib/ckeditor-441-std/ckeditor',

		// shortening the path of magpie modules
		resource : '../module/resource',
		template : '../module/template',
		idgenerator : '../module/idgenerator',
		locale : '../module/locale',
		css : '../module/css',
		log : '../module/log',
		viewProxy : '../module/viewProxy',

		// libs
		lib : '../lib',

		knockout : "../lib/knockout-3.1.0",

	},

	shim : {

		jqueryPlax : {
			deps : [ 'jquery' ]
		},
		
		ckeditor : {
			exports: 'CKEDITOR'
		},
		
		jquery : {
			exports: '$'
		}
		

	},

	config : {
		
		template :{
			preProcessing : function(text,callbackWithTextParamter){
				require([ 'resource', 'mark' ], function(r,Mark) {
					callbackWithTextParamter(Mark.up(text,r))
				});
			} 
		},

		idgenerator : {
		// pattern: 'xxxxx'
		},
		resource : {
			defaultLocale : 'en',
			supportedLocales : [ 'en', 'de', 'es','it','pt','sv' ],
			resourceDir : 'www/resources',
			resources : {
				loc : 'gui_{{langCode}}.properties',
				err : 'error_{{langCode}}.properties'
			},
			alwaysLoadDefault: true,
			//
			// Customize locale resolve logic
			//
			resolveLocale : function(callback) { 
				require([ 'app'], function(app) {
					callback(app.currentLang());
				})
			}
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
		 viewNotFound : function(){}
		},

		magpie : {
			/**
			 * On start up 'call' modules e.g.:<br>
			 * start: ['main'],
			 */
			start: ['modernizr'],

			/**
			 * Additional things to do before 'start'.
			 */
			init : function() {

				//
				// Setup Mark.up
				//
				require([ 'mark','resource' ], function(Mark,r) {
					Mark.undefinedResult = function(tag) {
						for (p in r){
							var index=tag.indexOf(p+'.')
							if (index==2){
								var porpertyInResourceProperty=tag.substring(index,tag.length-2);
								var value=r[p][porpertyInResourceProperty];
								if (typeof value === "string"){
									return value;
								} 
							} 
						}
						
						//console.error('tag:',r[tag])
						
						return tag;
					}
				});

				//
				// Start router
				//
				require([ 'router', 'log!router', 'jquery', 'viewProxy' ], function(
						router, log, $) {
					router.registerRoutes({
						velocityTemplate : {
							path : "/showVelocityTemplate",
							moduleId : 'viewProxy!view/velocityTemplate/velocityTemplate'
						}
					// ,dynamicViewResolvationLoopback : {
					// path : '*',
					// moduleId : undefined
					// }
					});
					router.init();
					log.t('inited')
					
					//
					// restore routed view after crash or language change
					//
					var restoreViewFromCookie = function(cookieName){
						var cookieValue = document.cookie.replace( new RegExp('.*'+cookieName+'='),'').replace(/;.*/,'');
						if (cookieValue){
							var el=$('.menuBlock a[href$="'+cookieValue+'"]')[0];
							if (el){
								window.location.hash=cookieValue;
							}
							// clean up the cookie
						    document.cookie = cookieName+'=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
						}
					}
					
					restoreViewFromCookie('locationHashOnError');
					restoreViewFromCookie('locationHashOnNewLang');

				});
			}

		}
	},

	waitSeconds : 15

});
