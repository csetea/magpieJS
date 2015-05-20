/**
 * @doc m-source.md
 * @license MIT
 */
/** TODO
 * [ ] configuration || element attribute - tabReplace
 * */
define([ 'log!m-source','magpie/view/inject', 'highlightDir/highlight.min', 'css!highlightDir/default.min.css'], //
		function(log, inject, hljs) {
	
	
	hljs.configure({
		useBR: 'innerText' in document.createElement('code')
		,tabReplace: '  '
	});

	function createSourceBoxBasedOnHref(el, href, callback) {
		require(['text!'+href], function(source){
			var pre = document.createElement('pre');
			var ce = document.createElement('code');

			
			if ('innerText' in ce){
				ce.innerText=source;
			}else{
				ce.textContent=source;
			}
			pre.appendChild(ce)
			
			inject(el,pre)
			
			hljs.highlightBlock(ce);
		});
	}

	return {
		tag : 'm-source',

		createdCallback : function() {
			var href = this.getAttribute('href');
			if (href)
			createSourceBoxBasedOnHref(this, href);
		},
		
		attributeChangedCallback : function(name, previousValue, value) {
			var href = this.getAttribute('href');
			if (href)
			createSourceBoxBasedOnHref(this, href);
		}
		
	}

});
