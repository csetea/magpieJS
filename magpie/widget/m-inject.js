/**
 * @doc m-inject.md
 * @license MIT
 */
define([ 'module', 'log!m-inject','magpie/dom/inject'], //
		function(module, log, inject) {
	
	require(['magpie/html5/customElement!magpie/widget/m-inject']);

	function createViewObjectBasedOnHref(el, href, callback) {
		require([href], function(hrefObject){
			
			if (typeof hrefObject === 'string'|| //
					hrefObject instanceof HTMLElement ||//
					hrefObject instanceof Function){
				inject(el,hrefObject)	
			}else if (hrefObject instanceof Object){
				log.debug('try to load as customElement: '+ href);
				require(['magpie/html5/customElement!'+href], function(ce){
					inject(el,ce);
				});
			}
		});
		
	}

	return {
		tag : 'm-inject',

		createdCallback : function() {
			log('callback', this)
			var href = this.getAttribute('href');
			createViewObjectBasedOnHref(this, href);
		},
//		attachedCallback : function() {
//			modelCallback(this, 'attached');
//		},
//		detachedCallback : function() {
//			modelCallback(this, 'detached');
//		},
		
		attributeChangedCallback : function(name, previousValue, value) {
//			// TODO call detach if href changed and then 'init'
			var href = this.getAttribute('href');
			createViewObjectBasedOnHref(this, href);

//
//			// TODO ancs reload content if it is href/view/...
//			// else pass to model
//			log.trace('attributeChangedCallback', 'name', name,
//					'previousValue', previousValue, 'value', value)
//
////			this._viewContext.attributeChanged = {
////				name : name,
////				previousValue : previousValue,
////				value : value
////			}
////
////			modelCallback(this, 'attributeChanged');
		}
		
		
	}

});
