/**
 * @doc customElement.md
 * @license MIT 
 */
// Module for handling custom element registrations
define([ 'module','magpie/util/config', 'log!magpie/html5/customElement/_registerElement'], function(module, config, log) {


	var config =config(module,{
		provider: 'lib/document-register-element/document-register-element'
	})
		
	//
	// Object.create polyfill
	// (maybe outsource in polyfill/object ???)
	//
	if (typeof Object.create != 'function') {
		  Object.create = (function() {
		    var Object = function() {};
		    return function (prototype) {
		      if (arguments.length > 1) {
		        throw Error('Second argument not supported');
		      }
		      if (typeof prototype != 'object') {
		        throw TypeError('Argument must be an object');
		      }
		      Object.prototype = prototype;
		      var result = new Object();
		      Object.prototype = null;
		      return result;
		    };
		  })();
	}

	return {
		//
		// loader plugin for customElement definitions
		//
		load: function(customElementPath, parentRequire, onload) {
			
			if(!document.registerElement){

				log.warn('try to load polyfill for document.registerElement:',config.provider)

				require([config.provider],function(){
					var timer=setInterval(function(){
						if (document.registerElement){
							log.warn('polyfilled: document.registerElement')
							onload();
							clearInterval(timer);
						} 
					}, 300);
				});
			}else{
				onload();
			}
			}
		}
	
});
