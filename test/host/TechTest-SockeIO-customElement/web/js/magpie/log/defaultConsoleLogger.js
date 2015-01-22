/***
 * @doc defaultConsoleLogger.md
 * @license MIT 
 */
define([], function( ) {

	return new function DefaultConsoleLogger() {

		this.version = '1.0';
		this.log = function(logEvent) {

			var level = logEvent.level;
			var date = logEvent.timeStamp.toJSON().substring(11, 19 + 4);
			var logFn = console.log;
			switch (level) {
			case 'TRACE':
				logFn = console.debug ? 'debug': (console.log? 'log':console.info);
				break;
			case 'DEBUG':
				logFn = console.debug ? 'debug': (console.log? 'log':console.info);
				break;
			case 'WARN':
				logFn = 'warn';
				break;
			case 'ERROR':
				logFn = 'error';
				break;
			case 'FATAL':
				logFn = 'error';
				break;
			default:
				logFn = 'info';
			}

			var messages = logEvent.logEntries;

			// @opt {hash: 'prod'}
			// for readability and small size

			var loggerObject = 'console';
			var evalConsoleLog = loggerObject
					+ "[logFn](date, level, logEvent.logName, '-'"
			for (var i = 0; i < messages.length; i++) {
				evalConsoleLog += ', messages[' + i + ']';
			}
			evalConsoleLog += " , '-', logEvent.callerLine);";
			eval(evalConsoleLog);

			// Why is using the JavaScript eval function a bad idea?
			// 1 Improper use of eval opens up code for injection
			// attacks
			//
			// 2. Debugging can be more challenging (no line numbers,
			// etc.)
			//
			// 3. eval'd code executes more slowly (no opportunity to
			// compile/cache eval'd code)
			//
			// -> 1. and 2 criteria is not in scope at this point.
			// 3. can not be cashed ... no optimal perfromance
			// @opt {hash: 'prod'}

		};
	}();
});