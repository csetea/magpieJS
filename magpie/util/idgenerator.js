/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
//TODO doc config ...
define([ 'module' ], function(m) {

	var pattern = m.config().pattern;

	var id = function(patternOrLength) {
		if (!patternOrLength) {
			patternOrLength = pattern ? pattern : 8;
		}
		
		var str;
		if (typeof patternOrLength === "number" ){
			str = new Array(patternOrLength + 1).join('x');
		}else if (typeof patternOrLength === "string" ){
			str= patternOrLength;
		}else{
			// fallback
			return this.id(pattern);
		}
		
		var d = new Date().getTime();
		var id = str.replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
		});
		return id;
	};

	
	var uuid = function() {
		return id('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx');
	};
	
	var guid=uuid;

	var idGenerator = function IdGenerator(patternOrLength) {
		if (!patternOrLength)
			return uuid();
		else
			return id(patternOrLength);
	};
	idGenerator.next=idGenerator.generate = idGenerator;
	idGenerator.id = id;
	idGenerator.uuid = uuid;

	return idGenerator;

});