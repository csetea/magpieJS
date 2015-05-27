/**
 * @URL https://github.com/csetea/magpieJS
 * @license MIT
 */
 // @opt {hash: 'prod'}

						switch (messages.length) {
						case 0:
							console[logFn](date, level, logEvent.logName, '-', logEvent.callerLine);
							break;
						case 1:
							console[logFn](date, level, logEvent.logName, '-',
									messages[0], '-', logEvent.callerLine);
							break;
						case 2:
							console[logFn](date, level, logEvent.logName, '-',
									messages[0], messages[1], '-', logEvent.callerLine);
							break;
						case 3:
							console[logFn](date, level, logEvent.logName, '-',
									messages[0], messages[1], messages[2], '-', logEvent.callerLine);
							break;
						case 4:
							console[logFn](date, level, logEvent.logName, '-',
									messages[0], messages[1], messages[2],
									messages[3], '-', logEvent.callerLine);
							break;
						case 5:
							console[logFn](date, level, logEvent.logName, '-',
									'-', messages[0], messages[1], messages[2],
									messages[3], messages[4], '-', logEvent.callerLine);
							break;
						case 6:
							console[logFn](date, level, logEvent.logName, '-',
									messages[0], messages[1], messages[2],
									messages[3], messages[4], messages[5], '-', logEvent.callerLine);
							break;
						case 7:
							console[logFn](date, level, logEvent.logName, '-',
									messages[0], messages[1], messages[2],
									messages[3], messages[4], messages[5],
									messages[6], '-', logEvent.callerLine);
							break;
						case 8:
							console[logFn](date, level, logEvent.logName, '-',
									messages[0], messages[1], messages[2],
									messages[3], messages[4], messages[5],
									messages[6], messages[7], '-', logEvent.callerLine);
							break;
						case 9:
							console[logFn](date, level, logEvent.logName, '-',
									messages[0], messages[1], messages[2],
									messages[3], messages[4], messages[5],
									messages[6], messages[7], messages[8], '-', logEvent.callerLine);
							break;
						case 10:
							console[logFn](date, level, logEvent.logName, '-',
									messages[0], messages[1], messages[2],
									messages[3], messages[4], messages[5],
									messages[6], messages[7], messages[8], messages[9], '-', logEvent.callerLine);
							break;
						default:
							console.log(date, level, logEvent.logName, '-',
									messages, '-', logEvent.callerLine);
						}
