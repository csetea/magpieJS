window.less = { relativeUrls: true }
require.config({

	paths : {

		domReady : '/lib/require/domReady',
		text : '/lib/require/text',
		css : '/lib/require/require-css/css',
		less : 'magpie/dom/less',

		knockout: '/lib/knockout/knockout-3.2.0',
		lessjs: '/lib/less/less.2.3.1.min',

	},
	
	
	deps : [ 'magpie/config'],

	callback: function(){
		require([
		         'magpie/html5/customElement!app/s-list',//
		         'less!app/less'
	         ])
	},

	waitSeconds : 1

});