/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
define([], function() {
	
	function mergeArray(source, reference){
		for (var p in reference) {
			source.push(reference[p]);
		}
	}
	
	function mergeObject(source, reference, deep){
		for (var p in reference) {
			if ( typeof source[p] === "undefined") {
				source[p] = reference[p];
			}else if (reference[p]!== null && typeof reference[p] === "object" ){
				if (reference[p] instanceof Array){
					mergeArray(source[p], reference[p]);
				}else if (deep){
					mergeObject(source[p], reference[p]);
				}
			}
		}
	}
	
	var API = function config(module, defaultConfig) {
		/*jshint -W004 */ 
		var config = module.config();
		mergeObject(config, defaultConfig, true);
		return config;
	};
	
	API.merge= function(source, reference, deep){
		if (reference instanceof Array){
			mergeArray(source, reference);
		}else{
			mergeObject(source, reference, deep);
		}
	};
	
	return API;
});