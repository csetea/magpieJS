/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
//TODO doc >=ie9
// Module for handling custom element registrations
define([ 'module','magpie/util/config','require', 'magpie/log!magpie/html5/customElement', 'magpie/dom/inject','./_ieVersion', './_registerElement!' ], function(module,config, require, log, inject, ieVersion) {
	
	// TODO doc config options
	/*jshint -W004 */
	var config =config(module,{
		templateLoaderPlugin:'text',
		strictDefinition: false
	});

//	if (ieVersion < 9) {
//		require(['jquery'],function($){
//			HTMLElement.prototype.querySelector=function(selector){
//				log.warn('$('+selector+'):',$(selector).data);
//				var result = $(selector);
//				return result ;
//			};
//		});
//	}

	
	//FIXME handle erroros with throw? errors['call? ????
	function _checkTagName(customElementDef) {
		var validTagName=/^[a-zA-Z][\w\_\.\:]*\-[\w\_\-\.\:]*$/g;
		
		if (!('tag' in customElementDef)){
			if (config.strictDefinition){
				log.error('missing mandantory field in customElementDef: tag');
				return false;
			}else{
				log.warn('missing mandantory field in customElementDef: tag');
				log.warn('Now try to use the module name as alternative value for: tag');
				log.debug('Module path:',customElementDef.m_customElementPath);
				var moduleName = customElementDef.m_customElementPath.replace(/.*\//,'');
				log.debug('Module name:',moduleName);
				if (!validTagName.test(moduleName)){
					log.error('Module name can not be set as tag name while does not fit to custom element tag name convention: ',validTagName);
					return false;
				}
				
				customElementDef.tag = moduleName;
				return true;
			}
		}else{
			if (typeof customElementDef.tag !== 'string'){
				log.error('wrong type of tag, it must be string, but current type is:', typeof customElementDef.tag, customElementDef);
				return false; 
			}
			
			if (!validTagName.test(customElementDef.tag)){
				log.error('invalid tag value:',customElementDef.tag);
				log.error(customElementDef.tag + ' does not fit to custom element tag name convention:',validTagName);
				log.debug('Note: tag name must contain a dash(-) character');
				return false;
			}
			
			return true;
		}
	}
	
	function addDefaultCreatedCallBackImplementation(customElementDef){
		//
		// concept: inject template and call 'created' callback method
		//
		customElementDef.m_proto.createdCallback= function(){
			// FIXME maybe express like next () solution??? for createdCallback instead of  instanceInitializationBlocks callback 
			if (customElementDef.m_proto.instanceInitializationBlocks instanceof Function){
//				 customElementDef.m_proto.initCallback();
				this.instanceInitializationBlocks = customElementDef.m_proto.instanceInitializationBlocks;
				this.instanceInitializationBlocks (this);
			}
			log.trace('create default createdCallback impl. to inject template into custom element');
			
			inject(this, this.template, customElementDef.append == true);
			
			if (this.created instanceof Function){
				this.created(this);
			}
		};
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
			if (ieVersion < 9) {
//				log.warn('createElement:',customElementDef.tag);
				document.createElement(customElementDef.tag);
			}
		}
		
		//	
		// Check prototype
		//
		var prototype = customElementDef.prototype;
		
		// for IE8 and below
		var xHTMLElement = typeof HTMLElement !== "undefined" ? HTMLElement : Element;
		
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
				log.error('extends property must be string',customElementDef);
			}
		}
			
		
		//
		// Check callback function definitions
		//
		var callbacks=['createdCallback','attachedCallback','detachedCallback','attributeChangedCallback'];
		
		// add custom attributes and properties to proto
		for(var p in customElementDef){
			customElementDef.m_proto[p]=customElementDef[p];
		}
		//
		// Check callback definitions 
		//
		for (var i=0; i< callbacks.length; i++){
			var callback = callbacks[i];
			if (callback in customElementDef){
				log.trace('check callback definition of customElement definition: '+callback);
				if (customElementDef[callback] instanceof Function){
					customElementDef.m_proto[callback]=customElementDef[callback];
				}else{
					customElementDef.m_proto[callback]= undefined;
					log.warn(callback+' is not function, ignore it');
				}
			}
		}
		
		// add default createdCallback impl
		if (!customElementDef.m_proto.createdCallback){
			if ('template' in customElementDef.m_proto){
				addDefaultCreatedCallBackImplementation(customElementDef);
			}else{
				log.debug('load template for '+customElementDef.tag+':',config.templateLoaderPlugin+'!'+customElementDef.m_customElementPath+'.html');
					require([config.templateLoaderPlugin+'!'+customElementDef.m_customElementPath+'.html'],function(template){
	
						customElementDef.m_proto.template=customElementDef.template=template;
						addDefaultCreatedCallBackImplementation(customElementDef);
						
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
		log(customElementDef.tag,'proto',customElementDef.m_proto);
		customElementDef.m_proto.m_customElementDef=customElementDef;
		try{
			if (customElementDef['extends']){
				return customElementDef.m_proto['magpie/html5/customElement']=document.registerElement(customElementDef.tag,{
					prototype: customElementDef.m_proto,
					'extends': customElementDef['extends'] 
					});
			}else{
				return customElementDef.m_proto['magpie/html5/customElement']=document.registerElement(customElementDef.tag,{
					prototype: customElementDef.m_proto
				});
			}
		}catch(e){
			log.error('Failed registrations of customElement: '+customElementDef.tag,e);
		}
	}

	return {
		
		config: config,
		//
		// loader plugin for customElement definitions
		//
		load: function(customElementPath, parentRequire, onload) {
			log.info('Load customElement definition:',customElementPath);
			parentRequire([customElementPath],function(customElementDef){
				customElementDef.m_customElementPath=customElementPath;
				_checkCustomElementDef(customElementDef, 
					function(customElementDef){
						onload( _registerElement(customElementDef));
					});
				});
		
		}
		};
	
});
