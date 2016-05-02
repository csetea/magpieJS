/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
define([ 'magpie/log!magpie/resource/properties/main', 'magpie/util/config', 'module' ],
			function(log, config, module) {

	// TODO doc config options
	/*jshint -W004 */
	var config =config(module,{
		loader: 'text',
		baseUri: ''
	});

	var processProperties = function(text) {
		var i, key;
		var object = {};
		if (typeof text !== 'undefined' && text != null){
			var lines = text.split("\n");
			lines.forEach(function(line) {
				if (line.length && line.charAt(0) !== "#") {
					i = line.indexOf("=");
					key = line.substr(0, i).trim();

					//object[key] = (line.substr(i + 1).trim());
					object[key] = unescape(
						line.substr(i + 1).trim().replace(/\\u([\d\w]{4})/gi,
							function (match, grp) {
								return String.fromCharCode(parseInt(grp, 16));
						} )
					);
				}
			});			
		}
		return object;
	};


	return {
		load : function(propertiesFileUrl, parentRequire, load) {
			log.debug('load: ',propertiesFileUrl, 'baseUri:',config.baseUri);
			parentRequire([config.loader+'!'+config.baseUri + propertiesFileUrl],function(propertiesFile){
				load(processProperties(propertiesFile));
			},function(err){
				log.warn('cannot load properties file: ' + propertiesFileUrl,err);
				load({});
			});
		}
	};

});
