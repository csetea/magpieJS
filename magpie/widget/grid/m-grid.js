/**
 * @license MIT
 */
/**
 * Example html markup for custom element grid system<code>
 <m-grid> 
 <m-grid-item unit="1" unit-md='1/3'>1</m-grid-item>
 <m-grid-item unit="1" unit-md='1/3'>2</m-grid-item>
 <m-grid-item unit="1" unit-sm='1/3'>3.Nested Grid
 <m-grid>
 <m-grid-item unit="1" unit-md='1/3'>1</m-grid-item>
 <m-grid-item unit="1" unit-md='1/3'>2</m-grid-item>
 <m-grid-item unit="1" unit-sm='1/9' >3</m-grid-item>
 </m-grid>
 </m-grid-item>
 </m-grid>
 * </code>
 * make example like http://purecss.io/grids/
 */
define([ 'log!m-grid', 'module', 'magpie/util/config',
		'magpie/dom/mediaQueries', 'css!./m-grid.css' ], //
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

	var config = config(module, {
		ths : [ 5, 24 ]
	});

	// sort grid ths config
	config.ths = config.ths.sort(function(a, b) {
		return a.size - b.size
	});
	var maxThs = config.ths[config.ths.length - 1];

	var thsMap = {};
	for (var i = 1; i <= maxThs; i++) {
		for ( var thsIndex in config.ths) {
			var ths = config.ths[thsIndex];
			if (ths % i == 0) {
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
			if (width == 0) {
				width = 100;
			}
			var listForWidth = widthThsMap[width];
			if (!listForWidth) {
				listForWidth = [];
				widthThsMap[width] = listForWidth;
			}
			listForWidth.push(i + '/' + ths)
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
		return a.width - b.width
	});

	//
	// fill attribute ths map
	//
	var attributeNameSet = {};
	var attributes = [ 'unit' ];
	// TODO push, poll and offset?
	// or push + offset
	// or push + poll
	// var attributes = [ 'unit', 'push', 'poll', 'offset' ];
	for (var i = 0; i < attributes.length; i++) {
		attributeNameSet[attributes[i]] = {}
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

	//
	// generate css
	//
	function cssPropertiesFor(attribute, percentageValue, isVertical) {
		if (/unit.*/.test(attribute)) {
			return '\n{' //
			+ 'flex-basis:' + percentageValue + ';'//
			+ '}\n';
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
		} else if (/push.*/.test(attribute)) {
			// TODO
			// if(isVertical){
			// return '\n{' //
			// // + 'margin-top:' + percentageValue + ';' //
			// + '}\n';
			// }else{
			return '\n{' //
			// + 'display: '
					// + 'top:' + percentageValue + ';' //

					// + 'margin-top:' + percentageValue + ';' //
					// + 'margin-left:' + percentageValue + ';' //
					+ '}\n';
			// }
		} else if (/poll.*/.test(attribute)) {
			// TODO
			return '\n{' //
					+ '}\n';
		}
	}
	function cssSelectorListForThsList(attribute, thsList, isVertical) {
		var cssSelectorList = [];
		for ( var thsListIndex in thsList) {
			var ths = thsList[thsListIndex];

			var cssSelector = //
			(isVertical ? 'm-grid[vertical]>' : '')//
					+ 'm-grid-item[' + attribute + '="' + ths + '"]'//
			cssSelectorList.push(cssSelector);
		}
		return cssSelectorList;
	}
	var css = '/*Magpie grid core*/';
	for ( var attribute in attributeNameSet) {
		var screen = attributeScreenMap[attribute];
		var cssForUnit = '\n';
		for ( var widthThsListIndex in widthThsList) {
			var widthThs = widthThsList[widthThsListIndex];
			var isVertical = false;
			var percentageValue = widthThs.width + "%";
			cssForUnit += cssSelectorListForThsList(attribute,
					widthThs.thsList, isVertical) //
					+ cssPropertiesFor(attribute, percentageValue, isVertical);
			isVertical = true;
			cssForUnit += cssSelectorListForThsList(attribute,
					widthThs.thsList, isVertical) //
					+ cssPropertiesFor(attribute, percentageValue, isVertical);
			log.trace(cssForUnit)

		}

		if (attribute.startsWith('unit')) {
			var cssSelector = 'm-grid-item[' + attribute + '="auto"]';
			css += cssSelector //
					+ '\n{'//
//					+ 'flex: 1 1 100%;'//
					+ 'flex: 1 1 auto;'//
					+ 'flex: 1 1 auto;'//
					
					+ '}\n'//
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

	return {
		tag : 'm-grid',

		createdCallback : function() {
			// prevent template lookup and injection on
			// magpie/html5/customElement registration
			var isVertical = this.getAttribute('vertical') == 'true';
			if (!isVertical) {
				isVertical = this.hasAttribute('vertical');
			}
			if (isVertical){
//				this.onresize=
//					function(){log("a")};
				var el=this.parentNode;
				
//				if (el.getAttribute('unit'))
					
				
			}

		},

		checkThsDefinition : function(attribute, value, grid) {
			if (!attributeNameSet[attribute][value]) {
				attributeNameSet[attribute][value] = value;

				var unitValues = value.split("/");
				var valueDivideResult = unitValues[0] / unitValues[1];

				var screen = attributeScreenMap[attribute];
				var width = (valueDivideResult * 100).toFixed(4) % 100;
				if (width == 0) {
					width = 100;
				}

				var ths = value
				var cssSelector = 'm-grid-item[' + attribute + '="' + ths
						+ '"]'//
						// isVertical =
						// grid.getAttribute('direction')=='vertical';
				var isVertical = grid.getAttribute('vertical') == 'true';
				if (!isVertical) {
					isVertical = grid.hasAttribute('vertical');
				}

				var percentageValue = width + "%";
				var css = '/*Magpie grid ' + attribute + '="' + ths + '"*/';
				css += cssSelector //
						+ cssPropertiesFor(attribute, percentageValue,
								isVertical);

				if (screen) {
					screen.addCssRule(css);
				} else {
					mediaQueries.addCssRule(css);
				}
				return width;
			} else {
				return attributeNameSet[attribute][value];
			}
		},

		attributeNameSet : attributeNameSet

	}

})
