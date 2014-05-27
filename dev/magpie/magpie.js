/**
 * Magpie - base configuration (RequireJS runtime)
 * 
 * https://github.com/csetea/magpiejs
 * 
 * Version: 0.1
 * 
 * The MIT License (MIT) Copyright (c) 2014 Andras Csete
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
require.config({

	// baseUrl
	baseUrl : 'js/magpie/app',

	// all reference is based on baseUrl
	paths : {
		// web bundle root - referenced back from baseUrl
		www : '../../..',

		// magpie root directory reference
		magpie : '../',

		// shortening the path of libs:
		text : '../lib/requireJS/text',
		mark : '../lib/markup/markup.min',
		jquery : '../lib/jquery/jquery-1.11.1.min',
		router : '../lib/requirejs-router/router',
		jqueryBrowserLanguage : '../lib/jquery/jquery.browserLanguage',
		jqueryPlax : '../lib/jquery/plax',
		jquerycaret : '../lib/jquery/caret/jquery.caret',

		// shortening the path of magpie modules
		resource : '../module/resource',
		template : '../module/template',
		idgenerator : '../module/idgenerator',
		locale : '../module/locale',
		css : '../module/css',
		polyfill : '../module/polyfill',
		log : '../module/log',
		viewProxy : '../module/viewProxy',
		foundation : '../module/foundation4-bootstrap', // load foundation

		// libs
		lib : '../module/lib',
		'lib/log4js' : '../lib/log4javascript-1.4.6/log4javascript',

		knockout : "../lib/knockout-3.1.0",

	},

	shim : {

		foundation : {
			deps : [ 'jquery' ]
		},

		'lib/log4js' : {
			exports : 'log4javascript'
		},

		jqueryPlax : {
			deps : [ 'jquery' ]
		}

	},

	config : {

		idgenerator : {
		// pattern: 'xxxxx'
		},
		resource : {
			defaultLocale : 'en',
			supportedLocales : [ 'en', 'de', 'hu' ],
			resourceDir : 'www/resources',
			resources : {
				msg : 'messages_{{langCode}}.properties',
				img : 'images.properties'
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
		},

		magpie : {
			/**
			 * On start up 'call' modules <br>
			 * start: ['foundation','index'], <br>
			 * start: ['foundation','main'],
			 */

			/**
			 * Additional things to do before 'start'.
			 */
			init : function() {

				//
				// Setup Mark.up
				//
				require([ 'mark' ], function(Mark) {
					Mark.undefinedResult = function(tag) {
						return tag;
					}
				});

				//
				// Start router
				//
				require([ 'router', 'log!router', 'viewProxy' ], function(
						router, log) {
					router.registerRoutes({
						b : {
							// /cmd=b/i
							path : "/show",
							moduleId : 'viewProxy!view/beach/404'
						},

						beach : {
							path : '/beach',
							moduleId : 'view/beach/beach'
						}
					// ,dynamicViewResolvationLoopback : {
					// path : '*',
					// moduleId : undefined
					// }
					});
					router.init();
					log.t('inited')

				});
			}

		}
	},

	waitSeconds : 15

});
