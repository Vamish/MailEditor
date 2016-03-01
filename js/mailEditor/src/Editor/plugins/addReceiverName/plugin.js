define([
    "jquery",
    "underscore",
    "Editor/linkButton/linkButton"
], function ($, _, linkButton) {
    return function (editor) {
        var btn = new linkButton({
            title: "收件人姓名",
            onClick: function () {
                if ($(editor._editor.selection.getNode()).parents(".widget").length
                    && !$(editor._editor.selection.getNode()).parents(".noneditable").length
                    && editor.addReceiverName && editor.addReceiverName.callback) {
                    editor.addReceiverName.callback(editor);
                }
            }
        });
        editor._toolbar.initItem(btn, "addReceiverName");
    };
});