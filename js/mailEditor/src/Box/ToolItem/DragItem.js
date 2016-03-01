define([
    "jquery",
    "base/declare",
    "app/dom-geometry",
    "./ToolItem"
], function ($, declare, geom, ToolItem) {
    var $ph = $('<div class="editor-status"></div>'),
        doc, body, $body, $doc, $placeHolder;

    function _createPlaceHolder(refEl) {
        var cs = geom.getComputedStyle(refEl);

        return $ph.css({
            height: cs.height,
            width: cs.width
        });
    }

    return declare(ToolItem, {
        title: "Move",
        url: "../widgets/widget-drag.png",
        dragging: false,
        render: function () {
            var self = this;
            this.inherited(arguments);
            $(this.domNode).on("mousedown", function (e) {
                self.callback && self.callback(e);
            });
            return this;
        },
        hide: function () {
            $(this.domNode).hide();
            return this;
        }
    });
});
