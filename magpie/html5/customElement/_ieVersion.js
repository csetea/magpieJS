/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
define([], function() {

	var ieVersion = (function(){
		if (require.isBrowser){
		  var undef,
		      v = 3,
		      div = document.createElement('div'),
		      all = div.getElementsByTagName('i');
		  while (
		      div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i>< ![endif]-->',
		      all[0]
		  );
		  return v > 4 ? v : undef;
	  }
	  return undefined;
	}());

	return ieVersion;

});
