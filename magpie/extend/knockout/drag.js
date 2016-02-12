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
				if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
					event.dataTransfer.setData('text/html', new Date().getTime());
				}else{
					event.dataTransfer.setData('text', '' + new Date().getTime());
				}
				var allBindings = allBindingsAccessor();
				allBindings.drag.call(viewModel,event,element);
				return true;
			});
		}
	};
});
