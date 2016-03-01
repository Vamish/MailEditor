define([
    "jquery",
    "underscore",
    "Editor/linkButton/linkButton"
], function ($, _, linkButton) {
    return function (editor) {
        var btn = new linkButton({
            title: "网页版链接",
            onClick: function () {
                if ($(editor._editor.selection.getNode()).parents(".widget").length
                    && !$(editor._editor.selection.getNode()).parents(".noneditable").length
                    && editor.addWebpageLink && editor.addWebpageLink.callback) {
                    editor.addWebpageLink.callback(editor);
                }
            }
        });
        editor._toolbar.initItem(btn, "addWebpageLink");
    };
});