/**
 * TELES C5 Velocity template editor plugin.
 * @license Copyright (c) 2014, TELES AG. All rights reserved.
 */
'use strict';
(function() {
	
	CKEDITOR.plugins.add('tvelocity',{
		requires : 'widget,dialog',
		lang : 'en',

		onLoad : function() {
			// Register styles for widget frames
			CKEDITOR.addCss('.cke_tvelocity_placeholder{background-color:#ff0}');
			CKEDITOR.addCss('.cke_tvelocity_statement{background-color:#FEE; font-weight: bold; color:#444;}');
			CKEDITOR.addCss('.cke_tvelocity_placeholder_invalid{background-color:#f44; font-weight: bold; color: #F8F8F8;}');
		},

		init : function(editor) {
			CKEDITOR.dialog.add('tvelocity', this.path + 'dialogs/tvelocity.js');
			//
			// define velocity widgets for valid and invalid placeholder and statement 
			//
			editor.widgets.add('tvelocity',{
				dialog : 'tvelocity',
				draggable: false,
				pathName : 'cke_tvelocity_placeholder',
				template : '<span class="cke_tvelocity_placeholder"></span>',
				downcast : function() {return new CKEDITOR.htmlParser.text('' + this.data.name + '');},
				init : function() {this.setData('name', this.element.getText());},
				data : function(data) {this.element.setText('' + this.data.name + '');}
			});

			editor.widgets.add('tvelocity_invalid',{
				pathName : 'cke_tvelocity_placeholder_invalid',
				template : '<span class="cke_tvelocity_placeholder_invalid"></span>',
				downcast : function() {return new CKEDITOR.htmlParser.text('' + this.data.name + '');},
				init : function() {this.setData('name', this.element.getText());},
				data : function(data) {this.element.setText('' + this.data.name + '');}
			});

			editor.widgets.add('tvelocity_statement',{
				pathName : 'cke_tvelocity_placeholder_invalid',
				template : '<span class="cke_tvelocity_statement"></span>',
				downcast : function() {return new CKEDITOR.htmlParser.text('' + this.data.name + '');},
				init : function() {this.setData('name', this.element.getText());},
				data : function(data) {this.element.setText('' + this.data.name + '');}
			});
			//
			// button for valid placeholder editing 
			//
			editor.ui.addButton('tvelocity_placeholder',{
				label: '<span class=\'mark\'>${</span>placeholder<span class=\'mark\'>}</span>',
				command : 'tvelocity',
				toolbar : 'insert,5'
			});
		},

		afterInit : function(editor) {
			//
			// populate placeholder list
			//
			var placeholders={};
			if (editor.config.tvelocity_placeholders){
				for(var i=0;i< editor.config.tvelocity_placeholders.length;i++){
					var val=editor.config.tvelocity_placeholders[i];
					val='${'+val+'}';
					placeholders[val]=val;
				};
			}
			
			var filterPlaceholder ={
				text : function(text) {
					return text.replace( /\$\{[^\}]+\}/g, function(match){
						if (placeholders[match]){
							var innerElement = new CKEDITOR.htmlParser.element('span',{
								'class' : 'cke_tvelocity_placeholder'
							});
							innerElement.add(new CKEDITOR.htmlParser.text(match));
							var widgetWrapper = editor.widgets.wrapElement(innerElement, 'tvelocity');

							return widgetWrapper.getOuterHtml();
						}else{
							var innerElement = new CKEDITOR.htmlParser.element('span',{
								'class' : 'cke_tvelocity_placeholder_invalid'
							});
							innerElement.add(new CKEDITOR.htmlParser.text(match));
							var widgetWrapper = editor.widgets.wrapElement(innerElement, 'tvelocity_invalid');

							return widgetWrapper.getOuterHtml();
						}
					});
				}
			};
			editor.dataProcessor.dataFilter.addRules(filterPlaceholder);

			var filterStatement ={
					text : function(text) {
						return text.replace( /(#(if|elseif|else|end|foreach|break|set|velocityCount)|\$\S+)/g, function(match){
							var innerElement = new CKEDITOR.htmlParser.element('span',{
								'class' : 'cke_tvelocity_statement'
							});
							innerElement.add(new CKEDITOR.htmlParser.text(match));
							var widgetWrapper = editor.widgets.wrapElement(innerElement, 'tvelocity_statement');

							return widgetWrapper.getOuterHtml();
						});
					}
				};
			editor.dataProcessor.dataFilter.addRules(filterStatement);


			/////////////////////////////////////////////////
			////////////////////////////////////////////////
			///////////////////////////////////////////////
			// automatic parsing support ...
			var lock = false;
			//TODO restore original interval - changed from debug propose
			// var interval = 2000;
			var interval = 400;
			var editorInFocus = false;
			editor.on('focus', function() {
				editorInFocus = true;
			});

			editor.on('blur', function() {
				editorInFocus = false;
				editor.setData(editor.getData());
			});
			var changed=false;
			editor.on('change', function() {
				changed=true;
			});
			editor.on('selectionChange', function() {
				changed=true;
			});

			editor.on('instanceReady', function (ev) {
				// Prevent drag-and-drop.
				ev.editor.document.on('drop', function (ev) {
					changed=true;
				});
			});

			// 'automatic' parsing function
			var lastData = '';
			editor._tvelocityParsingStart= function(){
				editor._tvelocityParsingLock=setInterval(	function() {
					
					if (!lock && editorInFocus && editor.mode === 'wysiwyg' && changed) {
						lock = true;
						var sel = editor.getSelection(), range;
						if (sel && (range = sel.getRanges()[0])) {
							changed=false;

							var bmark = range.createBookmark(true);
							var data = editor.getData();
							if (data.replace(/id="cke_bm_[^"]*"/g,'id="cke_bm_XXX"') !=  lastData){
								var cleanedBody =  data.indexOf('<body')> -1? data.substring(data.indexOf('<body'), data.indexOf('</body')).replace(/<body[^>]*>/,''):data;
								// parse data with filters ...
								// filterPlaceholder
								var f = new CKEDITOR.htmlParser.filter(filterPlaceholder);
								var fragment = CKEDITOR.htmlParser.fragment.fromHtml(cleanedBody);
								var writer = new CKEDITOR.htmlParser.basicWriter();
								f.applyTo(fragment);
								fragment.writeHtml(writer);
								var wdata = writer.getHtml();
								//
								// filterStatement
								//
								f = new CKEDITOR.htmlParser.filter(filterStatement);
								fragment = CKEDITOR.htmlParser.fragment.fromHtml(wdata);
								writer = new CKEDITOR.htmlParser.basicWriter();
								f.applyTo(fragment);
								fragment.writeHtml(writer);
								wdata = writer.getHtml();
								
								//
								// set content to parsed data
								//
								editor.loadSnapshot(wdata);
								//
								// reposition of cursor
								//
								var startNode = editor.document.getById(bmark.startNode);
								var endNode = editor.document.getById(bmark.endNode);
								if (startNode) {
									var range = new CKEDITOR.dom.range(editor.document);
									range.setStartBefore(startNode);
									if (endNode) { 
										range.setEndBefore(endNode);
									}else{
										range.setEndBefore(startNode);
									}
									
									startNode.remove();
									range.scrollIntoView();
									range.select();
								}
								lastData = editor.getData().replace(/id="cke_bm_[^"]*"/g,'id="cke_bm_XXX"');
							}
						}
						lock = false;
					}
				}, interval);
			}
			editor._tvelocityParsingStart();
			editor._tvelocityParsingStop=function(){ clearInterval(editor._tvelocityParsingLock)};
		}
	});
})();