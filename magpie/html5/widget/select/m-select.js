/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
// TODO 
// m-option default
// m-option-group ?
// DONE
// m-option disabled
// m-option prevent
define([ 'magpie/log!magpie/html5/widget/select/m-select',  
		'css!./m-select.css' ], //
function(log) {
	
	var forEach = Array.prototype.forEach;
	

	return {
		tag : 'm-select',
		
		createdCallback : function() {
			var _this=this;
			var displayEl = document.createElement('div');
			displayEl.setAttribute('class','display');
			var fakeSelectEl = document.createElement('select');
			fakeSelectEl.setAttribute('class','fake-select');
			fakeSelectEl.contentEditable=false;
			var placeholderEl = document.createElement('div');
			placeholderEl.innerHTML=this.hasAttribute('placeholder')?this.getAttribute('placeholder'):'empty';
			placeholderEl.setAttribute('class','placeholder');
			placeholderEl.contentEditable=false;
			displayEl.appendChild(placeholderEl);
			
			var displayResultEl = document.createElement('div');
			displayResultEl.setAttribute('class','result');
			this._displayResultEl=displayResultEl;
			displayEl.appendChild(displayResultEl);
			
			var selectionEl=this.querySelector('m-select-selection');
			if (selectionEl){
				displayEl.appendChild(selectionEl);	
			}
			
			displayEl.appendChild(fakeSelectEl);
			
			var fakeSelectOverlayoutEl = document.createElement('div');
			fakeSelectOverlayoutEl.contentEditable=false;
			fakeSelectOverlayoutEl.setAttribute('class','fake-select-overlayout');
			displayEl.appendChild(fakeSelectOverlayoutEl);
			
			this.contentEditable=true;
			displayEl.contentEditable=false;
			
			
			displayEl.onclick = function(event){
				if (_this.hasAttribute("opened")){
					//FIX width after close
					_this.style.width='';
					if(event)
						event.stopImmediatePropagation();
					_this.blur();
					_this.removeAttribute("opened");
				}else{
					//FIX width on open
					_this.style.width=_this.offsetWidth+'px';
					// open
					_this.setAttribute("opened","true");
				}
			};
			
			this.addEventListener('blur',function(event){
				var relatedTarget = event.relatedTarget;
				if (relatedTarget && relatedTarget.localName){
					var findOptionEl = function(rt){
						if (rt.localName && rt.localName == 'm-option'){
							return rt;
						}else{
							return findOptionEl(rt.parentNode);
						}
					};
					var mOptionEl = findOptionEl(relatedTarget);
					if (mOptionEl.hasAttribute('prevent')){
						// breek, keep m-select in opened state
						return true;
					}
				}
				_this.removeAttribute("opened");
			});

			
			
			var listEl = document.createElement('div');
			listEl.childNodes=this.childNodes;
			listEl.setAttribute('class','list');
			listEl.contentEditable=false;

			var listContainerEl = document.createElement('div');
			listContainerEl.setAttribute('class','list-container');

			
			
			while (this.firstChild) {
				var child= this.removeChild(this.firstChild);
				if (child.hasAttribute && child.hasAttribute('placeholder')){
					placeholderEl.removeChild(placeholderEl.firstChild);
					placeholderEl.appendChild(child);
				}else if (child.hasAttribute && child.hasAttribute('result')){
					displayResultEl.appendChild(child);
				}else {
					listEl.appendChild(child);		
				}
				
			}
			
			this._resultTemplatePresent = this._displayResultEl.querySelector('*');
			
			this.appendChild(displayEl);
			
			this.appendChild(listContainerEl);
			listContainerEl.appendChild(listEl);
//			displayEl.appendChild(listEl);
			
		},
		
		close: function(){
			this.removeAttribute("opened");
		},
		
		open: function(){
			this.setAttribute("opened","true");
		},
		
		update: function(){
			var selection = this.selection();
			var selectionLength= selection.length;
			//FIX width on update
			this.style.width='';
			if (selectionLength >0){
				
				this.setAttribute('selection',selectionLength);

				if (!this._resultTemplatePresent){
					if (this.hasAttribute('multiple')){
						this._displayResultEl.innerHTML =  selectionLength + ' / ' + this.querySelectorAll('m-option').length;
					}else{
						while (this._displayResultEl.firstChild) {
							this._displayResultEl.removeChild(this._displayResultEl.firstChild);
						}
						var _this=this;
						selection.forEach(function(el){
							var clone = el.cloneNode(true);
//							clone.addEventListener('click',function(event){
////								event.stopImmediatePropagation();
//							});
							
							clone.removeAttribute('selected');
							_this._displayResultEl.appendChild( clone);
						});
					}
				}
				
			}else{
				this.removeAttribute('selection');
			}
		},
		
		fire: function(event, stateObject){
			log.trace('fire:',stateObject);

			this.update();
			
			if (!this.hasAttribute('multiple')){
				this.blur();
			}
			
			
		},
		
		attachedCallback: function(){
			this.update();
		},
		
		selection: function(){
			var selection=[];
			
			var childs = this.querySelectorAll('m-option');
			forEach.call(childs, function( el ){
				if (el.hasAttribute('selected')){
					selection.push(el);
				}
			});
			
			
			return selection;
		}
		


	};

});
