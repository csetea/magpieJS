require.config({
	config : {
		'magpie/log/main' : {
			root : {
				level : 'info'
			},

			'magpie/log/log' : {
				level : 'error'
			},
			
			'magpie/html5/customElement' : {
				level : 'trace'
			}

		}
	}
});