/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
//TODO doc config
//		template : {
//			preProcessing : function(text, callbackWithTextParamter) {
//				require([ 'resource', 'mark' ], function(r, Mark) {
//					callbackWithTextParamter(Mark.up(text, r))
//				});
//			}
//		},
define([ 'module', 'mapgie/resource/properties', 'mark', 'magpie/log!template' ], function(module, r, Mark, log) {

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
	
	/**
	 * Compiles the template.
	 */
	function compile(templateText) {
		var templates = this.extract(templateText);
		var mainTemplate = '';
		for (var firstTemplate in templates) {
			mainTemplate = templates[firstTemplate];
			break;
		}
		var compiled = Mark.up(mainTemplate, templates);
		return compiled;
	}

	function compileTemplates(templates) {
		var mainTemplate = '';
		for (var firstTemplate in templates) {
			mainTemplate = templates[firstTemplate];
			break;
		}
		var compiled = Mark.up(mainTemplate, templates);
		return compiled;
	}

	var createTemplateFunction = function(template) {
		return function Template(context, options) {
			if (!context) {
				context = {};
			}
			if (!options) {
				options = {};
			}

			return Mark.up(template, context, options);
		};
	};

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
		for (var t in x._templates) {
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
				};

				if (config.preProcessing instanceof Function) {
					config.preProcessing(text, callback);
				} else {
					callback(text);
				}

			});
		}

	};

});
