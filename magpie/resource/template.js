/**
 * Magpie Template - template loading
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
define([ 'module', 'resource', 'mark', 'log!template' ], function(module, r,
		Mark, log) {

	var config = module.config();

	/**
	 * Extract the templates from the template data
	 */
	function extract(templateText) {
		var templates = {};
		/**
		 * @review Other Browser .splice(1) IE .splice(1, deleteCount) or
		 *         .slice(1);
		 * 
		 */
		templateText = Mark.up(templateText, r);
		var chunks = templateText.split("=====").splice(1, 999);

		if (chunks.length > 0) {
			var i, key;
			chunks.forEach(function(chunk) {
				i = chunk.indexOf("\n");
				key = chunk.substr(0, i).trim();
				templates[key] = chunk.substr(i).trim();
				// templates[key]=Mark.up(chunk.substr(i).trim(),r);
			});
		} else {
			templates[0] = templateText;
		}
		return templates;
	}
	;

	/**
	 * Compiles the template.
	 */
	function compile(templateText) {
		var templates = this.extract(templateText);
		var mainTemplate = '';
		for (firstTemplate in templates) {
			mainTemplate = templates[firstTemplate];
			break;
		}
		var compiled = Mark.up(mainTemplate, templates);
		return compiled;
	}

	function compileTemplates(templates) {
		var mainTemplate = '';
		for (firstTemplate in templates) {
			mainTemplate = templates[firstTemplate];
			break;
		}
		var compiled = Mark.up(mainTemplate, templates);
		return compiled;
	}

	var createTemplateFunction = function(template) {
		return function Template(context, options) {
			if (!context) {
				context = {}
			}
			if (!options) {
				options = {}
			}

			return Mark.up(template, context, options);
		}
	}

	/** Create template mixin */
	var createTemplateMixin = function(text) {
		var x = {};
		x._text = text;
		x._templates = extract(text);
		x._main = compileTemplates(x._templates);

		var template = createTemplateFunction(x._main);
		template._main = x._main;
		template._templates = x._templates;

		// create template function for each template
		for (t in x._templates) {
			template[t] = createTemplateFunction(x._templates[t]);
		}

		return template;
	};

	return {
		// Exports
		extract : extract,
		compile : compile,

		load : function(param, parentRequire, onload, pconfig, parentModule) {

			require([ 'text!' + param ], function(text) {
				var callback = function(ctext) {
					onload(createTemplateMixin(ctext));
				}

				if (config.preProcessing instanceof Function) {
					config.preProcessing(text, callback);
				} else {
					callback(text);
				}

			});
		}

	};

});
