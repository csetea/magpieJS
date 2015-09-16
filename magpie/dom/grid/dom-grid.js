/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */

/*
		<div m-grid>
			<div>
				item
			</div>
			<div unit="auto">
				item auto
			</div>
			<div unit="1/4" offset="1/4'>
				item unit 1/4 offset 1/4
			</div>
		</div>
*/

// DONE
// [*] horizontal 
// [*] offset
// [*] vertical
// TODO
// [?] end
//TODO align -> m-align? 'align' is already defined/reserved in dom 

define([ 'magpie/log!magpie/dom/float/grid', 'module', 'magpie/util/config', 'magpie/dom/mediaQueries'//
         ,'css!./dom-grid'],
function(log, module, config, mediaQueries) {

	//@Polyfill
	if (!String.prototype.startsWith) {
		  Object.defineProperty(String.prototype, 'startsWith', {
		    enumerable: false,
		    configurable: false,
		    writable: false,
		    value: function(searchString, position) {
		      position = position || 0;
		      return this.lastIndexOf(searchString, position) === position;
		    }
		  });
		}

	/*jshint -W004 */
	var config = config(module, {
		ths : [ 5, 24 ]
	});
	// sort grid ths config
	config.ths = config.ths.sort(function(a, b) {
		return a.size - b.size;
	});
	var maxThs = config.ths[config.ths.length - 1];
	var thsMap = {};
	for (var i = 1; i <= maxThs; i++) {
		for ( var thsIndex in config.ths) {
			var ths = config.ths[thsIndex];
			if (ths % i === 0) {
				thsMap[i] = i;
			}
		}
	}
	
	var widthThsMap = {
			'100' : [ '1' ]
		};
	for ( var ths in thsMap) {
		for (var i = 1; i <= ths; i++) {
			var width = (i / ths * 100).toFixed(4) % 100;
			if (width === 0) {
				width = 100;
			}
			var listForWidth = widthThsMap[width];
			if (!listForWidth) {
				listForWidth = [];
				widthThsMap[width] = listForWidth;
			}
			listForWidth.push(i + '/' + ths);
		}
	}
	
	var widthThsList = [];
	for ( var width in widthThsMap) {
		widthThsList.push({
			width : width,
			thsList : widthThsMap[width]
		});
	}
	widthThsList = widthThsList.sort(function(a, b) {
		return a.width - b.width;
	});

	//
	// fill attribute ths map
	//
	var attributeNameSet = {};
	var attributes = [ 'unit','offset' ];
	// TODO push, poll and offset?
	// or push + offset
	// or push + poll
	// var attributes = [ 'unit', 'push', 'poll', 'offset' ];
	for (var i = 0; i < attributes.length; i++) {
		attributeNameSet[attributes[i]] = {};
	}
	var attributeScreenMap = {};
	mediaQueries.screens.each(function(screen) {
		for (var i = 0; i < attributes.length; i++) {
			attributeNameSet[attributes[i] + '-' + screen.name] = {};
			attributeScreenMap[attributes[i] + '-' + screen.name] = screen;
		}
	});
	
	//
	//
	for ( var width in widthThsMap) {
		var thsList = widthThsMap[width];
		for ( var unit in attributeNameSet) {
			for ( var thsIndex in thsList) {
				var ths = thsList[thsIndex];
				attributeNameSet[unit][ths] = ths;
			}
		}
	}
	
	//TODO common code base until this point with magpie/html5/widget/grid ???

	//
	// generate css
	//
	function cssPropertiesFor(attribute, percentageValue, isVertical) {
		if (/unit.*/.test(attribute)) {
			return '\n{' + //
			 			'flex-basis:' + percentageValue + ';' +//
			 		'}\n';
//			if (isVertical) {
//				return '\n{' //
//						+ 'height:' + percentageValue + ';'//
//						+ '}\n';
//			} else {
//				return '\n{' //
//				// + 'min-width:' + percentageValue + ';' //
//						+ 'width:' + percentageValue + ';' //
//						// + 'max-width:' + percentageValue + ';' //
////						 + 'flex:' + percentageValue + ';' // //for new
//						// browsers
//						// + 'height:' + percentageValue + ';'//
//						+ '}\n';
//			}
		} else if (/offset.*/.test(attribute)) {
			return '\n{' + //
// 				'margin-left:' + percentageValue + ';' +//
 				'margin-left:' + percentageValue + ';' +//
 			'}\n';
		} else if (/push.*/.test(attribute)) {
			// TODO
			// if(isVertical){
			// return '\n{' //
			// // + 'margin-top:' + percentageValue + ';' //
			// + '}\n';
			// }else{
			return '\n{' + //
			// + 'display: '
					// + 'top:' + percentageValue + ';' //

					// + 'margin-top:' + percentageValue + ';' //
					// + 'margin-left:' + percentageValue + ';' //
					 '}\n';
			// }
		} else if (/poll.*/.test(attribute)) {
			// TODO
			return '\n{' + //
					 '}\n';
		}
	}
	function cssSelectorListForThsList(attribute, thsList, isVertical) {
		var cssSelectorList = [];
		for ( var thsListIndex in thsList) {
			var ths = thsList[thsListIndex];

			var cssSelector = //
				'[m-grid]'+(isVertical ? '[vertical]' : '') + '>[' + attribute + '="' + ths + '"]';
			cssSelectorList.push(cssSelector);
		}
		return cssSelectorList;
	}

	var css = '/*Magpie magpie/dom/grid core*/';
	
	for ( var attribute in attributeNameSet) {
		var screen = attributeScreenMap[attribute];
		var cssForUnit = '\n';
		for ( var widthThsListIndex in widthThsList) {
			var widthThs = widthThsList[widthThsListIndex];
			var isVertical = false;
			var percentageValue = widthThs.width + "%";
			cssForUnit += cssSelectorListForThsList(attribute,
					widthThs.thsList, isVertical) + //
					cssPropertiesFor(attribute, percentageValue, isVertical);
			//TODO vertical support ???
//			isVertical = true;
//			cssForUnit += cssSelectorListForThsList(attribute,
//					widthThs.thsList, isVertical) + //
//					cssPropertiesFor(attribute, percentageValue, isVertical);
			log.trace(cssForUnit);

		}

		if (attribute.startsWith('unit')) {
			//FIXME maybe add '*' too as alternative shortened of 'auto'
			var cssSelector = '[m-grid]>[' + attribute + '="auto"]';
			css += cssSelector + //
							'\n{' + //
								'flex: 1 1 auto;' + //
							'}\n';
		}else if(attribute.startsWith('offset')) {
			//TODO
			var cssSelector = '[m-grid]>[' + attribute + '="auto"]';
			css += cssSelector + //
							'\n{' + //
								'margin-left: auto;' + //
							'}\n';
		}

		if (screen) {
			css += screen.createCssRuleString(cssForUnit);
		} else {
			css += cssForUnit;
		}
		css += '\n';
	}
	// log.trace(css);
	mediaQueries.addCssRule(css);
	if (log.isTrace){
		log.trace(css)	
	}
}
);
