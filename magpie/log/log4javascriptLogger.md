log4javascriptLogger module
=======

Integration module for [log4javascript](http://log4javascript.org/) logging framework in magpie/log packet.


----------


[TOC]


----------


Basic configuration
-----------------

Example RequireJS configuration sections to use the module:

```javascript
require.config({

	packages:[
		{
			main: 'log',
			location: 'magpie/log',
			name: 'log'
		}
	],

	paths:{
		log4javascript : 'lib/log4javascript-1.4.6/log4javascript'
	},

	shim:{
		log4javascript : {
			exports : 'log4javascript'
	},
	
	config:{
		'log/log':{
			root:{
				// use the log4javascript as basic logger
				logger: 'log/log4javascriptLogger'
			}
		}
	}
});
```
Configuration options
---

**setupLogger** Customize newly created log4javascript logger instance.

 Type: **function**
>Arguments |  |
> :- | :-
>logName | log name
>logger | created log4javascript logger for given log name
>log4javascript | library instance 
>defaultLayout| ...



Advanced configuration example
--------------------------
Use **InPageAppender** instead of default BrowserConsoleAppender. It logs messages to a console window in the page which has embedded searching function.


```javascript
require.config({

	....
 
	config:{
		'log/log':{
			root:{
				// use the log4javascript as basic logger
				logger: 'log/log4javascriptLogger'
			}
		},
		
		'log/log4javascriptLogger':{
			// appender insctance holder
			appender: undefined,
			setupLogger: function(logName, logger, log4javascript, defaultLayout) {
				// remove basic console logger
				log.removeAllAppenders();
				if (!this.appender){
					log4javascript.setDocumentReady();
					this.appender = new log4javascript.InPageAppender();
					this.appender.setLayout(defaultLayout);
					
				}
				logger.addAppender(this.appender);
			}
		}
	}
});
```

License
---------

MIT license
https://github.com/csetea/magpieJS/blob/master/LICENSE.md