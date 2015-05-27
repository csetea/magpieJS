/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
// TODO convert to widget ??? -> html5 customElement instead of the old viewProxy defined view object
define([ 'jquery', 'magpie/log!view/404', 'css!./404.css', 'jqueryPlax'], function($, log) {
	return {

		attached : function() {
			if (!this.elPlax) {
				$('.l404:visible').plaxify();
				$.plax.enable();

			} else {
				$('#c404:visible').replaceWith(this.elPlax);
			}
		},

		dettached : function() {			
			if (!this.elPlax) {
				this.elPlax = $('#c404');
			}
		}
	};

});