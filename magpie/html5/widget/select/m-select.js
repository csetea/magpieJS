/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
// TODO 
// m-option-group ?
// DONE
// m-option disabled
// m-option prevent
// m-option default
define([ 'magpie/log!magpie/html5/widget/select/m-select',  
		'css!./m-select.css' ], //
function(log) {
	
	var forEach = Array.prototype.forEach;
	

	return {
		tag : 'm-select',
		
		createdCallback : function() {
			var _this=this;
			this._displayEl = document.createElement('div');
			this._displayEl.setAttribute('class','display');
			var fakeSelectEl = document.createElement('select');
			fakeSelectEl.setAttribute('class','fake-select');
			fakeSelectEl.contentEditable=false;
			this._placeholderEl = document.createElement('div');
			this._placeholderEl.innerHTML=this.hasAttribute('placeholder')?this.getAttribute('placeholder'):'empty';
			this._placeholderEl.setAttribute('placeholder','');
			this._placeholderEl.contentEditable=false;
			this._displayEl.appendChild(this._placeholderEl);
			
			this._displayResultEl = document.createElement('div');
			this._displayResultEl.setAttribute('result','');
			this._displayEl.appendChild(this._displayResultEl);
			
			var selectionEl=this.querySelector('m-select-selection');
			if (selectionEl){
				this._displayEl.appendChild(selectionEl);	
			}
			
			this._displayEl.appendChild(fakeSelectEl);
			
			var fakeSelectOverlayoutEl = document.createElement('div');
			fakeSelectOverlayoutEl.contentEditable=false;
			fakeSelectOverlayoutEl.setAttribute('class','fake-select-overlayout');
			this._displayEl.appendChild(fakeSelectOverlayoutEl);
			
			this.contentEditable=true;
			this._displayEl.contentEditable=false;
			
			
			this._displayEl.onclick = function(event){
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
						if (rt == null){
							return null;
						}else if (rt.localName && rt.localName == 'm-option'){
							return rt;
						}else{
							return findOptionEl(rt.parentNode);
						}
					};
					var mOptionEl = findOptionEl(relatedTarget);
					if (mOptionEl && mOptionEl.hasAttribute('prevent')){
						// breek, keep m-select in opened state
						return true;
					}
				}
				_this.removeAttribute("opened");
			});

			
			
			this._listEl = document.createElement('div');
			this._listEl.childNodes=this.childNodes;
			this._listEl.setAttribute('class','list');
			this._listEl.contentEditable=false;

			this._listContainerEl = document.createElement('div');
			this._listContainerEl.setAttribute('class','list-container');
			this._listContainerEl.appendChild(this._listEl);
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
			var _this=this;
			while (this.firstChild) {
				var child= this.removeChild(this.firstChild);
				if (child.hasAttribute && child.hasAttribute('placeholder')){
					_this._displayEl.replaceChild( child, _this._placeholderEl);
				}else if (child.hasAttribute && child.hasAttribute('result')){
					_this._displayEl.replaceChild( child, _this._displayResultEl);
				}else {
					_this._listEl.appendChild(child);		
				}
				
			}
			
			this._resultTemplatePresent = this._displayResultEl.querySelector('*');
			
			this.appendChild(_this._displayEl);
			this.appendChild(_this._listContainerEl);
			
			this.update();
		},
		
		selection: function(){
			var selection=[];
			
			var childs = this.querySelectorAll('m-option[selected]');
			forEach.call(childs, function( el ){
					selection.push(el);
			});
			
			if (selection.length == 0){
				var defaultEl= this.querySelector('m-option[default]');
				if (defaultEl){
					defaultEl.setAttribute('selected','true');
					selection.push(defaultEl);
				}
			}
			
			return selection;
		}
		


	};

});
