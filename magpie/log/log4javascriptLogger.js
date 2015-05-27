/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
//TODO use the original logEventconfig 
define(
		[ 'module', 'log4javascript' ],
		function(module, log4javascript) {

			var config = module.config();

			var defaultAppender = new log4javascript.BrowserConsoleAppender();
			var defaultLayout = new log4javascript.PatternLayout(
					"%d{HH:mm:ss:SSS} %c %-5p - %m%n");
			defaultAppender.setLayout(defaultLayout);

			var loggerFactory = function(logName) {
				var logger = log4javascript.getLogger(logName);
				logger.setLevel(log4javascript.Level.ALL);
				logger.addAppender(defaultAppender);

				if (config.setupLogger) {
					if (config.setupLogger instanceof Function) {
						config.setupLogger(logName, logger, log4javascript,
								defaultLayout);
					} else {
						console
								.error('\'setupLogger\' configuration option for module must be function with parameters: logName, logger, log4javascript, defaultLayout');
					}
				}
				return logger;
			};

			/*jshint supernew: true */
			var loggerRepository = new function Log4javascriptLoggerRepository() {
			}();
			var getLog4jsLogger = function(logName) {
				if (!loggerRepository[logName]) {
					loggerRepository[logName] = loggerFactory(logName);
				}
				return loggerRepository[logName];
			};

			/*jshint supernew: true */
			return new function Log4javascriptLoggerAdapter() {
				this.version = '1.0';
				this.log = function(logEvent) {

					var level = logEvent.level;
					var date = logEvent.timeStamp.toJSON()
							.substring(11, 19 + 4);
					var logFn = console.log;
					switch (level) {
					case 'TRACE':
						logFn = 'trace';
						break;
					case 'DEBUG':
						logFn = 'debug';
						break;
					case 'WARN':
						logFn = 'warn';
						break;
					case 'ERROR':
						logFn = 'error';
						break;
					case 'FATAL':
						logFn = 'fatal';
						break;
					default:
						logFn = 'info';
					}

					var messages = logEvent.logEntries;

					var loggerObject = 'getLog4jsLogger("' + logEvent.logName + '")';
					var evalConsoleLog = loggerObject + "[logFn](";
					for (var i = 0; i < messages.length; i++) {
						evalConsoleLog += ((i > 0) ? ',' : '');
						var isString = typeof messages[i] == 'string';
						if (isString) {
							evalConsoleLog += ' messages[' + i + ']';
						} else {
							evalConsoleLog += 'JSON.stringify( messages[' + i + '])';
						}
					}
					
					if (logEvent.callerLine) {
						evalConsoleLog += " , '-', logEvent.callerLine);";
					}
					
					/*jshint evil: true */
					eval(evalConsoleLog);

				};
			}();
		});