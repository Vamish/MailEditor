define([
    "jquery",
    "base/topic",
    "base/parser",
    "Editor/Editor",
    "app/library",
    "Box/box",
    "domReady!"
], function ($, topic, parser, MailEditor, library, box) {
    var wind = window,
        doc = wind.document,
        body = doc.body,
        mailNode, editor, lb,
        handlers = [],
        opts = {
            container: null,
            plugins: null,
            toolbar: null,
            contentCss: null,
            src: null,
            height: null
        };

    function initMailEditor() {
        lb = library.init(doc);
        editor = new MailEditor(opts).appendTo(opts.container).startup();
        handlers = handlers.concat([
            editor.on("init", function (doc) {
                box.run({
                    $iframe: $(opts.container).find("iframe"),
                    editor: editor,
                    doc: doc
                });
            })
        ]);
        handlers = handlers.concat([
            topic.subscribe("workspace/box/show/img/picker", function (e) {
                lb.showImage();
            })
        ]);
    }

    return {
        topic: topic,
        editor: null,
        box: box,
        run: function (options) {
            opts = $.extend(opts, options || {});
            initMailEditor();
            this.editor = editor;
        },
        hasChange: function () {
            return editor.hasChange();
        },
        preview: function (w, h) {
            editor.preview(w, h);
        },
        getHtml: function () {
            return editor.getHtml();
        }
    };
});