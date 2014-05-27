define(
		[ 'jquery'//
		, 'magpie/lib/foundation4/js/vendor/custom.modernizr'//
		, 'magpie/lib/foundation4/js/foundation.min'//
		, 'css!magpie/lib/foundation4/css/foundation.css'//
		, 'css!magpie/lib/foundation4/css/normalize.css' ],
		function($) {

			//
			// init foundation ...
			//
			$(document).foundation();

			/*
			 * TODO only include if requerd (eg.: ie8 ...)
			 */
			$('head').append(
					'<script type="text/javascript" src="'
							+ require.toUrl('magpie')
							+ 'lib/respond.min.js"></script>');

			//
			// trick for screen size detection
			//
			$('body')
					.append(
							'<!-- used for screen size detection (foundation) -->\
					<span class="show-for-small"></span>\
					<span class="show-for-medium"></span>\
					<span class="show-for-large"></span>\
					<span class="show-for-xlarge"></span>\
					<span class="show-for-touch"></span>');

			return {};
		});
