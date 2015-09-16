/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
define(['magpie/log!magpie/dom/inject' ], function(log) {
	
	/* POLYFILL template element */
//	(function templatePolyfill(d) {
//		if('content' in d.createElement('template')) {
//			return false;
//		}
//
//		var qPlates = d.getElementsByTagName('template'),
//			plateLen = qPlates.length,
//			elPlate,
//			qContent,
//			contentLen,
//			docContent;
//
//		for(var x=0; x<plateLen; ++x) {
//			elPlate = qPlates[x];
//			qContent = elPlate.childNodes;
//			contentLen = qContent.length;
//			docContent = d.createDocumentFragment();
//
//			while(qContent[0]) {
//				docContent.appendChild(qContent[0]);
//			}
//
//			elPlate.content = docContent;
//		}
//	})(document);
	
	
	
	
	

	function injectHTMLElement(el, htmlElement, append){
		log.trace('inject HTMLElement');
		//FIXME if el is array????
		if (!append){
			while (el.firstChild) {
				el.removeChild(el.firstChild);
			}
		}
		el.appendChild(htmlElement);
	}
	
	function injectString(el, html, append){
		log.trace('inject stringHtml');
		 
		var temp = document.createElement('template');
		var x;
		if (!temp.innerText){
			x= temp.innerHTML = html;	
		}else{
			x= temp.innerText = html;
		}
		
		log.trace('temp.innerHTML/innerText: '+x);
		try{
			var importNode = document.importNode(temp.content, true);
			injectHTMLElement(el, importNode, append);
		}catch(e){
			var clone = temp.cloneNode(true);
			injectHTMLElement(el, clone, append);
		}
	}
	
	function inject(el, stringHtmlOrHTMLElement, append){
		log.debug('inject',arguments);
				// for IE8 and below
		var xHTMLElement = typeof HTMLElement !== "undefined" ? HTMLElement : Element;

		if (typeof stringHtmlOrHTMLElement === 'string'){
			injectString(el, stringHtmlOrHTMLElement, append);
		}else if (stringHtmlOrHTMLElement instanceof xHTMLElement){
			injectHTMLElement(el, stringHtmlOrHTMLElement, append);
		}else if (stringHtmlOrHTMLElement instanceof Function){
			inject(el, new stringHtmlOrHTMLElement(), append);
		}else{
			log.warn('unecpected type', stringHtmlOrHTMLElement);
		}
		

	}
	
	inject.css = function(css){
			var head = document.head || document.getElementsByTagName('head')[0];
			
			var style = document.createElement('style');
			style.type = 'text/css';
			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}

			injectHTMLElement(head,style,true);
	};
	
	return inject; 
	
	
});
