/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
// extends less.js with loader plugin support
define([ 'module','magpie/util/config', 'magpie/dom/inject' ], function(module,config, inject) {
	/*jshint -W004 */ 
	var	config = config(module,{
		lessJsPath:'//cdnjs.cloudflare.com/ajax/libs/less.js/2.5.1/less.min.js'
//		baseUrl: r.
	});

	return {
		load:function(lessFilePath, parentRequire, onload){
			parentRequire([config.lessJsPath],function(less){
				var fileUrl = lessFilePath;
				if (!less.load) {
						less.render('@import (multiple) "' + fileUrl + '";').then(
								function(output) {
									inject.css(output.css);
									onload();
								});
				}else{
					less.load(config.lessJsPath+'!'+lessFilePath, parentRequire, onload);
				}
				
			});
		}
	};
});
