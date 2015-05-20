require.config({

	paths : {

		magpie : 'magpie',

		// shortening the path of magpie modules
		resource : 'magpie/resource',
		template : 'magpie/template',
		idgenerator : 'magpie/idgenerator',

		examples : 'magpie-examples',

		viewProxy : 'magpie/view/viewProxy',
		customElement : 'magpie/view/customElement',

		polyfillWebComponentsBaseDir : 'lib/polymer/webcomponentsjs-0.5.1-1',

	},

	packages : [ {
		location : 'magpie',
		name : 'magpie'
	}, {
		name : 'log',
		location : 'magpie/log',
		main : 'log'
	}, {
		name : 'magpie/view/grid',
		location : 'magpie/view/grid',
		main : 'main'
	}
	],


	deps : [ 'magpie/config.log' ]

});