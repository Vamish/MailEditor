define([
    "underscore",
    "jquery",
    "require"
], function (_, $, require) {
    var typeAttr = "data-kb-type",
        attachPointAttr = "data-kb-attach-point",
        paramsAttr = "data-kb-params",
        optionAttr = "data-kb-option";

    function makeParamObj(paramStr) {
        return eval('({' + paramStr + '})');
    }

    return {
        getCtor: function (typeStr) {
            return require(typeStr);
        },
        parse: function (rootNode, scope, options) {
            var self = this, root = rootNode || document, _widgets = [];
            $("[" + typeAttr + "]", root).each(function (ix, el) {
                var $el = $(el), typeStr = $el.attr(typeAttr), point = $el.attr(attachPointAttr), option = $el.attr(optionAttr),
                    paramStr = $el.attr(paramsAttr), params = paramStr ? makeParamObj(paramStr) : option ? options[option]||{} : {};

                params.id = el.id;
                params.attachScope = scope;
                params.attachPoint = point;

                var ctor = self.getCtor(typeStr);
                if (!ctor || !_.isFunction(ctor)) {
                    throw new Error("Parser:failed to parse " + typeStr);
                }
                var widget = new ctor(params, el);
                //el.parentNode.replaceChild(widget.domNode, el);
                widget.startup();
                _widgets.push(widget);
            });
            return _widgets;
        }
    };
});