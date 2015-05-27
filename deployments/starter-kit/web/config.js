require.config({

	paths : {

		magpie: '/magpie',

		
	},
	
	
	deps : [ 'config.log','magpie/config'],
	
	callback: require(['app/config']),

	waitSeconds : 15
	
	
});