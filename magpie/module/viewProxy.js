/**
 * Magpie ViewProxy
 * 
 * https://github.com/csetea/magpiejs
 * 
 * Version: 0.1
 * 
 * The MIT License (MIT) Copyright (c) 2014 Andras Csete
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
define(
		[ 'module', 'router', 'jquery', 'idgenerator', 'log!viewProxy' ],

		function(module, router, $, id, log) {

			var config = module.config();

			var activeView;

			//
			// View rendering and life cycle management logic.
			//
			var viewRenderer = function ViewRenderer(module) {
				var view = module instanceof Function ? new module : module;
				if (typeof module === 'string') {
					log.t('rendering static page ...')
					var el = config.el ? config.el : 'body';
					if (activeView && activeView.dettached) {
						activeView.dettached()
					}
					$(el).html(view);
					return true;
				} else if (view) {

					if (activeView && activeView.dettached) {
						activeView.dettached()
					}

					var el = view.el ? view.el : (config.el ? config.el
							: 'body');
					view.$el = el instanceof $ ? el : $(el);
					log('onRouteLoad', 'el:', el)

					if (!view.render) {
						view.render = function DefaultRenderImpl() {
							// this.view=view;
							var template = this.template;
							if (typeof template === "string") {
								// nothing to do at this point
							} else if (template instanceof Function) {
								template = template(view);
							}
							view.$el.html(template);
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
			var onRouteLoad = function(module, routeArguments) {
				var url = window.location.href;
				var path = router.urlPath(url);

				log.t('onRouteLoad', 'url:', url, 'path:', path,
						'routeArguments:', routeArguments)
				if (typeof module !== "boolean") {
					log.t('module:', (typeof module))
					if (viewRenderer(module)) {
						// ... nothingto do
					} else {
						log
								.w('requested module returned with undefined value -> fire viewNotFound event')
						log.t('statechange', document.URL)
						router.fire('resolveView', path, routeArguments);
					}
				}else{
					log.t('module:', (typeof module), '-> skip')	
				}
			};

			router.on('routeload', onRouteLoad);

			router.on('resolveView', function(path, routeArguments) {
				path = path.substring(1, path.length);
				require([ path ], function(view) {
					log.t('modul resolved:', view)
					onRouteLoad(view);
				}, function(err) {
					log.t('view not found..')
					router.fire('viewNotFound');
				});
			});


			
			router.on('viewNotFound', function() {
				var viewNotFound=config.viewNotFound;
				log(viewNotFound)
				if (viewNotFound){
					if (viewNotFound instanceof Function){
						viewNotFound();
					}else if (typeof viewNotFound === 'string'){
						log(viewNotFound)
						require(['viewProxy!'+viewNotFound]);
					}
				}
			});

			//
			// 
			//
			var viewProxy = new function ViewProxy() {
				this.load = function(path, parentRequire, onload, config) {
					require([ path ], function(view) {
						onload(viewRenderer(view));
					});
				};
			};

			return viewProxy;

		});
