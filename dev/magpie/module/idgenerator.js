/**
 * Magpie IdGenerator
 * 
 * https://github.com/csetea/magpiejs
 * 
 * Version: 0.1
 * 
 * The MIT License (MIT) Copyright (c) 2014 Andras Csete
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
		return id('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
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
