/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 * @see https://github.com/WebReflection/document-register-element
 */
define([ 'module', 'magpie/util/config', 'magpie/html5/customElement/_ieVersion', 'require' ],
		function(module, config, ieVersion, require) {

			if (!require.isBrowser){
				// Fake document for r.js optimization
				document={
					createElement: function(){
						return {
							getElementsByTagName: function(){return{

							}},

						}

					},

					registerElement:function(){return{}},

					getElementsByTagName: function(){return{}},

					querySelector: function(){return{}},
					querySelectorAll: function(){return{}},

				}
			}

			/* jshint -W004 */
			var config = config(
					module,
					{
						path : {
							ie8 : "//cdnjs.cloudflare.com/ajax/libs/ie8/0.4.1/ie8.js",
							dom4 : "//cdnjs.cloudflare.com/ajax/libs/dom4/1.8.3/dom4.js",
							'dre-ie8-upfront-fix' : "//cdnjs.cloudflare.com/ajax/libs/document-register-element/1.3.0/dre-ie8-upfront-fix.js",
							'document-register-element' : "//cdnjs.cloudflare.com/ajax/libs/document-register-element/1.3.0/document-register-element.js",
							'es5-shim' : "//cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.9/es5-shim.min.js",
							'es5-sham' : "//cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.9/es5-sham.min.js"
						}
					});

			return {
				load : function(customElementPath, parentRequire, onload) {
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


					if (ieVersion == 8) {
						parentRequire([ config.path.ie8],function(){
							parentRequire([ config.path.dom4],function(){
								parentRequire([ config.path['dre-ie8-upfront-fix']],function(){
									parentRequire([ config.path['document-register-element']],function(){
										parentRequire([ config.path['es5-shim'] ],function(){
											parentRequire([ config.path['es5-sham'] ],function(){
												onload();
											});
										});
									});
								});
							});
						});
					}else{
						parentRequire([ config.path.dom4],function(){
							parentRequire([ config.path['document-register-element']],function(){
								onload();
							});
						});

					}
				}
			};
});
