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
/*eslint consistent-this:0 */

tinymce.PluginManager.add('lineHeight', function(editor) {
    var self = this;
    editor.addCommand('mceLineHeight', function(d,val) {
        var dom=editor.dom,selection=editor.selection;
        tinymce.each(selection.getSelectedBlocks(),function(el){
            dom.setStyle(el,"line-height",val)
        });
    });
});
