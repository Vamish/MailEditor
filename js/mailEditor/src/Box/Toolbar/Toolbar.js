define([
    "jquery",
    "base/declare",
    "base/_WidgetBase",
    "text!./Toolbar.html"
], function ($, declare, _WidgetBase, template) {
    return declare(_WidgetBase, {
        baseClass: "mail-toolbar",
        templateString: template,
        containerNode: null,
        width: "25px",
        init: function () {
            this.inherited(arguments);
            this.items = [];
            return this;
        },
        show: function (x, y) {
            $(this.domNode).css({
                left: x,
                top: y,
                //position: "relative",
                width: this.width
            }).show();
            return this;
        },
        hide: function () {
            $(this.domNode).hide();
            return this;
        },
        startup: function () {
            this.hide();
            return this;
        },
        addItem: function (item) {
            this.items.push(item);
            item.appendTo(this.containerNode);
            item.startup();
            return this;
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.containerNode;
            delete this.items;
        }
    });
});
