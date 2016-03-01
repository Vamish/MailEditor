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

tinymce.PluginManager.add('fontcolor', function(editor) {
	editor.addCommand('mceFontcolor', function(d,value) {
		editor.undoManager.transact(function() {
			editor.focus();
			editor.formatter.apply("forecolor", {value: value});
		});
	});
});
