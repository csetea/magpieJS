/**
 * Magpie Logging module
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
define(function() {

	loggers = {};

	function createLogFunction(parentModul, logger) {
		this.level = 'INFO';

		var xlog = function(level) {
			if (logger) {
				// TODO wrap logger from logger provider from modul config ...
				logger.info.apply(logger, arguments);
			} else {
				var date = new Date().toJSON().substring(11, 19+4);
				if (parentModul) {
					var arguments = arguments[1];
					var logFn=console.log;
					 switch(level) {
					 case 'TRACE':
						 logFn='debug';
					     break;
					 case 'DEBUG':
						 logFn='debug';
					     break;
					 case 'WARN':
						 logFn='warn';
					     break;
					 case 'ERROR':
						 logFn='error';
					     break;
					 case 'FATAL':
						 logFn='error';
					     break;
					 default:
						 logFn='info';
					 } 
					
					switch (arguments.length) {
					case 0:
						console[logFn](date, level, parentModul);
						break;
					case 1:
						console[logFn](date, level, parentModul, '-',
										arguments[0]);
						break;
					case 2:
						console[logFn](date, level, parentModul, '-',
								arguments[0], arguments[1]);
						break;
					case 3:
						console[logFn](date, level, parentModul, '-',
								arguments[0], arguments[1], arguments[2]);
						break;
					case 4:
						console[logFn](date, level, parentModul, '-',
								arguments[0], arguments[1], arguments[2],
								arguments[3]);
						break;
					case 5:
						console[logFn](date, level, parentModul, '-', '-',
								arguments[0], arguments[1], arguments[2],
								arguments[3], arguments[4]);
						break;
					case 6:
						console[logFn](date, level, parentModul, '-',
								arguments[0], arguments[1], arguments[2],
								arguments[3], arguments[4], arguments[5]);
						break;
					case 7:
						console[logFn](date, level, parentModul, '-',
								arguments[0], arguments[1], arguments[2],
								arguments[3], arguments[4], arguments[5],
								arguments[6]);
						break;
					case 8:
						console[logFn](date, level, parentModul, '-',
								arguments[0], arguments[1], arguments[2],
								arguments[3], arguments[4], arguments[5],
								arguments[6], arguments[7]);
						break;
					default:
						console.log(date, level, parentModul, '-', arguments);
					}

				} else {
					console.log(arguments);
				}
			}
		};
		var log = function() {
			xlog('INFO', arguments)
		};

		log.logger = logger;

		log.info = log;

		log.t = log.trace = function() {
			xlog('TRACE', arguments)
		};
		log.d = log.debug = function() {
			xlog('DEBUG', arguments)
		};
		log.w = log.warn = function() {
			xlog('WARN', arguments)
		};
		log.e = log.error = function() {
			xlog('ERROR', arguments)
		};
		log.f = log.fatal = function() {
			xlog('FATAL', arguments)
		};

		return log;
	}

	var mainLog = createLogFunction('#root', null);

	mainLog.load = function(loggerName, parentRequire, onload, config,
			parentModul) {
		var log, logger;
		if (typeof loggerName === 'string' && loggerName != ''
				&& loggerName != '#root') {
			log = createLogFunction(loggerName, logger);
		} else {
			log = parentModul ? createLogFunction(parentModul, logger)
					: mainLog
		}

		onload(log);
	};

	return mainLog;
});