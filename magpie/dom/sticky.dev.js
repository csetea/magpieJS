define(
		[ 'log!sticky', 'magpie/dom/inject', 'domReady!', 'css!./sticky' ], //
		function(log, inject) {
			var forEach = Array.prototype.forEach;

			//
			// add sticky bar spacer element
			//
			var stickyTop = document.createElement('div');
			stickyTop.setAttribute("id", "m-ui-sticky-top");
			document.body.insertBefore(stickyTop, document.body.childNodes[0]);
			
			var stickySpacer = document.createElement('div');
			stickySpacer.setAttribute("id", "m-ui-sticky-spacer");
			document.body.insertBefore(stickySpacer, document.body.childNodes[0]);


			//
			// sticky logic goes here
			//
			var lastY = 0;
			function sticky() {
				var y = (document.documentElement && document.documentElement.scrollTop)
						|| document.body.scrollTop;

				forEach.call(document.querySelectorAll('[data-m-ui-sticky]'), function(
						sticky) {

					sticky._offsetBottom = sticky.parentElement.offsetTop
							+ sticky.parentElement.offsetHeight;

					if (y + stickyTop.offsetHeight > sticky.offsetTop) {
						sticky.setAttribute('data-m-ui-sticky','on')
						if (!sticky._clone) {
							sticky._clone = sticky.cloneNode(true);
						}
					}

					if (lastY >= y) {
						if (y + stickyTop.offsetHeight < sticky.offsetTop
								+ sticky.offsetHeight) {
							sticky.setAttribute('data-m-ui-sticky','off')
						}
					}

					if (y + stickyTop.offsetHeight >= sticky._offsetBottom
							- sticky.offsetHeight) {
						sticky.setAttribute('data-m-ui-sticky','off')
					}

				});

				lastY = y;

//				if (stickyBar){
//					while (stickyBar.firstChild) {
//						stickyBar.removeChild(stickyBar.firstChild);
//					}
//				}
//				
				if (stickySpacer){
					while (stickySpacer.firstChild) {
						stickySpacer.removeChild(stickySpacer.firstChild);
					}
				}
//				var spacerHeight=0;
				forEach.call(document.querySelectorAll('[data-m-ui-sticky="on"]'), function(
						stickyon) {
//					// TODO do it without clone
					inject(stickyBar, stickyon._clone, true);
//					spacerHeight+=offsetHeight;
//					inject(stickySpacer, stickyon._clone, true);
					
				});
				
			}

			// first init
			sticky();
			// call at every scroll ...
			window.onscroll = sticky;

		});