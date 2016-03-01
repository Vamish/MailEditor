define([
    "jquery",
    "underscore"
], function ($, _) {
    return {
        insert: function () {

        },
        remove: function () {

        },
        find: function () {

        },
        setContentEditable: function (node, val) {
            node.contentEditable = val;
        },
        getContentEditable: function (node) {
            var contentEditable;
            if (!node || node.nodeType != 1) {
                return null;
            }
            contentEditable = node.getAttribute("data-edit-contenteditable");
            if (contentEditable && contentEditable !== "inherit") {
                return contentEditable;
            }
            return node.contentEditable !== "inherit" ? node.contentEditable : null;
        }
    };
});