define([
    "underscore",
    "base/declare",
    "base/_WidgetBase"
], function (_, declare, _WidgetBase) {
    return declare(_WidgetBase, {
        baseClass: "u-btn",
        templateString: '<button class="<%=baseClass%> <%if(items){%>J_BtnToggle<%}%> <%=cls%>" type="button" title="<%=title%>"  <%if(disabled){%>disabled="disabled"<%}%>   data-kb-attach-event="click:_onClick"><%=title%></button>',
        type: "button",
        cls: null,
        title: null,
        disabled: false,
        cmd:null,
        items:null,
        _onClick: function () {
            this.onClick(arguments);
            this.emit("click", this);
        },
        onClick: function () {},
        destroy: function () {
            this.inherited(arguments);
            delete this.items;
        }
    });
});