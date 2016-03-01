define([
    "jquery",
    "underscore",
    "Editor/linkButton/linkButton"
], function ($, _, linkButton) {
    return function (editor) {
        var btn = new linkButton({
            title: "退订链接",
            onClick: function () {
                if ($(editor._editor.selection.getNode()).parents(".widget").length
                    && !$(editor._editor.selection.getNode()).parents(".noneditable").length
                    && editor.addUnsubscribeLink && editor.addUnsubscribeLink.callback) {
                    editor.addUnsubscribeLink.callback(editor);
                }
            }
        });
        editor._toolbar.initItem(btn, "addUnsubscribeLink");
    };
});