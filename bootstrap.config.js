require.config({
	
	paths : {
		magpie: 'magpie',
		text : 'lib/require/text',
		domReady : 'lib/require/domReady',
		css : 'lib/require/require-css/css',
		less : 'lib/require/require-less/less',
		knockout : "lib/knockout/knockout-3.2.0.debug",
		sipjs: "lib/sip-0.6.4.bugfix.ancs.audiocodecs.sbc"
	},
	
	map : {
		'less' : {
			lessc : 'js/lib/require/require-less/lessc.js',
			normalize : 'js/lib/require/require-less/normalize.js'
		},
	},
	
	packages: [
	           {
	               name: 'teles/webphone',
	               location: 'teles/webphone',
	               main: 'webphone'
	           }
	],

	
	callback: require(['magpie/config','../config','../config.log'],function(){
		require(['app/config'])
	}),

	waitSeconds : 15
	
	
});
