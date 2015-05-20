/**
 * Magpie Resource - local specific resource bundle 
 * 
 * @license MIT 
 */

define(['log!resource', 'magpie/resourceLoader!'], function(log,rl) {
	
	
	var r={
			//TODO
//			load : function(){
//				
//			}
	}
	for(_r in rl){
		if (_r=='load'){
			log.w('deprecated resource name, it will be omitted:',_r);
		}else{
			r[_r]=rl[_r];
		}
	}

	log.t('resource inited with',r);

	
	return r;
});
