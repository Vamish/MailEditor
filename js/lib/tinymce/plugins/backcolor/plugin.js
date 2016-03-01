/**
 * plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true */

tinymce.PluginManager.add('backcolor', function(editor) {
	editor.addCommand('mceBackcolor', function(d,value) {
		editor.undoManager.transact(function() {
			editor.formatter.apply("hilitecolor", {value: value});
			editor.nodeChanged();
		});
	});
});
