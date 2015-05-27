/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
// [ ] add unit support to screen size def
// [ ] add board support? 
define([ 'magpie/log!magpie/dom/mediaQueries', 'module', 'magpie/util/config', 'magpie/dom/inject' ], function(log,
		module, config, inject) {
	/*jshint -W004 */ 
	var config = config(module, {
		screens : {
			s : 35.5,
			m : 48,
			l : 64,
			xl : 80,
			xxl : 160
		}
	});

	var screenSizes = config.screens;

	var screens = (function sortScreensBySize() {
		var sizes = [];
		for ( var screen in screenSizes) {
			var size = screenSizes[screen];
			sizes.push({
				name : screen,
				size : size,
			});
		}
		return sizes.sort(function(a, b) {
			return a.size - b.size;
		});
	}());

	for (var i = 0; i < screens.length; i++) {
		var screen = screens[i];
		screen._orderIndex = i;
		screen.smaller = i === 0 ? null : screens[i - 1];
		screen.larger = i + 1 < screens.length ? null : screens[i + 1];

		/*jshint -W083 */
		screen.eachSmaller = function(callback) {
			for (var s = 0; s < screen._orderIndex; s++) {
				callback(screens[s]);
			}
		};
		screen.eachLarger = function(callback) {
			for (var l = screen._orderIndex + 1; l < screens.length; l++) {
				callback(screens[l]);
			}
		};

	}

	var mediaQueries = {};
	mediaQueries.screens = screens;
	mediaQueries.screens.each = function(callbackScreen, callbackSmallerScreen,
			callbackLargerScreen) {
		for (var i = 0; i < screens.length; i++) {
			var screen = screens[i];
			if (callbackSmallerScreen)
				for (var s = 0; s < i; s++) {
					var smallerScreen = screens[s];
					callbackSmallerScreen(screens[s], screen);
				}
			if (callbackLargerScreen)
				for (var l = i + 1; l < screens.length; l++) {
					var largerScreen = screens[l];
					callbackLargerScreen(largerScreen, screen);
				}
			if (callbackScreen)
				callbackScreen(screen);
		}
		postProcess();
	};

	postProcess = function (){
		if (postProcess.css.length > 0) {
			var css = '';
			for ( var i in postProcess.css) {
				css += postProcess.css[i];
			}
			mediaQueries.addCssRule(css);

			postProcess.css = [];
		}
	};
	postProcess.css = [];
	
	mediaQueries.screens.each(function(screen) {
		screen.addCssRule = function(cssRule) {
			mediaQueries.addCssRule(screen.createCssRuleString(cssRule));
		};
		
		screen.createCssRuleString = function(cssRule) {
			var css = '@media only screen ' + //
					  (!screen.smaller ? '{' : 'and (min-width: ' + screen.size + //
				'em){');
			for ( var i in arguments) {
				css += arguments[i];
			}
			css += '}';
			return css;
		};

		
		screen.addCssRuleAfterEach = function(cssRule) {
			var css = '@media only screen ' +
					  (!screen.smaller ? '{' : 'and (min-width: ' + screen.size +
					  'em){');
			for ( var i in arguments) {
				css += arguments[i];
			}
			css += '}';
			postProcess.css.push(css);
		};
	});

	mediaQueries.addCssRule = inject.css;
	return mediaQueries;

});