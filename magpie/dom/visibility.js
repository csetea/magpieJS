/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
define([ 'magpie/log!visibility', 'magpie/dom/mediaQueries' ], function(log, mediaQueries) {

	var prefix='.m-';
	mediaQueries.screens.each(function(screen) {
		var visibleList=[];
		var hiddenList=[];

		visibleList.push(prefix+'show-for-'+screen.name);
		visibleList.push(prefix+'show-for-'+screen.name+'-and-up');
		visibleList.push(prefix+'show-for-'+screen.name+'-and-down');

		hiddenList.push(prefix+'hide-for-'+screen.name);
		hiddenList.push(prefix+'hide-for-'+screen.name+'-and-up');
		hiddenList.push(prefix+'hide-for-'+screen.name+'-and-down');
		
		screen.eachSmaller(function(smallerScreen){
			visibleList.push(prefix+'show-for-'+smallerScreen.name+'-and-up');
			visibleList.push(prefix+'hide-for-'+smallerScreen.name);
			visibleList.push(prefix+'hide-for-'+smallerScreen.name+'-and-down');
			hiddenList.push(prefix+'hide-for-'+smallerScreen.name+'-and-up');
			hiddenList.push(prefix+'show-for-'+smallerScreen.name);
			hiddenList.push(prefix+'show-for-'+smallerScreen.name+'-and-down');
		});
		screen.eachLarger(function(largerScreen){
			visibleList.push(prefix+'show-for-'+largerScreen.name+'-and-down');
			visibleList.push(prefix+'hide-for-'+largerScreen.name);
			visibleList.push(prefix+'hide-for-'+largerScreen.name+'-and-up');
			hiddenList.push(prefix+'hide-for-'+largerScreen.name+'-and-down');
			hiddenList.push(prefix+'show-for-'+largerScreen.name);
			hiddenList.push(prefix+'show-for-'+largerScreen.name+'-and-up');
		});

		
		screen.addCssRuleAfterEach(//
				'/* Visibility Classes */',
				visibleList+'{display: inherit !important;}',//
				hiddenList+'{display: none !important;}');		
	});
	
});