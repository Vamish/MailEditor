define([
    "underscore",
    "base/declare",
    "base/_WidgetBase",
    "text!./DownList.html"
], function(_, declare, _WidgetBase, template) {
    return declare(_WidgetBase, {
        baseClass: "dropdown s-height",
        templateString: template,
        _customInput: null,
        items: null,
        hasCustom: false,
        suffix: "pt",
        _onItemClick: function(e) {
            this.onClick && this.onClick(arguments);
            this.emit("itemClick", e);
        },
        _onCustomBlur: function(e) {
            this.onClick && this.onClick(arguments);
            this.emit("itemClick", e);
        },
        destroy: function() {
            this.inherited(arguments);
            delete this.items;
            delete this._customInput;
        }
    });
});
