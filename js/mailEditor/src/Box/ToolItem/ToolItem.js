define([
    "base/declare",
    "base/_WidgetBase"
], function (declare, _WidgetBase) {
    return declare(_WidgetBase, {
        baseClass: "mail-toolbar-item",
        title: "",
        templateString: '<li class="<%=baseClass%>" ><a href="Javascript:;"><img src="<%=url%>" alt="<%=title%>"></a></li>'
    });
});
