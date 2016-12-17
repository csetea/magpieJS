/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
 define(['magpie/log!magpie/dom/inject', 'require'], function(log, require) {

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

	var templateTagSupported = typeof document.createElement('template').content !== 'undefined';


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

		if(templateTagSupported){
			var importNode = document.importNode(temp.content, true);
			injectHTMLElement(el, importNode, append);
		} else {
			// temp = temp.cloneNode(true);
			for (var i=0, length=temp.childNodes.length; i< length; i++){
				if (temp.childNodes[i]){
					injectHTMLElement(el, temp.childNodes[i], i==0 ? append: true);
				}
			}
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
