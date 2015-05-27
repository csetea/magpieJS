/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
//TODO doc config
//		'magpie/resource/properties' : {
//			defaultLocale : 'en',
//			supportedLocales : [ 'en', 'de', 'hu' ],
//			resourceDir : 'resources',
//			resources : {
//				msg : 'messages_{{langCode}}.properties',
//				img : 'images.properties'
//			}
//		},

define(['magpie/log!resource', 'magpie/resourceLoader!'], function(log,rl) {
	
	
	var r={
			//TODO
//			load : function(){
//				
//			}
	};
	for(var _r in rl){
		if (_r=='load'){
			log.w('deprecated resource name, it will be omitted:',_r);
		}else{
			r[_r]=rl[_r];
		}
	}

	log.t('resource inited with',r);

	
	return r;
});
