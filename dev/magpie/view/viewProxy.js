/***
 * @license MIT 
 */

define(
		[ 'module', 'router', 'idgenerator', 'log!viewProxy', 'magpie/view/inject' ],

		function(module, router, id, log, inject) {

			var config = module.config();

			var activeView;

			//
			// View rendering and life cycle management logic.
			//
			function ViewRenderer(view, append) {
				if (typeof view === 'string') {
					log.t('rendering static page ...')
					var el = config.el ? config.el : 'body';
					if (activeView && activeView.dettached) {
						activeView.dettached()
					}
					inject(el, view, append);
					return true;
				} else if (view) {

					if (activeView && activeView.dettached) {
						activeView.dettached()
					}

					var el = view.el ? view.el : (config.el ? config.el
							: 'body');
					
					log('ViewRenderer', 'el:', el)
					
					if (!view.render) {
						log.trace('create default view.render()')
						view.render = function DefaultRenderImpl() {
							var template = this.template;
							if (typeof template === "string") {
								// nothing to do at this point
							} else if (template instanceof Function) {
								template = template(view);
							}
							inject(el, template, append);

						}
					}
					view.render();

					if (view.attached) {
						view.attached();
					}
					activeView = view;
					return true;
				}
				return false;
			}

			//
			// Listen href changes to load view.
			//			
			router.on('routeload',  function(viewModule, routeArguments) {
				var url = window.location.href;
				var path = router.urlPath(url);
				log.t('onRouteLoad', 'url:', url, 'path:', path,
						'routeArguments:', routeArguments, 'activeRoute:',router.activeRoute)
				if (typeof viewModule !== 'undefined') {
					router.fire('viewFound', viewModule, router.activeRoute.moduleId);
				} else {
					// remove the first / from the uri after the # character
					path = path.substring(1, path.length);
					log.d('requested module returned with undefined value -> fire resolveView event', path)
					router.fire('resolveView', path, routeArguments);
				}
			});
			
			router.on('viewFound', function(viewModule, url){
				var view = viewModule instanceof Function ? new viewModule() : viewModule;
				if (typeof view == 'string'){
					ViewRenderer(view);
				}else if (view){
					if (!view.render && !view.template){
						var viewPath=url.replace(/.*!/,'');
//						log.e(require.toUrl(viewPath))
						log.w('view.template', view.template,' try to set it to:',viewPath+'.html' )
						require([ 'text!'+viewPath+'.html' ], function(template) {
							view.template = template;
							ViewRenderer(view);
						}, function(err) {
							// ...
						});	
					}else{
						ViewRenderer(view);
					}
				}
				

			});


			router.on('resolveView', function(path, routeArguments) {
				require([ path ], function(viewModule) {
					log.t('modul resolved:', path)
//					log.t('modul resolved:', viewModule)
					router.fire('viewFound', viewModule, path);

				}, function(err) {
					log.t('view not found -> fire viewNotFound event',path);
					router.fire('viewNotFound');
				});
			});


			var viewNotFoundView= null;
			
			router.on('viewNotFound', function() {
				var viewNotFound=config.viewNotFound;
				if (viewNotFound){
					if (viewNotFound instanceof Function){
						viewNotFound();
					}else if (typeof viewNotFound === 'string'){
						log.t("onViewNotFound", viewNotFound)
						if (!viewNotFoundView){
							log.t('load viewNotFound view module:',viewNotFound);
							require([ viewNotFound ], function(viewModule) {
								viewNotFoundView = viewModule;
								router.fire('viewFound', viewNotFoundView, viewNotFound);
							});
						}else{
							router.fire('viewFound', viewNotFoundView, viewNotFound);
						}
					}
				}
			});

			//
			// 
			//
			var viewProxy = new function ViewProxy() {
				this.load = function(path, parentRequire, onload, config) {
						router.fire('resolveView', path);
						onload(viewProxy);
				};
				
				this.resolveView=function(path){
					router.fire('resolveView', path);					
				};
				
			};

			return viewProxy;

		});
