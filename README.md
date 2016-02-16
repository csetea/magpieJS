MagpieJS
=========

Experimental JavaScript research in front-end development that leverages module system and HTML5 features.

* Module Oriented Development: **module is the contract.**
* Easy **HTML5** custom element declaration.
* **HTML5** custom element based widgets in favour.
* Separated configurations.
* Resource loading.
* Router.
* Reusable core modules in backend.*


Module Oriented Development
---------------------------
Principle in 3 point:
 1. Declare dependencies ```require(['log!main','config' ...```,
 2. Export what is needed,
 3. Hide how is done.

Modules in focus.
* Compose them to achieve your goal.
* Break big code into smaller modules.
* Pick and choose module.
* Replace it with another.
* Wrap it into new one.

> [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) module definition


Start up
------------

Mentioned bootstrap (JS root folder) separation convention:
- 'lib' folder for libraries,
- 'magpie' folder for magpieJS name space,
- 'app' or custom folder for your application name space.
- 'config.js' bootstrap configuration,
- 'config.log.js' good practice to separate log configuration.


Include next script in your HTML page.
```
<script type="text/javascript" src="lib/require/require.js" data-main="app/config.js"></script>```
```


[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) module definition
> [RequireJS](http://requirejs.org/) in background as AMD loader

#### example config.js
```
require.config({

	paths : {
		jquery : 	'jquery/jquery-1.11.2.min',
		knockout : 	'lib/knockout/knockout-3.4.0',
		domReady :	'lib/require/domReady',
		text :		'lib/require/text',
		css :		'lib/require/require-css/css',
		less : 		'magpie/dom/less'
	},

	shim : {
		jquery : {
			exports: '$'
		}
	},

	callback: require([
				'config.log', // separated log configuration file.
	        	'magpie/config', // bootstrap mapgie
	            'app/main' // bootstrap your app
				],
				function(){
					// initial callback
				}
	)
});

```

#### example config.log.js
```
require.config({
	config : {
		'magpie/log/main' : {
			root : {
				level : 'info'
			},
			'app/amin' : {
				level : 'debug'
			}
		}
	}
});

```

Stack Overview
------------

<dl>
<table border="1" cellpadding="0" cellspacing="0" dir="ltr">
	<tbody>
		<tr>
			<td colspan="1" rowspan="3">
			<p><strong>Applciation</strong></p>
			</td>
			<td><strong>widgtes</strong></td>
			<td><strong>modules</strong></td>
			<td><em>templates</em></td>
			<td>&nbsp;</td>
		</tr>
		<tr>
			<td><em>MV**</em></td>
			<td><em>configurations</em></td>
			<td><em>MV**</em></td>
			<td>...</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>
		<tr>
			<td colspan="1" rowspan="6">
			<p><strong>MagpieJS</strong></p>
			</td>
			<td><strong>HTML5 widgtes</strong></td>
			<td>logger</td>
			<td colspan="1" rowspan="2">
			<p>responsive design</p>
			</td>
			<td><strong>extend</strong></td>
		</tr>
		<tr>
			<td>m-grid</td>
			<td><strong>resurce<br />
			loaders</strong></td>
			<td>&nbsp;</td>
		</tr>
		<tr>
			<td>m-select</td>
			<td>logger</td>
			<td><strong>grid system</strong></td>
			<td>&nbsp;</td>
		</tr>
		<tr>
			<td>m-inject</td>
			<td>config</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td>REST</td>
			<td colspan="1" rowspan="2">
			<p>{less}</p>
			</td>
			<td>...</td>
		</tr>
		<tr>
			<td><strong>customElement</strong></td>
			<td><strong>router</strong></td>
			<td>inject</td>
		</tr>
		<tr>
			<td colspan="1" rowspan="2">
			<p>polyfill</p>
			</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>
		<tr>
			<td colspan="1" rowspan="2">
			<p><strong>HTLM5</strong></p>
			</td>
			<td colspan="1" rowspan="2">
			<p><strong>JS API</strong></p>
			</td>
			<td colspan="1" rowspan="2">
			<p><strong>CSS3</strong></p>
			</td>
			<td colspan="1" rowspan="2">
			<p>DOM</p>
			</td>
		</tr>
		<tr>
			<td>JS libs</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td colspan="1" rowspan="2">HTLM5<strong>*</strong><br />
			HTML</td>
			<td colspan="1" rowspan="2">
			<p>JS API</p>
			</td>
			<td colspan="1" rowspan="2">CSS3<br />
			CSS</td>
			<td colspan="1" rowspan="2">
			<p>DOM</p>
			</td>
		</tr>
		<tr>
			<td colspan="1" rowspan="2">
			<p><strong>Browser stack</strong></p>
			</td>
		</tr>
		<tr>
			<td colspan="4" rowspan="1">&nbsp;</td>
		</tr>
	</tbody>
</table>

<p style="text-align:right">&nbsp;</p>
</dl>




Easy HTML5 widget
------------

HTML5 custom element defines standard way for real HTML widgets with lifecycle callbacks. Imagine that  ```<my-awsome-chat></my-awsome-chat>``` is your application. MV** choose is up to you.

You can do it so easy with MagpieJS, first define your custom tag:
#### example app/my-awsome-chat.js
```
define({
	tag: 'my-awsome-chat',
	createdCallback: function(){
		// called when an instance of the element is created

	},
	attachedCallback: function(){
		// called when an instance was inserted into the document

	},
	detachedCallback: function(){
		//an instance was removed from the document
	},
	attributeChangedCallback: function(attrName, oldVal, newVal){
		//called when an attribute was added, removed, or updated
	}
})
```
Register your custom tag when you need it, for example in dependencies of your app:
#### example app/my-awsome-chat.js
```
define(['log!app/main', 'mapgie/html5/customElement!app/my-awsome-chat'],
	function(log){
		// your app logic
	}
)
```

MapgieJS provides a default ```createdCallback``` function that look ups for template with the same path name as your custom element module name but with '.html' extension and inject.

> @see more [mapgie/html5/customElement](https://github.com/csetea/magpieJS/tree/master/magpie/html5/customElement)


Main modules
------------
* [mapgie/log](https://github.com/csetea/magpieJS/tree/master/magpie/log) logging, logger provider
* [mapgie/html5/customElement](https://github.com/csetea/magpieJS/tree/master/magpie/html5/customElement) HTML5 custom element registration
* [mapgie/html5/widget](https://github.com/csetea/magpieJS/tree/master/magpie/html5/widget) name space for HTML5 custom element based widgets
* [mapgie/dom](https://github.com/csetea/magpieJS/tree/master/magpie/dom) name space DOM manipulation and pure CSS solutions
* [mapgie/extend](https://github.com/csetea/magpieJS/tree/master/magpie/extend) name space for MagpieJS modules that extends 3rd party libraries
* [mapgie/resource/properties](https://github.com/csetea/magpieJS/tree/master/magpie/resource/properties)
* [mapgie/util/config](https://github.com/csetea/magpieJS/tree/master/magpie/util/config)
* [mapgie/util/idgenerator](https://github.com/csetea/magpieJS/tree/master/magpie/util/idgenerator)

License
---------
MIT license - https://github.com/csetea/magpieJS/blob/master/LICENSE.md
