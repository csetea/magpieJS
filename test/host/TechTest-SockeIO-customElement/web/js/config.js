require.config({

	paths : {

		customElement: 'magpie/view/customElement',
		polyfillWebComponentsBaseDir: '/dist/polymer/webcomponentsjs-0.5.1-1',

		// libs
		lib : 'lib',
		text : 'lib/require/text',
		domReady : 'lib/require/domReady',
		css : 'lib/require/require-css/css',
		
		
		jquery: 'https://code.jquery.com/jquery-1.10.2.min',
		socketio: 'lib/socket.io/socket.io-1.2.1'
	
	},
	
	packages : [ {
		name : 'magpie'
	}, {
		name : 'log',
		location : 'magpie/log',
		main : 'log'
	}
	],

	
	callback: require(['magpie/view/customElement!app/t-socktio-demo-chat']),

	waitSeconds : 15
	
	
});