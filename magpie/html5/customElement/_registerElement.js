/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
// cares document.registerElement polyfill
define([ 'module','magpie/util/config', 'magpie/log!magpie/html5/customElement/_registerElement', 'require'], function(module, config, log, require) {


	if (!require.isBrowser){
		// Fake document for r.js optimization
		document={
			createElement: function(){
				return {
					getElementsByTagName: function(){return{

					}},

				}

			},

			registerElement:function(){return{}},

			getElementsByTagName: function(){return{}},

			querySelector: function(){return{}},
			querySelectorAll: function(){return{}},

		}
	}

	/*jshint -W004 */
	var config =config(module,{
		provider: 'magpie/html5/customElement/provider/WebReflection/document-register-element!'
	});


	if (typeof Object.create != 'function') {
	  // Production steps of ECMA-262, Edition 5, 15.2.3.5
	  // Reference: http://es5.github.io/#x15.2.3.5
		Object.create = (function() {
		    // To save on memory, use a shared constructor
		    function Temp() {}

		    // make a safe reference to Object.prototype.hasOwnProperty
		    var hasOwn = Object.prototype.hasOwnProperty;

		    return function (O) {
		      // 1. If Type(O) is not Object or Null throw a TypeError exception.
		      if (typeof O != 'object') {
		        throw TypeError('Object prototype may only be an Object or null');
		      }

		      // 2. Let obj be the result of creating a new object as if by the
		      //    expression new Object() where Object is the standard built-in
		      //    constructor with that name
		      // 3. Set the [[Prototype]] internal property of obj to O.
		      Temp.prototype = O;
		      var obj = new Temp();
		      Temp.prototype = null; // Let's not keep a stray reference to O...

		      // 4. If the argument Properties is present and not undefined, add
		      //    own properties to obj as if by calling the standard built-in
		      //    function Object.defineProperties with arguments obj and
		      //    Properties.
		      if (arguments.length > 1) {
		        // Object.defineProperties does ToObject on its first argument.
		        var Properties = Object(arguments[1]);
		        for (var prop in Properties) {
		          if (hasOwn.call(Properties, prop)) {
		            obj[prop] = Properties[prop];
		          }
		        }
		      }

		      // 5. Return obj
		      return obj;
		    };
		})();
	}

	return {
		//
		// loader plugin for customElement definitions
		//
		load: function(customElementPath, parentRequire, onload) {
				if(require.isBrowser && !document.registerElement){
					log.warn('try to load polyfill for document.registerElement:',config.provider);
					require([config.provider],function(){
								log.warn('polyfilled: document.registerElement');
								onload({polyfill: config.provider});
					});
				}else{
					onload({polyfill: false});
				}
			}
		};

});
