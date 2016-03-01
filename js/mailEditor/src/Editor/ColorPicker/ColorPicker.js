define([
    "underscore",
    "base/declare",
    "base/_WidgetBase",
    "text!./ColorPicker.html"
], function(_, declare, _WidgetBase, template) {
    return declare(_WidgetBase, {
        baseClass: "dropdown dropdown-add",
        templateString: template,
        _customInput: null,
        items: null,
        colors: null,
        prefix: "#",
        _onColorSelect: function(e) {
            this.onClick && this.onClick(arguments);
            this.emit("colorSelect", e);
        },
        _onCustomBlur: function(e) {
            this.emit("colorSelect", e);
        },
        destroy: function() {
            this.inherited(arguments);
            delete this._customInput;
            delete this.colors;
            delete this.items;
        }
    });
});
