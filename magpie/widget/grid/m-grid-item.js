/**
 * @license MIT
 */
define([ 'log!m-grid-item', './m-grid' ], //
function(log, grid) {
	var regexpForValueFormatCheck = /^(auto|1|\d{1,2}\/\d{1,2})$/;
	function checkThsDefinition(attribute, value, item) {
		if (value) {
			if (regexpForValueFormatCheck.test(value)) {
				if (value != "1") {
					grid.checkThsDefinition(attribute, value, item.parentNode);
				}
			} else {
				log.error('Wrong unit format: ' + attribute + '="' + value + '"'
						+ ' value should be ' + regexpForValueFormatCheck);
			}
		}
		
	}
	
	return {
		tag : 'm-grid-item',

		createdCallback : function() {
			for ( var attribute in grid.attributeNameSet) {
				var value = this.getAttribute(attribute);
				checkThsDefinition(attribute, value, this)
			}
		},

		attributeChangedCallback : function(name, previousValue, value) {
			if (grid.attributeNameSet[name]) {
				checkThsDefinition(attribute, value, this)
			}
		}
	}

})
