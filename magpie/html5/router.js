/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
// Based on pagejs, context extended with 
//* query (object that contains the query parameteres)
//* hashPathname (analog 'pathname')
//* hashQuerystring (analog 'querystring')
//* hashQuery (object that contains the query parameteres from hash)
define([ 'magpie/log!magpie/html5/router', 'module', 'magpie/util/config', 'page','page/query', 'require', 'magpie/dom/inject','magpie/html5/customElement/_ieVersion','magpie/html5/customElement'],
		function(log, module, config, page, qs, require, inject, ieVersion) {

	/*jshint -W004 */
	var config =config(module,{
		init: function(){},
		autoStart: true,
//		mergeHashQuery: false,
//		mergeHashPath: false,
//		handlers: []
		handlers: [
		           function(ctx, next){	if (log.isTrace){log.trace('reached the last handler, ctx:',ctx);}}]
	});

	var router={
			start: function(callback){
				if (ieVersion == 8 || ieVersion == 9){
					// polyfill hisotry api
					//TODO configurable config?path?shim? history impl provider ....
					require([ 'lib/HTML5-History-API/history.min'],function(){
						page.start();
						if (callback instanceof Function){
							callback(router);
						}
					});
					
				}else{
					page.start();
					if (callback instanceof Function){
						callback(router);
					}
				}
			},

			ctx:null
		};
	
	
	page( function(ctx){
		  ctx.query = qs.parse(location.search.slice(1));
		  ctx.hashPathname =ctx.hash.replace(/\?.*/,function(hashQuerystring){
			  ctx.hashQuerystring=hashQuerystring;
			  hashQuerystring = hashQuerystring.replace(/\?/,'');
			  ctx.hashQuery = qs.parse(hashQuerystring);  
			  return '';
		  });
		  
		  if (log.isTrace){
			  log.trace(ctx);
		  }
		  ctx.log = log;
		  
		  router.ctx=ctx;
		  
		  // simple lazy implementation of Express style middle ware next callback chain
		  var handlerIndex = 0;
		  var next = function (){
			  var handler = config.handlers[handlerIndex];
			  if (handler){
				  handlerIndex++;
				  handler(ctx, next);
			  }
		  };
		  next();
	});

		
	
	if (config.autoStart){
		router.start();
	}
	
	
	return router;
	
});