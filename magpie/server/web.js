// Startup web server
define([ 'log!magpie/server/web', 'magpie/util/config', 'http', 'connect', 'serve-static', 'module' //
, 'require' //
, 'express', 'passport', 'passport-google', 'morgan', 'cookie-parser',
		'body-parser', 'express-session', 'method-override' ], //
function(log, config, http, connect, serveStatic, module, r //
, express, passport, passportGoogle, morgan, cookieParser, bodyParser, session,
		methodOverride) {

	// TODO
	// [ ] load plugin support for multiple web server instance
	// eg.: magpie/server/web!radinsel
	// will be use the configuration of
	// 'magpie/server/web!radinsel' module path
	// [ ] configure auth strategy

	var config = config(module, {
		port : 8080,
		path : '/',
		webContentDir : r.toUrl('magpie') + '/../web'
	});


	// for auth ...
	var GoogleStrategy = passportGoogle.Strategy;
	// Passport session setup.
	// To support persistent login sessions, Passport needs to be able
	// to
	// serialize users into and deserialize users out of the session.
	// Typically,
	// this will be as simple as storing the user ID when serializing,
	// and
	// finding
	// the user by ID when deserializing. However, since this example
	// does not
	// have a database of user records, the complete Google profile is
	// serialized
	// and deserialized.
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});
	// Use the GoogleStrategy within Passport.
	// Strategies in passport require a `validate` function, which
	// accept
	// credentials (in this case, an OpenID identifier and profile), and
	// invoke
	// a
	// callback with a user object.
	passport.use(new GoogleStrategy({
		returnURL : 'http://localhost:' + config.port + '/auth/google/return'
//		realm : 'http://localhost:' + config.port + '/'
//		,realm : 'http://localhost:' + config.port + '/'
	}, function(identifier, profile, done) {
		// asynchronous verification, for effect...
		process.nextTick(function() {

			// To keep the example simple, the user's Google profile is
			// returned
			// to
			// represent the logged-in user. In a typical application,
			// you would
			// want
			// to associate the Google account with a user record in
			// your
			// database,
			// and return that user instead.
			log('google:', identifier, profile)
			profile.identifier = identifier;
			return done(null, profile);
		});
	}));

	//
	// Start up the web server
	//
	if (log.isDebug) {
		log.debug('start Web Server:', config);
	} else {
		log('start Web Server: port', config.port)
	}

	var app = express();
	// set up our express application
	// app.use(morgan('dev')); // log every request to the console
	app.use(cookieParser()); // read cookies (needed for auth)
	app.use(bodyParser()); // get information from html forms
	app.use(methodOverride());

	// required for passport
	app.use(session({
		secret : 'ilovescotchscotchyscotchscotch',
        cookie: {
    		//httpOnly: true //  the cookies are inaccessible by client side javascript.
        	httpOnly: false}
	})); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	// app.use(flash()); // use connect-flash for flash messages stored in
	// session

	// GET /auth/google
	// Use passport.authenticate() as route middleware to authenticate the
	// request. The first step in Google authentication will involve redirecting
	// the user to google.com. After authenticating, Google will redirect the
	// user back to this application at /auth/google/return
	app.get('/auth/google', passport.authenticate('google', {
		failureRedirect : '/login'
	}));

	// GET /auth/google/return
	// Use passport.authenticate() as route middleware to authenticate the
	// request. If authentication fails, the user will be redirected back to the
	// login page. Otherwise, the primary route function function will be
	// called,
	// which, in this example, will redirect the user to the home page.
	app.get('/auth/google/return', passport.authenticate('google', {
		failureRedirect : '/login',
		successRedirect: config.path
	}));



	app.get(config.path+'/logout', function(req, res) {
		req.logout();
		res.redirect('/radinsel');
	});

	// static server
	app.use(config.path, function(req, res, next) {
		if (!req.isAuthenticated()) {
			log.warn('redirect to google auth')
			res.redirect('/auth/google');
		}else{
			next();
		}
	},serveStatic(config.webContentDir));


	var server = http.createServer(app)

	server.listen(config.port);
	return {
		config : config,
		httpServer : server,
		app : app
	};
});
