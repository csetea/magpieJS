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
// m-appearance-select
// m-appearance-no-select
// m-appearance-select-none
// m-appearance=["select"]
// m-appearance=["select-none"]
// m-appearance=["no-select"]
define([ 'magpie/log!magpie/html5/widget/select/m-select',
		'css!./m-select.css' ], //
function(log) {


	var IE = (function () {
	    "use strict";

	    var ret, isTheBrowser,
	        actualVersion,
	        jscriptMap, jscriptVersion;

	    isTheBrowser = false;
	    jscriptMap = {
	        "5.5": "5.5",
	        "5.6": "6",
	        "5.7": "7",
	        "5.8": "8",
	        "9": "9",
	        "10": "10"
	    };
	    jscriptVersion = new Function("/*@cc_on return @_jscript_version; @*/")();

	    if (jscriptVersion !== undefined) {
	        isTheBrowser = true;
	        actualVersion = jscriptMap[jscriptVersion];
	    }

	    ret = {
	        isTheBrowser: isTheBrowser,
	        actualVersion: actualVersion
	    };

	    return ret;
	}());

	var forEach = Array.prototype.forEach;

	var findOptionEl = function(rt){
		if (rt == null){
			return null;
		}else if (rt.localName && rt.localName == 'm-option'){
			return rt;
		}else{
			return findOptionEl(rt.parentNode);
		}
	};


	return {
		tag : 'm-select',

		_openCounter: 0,

		createdCallback : function() {
			var _this=this;
			this._displayEl = document.createElement('div');
			this._displayEl.setAttribute('class','display');
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

			this._adjustWidth = false;
			var mAppearance =this.getAttribute('m-appearance');
			if (mAppearance != "no-select"){
				this._adjustWidth = true;
				var fakeSelectEl = document.createElement('select');
				fakeSelectEl.setAttribute('class','fake-select');
				fakeSelectEl.contentEditable=false;
				this._displayEl.appendChild(fakeSelectEl);

				var fakeSelectOverlayoutEl = document.createElement('div');
				fakeSelectOverlayoutEl.contentEditable=false;
				fakeSelectOverlayoutEl.setAttribute('class','fake-select-overlayout');
				this._displayEl.appendChild(fakeSelectOverlayoutEl);

				fakeSelectEl.onmousedown = function(event){
					event.preventDefault();
				};
			}


			this._displayEl.contentEditable=false;

			this._listEl = document.createElement('div');
			this._listEl.childNodes=this.childNodes;
			this._listEl.setAttribute('class','list');
			this._listEl.contentEditable=true;

			this._listEl.onkeydown = function(event){
				 var target = event.target || event.srcElement;
				 if ( target == _this._listEl){
					 event.preventDefault();
				 }
			};

			this.onblur = function(){
				_this.querySelector('.list-container>.list').blur();
			}

			this._listContainerEl = document.createElement('div');
			this._listContainerEl.setAttribute('class','list-container');
			this._listContainerEl.appendChild(this._listEl);
		},

		close: function(){
			this._listEl.blur();
			this._listEl.style.display="none";
			setTimeout(function(){if (this._listEl){this._listEl.style.display="inherit";}},5);

			this.removeAttribute("opened");
		},

		open: function(){
			var _this=this;
			if (_this._adjustWidth){
				this.style.minWidth=this.offsetWidth+'px';
			}
			if (this._openCounter == 0){
				[].forEach.call(this._listEl.childNodes, function(child){
					if (child instanceof HTMLElement){
						if (child != _this._FirefFoxContentEditableFixTrap){
							if (child.contentEditable !== true){
								child.contentEditable=false;

								//FIXME on by FireFox browser
								var _FirefFoxContentEditableFix = document.createElement('div');
								_FirefFoxContentEditableFix.setAttribute('class','moz-FF-cE-fix');
								_FirefFoxContentEditableFix.contentEditable=true;
								child.appendChild(_FirefFoxContentEditableFix);
							}
						}
					}
				});
			}

			this.openCounter++;
			this._listEl.style.display="inherit";
			this.setAttribute("opened","true");
			this._listEl.focus();
		},

		update: function(){
			var selection = this.selection();
			var selectionLength= selection.length;
			//FIX width on update ??
//			this.style.width='';

			var selectionChangedEvent = new CustomEvent('change');
 			this.dispatchEvent(selectionChangedEvent);

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
				log.warn('fire ',stateObject, ' to close')
				this.close();
			}


		},

		attachedCallback: function(){
			var _this=this;
			if (this.getAttribute("inited") != "true"){
				while (this.firstChild) {
					var child= this.removeChild(this.firstChild);
					if (child.hasAttribute && child.hasAttribute('placeholder')){
						_this._displayEl.replaceChild( child, _this._placeholderEl);
					}else if (child.hasAttribute && child.hasAttribute('result')){
						_this._displayEl.replaceChild( child, _this._displayResultEl);
					}else {
						// TODO XXX
						_this._listEl.appendChild(child);
					}

				}

				this._resultTemplatePresent = this._displayResultEl.querySelector('*');

				this.appendChild(_this._displayEl);
				this.appendChild(_this._listContainerEl);
				this.setAttribute("inited","true")
			}

			this._displayEl = this.querySelector('.display');
			this._displayEl.onclick = function(event){
				if (_this._openStateOnMousedown){
					if (_this._adjustWidth){
						_this.style.minWidth='';
					}
					if(event){
						event.stopImmediatePropagation();
					}
					_this.close();
				}else{
					//FIX width on open
					if (_this._adjustWidth){
						_this.style.minWidth=_this.offsetWidth+'px';
					}
					// open
					_this.open();
				}
			};

			this._displayEl.onmousedown = function(event){
				_this._sourceOptionEl=null;
				_this._openStateOnMousedown = _this.hasAttribute("opened");
			}

			this._listEl = _this.querySelector('.list-container>.list');
			this._listEl.onmousedown=function(event){
			var relatedTarget = event.target || event.srcElement;
				_this._sourceOptionEl = findOptionEl(relatedTarget);
			}

			this._listEl.onblur=function(event){
			var mOptionEl = _this._sourceOptionEl;
			if (mOptionEl && mOptionEl.hasAttribute('prevent')){
				setTimeout(function(){
					var focusedEl = _this.querySelector(':focus')
					if (!focusedEl){
						_this.close();
					}else{
						focusedEl.addEventListener('blur', function(event2){
							setTimeout(function(){
								if (!_this.querySelector(':focus')){
									_this.close();
								}
							},50)

						});
					}
				},50)
			}else{
				if (IE.isTheBrowser){
					setTimeout(function(){
						_this.close();
					},300)
				}else{
					_this.close();
				}
			}
			};


			this.update();
		},

		selection: function(){
			var selection=[];

			var childs = this.querySelectorAll('m-option[selected]');
			forEach.call(childs, function( el ){
					selection.push(el);
			});

			if (selection.length === 0){
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
