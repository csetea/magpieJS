//TODO convert to customElement or not?
define(
		[ 'log!sticky', 'magpie/dom/inject', 'domReady!', 'css!./sticky' ], //
		function(log, inject) {
			var forEach = Array.prototype.forEach;

			var stickyBar = document.createElement('selection');
			stickyBar.setAttribute("id", "stickyBar");
			document.body.insertBefore(stickyBar, document.body.childNodes[0]);
			
			var stickySpacer = document.createElement('selection');
			stickySpacer.setAttribute("id", "m-ui-sticky-spacer");
			document.body.insertBefore(stickySpacer, document.body.childNodes[0]);

			
			function sticky() {
				var y = (document.documentElement && document.documentElement.scrollTop)
						|| document.body.scrollTop;

				
				forEach.call(document.querySelectorAll('[data-m-ui-sticky="on"]'), function(
						sticky) {
					var parent = sticky.parentElement;
					if (y < sticky._clone.offsetTop || //
							y> parent.offsetTop + parent.offsetHeight  - sticky.offsetTop - sticky.offsetHeight //
							){
						sticky.setAttribute('data-m-ui-sticky','off')
						if (sticky._clone && sticky._clone.parentElement){
							sticky.parentElement.removeChild(sticky._clone)
						}	
						sticky.style.top='';
					}
				})

				
				var stickySpacerHeight = 0;
				forEach.call(document.querySelectorAll('[data-m-ui-sticky]'), function(
						sticky) {
					var parent = sticky.parentElement;
					
					if (y  > sticky.offsetTop && //
							y< parent.offsetTop + parent.offsetHeight - sticky.offsetHeight
							//FIXME
//							y< parent.offsetTop + parent.offsetHeight
							) {
						if (!sticky._clone){
							sticky._clone=sticky.cloneNode(true)
							sticky._clone.removeAttribute('data-m-ui-sticky')
							sticky._clone.setAttribute('data-m-ui-sticky-clone','')
						}
						sticky.setAttribute('data-m-ui-sticky','on')
						if (sticky._clone && !sticky._clone.parentElement){
							sticky.parentElement.insertBefore(sticky._clone,sticky)
						}
						
						sticky.style.top=stickySpacerHeight+'px';
						stickySpacerHeight+=sticky.offsetHeight;

						y+= sticky.offsetHeight;
					}
				});

			}

			// first init
			sticky();
			// call at every scroll ...
			window.onscroll = sticky;

		});