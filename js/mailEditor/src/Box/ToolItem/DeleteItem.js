define([
    "jquery",
    "base/declare",
    "./ToolItem"
], function ($,declare, ToolItem) {
    return declare(ToolItem, {
        title: "Delete",
        url:"../widgets/widget-remove.png",
        render: function () {
            this.inherited(arguments);
            var self = this;
            $(this.domNode).on("mousedown", function (e) {
                self.callback && self.callback(e);
            });
            return this;
        },
        hide: function () {
            $(this.domNode).hide();
            return this;
        }
    });
});
