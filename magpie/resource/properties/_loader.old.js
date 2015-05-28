/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
define(
		[ 'jquery', 'jqueryBrowserLanguage', 'magpie/log!resourceLoader', 'mark',
				'require' ],
		function($, bl, log, mark, rq) {

			var resolveResource = function(resource, locale) {
				var l = {};
				l.lc = l.local = l.langCode = l.localeCode = locale;
				return Mark.up(resource, l);
			};

			
			var resolveLocale = function(callback) {
				$
						.browserLanguage(function(langCode, language,
								acceptHeader) {
							var resolvedLocale = null;
							for (var i = 0, l = c.supportedLocales.length; i < l; i++) {
								var sl = c.supportedLocales[i];
								if (langCode === sl) {
									resolvedLocale = sl;
								}
							}
							if (resolvedLocale === null) {
								/*jshint -W004 */ 
								for (var i = 0, l = c.supportedLocales.length; i < l; i++) {
									var sl = c.supportedLocales[i];
									if (sl.indexOf(langCode) === 0) {
										resolvedLocale = sl;
									}
								}

							}
							var locale = resolvedLocale !== null ? resolvedLocale
									: c.defaultLocale;
							callback(locale);

						});
			};

			var loadResource = function(loader, resource, locale) {

				log.t('loadResource', resource, locale);

				var rL = resolveResource(c.resources[resource], locale);
				var resourceUri = c.resourceDir;
				// resourceUri=rq.toUrl(resourceUri);
				log.d('resourceUri', resourceUri);
				require(
						[ 'text!' + resourceUri + '/' + rL ],
						function(content) {
							if (c.alwaysLoadDefault){
								var rD = resolveResource(c.resources[resource],
										c.defaultLocale);
								require(
										[ 'text!' + resourceUri + '/' + rD ],
										function(contentDefault) {
											loader.callback(resource, content, contentDefault);
										},
										function(errx) {
											log.w('default locale resource file not found for resource:',
													resource, '-', rD,'Skip forced default loading!');
											loader.callback(resource, content);
										});
								
							}else{
								loader.callback(resource, content);
							}
						},
						function(err) {
							log.w('resource file not found for resource:',
									resource, '-', rL);
							var rD = resolveResource(c.resources[resource],
									c.defaultLocale);
							log.w('fallback to default locale, resource:',
									resource, '-', rD);
							require(
									[ 'text!' + resourceUri + '/' + rD ],
									function(content) {
										loader.callback(resource, content);
									},
									function(errx) {
										log.e('default locale resource file not found for resource:',
												resource, '-', rD);
										loader.callback(resource, '');
									});
						});
			};

			var processProperties = function(text) {
				var lines = text.split("\n");
				var i, key;
				var msg = {};
				lines.forEach(function(line) {
					if (line.length && line.charAt(0) !== "#") {
						i = line.indexOf("=");
						key = line.substr(0, i).trim();
						
						//msg[key] = (line.substr(i + 1).trim());
						msg[key] = unescape(
							line.substr(i + 1).trim().replace(/\\u([\d\w]{4})/gi,
								function (match, grp) {
									return String.fromCharCode(parseInt(grp, 16)); 
						    } )
						);
					}
				});
				return msg;
			};

			// configuration holder object
			var c = {};
			c.resourceDir = c.resources = c.defaultLocale = c.supportedLocales = undefined;
			c.init = function(config) {
				/*jshint -W004 */ 
				var config = config.config ? config.config.resource ? config.config.resource : {} : {};
				this.resourceDir = config.resourceDir ? config.resourceDir
						: 'www/resources';
				if (!config.resourceDir) {
					log.w('use default resourceDir', this.resourceDir);
				}
				this.resources = config.resources ? config.resources : {};
				this.defaultLocale = config.defaultLocale;
				this.supportedLocales = config.supportedLocales;
				this.alwaysLoadDefault = config.alwaysLoadDefault;
				// add the default locale to supported if not already contains
				// it
				if (this.supportedLocales && this.defaultLocale) {
					if (this.supportedLocales.indexOf(this.defaultLocale) < 0) {
						this.supportedLocales.push(this.defaultLocale);
					}
				}
				// resolve default locale
				if (!this.defaultLocale) {
					if (this.supportedLocales && this.supportedLocales.length > 0) {
						this.defaultLocale = this.supportedLocales[0];
						log
								.w(
										'defaultLocale not set, choose first supported locale as default: ',
										this.defaultLocale);

					} else {
						this.defaultLocale = 'en';
						log
								.w(
										'supportedLocales not set, defaultLocale not set, set it to default: ',
										this.defaultLocale);
					}
				}
				
				this.resolveLocale = config.resolveLocale?config.resolveLocale:resolveLocale;

				log.d('parsed config', this);
			};

			return {

				load : function(param, parentRequire, load, config,
						parentModule) {
					if (!c.resourceDir) {
						c.init(config);
					}

					var loader = {
						resources : {},
						loaded : 0,
						callback : function(resource, content, contentDefault) {
							this.loaded++;
							this.resources[resource] = processProperties(content);
							if (contentDefault){
								var defaultValues = processProperties(contentDefault);
								for( var p in defaultValues){
									if (typeof this.resources[resource][p]==='undefined'){
										this.resources[resource][p]=defaultValues[p];
									}
								}
							}
							if (this.counter == this.loaded) {
								log.t('resources loaded ... ');
								load(loader.resources);
							}
						}
					};
					var counter = 0;
					for (var resource in c.resources) {
						loader.resources[resource] = undefined;
						counter++;
					}
					log.t('load', 'loader', loader);
					loader.counter = counter;

					if (!counter) {
						log.w('empty resource.resources configuration entry !!!');
						load();
					}

					c.resolveLocale(function(locale) {
						log.t('load', 'resolvedLocale', locale);
						for (var resource in c.resources) {
							loadResource(loader, resource, locale);
						}

					});

				}

			};

		});