/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
define([ 'knockout' ],
function(ko) {
	ko.bindingHandlers.drop = {
		init : function(element, valueAccessor, allBindingsAccessor,
				viewModel) {
			element.addEventListener('dragenter',function(){
				element.classList.add('dragover');
				return true;
			});
			element.addEventListener('dragleave',function(){
				element.classList.remove('dragover');
				return true;
			});
			element.addEventListener('dragover',function(event){
				if(event.preventDefault){
					event.preventDefault();
				}
				return false;
			});
			element.addEventListener('drop',function(event){
				element.classList.remove('dragover');
				var allBindings = allBindingsAccessor();
				allBindings.drop.call(viewModel,event,element);
				return true;
			});
		}
	};
});
