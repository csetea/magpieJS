log - packet
=======


Adds general but extremely powerful logging capability to module system.
Six logging level are defined and each is assigned to corresponding log functions.

|Log levels| logging methods|
|-|-
|TRACE|log.trace
|DEBUG|log.debug
|INFO|log.info
|WARN|log.warn
|ERROR|log.error
|FATAL|log.fatal

Using the log instance is just so easy ...
```javascript
	log.info('Hello Bob!',{age: 101, sex: 'male'});
```
By default it will print on browser console and as a plus it resolves the caller line:

>18:41:35.063 INFO **silent** - Hello Bob! Object {age: 101, sex: "male"} - http://.../magpie/log/exampleNamedLog.js:3:6

Just a little list from features:

 - resolve caller line
 - filter log events to prevent logging or do additional processing on it
 - use custum logger instead of default console logger
 - chain filters
 - chain loggers

Are you interested? :)

----------


[TOC]


----------

log Interface
----


Basic examples
----
### Logging on route log

```javascript
require([ 'log' ], function(log) {

	log.debug('Hello Bob!',{age: 101, sex: 'male'});
		
});
```
Will print on console.debug:
>18:41:35.061 DEBUG root - Hello Bob! Object {age: 101, sex: "male"} - http://.../magpie/log/exampleRootLog.js:3:6

###Logging on named log
```javascript
require([ 'log!silent' ], function(log) {

	log.info('Hello Bob!',{age: 101, sex: 'male'});
		
});
```
Will print on console.debug:
>18:41:35.063 INFO **silent** - Hello Bob! Object {age: 101, sex: "male"} - http://.../magpie/log/exampleNamedLog.js:3:6




Basic configuration
-----------------

Example RequireJS configuration sections to include the packet:

```javascript
require.config({

	packages:[
		{
			main: 'log',
			location: 'magpie/log',
			name: 'log'
		}
	],
});
```

Usage
-------


Configuration options
---
Option | Description | Type | Default value
:- | :-
level| logging level(s) | string | Info
filter | | function or module path |
logger | | function or module path | ./defaultConsoleLogger
resolveCallerLine | | boolean | true

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
TODO

License
---------

MIT license
https://github.com/csetea/magpieJS/blob/master/LICENSE.md


