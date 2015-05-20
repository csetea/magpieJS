require.config({

	paths : {

		// shortening the path of magpie modules
		idgenerator : 'magpie/idgenerator',
		
			
	},

	packages : [ {
		location : 'magpie',
		name : 'magpie'
	}, {
		name : 'log',
		location : 'magpie/log',
		main : 'log'
	}, 
	],

	config : {

		idgenerator : {
		// pattern: 'xxxxx'
		}

		

	},

	callback : function() {
		console.log('magpie config for node successfully loaded ...');
		
	}
	
});
