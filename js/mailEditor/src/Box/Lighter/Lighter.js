define([
    "jquery",
    "underscore",
    "base/declare",
    "base/_WidgetBase",
    "text!./Lighter.html"
], function ($, _, declare, _WidgetBase, template) {

    return declare(_WidgetBase, {
        baseClass: "kb-lighter",
        templateString: template,
        el: null,
        leftRef: null,
        rightRef: null,
        topRef: null,
        bottomRef: null,
        zIndex: 2,
        borderStyle: "solid",
        borderColor: "rgba(255,0,0,1)",
        borderWidth: 1,
        mask: function (el, fix) {
            this.el = el;
            fix = fix || {left: 0, top: 0};
            this.domNode.style.display = 'none';
            var pos = el.getBoundingClientRect();
            this.leftRef.style.left = pos.left + fix.left + 'px';
            this.leftRef.style.top = pos.top + fix.top + 'px';
            this.leftRef.style.height = pos.height + 'px';

            this.rightRef.style.left = (pos.width + pos.left + fix.left - this.borderWidth) + 'px';
            this.rightRef.style.top = pos.top + fix.top + 'px';
            this.rightRef.style.height = pos.height + 'px';

            this.topRef.style.left = pos.left + fix.left + 'px';
            this.topRef.style.top = pos.top + fix.top + 'px';
            this.topRef.style.width = pos.width + 'px';

            this.bottomRef.style.left = pos.left + fix.left + 'px';
            this.bottomRef.style.top = (pos.top + pos.height + fix.top - this.borderWidth) + 'px';
            this.bottomRef.style.width = pos.width + 'px';
            this.domNode.style.display = 'block';
            return this;
        },
        unmask: function () {
            this.el = null;
            $(this.domNode).css("display", "none");
            return this;
        },
        _setBorderColorAttr: function (borderColor) {
            this.borderColor = borderColor;
            $(this.leftRef).css("borderLeftColor", this.borderColor);
            $(this.rightRef).css("borderRightColor", this.borderColor);
            $(this.topRef).css("borderTopColor", this.borderColor);
            $(this.bottomRef).css("borderBottomColor", this.borderColor);
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.el;
            delete this.leftRef;
            delete this.rightRef;
            delete this.topRef;
            delete this.bottomRef;
        }
    });
});