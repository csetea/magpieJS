/**
 * Magpie
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
(function() {
	//
	// bootstrap RequireJS
	//
	var elScriptRequireJS = document.createElement('script');
	elScriptRequireJS.setAttribute("type", "text/javascript");
	// elScriptRequireJS.setAttribute("data-main", "main");
	elScriptRequireJS.setAttribute("src", magpieBaseUrl ? magpieBaseUrl
			+ '/lib/requireJS/require.min.js'
			: 'js/magpie/lib/requireJS/require.min.js');
	// append to DOM
	if (document.body) {
		// Lazy boot strategy - magpie.js was included in body
		document.body.appendChild(elScriptRequireJS);
	} else {
		// Preload strategy - magpie.js was included in head
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(elScriptRequireJS);
	}

	//
	// mapgie module definition and bootstrap
	//
	var watchRequireJS = setInterval(
			function() {
				// wait for requirejs
				if (window.requirejs) {
					clearInterval(watchRequireJS);

					require(
							[ magpieBaseUrl ? magpieBaseUrl + '/config'
									: 'js/magpie/config' ],
							function(m) {

								//
								// define the magpie module - on the fly
								//
								define(
										'magpie',
										[ 'module', 'log!magpie' ],
										function(module, log) {
											log.t('bootstrap')
											var config = module.config();
											//
											// set version information
											//
											config.version = 0.1;
											config.log = log;

											if (config.init instanceof Function) {
												log
														.d('init function defined in configuration, run it ...');
												config.init();
											}

											if (typeof config.start === "string") {
												config.start = config.start
														.split(/[\s,]+/);
												log.d('start: ', config.start)
												require(config.start);
											} else if (config.start instanceof Array) {
												log.d('start: ', config.start)
												require(config.start);
											} else if (config.start instanceof Function) {
												log.d('start: ', config.start)
												config.start();
											}

											return config;
										});
								//
								// bootstrap magpie
								//
								require([ 'magpie' ]);
							});

				}
			}, 100);

}());

