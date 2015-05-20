// Startup magpie server 
define([
// magpie and requirejs modules
'log!magpie/server/web', 'magpie/util/config', 'module', 'require' //
// node modules
, 'express', 'serve-static', 'http', 'fs' ], //
function(
// magpie and requirejs modules
log, config, module, r //
// node modules
, express, serveStatic, http, fs) {

	var config = config(module, {
		port : 8080,
		path : '/',
		webContentDir : r.toUrl('magpie') + '/../web'
	});

	//
	// Start up the web server
	//
	if (log.isDebug) {
		log.debug('start Web Server:', config);
	} else {
		log('start Web Server: port', config.port)
	}

	var app = express();
	var server = http.createServer(app)
	server.listen(config.port);

	var baseUrl = r.toUrl('domain').replace(/\/domain/, '');

	//
	// distribute magpie
	//
	app.use('/dist/magpie', serveStatic(baseUrl + '/magpie'));

	app.use('/dist', serveStatic(baseUrl + '/dist'));

	//
	// load domain
	//
	var domainDirUrl = r.toUrl('domain');

	var domains = [];

	function addDomain(sDomain, path) {
		log('addDomain:', sDomain)
		//
		// load server extensions for domain
		//
		var domain = {
			deployDirectory : sDomain,//
			url : '/' + sDomain,//
			packageName : sDomain,//
			hasServerExtensionBundle : false,//
			hasWebBundle : false
		}
		domains.push(domain);

		function startServlet() {
			fs.stat(path + '/server/config.js', function(err, stats) {
				var configExists = stats && stats.isFile();

				//
				// map stack
				//
				define(domain.packageName + '/m_domain', domain);
				var map = {};
				map[domain.packageName] = {
					'm_domain' : domain.packageName + '/m_domain'
				}
				require.config({
					map : map
				});

				fs.stat(path + '/server/main.js', function(err, stats) {
					if (stats && stats.isFile()) {
						domain.hasServerExtensionBundle = true;
						log('load server extension for domain:',
								domain.deployDirectory)
						require.config({
							packages : [ //
							{
								name : domain.packageName,
								main : 'main',
								location : 'domain/' + domain.deployDirectory
										+ '/server'
							} //
							],
							deps : [ configExists ? //
							// FIXME review
							'domain/' + domain.deployDirectory
									+ '/server/config' : domain.packageName ],
							callback : function() {
								if (configExists) {
									require([ domain.packageName ])
								}
							}
						})
					}
					fs.stat(path + '/web', function(err, stats) {
						if (stats && stats.isDirectory()) {
							domain.hasWebBundle = true;
							log('start static server for domain:',
									domain.deployDirectory)
							app.use(domain.url, serveStatic(path + '/web'));
						}
					})

				});

			});
		}

		fs.stat(path + '/deploy.js', function(err, stats) {
			var deployConfigExists = stats && stats.isFile();
			if (deployConfigExists) {
				require([ 'domain/' + domain.deployDirectory + '/deploy' ],
						function(deploy) {
							log('deploy:', deploy)
							for (p in deploy) {
								domain[p] = deploy[p];
							}
							startServlet(domain);
						})
			} else {
				startServlet(domain);
			}
		});

	}

	// REST server console
	app.get('/_domains', function(req, resp, next) {
		resp.send(domains)
		next();
	});

	// start server instances
	fs.readdir(domainDirUrl, function(err, files) {
		files.forEach(function(file) {
			var path = domainDirUrl + '/' + file;
			fs.stat(path, function(err, stats) {
				if (stats && stats.isDirectory()) {
					addDomain(file, path)
				}
			});
		})
	});

	return {
		config : config,
		httpServer : server,
		app : app
	}

});
