//
			// TODO out source in a utility module, check: 
// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
// use it to polifill ...
// http://caniuse.com/#feat=classlist
// https://www.google.hu/webhp?sourceid=chrome-instant&ion=1&espv=2&es_th=1&ie=UTF-8#q=polyfill+classList&spell=1
// https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills
			//

			Element.prototype.hasClass = function(className) {
				return new RegExp(' ' + className + ' ').test(' '
						+ this.className + ' ');
			};

			Element.prototype.addClass = function(className) {
				if (!this.hasClass(className)) {
					this.className += ' ' + className;
				}
				return this;
			};

			Element.prototype.removeClass = function(className) {
				var newClass = ' ' + this.className.replace(/[\t\r\n]/g, ' ')
						+ ' ';
				if (this.hasClass(className)) {
					while (newClass.indexOf(' ' + className + ' ') >= 0) {
						newClass = newClass.replace(' ' + className + ' ', ' ');
					}
					this.className = newClass.replace(/^\s+|\s+$/g, ' ');
				}
				return this;
			};

			Element.prototype.toggleClass = function(className) {
				var newClass = ' ' + this.className.replace(/[\t\r\n]/g, " ")
						+ ' ';
				if (this.hasClass(className)) {
					while (newClass.indexOf(" " + className + " ") >= 0) {
						newClass = newClass.replace(" " + className + " ", " ");
					}
					this.className = newClass.replace(/^\s+|\s+$/g, ' ');
				} else {
					this.className += ' ' + className;
				}
				return this;
			};
