require.config({
	config : {
	
		'log/log4javascriptLogger' : {
			appender : undefined,
			setupLogger : function(logName, logger, log4javascript,
					defaultLayout) {
				// log.removeAllAppenders();
				if (!this.appender) {
					log4javascript.setDocumentReady();
					this.appender = new log4javascript.InPageAppender();
					this.appender.setLayout(defaultLayout);

				}
				logger.addAppender(this.appender);
			}
		},

		'log/log' : {
			 'log' : {
			 level : 'error'
			 },

			root : {
				level: 'info'
//				logger: './log4javascriptLogger'
			},

			
			
			'm-inject' : {
				level: 'trace'
			},
//
//			magpie/dom/inject : {
//				level: 'debug'
//			},

			customElement : {
				level: 'warn'
			}
			
		}

	}	
});