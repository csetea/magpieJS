/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
define([ 'knockout' ],
function(ko) {
	ko.bindingHandlers.drag = {
		init : function(element, valueAccessor, allBindingsAccessor,
				viewModel) {
			if (!element.hasAttribute('draggable')){
				element.setAttribute('draggable','true');
			}
			element.addEventListener('dragleave',function(){
				element.classList.remove('drag');
				return true;
			});
			element.addEventListener('dragstart',function(event){
				element.classList.add('drag');
				event.dataTransfer.setData('text/x-plain', 'FireFox fix');
				var allBindings = allBindingsAccessor();
				allBindings.drag.call(viewModel,event,element);
				return true;
			});
		}
	};
});
