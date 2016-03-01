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

tinymce.PluginManager.add('mailLink', function (editor) {
    var data = {}, selection, dom, selectedElm, anchorElm,rng;
    editor.addCommand('setMailLink', function (d, dialog) {
        var onlyText;
        var text = dialog.get("_text").val(), href = dialog.get("_href").val();
        function isOnlyTextSelected(anchorElm) {
            var html = selection.getContent();

            // Partial html and not a fully selected anchor element
            if (/</.test(html) && (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf('href=') == -1)) {
                return false;
            }

            if (anchorElm) {
                var nodes = anchorElm.childNodes, i;

                if (nodes.length === 0) {
                    return false;
                }

                for (i = nodes.length - 1; i >= 0; i--) {
                    if (nodes[i].nodeType != 3) {
                        return false;
                    }
                }
            }

            return true;
        }
        onlyText = isOnlyTextSelected(anchorElm);
        function insertLink() {
            var linkAttrs = {
                href: href,
                title: text
            };

            if (anchorElm) {
                editor.focus();

                if (onlyText) {
                    if ("innerText" in anchorElm) {
                        anchorElm.innerText = text;
                    } else {
                        anchorElm.textContent = text;
                    }
                }

                dom.setAttribs(anchorElm, linkAttrs);

                selection.select(anchorElm);
                editor.undoManager.add();
            } else {
                if (onlyText) {
                    editor.selection.setRng(rng);
                    editor.insertContent(dom.createHTML('a', linkAttrs, dom.encode(text)));
                } else {
                    editor.selection.setRng(rng);
                    editor.execCommand('mceInsertLink', false, linkAttrs);
                }
            }
        }

        if (href) {
            insertLink();
        }

        if (!href) {
            editor.execCommand('unlink');
            return;
        }
    });
    editor.addCommand('showMailLink', function (d, dialog) {
        var $text = dialog.get("_text"), $href = dialog.get("_href");
        data = {};
        selection = editor.selection;
        rng = selection.getRng();
        dom = editor.dom;
        selectedElm = selection.getNode();
        anchorElm = dom.getParent(selectedElm, 'a[href]');
        data.text = anchorElm ? (anchorElm.innerText || anchorElm.textContent) : selection.getContent({format: 'text'});
        data.href = anchorElm ? dom.getAttrib(anchorElm, 'href') : '';
        $text.val(data.text);
        $href.val(data.href);
    });
});
