define([
    "underscore",
    "base/declare",
    "base/_WidgetBase"
], function (_, declare, _WidgetBase) {
    return declare(_WidgetBase, {
        baseClass: "u-linkbtn",
        templateString: '<a href="<%=href%>" class="<%=baseClass%>" data-kb-attach-event="click:_onClick"><i class="u-linkbtn-icon"></i><%=title%></a>',
        type: "linkButton",
        href: "javascript:;",
        title: null,
        _onClick: function () {
            this.onClick && this.onClick();
            this.emit("click", this);
        }
    });
});