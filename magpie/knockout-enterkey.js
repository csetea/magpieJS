/**
 * @license MIT 
 */
define([ 'knockout' ],
		function(ko) {
			ko.bindingHandlers.enterkey = {
				init : function(element, valueAccessor, allBindingsAccessor,
						viewModel) {
					var allBindings = allBindingsAccessor();
					element.onkeypress = function(event) {
						var keyCode = (event.which ? event.which
								: event.keyCode);
						if (keyCode === 13) {
							allBindings.enterkey.call(viewModel);
							return false;
						}
						return true;
					};
				}
			};
		});
