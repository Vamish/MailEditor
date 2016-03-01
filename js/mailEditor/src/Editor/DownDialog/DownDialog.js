define([
    "jquery",
    "underscore",
    "base/declare",
    "base/_WidgetBase",
    "text!./DownDialog.html"
], function($, _, declare, _WidgetBase, template) {
    return declare(_WidgetBase, {
        baseClass: "dropdown dropdown-add add-link-box",
        templateString: template,
        items: null,
        renderItem: function(it) {
            return ('<div class="add-link">' + '<span>' + it.text + '</span>' + '<input id=' + it.id + ' type="' + it.type + '"  style="width:100px;"  data-kb-attach-event="click:_onClick">' + '</div>');
        },
        _onClick: function(e) {
            e.preventDefault();
            e.stopPropagation();
        },
        get: function(id) {
            return $("#" + id, this.domNode);
        },
        _onSave: function() {
            this.emit("save", this);
        },
        _onCancel: function() {
            this.emit("cancel", this);
        },
        destroy: function() {
            this.inherited(arguments);
            delete this.items;
        }
    });
});
