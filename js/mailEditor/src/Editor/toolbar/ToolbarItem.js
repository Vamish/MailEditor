define([
    "jquery",
    "underscore",
    "base/declare",
    "base/_WidgetBase"
], function ($, _, declare, _WidgetBase) {
    return declare(_WidgetBase, {
        baseClass: 'u-btn-grid',
        templateString: '<div class="<%=baseClass%>"></div>',
        rendering: function (cls) {
            $(this.domNode).removeClass(this.baseClass).addClass(cls);
            return this;
        }
    });
});