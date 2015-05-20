/**
 * @license MIT 
 */
// extends less.js with loader plugin support 
define([ 'lessjs', 'magpie/view/inject' ], function(less, inject) {
	if (!less.load) {
		less.load = function(lessFilePath, parentRequire, onload, config) {
			var fileUrl = config.baseUrl + lessFilePath;
			less.render('@import (multiple) "' + fileUrl + '";').then(
					function(output) {
						inject.css(output.css)
						onload();
					})
		}
	}
	return less;
})
