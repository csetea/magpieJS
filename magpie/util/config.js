/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
define([], function() {
	
	
	function mergeObject(source, reference){
		
		for (var p in reference) {
			if ( typeof source[p] === "undefined") {
				source[p] = reference[p];
			}else if (reference[p]!== null && typeof reference[p] === "object" ){
				mergeObject(source[p], reference[p]);
			}
		}
		
	}

	return function config(module, defaultConfig) {
		/*jshint -W004 */ 
		var config = module.config();
		mergeObject(config, defaultConfig);
		return config;
	};
});