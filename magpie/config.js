// var _magpieRootUrl = require.toUrl('magpie').replace(/\?.*$/,'');
// var _magpieRootUrl = require.toUrl('magpie').replace(/\?.*$/,'').replace('/magpie','');

// var _magpieRootUrl = "./magpie";
var _magpieRootUrl = "./";
console.log('_magpieRootUrl',_magpieRootUrl)
require.config({

	// path:{
	// 	magpie: '../'
	// },

	packages : [
		{
			name : 'magpie',
			location : "magpie",
			main : 'main'
		},
		{
			name : 'magpie/log',
			location : 'magpie/log',
		}, {
			name : 'magpie/dom/grid',
			location : 'magpie/dom/grid',
			main : 'dom-grid'
		}, {
			name : 'magpie/html5/widget/grid',
			location : 'magpie/html5/widget/grid',
			main : 'main'
		}, {
			name : 'magpie/html5/widget/select',
			location : 'magpie/html5/widget/select',
			main : 'main'
		}, {
			name : 'magpie/resource/properties',
			location : 'magpie/resource/properties',
			main : 'main'
		}, {
			name : 'magpie/html5/customElement',
			location :  'magpie/html5/customElement',
			main : 'main'
		},{
			name : 'magpie/extend/knockout',
			location :  'magpie/extend/knockout',
			main : 'main'
		}
	]


});
