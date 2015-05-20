/**
 * @doc inject.md
 * @license MIT
 */
define([ 'module', 'log!inject' ], function(module, log) {
	
	//TODO?
//	var attachTemplate = function(el, template) {
//		// if (typeof template === undefined) {
//		// template = null;
//		// }
//		if (jq) {
//			log.trace('set content to template with configured provider')
//			jq(el).html(template)
//		} else {
//			log.trace('set content to template with document.template')
//			var temp = document.createElement('template');
//			temp.innerHTML = template;
//			el.appendChild(temp.content)
//		}
//	}

	function injectHTMLElement(el, htmlElement, append){
		log.trace('inject HTMLElement')
		//FIXME if el is array????
		if (!append){
			while (el.firstChild) {
				el.removeChild(el.firstChild);
			}
		}
		el.appendChild(htmlElement)
	}
	
	function injectString(el, html, append){
		log.trace('inject stringHtml')
		var temp = document.createElement('template');
		temp.innerHTML = html;
//		injectHTMLElement(el, temp.content, append);
		var clone = document.importNode(temp.content, true);
		injectHTMLElement(el, clone, append);
	}
	
	function inject(el, stringHtmlOrHTMLElement, append){
		log.debug('inject',arguments)
		if (!(el instanceof HTMLElement)){
			el = document.querySelector('#viewContainer');
			//TODO extend el handling with configuration and error handling/fallback? 
		}
		
		
		if (typeof stringHtmlOrHTMLElement === 'string'){
			injectString(el, stringHtmlOrHTMLElement, append);
		}else if (stringHtmlOrHTMLElement instanceof HTMLElement){
			injectHTMLElement(el, stringHtmlOrHTMLElement, append);
		}else if (stringHtmlOrHTMLElement instanceof Function){
			inject(el, new stringHtmlOrHTMLElement(), append);
		}else{
			log.warn('unecpected type', stringHtmlOrHTMLElement)
		}
		

	}
	
	return inject; 
	
	
});
