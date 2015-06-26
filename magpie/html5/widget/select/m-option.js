/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
define([ 'magpie/log!magpie/html5/widget/select/m-option'  ], //
function(log) {
	
	var forEach = Array.prototype.forEach;

	return {
		tag : 'm-option',
		
		 
		
		select: function(mSelectEl, mOptionEl, event){
			
			if (mOptionEl.hasAttribute('disabled')){
				mSelectEl.blur();
			} else if (mOptionEl.hasAttribute('prevent')){
				// ...
			}else{
				var selected =  !mOptionEl.hasAttribute('selected');
				var multiple = mSelectEl.hasAttribute('multiple');
				var oldSelection = mSelectEl.selection();
				if (!multiple){
					forEach.call(mSelectEl.querySelectorAll('m-option'), function( optionEl ){
						optionEl.removeAttribute('selected'); 
					});
				}
				if (selected){
					mOptionEl.setAttribute('selected','true');		
				}else{
					mOptionEl.removeAttribute('selected');
				}
				mSelectEl.fire('selectionChanged', {
					oldSelection: oldSelection,
					newSelection: mSelectEl.selection(),
					source: mOptionEl,
					selected: selected
				});
			}
		},

		createdCallback : function() {


		},
		
		attachedCallback: function(){
			if (!this._m_select){
				this._m_select = this.parentNode;
				if (this._m_select && this._m_select.localName != 'm-select'){
					this._m_select = this._m_select.parentNode;
					if (this._m_select &&  this._m_select.localName != 'm-select'){
						this._m_select = this._m_select.parentNode;	
						if (this._m_select &&  this._m_select.localName != 'm-select'){
							this._m_select = this._m_select.parentNode;	
						}
					}
				}
				
				var _this=this;
				this._EventListener=function(event){
					_this.select(_this._m_select, _this ,event);
				}; 
				this.addEventListener('click',this._EventListener);
			} 
		}
		
		


	};

});
