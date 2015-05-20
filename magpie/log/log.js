//require.config({
//	config:{
//		'log/log' : {
//			'log' : {
//				level : 'info'
//			},
//		}
//	}
//
//});

/***
 * @doc log.md
 * @license MIT 
 */
	
//TODO in resolveLogConfigValue function on fallback try create parent logger
// todo fallback config path to pakets locations ...
// first (if not root) to right config value initialization
//TODO made logEvent object extensiable e.g.
// use of https://github.com/stacktracejs/stacktrace.js/tree/stable
// insted own caller line resolution? - but that can be done with filters too :)
define( ['module', 'require' ],
		function(module, require) {
	
	// string.trim() polyfill
	if(typeof String.prototype.trim !== 'function') {
		  String.prototype.trim = function() {
		    return this.replace(/^\s+|\s+$/g, ''); 
		  };
		}
	
			var requireConfig = undefined;
			
			
			//
			// Configurations
			//
			var defaultConfig = {
				 'log' : {
					 level : 'error'
				 },
					 
				root : {
					level: 'info'
				}
			}

			var config = module.config();
			for (p in defaultConfig) {
				if (!config[p]) {
					config[p] = defaultConfig[p];
				}
			}

			var LoggerLevel = {
				TRACE : 'TRACE',
				DEBUG : 'DEBUG',
				INFO : 'INFO',
				WARN : 'WARN',
				ERROR : 'ERROR',
				FATAL : 'FATAL'
			};
			LoggerLevel.levelRank = [ LoggerLevel.TRACE, LoggerLevel.DEBUG,
					LoggerLevel.INFO, LoggerLevel.WARN, LoggerLevel.ERROR,
					LoggerLevel.FATAL ];

			var resolveLogConfigValue = function(logName, property, defaultValue) {
				var logPrefix= 'resolve '+property+' for '+logName;
				configLog.trace(logPrefix);
				var configSection = config[logName];
				if (!configSection || !configSection.hasOwnProperty(property)) {
					var fallbackLogName = logName;
					var fallbackToPath=true;
					while (true) {
						if (configSection && configSection.hasOwnProperty(property)) {
							return configSection[property];
						}
						if (fallbackLogName && fallbackLogName.lastIndexOf('/') > 0) {
							fallbackLogName = fallbackLogName.replace(/\/[^\/]*$/, '');
							configLog.trace(logPrefix,'try fallback to',fallbackLogName);
							configSection = config[fallbackLogName];
						} else if (fallbackToPath){
							fallbackToPath = false;
							// as alternative probe resolve config based on path
							if (requireConfig && requireConfig.paths) {
								fallbackLogName = requireConfig.paths[fallbackLogName];
								configSection = config[fallbackLogName];
								if (fallbackLogName)
									configLog.trace(logPrefix,'try fallback to path',fallbackLogName);
							}
						}else if (rootLog && rootLog[property]){
							configLog.trace(logPrefix,'fallback to root');
							return  rootLog[property];
						}else{
							configLog.trace(logPrefix,'fallback to default value');
							return defaultValue;
						}
					}
				}
				return configSection[property];
			}
			
			var resolveLogConfig = function(log, property, defaultValue) {
				log[property]= resolveLogConfigValue(log.logName, property, defaultValue);
				configLog.debug('resolved '+property+' for '+log.logName + ' value:', log[property]);
				return log[property];
			}
			
			//
			// helper functions [[
			//
			var setPropertyCallback = function(log, configProperty, propertyInsideConfigObject, configObject, defaultConfigObject) {
				if (configObject instanceof Function) {
					log[configProperty]={};
					log[configProperty][propertyInsideConfigObject]=configObject;
				}else if (configObject && configObject[propertyInsideConfigObject] instanceof Function){
					log[configProperty]=configObject;
				}else{
					if (configProperty in rootLog && log.logName != rootLog.logName){
						configLog.warn('fallback to root logger '+configProperty+' configuration for '+log.logName+' logger because resolved config object is not a function or not an object with function: '+propertyInsideConfigObject);
						log[configProperty]=rootLog[configProperty];
					}else if (defaultConfigObject){
						configLog.warn('fallback default '+configProperty+' configuration for '+log.logName+' logger because resolved config object is not a function or not an object with function: '+propertyInsideConfigObject+' the default is: ',defaultConfigObject);
						log[configProperty]=defaultConfigObject;
					}else{
						configLog.warn('ignore '+configProperty+' configuration for '+log.logName+' logger because because resolved config object is not a function or not an object with function: : '+propertyInsideConfigObject);
					}
				}
			};
			
			var setPropertyFn = function(log, configProperty, propertyInsideConfigObject, configObject, defaultConfigObject) {
				if (typeof configObject === 'string') {
					require([ configObject ],function(xconfigObject){
						setPropertyCallback(log, configProperty, propertyInsideConfigObject, xconfigObject, defaultConfigObject);
					}
					, function(err){
						configLog.error('Cannot resolve '+configProperty+' module:',configObject, '-try fallback');
						setPropertyCallback(log, configProperty, propertyInsideConfigObject, undefined, defaultConfigObject);
					});
				} else {
					setPropertyCallback(log, configProperty, propertyInsideConfigObject, configObject, defaultConfigObject);
				}
			}
			// ]] helper functions


			var initLog = function(log, onload) {
				require(
						[ './defaultConsoleLogger' ],
						function(defaultConsoleLogger) {
							//
							// resolve log resolveCallerLine
							//
							var resolveCallerLine = resolveLogConfig(log, 'resolveCallerLine',
									true);
							
							//
							// resolve log filter
							//
							var filter = resolveLogConfig(log,
									'filter');
							setPropertyFn(log, 'filter', 'filter', filter);
						

							//
							// resolve log logger
							//
							var logger = resolveLogConfig(log,
									'logger', defaultConsoleLogger, setPropertyCallback);
							
							setPropertyFn(log, 'logger', 'log', logger, defaultConsoleLogger);
							

							//
							// resolve log level
							//
							var level = resolveLogConfig(log, 'level',
									LoggerLevel.INFO);
							
							if (level) {
								if (level instanceof Array) {
									// threshold only specified levels 
									for (var il = 0; il < level.length; il++) {
										if (typeof level[il] === 'string') {
											level[il] = level[il].toUpperCase();
											for (var i = 0; i < LoggerLevel.levelRank.length; i++) {
												var l = LoggerLevel.levelRank[i];
												log['is'
														+ l.charAt(0)
														+ l.substr(1)
																.toLowerCase()] = l == level[il];
											}
										}
									}
								} else if (typeof level === 'string') {
									// threshold specified level and up 
									level = level.toUpperCase();
									var found = false;
									for (var i = 0; i < LoggerLevel.levelRank.length; i++) {
										var l = LoggerLevel.levelRank[i];
										log['is' + l.charAt(0)
												+ l.substr(1).toLowerCase()] = found ? true //
												: found = l == level;
									}
								}
							}
							
							if (onload)
								onload(log);

						});
			};
			
			
			var fireLogEvent = function FireLogEvent(logMixin, level, logEntries, timeStamp) {
				var logEvent = {
					timeStamp : timeStamp,
					level : level,
					logName : logMixin.logName,
					logEntries : logEntries,
					callerLine: 
						logMixin.resolveCallerLine ?
								(new Error().stack ?
									new Error().stack.replace(/[\s\S]*FireLogEvent([^\n]+\n){2}/,'').replace(/\n.*/g,'').replace(/.*\s(\()?/,'').replace(/\)$/,'')
//									:'unsupported "new Error().stack" caller line can not be resolved')
									: undefined)
//								new Error().stack.replace(/[\s\S]*FireLogEvent([^\n]+\n){2}/,'').replace(/\n.*/g,'').replace(/.*\s(\()?/,'').replace(/\)$/,'') //
//								new Error().stack.replace(/[\s\S]*\/log\.js.*\n/,'').replace(/\n[\s\S]*/,'').replace(/[\s\S]*http/,'http');
								: undefined,
					preventLogging: false
//					asdfhellothisiscodexDmeow:3
				}
				//
				// execute filter
				//
				var preventLogging=false;
				if (logMixin.filter){
					preventLogging = false == logMixin.filter.filter(logEvent);
				}
				
				//
				// call log if loggin is not prevent
				//
				if (!(preventLogging || logEvent.preventLogging == true)){
					if (logMixin.logger.log){
						logMixin.logger.log(logEvent);
					}else{
						// TODO on unresolved default logger ...
						console.warn('prevent logging of logEvent',logEvent)
					}
				}
			};

			function createLogMixin(logName, logger, onload) {
				var log = function LogMixin() {
					if (log.isInfo)
						fireLogEvent(log, LoggerLevel.INFO, arguments,
								new Date());
				};
				log.i = log.info = log;
				log.t = log.trace = function() {
					if (log.isTrace)
						fireLogEvent(log, LoggerLevel.TRACE, arguments,
								new Date());
				};
				log.d = log.debug = function() {
					if (log.isDebug)
						fireLogEvent(log, LoggerLevel.DEBUG, arguments,
								new Date());
				};
				log.w = log.warn = function() {
					if (log.isWarn)
						fireLogEvent(log, LoggerLevel.WARN, arguments,
								new Date());
				};
				log.e = log.error = function() {
					if (log.isError)
						fireLogEvent(log, LoggerLevel.ERROR, arguments,
								new Date());
				};
				log.f = log.fatal = function() {
					if (log.isFatal)
						fireLogEvent(log, LoggerLevel.FATAL, arguments,
								new Date());
				};

				log.logger = logger;

				log.logName = logName;

				initLog(log, onload);

				return log;
			}

			var rootLog = createLogMixin('root');
			var configLog = createLogMixin('log');
			
			
			//
			// apply as loader plugin
			//
			rootLog.load = function(logName, parentRequire, onload, config) {

				requireConfig = config;
				var log, logger;
				logName = logName.trim();
				if (logName) {
					createLogMixin(logName, logger, onload);
				} else {
					log = rootLog;
					onload(log);
				}
				
			};
			rootLog.version= '1.0';
			rootLog.LoggerLevel=LoggerLevel;
			
			return rootLog;
		});