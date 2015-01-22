/**
 * @doc m-view.md
 * @license MIT
 */
define([ 'module', 'log!m-view','magpie/view/inject'], //
		function(module, log, inject) {

	// createViewObjectBasedOnHref ???? -> use the viewProxy?
	function createViewObjectBasedOnHref(el, href, callback) {

		//TODO
		require([href], function(href){
			//FIXME ??? use viewProxy?
			inject(el,href)
		});
		
		
	}

	return {
		tag : 'm-view',

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
