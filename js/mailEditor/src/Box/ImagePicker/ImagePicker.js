define([
    "jquery",
    "base/declare",
    "base/_WidgetBase",
    "text!./ImagePicker.html"
], function ($, declare, _WidgetBase, template) {
    var udf;
    return declare(_WidgetBase, {
        baseClass: "mail-toolbar-image-picker",
        templateString: template,
        img: null,
        _$link: null,
        inputNode: null,
        isShow: false,
        show: function (x, y) {
            $(this.domNode).css({
                left: x,
                top: y
            }).show();
            this._focus();
            this.isShow = true;
            return this;
        },
        setImg: function (img) {
            this.img = img;
            this._$link = $(img).closest("a");
            if (this._$link.length) {
                this._value(this._$link.attr("href"));
            } else {
                this._value("");
            }
        },
        replace: function (html) {
            var rel = $(html).get(0);
            $(this.img).replaceWith(rel);
            this.setImg(rel);
            this.hide();
        },
        hide: function () {
            $(this.domNode).hide();
            this._setLinkHref();
            this.isShow = false;
            return this;
        },
        startup: function () {
            this.hide();
            return this;
        },
        _setLinkHref: function () {
            var val = this._value(), $img = $(this.img);
            if (this._$link) {
                if (val) {
                    if (!this._$link.length) {
                        $img.wrap("<a></a>");
                        this._$link = $img.closest("a");
                    }
                    this._$link.attr("href", val);
                } else {
                    this._$link.replaceWith($img);
                    this._$link = $img.closest("a");
                }
            }
        },
        _focus: function () {
            this.inputNode.focus();
        },
        _value: function (value) {
            if (value !== udf) {
                this.inputNode.value = value;
            } else {
                return this.inputNode.value;
            }
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.img;
            delete this.inputNode;
        }
    });
});
