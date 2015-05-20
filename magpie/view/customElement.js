/**
 * @doc customElement.md
 * @license MIT 
 */
// Module for handling custom element registrations
define([ 'module','require', 'log!customElement', 'magpie/view/inject','domReady!' ], function(module, require, log, inject) {

	
//	var ieVersion = (function(){
//		  
//	    var undef,
//	        v = 3,
//	        div = document.createElement('div'),
//	        all = div.getElementsByTagName('i');
//	     
//	    while (
//	        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i>< ![endif]-->',
//	        all[0]
//	    );
//	
//	    alert(v)
//	    return v > 4 ? v : undef;
//	     
//	}());
//	

	

	// TODO doc config options
	var defaultConfig={
			templateLoaderPlugin:'text',
			strictDefinition: false
	}

	
	var config =module.config();
	for (p in defaultConfig){
		if (typeof config[p] === 'undefined'){
			config[p] = defaultConfig[p];
		}
	}
	
	
	
	// Object polyfill
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
	
	
	//TODO handle erroros with throw? errors? ????
	
	function checkTagName(customElementPath, customElementDef) {
		var validTagName=/^[a-zA-Z][\w\_\.\:]*\-[\w\_\-\.\:]*$/g;
		
		if (!('tag' in customElementDef)){
			if (config.strictDefinition){
				log.error('missing mandantory field in customElementDef: tag')
				return false;
			}else{
				log.warn('missing mandantory field in customElementDef: tag')
				log.warn('Now try to use the module name as alternative value for: tag')
				log.debug('Module path:',customElementPath)
				var moduleName = customElementPath.replace(/.*\//,'')
				log.debug('Module name:',moduleName);
				if (!validTagName.test(moduleName)){
					log.error('Module name can not be set as tag name while does not fit to custom element tag name convention: ',validTagName)
					return false;
				}
				
				customElementDef.tag = moduleName;
				return true;
			}
		}else{
			if (typeof customElementDef.tag !== 'string'){
				log.error('wrong type of tag, it must be string, but current type is:', typeof customElementDef.tag, customElementDef)
				return false; 
			}
			
			if (!validTagName.test(customElementDef.tag)){
				log.error('invalid tag value:',customElementDef.tag)
				log.error(customElementDef.tag + ' does not fit to custom element tag name convention:',validTagName)
				log.debug('Note: tag name must contain a dash(-) character');
				return false;
			}
			
			return true;
		}
	}
	
	function load(customElementPath, parentRequire, onload, p_config) {
		log.info('Load customElement:',customElementPath)
		parentRequire([customElementPath],function(customElementDef){
			if (customElementDef instanceof Function){
				customElementDef=new customElementDef();
			}

			//
			// Validate tag name
			//
			if (!checkTagName(customElementPath, customElementDef)){
				return false;
			}else{
				//TODO only if if ie6-ie8 -> call createElement?
				// will i really support ie8? and below???
				// document.createElement('my-element')
				// other case the parser will be it omitted
				
//				if (ieVersion < 9) {
//					document.createElement(customElementDef.tag)
//				}
			}
			
			//	
			// Check prototype
			//
			var prototype = customElementDef.prototype;
			if (!( prototype == HTMLElement.prototype || prototype instanceof HTMLElement)){
				if ( typeof prototype === 'undefined' ){
					log.debug('prototype is not defined, set it to default: HTMLElement.prototype');
					prototype = HTMLElement.prototype;
				}else{
					log.error('prototype must be at least HTMLElement.prototype or direved from it');
					return false;
				}
			}
			prototype = HTMLElement.prototype;
			
			//	
			// Check extends
			//
			var extend=undefined;
			if ('extends' in customElementDef){
				if (typeof customElementDef['extends'] !== 'string'){
					log.error('extends property must be string',customElementDef)
				}else{
					extend=customElementDef['extends'];
				}
			}
				
			
			//
			// Check callback function definitions
			//
//			attributeChangedCallback=(attrName, oldVal, newVal)
			var callbacks=['createdCallback','attachedCallback','detachedCallback','attributeChangedCallback'];
			
			var proto=Object.create(prototype);
			// add custom attributes and properties to proto
			for(p in customElementDef){
				proto[p]=customElementDef[p];
			}
			//
			// Check callback definitions 
			//
			for (var i=0; i< callbacks.length; i++){
				var callback = callbacks[i];
				if (callback in customElementDef){
					log.trace('check callback definition of customElement definition: '+callback)
					if (customElementDef[callback] instanceof Function){
						proto[callback]=customElementDef[callback]
					}else{
						proto[callback]= undefined;
						log.warn(callback+' is not function, ignore it')
					}
				}
			}
			// add default createdCallback impl
			if (!proto['createdCallback']){
				if ('template' in proto){
					//
					// concept: inject template and call 'created' callback method
					//
					proto['createdCallback']= function(){
						log.trace('create default createdCallback impl. to inject template into custom element')
						inject(this, this.template, this.append)
							
						if (this.created instanceof Function){
							this.created(this);
						}
					}
				}else{
					//TODO config template loader
					log.debug('load template for '+customElementDef.tag+':',config.templateLoaderPlugin+'!'+customElementPath+'.html')
					require([config.templateLoaderPlugin+'!'+customElementPath+'.html'],function(template){

						proto.template=customElementDef.template=template;
						proto['createdCallback']= function(){
							log.trace('create default createdCallback impl. to inject template into custom element')
							inject(this, this.template, this.append)
								
							if (this.created instanceof Function){
								this.created(this);
							}
						}
						
						registerElement(customElementDef, proto, extend, onload);
					}, function(err){
						//...
					});
					
					return;
				}
				
			}
			
			registerElement(customElementDef, proto, extend, onload);
			
		});
		
	}
	
	function registerElement(customElementDef, proto, extend, onload){
		log('proto',proto)
		log(customElementDef.tag)

		//
		// Valid customElement definition 
		// now try to register it
		//
		try{
			
			if (extend){
				onload(document.registerElement(customElementDef.tag,{
					prototype: proto,
					'extends': extend 
					})
				);
				
			}else{
				onload(document.registerElement(customElementDef.tag,{
					prototype: proto
					})
				);
			}
			

		}catch(e){
			log.error('Failed registrations of customElement: '+customElementDef.tag,e)
		}
	}

	return {
		//
		// loader plugin for customElement definitions
		//
		
		load: function(customElementPath, parentRequire, onload, config) {
			if(!document.registerElement){
				
				log.warn('try to load polyfill for document.registerElement')
//				var polyfillWebComponents = 'polyfillWebComponentsBaseDir/webcomponents';
				var polyfillWebComponents = 'polyfillWebComponentsBaseDir/webcomponents.min';
//				var polyfillWebComponents = 'polyfillWebComponentsBaseDir/webcomponents-lite';
//				var polyfillWebComponents = 'polyfillWebComponentsBaseDir/webcomponents-lite.min';
				
				
				
//				
// TODO load browser variant workable polyfill
//		polyfillWebComponents: 'lib/polymer/webcomponentsjs-0.5.1-1/webcomponents', // for ie9+ browser and document mode ie9+, +firefox
//		polyfillWebComponents: 'lib/polymer/webcomponentsjs-0.5.1-1/webcomponents.min',// for ie9+ browser and document mode ie9+, +firefox
//		polyfillWebComponents: 'lib/polymer/webcomponentsjs-0.5.1-1/webcomponents-lite', // for firefox and safari?
//		polyfillWebComponents: 'lib/polymer/webcomponentsjs-0.5.1-1/webcomponents-lite.min', // for firefox and safari?
			// Opera is not supported by polymer webcomponentsjs ???
		    // Opera 25+ document.registerElement
			// Opera 26+ supports csutom elements

				
				require([polyfillWebComponents],function(){
					var timer=setInterval(function(){
						if (document.registerElement){
							log.warn('polyfilled: document.registerElement')
							load(customElementPath, parentRequire, onload, config);
							clearInterval(timer);
						} 
					}, 300);
				});
			}else{
				load(customElementPath, parentRequire, onload, config);
			}
			
			}
		}
	
});
