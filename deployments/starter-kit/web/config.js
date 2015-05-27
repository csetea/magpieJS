require.config({

	paths : {

		magpie: '/magpie',

		
		text : '/lib/require/text',
		domReady : '/lib/require/domReady',
		css : '/lib/require/require-css/css',
		less : '/magpie/dom/less',
		
		
		knockout : "/lib/knockout/knockout-3.2.0",
		'knockout-mapping' : "/lib/knockout/knockout.mapping-latest",
		angular : "/lib/angular/angular.min",

		// libs
		lib : 'lib',
		
	},
	
	
	deps : [ 'config.log','magpie/config'],
	
	callback: require(['app/config']),

	waitSeconds : 15
	
	
});