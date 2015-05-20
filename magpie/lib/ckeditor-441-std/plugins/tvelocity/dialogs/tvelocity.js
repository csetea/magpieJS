/**
 * TELES C5 Velocity template editor plugin.
 * @license Copyright (c) 2014, TELES AG. All rights reserved.
 */
'use strict';
CKEDITOR.dialog.add( 'tvelocity', function( editor ) {
	//
	// populate placeholder list
	//
	var items=[];
	for(i in editor.config.tvelocity_placeholders){
		var val=editor.config.tvelocity_placeholders[i];
		val='${'+val+'}';
		items.push([val]);
	}	

	return {
		title: editor.lang.tvelocity.title,
		minWidth: 300,
		minHeight: 70,
		contents: [
			{
				id: 'info',
				label: editor.lang.common.generalTab,
				title: editor.lang.common.generalTab,
				elements: [
					{
						id: 'name',
						type: 'select',
						items: items,
						// setup default value
						'default': items[0],
						style: 'width: 100%;',
						label: editor.lang.tvelocity.label,
						required: true,
						
						setup: function( widget ) {
							// stop parsing to make widget update possible
							editor._tvelocityParsingStop();
							//
							// reset to current value if found in list
							//
							var found= false;
							var val=widget.data.name.trim();
							for(i in items){
								found= val.indexOf(items[i][0]) >-1;
								if (found){
									this.setValue( items[i] );
									
									break;
								}
							}
						},
						commit: function( widget ) {
							var val=this.getValue();
							widget.setData( 'name', val);
						},
						onHide: function(){
							// restart parsing
							editor._tvelocityParsingStart();
						}
					}
				]
			}
		]
	};
} );
