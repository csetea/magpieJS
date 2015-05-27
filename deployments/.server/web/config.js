require.config({

	paths : {

		magpie: '/magpie',
		knockout: '/lib/knockout/knockout-3.2.0',

	},
	
	
	deps : [ 'magpie/config'],

	callback: function(){
		require([
		         'magpie/html5/customElement!app/s-list',//
		         'less!app/less'
	         ])
	},

	waitSeconds : 5

});