/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 * @see https://github.com/WebReflection/document-register-element
 */
define(
		[ 'require', 'module', 'magpie/util/config', '../../_ieVersion' ],
		function(require, module, config, ieVersion) {
			/* jshint -W004 */
			var config = config(
					module,
					{
						path : {
							ie8 : "//cdnjs.cloudflare.com/ajax/libs/ie8/0.2.3/ie8.js",
							dom4 : "//cdnjs.cloudflare.com/ajax/libs/dom4/1.3.1/dom4.js",
							'dre-ie8-upfront-fix' : "//cdnjs.cloudflare.com/ajax/libs/document-register-element/0.3.0/dre-ie8-upfront-fix.js",
							'document-register-element' : "//cdnjs.cloudflare.com/ajax/libs/document-register-element/0.3.0/document-register-element.js",
							'es5-shim' : "//cdnjs.cloudflare.com/ajax/libs/es5-shim/4.1.0/es5-shim.js",
							'es5-sham' : "//cdnjs.cloudflare.com/ajax/libs/es5-shim/4.1.0/es5-sham.js"
						}
					});

			if (ieVersion < 9) {
				(function(f) {
					window.setTimeout = f(window.setTimeout);
					window.setInterval = f(window.setInterval);
				})(function(f) {
					return function(c, t) {
						var a = [].slice.call(arguments, 2);
						return f(function() {
							c.apply(this, a);
						}, t);
					};
				});
			}

			if (ieVersion == 9) {
				require([ config.path.ie8 ]);
			}

			require([ config.path.dom4 ]);

			if (ieVersion == 8) {
				require([ config.path['dre-ie8-upfront-fix'] ]);
			}

			require([ config.path['document-register-element'] ]);

			if (ieVersion == 8) {
				require([ config.path['es5-shim'], config.path['es5-sham'] ]);
			}

			return {
				load : function(customElementPath, parentRequire, onload) {
					onload();
				}
			};

		});
