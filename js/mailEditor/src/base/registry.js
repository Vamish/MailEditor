define(function () {
    var hash = {};
    return {
        getUniqueId: function () {
            return Math.ceil(Math.random() * Math.pow(2, 53));
        },
        byId: function (id) {
            return hash[id];
        },
        add: function (widget) {
            hash[widget.id] = widget;
        },
        remove: function (id) {
            if (hash[id]) {
                delete hash[id];
            }
        },
        findWidgets: function (root) {
            var widgets = [];

            function getChildrenHelper(root) {
                for (var node = root.firstChild; node; node = node.nextSibling) {
                    if (node.nodeType == 1) {
                        var widgetId = node.getAttribute("data-kb-widget-id");
                        if (widgetId) {
                            var widget = hash[widgetId];
                            if (widget && widgets.indexOf(widget) == -1) {
                                widgets.push(widget);
                            }
                        }else{
                            getChildrenHelper(node);
                        }
                    }
                }
            }

            getChildrenHelper(root);
            return widgets;
        }
    }
});
