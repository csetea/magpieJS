define([], function() {

	return function config(module, defaultConfig) {
		var config = module.config();
		for (p in defaultConfig) {
			if (!config[p]) {
				config[p] = defaultConfig[p];
			}
		}
		
		return config;
	}
})