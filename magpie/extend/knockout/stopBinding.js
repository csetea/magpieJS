/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
define([ 'knockout' ],
function(ko) {
	ko.bindingHandlers.stopBinding = {
			init: function() {
				return { controlsDescendantBindings: true };
	    }
	};
	ko.virtualElements.allowedBindings.stopBinding = true;
});

