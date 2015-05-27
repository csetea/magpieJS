require.config({

	paths : {
		log:'magpie/log'
	},

	packages : [ {
		location : 'magpie',
		name : 'magpie'
	}, {
		name : 'magpie/log',
		location : 'magpie/log'
	}, 
	],

	config : {
	},

	callback : function() {
		console.log('magpie config for node successfully loaded ...');
		
	}
	
});
