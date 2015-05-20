// @deprecated
define([ 'log!magpie/server/ws', 'module',
		'require', 'ws' ], function(log, module, r, WebSocket) {
	//
	// Configurations
	//
	var defaultConfig = {
		port : 8080,
		path : '/'
	}

	var config = module.config();
	for (p in defaultConfig) {
		if (!config[p]) {
			config[p] = defaultConfig[p];
		}
	}

	//
	// Start up the web socket
	//
	if (log.isDebug) {
		log.debug('start WebSoceket:', config);
	} else {
		log('start WebSoceket: port', config.port)
	}
	//TODO
//	connect().use(config.path, serveStatic(config.webContentDir)).listen(
//			config.port);
});
