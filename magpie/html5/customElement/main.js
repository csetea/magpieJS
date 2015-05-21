/**
 * @doc customElement.md
 * @license MIT 
 */
// Module for handling custom element registrations

//TODO check for ie8 support: http://webreflection.github.io/document-register-element/test/examples/x-map.html
// https://github.com/WebReflection/document-register-element
// view-source:http://webreflection.github.io/document-register-element/test/examples/x-map.html
// http://webreflection.github.io/document-register-element/test/examples/js/x-map.js
// http://localhost:8081/ie8/
define([ 'module','magpie/util/config','require', 'log!magpie/html5/customElement', 'magpie/dom/inject','domReady!','./_registerElement!' ], function(module,config, require, log, inject) {

	
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
	var config =config(module,{
		templateLoaderPlugin:'text',
		strictDefinition: false
	})

	
	
	//TODO handle erroros with throw? errors? ????
	
	function _checkTagName(customElementDef) {
		var validTagName=/^[a-zA-Z][\w\_\.\:]*\-[\w\_\-\.\:]*$/g;
		
		if (!('tag' in customElementDef)){
			if (config.strictDefinition){
				log.error('missing mandantory field in customElementDef: tag')
				return false;
			}else{
				log.warn('missing mandantory field in customElementDef: tag')
				log.warn('Now try to use the module name as alternative value for: tag')
				log.debug('Module path:',customElementDef.m_customElementPath)
				var moduleName = customElementDef.m_customElementPath.replace(/.*\//,'')
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
	
	function _checkCustomElementDef(customElementDef, callbackFn){
		if (customElementDef instanceof Function){
			customElementDef=new customElementDef();
		}

		//
		// Validate tag name
		//
		if (!_checkTagName(customElementDef)){
			return false;
		}else{
			//TODO only if if ie6-ie8 -> call createElement?
			// will i really support ie8? and below???
			// document.createElement('my-element')
			// other case the parser will be it omitted
			
//			if (ieVersion < 9) {
//				document.createElement(customElementDef.tag)
//			}
		}
		
		//	
		// Check prototype
		//
		var prototype = customElementDef.prototype;
		
		// for IE8 and below
		var xHTMLElement = typeof HTMLElement !== "undefined"
	        ? HTMLElement : Element;
		
		if (!( prototype == xHTMLElement.prototype ||
				( xHTMLElement instanceof Function && prototype instanceof xHTMLElement)
				)){
			if ( typeof prototype === 'undefined' ){
				log.debug('prototype is not defined, set it to default: HTMLElement.prototype');
				prototype = xHTMLElement.prototype;
			}else{
				log.error('prototype must be at least HTMLElement.prototype or direved from it');
				return false;
			}
		}

		customElementDef.m_proto=Object.create(prototype);
		//	
		// Check extends
		//
		if ('extends' in customElementDef){
			if (typeof customElementDef['extends'] !== 'string'){
				log.error('extends property must be string',customElementDef)
			}
		}
			
		
		//
		// Check callback function definitions
		//
		var callbacks=['createdCallback','attachedCallback','detachedCallback','attributeChangedCallback'];
		
		// add custom attributes and properties to proto
		for(p in customElementDef){
			customElementDef.m_proto[p]=customElementDef[p];
		}
		//
		// Check callback definitions 
		//
		for (var i=0; i< callbacks.length; i++){
			var callback = callbacks[i];
			if (callback in customElementDef){
				log.trace('check callback definition of customElement definition: '+callback)
				if (customElementDef[callback] instanceof Function){
					customElementDef.m_proto[callback]=customElementDef[callback]
				}else{
					customElementDef.m_proto[callback]= undefined;
					log.warn(callback+' is not function, ignore it')
				}
			}
		}
		// add default createdCallback impl
		if (!customElementDef.m_proto['createdCallback']){
			if ('template' in customElementDef.m_proto){
				//
				// concept: inject template and call 'created' callback method
				//
				customElementDef.m_proto['createdCallback']= function(){
					log.trace('create default createdCallback impl. to inject template into custom element')
					inject(this, this.template, this.append)
					
//					if (this.bind instanceof Function){
//						this.bind(this);
//					}
					
					if (this.created instanceof Function){
						this.created(this);
					}
				}
			}else{
				//TODO config template loader
				log.debug('load template for '+customElementDef.tag+':',config.templateLoaderPlugin+'!'+customElementDef.m_customElementPath+'.html')
					require([config.templateLoaderPlugin+'!'+customElementDef.m_customElementPath+'.html'],function(template){
	
						customElementDef.m_proto.template=customElementDef.template=template;
						customElementDef.m_proto['createdCallback']= function(){
							log.trace('create default createdCallback impl. to inject template into custom element')
							inject(this, this.template, this.append)
								
							if (this.created instanceof Function){
								this.created(this);
							}
						}
						
						callbackFn(customElementDef);
					}, function(err){
						//...
					});
				return;
			}
			
		}
		callbackFn(customElementDef);
	}
	
	function _registerElement(customElementDef){
		log(customElementDef.tag,'proto',customElementDef.m_proto)
		customElementDef.m_proto.m_customElementDef=customElementDef;
		try{
//			document.createElement(customElementDef.tag);
			if (customElementDef['extends']){
				return document.registerElement(customElementDef.tag,{
					prototype: customElementDef.m_proto,
					'extends': customElementDef['extends'] 
					});
			}else{
				return document.registerElement(customElementDef.tag,{
					//prototype: customElementDef.m_proto
					prototype: Object.create(
						      HTMLImageElement.prototype,
						      {
						        createdCallback: {
						          value: function () {}}})
					});
			}
		}catch(e){
			log.error('Failed registrations of customElement: '+customElementDef.tag,e)
		}
	}

	return {
		
		config: config,
		//
		// loader plugin for customElement definitions
		//
		load: function(customElementPath, parentRequire, onload, config) {
			log.info('Load customElement definition:',customElementPath)
			parentRequire([customElementPath],function(customElementDef){
				customElementDef.m_customElementPath=customElementPath;
				_checkCustomElementDef(customElementDef, 
					function(customElementDef){
						onload( _registerElement(customElementDef));
					});
				})
			}
		}
	
});
